import React from 'react'
import { Table, TableRowHead, TableCellHead, TableHead, TableBody, TableRow, TableCell } from '@dhis2/ui-core'
import { UserCount } from './UserCount'

export const OrgUnitTable = ({ orgUnits }) => {
    return <Table>
        <TableHead>
            <TableRowHead>
                <TableCellHead>
                    UID
                </TableCellHead>
                <TableCellHead>
                    Name
                </TableCellHead>
                <TableCellHead>
                    Level
                </TableCellHead>
                <TableCellHead>
                    Users
                </TableCellHead>
                <TableCellHead>
                    Geometry Type
                </TableCellHead>
            </TableRowHead>
        </TableHead>
        <TableBody>
            {orgUnits.map(function (orgUnit) {
                return <TableRow key={orgUnit.id}>
                    <TableCell>
                        {orgUnit.id}
                    </TableCell>
                    <TableCell>
                        {orgUnit.displayName}
                    </TableCell>
                    <TableCell>
                        {orgUnit.level}
                    </TableCell>
                    <TableCell>
                        <UserCount orgUnitID={orgUnit.id} />
                    </TableCell>
                    <TableCell>
                        {orgUnit.geometry ? orgUnit.geometry.type : 'NONE'}
                    </TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>
}