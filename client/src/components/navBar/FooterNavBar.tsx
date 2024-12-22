import "./FooterNavBar.css";
import { NavLink } from "react-router-dom";
import { FaHome, FaMap, FaCrown, FaUser, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthUser";
import { LOG_IN } from "../../api/urls";
import { FaSearch } from "react-icons/fa";

// Icons found from website https://react-icons.github.io/react-icons/ (fa = font awesome)
// This component is the navigation bar for mobile dimensions.
export default function FooterNavBar() {
  const authUser = useAuthUser();
  const navigate = useNavigate();

  // Navigate the user to the login page if they click on the profile button and are not logged in.
  function handleProfileClick() {
    if (!authUser) {
      navigate(LOG_IN);
    } else {
      navigate(`/profile/${authUser.username}`);
    }
  }

  return (
    // Navigate to the correct paged based on the button that is pressed in the navbar.
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
        <span>Ranking</span>
      </NavLink>
      <div className="footer-nav-item" onClick={handleProfileClick}>
        <FaUser size={25} />
        <span>Profile</span>
      </div>
      <NavLink to="/search" className="footer-nav-item">
        <FaSearch size={25} />
        <span>Search</span>
      </NavLink>
      <NavLink to="/create-post" className="footer-nav-item">
        <div className="create-post-icon">
          <FaPlus size={25} />
        </div>
      </NavLink>
    </div>
  );
}
