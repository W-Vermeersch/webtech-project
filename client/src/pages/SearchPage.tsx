import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { User, Post } from "../components/posts/PostInterface";
import PostTile from "../components/searchResults/PostTile";
import ProfileTile from "../components/searchResults/ProfileTile";

import Container from "react-bootstrap/Container";

export default function SearchPage() {
  const { type, search } = useParams();
  const searchType = type === "tag" ? "#" : "@";
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const mockUsers: User[] = [
    {
      user_id: 1,
      username: "user1",
      profilepicture: "https://via.placeholder.com/150",
      bio: "I am user1",
      totalexp: 100,
    },
    {
      user_id: 2,
      username: "user2",
      profilepicture: "https://via.placeholder.com/150",
      bio: "I am user2",
      totalexp: 200,
    },
    {
      user_id: 3,
      username: "user3",
      profilepicture: "https://via.placeholder.com/150",
      bio: "I am user3",
      totalexp: 300,
    },
  ];

  const mockPosts: Post[] = [
    {
      idx: 1,
      image_url: "https://via.placeholder.com/150",
      tags: ["tag1", "tag2"],
      description: "This is a post",
      user_id: 1,
      user: "user1",
      username: "user1",
      location: { latitude: 0, longitude: 0 },
    },
    {
      idx: 2,
      image_url: "https://via.placeholder.com/150",
      tags: ["tag3", "tag4"],
      description: "This is another post",
      user_id: 2,
      user: "user1",
      username: "user1",
      location: { latitude: 0, longitude: 0 },
    },
    {
      idx: 3,
      image_url: "https://via.placeholder.com/150",
      tags: ["tag5", "tag6", "tag7"],
      description: "This is yet another post",
      user_id: 3,
      user: "user1",
      username: "user1",
      location: { latitude: 0, longitude: 0 },
    },
  ];

  useEffect(() => {
     if (searchType === "#") {
       setUsers([]);
       setPosts(mockPosts);
     } else {
       setPosts([]);
       setUsers(mockUsers);
     }

  });

  return (
    <div>
      <Container
        className="d-flex flex-wrap justify-content-center"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {searchType === "#"
          ? posts?.map((post: Post) => <PostTile post={post} key={post.idx} />)
          : users?.map((user: User) => (
              <ProfileTile user={user} key={user.user_id} />
            ))}
      </Container>
    </div>
  );
}
