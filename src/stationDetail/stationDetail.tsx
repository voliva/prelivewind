import { h } from 'preact';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { LWState } from '../redux/stateType';
import * as classnames from 'classnames';

const mapStateToProps = (state:LWState) => ({
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
});

const StationDetail = (props) => {
    return <div className={classnames('page-station-detail', props.className)}>StationDetail</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(StationDetail);
