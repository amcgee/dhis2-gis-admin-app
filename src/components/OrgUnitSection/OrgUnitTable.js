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
import { UserCount } from './UserCount'

import styles from './OrgUnitSection.module.css'

export const OrgUnitTable = ({ orgUnits, orderBy }) => {
    const { baseUrl } = useConfig()
    const [order, setOrder] = useState('asc');

    const handleHeaderClick = (field) => {
        // There's probably a simpler way to do this...just going between acedning and descending for the query
        setOrder(order === 'asc' ? 'desc' : order === 'desc' ? 'asc': 'desc')
        //orderBy is actually our refetch paginated query/function we pass down as props
        orderBy({order: `${field}:${order}` })
    }

    const tableHeaders = [
        {display: 'Name',
        field: 'displayName'},
        {display: 'UID',
        field: 'id'},
        {display: 'Level',
        field: 'level'},
        // {display: 'Users',
        // field: 'Users'},
        {display: 'Geometry Type',
        field: 'geometry'}
    ];

    return (
        <>
            {orgUnits.length ? (
                <Table className={styles.table}>
                    <TableHead>
                        <TableRowHead>
                            {tableHeaders.map(header => <TableCellHead><span onClick={()=> handleHeaderClick(header.field)}>{i18n.t(header.display)}</span></TableCellHead>)}
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
    orgUnits: PropTypes.array.isRequired,
}
