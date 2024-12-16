import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useAuthUser from "./useAuthUser";
import useRefreshTokenIfAuth from "./userRefreshIfAuthentificated";

const useAxiosWithToken = () => {
    const refresh = useRefreshTokenIfAuth();
    const { auth } = useAuthUser();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // Always set Authorization header, even if token is null
                config.headers['Authorization'] = auth?.token
                    ? `Bearer ${auth.token}`
                    : null;
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    auth.token = newAccessToken; // Optionally update auth state if needed
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh]);

    return axiosPrivate;
};

export default useAxiosWithToken;
