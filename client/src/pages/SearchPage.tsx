import "./SearchPage.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import Spinner from "react-bootstrap/Spinner";
import "./../Spinner.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { posts: Post[] } | undefined;
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("@");
  const [radius, setRadius] = useState(0);
  const radius_input = useRef<HTMLInputElement>(null);
  const location_input = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (state) {
      setSearchType("#");
      setPosts(state.posts);
      setUsers([]);
    }
  }, [state]);

  async function fetchSearchResults(search: string) {
    setSearch(search);
    setIsLoading(true);
    if (searchType === "@" && search.length > 2) {
      // Fetch users
      const resp = await axios.get(SEARCH_USER, {
        params: { username: search },
      });
      setPosts([]);
      setUsers(resp.data.users);
      setIsLoading(false);
    } else {
      // fetch posts
      const tags = search.split(" ");
      try {
        const resp = await axios.get(SEARCH_TAG, {
          params: {
            tags: tags,
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
      } finally {
        setIsLoading(false);
        }
      }
    }
  

  async function fetchFiltered() {
    setIsLoading(true);
    const locationValue = location_input.current?.value;
    let latLng;
    if (locationValue) {
      latLng = await getLatLng(locationValue);
    }
    try {
      const tags = search.split(" ");
      console.log(latLng);
      const resp = await axios.get(SEARCH_TAG, {
        params: {
          tags: tags,
          latitude: latLng?.lat,
          longitude: latLng?.lng,
          radius: radius * 1000,
          filter_enabled: true,
        },
      });
      setUsers([]);
      setPosts(resp.data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && (
        <Spinner animation="border" className="spinner" variant="success" />
      )}

      <Search
        setSearchType={setSearchType}
        onSearchComplete={fetchSearchResults}
        symbol={searchType}
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
                max={300}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                step={25}
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
          <Col
            xs="auto"
            className="d-flex align-items-center justify-content-center"
          >
            <Button
              variant="dark"
              className={search ? "" : "disabled"}
              onClick={() => navigate("/map", { state: { posts } })}
            >
              View on Map
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
