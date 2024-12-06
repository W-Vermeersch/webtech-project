import { Badge } from "react-bootstrap";
import "./FullPost.css";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import MapContainer from "./MapContainer";

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
  image_url: "https://dummyimage.com/180",
  description: "Look at this post! It's so cool!",
  tags: ["#tag1", "#tag2"],
  likes: 5,
  latitude: 50.822376,
  longitude: 4.395356,
};

export default function FullPost() {
  return (
    <Container>
      <Row xs={1} md={2} style={{ height: "80vh" }}>
        <Col
          md={7}
          lg={6}
          className="d-flex justify-content-center align-items-center mb-4 mb-md-0"
        >
          <div id="post-image-container">
            <Image id="post-image" src={mockPost.image_url} alt="post" fluid />
          </div>
        </Col>
        <Col md={5} lg={6}>
          <Container>
            <Row>
              <Col xs="auto">
                <Image
                  src={mockUser.profile_pic}
                  alt="profile pic"
                  roundedCircle
                />
              </Col>
              <Col>
                <h2>{mockUser.username}</h2>
                <h3>{"Level " + mockUser.level}</h3>
              </Col>
            </Row>
            <Row>
              <div className="card text-bg-dark mt-3 mb-3" >
                <div className="card-body">
                  <p className="card-text">{mockPost.description}</p>
                    <Stack direction="horizontal" gap={2}>
                        {mockPost.tags?.map((tag) => (
                        <Badge key={tag} bg="success">{tag}</Badge>
                        ))}
                    </Stack>
                </div>
              </div>
            </Row>
            <Row>
                <MapContainer post={mockPost}/>
            </Row>
            </Container>
        </Col>
      </Row>
    </Container>
  );
}
