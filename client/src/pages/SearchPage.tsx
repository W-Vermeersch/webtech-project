import "./SearchPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { SEARCH_USER, SEARCH_TAG } from "../api/urls";
import { getLatLng } from "../geocoding";

import { User, Post } from "../components/posts/PostInterface";
import PostTile from "../components/searchResults/PostTile";
import ProfileTile from "../components/searchResults/ProfileTile";
import Search from "../components/navBar/Search";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export default function SearchPage() {
  const [searchType, setSearchType] = useState("@");
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(0);
  const radius_input = useRef<HTMLInputElement>(null);
  const location_input = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  async function fetchFiltered() {
    console.log("fetching filtered");
    const locationValue = location_input.current?.value;
    let latLng;
    if (locationValue) {
      latLng = await getLatLng(locationValue);
      console.log(latLng);
    }
    try {
      const resp = await axios.get(SEARCH_TAG, {
        params: {
          tags: search,
          latitude: latLng?.lat,
          longitude: latLng?.lng,
          radius: radius * 1000,
          filter_enabled: true,
        },
      });
      setUsers([]);
      //console.log(resp.data.posts);
      setPosts(resp.data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  }

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
        try {
          const resp = await axios.get(SEARCH_TAG, {
            params: {
              tags: [search],
              latitude: 1000,
              longitude: 1000,
              radius,
              filter_enabled: false,
            },
          });
          setUsers([]);
          setPosts(resp.data.posts);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        }
      }
    }

    fetchSearchResults();
  }, [search]);

  return (
    <>
      <Search
        setSearchType={setSearchType}
        onSearchComplete={setSearch}
        className="mb-4"
      />
      <Form
        className={`search-filter mb-3 ${searchType === "@" ? "d-none" : ""}`}
      >
        <Row
          xs={3}
          className="d-flex align-items-center justify-content-center"
        >
          <Col>
            <Form.Group className="country-filter mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Belgium"
                disabled={searchType === "@"}
                ref={location_input}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="radius-filter">
              <Form.Label>Radius: {radius} km</Form.Label>
              <Form.Range
                className="radius-input"
                min={0}
                max={2000}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                step={50}
                disabled={searchType === "@"}
                ref={radius_input}
              />
            </Form.Group>
          </Col>
          <Col
            xs="auto"
            className="d-flex align-items-center justify-content-center"
          >
            <Button variant="danger" onClick={fetchFiltered}>
              Apply Filter
            </Button>
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
