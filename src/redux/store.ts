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
    stationListSelectedTab: 'fav',
    stationList: [{
        id: '1',
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
        id: '2',
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

const store = createStore(livewind, initialState, compose(
    applyMiddleware(
        thunkMiddleware
    ),
    persistState()
));
export default store;