import { View } from './stateType';

enum ActionType {
    Navigation = 'Navigation',
    NavigationBack = 'NavigationBack',
    AcceptCookies = 'AcceptCookies',
    SwitchStationListSelectedTab = 'SwitchStationListSelectedTab'
}

interface BaseAction {
    type: ActionType;
}

interface Navigation extends BaseAction {
    type: ActionType.Navigation;
    view: View;
}
interface NavigationBack extends BaseAction {
    type: ActionType.NavigationBack;
}
interface AcceptCookies extends BaseAction {
    type: ActionType.AcceptCookies
}
interface SwitchStationListSelectedTab extends BaseAction {
    type: ActionType.SwitchStationListSelectedTab;
    tabId: string;
}

type Action = SwitchStationListSelectedTab | AcceptCookies | Navigation | NavigationBack;
export {ActionType, Action};