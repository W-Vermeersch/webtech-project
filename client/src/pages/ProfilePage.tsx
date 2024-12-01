import "./ProfilePage.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import ProgressBar from "react-bootstrap/ProgressBar";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import PostGallery from "../components/profile/PostGallery";

const post = { image_url: "https://via.placeholder.com/180" };

const mockPosts = new Array(15).fill(post);

export default function ProfilePage() {
  return (
    <Container className="text-white rounded overflow-hidden border border-light shadow">
      <Row>
        <Col
          className="p-4 d-flex justify-content-center"
          id="userInfo"
          xs={12}
          lg={3}
        >
          <Stack className="align-items-center" gap={1}>
            <Image
              src="https://via.placeholder.com/180"
              alt="profile pic"
              className="rounded-circle"
            />
            <h3>Username</h3>
            <h4>Level 1</h4>
            <div className="w-100">
              <ProgressBar
                variant="success"
                now={600}
                max={1000}
                label={"current progress"}
              />
            </div>
            <Container className="p-3">
              <p className="text-center">
                Morbi feugiat lectus at luctus porta. Nunc interdum varius leo
                eget cursus. Etiam et massa et diam sagittis pretium suscipit
                sit amet purus. Nullam nec nunc nec nunc ultricies. Morbi
                feugiat lectus at luctus. {/* max size of the bio*/}
              </p>
            </Container>
          </Stack>
        </Col>
        <Col className="ps-3 pt-2" id="userPosts" xs={12} lg={9}>
          <Tabs
            defaultActiveKey="gallery"
            id="justify-tab-example"
            className="mb-3 custom-tabs"
            variant="underline"
            justify
          >
            <Tab eventKey="gallery" title="Gallery">
              <Container
                className="d-flex flex-wrap justify-content-center"
                style={{ maxHeight: "450px", overflowY: "auto" }}
              >
                <PostGallery posts={mockPosts} />
              </Container>
            </Tab>
            <Tab eventKey="map" title="Map">
              Here comes the map
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
