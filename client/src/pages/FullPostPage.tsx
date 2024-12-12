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
import { Post, PostComment } from "../components/posts/PostInterface"
import { FETCH_POST } from "../api/urls";

// later make modules of components

interface User {
  username: string;
  profile_pic: string;
  level: number;
}


const mockUser: User = {
  username: "username",
  profile_pic: "https://dummyimage.com/100",
  level: 1,
};

const mockPost: Post = {
  user: "username",
  image_url:
    "https://cdn.shopify.com/s/files/1/1577/4333/files/IMG-3186_-_Andy_Dobrzynski.jpg?v=1646875888",
  description: "Look at this post! It's so cool!",
  tags: ["#tag1", "#tag2"],
  likes: 5,
  latitude: 50.822376,
  longitude: 4.395356,
};

export default function FullPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const resp = await axios.get(FETCH_POST, { params: { id } });
      if (resp.data.redirect) {
        navigate(resp.data.redirect);
      } else {
        setPost(resp.data); 
      }
    }
    fetchPost();
  }, [id]);

  if (!post) {
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
          <PostImage image_url={mockPost.image_url} tags={mockPost.tags} latitude={mockPost.latitude} longitude={mockPost.longitude} />
        </Col>
        <Col xs={12} md={6} className="order-md-1 order-1">
          <div id="user" className="p-2 px-4 mb-3 mb-md-1 mt-md-3 rounded">
            <UserSection
              username={mockUser.username}
              profile_pic={mockUser.profile_pic}
              level={mockUser.level}
            />
          </div>
        </Col>
        <Col xs={12} md={6} className="order-md-2 order-3">
          <Row>
            <Description description={mockPost.description} />
          </Row>
        </Col>
        <Col xs={12} md={6} className="order-md-3 order-4">
          <Row>
            <MapContainer post={mockPost} zoom={10} className="shadow-lg" />
          </Row>
        </Col>
      </Row>
    </div>
  );
}
