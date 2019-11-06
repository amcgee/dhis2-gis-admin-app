import React, { useState } from 'react'
import FilteredOrgUnitTable from './FilteredOrgUnitTable'
import { SearchInput } from './SearchInput'
import { RadioGroup } from '@dhis2/ui-core'

const OrgUnitTab = () => {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState('all')

    return <div className="container">
        <h3>Organisation Units</h3>
        <div className="controls">
            <SearchInput onChange={setSearch} />
            <RadioGroup name="filter" disabled={!!search} options={[{
                label: 'All',
                value: 'all',
            }, {
                label: 'No Geometry',
                value: 'invalid',
            }]}
                value={filter}
                onChange={e => {
                    setFilter(e.target.value)
                }} />
        </div>
        <FilteredOrgUnitTable search={search} filter={filter} />
    </div>
}

export default OrgUnitTab
