
import Image from "react-bootstrap/Image";
import { NavLink } from "react-router-dom";
import { Post, PostComment} from "../posts/PostInterface"


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
