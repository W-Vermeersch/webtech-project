import { useEffect } from "react";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";
import useAuthUser from "../../hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PostForm from "./PostForm";

const CreatePost = () => {
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    //check in the backend if the user is authenticated
  });

  return (
    <Container>
      <Row className="w-75 mx-auto">
        <Col xs="auto">
          <img
            src="/src/assets/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
        </Col>
        <Col>
          <h2 className="fw-bold text-left">Create Post</h2>
        </Col>
      </Row>
      <PostForm />
    </Container>
  );
};

export default CreatePost;
