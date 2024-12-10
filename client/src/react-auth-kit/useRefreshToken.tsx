import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { auth } = useAuth();
    return auth.refreshToken;
}

export default useRefreshToken;