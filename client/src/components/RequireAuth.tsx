import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../react-auth-kit/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth.username ? (
    <Outlet />
  ) : (
    <Navigate to="/user/log-in" state={{ from: location }} replace />
  );
};

export default RequireAuth;
