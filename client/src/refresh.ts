import createRefresh from "react-auth-kit/createRefresh";
import axios from "axios";

export const refresh = createRefresh({
  interval: 10, // The time in sec to refresh the Access token,
  refreshApiCallback: async (param) => {
    try {
      const response = await axios.post("/token", param, {
        headers: { Authorization: `Bearer ${param.authToken}` },
      });
      console.log("Refreshing");
      return {
        isSuccess: true,
        newAuthToken: response.data.token,
      };
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
        newAuthToken: "",
      };
    }
  },
});
