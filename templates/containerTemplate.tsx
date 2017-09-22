import { h } from 'preact';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { LWState } from './redux/stateType';

const mapStateToProps = (state:LWState) => ({
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
});

const Template = ({}) => {
    <div>Template</div>
}

export default connect(mapStateToProps, mapDispatchToProps)(Template);
