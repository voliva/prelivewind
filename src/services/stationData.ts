interface StationData {
    timestamp: number,
    wind?: number,
    gust?: number,
    direction?: number,
    temperature?: number,
    humidity?: number,
    pressure?: number,
    rain?: number
}

export default StationData;