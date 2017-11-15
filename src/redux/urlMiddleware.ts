import { ActionType } from './actionTypes';
import { replaceViewStack } from './actions';
import { NavigationViewEnum, LWState, View } from './stateType';

const urlMiddleware = store => {
    const currentPath = window.location.hash ?
        window.location.hash.slice(2).split('/')
        : ['stations'];
    const serialisePath = () => `#/${currentPath.join('/')}`
    window.history.pushState(currentPath, null, serialisePath());

    window.onpopstate = (evt) => {
        currentPath.pop();
        if(currentPath.length > 0) {
            window.history.pushState(currentPath, null, serialisePath());
        }else {
            // We have no state to go back: Help the browser exit our page :/ (we did one pushState on startup)
            window.history.back();
        }
    }
return next => {
    window.onhashchange = (evt) => {
        const hashValue = window.location.hash.slice(2);
        const hashPath = hashValue.split('/');
        let currentView:View = null;
        const viewStack:View[] = [];
        if(hashPath[0] == 'stations') {
            switch(hashPath.length) {
                case 1:
                    currentView = {
                        view: NavigationViewEnum.StationList
                    };
                    break;
                case 2:
                    currentView = {
                        view: NavigationViewEnum.StationDetail,
                        params: hashPath[1]
                    };
                    viewStack.push({
                        view: NavigationViewEnum.StationList
                    });
                    break;
                case 3:
                    currentView = {
                        view: NavigationViewEnum.PlotDetail
                    };
                    viewStack.push({
                        view: NavigationViewEnum.StationList
                    });
                    viewStack.push({
                        view: NavigationViewEnum.StationDetail,
                        params: hashPath[1]
                    });
                    break;
            }
        }
        if(store.getState().currentView.view !== currentView.view) {
            next(replaceViewStack(currentView, viewStack));
        }
    }
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

        // This doesn't trigger onhashchange
        window.history.replaceState(currentPath, null, serialisePath());
    }
}}}

export default urlMiddleware;