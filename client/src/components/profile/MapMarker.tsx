import "./mapMarker.css";

import { Marker, Popup } from "react-leaflet";
import { Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Post } from "../posts/PostInterface";
import L from "leaflet";

interface MapMarkerProps {
  post: Post;
}

export default function MapMarker({ post }: MapMarkerProps) {

  // This component is used to display a custom marker on the map with post image as the icon and a popup with the post image
  const myIcon = L.divIcon({
    html: `<div class="custom-icon" style="background-image: url(${post.image_url});"></div>`,
    className: "custom-icon-wrapper",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
  });

  return (
    <Marker
      position={[post.location.latitude, post.location.longitude]}
      icon={myIcon}
    >
      <Popup offset={[0, -50]} className="popup">
        <NavLink to={`/post/${post.idx}`} state={{ post }}>
          <div className="nes-container is-rounded p-0">
            <Image src={post.image_url[0]} className="popup-image" />
          </div>
        </NavLink>
      </Popup>
    </Marker>
  );
}
