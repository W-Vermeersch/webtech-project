import { Modal, Button, Form } from "react-bootstrap";
import { Post } from "../posts/PostInterface";
import React from "react";

interface CommentModalProps {
  show: boolean;
  onHide: () => void;
  post: Post;
}

const CommentModal: React.FC<CommentModalProps> = ({ show, onHide, post }) => {
  const [comment, setComment] = React.useState("");

  const handleCommentSubmit = () => {
    // handle submission here
    console.log("Comment Submitted: ", comment);
    onHide(); // close the modal after submission
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>
            <strong>Post:</strong>
          </p>
          <p>{post.title}</p>
        </div>
        <Form>
          <Form.Group controlId="commentInput">
            <Form.Label>Add your comment:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCommentSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentModal;
