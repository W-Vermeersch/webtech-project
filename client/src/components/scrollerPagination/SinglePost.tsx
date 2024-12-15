import { Row, Col, Container } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "./SinglePost.css";
import { Post } from "../posts/PostInterface";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "../../api/axios";
import { DELETE_LIKE, LIKE_POST } from "../../api/urls";
import CommentModal from "./Commenting/PlaceComment";
import ViewCommentsModal from "./Commenting/ViewComments";
import withAuthCheck from "./withAuthCheck";

interface SinglePostProps {
  post: Post;
  authCheck: (action: () => void) => void;
}

const SinglePost = ({ post, authCheck }: SinglePostProps) => {
  console.log("this is the post that is passed", post);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  // initialise the likes and track if the post is liked
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showViewCommentsModal, setShowViewCommentsModal] = useState(false);

  const handleLiking = async () => {
    console.log("Handlelike has been called");
    const post_id = post.idx;
    const resp = await axiosPrivate.get(LIKE_POST, { params: { post_id } });
    if (resp.status === 200) {
      setLikes((prev) => prev + 1);
      setIsLiked(!isLiked);
    }
    console.log("amount of likes", isLiked);
  };

  const handleUnliking = async () => {
    try {
      const post_id = post.idx;
      console.log("handleunliking has been called");

      // Use DELETE method with params
      const resp = await axiosPrivate.delete(DELETE_LIKE, {
        params: { post_id },
      });

      if (resp.status === 200) {
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      } else {
        console.error("Error unliking post");
      }
    } catch (err) {
      console.error("Error during unliking:", err);
    }
  };

  const handleOpenCommentModal = () => {
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
  };

  const handleViewAllComments = () => {
    setShowViewCommentsModal(true);
  };

  const handleCloseViewCommentsModal = () => {
    setShowViewCommentsModal(false);
  };

  // For each post, display the first two comments,
  // otherwhise click on more to open up the comments section
  const commentsToDisplay = post.comments ? post.comments.slice(0, 2) : [];

  return (
    <Container className="post">
      <div className="post-header">
        <Row className="align-items-center">
          <Col xs="auto">
            <NavLink to={`/profile/${post.user}`}>
              <img className="profilepic" src={post.profile_picture}></img>
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
          <NavLink to={`/post/${post.idx}`} state={{ post }}>
            <img
              src={post.image_url}
              alt="Post content"
              className="w-100 post-image"
            />
          </NavLink>
        </div>

        {/* Like and comment */}
        <div className="post-actions">
          <img
            src={isLiked ? "src/assets/liked.svg" : "src/assets/like.svg"}
            alt="Like"
            className="action-icon"
            onClick={() => authCheck(isLiked ? handleUnliking : handleLiking)}
            style={{ cursor: "pointer", width: "24px", marginRight: "10px" }}
          />
          <span>{likes}</span>

          <img
            src="src/assets/comment.svg"
            alt="Comment"
            className="action-icon"
            onClick={() => authCheck(handleOpenCommentModal)}
            style={{ cursor: "pointer", width: "30px", marginLeft: "20px" }}
          />
        </div>

        {/* Caption & Tags Section */}
        <div className="post-details">
          <p className="caption mb-1">
            <span className="fw-bold">@{post.user}</span> {post.description}
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
                <strong>{comment.user}:</strong> {comment.text}
              </div>
            ))}

            {post.comments && (
              <div
                className="load-more-comments"
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
      {showViewCommentsModal && (
        <ViewCommentsModal
          show={showViewCommentsModal}
          onHide={handleCloseViewCommentsModal}
          post={post}
        />
      )}
    </Container>
  );
};

export default withAuthCheck(SinglePost);
