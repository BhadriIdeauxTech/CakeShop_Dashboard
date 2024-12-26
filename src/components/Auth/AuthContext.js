import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    const storedLoginTime = localStorage.getItem('loginTime');

    if (storedAuth && storedLoginTime) {
      const timeElapsed = Date.now() - parseInt(storedLoginTime, 10);
      if (timeElapsed < 3600000) {
        return true;
      }
    }
    return false;
  });

  const [authTimer, setAuthTimer] = useState(null);

  const login = () => {
    setIsAuthenticated(true);
    const currentTime = Date.now();
    localStorage.setItem('auth', true);
    localStorage.setItem('loginTime', currentTime);

    const timer = setTimeout(() => {
      logout();
    }, 3600000);
    setAuthTimer(timer);
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (authTimer) clearTimeout(authTimer);
    localStorage.removeItem('auth');
    localStorage.removeItem('loginTime');
  };

  useEffect(() => {
    if (isAuthenticated) {
      const storedLoginTime = localStorage.getItem('loginTime');
      if (storedLoginTime) {
        const timeElapsed = Date.now() - parseInt(storedLoginTime, 10);
        // Calculate remaining time for the session and set a new timer
        const remainingTime = 3600000 - timeElapsed;
        const timer = setTimeout(() => {
          logout();
        }, remainingTime);
        setAuthTimer(timer);
      }
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
