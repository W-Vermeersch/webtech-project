import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

interface Post {
  id: number;
  title: string;
}

// Mock posts data (replace with actual database fetch later)
const posts = [
  { id: 1, title: "post 1" },
  { id: 2, title: "post 2" },
  { id: 3, title: "post 3" },
  { id: 4, title: "post 4" },
  { id: 5, title: "post 5" },
  { id: 6, title: "post 6" },
];

// Mock a database fetch function
const fetchPost = async (page: number): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return posts.slice((page - 1) * 2, page * 2);
};

const FeedPage = () => {
  // Properly using useInfiniteQuery in React Query v5
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
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

  const lastPostRef = useRef<HTMLElement>(null)
  const {ref, entry} = useIntersection({
    root: lastPostRef.current,
    threshold: 1
  })

  useEffect(() => {
    if(entry?.isIntersecting) fetchNextPage()
  }, [entry])

  const _posts = data?.pages.flatMap((page) => page)

  return (
    <>
      posts:
        {_posts?.map((post, i)=> {
            if(i === _posts.length - 1) return(
                <div key={post.id} ref={ref}>{post.title}</div>
            )
            return <div key={post.id}>{post.title}</div>
        })}
      <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
        {isFetchingNextPage
          ? "Loading more"
          : (data?.pages?.length ?? 0) < 3
          ? "Load more"
          : "Nothing more to load"}
      </Button>
    </>
  );
};

export default FeedPage;
