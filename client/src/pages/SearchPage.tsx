import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { User, Post } from "../components/posts/PostInterface";
import PostTile from "../components/searchResults/PostTile";
import ProfileTile from "../components/searchResults/ProfileTile";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function SearchPage() {
  const { type, search } = useParams();
  const searchType = type === "tag" ? "#" : "@";
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);


  useEffect(() => {
    // if (searchType === "#") {
    //   setUsers([]);
    //   setPosts();
    // } else {
    //   setPosts([]);
    //   setUsers();
    // }
  });

  return (
    <div>
      <Container
        className="d-flex flex-wrap justify-content-center"
        style={{ maxHeight: "80vh"}}
      >
        <Row className="justify-content-center">
          {searchType === "#"
            ? posts?.map((post: Post) => (
                <Col xs="auto">
                  <PostTile post={post} key={post.idx} />
                </Col>
              ))
            : users?.map((user: User) => (
                <Col xs="auto">
                  <ProfileTile user={user} key={user.user_id} />
                </Col>
              ))}
        </Row>
      </Container>
    </div>
  );
}
