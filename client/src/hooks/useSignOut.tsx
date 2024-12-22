import useAuth from "./useAuth";
import axios from "../api/axios";
import { LOG_OUT } from "../api/urls";

const useSignOut = () => {
  const { setAuth } = useAuth();

  const signOut = async () => {
    setAuth({ token: "", username: "", userID: 0 });
    try {
      await axios.delete(LOG_OUT);
    } catch (err) {
      console.error(err);
    }
  };

  return signOut;
};

export default useSignOut;
