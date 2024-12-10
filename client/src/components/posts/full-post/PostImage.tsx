import "./PostImage.css";
import { getCityCountry } from "../../../infos";

import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

import { useEffect, useState } from "react";

interface PostImageProps {
  image_url: string;
  tags: string[];
  latitude: number;
  longitude: number;
}

export default function PostImage({
  image_url,
  tags,
  latitude,
  longitude,
}: PostImageProps) {

  const [location, setLocation] = useState<{ state: string; country: string }>({
    state: "",
    country: "",
  });

  useEffect(() => {
    async function fetchLocation() {
      const locationData = await getCityCountry(latitude, longitude);
      setLocation(locationData);
    }

    fetchLocation();
  }, [latitude, longitude]);

  return (
    <div id="post-image-container">
      <Image id="post-image" src={image_url} alt="post" fluid />
      <div id="image-overlay" className="d-flex flex-column">
        <h4 className="mb-auto">
          <Badge bg="danger" className="m-3">
            {location.state}, {location.country}
          </Badge>
        </h4>
        <Stack id="tags" direction="horizontal">
          {tags.map((tag) => (
            <Badge key={tag} bg="dark" className="m-2">
              {tag}
            </Badge>
          ))}
        </Stack>
        {/* add more things to overlay on the post image */}
      </div>
    </div>
  );
}
