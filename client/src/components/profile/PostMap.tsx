import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

import "leaflet/dist/leaflet.css";
import { NavLink } from "react-router-dom";

interface Post {
  title?: string;
  user?: string;
  image_url: string; // url to the storage api
  idx?: number; // index of Post
  description?: string;
  tags?: string[];
  likes?: number; // in DB each posts has a list of all Users who liked
  longitude: number;
  latitude: number;
}

interface PostMapProps {
  posts: Post[];
  center: [number, number];
}

export default function PostMap({ posts, center }: PostMapProps) {
  return (
    <MapContainer
      style={{ height: "450px", width: "100%" }}
      center={center}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {posts.map((post, index) => (
        <Marker key={index} position={[post.latitude, post.longitude]}>
          <Popup>
            <NavLink to="#">
              <Image src={post.image_url} rounded />
            </NavLink>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
