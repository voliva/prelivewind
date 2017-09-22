import { ActionType, Action } from './actionTypes';

export enum NavigationView {
    SelectedStations,
    StationList,
    StationDetail
}

export function navigate(view:NavigationView):Action {
    return { type: ActionType.NavigationAction, view };
}