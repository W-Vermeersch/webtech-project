import "leaflet/dist/leaflet.css";
import "./map.css";

import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import L from "leaflet";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState, useEffect, useRef } from "react";
import { FETCH_RANDOM_POSTS, FETCH_RANDOM_FOLLOW_POSTS } from "../../api/urls";
import MarkerClusterGroup from "react-leaflet-cluster";
import useAuthUser from "../../hooks/useAuthUser";
import { Post, Location } from "../posts/PostInterface";

import MapMarker from "../profile/MapMarker";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "../../Spinner.css";

interface NoPostsModalProps {
  show: boolean;
  handleClose: () => void;
}

const NoPostsModal: React.FC<NoPostsModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>No More Posts</Modal.Title>
      </Modal.Header>
      <Modal.Body>You have gone through all the posts. Refresh to see previous posts {":)"} </Modal.Body>
    </Modal>
  );
};

interface State {
  posts: Post[];
  location: string;
  radius: number;
}

function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as State | undefined;
  const mapRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [following, setFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const user = useAuthUser();
  const axiosPrivate = useAxiosPrivate();

  // get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);
  
  // refresh the posts
  function handleRefresh() {
    if (!user && following) {
      navigate("/user/log-in", { state: { from: location } });
    } else {
      localStorage.removeItem("posts");
      if (posts && posts.length === 0) {
        Cookies.remove("shown_post_ids");
      }
      setPosts(null);
      setRefresh((prev) => !prev);
    }
  }

  useEffect(() => {
    setIsLoading(true);

    // locally store the posts to avoid refresh when navigating/refreshing the page
    async function fetchPosts() {
      const rawPosts = localStorage.getItem("posts");
      const storedPosts = rawPosts ? JSON.parse(rawPosts) : null;
      if (storedPosts && storedPosts.length !== 0) {
        setPosts(storedPosts);
        setIsLoading(false);
        return;
      }
      // if not logged in, send -1 as userId
      // nr_of_posts is the number of posts to fetch
      let resp;
      if (!following) {
        resp = await axiosPrivate.get(FETCH_RANDOM_POSTS, {
          params: { nr_of_posts: 4, userId: user ? user.userID : -1 },
        });
      } else {
        resp = await axiosPrivate.get(FETCH_RANDOM_FOLLOW_POSTS, {
          params: { nr_of_posts: 4 },
        });
      }
      console.log(resp.data.posts);
      if (resp.data.redirect) {
        // not authenticated
        navigate(resp.data.redirect, {
          state: { from: location },
          replace: true,
        });
      } else {
        if (resp.data.posts.length === 0) {
          setShowModal(true);
        }
        setPosts(resp.data.posts);
        localStorage.setItem("posts", JSON.stringify(resp.data.posts));
      }
      setIsLoading(false);
    }

    fetchPosts();
  }, [refresh]);

  // if navigating from search page, fit the map to the search results, otherwise fit the map to the random posts
  useEffect(() => {
    if (mapRef.current) {
      if (state && state.posts && state.posts.length > 0) {
        const bounds = L.latLngBounds(
          state.posts.map((post) => [
            post.location.latitude,
            post.location.longitude,
          ])
        );
        mapRef.current.fitBounds(bounds, { padding: [100, 100] });
      } else if (posts && posts.length > 0) {
        const bounds = L.latLngBounds(
          posts.map((post) => [post.location.latitude, post.location.longitude])
        );
        mapRef.current.fitBounds(bounds, { padding: [100, 100] });
      }
    }
  }, [mapRef, posts, state]);

  return (
    <div className="map-container">
      {!state && (
        <>
          <Button id="post-refresh" variant="success" onClick={handleRefresh}>
            Refresh
          </Button>
          <ButtonGroup id="post-filter">
            <Button
              id="all-posts"
              variant="success"
              active={!following}
              onClick={() => setFollowing(false)}
            >
              All
            </Button>
            <Button
              id="following-posts"
              variant="success"
              active={following}
              onClick={() => setFollowing(true)}
            >
              Following
            </Button>
          </ButtonGroup>
        </>
      )}

      {state && state.posts && (
        <Button
          id="post-search"
          variant="dark"
          onClick={() =>
            navigate("/search", {
              state: {
                posts: state.posts,
                location: state.location,
                radius: state.radius,
              },
            })
          }
        >
          Back to Search
        </Button>
      )}

      {isLoading && (
        <Spinner className="spinner" animation="border" variant="success" />
      )}
      <MapContainer
        center={[50.822376, 4.395356]}
        zoom={2}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          attribution="Google Maps"
        />
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup keepInView>You are here</Popup>
          </Marker>
        )}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
        >
          {state && state.posts
            ? // from search results
              state.posts.map((post, index) => (
                <MapMarker key={index} post={post} />
              ))
            : // from random posts
              posts &&
              posts.map((post, index) => <MapMarker key={index} post={post} />)}
        </MarkerClusterGroup>
        <NoPostsModal show={showModal} handleClose={() => setShowModal(false)} />
      </MapContainer>
    </div>
  );
}

export { Map };
