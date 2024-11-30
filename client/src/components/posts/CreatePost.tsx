import { Container, Row, Col } from "react-bootstrap";
import PostForm from "./PostForm";

const CreatePost = () => {
    return (
        <>
        <Container>
            <Row>
                <Col xs="auto">
                <img src="src/assets/add-post.svg"
                    width={36}
                    height={36}
                    alt="add">
                    </img>
                </Col>
                <Col>
                    <h2 className="fw-bold text-left">Create Post</h2>
                </Col>
            </Row>
            
            <PostForm/>
        </Container>
        </>
    )
}
export default CreatePost