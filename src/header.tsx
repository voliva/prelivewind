import { h } from 'preact';
import './header.css';
import Icon from './components/icon';

interface HeaderProps {
    title:string;
    hasBackButton?:boolean;
    starButtonState?:'active'|'default';
    onBackClick?:() => void;
    onStarClick?:() => void;
}

const Header = (props:HeaderProps) => (
    <header className='app-header'>
        {props.hasBackButton ? <Icon type='arrowBack' className="app-header__left-btn" onClick={props.onBackClick} /> : null}
        <span className='app-header__title'>{props.title}</span>
        {props.starButtonState ? <Icon type='star' className="app-header__right-btn" onClick={props.onStarClick} fill={props.starButtonState === 'active'}/> : null }
    </header>
)

export default Header;