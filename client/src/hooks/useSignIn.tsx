import useAuth from "./useAuth";

const useSignIn = () => {
  const { setAuth } = useAuth();

  const signIn = (token: string, refreshToken: string, username: string, userID: number) => {
    setAuth({ token, refreshToken, username, userID });
  };

  return signIn;
};

export default useSignIn;
