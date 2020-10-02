import React, { useMemo } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'

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
        <span style={{ fontWeight: 'bold' }}>{i18n.t('Null Island Org Units')} : </span>
        <span>
            {loading && '...'}
            {error && 'ERR'}
            {data && nulls.length}
        </span>
    </div>
}