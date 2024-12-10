import useAuth from "./useAuth";

const useIsAuthenticated = () => {
    const { auth } = useAuth();

    return (
        auth.username ? true : false
    );
}

export default useIsAuthenticated;