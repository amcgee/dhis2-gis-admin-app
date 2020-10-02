import React, { useState } from 'react'
import { OrgUnitSection } from './components/OrgUnitSection/OrgUnitSection'
import { OverviewSection } from './components/OverviewSection/OverviewSection'

import styles from './App.module.css'
import './locales'

const MyApp = () => {
    return <div className={styles.container}>
        <OverviewSection />
        <OrgUnitSection />
    </div>
}

export default MyApp
