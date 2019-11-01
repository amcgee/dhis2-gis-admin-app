import React from 'react'
import { GoogleKeyStatus } from './GoogleKeyStatus'
import { NullOrgUnits } from './NullOrgUnits'

export const OverviewTab = () => (
    <div className="container">
        <h3>Overview</h3>
        <GoogleKeyStatus />
        <NullOrgUnits />
    </div>
)