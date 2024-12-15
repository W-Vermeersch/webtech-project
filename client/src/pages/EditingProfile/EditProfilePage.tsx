import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Image } from "react-bootstrap";
import FileUploader from "../../components/posts/FileUploader";
import "./EditProfilePage.css";

const EditProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Default state if location.state is undefined
  const {
    profilepicture,
    username: initName,
    bio: initBio,
  } = location.state || {};

  // Redirect to PageNotFound if state is missing
  useEffect(() => {
    if (!profilepicture && !initName && !initBio) {
      navigate("/PageNotFound", { replace: true });
    }
  }, [navigate, profilepicture, initName, initBio]);

  const [profilePic, setProfilePic] = useState(profilepicture);
  const [username, setUsername] = useState(initName);
  const [bio, setBio] = useState(initBio);

  const handleFileChange = (field: string, value: string) => {
    setProfilePic(value);
  };

  const handleSave = () => {
    console.log("Updated profile:", { profilePic, username, bio });
    // Add API logic here to save profile changes
    navigate(-1); // Navigate back to profile page
  };

  return (
    <Container
      className="p-4 text-white bg-dark rounded shadow-lg"
      style={{ maxWidth: "600px" }}
    >
      <div className="d-flex justify-content-between mb-4">
        <Button
          variant="link"
          className="text-white"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
      </div>

      {/* Profile Picture */}
      <div className="text-center mb-3">
        <Image
          src={profilePic || "/src/assets/default-profile.jpg"}
          roundedCircle
          width={120}
          height={120}
          className="mb-2"
        />
        <FileUploader setFieldValue={handleFileChange} />
      </div>

      {/* Edit Name */}
      <Form.Group controlId="username" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-dark text-white"
        />
      </Form.Group>

      {/* Edit Bio */}
      <Form.Group controlId="bio" className="mb-3">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bg-dark text-white"
        />
      </Form.Group>
    </Container>
  );
};

export default EditProfilePage;
