import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import SinglePost from "./SinglePost";
import { Post, PostComment } from "../posts/PostInterface";
import Search from "../navBar/Search";
import "./feedPage.css";

// mock comments
const mockcomments: PostComment[] = [
  {
    post_id: 1,
    user_id: "Alice",
    description: "This is such a beautiful picture! 😍",
  },
  {
    post_id: 2,
    user_id: "Bob",
    description: "Whatever bruh",
  },
  {
    post_id: 3,
    user_id: "aubrey",
    description: "I want to see it too.",
  },
];

const location = {
  latitude: 50.822376,
  longitude: 4.395356,
};
// Mock posts data (replace with actual database fetch later)
const posts: Post[] = [
  {
    idx: 1,
    image_url: "https://dummyimage.com/180",
    tags: ["Cat", "Feline"],
    user: "kellism1",
    profile_picture: "https://dummyimage.com/180",
    commentsection: mockcomments,
    location: location,
    description: "kfjlksjfsdlkf",
    user_id: 1, 
  },
  {
    idx: 2,
    image_url: "https://dummyimage.com/180",
    tags: ["Dog", "Canine"],
    user: "Ozioma",
    profile_picture: "https://dummyimage.com/180",
    commentsection: mockcomments,
    location: location,
    description: "fsdjfklds",
    user_id: 2,
  },
  {
    idx: 3,
    image_url: "https://dummyimage.com/180",
    tags: ["Bee", "FlyingInsect"],
    user: "Timo",
    profile_picture: "https://dummyimage.com/180",
    commentsection: mockcomments,
    location: location,
    description: "fadsf",
    user_id: 3,
  },
  {
    idx: 4,
    image_url: "https://dummyimage.com/180",
    tags: ["Wurmple", "Pokemon"],
    user: "William",
    profile_picture: "https://dummyimage.com/180",
    commentsection: mockcomments,
    location: location,
    description: "dddd",
    user_id: 4,
  },
  {
    idx: 5,
    image_url: "https://dummyimage.com/180",
    tags: ["Pikachu", "Pokemon"],
    user: "Lol",
    profile_picture: "https://dummyimage.com/180",
    commentsection: mockcomments,
    location: location,
    description: "qqqq",
    user_id: 5,
  },
];

// Mock a database fetch function
const fetchPost = async (page: number): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return posts.slice((page - 1) * 2, page * 2);
};

const FeedPage = () => {
  // Properly using useInfiniteQuery in React Query v5
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["query"],
    queryFn: async ({ pageParam = 1 }) => {
      const resp = await fetchPost(pageParam);
      return resp;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry]);

  const _posts = data?.pages.flatMap((page) => page);

  return (
    <>
      <div className="search-bar d-xs-block d-md-none">
        <Search />
      </div>
      <div className="feed-content">
        {_posts?.map((post, i) => {
          if (i === _posts.length - 1)
            return (
              <div ref={ref} key={post.idx}>
                <SinglePost post={post} />
              </div>
            );
          return <SinglePost key={post.idx} post={post} />;
        })}
        <Button disabled={isFetchingNextPage}>
          {isFetchingNextPage
            ? "Loading more"
            : (data?.pages?.length ?? 0) < 3
            ? "Load more"
            : "Nothing more to load"}
        </Button>
      </div>
    </>
  );
};

export default FeedPage;
