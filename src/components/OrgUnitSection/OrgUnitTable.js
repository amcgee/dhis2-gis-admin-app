import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useConfig } from '@dhis2/app-runtime'
import {
    Table,
    TableRowHead,
    TableCellHead,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
// import { UserCount } from './UserCount'

import styles from './OrgUnitSection.module.css'

export const OrgUnitTable = ({ orgUnits, orderBy }) => {
    const { baseUrl } = useConfig()
    const [order, setOrder] = useState({ column: 'displayName', direction: 1 })

    const handleHeaderClick = field => {
        if (order.column === field) {
            setOrder({ column: field, direction: order.direction * -1 })
        } else {
            setOrder({ column: field, direction: 1 })
        }

        const direction = order.direction > 0 ? 'asc' : 'desc'
        orderBy({ order: `${order.field}:${direction}` })
    }

    const tableHeaders = [
        { display: i18n.t('Name'), field: 'displayName' },
        { display: i18n.t('UID'), field: 'id' },
        { display: i18n.t('Level'), field: 'level' },
        // {display: i18n.t('Users'), field: 'Users'},
        { display: i18n.t('Geometry Type'), field: 'geometry' },
    ]

    return (
        <>
            {orgUnits.length ? (
                <Table className={styles.table}>
                    <TableHead>
                        <TableRowHead>
                            {tableHeaders.map(header => (
                                <TableCellHead key={header.field}>
                                    <span
                                        onClick={() =>
                                            handleHeaderClick(header.field)
                                        }
                                    >
                                        {header.display}
                                    </span>
                                </TableCellHead>
                            ))}
                            <TableCellHead></TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {orgUnits.map(function(orgUnit) {
                            return (
                                <TableRow key={orgUnit.id}>
                                    <TableCell>{orgUnit.displayName}</TableCell>
                                    <TableCell>{orgUnit.id}</TableCell>
                                    <TableCell>{orgUnit.level}</TableCell>
                                    {/* <TableCell>
                                        <UserCount orgUnitID={orgUnit.id} />
                                    </TableCell> */}
                                    <TableCell>
                                        {orgUnit.geometry
                                            ? orgUnit.geometry.type
                                            : i18n.t('NONE')}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => {
                                                window.location = `${baseUrl}/dhis-web-maintenance/index.html#/edit/organisationUnitSection/organisationUnit/${orgUnit.id}`
                                            }}
                                        >
                                            {i18n.t('Edit')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            ) : null}
            <div
                style={{
                    marginBottom:
                        (5 - orgUnits.length) * 63 +
                        (orgUnits.length === 0 ? 45 : 0),
                }}
            />
        </>
    )
}

OrgUnitTable.propTypes = {
    orderBy: PropTypes.func.isRequired,
    orgUnits: PropTypes.array.isRequired,
}
