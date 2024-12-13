import "./FullPostPage.css";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import MapContainer from "../components/posts/full-post/MapContainer";
import Description from "../components/posts/full-post/Description";
import UserSection from "../components/posts/full-post/UserSection";
import PostImage from "../components/posts/full-post/PostImage";
import { Post, PostComment, User } from "../components/posts/PostInterface"
import { FETCH_POST, FETCH_USER_PROFILE } from "../api/urls";

// later make modules of components

export default function FullPost() {
  const navigate = useNavigate();
  const { post_id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const resp = await axios.get(FETCH_POST, { params: { post_id } });
      if (resp.data.redirect) {
        navigate(resp.data.redirect, { replace: true });
      } else {
        setPost(resp.data); 
      }
    }

    async function fetchUser(username: string) {
      const resp = await axios.get(FETCH_USER_PROFILE, { params: { username } });
      if (resp.data.redirect) {
        navigate(resp.data.redirect, { replace: true });
    } else {
      setUser(resp.data);
    }
  }

    fetchPost();
    if (post) {
      fetchUser(post.user);
    }

  }, [post_id]);

  if (!post || !user) {
    return null;
  }

  return (
    <div id="full-post">
      <Row
        style={{ height: "80vh" }}
        id="full-post-row"
        className="flex-nowrap flex-md-wrap row-cols-md-3"
      >
        <Col xs={12} md={6} className="order-md-4 order-2">
          <PostImage image_url={post.image_url} tags={post.tags} location={post.location} />
        </Col>
        <Col xs={12} md={6} className="order-md-1 order-1">
          <div id="user" className="p-2 px-4 mb-3 mb-md-1 mt-md-3 rounded">
            <UserSection
              username={user.username}
              profile_pic={user.profilepicture}
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
            <MapContainer location={post.location} zoom={10} className="shadow-lg" />
          </Row>
        </Col>
      </Row>
    </div>
  );
}
