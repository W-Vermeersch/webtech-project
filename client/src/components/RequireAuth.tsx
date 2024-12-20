import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Implemented with the help of the following tutorial: https://www.youtube.com/watch?v=oUZjO00NkhY&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=3
// This component is used to require authentication before rendering a page. If the user is not authenticated, they will be redirected to the log-in page.
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
