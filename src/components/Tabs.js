import React, { useState } from 'react'
import OrgUnitTab from './OrgUnitTab/OrgUnitTab'
import { TabBar, Tab } from '@dhis2/ui-core'
import { OverviewTab } from './OverviewTab/OverviewTab'

const DEFAULT_TAB = 'Overview'
const tabs = {
    'Overview': OverviewTab,
    'Org Units': OrgUnitTab
}
export const Tabs = () => {
    const [tab, setTab] = useState(DEFAULT_TAB)

    return <>
        <TabBar className="tab-bar">
            {Object.keys(tabs).map(name => <Tab key={name} selected={tab === name} onClick={() => setTab(name)}>{name}</Tab>)}
        </TabBar>
        {Object.entries(tabs).map(([name, Component]) => <div key={name}>{tab === name && <Component />}</div>)}
    </>
}