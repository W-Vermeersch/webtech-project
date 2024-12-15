import "./FooterNavBar.css";
import { NavLink } from "react-router-dom";
import { FaHome, FaMap, FaCrown, FaUser, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthUser";
import useSignOut from "../../hooks/useSignOut";
import { LOG_IN } from "../../api/urls";
import { Button } from "react-bootstrap";

export default function FooterNavBar() {
  const signOut = useSignOut();
  const authUser = useAuthUser();
  const navigate = useNavigate();

  function handleProfileClick() {
    if (!authUser) {
      navigate(LOG_IN);
    } else {
      navigate(`/profile/${authUser.username}`);
    }
  }

  async function handleLogIn() {
    navigate(LOG_IN);
  }

  async function handleLogOut() {
    if (!authUser) {
      return;
    }
    await signOut();
    navigate(LOG_IN);
    // deal with error handling
  }
  return (
    <div className="footer-navbar">
      <NavLink to="/home" className="footer-nav-item">
        <FaHome size={25} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/map" className="footer-nav-item">
        <FaMap size={25} />
        <span>Map</span>
      </NavLink>
      
      <NavLink to="/leaderboard" className="footer-nav-item">
        <FaCrown size={25} />
        <span>Leaderboard</span>
      </NavLink>
      <div className="footer-nav-item" onClick={handleProfileClick}>
        <FaUser size={25} />
        <span>Profile</span>
      </div>
      <NavLink to="/create-post" className="footer-nav-item">
        <div className="create-post-icon">
          <FaPlus size={25} />
        </div>
      </NavLink>
    </div>
  );
}
