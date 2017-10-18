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
    web: {
        name: string,
        url: string
    };
    lastData?: StationData; // TODO remove?
}

export default Station