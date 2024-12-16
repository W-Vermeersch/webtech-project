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
}

export default function PostImage({
  image_url,
  tags,
  location,
}: PostImageProps) {
  const [stateCountry, setStateCountry] = useState<{
    state: string;
    country: string;
  }>({
    state: "",
    country: "",
  });

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
        <Stack id="tags" direction="horizontal" className="mb-auto">
          {tags[0] !== "None" ? tags.map((tag) => (
            <Badge key={tag} bg="dark" className="badge-tag m-2">
              #{tag}
            </Badge>
          )) : null}
        </Stack>
        <h3 className="location">
          <Badge bg="danger" className="m-3">
            {stateCountry.country === ""
              ? "🌍"
              : `${stateCountry.state}, ${stateCountry.country}`}
          </Badge>
        </h3>
        {/* add more things to overlay on the post image */}
      </div>
    </div>
  );
}
