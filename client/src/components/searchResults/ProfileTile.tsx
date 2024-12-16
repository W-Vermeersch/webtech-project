import "./ProfileTile.css";
import { NavLink } from "react-router-dom";
import { User } from "./../posts/PostInterface";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";

interface ProfileTileProps {
  user: User;
}

export default function ProfileTile({ user }: ProfileTileProps) {
  return (
    <div className="profile-tile">
      <NavLink to={`/profile/${user.username}`} state={{ user }}>
        <Stack gap={4} className="d-flex flex-column align-items-center">
          <Image src={user.profilepicture} roundedCircle />
          <h3 className="text-dark">{user.username}</h3>
        </Stack>
      </NavLink>
    </div>
  );
}
