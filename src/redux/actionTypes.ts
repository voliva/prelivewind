import { NavigationView } from './actions';

enum ActionType {
    Navigation = 'Navigation',
    AcceptCookies = 'AcceptCookies',
    SwitchStationListSelectedTab = 'SwitchStationListSelectedTab'
}

interface BaseAction {
    type: ActionType;
}

interface Navigation extends BaseAction {
    type: ActionType.Navigation;
    view: NavigationView;
}
interface AcceptCookies extends BaseAction {
    type: ActionType.AcceptCookies
}
interface SwitchStationListSelectedTab extends BaseAction {
    type: ActionType.SwitchStationListSelectedTab;
    tabId: string;
}

type Action = SwitchStationListSelectedTab | AcceptCookies | Navigation;
export {ActionType, Action};