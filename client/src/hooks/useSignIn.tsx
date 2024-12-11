import useAuth from "./useAuth";

const useSignIn = () => {
  const { setAuth } = useAuth();

  const signIn = (token: string, username: string, userID: number) => {
    setAuth({ token, username, userID });
  };

  return signIn;
};

export default useSignIn;
