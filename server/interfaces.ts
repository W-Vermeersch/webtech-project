export interface Post {
    user: string | null;
    post_id: number,
    user_id: number,
    image_url: string[],
    description: string,
    tags: string[],
    score: number,
    rarity: number,
    public: boolean,
    location: {
        longitude: Number,
        latitude: Number,
    }
}

export interface User {
    user_id: number | null,
    username: string,
    email: string,
    password: string
}

export interface UserDecoration {
    userId: number | null,
    name: string,
    bio: string,
    profilePicture: String[],
    xp: number,
    badges: String[],
}

export interface Comment {
    comment_id: number,
    user_id: number,
    post_id: number,
    description: string
}