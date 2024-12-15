import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";

interface Location {
  latitude: number;
  longitude: number;
}

interface MapContainerProps {
  location: Location;
  zoom: number;
  className?: string;
}

// Initialize Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapContainer({
  location,
  zoom,
  className,
}: MapContainerProps) {
  return (
    <div className={"map-wrapper-fp mb-3 mb-md-0 " + className}>
      <LeafletMapContainer
        center={[location.latitude, location.longitude]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="map-container-fp"
      >
        <TileLayer
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          attribution="Google Maps"
        />

        <Marker position={[location.latitude, location.longitude]} />
      </LeafletMapContainer>
    </div>
  );
}
