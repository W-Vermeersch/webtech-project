import { useContext } from "react";
import AuthContext from "../context/AuthProvider.tsx";

// implemented with the help of this tutorial: https://www.youtube.com/watch?v=oUZjO00NkhY&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=3
// don't use this one directly, use the other hooks instead
const useAuth = () => {
    return useContext(AuthContext);
}

export default useAuth;

