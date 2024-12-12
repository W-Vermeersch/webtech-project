import { Row, Col, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./SinglePost.css";
import { Post } from "../posts/PostInterface";

interface SinglePostProps {
  post: Post;
}

const SinglePost = ({ post }: SinglePostProps) => {
  const navigate = useNavigate();
  const handleViewAllComments = () => {
    navigate("/log-in");
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
            <Link to={`/user/${post.user}`}>
              <img className="profilepic" src={post.image_url}></img>
            </Link>
          </Col>
          <Col>
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={`/user/${post.user}`}
            >
              <div className="username d-flex flex-column">{post.user}</div>
            </Link>
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
    </Container>
  );
};

export default SinglePost;
