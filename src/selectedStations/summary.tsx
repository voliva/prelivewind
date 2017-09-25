import { h, Component } from 'preact';
import {
    AccordionList,
    AccordionListItem
} from '../components/accordionList';
import StationSummary from './stationSummary';
import StationLine from './stationLine';
import Station from '../services/station';

interface SelectedStationsSummaryProps {
    stations: Station[]
}

export default class SelectedStationsSummary extends Component<SelectedStationsSummaryProps, {}> {

    constructor() {
        super();
    }

    render(props:SelectedStationsSummaryProps) {
        const items:AccordionListItem[] = props.stations.map(s => ({
            header: <StationLine station={s} />,
            body: <StationSummary station={s} />
        }));
        return <AccordionList items={items} />
    }
}