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

import { useEffect } from "react";
import { useAuthValidator } from "./Main/Pages/Component/utils/validatteToke";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const authValidator = useAuthValidator();
  const [cookies] = useCookies(["token"]);

  // Validate token on initial render and when token changes
  const isAuthenticated = authValidator.validateToken();

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

// Global Token Check Component
const GlobalTokenValidator = () => {
  const authValidator = useAuthValidator();

  useEffect(() => {
    const handleInteraction = () => {
      authValidator.validateToken();
    };

    // Add event listeners for user activity
    const events = ["click", "keydown", "mousemove"];
    events.forEach((event) => {
      window.addEventListener(event, handleInteraction);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

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
