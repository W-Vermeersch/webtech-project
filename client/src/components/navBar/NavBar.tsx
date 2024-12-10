import NavItem from "./NavItem";
import "./NavBar.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import { useNavigate } from "react-router-dom";
import useAuthUser from "../../react-auth-kit/useAuthUser";
import useSignOut from "../../react-auth-kit/useSignOut";
import useRefreshToken from "../../react-auth-kit/useRefreshToken";
import axios from "axios";
import RouteToServer from "../../infos";
import Cookies from "js-cookie";

export default function NavBar() {
  const signOut = useSignOut();
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const refreshToken = useRefreshToken();

  async function handleLogOut() {
    if (!authUser) {
      return;
    }
    console.log("Logging out");
    const resp = await axios.delete(RouteToServer("/user/log-out"), {
      headers: {
        "refresh-token": refreshToken
      },
    });
    // deal with error handling maybe
    if (resp.status === 204) {
      signOut();
      console.log("Logged out");
      navigate("/user/log-in");
    }
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
                    src="https://dummyimage.com/35"
                    roundedCircle
                  />
                  <span>{authUser ? authUser.username : "Guest"} </span>
                </>
              }
              id="user-dropdown"
            >
              <NavDropdown.Item className={authUser ? "" : "disabled"}>
                <NavItem to={`/user/profile/${authUser && authUser.username}`}  eventKey="Profile">
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
