import "./Feed.css";

interface Post{
    id: number;
    username: string;
    caption: string;
    comments: string[];

    // from post.ts
    title?:string;
    user?: string;
    image_url?: string; // url to the storage api
    idx?: number; // index of Post
    description?: string;
    tags?: string[];
    likes?: number; // in DB each posts has a list of all Users who liked
    longitude?: number | undefined;
    latitude?: number | undefined;
}

interface PostsProps{
    posts: Post[]; // a list
}

export default function PostFeed({ posts }: PostsProps) {
    return (
        <>
            {posts.map((post) => (
                <div key={post.id}>
                    <h4>{post.username}</h4>
                    <p>{post.caption}</p>
                    <ul>
                        {post.comments.map((comment, index) => (
                            <li key={index}>{comment}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    );
}