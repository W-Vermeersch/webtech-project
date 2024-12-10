import useAuth from "./useAuth";

const useAuthUser = () => {
    const { auth } = useAuth();

    return (
        auth.username ? {username: auth.username, userID: auth.userID} : false
    );
}

export default useAuthUser;