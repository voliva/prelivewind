import { ActionType, Action, LoadableData } from './actionTypes';
import { NavigationViewEnum, View } from './stateType';
import {dateToString} from '../utilities';
import * as fetch from 'isomorphic-fetch';

export function navigate(view:NavigationViewEnum, params:any):Action {
    return { type: ActionType.Navigation, view: {
        view,
        params
    }};
}
export function navigateBack():Action {
    return { type: ActionType.NavigationBack };
}
export function acceptCookies():Action {
    return { type: ActionType.AcceptCookies };
}
export function switchStationListSelectedTab(tabId:string):Action {
    return { type: ActionType.SwitchStationListSelectedTab, tabId };
}
export function toggleFavorito(stationId:string): Action {
    return { type: ActionType.ToggleFavorito, stationId };
}
export function changeFilterValue(value:string): Action {
    return { type: ActionType.FilterValueChanged, value };
}
export function replaceViewStack(currentView: View, stack: View[]): Action {
    return { type: ActionType.ReplaceNavigationStack, currentView, stack };
}

function startLoad(dataToLoad:LoadableData): Action {
    return { type: ActionType.StartDataLoad, dataToLoad };
}
function endLoad<T>(dataToLoad:LoadableData, data:T): Action {
    return {
        type: ActionType.DataLoaded,
        data,
        dataToLoad
    };
}
function loadError(dataToLoad:LoadableData, error:string): Action {
    return { type: ActionType.DataLoadError, error, dataToLoad };
}

let sessionId:string|number = localStorage.getItem('sessionId');
if(sessionId) {
    try {
        sessionId = JSON.parse(sessionId);
    }catch(ex) {}
}
if(!sessionId) {
    sessionId = Math.floor(Math.random()*(1 << 30));
}
const platform = (window as any).__lwPlatform || 'N_A';


const runningInDevMode = true;
const baseUrl = runningInDevMode ? "mocks" : "https://livewind.freemyip.com";

const stationsFileUrl = `${baseUrl}/stations.csv`;
const lastDataUrl:() => string = runningInDevMode ?
    () => `${baseUrl}/lastData.json` :
    () => `${baseUrl}/api/query?version=1&lastData=all&sessionId=${sessionId}&platform=${platform}`;
const stationDataUrl:(stationId:number|string, startTime:number, endTime:number) => string = runningInDevMode ?
    (_, _2, _3) => `${baseUrl}/stationData.json` :
    (stationId:number|string, startTime:number, endTime:number) => `${baseUrl}/api/query?version=1&lastData=${stationId}&windData=${stationId};${startTime};${endTime}&sessionId=${sessionId}&platform=${platform}`;

export function loadGeneralData(dataToLoad:LoadableData[]):(dispatch) => void {
    return (dispatch) => {
        dataToLoad.forEach(req => {
            dispatch(startLoad(req));

            switch(req) {
                case LoadableData.Stations:
                    fetch(stationsFileUrl)
                        .then(res => {
                            if(res.ok) {
                                return res.text()
                            }else {
                                return Promise.reject(res);
                            }
                        })
                        .then((csv:string) => {
                            const table = parseCSV(csv);
                            const header = table[0];

                            return table.slice(1).map(d => {
                                const obj = {};
                                header.forEach((h,i) => obj[h] = d[i]);
                                return obj;
                            });
                        })
                        .then(result => dispatch(endLoad(req, result
                            .filter(d => d.IsActive != '0')
                            .map(d => console.log(d) || d)
                            .map(d => ({
                                id: d.Id,
                                name: d.Nom,
                                country: {
                                    id: d.Pais,
                                    name: d.Pais
                                },
                                region: {
                                    id: d.Regio,
                                    name: d.Regio
                                },
                                web: {
                                    name: d.Nom_Empresa,
                                    url: d.Web
                                }
                            }))
                        )));
                    break;
                case LoadableData.LastData:
                    fetch(lastDataUrl())
                        .then(res => res.json())
                        .then(data => parseJSONTable(data.lastData))
                        .then(data => dispatch(endLoad(req, data)));
                    break;
                default:
                    console.warn('Load data not implemented', req);
                    dispatch(loadError(req, 'Load data not implemented'));
                    break;
            }
        });
    };
}

export function loadCurrentStationData(stationId:string):(dispatch) => void {
    return dispatch => {
        dispatch(startLoad(LoadableData.Data));
        dispatch(startLoad(LoadableData.LastData));
        const now = Math.floor(new Date().getTime() / 1000);
        fetch(stationDataUrl(stationId, now - 60*60*24, now))
            .then(res => res.json())
            .then(data => {
                return {
                    lastData: parseJSONTable(data.lastData),
                    data: parseJSONTable(data.windData)
                }
            })
            .then(data => {
                dispatch(endLoad(LoadableData.LastData, data.lastData));
                dispatch(endLoad(LoadableData.Data, {
                    stationId: stationId,
                    data: data.data
                }));
            });
    }
}

export function changePlotDate(stationId:string, startTime:number, endTime:number):(dispatch) => void {
    return dispatch => {
        dispatch({type: ActionType.ChangePlotDate, startTime, endTime, timeValue: dateToString(new Date(startTime * 1000))});
        dispatch(startLoad(LoadableData.Data));
        fetch(stationDataUrl(stationId, startTime, endTime))
            .then(res => res.json())
            .then(data => parseJSONTable(data.windData))
            .then(data => dispatch(endLoad(LoadableData.Data, {
                stationId: stationId,
                data
            })));
    };
}

function parseCSV(csv:string):string[][] {
    function parseLine(line:string):string[] {
        const ret = [];
        while(line.length > 0) {
            const nextSplit = line.charAt(0) === '"' ? line.indexOf('",') : line.indexOf(',');
            
            if(nextSplit < 0) {
                ret.push(line.trim()
                    .replace(/^"/, '')
                    .replace(/"$/, '')); // Fails if some value finishes with \"
                line = '';
            }else {
                const value = line.slice(0, nextSplit);
                ret.push(value.trim()
                    .replace(/^"/, '')
                    .replace(/"$/, '')); // Fails if some value finishes with \"
                line = line.slice(line.charAt(0) === '"' ? nextSplit+2 : nextSplit+1);
            }
        }
        return ret;
    }
    return csv.split('\n')
        .map(l => parseLine(l.trim()));
}

function parseJSONTable<T>(table:any[][]):T[] {
    const header = table[0];
    return table.slice(1).map(d => {
        const obj:T = {} as T;
        header.forEach((h,i) => obj[h] = d[i]);
        return obj;
    }).map(d => {
        if(runningInDevMode && (d as any).timestamp) {
            (d as any).timestamp += (new Date().getTime() - 1518260755798) / (60 * 1000)
        }
        return d;
    });
}