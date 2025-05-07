import logo from "./logo.svg";
import "./App.css";

import Dashboard from "./Main/Dashboard";
import Case_details from "./Component/Case_details";
import SignIn from "./Main/Pages/SignIn";
import SignUp_Screen from "./Main/Pages/SignUp_Screen";
import ResetPassword from "./Main/Pages/ResetPassword";
import ForgotPassword from "./Main/Pages/ForgotPassword";
import { useGlobalTokenCheck } from "./Main/Pages/Component/utils/useGlobalTokenCheck";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useCookies } from "react-cookie";

import { useEffect, useState } from "react";
import { useAuth } from "./Main/Pages/Component/utils/validatteToke";
import { Spinner } from "react-bootstrap";
import CasedetailsWithLink from "./Component/CaseDetailsWithLink";
import ClientAppointMentWithLink from "./Main/Pages/ClientAppointMentWithLink";
import ViewFolderWithLink from "./Main/Pages/Component/Casedetails/ViewFolderWithLink";
const ProtectedRoute = ({ children }) => {
  const { validateToken, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateToken();

      if (!isValid) {
        // Only store if it's not the login or dashboard
        if (location.pathname !== "/" && location.pathname !== "/Dashboards") {
          localStorage.setItem("redirectPath", location.pathname);
        }
      }

      setIsValidToken(isValid);
    };

    checkAuth();
  }, [location.pathname]);

  if (isValidToken === null) {
    return (
      <div className="centered">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!isAuthenticated || !isValidToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const GlobalTokenValidator = () => {
  const { validateToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const redirectPath = localStorage.getItem("redirectPath");

    // Don't validate if user is on the redirect path
    if (location.pathname === redirectPath) return;

    const handleInteraction = () => {
      validateToken();
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
  }, [location.pathname, validateToken]);

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
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/case/:caseId/:userId"
          element={
            <ProtectedRoute>
              <CasedetailsWithLink />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-appointment/:caseId/:userId"
          element={
            <ProtectedRoute>
              <ClientAppointMentWithLink />
            </ProtectedRoute>
          }
        />
        <Route
          path="/folders/:caseId/:userId"
          element={
            <ProtectedRoute>
              <ViewFolderWithLink />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CaseDetails"
          element={
            <ProtectedRoute>
              <Case_details />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
