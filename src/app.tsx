import { h, render, Component } from 'preact';
import { Dispatch } from 'redux';
import { connect, Provider } from 'preact-redux';
import StationList from './stationList/stationList';
import store from './redux/store';
import { acceptCookies, navigateBack, loadGeneralData, toggleFavorito, changePlotDate } from './redux/actions';
import { LoadableData } from './redux/actionTypes';
import { LWState, NavigationViewEnum, Station, View } from './redux/stateType';
import './app.css';
import * as classnames from 'classnames';
import Header from './header';
import CookiePolicy from './cookiePolicy';
import StationDetail from './stationDetail/stationDetail';
import PlotDetail from './plotDetail/plotDetail';

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
        hasAcceptedCookies: state.hasAcceptedCookies,
        viewStack: state.viewStack
    };
}

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
    onCookieDismiss: () => {
        dispatch(acceptCookies());
    },
    onBackClick: () => {
        dispatch(navigateBack());
    },
    onStarClick: (s:Station) => {
        dispatch(toggleFavorito(s.id));
    },
    loadAllData: () => {
        dispatch(loadGeneralData([LoadableData.Stations,LoadableData.LastData]));
    },
    onDateClick: (s:Station, startTime:number, endTime:number) => {
        dispatch(changePlotDate(s.id, startTime, endTime));
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
    render({currentView, stationDetail, viewStack, hasAcceptedCookies, onCookieDismiss, onBackClick, onStarClick, onDateClick}) {
        const headerTitle = stationDetail ? stationDetail.name : 'Livewind';
        
        const cv = currentView as View;
        const starButtonState = cv.view === NavigationViewEnum.StationDetail
            ? (stationDetail.isFavorite ? 'active' : 'default')
            : null;
        const onHeaderDateClick = cv.view === NavigationViewEnum.PlotDetail
            ? (dir => {
                const currentDate = cv.params.time ? new Date(cv.params.time.start * 1000) : new Date();
                const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (dir === 'right' ? 1 : -1));
                const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (dir === 'right' ? 2 : 0));
                onDateClick(stationDetail, targetDate.getTime() / 1000, nextDate.getTime() / 1000);
            })
            : null;
    
        return <div className='livewind'>
            <Header
                title={headerTitle}
                hasBackButton={viewStack.length > 0}
                onBackClick={onBackClick}
                starButtonState={starButtonState}
                onStarClick={() => onStarClick(stationDetail)}
                onDateClick={onHeaderDateClick} />
            <div className='livewind__content'>
                { getView(cv.view) }
            </div>
            {!hasAcceptedCookies && <CookiePolicy onDismiss={onCookieDismiss} /> }
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

if((window as any).Promise == null) {
    const s = document.createElement('script');
    document.head.appendChild(s);
    s.onload = () => bootstrap();
    s.src = 'https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js';
    s.type = 'text/javascript';
}else {
    bootstrap();
}