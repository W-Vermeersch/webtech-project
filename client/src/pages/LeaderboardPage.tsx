import Leaderboard from "../components/leaderboard/Leaderboard";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

export default function LeaderboardPage() {
  return (
    <Container>
      <Stack className="justify-content-center col-md-7 mx-auto">
        <Leaderboard />
      </Stack>
    </Container>
  );
}
