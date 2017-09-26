import StationModel from '../services/station';
import StationData from '../services/stationData';

interface LWState {
    currentView: NavigationView;
    hasAcceptedCookies: boolean;
    stationListSelectedTab: string;
    stationList: Station[];
}

enum NavigationView {
    StationList,
    StationDetail
}

interface Station extends StationModel {
    isFavorite: boolean;
    lastData: StationData;
}

export { LWState, Station, NavigationView }