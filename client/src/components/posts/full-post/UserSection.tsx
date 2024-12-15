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
    <Row>
      <Col xs="auto">
        <Image src={profile_pic} alt="profile pic" roundedCircle width={150} height={150}/>
      </Col>
      <Col className="p-1">
        <Row>
          <h2 className="text-light mt-2">{username}</h2>
        </Row>
        <Row>
          <Col>
            <h3 className="text-light">{"Level " + level}</h3>
          </Col>
          <Col className="d-flex justify-content-end">
            <Button className="me-3" variant="outline-light">Follow</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
