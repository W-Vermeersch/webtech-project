import SignIn from "../components/login/SignIn";
import "./SignUpPage.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import NavItem from "../components/navBar/NavItem";

export default function SignUpPage() {
  return (
    <div className="signin-page">
      <h1 className="text-center mb-5">
        Welcome to <span className="brand">Animal Go</span> <br />
        <small className="text-muted">Sign Up to start posting</small>
      </h1>
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={6}>
          <Container id="form-container" className="rounded shadow-sm">
            <SignIn />
            <NavItem to="/user/log-in" className="text-light mt-3">
              Already have an account? Log in here
            </NavItem>
          </Container>
        </Col>
      </Row>
    </div>
  );
}
