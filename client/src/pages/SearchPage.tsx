import "./SearchPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { SEARCH_USER } from "../api/urls";

import { User, Post } from "../components/posts/PostInterface";
import PostTile from "../components/searchResults/PostTile";
import ProfileTile from "../components/searchResults/ProfileTile";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export default function SearchPage() {
  const { type, search } = useParams();
  const searchType = type === "tag" ? "#" : "@";
  const [radius, setRadius] = useState(0);
  const radius_input = useRef<HTMLInputElement>(null);
  const location_input = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);


  useEffect(() => {
    async function fetchSearchResults() {
      if (searchType === "@") {
        // Fetch users
        const resp = await axios.get(SEARCH_USER, {
          params: { username: search },
        });
        setPosts([]);
        setUsers(resp.data.users);
      } else {
        // fetch posts
      }

      // call fetchSearchResults
    }
  }, [search]);

  return (
    <>
      <Form className="search-filter mb-3">
        <Row xs={2} className="justify-content-end">
          <Col>
            <Form.Group className="country-filter mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" placeholder="Belgium" disabled={searchType === "@"} ref={location_input}/>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="radius-filter">
              <Form.Label>Radius: {radius}</Form.Label>
              <Form.Range
                className="radius-input"
                min={0}
                max={10000000}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                step={100000}
                disabled={searchType === "@"}
                ref={radius_input}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <div>
        <Container
          className="d-flex flex-wrap justify-content-center"
          style={{ maxHeight: "80vh" }}
        >
          <Row className="justify-content-center">
            {searchType === "#" ? (
              posts.length === 0 ? (
                <h1>No posts found</h1>
              ) : (
                posts.map((post: Post) => (
                  <Col xs="auto" key={post.idx}>
                    <PostTile post={post} />
                  </Col>
                ))
              )
            ) : users.length === 0 ? (
              <h1>No users found</h1>
            ) : (
              users.map((user: User) => (
                <Col xs="auto" key={user.user_id}>
                  <ProfileTile user={user} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </div>
    </>
  );
}
