import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "./map.css";
import "leaflet/dist/leaflet.css";

interface Post {
  user?: string;
  image_url: string; // url to the storage api
  idx?: number; // index of Post
  description?: string;
  tags?: string[];
  likes?: number; // in DB each posts has a list of all Users who liked
  longitude: number;
  latitude: number;
}

interface MapContainerProps {
  post: Post;
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

export default function MapContainer({ post, zoom, className }: MapContainerProps) {
  return (
    <div className={"map-wrapper mb-3 mb-md-0 " + className}>
      <LeafletMapContainer
        center={[post.latitude, post.longitude]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[post.latitude, post.longitude]} />
      </LeafletMapContainer>
    </div>
  );
}
