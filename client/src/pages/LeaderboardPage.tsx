import Leaderboard from "../components/leaderboard/Leaderboard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";

// pretend this data is coming from the backend
const mockUsers = [
  { name: "Alice", points: 120 },
  { name: "Bob", points: 430 },
  { name: "Charlie", points: 2 },
  { name: "Diana", points: 72 },
  { name: "Eve", points: 80 },
];

export default function LeaderboardPage() {
  return (
    <Container>
      <Stack className="justify-content-center col-md-7 mx-auto">
        {/* for future components like map and postfeed */}
        <h2>Leaderboard</h2>
        <Leaderboard users={mockUsers} />
      </Stack>
    </Container>
  );
}
