import { Marker, Popup } from "react-leaflet";
import { Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";

interface PostComment{
  idx: number; // index to refer to Post
  user: string;
  comment: string;
}

interface Post {
  title?: string;
  user?: string;
  image_url: string; // url to the storage api
  idx?: number; // index of Post
  description?: string;
  tags: string[];
  likes?: number; // in DB each posts has a list of all Users who liked
  longitude: number;
  latitude: number;
  // added because profile pictures also exist
  profilepicurl?: string;
  commentsection?: PostComment[];
}

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
