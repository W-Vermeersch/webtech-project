import "./NavBar.css";
import NavItem from "./NavItem";
import Search from "./Search";

import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaSearch } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthUser";
import useSignOut from "../../hooks/useSignOut";
import { FETCH_USER_PROFILE, LOG_IN } from "../../api/urls";
import { FaS } from "react-icons/fa6";
import { ModalBody } from "react-bootstrap";

export default function NavBar() {
  const signOut = useSignOut();
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [profilepic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      axiosPrivate
        .get(FETCH_USER_PROFILE, { params: { username: authUser.username } })
        .then((res) => {
          setProfilePic(res.data.profilepicture);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [authUser]);

  async function handleLogOut() {
    if (!authUser) {
      return;
    }
    await signOut();
    localStorage.removeItem("posts");
    setProfilePic(null);
    navigate(LOG_IN);
    // deal with error handling
  }

  return (
    <Navbar
      expand="md"
      bg="dark"
      data-bs-theme="dark"
      fixed="top"
      collapseOnSelect={true}
    >
      <Container>
        <Navbar.Brand>
          <NavItem to="/home" eventKey="Animal Go">
            Animal Go
          </NavItem>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavItem to="/home" eventKey="Home">
              Home
            </NavItem>
            <NavItem to="/map" eventKey="Map">
              Map
            </NavItem>
            <NavItem to="/leaderboard" eventKey="Leaderboard">
              Leaderboard
            </NavItem>
          </Nav>
          <Nav>
            <NavItem to="/search" eventKey="Search">
              <FaSearch className="search-icon" size={20} />
            </NavItem>
          </Nav>
          <Nav>
            <NavItem to="/create-post" eventKey="Create Post">
              <Button variant="success">Create Post</Button>
            </NavItem>
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <>
                  <Image
                    className="me-2"
                    src={
                      profilepic
                        ? profilepic
                        : "/src/assets/default-profile-picture.jpg"
                    }
                    roundedCircle
                    width={35}
                    height={35}
                  />
                  <span>{authUser ? authUser.username : "Guest"} </span>
                </>
              }
              id="user-dropdown"
            >
              <NavDropdown.Item className={authUser ? "" : "disabled"}>
                <NavItem
                  to={`/profile/${authUser && authUser.username}`}
                  eventKey="Profile"
                >
                  Profile
                </NavItem>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className={authUser ? "disabled" : ""}>
                <NavItem to="/user/log-in" eventKey="Log In">
                  Log In
                </NavItem>
              </NavDropdown.Item>
              <NavDropdown.Item className={authUser ? "disabled" : ""}>
                <NavItem to="/user/sign-up" eventKey="Sign Up">
                  Sign Up
                </NavItem>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className={authUser ? "" : "disabled"}>
                <div onClick={handleLogOut}>
                  <NavItem to="#" eventKey="Log Out">
                    Log Out
                  </NavItem>
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
