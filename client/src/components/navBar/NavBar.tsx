import NavItem from "./NavItem";
import "./NavBar.css";

export default function NavBar() {
  return (
    <header className="navbar navbar-expand-lg fixed-top bg-dark">
      <nav className="container-xxl">
        <div className="container-fluid d-flex">
          <NavItem to="/home">Animal Go</NavItem>
          <NavItem to="/home">Home</NavItem>
          <NavItem to="/user/sign-up">Sign Up</NavItem>
          <NavItem to="/map">Map</NavItem>
        </div>
      </nav>
    </header>
  );
}
