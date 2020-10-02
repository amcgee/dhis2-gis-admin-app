import React from 'react'
import i18n from '@dhis2/d2-i18n'
import styles from './OverviewSection.module.css'
import { GoogleKeyStatus } from './GoogleKeyStatus'
import { NullOrgUnits } from './NullOrgUnits'

export const OverviewSection = () => (
    <div className={styles.container}>
        <h2>{i18n.t('Overview')}</h2>
        <GoogleKeyStatus />
        <NullOrgUnits />
    </div>
)