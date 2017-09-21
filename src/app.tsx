import { h, Component, render } from 'preact';
import SelectedStationsSummary from './selectedStations/summary';

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

render(<PreLivewind />, document.querySelector('#app'));