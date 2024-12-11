import useAuth from "./useAuth";
import axios from "../api/axios";

const useSignOut = () => {
  const { setAuth } = useAuth();

  const signOut = async () => {
    setAuth({ token: "", username: "", userID: 0 });
    try {
      const response = await axios.delete("/user/log-out");
      console.log(response.status);
    } catch (err) {
      console.error(err);
    }
  }

  return signOut;
};

export default useSignOut;
