import useAuth from "./useAuth";

const useToken = () => {
    const { auth } = useAuth();
    return auth.token;
}

export default useToken;