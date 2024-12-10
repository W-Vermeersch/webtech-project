import { useContext } from "react";
import AuthContext from "../context/AuthProvider.tsx";

// don't use this one directly, use the other hooks instead
const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;

