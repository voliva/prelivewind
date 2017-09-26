import { NavigationView } from './actions';
import { LWState, Station } from './stateType';
import { Action, ActionType } from './actionTypes';
import { combineReducers } from 'redux';

function currentView(state:NavigationView = null, action: Action):NavigationView {
    switch(action.type) {
        case ActionType.NavigationAction:
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

export default combineReducers({
    currentView,
    hasAcceptedCookies,
    stationListSelectedTab,
    stationList
});