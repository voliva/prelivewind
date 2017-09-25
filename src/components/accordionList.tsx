import { h, Component, ComponentProps, cloneElement } from 'preact';
import * as classnames from 'classnames';
import './accordionList.css';

interface AccordionListItem {
    header: JSX.Element;
    body: JSX.Element;
}

interface AccordionListProps extends ComponentProps<AccordionList> {
    items: AccordionListItem[]
}
interface AccordionListState {
    focusedItemIndex: number
}

export default class AccordionList extends Component<AccordionListProps, AccordionListState> {
    constructor() {
        super();
        this.state = {
            focusedItemIndex: null
        }
    }

    private _onHeaderClick = (index:number) => {
        this.setState((state) => state.focusedItemIndex === index ? {
            ...state,
            focusedItemIndex: null
        } : {
            ...state,
            focusedItemIndex: index
        });
    }

    render(props:AccordionListProps, state:AccordionListState) {
        return <div>
            { props.items.map(({header, body}, i) =>
            <div className={classnames('accordion-item', {
                selected: i === state.focusedItemIndex
            })}>
                {cloneElement(header, {
                    className: classnames('accordion-header', header.attributes.className),
                    onClick: () => this._onHeaderClick(i)
                })}
                {cloneElement(body, {
                    className: classnames('accordion-body', body.attributes.className)
                })}
            </div>) }
        </div>;
    }
}

export {
    AccordionList,
    AccordionListItem
}