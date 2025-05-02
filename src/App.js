import logo from "./logo.svg";
import "./App.css";

import Dashboard from "./Main/Dashboard";
import Case_details from "./Component/Case_details";
import SignIn from "./Main/Pages/SignIn";
import SignUp_Screen from "./Main/Pages/SignUp_Screen";
import ResetPassword from "./Main/Pages/ResetPassword";
import ForgotPassword from "./Main/Pages/ForgotPassword";
import { useGlobalTokenCheck } from "./Main/Pages/Component/utils/useGlobalTokenCheck";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { useEffect, useState } from "react";
import { useAuthValidator } from "./Main/Pages/Component/utils/validatteToke";
import { Spinner } from "react-bootstrap";

// Protected Route Component

const ProtectedRoute = ({ element }) => {
  const { validator, tokenChecked } = useAuthValidator();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (tokenChecked) {
      const result = validator.validateToken();
      setIsAuthenticated(result);
    }
  }, [tokenChecked, validator]);

  if (!tokenChecked || isAuthenticated === null) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner color="#36d7b7" size={60} />
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

// Global Token Check Component
const GlobalTokenValidator = () => {
  const { validator, tokenChecked } = useAuthValidator();

  useEffect(() => {
    const handleInteraction = () => {
      validator.validateToken();
    };

    const events = ["click", "keydown"];
    events.forEach((event) =>
      window.addEventListener(event, handleInteraction)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleInteraction)
      );
    };
  }, [validator]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <GlobalTokenValidator />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp_Screen />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forget-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/Dashboards"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/CaseDetails"
          element={<ProtectedRoute element={<Case_details />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
