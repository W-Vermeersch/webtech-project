import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FeedPage from "../components/scrollerPagination/feedPage.tsx";
import SinglePost from "../components/scrollerPagination/SinglePost.tsx";
import {Post} from "../components/profile/PostGallery.tsx";


export default function Homepage() {
  // pretend this data is coming from the backend
  const mockUsers = [
    { name: "Alice", points: 120 },
    { name: "Bob", points: 430 },
    { name: "Charlie", points: 2 },
    { name: "Diana", points: 72 },
    { name: "Eve", points: 80 },
  ];

  const examplePost: Post ={
    title: "testing",
    idx: 1,
    image_url: "https://dummyimage.com/180",
    tags: ["Cat", "Feline"],
    user: "kel",
    profilepicurl: "https://dummyimage.com/180"
}


    return (
        <Container>
            <Row className={'justify-content-end'}>
                {/* for future components like map and postfeed */}
                <Col xs={4}>
                  <FeedPage/>
                </Col>
                <Col xs={4}>
                  dskljflksjf
                </Col>
                <Col xs={4}>
                    <Leaderboard users={mockUsers} />
                </Col>
            </Row>
        </Container>
    );
};

