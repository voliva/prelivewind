import { View } from './stateType';

enum ActionType {
    Navigation = 'Navigation',
    NavigationBack = 'NavigationBack',
    AcceptCookies = 'AcceptCookies',
    SwitchStationListSelectedTab = 'SwitchStationListSelectedTab',
    LoadStationsFile = 'LoadStationsFile',
    StartDataLoad = 'StartDataLoad',
    DataLoaded = 'DataLoaded',
    DataLoadError = 'DataLoadError',
    ToggleFavorito = 'ToggleFavorito',
    ChangePlotDate = 'ChangePlotDate',
    FilterValueChanged = 'FilterValueChanged'
}
enum LoadableData {
    Stations,
    LastData,
    Data
}

interface BaseAction {
    type: ActionType;
}
interface GenericAction {
    type:
        ActionType.NavigationBack | 
        ActionType.AcceptCookies |
        ActionType.LoadStationsFile
}
interface Navigation extends BaseAction {
    type: ActionType.Navigation;
    view: View;
}
interface ToggleFavorito extends BaseAction {
    type: ActionType.ToggleFavorito;
    stationId: string;
}
interface StartDataLoad extends BaseAction {
    type: ActionType.StartDataLoad,
    dataToLoad: LoadableData,
}
interface DataLoaded<T> extends BaseAction {
    type: ActionType.DataLoaded,
    dataToLoad: LoadableData,
    data: T
}
interface DataLoadError extends BaseAction {
    type: ActionType.DataLoadError,
    dataToLoad: LoadableData,
    error: string
}
interface SwitchStationListSelectedTab extends BaseAction {
    type: ActionType.SwitchStationListSelectedTab;
    tabId: string;
}
interface ChangePlotDate extends BaseAction {
    type: ActionType.ChangePlotDate;
    startTime: number;
    endTime: number;
    timeValue: string
}
interface FilterValueChanged extends BaseAction {
    type: ActionType.FilterValueChanged;
    value: string;
}

type Action = GenericAction | SwitchStationListSelectedTab | Navigation
    | DataLoaded<any> | DataLoadError | StartDataLoad | ToggleFavorito | ChangePlotDate
    | FilterValueChanged;
export {ActionType, Action, LoadableData};