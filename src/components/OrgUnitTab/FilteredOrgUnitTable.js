import React, { useEffect, useRef } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { Button } from '@dhis2/ui-core'
import { OrgUnitTable } from './OrgUnitTable'

const query = {
    "orgUnits": {
        "resource": "organisationUnits",
        "params": ({ page, search, filter }) => {
            return {
                "pageSize": 5,
                "page": page,
                "fields": ["id", "displayName", "level", "geometry"],
                "filter": search ? `displayName:ilike:${search}` : filter === 'invalid' && `geometry:null`
            }
        }
    }
}

function FilteredOrgUnitTable({ search, filter }) {
    const { loading, error, data, refetch } = useDataQuery(query)

    const isFirstRender = useRef(true)
    useEffect(() => {
        if (!isFirstRender.current) {
            refetch({
                search,
                filter,
                page: 1
            })
        } else {
            isFirstRender.current = false;
        }
    }, [search, filter])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>An error occurred!</div>
    }

    return <div>
        <OrgUnitTable orgUnits={data.orgUnits.organisationUnits} />
        <div className="tableFooter">
            <Button
                onClick={() => refetch({
                    page: data.orgUnits.pager.page - 1
                })}
                disabled={data.orgUnits.pager.page === 1}
            >Previous</Button>
            <span className="pageCountDiv">Page {data.orgUnits.pager.page} of {data.orgUnits.pager.pageCount}</span>
            <Button
                onClick={() => refetch({
                    page: data.orgUnits.pager.page + 1
                })}
                disabled={data.orgUnits.pager.page === data.orgUnits.pager.pageCount}
            >Next</Button>
        </div>
    </div>
}

export default FilteredOrgUnitTable
