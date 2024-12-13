export interface Post {
  user: string;
  image_url: string; // url to the storage api
  idx: number; // index of Post
  description: string;
  tags: string[];
  likes?: number; // in DB each posts has a list of all Users who liked
  location: Location;
  // added because profile pictures also exist
  profile_picture?: string;
  commentsection?: PostComment[];
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
  user_id: string;
  post_id: number; // index to refer to Post
  description: string;
}
