import { h, Component, ComponentProps } from 'preact';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { LWState, Station, NavigationViewEnum } from '../redux/stateType';
import * as classnames from 'classnames';
import WindPlot from '../components/windPlot';
import Button from '../components/button';
import './stationDetail.css';
import {arrayFind, timeToString, calculateCanvasSize} from '../utilities';
import { loadCurrentStationData, navigate } from '../redux/actions';
import StationData from '../services/stationData';

interface StationDetailStateProps {
    station: Station;
}
interface StationDetailDispatchProps {
    loadCurrentStationData: (stationId:string) => void;
    onPlotClick: (stationId:string) => void;
}
interface StationDetailProps extends StationDetailStateProps, StationDetailDispatchProps {
    className?: string;
}

const mapStateToProps = (state:LWState):StationDetailStateProps => {
    return {
        station: arrayFind(state.stationList, s => s.id === state.currentView.params)
    };
}

const mapDispatchToProps = (dispatch:Dispatch<LWState>):StationDetailDispatchProps => ({
    loadCurrentStationData: (stationId:string) => dispatch(loadCurrentStationData(stationId)),
    onPlotClick: (stationId:string) => {
        dispatch(navigate(NavigationViewEnum.PlotDetail, {
            id: stationId
        }));
    },
});

const dataPropMap = {
    wind: {
        translation: 'Vent',
        unit: 'Knts',
    },
    gust: {
        translation: 'Ratxa',
        unit: 'Knts',
    },
    direction: {
        translation: 'Direcció',
        unit: 'º',
    },
    temperature: {
        translation: 'Temperatura',
        unit: 'ºC',
    },
    humidity: {
        translation: 'Humitat',
        unit: '%',
    },
    pressure: {
        translation: 'Presió',
        unit: 'hPa',
    },
    rain: {
        translation: 'Pluja',
        unit: 'mm',
    }
}

const canvasSize = calculateCanvasSize(6/5, window.innerWidth * 0.95, 400);
class StationDetail extends Component<StationDetailProps, {}> {
    componentDidMount() {
        this.props.loadCurrentStationData(this.props.station.id)
    }

    render(props:StationDetailProps){
        const nowDate = new Date();
        const now = Math.floor(nowDate.getTime() / 1000);

        const lastDataTableRows = props.station.lastData ? Object
            .keys(props.station.lastData)
            .filter(p => p != 'timestamp' &&
                p != 'stationId' && 
                p != 'id' &&
                props.station.lastData[p] != null)
            .map(p => ({
                ...dataPropMap[p],
                value: props.station.lastData[p],
                orig: p
            }))
            : [];

        return <div className={classnames('page-station-detail', props.className)}>
            <div class='section-title'>Últimes 24 hores</div>
            <WindPlot
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                endTime={now}
                startTime={now - 60*60*24}
                data={props.station.data}
                onClick={() => props.onPlotClick(props.station.id)}
                />
            
            <div class='section-title'>Últimes dades - { props.station.lastData ?
                timeToString(new Date(props.station.lastData.timestamp*1000)) :
                'N/A' }
            </div>
            { lastDataTableRows.length ? 
                <div class='section-table'>
                    {lastDataTableRows.map(ld => <div class='section-row'>
                        <div class='section-cell section-cell__label'>{ld.translation}</div>
                        <div class='section-cell'>{ld.value}{ld.unit}</div>
                    </div>)}
                </div>
            : <div>No hi ha dades recents</div>}

            <Button 
                onClick={() => props.onPlotClick(props.station.id)}
                text='Grafic del dia' />
            <Button 
                onClick={this.visitWeb}
                text={props.station.web && props.station.web.name} />
        </div>
    }

    visitWeb = () => {
        this.props.station.web && window.open(this.props.station.web.url, '_blank');
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StationDetail);
