import { NavigationView } from './actions';

enum ActionType {
    NavigationAction = 'NavigationAction',
    AddStationAction = 'AddStationAction',
    AcceptCookies = 'AcceptCookies'
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

type Action = AcceptCookies | NavigationAction | AddStationAction;
export {ActionType, Action, NavigationAction};