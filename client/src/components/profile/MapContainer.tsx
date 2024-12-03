import { useEffect } from "react";
import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import MapMarker from "./MapMarker";
import "./map.css";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

interface Post {
    title?: string;
    user?: string;
    image_url: string;
    idx?: number;
    description?: string;
    tags?: string[];
    likes?: number;
    longitude: number;
    latitude: number;
  }

interface MapContainerProps {
  posts: Post[];
  center: [number, number];
}

// Initialize Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapContainer({ posts, center }: MapContainerProps) {

  return (
    <div className="map-wrapper">
      <LeafletMapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
        >
          {posts.map((post, index) => (
            <MapMarker key={index} post={post} />
          ))}
        </MarkerClusterGroup>
      </LeafletMapContainer>
    </div>
  );
}