import { ActionType, Action, LoadableData } from './actionTypes';
import { NavigationViewEnum } from './stateType';
import Station from '../services/station';
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

export function loadGeneralData(dataToLoad:LoadableData[]):(dispatch) => void {
    return (dispatch) => {
        dataToLoad.forEach(req => {
            dispatch(startLoad(req));

            switch(req) {
                case LoadableData.Stations:
                    fetch('/stations.csv')
                        .then(res => res.text())
                        .then((csv:string) => {
                            const table = parseCSV(csv);
                            const header = table[0];

                            return table.slice(1).map(d => {
                                const obj = {};
                                header.forEach((h,i) => obj[h] = d[i]);
                                return obj;
                            });
                        })
                        .then(result => dispatch(endLoad(req, result.map(d => ({
                            id: d.Id,
                            name: d.Nom,
                            country: {
                                id: d.Pais,
                                name: d.Pais
                            },
                            region: {
                                id: d.Regio,
                                name: d.Regio
                            }
                        })))));
                    break;
                case LoadableData.LastData:
                    fetch('https://livewind.freemyip.com/api/query?version=1&lastData=all')
                        .then(res => res.json())
                        .then(data => {
                            const lastData:any[] = data.lastData;
                            const header = lastData[0];
                            return lastData.slice(1).map(d => {
                                const obj = {};
                                header.forEach((h,i) => obj[h] = d[i]);
                                return obj;
                            });
                        })
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