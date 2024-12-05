
import Image from "react-bootstrap/Image";
import { NavLink } from "react-router-dom";

export interface Post {
  title?: string;
  user?: string;
  image_url: string; // url to the storage api
  idx?: number; // index of Post
  description?: string;
  tags?: string[];
  likes?: number; // in DB each posts has a list of all Users who liked
  longitude?: number | undefined;
  latitude?: number | undefined;
  // added because profile pictures also exist
  profilepicurl?: string;
}

interface PostGalleryProps {
  posts: Post[];
}

export default function PostGallery({ posts }: PostGalleryProps) {
  return posts.map((post) => (
    <div className="m-2">
    <NavLink to="#">
      <Image src={post.image_url} rounded />
    </NavLink>
    </div>
    
  ));
}
