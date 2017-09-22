import { NavigationView } from './actions';
import { LWState } from './stateType';
import { Action, ActionType } from './actionTypes';
import { combineReducers } from 'redux';

function currentView(state:NavigationView = null, action: Action):NavigationView {
    switch(action.type) {
        case ActionType.NavigationAction:
            return action.view;
    }
    return state;
}

export default combineReducers({
    currentView
});