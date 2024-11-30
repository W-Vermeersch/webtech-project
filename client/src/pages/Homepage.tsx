import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default function Homepage() {
  // pretend this data is coming from the backend
  const mockUsers = [
    { name: "Alice", points: 120 },
    { name: "Bob", points: 430 },
    { name: "Charlie", points: 2 },
    { name: "Diana", points: 72 },
    { name: "Eve", points: 80 },
  ];


    return (
        <Container>
            <Row className={'justify-content-end'}>
                {/* for future components like map and postfeed */}
                <Col xs={9}>
                    test for future
                </Col>
                <Col xs={3}>
                    <Leaderboard users={mockUsers} />
                </Col>
            </Row>
        </Container>
    );
};

