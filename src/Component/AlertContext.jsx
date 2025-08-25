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
  const showDataLoading = (value) =>
    setState({
      open: value,
      severity: "info",
      message: "Data Loading...",
      loading: value,
    });

  const showSuccess = (message) =>
    setState({ open: true, severity: "success", message, loading: false });

  const showError = (message) =>
    setState({ open: true, severity: "error", message, loading: false });

  const closeAlert = () => setState({ ...state, open: false });

  return (
    <AlertContext.Provider
      value={{ ...state, showLoading, showSuccess, showError, closeAlert,showDataLoading }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);


// import React, { createContext, useContext, useState } from "react";

// const AlertContext = createContext();

// export const AlertProvider = ({ children }) => {
//   const [state, setState] = useState({
//     open: false,
//     severity: "info",
//     message: "",
//     loading: false,
//   });

//   // --- Helpers ---
//   const showLoading = () =>
//     setState({
//       open: true,
//       severity: "info",
//       message: "Loading...",
//       loading: true,
//     });

//   const showDataLoading = (value) =>
//     setState({
//       open: value,
//       severity: "info",
//       message: "Data Loading...",
//       loading: value,
//     });

//   const showSuccess = (message) =>
//     setState({ open: true, severity: "success", message, loading: false });

//   const showError = (message) =>
//     setState({ open: true, severity: "error", message, loading: false });

//   // Close ONLY if not loading
//   const closeAlert = () =>
//     setState((prev) => (prev.loading ? prev : { ...prev, open: false }));

//   // Emergency close (ignores loading) — optional
//   const forceClose = () => setState((prev) => ({ ...prev, open: false, loading: false }));

//   return (
//     <AlertContext.Provider
//       value={{
//         ...state,
//         showLoading,
//         showDataLoading,
//         showSuccess,
//         showError,
//         closeAlert,
//         forceClose, // optional export
//       }}
//     >
//       {children}
//     </AlertContext.Provider>
//   );
// };

// export const useAlert = () => useContext(AlertContext);
