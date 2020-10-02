import React, { useState } from 'react'
import FilteredOrgUnitTable from './FilteredOrgUnitTable'
import { SearchInput } from './SearchInput'
import { Radio } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

import styles from './OrgUnitSection.module.css'

export const OrgUnitSection = () => {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')

    return (
        <div className={styles.container}>
            <h2>{i18n.t('Organisation Units')}</h2>
            <div className={styles.controls}>
                <SearchInput onChange={setSearch} />
                <Radio
                    name="filter"
                    disabled={!!search}
                    checked={search || filter === 'all'}
                    label={i18n.t('All')}
                    value="all"
                    onChange={({ value }) => setFilter(value)}
                />
                <Radio
                    name="filter"
                    disabled={!!search}
                    checked={!search && filter === 'invalid'}
                    label={i18n.t('No Geometry')}
                    value="invalid"
                    onChange={({ value }) => setFilter(value)}
                />
            </div>
            <FilteredOrgUnitTable search={search} filter={filter} />
        </div>
    )
}
