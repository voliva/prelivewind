import { h, Component } from 'preact';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { LWState, Station, NavigationViewEnum } from '../redux/stateType';
import { switchStationListSelectedTab, navigate, toggleFavorito } from '../redux/actions';
import StationLine from './stationLine';
import TabStrip from '../components/tabStrip';
import './stationList.css';
import * as classnames from 'classnames';

interface SelectedStationsSummaryProps {
    stations: Station[],
    selectedTabId: string,
    switchSelectedTab: (tabId:string) => void;
    onStationClick: (s:Station) => void;
    onStarClick: (s:Station) => void;
    className?: string;
}

const mapStateToProps = (state:LWState) => ({
    stations: state.stationList,
    selectedTabId: state.stationListSelectedTab
});

const mapDispatchToProps = (dispatch:Dispatch<LWState>) => ({
    switchSelectedTab: (tabId:string) => {
        dispatch(switchStationListSelectedTab(tabId));
    },
    onStationClick: (s:Station) => {
        const scrollPos = document.querySelector('.page-station-list').scrollTop;
        window.localStorage.setItem('page-station-list-scroll', JSON.stringify(scrollPos));
        dispatch(navigate(NavigationViewEnum.StationDetail, s.id));
    },
    onStarClick: (s:Station) => {
        dispatch(toggleFavorito(s.id));
    }
});

const tabs = [{
    id: 'fav',
    title: 'Favoritas'
},{
    id: 'all',
    title: 'Todas'
}];

const groupBy = function<T>(
    arr:T[],
    key:(v:T) => string,
    nameSel:(v:T) => string
):{[key:string]:any, value:T[], name:string}[] {
    const map = arr.reduce((map, value:T) => {
        const hashKey = key(value);
        map[hashKey] = map[hashKey] || [];
        map[hashKey].push(value);
        return map;
    }, {});
    
    const ret = [];
    for(let key in map){
        ret.push({
            key,
            value: map[key],
            name: nameSel(map[key][0])
        });
    }
    return ret;
}

class SelectedStationsSummary extends Component<SelectedStationsSummaryProps, {}> {
    componentDidMount() {
        try {
            const scrollPos = JSON.parse(window.localStorage.getItem('page-station-list-scroll'));
            document.querySelector('.page-station-list').scrollTop = scrollPos;
            window.localStorage.removeItem('page-station-list-scroll');
        } catch(ex) {}
    }

    render(props: SelectedStationsSummaryProps) {
        let stationList:JSX.Element[];    
        if(props.selectedTabId === 'fav') {
            stationList = props.stations
                .filter(s => s.isFavorite)
                .map(s => <StationLine station={s} onClick={props.onStationClick} />);
        }else {
            const stationsGrouped = groupBy(props.stations, s => s.country.id.toString(), s => s.country.name)
                .map(countryGroup => ({
                    key: countryGroup.key,
                    name: countryGroup.name,
                    value: groupBy(countryGroup.value, s => s.region.id.toString(), s => s.region.name)
                }));

            stationList = stationsGrouped.reduce<JSX.Element[]>((list, countryGroup) => {
                return list.concat([
                    <div class="separator country">{countryGroup.name}</div>,
                    ...countryGroup.value.reduce<JSX.Element[]>((list, regionGroup) => {
                        return list.concat([
                            <div class="separator region">{regionGroup.name}</div>,
                            ...regionGroup.value.map(s => <StationLine
                                station={s}
                                onClick={props.onStationClick}
                                onStarClick={props.onStarClick} />)
                        ]);
                    }, [])
                ]);
            }, []);
        }


        return <div className={classnames('page-station-list', props.className)}>
            <TabStrip tabs={tabs} selectedTabId={props.selectedTabId} onTabSelected={props.switchSelectedTab} />
            {stationList}
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedStationsSummary);
