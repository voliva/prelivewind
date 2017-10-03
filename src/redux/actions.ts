import { ActionType, Action } from './actionTypes';
import { NavigationViewEnum } from './stateType';

export function navigate(view:NavigationViewEnum, params:any):Action {
    return { type: ActionType.Navigation, view: {
        view,
        params
    }};
}
export function navigateBack():Action {
    return { type: ActionType.NavigationBack };
}
export function acceptCookies():Action {
    return { type: ActionType.AcceptCookies };
}
export function switchStationListSelectedTab(tabId:string):Action {
    return { type: ActionType.SwitchStationListSelectedTab, tabId };
}