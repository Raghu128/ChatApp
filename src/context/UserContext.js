import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []); // Add an empty dependency array to run the effect only once

  // Function to log in the user and save in localStorage
  const loginUser = (userData) => {
    if (!user) {
      const userWithPhotoURL = {
        ...userData,
        photoURL: userData.photoURL || "", // Default photoURL to an empty string
      };
      
      setUser(userWithPhotoURL);
      localStorage.setItem("user", JSON.stringify(userWithPhotoURL)); 
    }
  };

  const setUserData = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  // Function to update user's photoURL and store in localStorage
  const updateUserPhotoURL = (photoURL) => {
    if (user) {
      const updatedUser = { ...user, photoURL }; // Update user object with new photoURL

      setUser(updatedUser); // Update state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Persist updated user in localStorage
    }
  };

  // Function to log out user and clear localStorage
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{ user, loginUser, updateUserPhotoURL, logoutUser, setUserData}}
    >
      {children}
    </UserContext.Provider>
  );
};