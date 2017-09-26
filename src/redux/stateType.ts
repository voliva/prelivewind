import { NavigationView } from './actions';
import StationModel from '../services/station';
import StationData from '../services/stationData';

interface LWState {
    currentView: NavigationView,
    hasAcceptedCookies: boolean,
    stationListSelectedTab: string
    stationList: Station[]
}

interface Station extends StationModel {
    isFavorite: boolean;
    lastData: StationData;
}

export { LWState, Station }