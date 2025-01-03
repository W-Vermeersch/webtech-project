import "./PostImage.css";
import { getCityCountry } from "../../../geocoding";

import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

import { useEffect, useState } from "react";
import { Location } from "../PostInterface";

interface PostImageProps {
  image_url: string;
  tags: string[];
  location: Location;
  XP: number;
  likes: number;
  isLiked: boolean;
  handleLiking: () => void;
  handleUnliking: () => void;
}

export default function PostImage({
  image_url,
  tags,
  location,
  XP,
  likes,
  isLiked,
  handleLiking,
  handleUnliking,
}: PostImageProps) {
  const [stateCountry, setStateCountry] = useState<{
    state: string;
    country: string;
  }>({
    state: "",
    country: "",
  });

  // use reverse geocoding to get the country and state of the location of the post
  useEffect(() => {
    async function fetchLocation() {
      const locationData = await getCityCountry(
        location.latitude,
        location.longitude
      );
      setStateCountry(locationData);
    }

    fetchLocation();
  }, [location.latitude, location.longitude]);

  return (
    <div id="post-image-container">
      <Image id="post-image" src={image_url} alt="post" fluid />
      <div id="image-overlay" className="d-flex flex-column">
        <Stack id="tags" direction="horizontal">
          {tags[0] !== "None"
            ? tags.map((tag) => (
                <Badge key={tag} bg="dark" className="badge-tag m-2">
                  #{tag}
                </Badge>
              ))
            : null}
        </Stack>
        <h5 className="mb-auto">
          <Badge bg="danger" className="m-2">
            {`${XP} XP`}
          </Badge>
        </h5>
        <div className="like-container ms-3 bg-light p-2 rounded">
          <img
            src={isLiked ? "/src/assets/liked.svg" : "/src/assets/like.svg"}
            alt="Like"
            className="action-icon"
            onClick={() => {
              isLiked ? handleUnliking() : handleLiking();
            }}
            style={{ width: "24px", marginRight: "10px" }}
          />
          <span>{likes}</span>
        </div>
        <h3 className="location">
          <Badge bg="success" className="m-3">
            {stateCountry.country === ""
              ? "🌍"
              : `${stateCountry.state}, ${stateCountry.country}`}
          </Badge>
        </h3>
      </div>
    </div>
  );
}
