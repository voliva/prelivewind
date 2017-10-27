import { h, Component } from 'preact';
import './header.css';
import * as classnames from 'classnames';
import Icon from './components/icon';
import SearchBar from './components/searchBar';
import { LWState, NavigationViewEnum, Station, View } from './redux/stateType';
import { Dispatch } from 'redux';
import { connect } from 'preact-redux';
import { navigateBack, toggleFavorito, changePlotDate, changeFilterValue } from './redux/actions';

interface HeaderStateProps {
    hasBackButton:boolean;
    stationDetail:Station;
    currentView:View;
}
interface HeaderDispatchProps {
    onBackClick:() => void;
    onFilterValueChanged:(value:string) => void;
    _onStarClick:(s:Station) => void;
    _onDateClick:(s:Station, startTime:number, endTime:number) => void;
}
interface HeaderProps extends HeaderStateProps, HeaderDispatchProps {
    className?: string;
    onStarClick:() => void;
    onDateClick:(dir:'right'|'left') => void;
}

const mapStateToProps = (state:LWState):HeaderStateProps => {
    let stationId = null;
    switch (state.currentView.view) {
        case NavigationViewEnum.StationDetail:
            stationId = state.currentView.params;
            break;
        case NavigationViewEnum.PlotDetail:
            stationId = state.currentView.params.id;
            break;
    }
    const stationDetail = stationId && state.stationList.filter(s => s.id === stationId)[0];
    
    return {
        stationDetail: stationDetail,
        currentView: state.currentView,
        hasBackButton: state.viewStack.length > 0
    };
}

const mapDispatchToProps = (dispatch:Dispatch<LWState>):HeaderDispatchProps => ({
    onBackClick: () => {
        dispatch(navigateBack());
    },
    onFilterValueChanged: (value:string) => {
        dispatch(changeFilterValue(value));
    },
    _onStarClick: (s:Station) => {
        dispatch(toggleFavorito(s.id));
    },
    _onDateClick: (s:Station, startTime:number, endTime:number) => {
        dispatch(changePlotDate(s.id, startTime, endTime));
    }
});

const mergeProps = (stateProps:HeaderStateProps, dispatchProps:HeaderDispatchProps, ownProps:HeaderProps):HeaderProps => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onStarClick: () => {
        dispatchProps._onStarClick(stateProps.stationDetail);
    },
    onDateClick: stateProps.currentView.view === NavigationViewEnum.PlotDetail ? (dir:'right'|'left') => {
        const currentDate = stateProps.currentView.params.time ? new Date(stateProps.currentView.params.time.start * 1000) : new Date();
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (dir === 'right' ? 1 : -1));
        const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (dir === 'right' ? 2 : 0));
        dispatchProps._onDateClick(stateProps.stationDetail, targetDate.getTime() / 1000, nextDate.getTime() / 1000);
    } : null
})

const onSpaceClick = () => {
    const elm = document.querySelector('.livewind__page');
    if(elm) {
        elm.scrollTo(0, 0);
    }
}

class Header extends Component<HeaderProps, {searchHasFocus:boolean}> {
    render(props:HeaderProps) {
        const searchValue = props.currentView.view === NavigationViewEnum.StationList ?
            props.currentView.params : null;
        const isSearching = this.state.searchHasFocus || !!searchValue;
        const title = isSearching ? null :
            <span className='app-header__title'>{props.stationDetail ? props.stationDetail.name : 'Livewind'}</span>
        const backBtn = props.hasBackButton ? <Icon type='arrowBack' className="app-header__btn" onClick={props.onBackClick} /> : null;
        const starBtn = props.currentView.view === NavigationViewEnum.StationDetail ?
            <Icon type='star' className="app-header__btn" onClick={props.onStarClick}
                fill={props.stationDetail && props.stationDetail.isFavorite}/>
            : null;
        const searchBar = props.currentView.view === NavigationViewEnum.StationList ?
            <SearchBar value={searchValue}
                onClear={() => props.onFilterValueChanged('')}
                onKeyPress={props.onFilterValueChanged}
                onExpand={expanded => this.setState({
                    searchHasFocus: expanded 
                })} />
            : null;
        
        return <header className={classnames('app-header', {
            'app-header--searchExpanded': isSearching
        })}>
            {title}
            <div className='app-header__buttons'>
                {backBtn}
                <div className='app-header__btn-separator' onClick={onSpaceClick}></div>
                {starBtn}
                {props.onDateClick ? <Icon type='calendar--left' className="app-header__btn" onClick={() => props.onDateClick('left')} /> : null }
                {props.onDateClick ? <Icon type='calendar--right' className="app-header__btn" onClick={() => props.onDateClick('right')} /> : null }
                {searchBar}
            </div>
        </header>
    }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Header);