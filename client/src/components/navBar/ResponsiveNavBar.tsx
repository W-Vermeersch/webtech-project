import NavBar from "./NavBar";
import FooterNavBar from "./FooterNavBar";

export default function ResponsiveNavBar() {
  // This component is used to render the NavBar component for desktop and the FooterNavBar component for mobile
  return (
    <>
      <div className="d-xs-block d-md-none">
        <FooterNavBar />
      </div>
      <div className="d-none d-md-block">
        <NavBar />
      </div>
    </>
  );
}
