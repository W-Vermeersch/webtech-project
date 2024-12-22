import "./PostGallery.css";
import Image from "react-bootstrap/Image";
import { NavLink } from "react-router-dom";
import { Post } from "../posts/PostInterface";

interface PostGalleryProps {
  posts: Post[];
}

export default function PostGallery({ posts }: PostGalleryProps) {
  return posts.map((post, idx) => (
    <div className="m-2" key={idx}>
      <NavLink to={`/post/${post.post_id}`} state={{ post }}>
        <Image src={post.image_url} rounded className="gallery-image" />
      </NavLink>
    </div>
  ));
}
