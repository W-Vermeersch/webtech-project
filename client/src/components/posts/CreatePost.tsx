import { useEffect } from "react";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";
import useAuthUser from "../../hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PostForm from "./PostForm";
import "./CreatePost.css";

const CreatePost = () => {
  const isAuthenticated = useIsAuthenticated();
  const authUser = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    //check in the backend if the user is authenticated
  });

  return (
    <Container>
      <Row className="w-75 mx-auto mt-2 mb-3">
        <h2 className="fw-bold mb-0 text-center">Create Post</h2>
      </Row>
      <PostForm />
    </Container>
  );
};

export default CreatePost;
