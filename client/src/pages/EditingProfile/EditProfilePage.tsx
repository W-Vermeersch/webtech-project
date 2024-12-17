import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Image, Row } from "react-bootstrap";
import FileUploader from "../../components/posts/FileUploader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./EditProfilePage.css";
import { UPDATE_BIO, UPDATE_PFP } from "../../api/urls";

const EditProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  interface sendbio {
    new_bio: string;
  }

  // default state if location.state is undefined
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

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    profilepicture ? { profilepicture } : "/src/assets/default-profile.png"
  );
  const [username, setUsername] = useState(initName);
  const [bio, setBio] = useState(initBio);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("username", username);
    if (profilePic) {
      // Via a image file
      formData.append("file", profilePic);

      // Via a public url to a image
      // formData.append("file_url", file_url);
      const resp2 = await axiosPrivate.post(UPDATE_PFP, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload file : ", resp2);
    }
    formData.append("new_bio", bio);

    // console.log("Updated profile:", { profilePic, username, bio });
    const objectbio = { new_bio: bio };
    const resp = await axiosPrivate.post(UPDATE_BIO, objectbio);

    navigate(-1); // Navigate back to profile page
  };

  return (
    <Container
      className="p-4 text-white bg-dark rounded shadow-lg"
      style={{ maxWidth: "600px" }}
    >
      <div className="title-container text-center mb-4">
        <h2 className="title mb-2">Edit Your Profile!</h2>
        <p className="username text-center">@{username}</p>
        <hr className="my-3" />
      </div>
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
      <div className="mb-3">
        Profile picture
        <div className="file-uploader-container"></div>
        {/* FileUploader component */}
        <FileUploader
          setFieldValue={(field, value) => {
            if (field === "file") {
              setProfilePic(value);
              const preview = URL.createObjectURL(value);
              setPreviewUrl(preview);
            }
          }}
        />
      </div>

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
