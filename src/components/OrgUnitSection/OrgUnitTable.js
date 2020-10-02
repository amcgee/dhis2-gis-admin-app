import React from 'react'
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

export const OrgUnitTable = ({ orgUnits }) => {
    const { baseUrl } = useConfig()
    return (
        <>
            {orgUnits.length ? (
                <Table className={styles.table}>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead className={styles.stretchCell}>
                                {i18n.t('Name')}
                            </TableCellHead>
                            <TableCellHead>{i18n.t('UID')}</TableCellHead>
                            <TableCellHead>{i18n.t('Level')}</TableCellHead>
                            <TableCellHead>{i18n.t('Users')}</TableCellHead>
                            <TableCellHead>
                                {i18n.t('Geometry Type')}
                            </TableCellHead>
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
                                    <TableCell>
                                        <UserCount orgUnitID={orgUnit.id} />
                                    </TableCell>
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
