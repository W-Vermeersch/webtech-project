import "./FullPostPage.css";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate.tsx";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import "./../Spinner.css";

import MapContainer from "../components/posts/full-post/MapContainer";
import Description from "../components/posts/full-post/Description";
import UserSection from "../components/posts/full-post/UserSection";
import PostImage from "../components/posts/full-post/PostImage";
import { Post, PostComment, User } from "../components/posts/PostInterface";
import {
  FETCH_POST,
  FETCH_USER_PROFILE,
  LIKE_POST,
  DELETE_LIKE,
} from "../api/urls";
import { level } from "../api/xp-system";
import ViewCommentsModal from "../components/scrollerPagination/Commenting/ViewComments.tsx";

// later make modules of components

export default function FullPost() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { post_id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showViewCommentsModal, setShowViewCommentsModal] = useState(false);

  const handleLiking = async () => {
    const post_id = post?.idx;
    const resp = await axiosPrivate.get(LIKE_POST, { params: { post_id } });
    if (resp.status === 200) {
      setLikes((prev) => prev + 1);
      setIsLiked(!isLiked);
    }
  };

  const handleUnliking = async () => {
    try {
      const post_id = post?.idx;
      const resp = await axiosPrivate.delete(DELETE_LIKE, {
        params: { post_id },
      });

      if (resp.status === 200) {
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      } else {
        console.error("Error unliking post");
      }
    } catch (err) {
      console.error("Error during unliking:", err);
    }
  };

  const handleViewAllComments = () => {
    setShowViewCommentsModal(true);
  };

  const handleCloseViewCommentsModal = () => {
    setShowViewCommentsModal(false);
  };

  useEffect(() => {
    setIsLoading(true);

    // Fetch post data: if post data is already in state, use that, otherwise fetch from server
    async function fetchPost() {
      try {
        if (state && state.post) {
          setPost(state.post);
          setLikes(state.post.likes);
          setIsLiked(state.post.liked);
        } else {
          const resp = await axiosPrivate.get(FETCH_POST, {
            params: { post_id },
          });
          if (resp.data.redirect) {
            navigate(resp.data.redirect, { replace: true });
          } else {
            console.log(resp.data);
            setPost(resp.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    }

    fetchPost();
  }, [post_id, navigate]);

  useEffect(() => {
    async function fetchUser(username: string | number) {
      try {
        const resp = await axiosPrivate.get(FETCH_USER_PROFILE, {
          params: { username },
        });
        if (resp.data.redirect) {
          navigate(resp.data.redirect, { replace: true });
        } else {
          setUser(resp.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (post) {
      if (post.user || post.username) {
        fetchUser(post.user ? post.user : post.username);
      } else {
        fetchUser(post.user_id);
      }
    }
  }, [post, navigate]);

  if (!post || !user) {
    return null;
  }

  return (
    <>
      {isLoading && (
        <Spinner className="spinner" animation="border" variant="success" />
      )}

      <div id="full-post" className="mt-2">
        <Row
          style={{ height: "80vh" }}
          id="full-post-row"
          className="flex-nowrap flex-md-wrap row-cols-md-3"
        >
          <Col xs={12} md={6} className=" order-md-4 order-2">
            <PostImage
              image_url={post.image_url}
              tags={post.tags}
              location={post.location}
              XP={post.rarity * post.score}
              likes={likes}
              isLiked={isLiked}
              handleLiking={handleLiking}
              handleUnliking={handleUnliking}
            />
          </Col>
          <Col xs={12} className="comment-container order-md-5 order-4">
            <div
              className="comments mt-0 mb-3 mt-md-4 text-light"
              onClick={handleViewAllComments}
            >
              Click here to view the comments.
            </div>
          </Col>

          <Col xs={12} md={6} className="order-md-1 order-1">
            <div id="user" className="p-2 px-4 mb-3 mb-md-1 mt-md-3 rounded">
              <UserSection
                username={user.username}
                profile_pic={user.profilepicture}
                level={level(user.totalexp)}
              />
            </div>
          </Col>
          <Col xs={12} md={6} className="order-md-2 order-3">
            <Row>
              <Description description={post.description} />
            </Row>
          </Col>
          <Col xs={12} md={6} className="order-md-3 order-5">
            <Row>
              <MapContainer
                location={post.location}
                zoom={5}
                className="shadow-lg"
              />
            </Row>
          </Col>
        </Row>
      </div>
      {showViewCommentsModal && (
        <ViewCommentsModal
          show={showViewCommentsModal}
          onHide={handleCloseViewCommentsModal}
          post={post}
          authCheck={(action) => action()}
        />
      )}
    </>
  );
}
