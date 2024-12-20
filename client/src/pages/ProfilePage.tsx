import { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
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
import "./../Spinner.css";
import ViewUsersList from "./ViewUsersList";

import PostGallery from "../components/profile/PostGallery";
import MapContainer from "../components/profile/MapContainer";
import { Post, User } from "../components/posts/PostInterface";
import {
  FETCH_IS_FOLLOWING,
  FETCH_POST,
  FETCH_USER_PROFILE,
  FOLLOW,
  UNFOLLOW,
} from "../api/urls";
import { FaEllipsisV } from "react-icons/fa";
import useSignOut from "../hooks/useSignOut";
import useAuthUser from "../hooks/useAuthUser";
import { LOG_IN, FETCH_USER_POSTS } from "../api/urls";
import { Button } from "react-bootstrap";

export default function ProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [following, setFollowing] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [activeTab, setActiveTab] = useState("gallery");
  const [isFollowing, setIsFollowing] = useState(false); // for buffering follow/unfollow
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  // to log out on mobile view
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const signOut = useSignOut();
  const authUser = useAuthUser();
  const [ViewUsers, setShowUsers] = useState(false); // modal
  const [ViewFollowing, setViewFollowing] = useState(false); // 0 for following list and 1 for followers list
  const [followerCount, setFollowerCount] = useState(NaN);

  const handleCloseUsersModal = () => {
    setShowUsers(false);
  };

  const handleOpenUsersModal = () => {
    setShowUsers(true);
  };

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
  }

  async function handleFollow() {
    setIsFollowing(true);
    if (!authUser) {
      return;
    }
    if (following) {
      await axiosPrivate.delete(UNFOLLOW, { params: { username } });
      setFollowerCount((prev) => prev - 1);
      setFollowing(false);
    } else {
      await axiosPrivate.post(FOLLOW, { username });
      setFollowerCount((prev) => prev + 1);
      setFollowing(true);
    }
    setIsFollowing(false);
  }

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const resp = await axiosPrivate.get(FETCH_USER_PROFILE, {
          params: { username },
        });
        setFollowing(resp.data.isFollowed);
        setFollowerCount(resp.data.follower_amount);
        if (resp.data.redirect) {
          // user not found
          navigate("/pageNotFound", { replace: true });
        } else {
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
    {/* 3 dots at top of profile page on small screen to log out */}
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

      {isLoading && (
        <Spinner animation="border" className="spinner" variant="dark" />
      )}

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
              {authUser?.username === username ? (
                <Button
                  className="edit-button"
                  variant="success"
                  disabled={isFollowing}
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
              ) : (
                <Button
                  className="follow-button p-2 px-5 mt-2"
                  variant={following ? "outline-success" : "success"}
                  onClick={handleFollow}
                >
                  {following ? "Unfollow" : "Follow"}
                </Button>
              )}

              <h4 className="mt-4 mb-0">{`Level: ${level(user.totalexp)}`}</h4>
              <div className="w-100">
                <ProgressBar
                  variant="success"
                  now={currentLevelExp(user.totalexp)}
                  max={maxExp}
                  label={`${currentLevelExp(user.totalexp)} XP`}
                />
              </div>
              <div className="follower-count w-100 text-center mt-2">
                <div
                  className="mb-3"
                  onClick={() => {
                    setViewFollowing(true);
                    handleOpenUsersModal();
                  }}
                >
                  <h5 className="text-center follow">{`Followers: ${followerCount}`}</h5>
                </div>

                <div
                  onClick={() => {
                    setViewFollowing(false);
                    handleOpenUsersModal();
                  }}
                >
                  <h5 className="text-center follow">{`Following: ${user.following_amount}`}</h5>
                </div>
                <hr />
              </div>

              <Container className="bio-container">
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
      {ViewUsers && (
        <ViewUsersList
          show={ViewUsers}
          onHide={handleCloseUsersModal}
          username={user.username}
          list={ViewFollowing}
        />
      )}
    </>
  );
}
