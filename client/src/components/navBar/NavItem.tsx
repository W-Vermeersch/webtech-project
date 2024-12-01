import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export default function NavItem({ to, className, children }: Props) {
  return (
    <NavLink className={`nav-link ${className}`} to={to}>
      {children}
    </NavLink>
  );
}
