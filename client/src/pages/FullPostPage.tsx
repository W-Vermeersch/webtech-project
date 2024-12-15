import "./FullPostPage.css";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.tsx";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import "./../Spinner.css";

import MapContainer from "../components/posts/full-post/MapContainer";
import Description from "../components/posts/full-post/Description";
import UserSection from "../components/posts/full-post/UserSection";
import PostImage from "../components/posts/full-post/PostImage";
import { Post, PostComment, User } from "../components/posts/PostInterface";
import { FETCH_POST, FETCH_USER_PROFILE } from "../api/urls";

// later make modules of components

export default function FullPost() {
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { post_id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    async function fetchPost() {
      try {
        if (state && state.post) {
          setPost(state.post);
          console.log("state post: ", state.post);
        } else {
          const resp = await axios.get(FETCH_POST, { params: { post_id } });
          if (resp.data.redirect) {
            navigate(resp.data.redirect, { replace: true });
          } else {
            console.log(resp.data);
            setPost(resp.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    }

    fetchPost();
  }, [post_id, navigate]);

  useEffect(() => {
    async function fetchUser(username: string) {
      try {
        const resp = await axios.get(FETCH_USER_PROFILE, {
          params: { username },
        });
        console.log("user: ", resp.data);
        if (resp.data.redirect) {
          navigate(resp.data.redirect, { replace: true });
        } else {
          setUser(resp.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (post && (post.user || post.username)) {
      fetchUser(post.user ? post.user : post.username);
    }
  }, [post, navigate]);

  if (!post || !user) {
    return null;
  }

  return (
    <>
      {isLoading && <Spinner className="spinner" animation="border" variant="succes" />}
      <div id="full-post">
        <Row
          style={{ height: "80vh" }}
          id="full-post-row"
          className="flex-nowrap flex-md-wrap row-cols-md-3"
        >
          <Col xs={12} md={6} className="order-md-4 order-2">
            <PostImage
              image_url={post.image_url}
              tags={post.tags}
              location={post.location}
            />
          </Col>
          <Col xs={12} md={6} className="order-md-1 order-1">
            <div id="user" className="p-2 px-4 mb-3 mb-md-1 mt-md-3 rounded">
              <UserSection
                username={user.username}
                profile_pic={`/src/assets/${post.profile_picture}`}
                level={user.totalexp}
              />
            </div>
          </Col>
          <Col xs={12} md={6} className="order-md-2 order-3">
            <Row>
              <Description description={post.description} />
            </Row>
          </Col>
          <Col xs={12} md={6} className="order-md-3 order-4">
            <Row>
              <MapContainer
                location={post.location}
                zoom={5}
                className="shadow-lg"
              />
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
