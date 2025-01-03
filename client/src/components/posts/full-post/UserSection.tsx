import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { NavLink } from "react-router-dom";

interface UserSectionProps {
  username: string;
  profile_pic: string;
  level: number;
}

export default function UserSection({
  username,
  profile_pic,
  level,
}: UserSectionProps) {
  return (
    <Row xs={2}>
      <Col xs="auto">
        <NavLink to={`/profile/${username}`}>
          <Image
            src={profile_pic}
            alt="profile pic"
            roundedCircle
            width={140}
            height={140}
          />
        </NavLink>
      </Col>
      <Col className="p-3 align-self-center">
        <Row>
          <NavLink to={`/profile/${username}`}>
            <h2 className="text-light mt-2">{username}</h2>
          </NavLink>
        </Row>
        <Row>
          <Col>
            <h3 className="text-light">{"Level: " + level}</h3>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
