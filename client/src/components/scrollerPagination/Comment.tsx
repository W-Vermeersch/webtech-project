import { Modal, Button, Form } from "react-bootstrap";
import { Post } from "../posts/PostInterface";
import React from "react";
import { Link } from "react-router-dom";

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
      <Modal.Body>
        <div>
          <Link to={`/profile/${post.user}`}>
            <img className="profilepic" src={post.image_url}></img>
          </Link>
          <p>{post.title}</p>
          <img
            src={post.image_url}
            alt="Post content"
            className="w-100 post-image"
          />
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
          Reply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentModal;
