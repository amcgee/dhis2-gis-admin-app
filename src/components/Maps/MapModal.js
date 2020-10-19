import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
} from '@dhis2/ui-core'
import MiniMap from './MiniMap'

const MapModal = ({ orgUnit, close }) => {
    const [editMode, setEditMode] = useState(false)
    const [currentGeo, setCurrentGeo] = useState(orgUnit.coords)

    const handleEdit = () => {
        setEditMode(!editMode)
    }
    const saveNewGeo = () => {
        setEditMode(false)
        if (currentGeo !== orgUnit.coords) {
            // TODO: call to api w/ new coordinates
            alert(`${orgUnit.type} has been updated`)
        }
    }
    /*
    displayName: orgUnit.displayName,
    id: orgUnit.id,
    type: orgUnit.geometry.type,
    coords: orgUnit.geometry.coordinates,
    */

    // useEffect(() => {
    // }, [])
    return (
        <Modal onClose={() => close()}>
            <ModalTitle>{orgUnit.displayName}</ModalTitle>
            <ModalContent>
                <MiniMap
                    coords={currentGeo}
                    type={orgUnit.type}
                    updateGeo={setCurrentGeo}
                    editMode={editMode}
                />
            </ModalContent>
            <ModalActions>
                <Button primary onClick={() => handleEdit()}>
                    {editMode ? 'Cancel' : 'Edit Coordinates'}
                </Button>
                {editMode && (
                    <Button primary onClick={() => saveNewGeo()}>
                        Save
                    </Button>
                )}
            </ModalActions>
        </Modal>
    )
}

export default MapModal

MapModal.propTypes = {
    close: PropTypes.func.isRequired,
    orgUnit: PropTypes.object.isRequired,
}
