import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Post, PostComment } from "../../posts/PostInterface";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { ADD_COMMENT, FETCH_POST_COMMENTS } from "../../../api/urls";
import useAuthUser from "../../../hooks/useAuthUser";
import { fetchCommentProps } from "../SinglePost";
import "./ViewComments.css";

interface ViewCommentsModalProps {
  show: boolean;
  onHide: () => void;
  post: Post;
  authCheck: (action: () => void) => void;
}

const ViewCommentsModal = ({
  show,
  onHide,
  post,
  authCheck,
}: ViewCommentsModalProps) => {
  const user = useAuthUser();
  const username = user?.username || "";
  const axiosPrivate = useAxiosPrivate();
  const [comments, setComments] = useState<fetchCommentProps[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const fetchComments = async () => {
    try {
      const resp = await axiosPrivate.get(FETCH_POST_COMMENTS, {
        params: { post_id: post.idx },
      });

      if (resp.status === 200) {
        // Safeguard to ensure comments are always an array
        setComments(resp.data.post_comments);
        console.log(resp.data.post_comments);
      } else {
        console.error("Failed to fetch comments, status:", resp.status);
        setComments([]); // Set empty array on failure
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post]);

  const handleAddComment = async () => {
    authCheck(async () => {
      if (newComment.trim() === "") return;

      const commentData = {
        post_id: post.idx,
        description: newComment,
      };

      try {
        const resp = await axiosPrivate.post(ADD_COMMENT, commentData);

        if (resp.status === 200) {
          // Append the new comment to the local comments array
          setComments((prevComments) => [
            ...prevComments,
            {
              user: username,
              description: newComment,
              post_id: post.idx,
            },
          ]);
          setNewComment("");
        } else {
          console.error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display Comments */}
        <div className="comments-list mb-3">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment-item mb-2">
                <strong>{comment.user}:</strong> {comment.description}
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Add Comment */}
        <Form>
          <Form.Group controlId="addCommentInput">
            <Form.Control
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>

          <div className="comment-buttons">
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddComment}>
              Post Comment
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ViewCommentsModal;
