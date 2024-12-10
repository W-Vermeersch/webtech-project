import {
  CardHeader,
  Row,
  Col,
  Container,
  CardBody,
  CardText,
  CardImg,
} from "react-bootstrap";
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
      <div className="card-header d-flex justify-content-between align-items-center">
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
              <div className=" username d-flex flex-column">{post.user}</div>
            </Link>
          </Col>
        </Row>
      </div>
      <div id="post-image-container">
        <img src={post.image_url} alt="Post content" className="post-image" />
      </div>

      <div className="card-body p-0">
        {/* Caption & Tags Section */}
        <div className="p-3">
          <div className="card-text mb-1">
            <span className="fw-bold">@{post.user}</span> {post.title}
          </div>

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
        </div>
      </div>

      <Row>
        {/* comment section */}
        <div className="comments-section p-0 mb-2">
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
      </Row>
    </Container>
  );
};

export default SinglePost;
