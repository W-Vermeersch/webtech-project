import LogIn from "../components/login/LogIn";
import "./SignUpPage.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import NavItem from "../components/navBar/NavItem";

export default function LogInPage() {
  return (
    <>
      <h1 className="text-center mb-5">
        Welcome to Animal Go <br />
        <small className="text-muted">Log in to continue posting</small>
      </h1>
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={6}>
          <Container id="form-container" className="rounded shadow-sm">
            <LogIn />
            <NavItem to="/user/sign-up" className="text-light mt-3">
              Don't have an account? Sign up here
            </NavItem>
          </Container>
        </Col>
      </Row>
    </>
  );
}
