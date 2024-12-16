import { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import axios from "../api/axios";
import { maxExp, level, currentLevelExp } from "./../api/xp-system";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import ProgressBar from "react-bootstrap/ProgressBar";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Spinner from "react-bootstrap/Spinner";
import './../Spinner.css';

import PostGallery from "../components/profile/PostGallery";
import MapContainer from "../components/profile/MapContainer";
import { Post, PostComment, User } from "../components/posts/PostInterface";
import { FETCH_POST, FETCH_USER_PROFILE } from "../api/urls";
import { FaEllipsisV } from "react-icons/fa";
import useSignOut from "../hooks/useSignOut";
import useAuthUser from "../hooks/useAuthUser";
import { LOG_IN, FETCH_USER_POSTS } from "../api/urls";
import { Button } from "react-bootstrap";

export default function ProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [activeTab, setActiveTab] = useState("gallery");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  // to log out on mobile view
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const signOut = useSignOut();
  const authUser = useAuthUser();

  //console.log("From the hoook", authUser?.username);
  //console.log("From the fetching profile", username);

  // handle editing the profile if it is your own

  const handleToggleMenu = () => {
    setIsMenuVisible((prev) => !prev); // Toggle menu visibility
  };

  const ToglleLogoutOff = () => {
    setIsMenuVisible(false);
  };

  async function handleLogOut() {
    if (!authUser) {
      return;
    }
    await signOut();
    navigate(LOG_IN);
    // deal with error handling
  }

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      //console.log("fetching user");
      try {
        const resp = await axios.get(FETCH_USER_PROFILE, {
          params: { username },
          //signal: controller.signal,
        });
        if (resp.data.redirect) {
          // user not found
          navigate("/pageNotFound", { replace: true });
        } else {
          //isMounted &&
          setUser(resp.data);
        }
      } catch (error) {
        console.error(error);
        navigate("/user/log-in", { state: { from: location }, replace: true });
      }
    }

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    async function fetchPosts() {
      //console.log("fetching posts");
      const resp = await axiosPrivate.get(FETCH_USER_POSTS, {
        params: { username },
      });
      setPosts(resp.data.posts);
      setIsLoading(false);
    }

    if (user) {
      fetchPosts();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <>
      <div
        className="three-dots d-xs-block d-md-none"
        onClick={handleToggleMenu}
      >
        <FaEllipsisV size={24} />
      </div>
      {isMenuVisible && (
        <div className="popup-menu">
          <button onClick={handleLogOut} className="logout-button">
            Log Out
          </button>
        </div>
      )}

      {isLoading && 
        <Spinner animation="border" className="spinner" variant="dark"/>}

      <Container
        className=" text-white rounded overflow-hidden border border-light shadow"
        onClick={ToglleLogoutOff}
      >
        <Row className="profile-container">
          <Col
            className="p-4 d-flex justify-content-center"
            id="userInfo"
            xs={12}
            lg={3}
          >
            <Stack className="align-items-center" gap={3}>
              <Image
                src={user.profilepicture}
                alt="profile pic"
                className="profile-circle rounded-circle"
              />
              <h3>{user.username}</h3>
              <h4>{`Level: ${level(user.totalexp)}`}</h4>
              <div className="w-100">
                <ProgressBar
                  variant="success"
                  now={currentLevelExp(user.totalexp)}
                  max={maxExp}
                  label={currentLevelExp(user.totalexp)}
                />
              </div>
              {authUser?.username === username && (
                <Button
                  className="edit-button"
                  variant="success"
                  onClick={() =>
                    navigate("/profile/edit", {
                      state: {
                        profilepicture: user.profilepicture,
                        username: user.username,
                        bio: user.bio,
                      },
                    })
                  }
                >
                  Edit Profile
                </Button>
              )}
              <Container className="p-3 bio-container">
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
              <Tab eventKey="gallery" title="Gallery" className="pb-4">
                <Container
                  className="d-flex flex-wrap justify-content-center pb-4"
                  style={{ height: "70vh", overflowY: "auto" }}
                >
                  <PostGallery posts={posts || []} />
                </Container>
              </Tab>
              <Tab eventKey="map" title="Map" className="pb-4">
                {activeTab === "map" && (
                  <MapContainer
                    posts={posts || []}
                    center={[50.822376, 4.395356]}
                    activeTab={activeTab === "map"}
                  />
                )}
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
}
