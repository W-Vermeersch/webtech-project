export interface Post {
    title?: string;
    user?: string;
    image_url: string; // url to the storage api
    idx?: number; // index of Post
    description: string;
    tags: string[];
    likes?: number; // in DB each posts has a list of all Users who liked
    longitude: number;
    latitude: number;
    // added because profile pictures also exist
    profilepicurl?: string;
    commentsection?: PostComment[];
  }

export interface PostComment{
    idx: number; // index to refer to Post
    user: string;
    comment: string;
  }