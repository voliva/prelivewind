import { h } from 'preact';
import * as classnames from 'classnames';
import './icon.css';

type IconType = 'arrowBack' | 'star';

interface IconProps {
    type:IconType,
    className?:string,
    onClick?:(evt:Event) => void,
    fill?:boolean
}

const Icon = ({type, className, onClick, fill}: IconProps) => {
    className = classnames(className, 'icon', `icon__${type}`,{
        'icon--filled': fill
    });
    switch(type) {
        case 'arrowBack':
            return <svg width='25' height='20' className={className} onClick={evt => onClick(evt)}>
                <path d='m 2,10 c 2.5,2.5 4.5,5.5 7,8 M 23,10 c -7,0 -14,0 -21,0 C 4.5,7.5 6.5,4.5 9,2' />
            </svg>
        case 'star':
            return <svg width='25' height='23' className={className} onClick={evt => onClick(evt)}>
                <path d='m 12.4,0.4 2.9,8.3 h 8.8 L 17.4,14.2 19.8,22.6 12.4,17.7 5.1,22.6 7.5,14.2 0.7,8.8 H 9.5 Z' />
            </svg>
        default:
            return <span>Icon-{type}</span>
    }
}

export default Icon;