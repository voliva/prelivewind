import { createStore } from 'redux';
import { LWState } from './stateType';
import { NavigationView } from './actions';
import livewind from './reducers';

const initialState:LWState = {
    currentView: NavigationView.SelectedStations
}

const store = createStore(livewind, initialState);
export default store;