import React, { useState, createContext } from "react";

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
