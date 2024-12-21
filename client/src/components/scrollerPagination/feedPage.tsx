import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import { Button, Spinner, Col } from "react-bootstrap";
import SinglePost from "./SinglePost";
import { Post } from "../posts/PostInterface";
import { FETCH_RANDOM_POSTS, FETCH_RANDOM_FOLLOW_POSTS } from "../../api/urls";
import Search from "../navBar/Search";
import "./feedPage.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";

// Infinite scrolling functionality is adapted from the tutorial:
// https://www.youtube.com/watch?v=R1FG54FY-18
// Adjusted to our implementation of fetching posts: FETCH_RANDOM_POSTS and FETCH_RANDOM_FOLLOW_POSTS.
// Customized to render posts using the `SinglePost` component with props (for authentication)

interface FeedPageProps {
  activeTab: number;
}

export default function FeedPage({ activeTab }: FeedPageProps) {
  const axiosPrivate = useAxiosPrivate();
  const isAuthenticated = useIsAuthenticated();

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
      // by default do fetch of the ranodm posts
      response = await axiosPrivate.get(FETCH_RANDOM_POSTS, {
        params: { nr_of_posts: 6, page: pageParam },
      });
      current_posts = [];
    }

    current_posts = response.data.posts;
    //console.log("This is whats happening", response.data.posts);
    return current_posts || [];
  };

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

  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage]);

  const posts = data?.pages.flatMap((page) => page) || [];

  return (
    <>
      {/* Feed Content */}

      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          // Attach intersection observer to the last post
          return (
            <Col key={post.idx} className="mb-4">
              <div ref={ref} key={post.idx}>
                <SinglePost
                  post={post}
                  authCheck={function (action: () => void): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </Col>
          );
        }
        return (
          <Col key={post.idx} className="mb-4">
            <SinglePost
              key={post.idx}
              post={post}
              authCheck={function (action: () => void): void {
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
