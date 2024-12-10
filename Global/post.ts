export class Post {
    title:string;
    user: string;
    image_url: string; // url to the storage api
    idx: number; // index of Post
    description: string = "";
    tags: string[] = [];
    likes: number = 0; // in DB each posts has a list of all Users who liked
    longitude: number | null;
    latitude: number | null;
    commentsection: Comment[];

    constructor(body: any) {
        for (const key in body) {
            if (key in this) {
                const value = body[key];
                (this as any)[key] = value;
            }
        }
    }
}

export class Comment{
    idx: number; // index to refer to Post
    user: string;
    comment: string;
}