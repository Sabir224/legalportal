import React, { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [state, setState] = useState({
    open: false,
    severity: "info",
    message: "",
    loading: false,
  });

  const showLoading = () =>
    setState({
      open: true,
      severity: "info",
      message: "Loading...",
      loading: true,
    });

  const showSuccess = (message) =>
    setState({ open: true, severity: "success", message, loading: false });

  const showError = (message) =>
    setState({ open: true, severity: "error", message, loading: false });

  const closeAlert = () => setState({ ...state, open: false });

  return (
    <AlertContext.Provider
      value={{ ...state, showLoading, showSuccess, showError, closeAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
