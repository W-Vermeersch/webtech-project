import { Modal, Nav, Spinner } from "react-bootstrap";
import { User } from "../components/posts/PostInterface";
import "../components/scrollerPagination/Commenting/ViewComments.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { NavLink } from "react-router-dom";
import {
  FETCH_FOLLOWER_AMOUNT,
  FETCH_FOLLOWERS,
  FETCH_FOLLOWING,
  FETCH_FOLLOWING_AMOUNT,
} from "../api/urls";
import { useEffect, useState } from "react";

interface ViewUsersModalProps {
  show: boolean;
  onHide: () => void;
  username: string;
  list: boolean; // false for following list and true for followers list
}

interface returnProp {
  username: string;
}

const ViewUsersList = ({
  show,
  onHide,
  username,
  list,
}: ViewUsersModalProps) => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(show);

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show, list]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = list ? FETCH_FOLLOWERS : FETCH_FOLLOWING;
      const response = await axiosPrivate.get(url, { params: { username } });

      console.log(response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{list ? "Followers" : "Following"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.user_id}
                  className="d-flex align-items-center mb-2"
                >
                  <NavLink to={`/profile/${user.username}`} replace>
                    <p className="m-0" onClick={onHide}>{user.username}</p>
                  </NavLink>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewUsersList;
