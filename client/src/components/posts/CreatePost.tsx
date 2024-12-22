import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PostForm from "./PostForm";
import "./CreatePost.css";

// This component loads in the form to display the create-post form.
const CreatePost = () => {
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
