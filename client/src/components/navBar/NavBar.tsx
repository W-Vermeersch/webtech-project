import NavItem from "./NavItem";
import "./NavBar.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function NavBar() {
  return (
    <Navbar expand="md" bg="dark" data-bs-theme="dark" fixed="top">
      <Container>
        <Navbar.Brand>
          <NavItem to="/home">Animal Go</NavItem>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavItem to="/home">Home</NavItem>
            <NavItem to="/user/sign-up">Sign Up</NavItem>
            <NavItem to="/map">Map</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
