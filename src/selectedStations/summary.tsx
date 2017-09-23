import { h, Component } from 'preact';
import {
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    AccordionList
} from '../components/accordionList';

export default class SelectedStationsSummary extends Component<{
    stations: string[]
}, {}> {

    constructor() {
        super();
    }

    render(props) {
        return <div>
            <AccordionList>
                <AccordionItem className={'prova'}>
                    <AccordionHeader>Header
                    </AccordionHeader>
                    <AccordionBody>Body
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>Header
                    </AccordionHeader>
                    <AccordionBody>Body
                    </AccordionBody>
                </AccordionItem>
            </AccordionList>
            {props.stations.map(s => <div>{s}</div>)}
        </div>
    }
}