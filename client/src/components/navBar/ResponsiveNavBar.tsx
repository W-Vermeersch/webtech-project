import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";

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

  return (
    <>
      {isMobile ? <NavBar/> : <NavBar />}
    </>
  );
}
