import StationData from './stationData';

interface Station {
    id: string;
    name: string;
    country: {
        id: string|number,
        name: string
    };
    region: {
        id: string|number,
        name: string
    };
    lastData?: StationData;
}

export default Station