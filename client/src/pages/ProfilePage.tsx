import { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import ProgressBar from "react-bootstrap/ProgressBar";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import PostGallery from "../components/profile/PostGallery";
import MapContainer from "../components/profile/MapContainer";
import { Post, PostComment } from "../components/posts/PostInterface";

interface User {
  username: string;
  user_id: number;
  displayname: string;
  profilepicture: string;
  bio: string;
  totalexp: number;
  badges: string[];
}

// Create more realistic mock data with coordinates
const mockPosts: Post[] = Array(15)
  .fill(null)
  .map((_, index) => ({
    image_url: "https://dummyimage.com/180",
    latitude: 50.822376 + (Math.random() - 0.5) * 0.02,
    longitude: 4.395356 + (Math.random() - 0.5) * 0.02,
    title: `Post ${index + 1}`,
    tags: ["tag1", "tag2"],
    description: `This is post number ${index + 1}`,
  }));

export default function ProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [activeTab, setActiveTab] = useState("gallery");
  const navigate = useNavigate();

  useEffect(() => {
    // Abort fetch if component is unmounted
    // let isMounted = true;
    // const controller = new AbortController();

    async function fetchUser() {
      try {
        const resp = await axios.get(
          "/user/get-profile-information",
          {
            params: { username },
            //signal: controller.signal,
          }
        );
        if (resp.data.redirect) {
          // user not found
          navigate(resp.data.redirect);
        } else {
          //isMounted && 
          setUser(resp.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    async function fetchPosts() {
      const resp = await axios.get("/post/get", {
        params: { username },
      });
      console.log(resp.data);
      setPosts(resp.data);
    }

    fetchUser();
    //if (user) {
    //  fetchPosts();
    //}

    // runs if the component unmounts
    // return () => {
    //   isMounted = false;
    //   controller.abort();
    // }

  }, [username]);

  if (!user) {
    return null;
  }

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
              src="https://dummyimage.com/180"
              alt="profile pic"
              className="rounded-circle"
            />
            <h3>{user.username}</h3>
            <h4>{user.totalexp}</h4>
            <div className="w-100">
              <ProgressBar
                variant="success"
                now={600}
                max={1000}
                label={"current progress"}
              />
            </div>
            <Container className="p-3">
              <p className="text-center">{user.bio}</p>
            </Container>
          </Stack>
        </Col>
        <Col className="ps-3 pt-2" id="userPosts" xs={12} lg={9}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || "gallery")}
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
              {activeTab === "map" && (
                <MapContainer
                  posts={mockPosts}
                  center={[50.822376, 4.395356]}
                />
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
}
