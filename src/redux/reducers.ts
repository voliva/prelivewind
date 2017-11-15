import { LWState, Station, View, NavigationViewEnum } from './stateType';
import { Action, ActionType, LoadableData } from './actionTypes';
import { combineReducers } from 'redux';
import { arrayFind, arrayMergeSortUniq } from '../utilities';
import * as reduceReducers from 'reduce-reducers';
import StationData from '../services/stationData';

function currentView(state:View = null, action: Action):View {
    switch(action.type) {
        case ActionType.Navigation:
            return action.view;
        case ActionType.ChangePlotDate:
            if(state.view === NavigationViewEnum.PlotDetail) {
                return {
                    view: state.view,
                    params: {
                        ...state.params,
                        time: {
                            start: action.startTime,
                            end: action.endTime,
                            value: action.timeValue
                        }
                    }
                }
            }
            break;
        case ActionType.FilterValueChanged:
            if(state.view === NavigationViewEnum.StationList) {
                return {
                    view: state.view,
                    params: action.value
                };
            }
            break;
        case ActionType.ReplaceNavigationStack:
            return action.currentView;
    }
    return state;
}

function hasAcceptedCookies(state:boolean = null, action: Action):boolean {
    if(action.type == ActionType.AcceptCookies) {
        return true;
    }
    return state;
}

function stationListSelectedTab(state:string = null, action: Action):string {
    if(action.type == ActionType.SwitchStationListSelectedTab) {
        return action.tabId;
    }
    return state;
}

function stationList(state:Station[] = null, action: Action):Station[] {
    if(action.type == ActionType.DataLoaded) {
        switch(action.dataToLoad) {
            case LoadableData.Stations:
                return action.data.map(s => {
                    const originalStation = arrayFind(state, v => v.id == s.id);
                    return {
                        ...s,
                        isFavorite: originalStation ? originalStation.isFavorite : false,
                        lastData: originalStation ? originalStation.lastData : null,
                        data: originalStation && originalStation.data ? originalStation.data : []
                    };
                });
            case LoadableData.LastData:
                const lastData:(StationData & {stationId: string})[] = action.data;
                return state.map(s => {
                    const originalLastData = s.lastData;
                    const newLastData = arrayFind(lastData, d => d.stationId == s.id);
                    let resultLastData = originalLastData;
                    if(originalLastData && newLastData) {
                        resultLastData = newLastData.timestamp > originalLastData.timestamp ?
                            newLastData :
                            (Object.keys(newLastData).length > Object.keys(originalLastData).length ?
                                newLastData :
                                originalLastData);
                    }else if(newLastData) {
                        resultLastData = newLastData;
                    }

                    return {
                        ...s,
                        lastData: resultLastData
                    };
                });
            case LoadableData.Data:
                const data:{stationId:string, data:StationData[]} = action.data;
                return state.map(s => ({
                    ...s,
                    data: s.id === data.stationId ?
                        arrayMergeSortUniq([data.data, s.data], d => d.timestamp)
                        : s.data
                }));
                // TODO (?) Cleanup data when it's getting too old? -> Else this might get too big!
        }
    }else if(action.type === ActionType.ToggleFavorito) {
        return state.map(s => ({
            ...s,
            isFavorite: s.id === action.stationId ? !s.isFavorite : s.isFavorite
        }));
    }
    return state;
}

function viewStack(state:View[] = [], action: Action):View[] {
    if(action.type == ActionType.ReplaceNavigationStack) {
        return action.stack;
    }
    return state;
}

function fetchStack(state:number = 0, action:Action):number {
    switch(action.type) {
        case ActionType.StartDataLoad:
            return state+1;
        case ActionType.DataLoadError:
        case ActionType.DataLoaded:
            return state-1;
    }
    return state;
}

export default reduceReducers(
    (state:LWState, action:Action) => {
        switch(action.type) {
            case ActionType.Navigation:
                return {
                    ...state,
                    viewStack: [...state.viewStack, state.currentView]
                };
            case ActionType.NavigationBack:
                const stackCpy = [...state.viewStack];
                const previousView = stackCpy.pop();
                return {
                    ...state,
                    currentView: previousView,
                    viewStack: stackCpy
                };
        }
        return state;
    },
    combineReducers({
        currentView,
        hasAcceptedCookies,
        stationListSelectedTab,
        stationList,
        viewStack,
        fetchStack
    }),
    (state:LWState, action:Action) => {
        return state;
    }
);