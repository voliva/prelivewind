import { h, ComponentProps } from 'preact';
import Station from '../services/station';

interface StationLineProps extends ComponentProps<any> {
    station: Station
}
const StationLine = (props:StationLineProps) => {
    return <div {...props}>
        Line
    </div>;
}

export default StationLine;