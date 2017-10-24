import { Action, ActionType } from './actionTypes';
import { NavigationViewEnum, LWState, Station } from './stateType';

const stateStorageMiddleware = store => next => action => {
    next(action);
    const state:LWState = store.getState();
    
    const dataLessStations:Station[] = state.stationList.map(s => ({
        ...s,
        lastData: null,
        data: []
    }));
    window.localStorage.setItem('stationList', JSON.stringify(dataLessStations));
}

export default stateStorageMiddleware;