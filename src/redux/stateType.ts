import StationModel from '../services/station';
import StationData from '../services/stationData';

interface LWState {
    currentView: View;
    viewStack: View[];
    hasAcceptedCookies: boolean;
    stationListSelectedTab: string;
    stationList: Station[];
}

interface View {
    view: NavigationViewEnum;
    params?: any;
}
enum NavigationViewEnum {
    StationList,
    StationDetail
}

interface Station extends StationModel {
    isFavorite: boolean;
    lastData: StationData;
}

export { LWState, Station, View, NavigationViewEnum }