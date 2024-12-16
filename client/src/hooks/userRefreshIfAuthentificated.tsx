import useAuth from "./useAuth";
import axios from "../api/axios";
import useSignOut from "./useSignOut";
import { REFRESH_TOKEN } from "../api/urls";

const useRefreshTokenIfAuth = () => {
    const { auth, setAuth } = useAuth();
    const signOut = useSignOut();

    const refresh = async () => {
        // Guard clause to check if a user is registered
        if (!auth?.username) {
            console.warn("No registered user found. Skipping token refresh.");
            return null;
        }

        try {
            const response = await axios.post(REFRESH_TOKEN, {
                user: auth.username,
            });

            setAuth((prev) => {
                return {
                    ...prev,
                    token: response.data.accessToken,
                    username: response.data.username,
                    userID: response.data.userID,
                };
            });

            return response.data.accessToken;
        } catch (err) {
            console.error("Error refreshing token:", err);
            signOut();
        }
    };

    return refresh;
};

export default useRefreshTokenIfAuth;