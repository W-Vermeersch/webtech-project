import useAuth from "./useAuth";

export default function useRefreshToken() {
    const { auth } = useAuth();
    
    return auth.refreshToken;
}