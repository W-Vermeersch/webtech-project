import "./PostTile.css";
import { NavLink } from "react-router-dom";
import { Post } from "./../posts/PostInterface";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface PostTileProps {
  post: Post;
}

export default function ProfileTile({ post }: PostTileProps) {
  return (
    <div className="post-tile">
      <Stack gap={4} className="d-flex flex-column align-items-center">
        <NavLink to={`/post/${post.idx}`} state={{ post }}>
          <div>
            <Image src={post.image_url} rounded />
          </div>
        </NavLink>
        <div className="badge-container">
          {post.tags[0] !== "None"
            ? post.tags.map((tag) => (
                <Col key={post.idx} xs="auto"> 
                  <Badge key={tag} bg="dark" className="badge-tag m-2">
                    #{tag}
                  </Badge>
                </Col>
              ))
            : null}
        </div>
      </Stack>
    </div>
  );
}
