import { Badge } from "react-bootstrap";
import "./FullPost.css";

import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import MapContainer from "../components/posts/full-post/MapContainer";

// later make modules of components

interface User {
  username: string;
  profile_pic: string;
  level: number;
}

interface Post {
  user?: string;
  image_url: string; // url to the storage api
  idx?: number; // index of Post
  description: string;
  tags?: string[];
  likes?: number; // in DB each posts has a list of all Users who liked
  longitude: number;
  latitude: number;
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
  return (
    <div id="full-post">
      <Row
        style={{ height: "80vh" }}
        id="full-post-row"
        className="flex-nowrap flex-md-wrap row-cols-md-3"
      >
        <Col xs={12} md={6} className="order-md-4 order-2">
          <div id="post-image-container">
            <Image id="post-image" src={mockPost.image_url} alt="post" fluid />
            <div id="image-overlay" className="d-flex flex-column">
              <h4 className="mb-auto">
                <Badge bg="danger" className="m-3">
                  City, Country
                </Badge>
              </h4>
              <Stack id="tags" direction="horizontal">
                {mockPost.tags?.map((tag) => (
                  <Badge key={tag} bg="success" className="m-2">
                    {tag}
                  </Badge>
                ))}
              </Stack>
              {/* add more things to overlay on the post image */}
            </div>
          </div>
        </Col>
        <Col xs={12} md={6} className="order-md-1 order-1">
          <div
            id="user"
            className="p-2 px-4 mb-3 mb-md-1 mt-md-3 rounded"
          >
            <Row className="">
              <Col xs="auto">
                <Image
                  src={mockUser.profile_pic}
                  alt="profile pic"
                  roundedCircle
                />
              </Col>
              <Col>
                <h2 className="text-light mt-2">{mockUser.username}</h2>
                <h3 className="text-light">{"Level " + mockUser.level}</h3>
              </Col>
              <Col xs="auto" className="ms-auto mt-auto">
                <Button variant="outline-light">Follow</Button>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={12} md={6} className="order-md-2 order-3">
          <Row>
            <div
              id="description"
              className="card text-bg-dark mt-3 mb-3 border border-secondary"
            >
              <div className="card-body">
                <p className="card-text">{mockPost.description}</p>
              </div>
            </div>
          </Row>
        </Col>
        <Col xs={12} md={6} className="order-md-3 order-4">
          <Row>
            <MapContainer post={mockPost} zoom={6} className="shadow-lg" />
          </Row>
        </Col>
      </Row>
    </div>
  );
}