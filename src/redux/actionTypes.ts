import { NavigationView } from './actions';

enum ActionType {
    NavigationAction = 'NavigationAction',
    AddStationAction = 'AddStationAction'
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

type Action = NavigationAction | AddStationAction;
export {ActionType, Action, NavigationAction};