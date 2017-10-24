import { Action, ActionType } from './actionTypes';
import { NavigationViewEnum, LWState } from './stateType';

const urlMiddleware = store => {
    const currentPath = window.location.hash ?
        window.location.hash.slice(2).split('/')
        : ['stations'];
    const serialisePath = () => `#/${currentPath.join('/')}`
    window.history.pushState(currentPath, null, serialisePath());

    window.onpopstate = (evt) => {
        console.log('popstate', evt);
        currentPath.pop();
        if(currentPath.length > 0) {
            window.history.pushState(currentPath, null, serialisePath());
        }else {
            // We have no state to go back: Help the browser exit our page :/ (we did one pushState on startup)
            window.history.back();
        }
    }
return next => {
    console.log('next');
return action => {
    next(action);
    const state:LWState = store.getState();

    if(action.type === ActionType.NavigationBack) {
        window.history.back();
    }else if(action.type === ActionType.Navigation) {
        const currentView = state.currentView;

        currentPath.length = 0;
        switch (currentView.view) {
            case NavigationViewEnum.StationList:
                currentPath.push('stations');
                break;
            case NavigationViewEnum.StationDetail:
                currentPath.push('stations');
                currentPath.push(currentView.params);
                break;
            case NavigationViewEnum.PlotDetail:
                currentPath.push('stations');
                currentPath.push(currentView.params.id);
                currentPath.push('plot');
                break;
        }

        window.history.replaceState(currentPath, null, serialisePath());
    }
}}}

export default urlMiddleware;