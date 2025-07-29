import logo from './logo.svg';
import './App.css';

import Dashboard from './Main/Dashboard';
import Case_details from './Component/Case_details';
//import UpdateCase from './Main/Pages/UpdateCase/UpdateCase';
//import FAQ from "./Main/Pages/FAQ/FAQ";
import SignIn from './Main/Pages/SignIn';
//import ViewCaseUpdates from "./Main/Pages/ViewCaseUpdates";
//import CaseSummary from "./Main/Pages/CaseSummary";
//import SignUp_Screen from "./Main/Pages/SignUp_Screen";
import ResetPassword from './Main/Pages/ResetPassword';
import ForgotPassword from './Main/Pages/ForgotPassword';
import { useGlobalTokenCheck } from './Main/Pages/Component/utils/useGlobalTokenCheck';

import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { useEffect, useState } from 'react';
import { useAuth } from './Main/Pages/Component/utils/validatteToke';
import { Spinner } from 'react-bootstrap';
import CasedetailsWithLink from './Component/CaseDetailsWithLink';
import ClientAppointMentWithLink from './Main/Pages/ClientAppointMentWithLink';
import ViewFolderWithLink from './Main/Pages/Component/Casedetails/ViewFolderWithLink';
import { useDispatch } from 'react-redux';
import { screenChange } from './REDUX/sliece';
import ClientConsultationForm from './Main/Pages/Component/Case_Forms/FormC';
import { AlertProvider } from './Component/AlertContext';
import GlobalAlert from './Component/GlobalAlert';
import PublicAppointment from './Main/Pages/AppointMents/Appointment';
import LegalConsultationStepper from './Main/Pages/AppointMents/SteperMultiStep';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { isPublicRoute } from './Main/Pages/Component/utils/utlis';

const stripePromise = loadStripe(
  'pk_test_51RoQo6BT7u3uYz1KIIKn6F2KvS3L27Wl3KFljhLwhxQpUURhdinGJgrF1FsnNjn0R2XcPZ3rKZoGxYXpgo80cDbv00NMFKr9m1'
); // Load your publishable key
function CaseRedirectHandler() {
  const { caseId, userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only proceed if we're on the case redirect path and params exist
    if (location.pathname.startsWith('/case/') && caseId && userId) {
      // Store the case information in localStorage
      localStorage.setItem('pendingCaseId', caseId);
      localStorage.setItem('pendingUserId', userId);
      localStorage.setItem('pendingScreenIndex', '1');
      localStorage.setItem('isPendingCase', 'true'); // Flag to indicate we have pending case

      // Navigate to dashboard
      navigate('/Dashboards');
    }
  }, [caseId, userId, navigate, location.pathname]);

  return null;
}

const AcknowledgeCaseHandoverRedirectHandler = () => {
  const { caseId, userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only proceed if we're on the case redirect path and params exist
    if (location.pathname.startsWith('/acknowledgeCaseHandover/') && caseId) {
      // Store the case information in localStorage
      localStorage.setItem('acknowledgeCaseId', caseId);
      localStorage.setItem('acknowledgeUserId', userId);

      localStorage.setItem('pendingScreenIndex', '1');
      // localStorage.setItem("isPendingCase", "true"); // Flag to indicate we have pending case

      // Navigate to dashboard
      navigate('/Dashboards');
    }
  }, [caseId, userId, navigate, location.pathname]);

  return null;
};

// Updated ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted path for redirect after login
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/" replace />;
  }

  return children;
};
const GlobalTokenValidator = () => {
  const { validateToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // List of public routes that don't need token validation
    const publicRoutes = [
      '/',
      '/signup',
      '/forget-password',
      '/reset-password',
      '/client-consultation',
      '/clientAppointMent/:phone/:name',
    ];
    const pathname = location.pathname;
    // Don't validate on public routes
    if (isPublicRoute(pathname)) return;

    const redirectPath = localStorage.getItem('redirectPath');

    // Don't validate if user is on the redirect path
    if (location.pathname === redirectPath) return;

    const handleInteraction = () => {
      validateToken();
    };

    const events = ['click', 'keydown'];
    events.forEach((event) => window.addEventListener(event, handleInteraction));

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleInteraction));
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
        {/*<Route path="/" element={<FAQ />} />*/}
        {/*<Route path="/" element={<UpdateCase />}/>*/}
        {/*<Route path="/" element={<ViewCaseUpdates />}/>*/}
        {/*<Route path="/SignUp" element={<SignUp_Screen />} />*/}
        {/* <Route path="/" element={<CaseSummary />} />*/}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route
          path="/clientAppointMent/:phone/:name"
          element={
            <Elements stripe={stripePromise}>
              <LegalConsultationStepper />
            </Elements>
          }
        />

        {/* Protected routes */}
        <Route
          path="/Dashboards"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/case/:caseId/:userId" element={<CaseRedirectHandler />} />
        <Route path="/acknowledgeCaseHandover/:caseId/:userId" element={<AcknowledgeCaseHandoverRedirectHandler />} />
        <Route
          path="/client-consultation"
          element={
            <AlertProvider>
              <ClientConsultationForm />
              <GlobalAlert />
            </AlertProvider>
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
