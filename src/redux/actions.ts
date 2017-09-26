import { ActionType, Action } from './actionTypes';
import { NavigationView } from './stateType';

export function navigate(view:NavigationView):Action {
    return { type: ActionType.Navigation, view };
}
export function acceptCookies():Action {
    return { type: ActionType.AcceptCookies };
}
export function switchStationListSelectedTab(tabId:string):Action {
    return { type: ActionType.SwitchStationListSelectedTab, tabId };
}