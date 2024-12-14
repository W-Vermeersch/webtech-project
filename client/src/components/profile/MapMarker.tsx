import './mapMarker.css'

import { Marker, Popup } from "react-leaflet";
import { Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Post } from "../posts/PostInterface";
import L from "leaflet";


interface MapMarkerProps {
  post: Post;
}

export default function MapMarker({ post }: MapMarkerProps) {

  const myIcon = L.divIcon({
    html: `<div class="custom-icon" style="background-image: url(${post.image_url});"></div>`,
    className: "custom-icon-wrapper",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
  });

  return (
    <Marker position={[post.location.latitude, post.location.longitude]} icon={myIcon}>
      <Popup offset={[0, -50]}>
        <NavLink to={`/post/${post.idx}`}>
          <Image src={post.image_url}/>
        </NavLink>
      </Popup>
    </Marker>
  );
}
