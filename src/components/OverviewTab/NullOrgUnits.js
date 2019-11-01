import React, { useMemo } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    ou: {
        resource: 'organisationUnits',
        params: {
            filter: 'geometry:!null',
            paging: "false",
            fields: "geometry"
        }
    }
}
export const NullOrgUnits = () => {
    const { loading, error, data } = useDataQuery(query)

    const nulls = useMemo(() => {
        if (data) {
            return data.ou.organisationUnits.filter(ou => (
                ou.geometry.type === 'Point' &&
                ou.geometry.coordinates[0] === 0 &&
                ou.geometry.coordinates[1] === 0
            ))
        }
    }, [data])

    return <div>
        <span style={{ fontWeight: 'bold' }}>Null Org Units : </span>
        <span>
            {loading && '...'}
            {error && 'ERR'}
            {data && nulls.length}
        </span>
    </div>
}