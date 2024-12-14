import "./NavBar.css";
import NavItem from "./NavItem";
import Search from "./Search";

import { useState } from "react";

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
import { LOG_IN } from "../../api/urls";
import { FaS } from "react-icons/fa6";
import { ModalBody } from "react-bootstrap";

export default function NavBar() {
  const signOut = useSignOut();
  const authUser = useAuthUser();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);

  const handleSearchComplete = () => {
    setModalShow(false);
  };

  async function handleLogOut() {
    if (!authUser) {
      return;
    }
    await signOut();
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
            <div className="d-md-none d-lg-block">
              <Search />
            </div>
            {/* for screen between md and lg */}
            <div className="d-none d-md-block d-lg-none">
              <FaSearch
                className="search-icon"
                size={20}
                onClick={() => setModalShow(true)}
              />
              <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                <ModalBody className="search-modal rounded">
                  <Search onSearchComplete={handleSearchComplete}/>
                </ModalBody>
              </Modal>
            </div>
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
