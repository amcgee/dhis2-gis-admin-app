import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDataQuery } from '@dhis2/app-runtime'
import { Button, ComponentCover } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { OrgUnitTable } from './OrgUnitTable'

import styles from './OrgUnitSection.module.css'

const query = {
    orgUnits: {
        resource: 'organisationUnits',
        params: ({ page, search, filter, order }) => {
            return {
                pageSize: 5,
                page: page,
                order: order,
                fields: ['id', 'displayName', 'level', 'geometry'],
                filter: search
                    ? `displayName:ilike:${search}`
                    : filter === 'invalid'
                    ? `geometry:null`
                    : undefined,
            }
        },
    },
}

function FilteredOrgUnitTable({ search, filter, order }) {
    const [data, setData] = useState(undefined)
    const { loading, error, refetch } = useDataQuery(query, {
        onComplete: setData,
    })

    const isFirstRender = useRef(true)
    useEffect(() => {
        if (!isFirstRender.current) {
            refetch({
                search,
                filter,
                page: 1,
                order,
            })
        } else {
            isFirstRender.current = false
        }
    }, [search, filter])

    if (error) {
        return <div>{i18n.t('An error occurred!')}</div>
    }

    if (!data) {
        return i18n.t('Loading...')
    }
    if (data?.orgUnits?.organisationUnits.length < 1) {
        return `${i18n.t('No results found for')} '${search}'.`
    }

    return (
        <>
            <div className={styles.tableContainer}>
                {loading && <ComponentCover translucent />}
                <OrgUnitTable
                    orgUnits={data.orgUnits.organisationUnits}
                    orderBy={refetch}
                />
            </div>
            <div className={styles.tableFooter}>
                <Button
                    onClick={() =>
                        refetch({
                            page: data.orgUnits.pager.page - 1,
                        })
                    }
                    disabled={loading || data.orgUnits.pager.page === 1}
                >
                    &larr;&nbsp;{i18n.t('Previous')}
                </Button>
                <span className={styles.pageCountDiv}>
                    {i18n.t('Page {{page}} of {{pageCount}}', {
                        page: data.orgUnits.pager.page,
                        pageCount: data.orgUnits.pager.pageCount,
                    })}
                </span>
                <Button
                    onClick={() =>
                        refetch({
                            page: data.orgUnits.pager.page + 1,
                        })
                    }
                    disabled={
                        loading ||
                        data.orgUnits.pager.page ===
                            data.orgUnits.pager.pageCount
                    }
                >
                    {i18n.t('Next')}&nbsp;&rarr;
                </Button>
            </div>
        </>
    )
}

FilteredOrgUnitTable.propTypes = {
    filter: PropTypes.string,
    order: PropTypes.string,
    search: PropTypes.string,
}

export default FilteredOrgUnitTable
