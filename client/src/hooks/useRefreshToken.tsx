import useAuth from "./useAuth";
import axios from "../api/axios";
import useSignOut from "./useSignOut";
import { REFRESH_TOKEN } from "../api/urls";

// Implemented with the help of this tutorial: https://www.youtube.com/watch?v=nI8PYZNFtac&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=4
// refreshes the token if it's expired

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const signOut = useSignOut();

  const refresh = async () => {
    try {
      const response = await axios.post(REFRESH_TOKEN, {
        user: auth?.username,
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
      console.error(err);
      signOut();
    }
  };

  return refresh;
};

export default useRefreshToken;
