import { h } from 'preact';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { LWState, NavigationView, TransitionState } from '../redux/stateType';
import { stepTransition } from '../redux/actions';
import * as classnames from 'classnames';

const mapStateToProps = (state:LWState) => ({
    hasToEnter:
        state.transitioningView &&
        state.transitioningView.view === NavigationView.StationDetail &&
        state.transitioningView.transitionState === TransitionState.Enter
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
    enterViewport: () => dispatch(stepTransition(NavigationView.StationDetail, TransitionState.Transition))
});

const StationDetail = (props) => {
console.log(props)
    // TODO move into componentmounted
    if(props.hasToEnter) {
        console.log('trigger');
        requestAnimationFrame(props.enterViewport);
    }

    return <div className={classnames('page-station-detail', props.className)}>StationDetail</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(StationDetail);
