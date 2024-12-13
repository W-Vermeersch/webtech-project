import "./FooterNavBar.css";
import { NavLink } from "react-router-dom";
import { FaHome, FaMap, FaCrown, FaUser, FaPlus } from "react-icons/fa";

export default function FooterNavBar() {
  return (
    <div className="footer-navbar">
      <NavLink to="/home" className="footer-nav-item">
        <FaHome size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/map" className="footer-nav-item">
        <FaMap size={24} />
        <span>Map</span>
      </NavLink>
      <NavLink to="/create-post" className="footer-nav-item">
        <div className="create-post-icon">
          <FaPlus size={24} />
        </div>
      </NavLink>
      <NavLink to="/leaderboard" className="footer-nav-item">
        <FaCrown size={24} />
        <span>Leaderboard</span>
      </NavLink>
      <NavLink to="/profile/:username" className="footer-nav-item">
        <FaUser size={24} />
        <span>Profile</span>
      </NavLink>
    </div>
  );
}
