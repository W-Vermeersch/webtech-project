import { Marker, Popup } from "react-leaflet";
import { Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Post } from "../posts/PostInterface"

interface MapMarkerProps {
  post: Post;
}

export default function MapMarker({ post }: MapMarkerProps) {
  return (
    <Marker position={[post.latitude, post.longitude]}>
      <Popup>
        <NavLink to="#">
          <Image src={post.image_url} alt={post.title || "Post image"} />
        </NavLink>
      </Popup>
    </Marker>
  );
}
