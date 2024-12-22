import { Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./SinglePost.css";
import { Post } from "../posts/PostInterface";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { DELETE_LIKE, FETCH_POST_COMMENTS, LIKE_POST } from "../../api/urls";
import CommentModal from "./Commenting/PlaceComment";
import ViewCommentsModal from "./Commenting/ViewComments";
import withAuthCheck from "./withAuthCheck";

interface SinglePostProps {
  post: Post;
  authCheck: (action: () => void) => void;
}

export interface fetchCommentProps {
  user_id?: number;
  user: string;
  post_id: number;
  description: string;
}

// Render a single post.
const SinglePost = ({ post, authCheck }: SinglePostProps) => {
  const axiosPrivate = useAxiosPrivate();

  // Initialise the likes of the post, keep track if the current user has liked the post.
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(post.liked || false);
  // State needed to know when to open which modal.
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showViewCommentsModal, setShowViewCommentsModal] = useState(false);
  // State to fetch comments so we don't have to refresh the page to update it.
  const [comments, setComments] = useState<fetchCommentProps[]>([]);

  // Function to handle liking a post.
  const handleLiking = async () => {
    const post_id = post.idx;
    const resp = await axiosPrivate.get(LIKE_POST, { params: { post_id } });
    if (resp.status === 200) {
      setLikes((prev) => prev + 1);
      setIsLiked(!isLiked);
    } else {
      console.error("Error liking post");
    }
  };

  // Function to handle unliking a post.
  const handleUnliking = async () => {
    try {
      const post_id = post.idx;
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

  // Functions to handle opening and closing modals. Fetch comments to update the comment section display when closing modals.
  const handleOpenCommentModal = () => {
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    fetchComments();
  };

  const handleViewAllComments = () => {
    setShowViewCommentsModal(true);
  };

  const handleCloseViewCommentsModal = () => {
    setShowViewCommentsModal(false);
    fetchComments();
  };

  // Function to fetch the comments on the current post from the backend.
  const fetchComments = async () => {
    try {
      const resp = await axiosPrivate.get(FETCH_POST_COMMENTS, {
        params: { post_id: post.idx },
      });

      if (resp.status === 200) {
        setComments(resp.data.post_comments);
      } else {
        console.error("Failed to fetch comments, status:", resp.status);
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post]);

  // For each post, display the first two comments,
  // otherwhise click on more to open up the comments section
  const commentsToDisplay = comments.slice(0, 2);

  return (
    <div className="post nes-container">
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
          <NavLink
            to={`/post/${post.idx}`}
            state={{ post: { ...post, liked: isLiked, likes: likes } }}
          >
            <img
              src={post.image_url}
              alt="Post content"
              className="w-100 post-image"
            />
          </NavLink>
        </div>

        {/* Like and comment */}
        <div className="post-actions d-flex align-items-center">
          <img
            src={isLiked ? "/src/assets/liked.svg" : "/src/assets/like.svg"}
            alt="Like"
            className="action-icon"
            onClick={() => {
              authCheck(isLiked ? handleUnliking : handleLiking);
              //console.log('from single post -> likes: ', likes, 'liked : ', isLiked)
            }}
            style={{ cursor: "pointer", width: "24px", marginRight: "10px" }}
          />
          <span>{likes}</span>

          <img
            src="/src/assets/comment.svg"
            alt="Comment"
            className="action-icon"
            onClick={() => authCheck(handleOpenCommentModal)}
            style={{ cursor: "pointer", width: "30px", marginLeft: "20px" }}
          />
          <span className="badge bg-danger ms-auto">{`${
            post.score * post.rarity
          } XP`}</span>
        </div>

        {/* Caption & Tags Section */}
        <div className="post-details">
          <p className="caption mb-1">
            <span className="fw-bold">@{post.user}</span> {post.description}
          </p>

          <div className="tags-section mb-2">
            {post.tags[0] !== "None"
              ? post.tags.map((tag: string, index: number) => (
                  <span
                    key={`${tag}${index}`}
                    className="badge bg-success text-light me-1"
                  >
                    #{tag}
                  </span>
                ))
              : null}
          </div>

          {/* Comment Section */}
          <div className="comments-section">
            {commentsToDisplay.map((comment, index) => (
              <div key={index} className="comment">
                <strong>{comment.user}:</strong> {comment.description}
              </div>
            ))}

            {post.comments && (
              <div
                className="load-more-comments"
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
          authCheck={authCheck}
        />
      )}
    </div>
  );
};

// Wrap it with the HOC (see withAuthCheck.tsx)
export default withAuthCheck(SinglePost);
