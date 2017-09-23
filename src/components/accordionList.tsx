import { h, Component } from 'preact';
import * as classnames from 'classnames';
import './accordionList.css';

/*
<AccordionList>
    <AccordionItem>
        <AccordionHeader>
        </AccordionHeader>
        <AccordionBody>
        </AccordionBody>
    </AccordionItem>
</AccordionList>
*/

const AccordionItem = (props) => <div {...props} className={classnames('accordion-item', props.className)} />;
const AccordionHeader = (props) => <div {...props} className={classnames('accordion-header', props.className)} />;
const AccordionBody = (props) => <div {...props} className={classnames('accordion-body', props.className)} />;

export default class AccordionList extends Component<{}, {
    focusedItemIndex: number
}> {
    constructor() {
        super();
        this.state = {
            focusedItemIndex: null
        }
    }

    private _onHeaderClick = (index:number) => {
        this.setState((state) => ({
            ...state,
            focusedItemIndex: index
        }));
    }

    render(props, state) {
        if(!props.children.every(c => typeof c.nodeName === 'function')) {
            throw new Error('Al children of <AccordionList> must be <AccordionItem>');
        }
        if(!props.children.every(c => c.children.length == 2 &&
            c.children[0].nodeName == AccordionHeader as any &&
            c.children[1].nodeName == AccordionBody as any)) {
            throw new Error('Al children of <AccordionItem> must have 1 <AccordionHeader> and 1 <AccordionItem>');
        }

        return <div>
            { props.children.map((c, i) =>
            <AccordionItem {...c.attributes} className={classnames({
                selected: i === state.focusedItemIndex
            })}>
                {[
                    <AccordionHeader {...c.children[0].attributes} onClick={(evt) => this._onHeaderClick(i)}>
                        {...c.children[0].children}
                    </AccordionHeader>
                , c.children[1]] }
            </AccordionItem>) }
        </div>;
    }
}

export {
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    AccordionList
}