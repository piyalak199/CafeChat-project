import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem("access_token"),
    userID: localStorage.getItem("userID"),
    username: localStorage.getItem("username"),
    displayName: localStorage.getItem("displayName"),
    coin: localStorage.getItem("coin"),
    pettypeID: localStorage.getItem("pettypeID"),
    petName: localStorage.getItem("petName"),
    petImg: localStorage.getItem("petImg"),
    roleID: localStorage.getItem("roleID"),
    roleName: localStorage.getItem("roleName")
  });

  useEffect(() => {
    // Optionally, listen for changes or handle side effects
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
