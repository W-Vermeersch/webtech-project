import "./PostImage.css";

import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

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
  return (
    <div id="post-image-container">
      <Image id="post-image" src={image_url} alt="post" fluid />
      <div id="image-overlay" className="d-flex flex-column">
        <h4 className="mb-auto">
          <Badge bg="danger" className="m-3">
            {latitude}, {longitude} to City, Country
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
