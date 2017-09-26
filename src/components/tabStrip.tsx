import { h } from 'preact';
import * as classnames from 'classnames';
import './tabStrip.css';

interface TabStripProps {
    tabs: {
        id: string,
        title: string
    }[],
    selectedTabId: string,
    onTabSelected: (id:string) => void
}

const TabStrip = ({tabs, selectedTabId, onTabSelected}: TabStripProps) => (
    <div className='tab-strip'>
        {tabs.map(tab =>
        <div
            className={classnames(
                'tab-strip__tab', {
                'tab-strip__tab--selected': tab.id === selectedTabId
            })}
            onClick={() => onTabSelected(tab.id)}>
            {tab.title}
        </div>)}
    </div>
)

export default TabStrip;