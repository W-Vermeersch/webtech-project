import NavItem from "./NavItem";
import "./NavBar.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import useSignOut from "react-auth-kit/hooks/useSignOut";

export default function NavBar() {
  const signOut = useSignOut();

  function handleLogOut() {
    console.log("Logging out");
    signOut();
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
          <NavItem to="/user/profile">
            {/* Change this to /user/*current-user* */}
            <Image src="https://dummyimage.com/35" roundedCircle />
          </NavItem>
          <Nav>
            <NavDropdown title="*user name*" id="user-dropdown">
              <NavItem to="/user/profile">Profile</NavItem>
              {/* Change this to /user/*current-user* */}
              <NavItem to="/user/log-in">Log In</NavItem>
              <NavItem to="/user/sign-up">Sign Up</NavItem>
              <NavDropdown.Divider />
              <div onClick={handleLogOut}>
                <NavItem to="/home">Log Out</NavItem>
              </div>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
