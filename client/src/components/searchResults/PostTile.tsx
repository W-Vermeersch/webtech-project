import "./PostTile.css";
import { NavLink } from "react-router-dom";
import { Post } from "./../posts/PostInterface";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import Col from "react-bootstrap/Col";

interface PostTileProps {
  post: Post;
  onTagClicked: (tag: string) => void;
}

export default function ProfileTile({ post, onTagClicked }: PostTileProps) {
  return (
    <div className="post-tile nes-container is-centered">
      <Stack gap={4} className="d-flex flex-column align-items-center">
        <NavLink to={`/post/${post.idx}`} state={{ post }}>
          <div className="nes-container is-rounded p-0">
            <Image src={post.image_url} rounded/>
          </div>
        </NavLink>
        <div className="badge-container">
          {post.tags[0] !== "None"
            ? post.tags.map((tag) => (
                <Col key={post.idx} xs="auto"> 
                  <Badge key={post.idx} bg="dark" className="badge-tag m-2" onClick={() => onTagClicked(tag)}>
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
