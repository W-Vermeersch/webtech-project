import "leaflet/dist/leaflet.css";
import "./map.css";

import { MapContainer, TileLayer } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import L from "leaflet";
import axios from "../../api/axios";
import { useState, useEffect, useRef } from "react";
import { FETCH_RANDOM_POSTS } from "../../api/urls";
import MarkerClusterGroup from "react-leaflet-cluster";
import useAuthUser from "../../hooks/useAuthUser";
import { Post } from "../posts/PostInterface";

import MapMarker from "../profile/MapMarker";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import "../../Spinner.css";

interface State {
  posts: Post[];
}

function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as State | undefined;
  const mapRef = useRef<L.Map | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthUser();

  function handleRefresh() {
    localStorage.removeItem("posts");
    if (posts && posts.length === 0) {
      Cookies.remove("shown_post_ids");
    }
    setPosts(null);
    setRefresh((prev) => !prev);
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

      try {
        // if not logged in, send -1 as userId
        // nr_of_posts is the number of posts to fetch
        const resp = await axios.get(FETCH_RANDOM_POSTS, {
          params: { nr_of_posts: 4, userId: user ? user.userID : -1 },
        });
        setPosts(resp.data.posts);
        localStorage.setItem("posts", JSON.stringify(resp.data.posts));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [refresh]);

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
        <Button id="post-refresh" variant="success" onClick={handleRefresh}>
          Refresh
        </Button>
      )}

      {state && state.posts && (
        <Button
          id="post-search"
          variant="dark"
          onClick={() => navigate("/search", { state: { posts: state.posts } })}
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
      </MapContainer>
    </div>
  );
}

export { Map };
