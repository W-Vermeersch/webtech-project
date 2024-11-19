export class Post{
    title:string;
    image_url: string[]; // url to the storage api
    idx: number; // index of Post
    description: string;
    tags: string[];
    likes: number; // in DB each posts has a list of all Users who liked
}

export class Comment{
    idx: number; // index to refer to Post
    user: string;
    comment: string;
}