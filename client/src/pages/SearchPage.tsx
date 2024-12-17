import "./SearchPage.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { SEARCH_USER, SEARCH_TAG, SEARCH_TAG_FOLLOWING } from "../api/urls";
import { getLatLng } from "../geocoding";

import { User, Post, Location } from "../components/posts/PostInterface";
import PostTile from "../components/searchResults/PostTile";
import ProfileTile from "../components/searchResults/ProfileTile";
import Search from "../components/navBar/Search";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import Spinner from "react-bootstrap/Spinner";
import "./../Spinner.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const state = location.state as
    | { posts: Post[]; location: string; radius: number }
    | undefined;
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("@");
  const [radius, setRadius] = useState(0);
  const radius_input = useRef<HTMLInputElement>(null);
  const location_input = useRef<HTMLInputElement>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const [useUserLocation, setUseUserLocation] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (state) {
      setSearchType("#");
      if (location_input.current) {
        location_input.current.value = state.location;
      }
      setRadius(state.radius);
      setPosts(state.posts);
      setUsers([]);
    }
  }, [state]);

  function success(position) {
    const loc: Location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setUserLocation(loc);
  }

  function nop() {
    setUserLocation(null);
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, nop);
    }
  });

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
        const resp = await (following ? axiosPrivate : axios).get(
          following ? SEARCH_TAG_FOLLOWING : SEARCH_TAG,
          {
            params: {
              tags: tags,
              latitude: NaN,
              longitude: NaN,
              radius,
              filter_enabled: false,
            },
          }
        );
        if (resp.data.redirect) {
          navigate(resp.data.redirect, { replace: true });
        }
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
    if (useUserLocation) {
      latLng = userLocation;
    } else if (locationValue) {
      latLng = await getLatLng(locationValue);
    }
    try {
      const tags = search.split(" ");
      const resp = await (following ? axiosPrivate : axios).get(
        following ? SEARCH_TAG_FOLLOWING : SEARCH_TAG,
        {
          params: {
            tags: tags,
            latitude: latLng?.latitude,
            longitude: latLng?.longitude,
            radius: radius * 1000,
            filter_enabled: true,
          },
        }
      );
      if (resp.data.redirect) {
        navigate(resp.data.redirect, { replace: true });
      }
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
                placeholder={
                  useUserLocation ? "Your Location" : "Enter Location"
                }
                disabled={useUserLocation}
                ref={location_input}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Form.Group className="radius-filter">
              <Form.Label>Radius: {radius} km</Form.Label>
              <Form.Range
                className="radius-input"
                min={0}
                max={300}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                step={10}
                disabled={searchType === "@"}
                ref={radius_input}
              />
            </Form.Group>
          </Col>

          <Col xs="auto">
            <Form.Check
              type="switch"
              label={following ? "Following" : "All Posts"}
              id="custom-switch"
              onClick={() => setFollowing(!following)}
            />
            <Form.Check
              type="switch"
              label={
                useUserLocation ? "Use Your Location" : "Specified Location"
              }
              id="disabled-custom-switch"
              onClick={() => setUseUserLocation(!useUserLocation)}
            />
          </Col>
          <Col
            xs="auto"
            className="d-flex align-items-center justify-content-center"
          >
            <Stack gap={1}>
              <Button variant="danger" onClick={fetchFiltered}>
                Apply Filter
              </Button>
              <Button
                variant="dark"
                className={posts.length !== 0 ? "" : "disabled"}
                onClick={() =>
                  navigate("/map", {
                    state: {
                      posts,
                      location: location_input.current!.value,
                      radius,
                    },
                  })
                }
              >
                View on Map
              </Button>
            </Stack>
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
                    <PostTile post={post} onTagClicked={fetchSearchResults} />
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
