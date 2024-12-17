import Leaderboard from "../components/leaderboard/Leaderboard.tsx";
import "./Homepage.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FeedPage from "../components/scrollerPagination/feedPage.tsx";
import { Button } from "react-bootstrap";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useLocation, useNavigate} from "react-router-dom";

export default function Homepage() {
    useEffect(() => {
            Cookies.remove("shown_post_ids"); // Verwijdert cookie client-side
        }, []);

    return (
        <Container>
            <Row className="feed-container" xs={1} md={2} xl={3} >
                <FeedPage />
            </Row>
        </Container>
    );
}
