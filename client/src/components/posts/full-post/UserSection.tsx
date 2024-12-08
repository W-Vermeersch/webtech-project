import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

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
    <Row className="">
      <Col xs="auto">
        <Image src={profile_pic} alt="profile pic" roundedCircle />
      </Col>
      <Col>
        <h2 className="text-light mt-2">{username}</h2>
        <h3 className="text-light">{"Level " + level}</h3>
      </Col>
      <Col xs="auto" className="ms-auto mt-auto">
        <Button variant="outline-light">Follow</Button>
      </Col>
    </Row>
  );
}
