import { h, render } from 'preact';
import { Dispatch } from 'redux';
import { connect, Provider } from 'preact-redux';
import StationList from './stationList/stationList';
import store from './redux/store';
import { acceptCookies } from './redux/actions';
import { LWState,NavigationView } from './redux/stateType';
import './app.css';
import * as classnames from 'classnames';
import Header from './header';
import CookiePolicy from './cookiePolicy';
import StationDetail from './stationDetail/stationDetail';

const mapStateToProps = (state:LWState) => ({
    currentView: state.currentView,
    hasAcceptedCookies: state.hasAcceptedCookies
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
    onCookieDismiss: () => {
        dispatch(acceptCookies());
    }
});

const getView = (currentView:NavigationView) => {
    const className = classnames('livewind__page', {
    });
    switch(currentView) {
        case NavigationView.StationList:
            return <StationList className={className}/>;
        case NavigationView.StationDetail:
            return <StationDetail className={className}/>;
        default:
            return <div>Unkown view :(</div>
    }
}

const PreLivewind = ({currentView, hasAcceptedCookies, onCookieDismiss}) => {
    return <div className='livewind'>
        <Header />
        <div className='livewind__content'>
            { getView(currentView) }
        </div>
        {!hasAcceptedCookies && <CookiePolicy onDismiss={onCookieDismiss} /> }
    </div>
}

const app = document.querySelector('#app');
const splash = app.querySelector('.splash');
const App = connect(mapStateToProps, mapDispatchToProps)(PreLivewind);
render(<Provider store={store}>
    <App />
</Provider>, app, splash);
