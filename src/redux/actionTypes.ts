import { NavigationView } from './actions';

enum ActionType {
    NavigationAction = 'NavigationAction',
    AddStationAction = 'AddStationAction',
    AcceptCookies = 'AcceptCookies',
    SwitchStationListSelectedTab = 'SwitchStationListSelectedTab'
}

interface BaseAction {
    type: ActionType;
}

interface NavigationAction extends BaseAction {
    type: ActionType.NavigationAction;
    view: NavigationView;
}
interface AddStationAction extends BaseAction {
    type: ActionType.AddStationAction;
    station: any; // TODO
}
interface AcceptCookies extends BaseAction {
    type: ActionType.AcceptCookies
}
interface SwitchStationListSelectedTab extends BaseAction {
    type: ActionType.SwitchStationListSelectedTab;
    tabId: string;
}

type Action = SwitchStationListSelectedTab | AcceptCookies | NavigationAction | AddStationAction;
export {ActionType, Action};