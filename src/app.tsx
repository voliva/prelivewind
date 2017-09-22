import { h, Component, render } from 'preact';
import { Dispatch } from 'redux';
import { connect, Provider } from 'preact-redux'
import SelectedStationsSummary from './selectedStations/summary';
import store from './redux/store';
import { NavigationView, navigate } from './redux/actions';
import { LWState } from './redux/stateType';

/*
enum MainView {
    SelectedStationsSummary,
    StationList
}

class PreLivewind extends Component<{}, {
    currentView: MainView
}> {
    constructor() {
        super();
        this.state = {
            currentView: MainView.SelectedStationsSummary
        }
    }
    render(props, state) {
        if(state.currentView == MainView.SelectedStationsSummary) {
            return <SelectedStationsSummary stations={['a','b','c']} />
        }else {
            return <div>WTF?</div>
        }
    }
}
*/

const mapStateToProps = (state:LWState) => ({
    currentView: state.currentView
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
    onStationListMenuClicked: () => {
        dispatch(navigate(NavigationView.StationList));
    }
});

const PreLivewind = ({currentView, onStationListMenuClicked}) => {
    switch(currentView) {
        case NavigationView.SelectedStations:
            return <SelectedStationsSummary stations={['a','b','c']} />;
        default:
            return <div>Unkown view :(</div>
    }
}

const App = connect(mapStateToProps, mapDispatchToProps)(PreLivewind);
render(<Provider store={store}>
    <App />
</Provider>, document.querySelector('#app'));
