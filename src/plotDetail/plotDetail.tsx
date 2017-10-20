import { h, Component, ComponentProps } from 'preact';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { LWState, Station } from '../redux/stateType';
import * as classnames from 'classnames';
import WindPlot from '../components/windPlot';
import Button from '../components/button';
import './plotDetail.css';
import {arrayFind, timeToString} from '../utilities';
import { loadCurrentStationData } from '../redux/actions';
import StationData from '../services/stationData';
import {calculateCanvasSize, dateToString} from '../utilities';

interface PlotDetailStateProps {
    station: Station;
    timeStart: number;
    timeEnd: number;
    timeValue: string;
}
interface PlotDetailDispatchProps {
    // loadCurrentStationData: (stationId:string) => void;
}
interface PlotDetailProps extends PlotDetailStateProps, PlotDetailDispatchProps {
    className?: string;
}
interface PlotViewParams {
    id: string;
    time?: {
        start: number,
        end: number,
        value: string
    };
}

const mapStateToProps = (state:LWState):PlotDetailStateProps => {
    const params:PlotViewParams = state.currentView.params;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    return {
        station: arrayFind(state.stationList, s => s.id === params.id),
        timeStart: params.time ? params.time.start : today.getTime() / 1000,
        timeEnd: params.time ? params.time.end : tomorrow.getTime() / 1000,
        timeValue: params.time ? params.time.value : dateToString(today)
    };
}
const mapDispatchToProps = (dispatch:Dispatch<LWState>):PlotDetailDispatchProps => ({
    // loadCurrentStationData: (stationId:string) => dispatch(loadCurrentStationData(stationId))
});

const headerSize = 40;
const canvasSize = calculateCanvasSize(
    6/5,
    (window.innerHeight - headerSize) * 0.95,
    680);
class PlotDetail extends Component<PlotDetailProps, {}> {
    componentDidMount() {
    }

    render(props:PlotDetailProps){
        console.log(props);
        return <div className={classnames('page-plot-detail', props.className)}>
            <div className='plot-detail__date'>{props.timeValue}</div>
            <WindPlot
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
                endTime={props.timeEnd}
                startTime={props.timeStart}
                data={props.station.data}
                />
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlotDetail);
