import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { LWState, NavigationViewEnum, View, Station } from './stateType';
import livewind from './reducers';
import urlMiddleware from './urlMiddleware';
import stateStorageMiddleware from './stateStorageMiddleware';

let currentView:View = {
    view: NavigationViewEnum.StationList
};
const viewStack:View[] = [];
const stationList:Station[] = window.localStorage.getItem('stationList') ?
    JSON.parse(window.localStorage.getItem('stationList')) : [];
const stationListSelectedTab = stationList
    .filter(s => s.isFavorite)
    .length ? 'fav' : 'all';

const currentPath = window.location.hash ?
    window.location.hash.slice(2).split('/')
    : ['stations'];
if(currentPath[0] === 'stations') {
    if(currentPath.length >= 2) {
        viewStack.push(currentView);
        currentView = {
            view: NavigationViewEnum.StationDetail,
            params: currentPath[1]
        }
    }
    if(currentPath.length >= 3 && currentPath[2] === 'plot') {
        viewStack.push(currentView);
        currentView = {
            view: NavigationViewEnum.PlotDetail,
            params: {
                id: currentPath[1]
            }
        }
    }
}

const initialState:LWState = {
    currentView,
    viewStack,
    hasAcceptedCookies: true,
    stationListSelectedTab, // Coulda move this into params, amiright?
    stationList: stationList,
    fetchStack: 0
}

const store = createStore(livewind, initialState, applyMiddleware(
    urlMiddleware,
    thunkMiddleware,
    stateStorageMiddleware
));
export default store;