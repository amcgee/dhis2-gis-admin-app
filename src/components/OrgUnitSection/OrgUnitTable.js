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
import MapModal from '../Maps/MapModal'

import styles from './OrgUnitSection.module.css'

const SortArrow = ({ direction }) =>
    direction > 0 ? (
        <span className={styles.sortArrow}>&#9660;</span>
    ) : (
        <span className={styles.sortArrow}>&#9650;</span>
    )

SortArrow.propTypes = {
    direction: PropTypes.number.isRequired,
}

export const OrgUnitTable = ({ orgUnits, orderBy }) => {
    const { baseUrl } = useConfig()
    const [order, setOrder] = useState({ column: 'displayName', direction: 1 })
    const [showModal, setShowModal] = useState(false)
    const [coords, setCoords] = useState([])

    const handleHeaderClick = column => {
        const direction = order.column === column ? order.direction * -1 : 1

        setOrder({ column, direction })

        const directionStr = direction > 0 ? 'asc' : 'desc'
        orderBy({ order: `${column}:${directionStr}` })
    }

    const handleViewMapClick = coordinates => {
        if (coordinates) {
            console.log(coordinates)
            debugger
            setCoords(coordinates)
            setShowModal(true)
        } else {
            console.warn('no geometry')
        }
    }

    const closeMapModal = () => {
        setCoords([])
        setShowModal(false)
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
            {coords && showModal && (
                <MapModal coords={coords} close={closeMapModal} />
            )}
            {orgUnits.length ? (
                <Table className={styles.table}>
                    <TableHead>
                        <TableRowHead>
                            {tableHeaders.map(header => (
                                <TableCellHead
                                    key={header.field}
                                    className={styles.columnHeader}
                                >
                                    <div
                                        onClick={() =>
                                            handleHeaderClick(header.field)
                                        }
                                    >
                                        {header.display}
                                        {header.field === order.column ? (
                                            <SortArrow
                                                direction={order.direction}
                                            />
                                        ) : null}
                                    </div>
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
                                        {orgUnit.geometry ? (
                                            <Button
                                                onClick={() =>
                                                    handleViewMapClick(
                                                        orgUnit.geometry
                                                            .coordinates
                                                    )
                                                }
                                            >
                                                {i18n.t('View Map')}
                                                {/* TODO: translations */}
                                            </Button>
                                        ) : (
                                            i18n.t('N/A')
                                        )}
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
