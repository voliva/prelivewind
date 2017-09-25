import { h, ComponentProps } from 'preact';
import './stationSummary.css';
import Station from '../services/station';

interface StationSummaryProps extends ComponentProps<any> {
    station: Station
}
const StationSummary = (props:StationSummaryProps) => {
    return <div {...props}>
        Summary
    </div>;
}

export default StationSummary;