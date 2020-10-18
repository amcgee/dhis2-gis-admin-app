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

const MapModal = ({ coords, close }) => {
    const [dragable, setDragable] = useState(false)
    const [currentCoordinates, setCurrentCoordinates] = useState(coords)

    const handleEdit = () => {
        setDragable(!dragable)
    }
    const saveNewCoords = () => {
        setDragable(false)
        // TODO: call to api w/ new coordinates
    }

    // useEffect(() => {
    // }, [])
    return (
        <Modal onClose={() => close()}>
            <ModalTitle>Hello</ModalTitle>
            <ModalContent>
                <MiniMap
                    coords={currentCoordinates}
                    updateCoords={setCurrentCoordinates}
                    dragable={dragable}
                />
            </ModalContent>
            <ModalActions>
                <Button primary onClick={() => handleEdit()}>
                    Edit Coordinates
                </Button>
                {dragable && (
                    <Button primary onClick={() => saveNewCoords()}>
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
    coords: PropTypes.array.isRequired,
}
