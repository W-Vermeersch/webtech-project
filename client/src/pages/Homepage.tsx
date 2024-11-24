import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Homepage = () => {

    // pretend this data is coming from the backend
    const mockUsers = [
        { name: "Alice", points: 120 },
        { name: "Bob", points: 430 },
        { name: "Charlie", points: 2 },
        { name: "Diana", points: 72 },
        { name: "Eve", points: 80 },
        { name: "Ozioma", points: 1000}
    ];

    return (
        <Container>
            <Row className={'justify-content-end'}>
                {/* for future components like map and postfeed */}
                <Col xs={3}>
                    <Leaderboard users={mockUsers} />
                </Col>
            </Row>
        </Container>
    );
};

export default Homepage;
