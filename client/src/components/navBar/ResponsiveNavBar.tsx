import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import FooterNavBar from "./FooterNavBar";

export default function ResponsiveNavBar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <>{isMobile ? <FooterNavBar /> : <NavBar />}</>;
}