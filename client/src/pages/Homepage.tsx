import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import PostFeed from "../components/postfeed/Feed.tsx";
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


   

 const mockPosts = [
        {
            id:1,
            username: "Alice",
            caption: "Just captured a majestic lion!",
            comments: ["Amazing!", "Wow, congrats!"],
        },

        {
            id: 2,
            username: "Bob",
            caption: "Exploring new areas... Found a rare bird!",
            comments: ["That's awesome!", "Where was this?"],
        },

        {
            id: 3,
            username: "Diana",
            caption: "lol! Just hit 100 points!",
            comments: ["Great work!", "Keep it up!"],
        },
    ];

    return (
        <Container>
            <Row className={'justify-content-end'}>
                {/* for future components like map and postfeed */}
                <Col xs={9}>
                    <PostFeed posts={mockPosts} />
                </Col>
                <Col xs={3}>
                    <Leaderboard users={mockUsers} />
                </Col>
            </Row>
        </Container>
    );
};

