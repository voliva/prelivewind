import { h, render, Component } from 'preact';
import { Dispatch } from 'redux';
import { connect, Provider } from 'preact-redux';
import StationList from './stationList/stationList';
import store from './redux/store';
import { acceptCookies, navigateBack, loadGeneralData, toggleFavorito } from './redux/actions';
import { LoadableData } from './redux/actionTypes';
import { LWState, NavigationViewEnum, Station } from './redux/stateType';
import './app.css';
import * as classnames from 'classnames';
import Header from './header';
import CookiePolicy from './cookiePolicy';
import StationDetail from './stationDetail/stationDetail';

const mapStateToProps = (state:LWState) => console.log(state) || ({
    currentView: state.currentView,
    stationDetail: (state.currentView.view === NavigationViewEnum.StationDetail) ?
        state.stationList.filter(s => s.id === state.currentView.params)[0] : null,
    hasAcceptedCookies: state.hasAcceptedCookies,
    viewStack: state.viewStack
});

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
    }
});

const getView = (currentView:NavigationViewEnum) => {
    const className = classnames('livewind__page', {
    });
    switch(currentView) {
        case NavigationViewEnum.StationList:
            return <StationList className={className}/>;
        case NavigationViewEnum.StationDetail:
            return <StationDetail className={className}/>;
        default:
            return <div>Unkown view :(</div>
    }
}

class PreLivewind extends Component<any, any> {
    componentDidMount() {
        this.props.loadAllData()
    }
    render({currentView, stationDetail, viewStack, hasAcceptedCookies, onCookieDismiss, onBackClick, onStarClick}) {
        const headerTitle = stationDetail ? stationDetail.name : 'Livewind';
        
        const starButtonState = stationDetail
            ? (stationDetail.isFavorite ? 'active' : 'default')
            : null;
    
        return <div className='livewind'>
            <Header
                title={headerTitle}
                hasBackButton={viewStack.length > 0}
                onBackClick={onBackClick}
                starButtonState={starButtonState}
                onStarClick={() => onStarClick(stationDetail)} />
            <div className='livewind__content'>
                { getView(currentView.view) }
            </div>
            {!hasAcceptedCookies && <CookiePolicy onDismiss={onCookieDismiss} /> }
        </div>
    }
}

const app = document.querySelector('#app');
const splash = app.querySelector('.splash');
const App = connect(mapStateToProps, mapDispatchToProps)(PreLivewind);
render(<Provider store={store}>
    <App />
</Provider>, app, splash);

