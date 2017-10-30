import { h, render, Component } from 'preact';
import { Dispatch } from 'redux';
import { connect, Provider } from 'preact-redux';
import StationList from './stationList/stationList';
import store from './redux/store';
import { acceptCookies, loadGeneralData, toggleFavorito, changePlotDate } from './redux/actions';
import { LoadableData } from './redux/actionTypes';
import { LWState, NavigationViewEnum, Station, View } from './redux/stateType';
import './app.css';
import * as classnames from 'classnames';
import Header from './header';
import CookiePolicy from './cookiePolicy';
import StationDetail from './stationDetail/stationDetail';
import PlotDetail from './plotDetail/plotDetail';
import Loader from './components/loader';

const mapStateToProps = (state:LWState) => {
    console.log(state);
    let stationId = null;
    switch (state.currentView.view) {
        case NavigationViewEnum.StationDetail:
            stationId = state.currentView.params;
            break;
        case NavigationViewEnum.PlotDetail:
            stationId = state.currentView.params.id;
            break;
    }
    const stationDetail = stationId && state.stationList.filter(s => s.id === stationId)[0];
    return {
        currentView: state.currentView,
        stationDetail,
        showLoader: state.fetchStack > 0
    };
}

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
    onCookieDismiss: () => {
        dispatch(acceptCookies());
    },
    loadAllData: () => {
        dispatch(loadGeneralData([LoadableData.Stations,LoadableData.LastData]));
    }
});

const getView = (currentView:NavigationViewEnum) => {
    const className = classnames('livewind__page', {
    });
    switch(currentView) {
        case NavigationViewEnum.StationList:
            return <StationList className={className} />;
        case NavigationViewEnum.StationDetail:
            return <StationDetail className={className} />;
        case NavigationViewEnum.PlotDetail:
            return <PlotDetail className={className} />
        default:
            return <div>Unkown view :(</div>
    }
}

class PreLivewind extends Component<any, any> {
    componentDidMount() {
        this.props.loadAllData()
    }
    render({currentView, stationDetail, onCookieDismiss, showLoader}) {
        const cv = currentView as View;
    
        return <div className='livewind'>
            <Header />
            <div className='livewind__content'>
                { getView(cv.view) }
            </div>
            {showLoader && <Loader />}
        </div>
    }
}

const app = document.querySelector('#app');
const splash = app.querySelector('.splash');
const App = connect(mapStateToProps, mapDispatchToProps)(PreLivewind);
const bootstrap = () => {
    render(<Provider store={store}>
        <App />
    </Provider>, app, splash);
}

// Promise polyfill
if((window as any).Promise == null) {
    const s = document.createElement('script');
    document.head.appendChild(s);
    s.onload = () => bootstrap();
    s.src = 'https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js';
    s.type = 'text/javascript';
}else {
    bootstrap();
}