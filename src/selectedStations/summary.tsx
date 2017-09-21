import { h, Component } from 'preact';

export default class SelectedStationsSummary extends Component<{
    stations: string[]
}, {}> {

    constructor() {
        super();
    }

    render(state) {
        return <p>
            {state.stations.map(s => <div>{s}</div>)}
        </p>
    }
}