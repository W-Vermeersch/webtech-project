import { Row, Col, Container, Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./SinglePost.css";
import { Post } from "../posts/PostInterface";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "../../api/axios";
import { DELETE_LIKE, LIKE_POST } from "../../api/urls";
import CommentModal from "./Comment";

interface SinglePostProps {
  post: Post;
}

const SinglePost = ({ post }: SinglePostProps) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const handleViewAllComments = () => {
    navigate("/log-in");
  };

  // initialise the likes and track if the post is liked
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        // Unlike the post
        console.log("Im unliking the post");
        // await axiosPrivate.post(DELETE_LIKE, (post.user, post.idx));
        setLikes((prev) => prev - 1);
      } else {
        console.log("Im liking the post.");
        // Like the post, this sends the wrong user for now
        // await axiosPrivate.post(LIKE_POST, (post.user, post.idx));
        setLikes((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleOpenCommentModal = () => {
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
  };

  const handleComment = () => {
    // Handle comment logic here
    console.log("Comment button clicked");
  };

  // For each post, display the first two comments,
  // otherwhise click on more to open up the comments section
  const commentsToDisplay = post.commentsection
    ? post.commentsection.slice(0, 2)
    : [];

  return (
    <Container className="post">
      <div className="post-header">
        <Row className="align-items-center">
          <Col xs="auto">
            <NavLink to={`/profile/${post.user}`}>
              <img className="profilepic" src={post.image_url}></img>
            </NavLink>
          </Col>
          <Col>
            <NavLink
              style={{ textDecoration: "none", color: "inherit" }}
              to={`/profile/${post.user}`}
            >
              <div className="username d-flex flex-column">{post.user}</div>
            </NavLink>
          </Col>
        </Row>
      </div>

      <div className="post-content">
        <div className="post-image-wrapper">
          <img
            src={post.image_url}
            alt="Post content"
            className="w-100 post-image"
          />
        </div>

        {/* Like and comment */}
        <div className="post-actions">
          <img
            src={isLiked ? "src/assets/liked.svg" : "src/assets/like.svg"}
            alt="Like"
            className="action-icon"
            onClick={handleLike}
            style={{ cursor: "pointer", width: "24px", marginRight: "10px" }}
          />
          <span>{likes}</span>

          <img
            src="src/assets/comment.svg"
            alt="Comment"
            className="action-icon"
            onClick={handleOpenCommentModal}
            style={{ cursor: "pointer", width: "30px", marginLeft: "20px" }}
          />
        </div>

        {/* Caption & Tags Section */}
        <div className="post-details">
          <p className="caption mb-1">
            <span className="fw-bold">@{post.user}</span> {post.title}
          </p>

          <div className="tags-section mb-2">
            {post.tags.map((tag: string, index: number) => (
              <span
                key={`${tag}${index}`}
                className="badge rounded-pill bg-light text-muted me-1"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comment Section */}
          <div className="comments-section">
            {commentsToDisplay.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.user}:</strong> {comment.comment}
              </div>
            ))}

            {post.commentsection && post.commentsection.length > 2 && (
              <div
                className="load-more-comments muted"
                style={{ cursor: "pointer" }}
                onClick={handleViewAllComments}
              >
                View all comments
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && (
        <CommentModal
          show={showCommentModal}
          onHide={handleCloseCommentModal}
          post={post}
        />
      )}
    </Container>
  );
};

export default SinglePost;
