import { h } from 'preact';
import './header.css';
import Icon from './components/icon';

interface HeaderProps {
    title:string;
    hasBackButton?:boolean;
    starButtonState?:'active'|'default';
    onBackClick?:() => void;
    onStarClick?:() => void;
    onDateClick?:(direction:string) => void;
}

const Header = (props:HeaderProps) => (
    <header className='app-header'>
        <span className='app-header__title'>{props.title}</span>
        <div className='app-header__buttons'>
            {props.hasBackButton ? <Icon type='arrowBack' className="app-header__btn" onClick={props.onBackClick} /> : null}
            <div className='app-header__btn-separator'></div>
            {props.starButtonState ? <Icon type='star' className="app-header__btn" onClick={props.onStarClick} fill={props.starButtonState === 'active'}/> : null }
            {props.onDateClick ? <Icon type='calendar--left' className="app-header__btn" onClick={() => props.onDateClick('left')} /> : null }
            {props.onDateClick ? <Icon type='calendar--right' className="app-header__btn" onClick={() => props.onDateClick('right')} /> : null }
        </div>
    </header>
)

export default Header;