import React from "react";
// @ts-ignore
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { geojson } from "./GeoDataExamples";
import L from "leaflet";
import "leaflet.heat";
import './map.css';

class MyMap extends React.Component {
    addressPoints: [number, number, number][] = []; // lat, lng, intensity
    state: { lat: number; lng: number; zoom: number; position: number[]; };

    constructor() {
        super();
        this.state = {
            lat: 50.822376,
            lng: 4.395356,
            zoom: 12,
            position: [50.822376, 4.395356]
        };
    }

    HeatLayer = () => {
        const map = useMap();
        React.useEffect(() => {
            const points = geojson.features.map(feature =>  feature.geometry.coordinates);// addressPoints.map((p) => [p[0], p[1], p[2]]);
            L.heatLayer(points).addTo(map);
        }, [map, this.addressPoints]);

        return null; // No UI element to render
    };

    render() {
        return (
            <MapContainer center={this.state.position} zoom={this.state.zoom}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                <this.HeatLayer />

            </MapContainer>
        );
    }
}

export {MyMap};