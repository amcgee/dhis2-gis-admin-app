import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
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
const MiniMap = ({ coords, dragable, updateCoords }) => {
    const [map, setMap] = useState(null)
    const [activeMarker, setMarker] = useState(null)
    const [activePolygon, setPolygon] = useState(null)
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

    const addMarkerToMap = () => {
        if (activeMarker) {
            activeMarker.remove()
            setMarker(null)
        }
        // TODO: refactor
        // .setHTML('<h1>Hello World!</h1>') // option for cooler popup styling
        const popup = new mapboxgl.Popup({ offset: 25 })
            .setText(`Current location: ${coords[0]}, ${coords[1]}`)
            .setMaxWidth('300px')

        const marker = new mapboxgl.Marker({ draggable: dragable })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(map)
        setMarker(marker)

        const onDragEnd = () => {
            /* Below line retrieves lat/long in object format
               ie lat: 3.5149796969459857 lng: 11.661443864314748
            */
            const { lat, lng } = marker.getLngLat()
            console.log(lat, lng)
            //helping to update parent component
            updateCoords([lng, lat])
            // could/should put new lat/long in ui
            // coordinates.style.display = 'block'
            // coordinates.innerHTML =
            //     'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat
        }

        marker.on('dragend', onDragEnd)
    }

    const addPolygonToMap = () => {
        /*
      // If a layer with ID 'state-data' exists, remove it.
if (map.getLayer('state-data')) map.removeLayer('state-data');

map.removeSource('bathymetry-data');
*/
        console.log(map)
        // var sourceObject = map.getSource('points') // undefined if not a source on the map...
        debugger
        map.addSource('test', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: coords,
                    // coordinates: [
                    //     [
                    //         [-67.13734351262877, 45.137451890638886],
                    //         [-66.96466, 44.8097],
                    //         [-68.03252, 44.3252],
                    //         [-69.06, 43.98],
                    //         [-70.11617, 43.68405],
                    //         [-70.64573401557249, 43.090083319667144],
                    //         [-70.75102474636725, 43.08003225358635],
                    //         [-70.79761105007827, 43.21973948828747],
                    //         [-70.98176001655037, 43.36789581966826],
                    //         [-70.94416541205806, 43.46633942318431],
                    //         [-71.08482, 45.3052400000002],
                    //         [-70.6600225491012, 45.46022288673396],
                    //         [-70.30495378282376, 45.914794623389355],
                    //         [-70.00014034695016, 46.69317088478567],
                    //         [-69.23708614772835, 47.44777598732787],
                    //         [-68.90478084987546, 47.184794623394396],
                    //         [-68.23430497910454, 47.35462921812177],
                    //         [-67.79035274928509, 47.066248887716995],
                    //         [-67.79141211614706, 45.702585354182816],
                    //         [-67.13734351262877, 45.137451890638886],
                    //     ],
                    // ],
                },
            },
        })

        map.addLayer({
            id: 'test',
            type: 'fill',
            source: 'test',
            layout: {},
            paint: {
                'fill-color': '#088',
                'fill-opacity': 0.8,
            },
        })
    }

    useEffect(() => {
        const initializeMap = ({ setMap, mapContainer }) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: coords, // TODO: need to find centroid of polygons
                // center: [-11.3516, 8.0819], // TODO: need to find centroid of polygons
                zoom: 5,
            })

            map.addControl(new mapboxgl.FullscreenControl())

            const draw = new MapboxDraw({
                displayControlsDefault: true,
                controls: {
                    polygon: true,
                    trash: true,
                },
            })
            map.addControl(draw, position.topLeft)

            map.on('load', () => {
                setMap(map)
                map.resize()
                // addMarkerToMap(map)
                // addPolygonToMap() // put in setTimeout sooooo map has time to change in state?
            })
            map.on('click', e => {
                console.log(e)
            })
        }

        if (!map) initializeMap({ setMap, mapContainer })
        if (dragable) {
            addMarkerToMap() //TODO: ADD ME BACK IN
        }
        if (map) {
            addMarkerToMap() //TODO: ADD ME BACK IN
            // addPolygonToMap()
        }
        if (map && !dragable && activeMarker) {
            //make sure we can't drag the marker once we've "saved" it
            activeMarker.setDraggable(false)
        }
    }, [map, dragable])
    return (
        <div style={wrapperStyle}>
            <div
                ref={el => (mapContainer.current = el)}
                id="map"
                style={styles}
            ></div>
            <pre id="coordinates" className="coordinates"></pre>
        </div>
    )
}

export default MiniMap

MiniMap.propTypes = {
    coords: PropTypes.array.isRequired,
    dragable: PropTypes.bool.isRequired,
    updateCoords: PropTypes.func.isRequired,
}
