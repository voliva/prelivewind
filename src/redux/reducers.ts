import { LWState, Station, View } from './stateType';
import { Action, ActionType, LoadableData } from './actionTypes';
import { combineReducers } from 'redux';
import * as reduceReducers from 'reduce-reducers';

function currentView(state:View = null, action: Action):View {
    switch(action.type) {
        case ActionType.Navigation:
            return action.view;
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

const arrayFind = function<T>(arr:T[], fn:(v:T) => boolean):T {
    return arr.filter(v => fn(v))[0] || null;
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
                        lastData: originalStation ? originalStation.lastData : null
                    };
                });
            case LoadableData.LastData:
                const lastData:any[] = action.data;
                return state.map(s => ({
                    ...s,
                    lastData: arrayFind(lastData, d => d.stationId == s.id)
                }));
        }
    }
    return state;
}

function viewStack(state:View[] = [], action: Action):View[] {
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
        viewStack
    }),
    (state:LWState, action:Action) => {
        return state;
    }
);