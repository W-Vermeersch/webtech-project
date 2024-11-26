import SignIn from "../components/login/SignIn";
import "./SignUpPage.css";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

export default function SignUpPage() {
  return (
    <Row className="justify-content-center">
      <Col xs={6}>
        <Container id="form-container" className="rounded shadow-sm">
          <SignIn />
        </Container>
      </Col>
    </Row>
  );
}
