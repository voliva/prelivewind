import { h } from 'preact';
import * as classnames from 'classnames';
import './button.css';

interface ButtonProps {
    text: string,
    onClick?: () => void,
    className?: string
}

const Button = ({text, onClick, className}: ButtonProps) => (
    <div
        className={classnames(className, 'button')}
        onClick={onClick}>
        {text}
    </div>
)

export default Button;