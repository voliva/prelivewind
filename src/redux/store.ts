import { compose, createStore } from 'redux';
import * as persistState from 'redux-localstorage'
import { LWState, NavigationViewEnum } from './stateType';
import livewind from './reducers';

const initialState:LWState = {
    currentView: {
        view: NavigationViewEnum.StationList
    },
    viewStack: [],
    hasAcceptedCookies: false,
    stationListSelectedTab: 'fav',
    stationList: [{
        id: null,
        name:'Torredembarra',
        isFavorite: true,
        country: {
            id: 1,
            name: 'España'
        },
        region: {
            id: 1,
            name: 'Tarragona'
        },
        lastData: {
            timestamp: 0,
            wind: 10,
            gust: 12,
            direction: 275
        }
    },{
        id: null,
        name:'Altafulla',
        isFavorite: true,
        country: {
            id: 1,
            name: 'España'
        },
        region: {
            id: 1,
            name: 'Tarragona'
        },
        lastData: {
            timestamp: 0,
            wind: 9.13246565498,
            direction: 275
        }
    },{
        id: null,
        name:'Barcelona',
        isFavorite: false,
        country: {
            id: 1,
            name: 'España'
        },
        region: {
            id: 2,
            name: 'Barcelona'
        },
        lastData: {
            timestamp: 0,
            wind: 11,
            gust: 15
        }
    }]
}

initialState.stationList = initialState.stationList
    .concat(initialState.stationList)
    .concat(initialState.stationList)
    .concat(initialState.stationList);

const store = createStore(livewind, initialState, compose(
    persistState()
));
export default store;