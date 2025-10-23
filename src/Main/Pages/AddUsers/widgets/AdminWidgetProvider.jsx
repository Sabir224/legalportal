// AdminWidgetContext.js
import React, { createContext, useContext, useState } from 'react';

const AdminWidgetContext = createContext();

export const AdminWidgetProvider = ({ children }) => {
  const [adminWidgetState, setAdminWidgetState] = useState({
    selectedChat: null,
    showCaseSheet: false,
    isProfile: true,
    adminData: null,
    profilePicBase64: null,
    selectedRole: null,
    editableFields: false,
  });

  return (
    <AdminWidgetContext.Provider value={{ adminWidgetState, setAdminWidgetState }}>
      {children}
    </AdminWidgetContext.Provider>
  );
};

export const useAdminWidget = () => {
  const context = useContext(AdminWidgetContext);
  if (!context) {
    throw new Error('useAdminWidget must be used within AdminWidgetProvider');
  }
  return context;
};
