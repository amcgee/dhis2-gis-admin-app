import React from 'react'
import PropTypes from 'prop-types'
import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    users: {
        resource: 'users',
        params: ({ ou }) => ({
            filter: `organisationUnits.id:eq:${ou}`,
        }),
    },
}

export const UserCount = ({ orgUnitID }) => {
    const { loading, error, data } = useDataQuery(query, {
        variables: {
            ou: orgUnitID,
        },
    })
    return (
        <span>
            {loading && '...'}
            {error && 'ERROR'}
            {data && data.users.pager.total}
        </span>
    )
}

UserCount.propTypes = {
    orgUnitID: PropTypes.string.isRequired,
}
