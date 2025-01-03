import { Modal, Spinner } from "react-bootstrap";
import { User } from "../components/posts/PostInterface";
import "../components/scrollerPagination/Commenting/ViewComments.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { NavLink } from "react-router-dom";
import {
  FETCH_FOLLOWERS,
  FETCH_FOLLOWING,
} from "../api/urls";
import { useEffect, useState } from "react";

// Create a modal to view the list of followers or users you follow, works similarly to
// the modal for viewing comments, squeezed into 1 modal instead of having two seperate ones.
interface ViewUsersModalProps {
  show: boolean;
  onHide: () => void;
  username: string;
  list: boolean; // false for following list and true for followers list
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
  const showModal = show;

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
                    <p className="m-0" onClick={onHide}>
                      {user.username}
                    </p>
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
