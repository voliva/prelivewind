import { h, ComponentProps } from 'preact';
import { Station } from '../redux/stateType';
import * as classnames from 'classnames';
import Icon from '../components/icon';

interface StationLineProps extends ComponentProps<any> {
    station: Station,
    onClick?: (s:Station) => void,
    className?: any,
    onStarClick?: (s:Station) => void
}

const MIN_PCT = 10;
const MAX_PCT = 90;
const MAX_WIND = 50;
const StationLine = (props:StationLineProps) => {
    const lastData = props.station.lastData;

    const showWind = lastData && lastData.wind != null;
    const showGust = showWind && lastData.gust != null && lastData.gust > lastData.wind;

    const directionStyle = {
        transform: `rotate(${lastData && lastData.direction}deg)`
    };

    const direction = lastData && lastData.direction != null ?
        `${formatNumber(lastData.direction)}º` : '';
    const windLine = showWind ?
        <div className={classnames('station-header__mean',{'has-gust': showGust})}
            style={getStyle(lastData.wind)}>
            {formatNumber(lastData.wind)}kts
            {lastData && lastData.direction != null && <Icon className='station-header__direction' type='windArrow' style={directionStyle} /> }
        </div> : null;
    const gustLine = showGust ?
        <div className='station-header__gust'
            style={getStyle(lastData.gust)}>
            {formatNumber(lastData.gust)}kts
        </div> : null;
    const onStarClick = (evt:MouseEvent) => {
        evt.stopPropagation();
        props.onStarClick(props.station);
    }
    const star = props.onStarClick ?
        <Icon className='station-header__star' type='star' fill={props.station.isFavorite} onClick={onStarClick}/>
        : null;

    return <div onClick={() => props.onClick(props.station)} className={classnames('station-header', props.className)}>
        {star}
        <div className='station-header__name'>{props.station.name}</div>
        <div className='station-header__wind'>
            {windLine}
            {gustLine}
        </div>
    </div>;
}

export default StationLine;

function formatDirection(n) {
    let ret = '';
    if(n > 292 || n < 68) ret = ret + 'N';
    if(n > 112 && n < 248) ret = ret + 'S';
    
    if(n > 22 && n < 158) ret = ret + 'E';
    if(n > 202 && n < 338) ret = ret + 'W';
    return ret;
}

const decimalPlaces = 0;
const mult = (() => {
    let res = 1;
    for(let i=0; i<decimalPlaces; i++)
        res *= 10;
    return res;
})();
function formatNumber(n:number):string {
    return `${Math.round(n * mult) / mult}`;
}

function getStyle(wind:number) {
    const n = wind / MAX_WIND;
    const r = getRed(n);
    const g = getGreen(n);
    const b = getBlue(n);
    const pct = getStop(n);
    return {
        'background': `linear-gradient(to right, rgba(255,255,255,0) 0%,rgba(${r},${g},${b},0) ${pct}%, rgba(${r},${g},${b},0.65) 100%)`
    }
}
// windStyleTemplate: `.wind-{{value}} {
//     background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, rgba({{r}},{{g}},{{b}},0) {{pct}}%, rgba({{r}},{{g}},{{b}},0.65) 100%);
// }`,
function getRed(n:number):number { // [0 - 1] => [0-256)
    n = Math.min(1, Math.max(0, n));

    if(n < 0.4) {
        return 0;
    }
    if(n < 0.6) {
        const k = n - 0.4;
        return Math.round(255 * k / 0.2);
    }
    return 255;
}

function getGreen(n:number):number { // [0 - 1] => [0-256)
    n = Math.min(1, Math.max(0, n));

    if(n < 0.2) {
        return Math.round(255 * n / 0.2);
    }
    if(n < 0.6) {
        return 255;
    }
    if(n < 0.8) {
        const k = n - 0.6;
        return Math.round(255 - 255 * k / 0.2);
    }
    return 0;
}

function getBlue(n:number):number { // [0 - 1] => [0-256)
    n = Math.min(1, Math.max(0, n));

    if(n < 0.2) {
        return 255;
    }
    if(n < 0.4) {
        const k = n - 0.2;
        return Math.round(255 - 255 * k / 0.2);
    }
    if(n < 0.8) {
        return 0;
    }
    const k = n - 0.8;
    return Math.round(255 * k / 0.2);
}

function getStop(n:number):number { // [0 - 1] => 100 - [MIN_PCT-MAX_PCT]
    return Math.round(100 - (MIN_PCT + (MAX_PCT - MIN_PCT) * n));
}