import { NavigationView } from './actions';

interface LWState {
    currentView?: NavigationView,
    hasAcceptedCookies?: boolean
}

export { LWState }