export interface Post {

}

export interface User {
    id: number | null,
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

export interface Comment {}