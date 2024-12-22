import { useEffect, useRef, useState } from "react";
import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import MapMarker from "./MapMarker";
import "./map.css";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Post } from "../posts/PostInterface";

interface MapContainerProps {
  posts: Post[];
  center: [number, number];
  activeTab: boolean;
}

// Initialize Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapContainer({ posts, center, activeTab }: MapContainerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Set the map bounds to fit all the post markers
    if (posts.length > 0) {
      const bounds = L.latLngBounds(
        posts.map((post) => [post.location.latitude, post.location.longitude])
      );
      mapRef.current?.fitBounds(bounds, { padding: [100, 100] });
    }
    setActive(activeTab);

  }, [active]);

  return (
    <div className="map-wrapper-pp">
      <LeafletMapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="map-container-pp"
        ref={mapRef}
      >
        <TileLayer
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          attribution="Google Maps"
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
