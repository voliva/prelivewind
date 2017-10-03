import { h, render } from 'preact';
import { Dispatch } from 'redux';
import { connect, Provider } from 'preact-redux';
import StationList from './stationList/stationList';
import store from './redux/store';
import { acceptCookies, navigateBack } from './redux/actions';
import { LWState, NavigationViewEnum } from './redux/stateType';
import './app.css';
import '../node_modules/typicons.font/src/font/typicons.css';
import * as classnames from 'classnames';
import Header from './header';
import CookiePolicy from './cookiePolicy';
import StationDetail from './stationDetail/stationDetail';

const mapStateToProps = (state:LWState) => console.log(state) || ({
    currentView: state.currentView,
    hasAcceptedCookies: state.hasAcceptedCookies,
    viewStack: state.viewStack
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
    onCookieDismiss: () => {
        dispatch(acceptCookies());
    },
    onBackClick: () => {
        dispatch(navigateBack());
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

const PreLivewind = ({currentView, viewStack, hasAcceptedCookies, onCookieDismiss, onBackClick}) => {
    const headerTitle = currentView.view === NavigationViewEnum.StationDetail ?
        currentView.params.name : 'Livewind';

    return <div className='livewind'>
        <Header
            title={headerTitle}
            hasBackButton={viewStack.length > 0}
            onBackClick={onBackClick} />
        <div className='livewind__content'>
            { getView(currentView.view) }
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
