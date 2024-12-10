import useAuth from "./useAuth";
import axios from "axios";
import RouteToServer from "../infos";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.post(RouteToServer("/user/token"), {
      withCredentials: true,
    });
    setAuth((prev) => {
      //console.log(JSON.stringify(prev));
      //console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };

  return refresh;
};


export default useRefreshToken;
