import useAuth from "./useAuth";

const useSignOut = () => {
  const { setAuth } = useAuth();

  const signOut = () => {
    setAuth({ token: "", refreshToken: "", username: "", userID: 0 });
  };
  return signOut;
};

export default useSignOut;
