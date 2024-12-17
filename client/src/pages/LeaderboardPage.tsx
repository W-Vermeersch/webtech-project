import Leaderboard from "../components/leaderboard/Leaderboard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import { Button } from "react-bootstrap";
import { useState } from "react";

export default function LeaderboardPage() {
  return (
    <Container>
      <Stack className="justify-content-center col-md-7 mx-auto">
        {/* for future components like map and postfeed */}
        <Leaderboard />
      </Stack>
    </Container>
  );
}
