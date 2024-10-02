
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext();

// UserProvider component that will wrap the app and provide user info to other components
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // This function will be called when the user logs in
  const login = (userData) => {
    setUser(userData);
    // Store user info in localStorage to persist it after refresh
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Check if the user is already logged in (on page refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};
