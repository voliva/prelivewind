import { h } from 'preact';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { LWState } from '../redux/stateType';
import * as classnames from 'classnames';
import WindPlot from '../components/windPlot';
import './stationDetail.css';

const mapStateToProps = (state:LWState) => ({
    stationId: state.currentView.params
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
});

const StationDetail = (props) => {
    const nowDate = new Date();
    const now = Math.floor(nowDate.getTime() / 1000);
    return <div className={classnames('page-station-detail', props.className)}>
        <div class='section-title'>Ultimes 24 hores</div>
        <WindPlot
            stationId={props.stationId}
            endTime={now}
            startTime={now - 60*60*24}
            timeDiv={60*60*6}
            />
    </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(StationDetail);
