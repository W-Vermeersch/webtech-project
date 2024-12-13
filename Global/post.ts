export class Post {
    user: string;
    user_id: number;
    post_id: number;
    image_url: string[]; // url to the storage api
    description: string = "";
    tags: string[] = [];
    likes: number = 0; // in DB each posts has a list of all Users who liked
    rarity: number = 0;
    score: number = 0;
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

export class Like{
    post_id: number;
    user_id : number;
}