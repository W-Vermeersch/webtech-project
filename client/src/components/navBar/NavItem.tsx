import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  children: React.ReactNode;
}

export default function NavItem({ to, children }: Props) {
  return (
    <NavLink className="nav-link" to={to}>
      {children}
    </NavLink>
  );
}
