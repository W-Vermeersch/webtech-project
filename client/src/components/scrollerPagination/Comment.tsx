import { Modal, Button, Form } from "react-bootstrap";
import { Post } from "../posts/PostInterface";
import React from "react";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ADD_COMMENT } from "../../api/urls";

interface CommentModalProps {
  show: boolean;
  onHide: () => void;
  post: Post;
}

interface commentFormValues{
  post_id: number | undefined;
  description: string; 
}

const CommentModal= ({ show, onHide, post }: CommentModalProps) => {
  const axios = useAxiosPrivate();
  const [comment, setComment] = React.useState("");

  const handleCommentSubmit = async () => {
    // handle comment submission here
    const values: commentFormValues = {post_id: post.idx, description: comment}
    //await axios.post(ADD_COMMENT, values)
    console.log("Comment Submitted: ", values);
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
