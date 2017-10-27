import { h, Component } from 'preact';
import Icon from './icon';
import * as classnames from 'classnames';
import './searchBar.css';

interface SearchBarProps {
    value: string;
    onClear?: () => void;
    onKeyPress?: (key:string) => void;
    onExpand?: (expanded:boolean) => void;
}
interface SearchBarState {
    hasFocus: boolean;
}

export default class SearchBar extends Component<SearchBarProps, SearchBarState> {
    constructor(props?:SearchBarProps, context?:any) {
        super(props, context);
        this.state = {
            hasFocus: false
        };
    }

    private _onFocus = () => {
        this.setState(s => ({
            ...s,
            hasFocus: true
        }));
        this.props.onExpand(true);
    };
    private _onBlur = () => {
        this.setState(s => ({
            ...s,
            hasFocus: false
        }));
        this.props.onExpand(false);
    };
    private _onInput = (evt:UIEvent) => {
        this.props.onKeyPress((evt.target as any).value);
    };

    render({
        value,
        onClear
    }:SearchBarProps) {
        const classes = classnames('searchBar', {
            'searchBar--reveal': !!value || this.state.hasFocus
        });
    
        return <label className={classes}>
            <Icon type='search' className='searchBar__icon' />
            <input type='text' 
                onFocus={this._onFocus}
                onBlur={this._onBlur}
                value={value} onInput={this._onInput} />
        </label>
    }
}