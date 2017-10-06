import { ActionType, Action, LoadableData } from './actionTypes';
import { NavigationViewEnum } from './stateType';
import Station from '../services/station';
import * as Papa from 'papaparse';
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
                    Papa.parse('/stations.csv', {
                        download: true,
                        header: true,
                        complete: (result) => {
                            dispatch(endLoad(req, result.data.map(d => ({
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
                            }))));
                        },
                        error: (err) => {
                            dispatch(loadError(req, err))
                        }
                    });
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