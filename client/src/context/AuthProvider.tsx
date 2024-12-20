import React, { useState, createContext } from "react";

// Implemented with the help of this tutorial: https://www.youtube.com/watch?v=X3qyxo_UTR4&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=2
// This context is used to store the authentication information of the user.
interface AuthInterface {
  token: string;
  username: string;
  userID: number;
}

interface AuthContextType {
  auth: AuthInterface;
  setAuth: React.Dispatch<React.SetStateAction<AuthInterface>>;
}

const AuthContext = createContext<AuthContextType>({
  auth: { token: "", username: "", userID: 0 },
  setAuth: () => {},
});

export const AuthProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [auth, setAuth] = useState<AuthInterface>({ token: "", username: "", userID: 0 });

  const value = { auth, setAuth };

  return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};

export default AuthContext;
