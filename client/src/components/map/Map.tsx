import {MapContainer, TileLayer, useMap} from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import './map.css';

function TheMap() {
    const map = useMap()
    console.log('map center:', map.getCenter())
    return (<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>)
}

function Map() {
    return (
        <MapContainer center={[50.822376, 4.395356]} zoom={13}>
            <TheMap />
        </MapContainer>
    )
}

export {Map};