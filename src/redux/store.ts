import { compose, createStore } from 'redux';
import * as persistState from 'redux-localstorage'
import { LWState } from './stateType';
import { NavigationView } from './actions';
import livewind from './reducers';

const initialState:LWState = {
    currentView: NavigationView.SelectedStations,
    hasAcceptedCookies: false
}

const store = createStore(livewind, initialState, compose(
    persistState()
));
export default store;