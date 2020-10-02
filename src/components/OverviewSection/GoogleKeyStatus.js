import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'

const googleTokenQuery = {
    token: {
        resource: 'tokens/google'
    }
}

export const GoogleKeyStatus = () => {
    const { loading, error, data } = useDataQuery(googleTokenQuery)

    return <div>
        <span style={{ fontWeight: 'bold' }}>{i18n.t('Google EE Key')}</span>
        <span> : </span>
        <span>
            {loading && '...'}
            {error && i18n.t('NOT CONFIGURED')}
            {data && (data.token.access_token.substr(0, 7) + '*****')}
        </span>
    </div>
}