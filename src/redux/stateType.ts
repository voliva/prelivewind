import StationModel from '../services/station';
import StationData from '../services/stationData';

interface LWState {
    currentView: View;
    viewStack: View[];
    hasAcceptedCookies: boolean;
    stationListSelectedTab: string;
    stationList: Station[];
    fetchStack: number;
}

interface View {
    view: NavigationViewEnum;
    params?: any;
}
enum NavigationViewEnum {
    StationList,
    StationDetail,
    PlotDetail
}

interface Station extends StationModel {
    isFavorite: boolean;
    lastData: StationData;
    data: StationData[];
}

export { LWState, Station, View, NavigationViewEnum }