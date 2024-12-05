import NavItem from "./NavItem";
import "./NavBar.css";
import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import useSignOut from "react-auth-kit/hooks/useSignOut";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import axios from "axios";
import RouteToServer from "../../infos";
import Cookies from "js-cookie";

interface IUserData {
  username: string;
  userID: string;
}

export default function NavBar() {
  const signOut = useSignOut();
  const authUser = useAuthUser<IUserData>();

  async function handleLogOut() {
    if (!authUser) {
      return;
    }
    console.log("Logging out");
    const resp = await axios.delete(RouteToServer("/user/log-out"), {
      headers: {
        "refresh-token": Cookies.get("_auth_refresh"),
      },
    });
    // deal with error handling maybe
    if (resp.status === 204) {
      signOut();
      console.log("Logged out");
      window.location.reload();
    }
  }

  return (
    <Navbar expand="md" bg="dark" data-bs-theme="dark" fixed="top">
      <Container>
        <Navbar.Brand>
          <NavItem to="/home">Animal Go</NavItem>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <NavItem to="/home">Home</NavItem>

            <NavItem to="/map">Map</NavItem>
          </Nav>
          <Nav className="ms-auto">
            <NavItem to="/create-post">
              <Button variant="success">Create Post</Button>
            </NavItem>
          </Nav>
          <NavItem to="/user/profile" className={authUser ? "" : "disabled"}>
            {/* Change this to /user/*current-user* */}
            <Image src="https://dummyimage.com/35" roundedCircle />
          </NavItem>
          <Nav>
            <NavDropdown
              title={(authUser ? authUser.username : "Guest") + " "}
              id="user-dropdown"
            >
              <NavDropdown.Item>
                <NavItem to="/user/profile" className={authUser ? "" : "disabled"}>Profile</NavItem>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <NavItem to="/user/log-in" className={authUser ? "disabled" : ""}>Log In</NavItem>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <NavItem to="/user/sign-up" className={authUser ? "disabled" : ""}>Sign Up</NavItem>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <div onClick={handleLogOut}>
                  <NavItem to="/home" className={authUser ? "" : "disabled"}>Log Out</NavItem>
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
