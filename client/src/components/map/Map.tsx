import "leaflet/dist/leaflet.css";
import "./map.css";

import { MapContainer, TileLayer } from "react-leaflet";
import axios from "../../api/axios";
import { useState, useEffect } from "react";
import { FETCH_RANDOM_POSTS } from "../../api/urls";
import MarkerClusterGroup from "react-leaflet-cluster";
import useAuthUser from "../../hooks/useAuthUser";
import { Post } from "../posts/PostInterface";

import MapMarker from "../profile/MapMarker";

import { Button, ButtonGroup } from "react-bootstrap";

interface Location {
  lat: number;
  lng: number;
}

function Map() {
  const [location, setLocation] = useState<Location | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [refresh, setRefresh] = useState(false);
  const user = useAuthUser();

  function handleRefresh() {
    localStorage.removeItem("posts");
    setPosts(null);
    setRefresh((prev) => !prev);
  }


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });

    async function fetchPosts() {
      const rawPosts = localStorage.getItem("posts");
      const storedPosts = rawPosts ? JSON.parse(rawPosts) : null;
      if (storedPosts && storedPosts.length !== 0) {
        setPosts(storedPosts);
        return;
      }

      try {
        const resp = await axios.get(FETCH_RANDOM_POSTS, {
          params: { nr_of_posts: 4, userId: user ? user.userID : -1 },
        });
        setPosts(resp.data.posts);
        localStorage.setItem("posts", JSON.stringify(resp.data.posts));
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    }

    fetchPosts();
  }, [refresh]);


  return (
    <div className="map-container">
      <ButtonGroup id="post-filter" aria-label="Basic example">
        <Button variant="success">All</Button>
        <Button variant="success">Following</Button>
      </ButtonGroup>
      <Button id="post-refresh" variant="success" onClick={handleRefresh}>
        Refresh
      </Button>
      <MapContainer
        center={location ? location : [50.822376, 4.395356]}
        zoom={2}
        scrollWheelZoom={true}
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
          {posts &&
            posts.map((post, index) => <MapMarker key={index} post={post} />)}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export { Map };
