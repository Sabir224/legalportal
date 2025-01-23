import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { ApiEndPoint } from "../../Component/utils/utlis";

// Create a new context
export const UserContext = createContext();

// Create a context provider component

export const UserProvider = ({ children }) => {
  // State to store fetched user data
  const [users, setUsers] = useState([]);

  // State to store selected user data
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </UserContext.Provider>
  );
};
