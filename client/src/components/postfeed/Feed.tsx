import "./Feed.css";

interface Post{
    id: number;
    username: string;
    imageurl: string;
    caption: string;
    comments: string[];
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