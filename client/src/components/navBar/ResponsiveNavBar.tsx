import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import FooterNavBar from "./FooterNavBar";

export default function ResponsiveNavBar() {
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
