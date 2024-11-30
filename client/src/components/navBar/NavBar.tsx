import NavItem from "./NavItem";
import "./NavBar.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";

export default function NavBar() {
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
            <NavItem to="/home">
              {/* Change this to /user/*current-user* */}
              <Image src="https://dummyimage.com/35" roundedCircle />
            </NavItem>
          </Nav>
          <Nav>
            <NavDropdown title="*user name*" id="user-dropdown">
              <NavItem to="/user/sign-up">Profile</NavItem>
              {/* Change this to /user/*current-user* */}
              <NavItem to="/user/sign-up">Log In</NavItem>
              <NavItem to="/user/sign-up">Sign Up</NavItem>
              <NavDropdown.Divider />
              <NavItem to="/home">Log Out</NavItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
