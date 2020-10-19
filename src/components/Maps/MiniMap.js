import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import centroid from '@turf/centroid'
import { polygon } from '@turf/helpers'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const styles = {
    height: '100%',
    width: '100%',
}
const wrapperStyle = {
    width: '100%',
    // TODO: make height more dynamic
    // height: 'calc(100% - 8px)',
    height: '200px',
}

mapboxgl.accessToken =
    'pk.eyJ1IjoibWhhbmxleTAwIiwiYSI6ImNrZ2U0NWMwZzE3MjkzMG1peXo3MXpweHoifQ.9qRZGUKdnUf4itMTRv21PQ'
const MiniMap = ({ coords, editMode, type, updateGeo }) => {
    const [map, setMap] = useState(null)
    const [activeMarker, setMarker] = useState(null)
    const [activePolygon, setPolygon] = useState(null)
    const [drawTools, setDrawTools] = useState(null)
    const mapContainer = useRef(null)

    /*
      Position for built-in Mapbox ui widgets
    */
    const position = {
        topLeft: 'top-left',
        topRight: 'top-right',
        bottomLeft: 'bottom-left',
        bottomRight: 'bottom-right',
    }

    const findCenter = (geometry, type) => {
        if (geometry?.length > 0) {
            switch (type.toLowerCase()) {
                case 'point': {
                    if (geometry?.length === 2) {
                        /* Center on the lat/long if geo is a point and there are only 2 lat/longs */
                        return geometry
                    }
                    break
                }
                case 'polygon': {
                    /* First find the centroid of the polygon; resulting lat/lon should be our map center */
                    const feature = polygon(geometry)
                    const center = centroid(feature)
                    return center.geometry.coordinates
                }
            }
        }
        // TODO: if there is no geo, center on the parent polygon
    }

    const addMarkerToMap = () => {
        if (activeMarker) {
            activeMarker.remove()
            setMarker(null)
        }
        // TODO: refactor
        // .setText(`Current location: ${coords[0]}, ${coords[1]}`)
        const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h2>Current location: ${coords[0]}, ${coords[1]}</h2>`)
            .setMaxWidth('300px')

        const marker = new mapboxgl.Marker({ draggable: editMode })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map)
        setMarker(marker)

        const onDragEnd = () => {
            /* `getLngLat` method retrieves lat/long in object format
               ie lat: 3.5149796969459857 lng: 11.661443864314748
            */
            const { lat, lng } = marker.getLngLat()
            console.log(lat, lng)
            //helping to update parent component
            updateGeo([lng, lat])
            // could/should put new lat/long in ui
            // coordinates.style.display = 'block'
            // coordinates.innerHTML =
            //     'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat
        }

        marker.on('dragend', onDragEnd)
    }

    const addPolygonToMap = () => {
        // var sourceObject = map.getSource('polygon') // undefined if not a source on the map...
        // If a layer with the current ID exists, remove it.
        const id = 'polygon'
        if (map.getLayer(id) || map.getSource(id)) {
            map.removeLayer(id)
            map.removeSource(id)
        }
        map.addSource(id, {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: coords,
                },
            },
        })

        map.addLayer({
            id: id,
            type: 'fill',
            source: id,
            layout: {},
            paint: {
                'fill-color': '#088',
                'fill-opacity': 0.8,
            },
        })
    }

    const updateMap = () => {
        // TODO: confirm only need to support point and polygons
        switch (type.toLowerCase()) {
            case 'point': {
                addMarkerToMap()
                break
            }
            case 'polygon': {
                if (editMode) {
                    const draw = new MapboxDraw({
                        displayControlsDefault: false,
                        controls: {
                            polygon: true,
                            trash: true,
                        },
                    })
                    setDrawTools(draw)
                    map.addControl(draw, position.topLeft)

                    const clearDrawing = () => {
                        debugger
                        console.log(draw)
                        // TODO: for some reason this breaks on second edit (ie draw, save, edit and draw again)
                        const featureCollection = draw.getAll()
                        if (featureCollection?.features?.length > 1) {
                            draw.delete(
                                featureCollection.features[0].id
                            ).getAll()
                        }
                    }

                    map.on('draw.create', e => {
                        /* Delete previously drawn polygons on each new draw event */
                        clearDrawing()
                        // const feature =
                        //     e.features?.length > 1
                        //         ? e.features.shift()[0]
                        //         : e.features[0]
                        const feature = e.features[0]
                        updateGeo(feature.geometry.coordinates)
                    })
                    map.on('draw.update', e => {
                        console.log(e.features)
                        updateGeo(e.features[0].geometry.coordinates)
                    })
                }
                addPolygonToMap()
                break
            }
        }
    }

    useEffect(() => {
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: findCenter(coords, type),
                zoom: 5,
            })

            map.addControl(new mapboxgl.FullscreenControl())

            map.on('load', () => {
                setMap(map)
                map.resize()
            })
            map.on('click', e => {
                console.log(e)
            })
        }

        if (!map) {
            initializeMap({ setMap, mapContainer })
        }
        if (map || editMode) {
            updateMap()
        }
        if (map && !editMode && activeMarker) {
            //make sure we can't drag the marker once we've "saved" it
            activeMarker.setDraggable(false)
            // remove draw tools from map
        }
        if (map && !editMode && drawTools) {
            map.removeControl(drawTools)
            setDrawTools(null)
        }
    }, [map, editMode])
    return (
        <div style={wrapperStyle}>
            <div
                ref={el => (mapContainer.current = el)}
                id="map"
                style={styles}
            ></div>
            {/* <pre id="coordinates" className="coordinates"></pre> */}
        </div>
    )
}

export default MiniMap

MiniMap.propTypes = {
    coords: PropTypes.array.isRequired,
    editMode: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    updateGeo: PropTypes.func.isRequired,
}
