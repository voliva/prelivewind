import { h } from 'preact';
import './header.css';

const Header = (props) => (
    <header className='app-header'>
        {props.hasBackButton ? <span class="app-header__left-btn typcn typcn-arrow-left" onClick={props.onBackClick}>&lt;-</span> : null}
        <span className='app-header__title'>{props.title}</span>
    </header>
)

export default Header;