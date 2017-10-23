import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import * as persistState from 'redux-localstorage'
import { LWState, NavigationViewEnum } from './stateType';
import livewind from './reducers';

const initialState:LWState = {
    currentView: {
        view: NavigationViewEnum.StationList
    },
    viewStack: [],
    hasAcceptedCookies: false,
    stationListSelectedTab: 'all',
    stationList: []
}

const store = createStore(livewind, initialState, compose(
    applyMiddleware(
        thunkMiddleware
    ),
    persistState()
));
export default store;