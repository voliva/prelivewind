import { LWState, Station, View } from './stateType';
import { Action, ActionType } from './actionTypes';
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

function stationList(state:Station[] = null, action: Action):Station[] {
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