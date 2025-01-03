import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import { Spinner, Col } from "react-bootstrap";
import SinglePost from "./SinglePost";
import { Post } from "../posts/PostInterface";
import { FETCH_RANDOM_POSTS, FETCH_RANDOM_FOLLOW_POSTS } from "../../api/urls";
import "./feedPage.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

// Infinite scrolling functionality is adapted from the tutorial:https://www.youtube.com/watch?v=R1FG54FY-18
// Adjusted to our implementation of fetching posts: FETCH_RANDOM_POSTS and FETCH_RANDOM_FOLLOW_POSTS.
// Customized to render posts using the `SinglePost` component with props (for authentication)

// Activetab determines whether to fetch all random posts or only posts from people you follow.
// 0 = Random posts, 1 = Followed posts.
interface FeedPageProps {
  activeTab: number;
}

export default function FeedPage({ activeTab }: FeedPageProps) {
  const axiosPrivate = useAxiosPrivate();

  // Fetch posts from the backend
  const fetchPosts = async ({ pageParam = 1 }): Promise<Post[]> => {
    let current_posts = [];
    let response;
    if (activeTab === 0) {
      response = await axiosPrivate.get(FETCH_RANDOM_POSTS, {
        params: { nr_of_posts: 6, page: pageParam },
      });
    } else if (activeTab === 1) {
      response = await axiosPrivate.get(FETCH_RANDOM_FOLLOW_POSTS, {
        params: { nr_of_posts: 6, page: pageParam },
      });
    } else {
      // By default the fetch of random posts.
      response = await axiosPrivate.get(FETCH_RANDOM_POSTS, {
        params: { nr_of_posts: 6, page: pageParam },
      });
      current_posts = [];
    }

    current_posts = response.data.posts;
    //console.log("This is whats happening", response.data.posts);
    return current_posts || [];
  };

  // Use React Query for infinite scrolling and data fetching
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", activeTab],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage, allPages) => {
        // If the last page contains posts, fetch the next page
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  // Intersection observer for triggering the next page fetch
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  // Fetch the next "page" when the last post is in view. Fetch the next amount of posts to load.
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage]);

  // Flatten all fetched pages into a single array of posts (because we keep adding posts as we scroll).
  const posts = data?.pages.flatMap((page) => page) || [];

  return (
    <>
      {/* Feed Content */}
      {/* Map through posts and render them. */}
      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          // Attach intersection observer to the last post
          return (
            <Col key={post.idx} className="mb-4">
              <div ref={ref} key={post.idx}>
                <SinglePost
                  post={post}
                  authCheck={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </Col>
          );
        }
        return (
          // Last post in the list to render.
          <Col key={post.idx} className="mb-4">
            <SinglePost
              key={post.idx}
              post={post}
              authCheck={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </Col>
        );
      })}

      {/* Loading Spinner */}
      {isFetchingNextPage && (
        <div className="text-center my-3">
          <Spinner animation="border" variant="success" />
        </div>
      )}

      {/* Message when no more posts */}
      {!hasNextPage && (
        <div className="text-center my-3">
          <p>No more posts to load.</p>
        </div>
      )}
    </>
  );
}
