import { h, render } from 'preact';
import { Dispatch } from 'redux';
import { connect, Provider } from 'preact-redux';
import SelectedStationsSummary from './selectedStations/summary';
import store from './redux/store';
import { NavigationView, acceptCookies } from './redux/actions';
import { LWState } from './redux/stateType';
import './app.css';
import Header from './header';
import CookiePolicy from './cookiePolicy';

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
    const stations = [{
        id:null,
        name:'Torredembarra',
        lastData: {
            timestamp: 0,
            wind: 10,
            gust: 12,
            direction: 275
        }
    },{
        id:null,
        name:'Altafulla',
        lastData: {
            timestamp: 0,
            wind: 9.13246565498,
            direction: 275
        }
    },{
        id:null,
        name:'Barcelona',
        lastData: {
            timestamp: 0,
            wind: 11,
            gust: 15
        }
    }];
    switch(currentView) {
        case NavigationView.SelectedStations:
            return <SelectedStationsSummary stations={stations} />;
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
