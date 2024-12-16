export interface Post {
  user: string;
  username: string;
  user_id: number;
  image_url: string; // url to the storage api
  idx: number; // index of Post
  post_id?: number; // index of Post
  description: string;
  tags: string[];
  liked?: boolean;
  likes?: number; // in DB each posts has a list of all Users who liked
  location: Location;
  // added because profile pictures also exist
  profile_picture?: string;
  comments?: PostComment[];
}

export interface User {
  username: string;
  user_id?: number;
  displayname: string;
  profilepicture: string;
  bio: string;
  totalexp: number;
  badges: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface PostComment {
  id: number;
  user: string;
  text: string;
  profile_picture?: string;
}
