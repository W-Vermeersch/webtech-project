import { CardHeader, Row, Col, NavLink, Container, CardBody, CardText, CardImg} from "react-bootstrap";
import PostGallery, { Post } from "../profile/PostGallery";
import { Link } from "react-router-dom";
import "./SinglePost.css"

interface SinglePostProps {
    post: Post;
}

const SinglePost = ({ post }: SinglePostProps) =>{
    return(
        <Container className="post">
        <CardHeader className="d-flex justify-content-between align-items-center">
             <Row className="align-items-center">
                <Col xs="auto">
                    <Link to={`/user/${post.user}`}> 
                        <img className="profilepic" src={post.image_url}>
                        </img>
                    </Link>
                </Col>
                <Col>
                <Link style={{textDecoration: "none", color: "inherit"}} to={`/user/${post.user}`}> 
                    <div className="d-flex flex-column"> 
                        {post.user}
                    </div>
                    </Link>
                </Col>
             </Row>
        </CardHeader>

        <CardBody className="p-0">
        <CardImg src={post.image_url} alt="Post content" className="w-100 post-image" />

        {/* Caption & Tags Section */}
        <div className="p-3">
          <CardText className="mb-1">
            <span className="fw-bold">@{post.user}</span> {post.title}
          </CardText>

          <div className="tags-section mb-2">
            {post.tags.map((tag: string, index: number) => (
              <span key={`${tag}${index}`} className="badge rounded-pill bg-light text-muted me-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </CardBody>
        </Container>
    )
};

export default SinglePost;