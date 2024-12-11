import useAuth from "./useAuth";
import axios from "../api/axios";
import useSignOut from "./useSignOut";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const signOut = useSignOut();

  const refresh = async () => {
    try {
      const response = await axios.post("/user/token", {
        user: auth?.username,
      });

      setAuth((prev) => {
        console.log(JSON.stringify(prev));
        console.log(response.data.accessToken);
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
