import { NavLink } from "react-router-dom";
import BSNavLink from "react-bootstrap/NavLink";

interface Props {
  to: string;
  className?: string;
  eventKey?: string;
  children: React.ReactNode;
}

export default function NavItem({ to, className, eventKey, children }: Props) {
  return (
    <BSNavLink className="p-0 m-0" eventKey={eventKey ? eventKey : ""}>
      <NavLink className={`nav-link ${className}`} to={to}>
        {children}
      </NavLink>
    </BSNavLink>
  );
}
