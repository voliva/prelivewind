import { h } from 'preact';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { LWState, Station } from '../redux/stateType';
import { switchStationListSelectedTab } from '../redux/actions';
import StationLine from './stationLine';
import TabStrip from '../components/tabStrip';
import './stationList.css';

interface SelectedStationsSummaryProps {
    stations: Station[],
    selectedTabId: string,
    switchSelectedTab: (tabId:string) => void;
}

const mapStateToProps = (state:LWState) => ({
    stations: state.stationList,
    selectedTabId: state.stationListSelectedTab
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
    switchSelectedTab: (tabId:string) => {
        dispatch(switchStationListSelectedTab(tabId));
    }
});

const tabs = [{
    id: 'fav',
    title: 'Favoritas'
},{
    id: 'all',
    title: 'Todas'
}];

const SelectedStationsSummary = (props: SelectedStationsSummaryProps) => {
    const stationList = props.selectedTabId === 'fav' ?
        props.stations.filter(s => s.isFavorite) : props.stations

    return <div>
        <TabStrip tabs={tabs} selectedTabId={props.selectedTabId} onTabSelected={props.switchSelectedTab} />
        {stationList
            .map(s => <StationLine station={s} />)}
    </div>
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedStationsSummary);
