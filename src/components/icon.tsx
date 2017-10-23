import { h } from 'preact';
import * as classnames from 'classnames';
import './icon.css';

type IconType = 'arrowBack' | 'star' | 'calendar' | 'calendar--right' | 'calendar--left'
    | 'windArrow';

interface IconProps {
    type:IconType,
    className?:string,
    onClick?:(evt:Event) => void,
    fill?:boolean,
    style?:any
}

// https://jakearchibald.github.io/svgomg/
const calendarArrowTransform = {
    right: "translate(9.502 11.272) scale(.0192)",
    left: "matrix(-.0192 0 0 .0192 11.023 11.27)"
}
const calendarArrow = (direction:'right'|'left') => (direction ?
    <g transform={calendarArrowTransform[direction]}>
        <circle cx="287.9" cy="278" r="262.9" fill="#fff" stroke="#080000" stroke-width="47.4"/>
        <path d="M322.4 307.6c4.7 1.7 8.5 6.2 8.5 11.3v73c0 5 2 6 6 2l135-134c3-3.8 3-9.6 0-13L337 113c-3.6-3.6-6.5-2.4-6.5 2.7V187c0 5-4.2 8.5-9.3 8.8-115 5.7-207.2 80.6-211.8 196.5-.3 5 2 5.7 5 1.7 64-85.4 175.7-97.8 207.4-86.4z"/>
    </g> : null);
const calendarSvg = (className, onClick, direction?:'right'|'left') =>
    <svg width="22" height="23" className={className} onClick={evt => onClick(evt)} style="fill:inherit; stroke:inherit">
        <g transform="matrix(.0904 0 0 .0887 -3.71 -4.888)">
            <path d="M263.4 226V55H62L41 67v247h213v-22h30.5s-21-17-21-66zm-14-37H213v-39h36.4zm-89.2-84v39h-40.7v-39zm6 0H207v39h-40.8zM76 105h37.5v39H76zm0 45h37.5v39H76zm0 45h37.5v39H76zm43.5 31v-31h40.7v31c0 3 0 5.6.2 8h-40.8v-8zm0-37v-39h40.7v39zm46.7-39H207v39h-40.8zm83.2-6H213v-39h36.4zM114 240c1.6 20 6.5 31.5 11.3 38h-39c-1-.7-2.6-2.5-4.3-6-2.5-5.2-5.5-15-6-32zm19.3 38c-4.7-4.2-11.4-14.4-13.3-38h40.7c1.6 20 6.5 31.5 11.4 38zm46.8 0c-4-4.2-11-14.4-13-38h41c2 20 7 31.5 12 38zm-13-44v-39h40v39zm47-8v-31h36v39h-37v-8zm27 74H55V75l7-4v163c0 54 21 58 21 58h157v8zm14-22h-27c-5-4.2-11.3-14.4-13.2-38h36c.6 15 3 27.6 7.2 38z"/>
        </g>
        {calendarArrow(direction)}
    </svg>

const Icon = ({type, className, onClick, fill, style}: IconProps) => {
    className = classnames(className, 'icon', `icon__${type}`,{
        'icon--filled': fill
    });
    switch(type) {
        case 'arrowBack':
            return <svg style={style} width='25' height='20' className={className} onClick={evt => onClick(evt)}>
                <path d='m 2,10 c 2.5,2.5 4.5,5.5 7,8 M 23,10 c -7,0 -14,0 -21,0 C 4.5,7.5 6.5,4.5 9,2' />
            </svg>
        case 'star':
            return <svg style={style} width='25' height='23' className={className} onClick={evt => onClick(evt)}>
                <path d='m 12.4,0.4 2.9,8.3 h 8.8 L 17.4,14.2 19.8,22.6 12.4,17.7 5.1,22.6 7.5,14.2 0.7,8.8 H 9.5 Z' />
            </svg>
        case 'calendar':
            return calendarSvg(className, onClick);
        case 'calendar--right':
            return calendarSvg(className, onClick, 'right');
        case 'calendar--left':
            return calendarSvg(className, onClick, 'left');
        case 'windArrow':
            return <svg style={style} viewBox="0 0 8.173 11.23" className={className} onClick={evt => onClick(evt)}>
                <path fill="#afafaf" stroke="#000" stroke-width=".5" d="M.25.25l4.096 10.73L7.923.31l-3.75 3.778z" stroke-linejoin="round"/>
            </svg>
        default:
            return <span>Icon-{type}</span>
    }
}

export default Icon;