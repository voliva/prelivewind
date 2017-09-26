import { ActionType, Action } from './actionTypes';

export enum NavigationView {
    SelectedStations,
    StationList,
    StationDetail
}

export function navigate(view:NavigationView):Action {
    return { type: ActionType.NavigationAction, view };
}
export function acceptCookies():Action {
    return { type: ActionType.AcceptCookies };
}
export function switchStationListSelectedTab(tabId:string):Action {
    return { type: ActionType.SwitchStationListSelectedTab, tabId };
}