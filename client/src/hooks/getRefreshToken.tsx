import useAuth from "./useAuth";

export default function getRefreshToken() {
    const { auth } = useAuth();
    
    return auth.refreshToken;
}