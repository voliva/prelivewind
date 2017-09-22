import { h } from 'preact';
import './cookiePolicy.css';

const CookiePolicy = ({
    onDismiss
}: {onDismiss:() => void}) => (
    <div class='cookie-policy'>
        <span>Livewind Express utiliza cookies para guardar tus preferencias</span>
        <button className='cookie-btn' onClick={onDismiss}>De acuerdo</button>
    </div>
)

export default CookiePolicy;