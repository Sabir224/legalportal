import logo from './logo.svg';
import './App.css';

import Dashboard from './Main/Dashboard';
import Case_details from './Component/Case_details';
import SignIn from './Main/Pages/SignIn';
import ResetPassword from './Main/Pages/ResetPassword';
import ForgotPassword from './Main/Pages/ForgotPassword';
import { useGlobalTokenCheck } from './Main/Pages/Component/utils/useGlobalTokenCheck';

import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import React, { useEffect, useState, useContext } from 'react';
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
import HorizontalLinearStepper from './Main/Pages/AppointMents/SteperMultiStep';
import SocketService from './SocketService';
import LegalConsultationStepper from './Main/Pages/AppointMents/SteperMultiStep';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { isPublicRoute } from './Main/Pages/Component/utils/utlis';
import RescheduleConfirm from './Main/Pages/AppointMents/AppointmentReschedule';
import LFQ_ClientCaseEvaluationForm from './Main/Pages/Component/Case_Forms/LFQFrom';
import BookConsultation from './Main/Pages/AppointMents/GenerateBookLinkForwebiste';
import { jwtDecode } from 'jwt-decode';
import LEA_Form from './Main/Pages/Component/Case_Forms/LFA_form';
import AdminApprovalPage from './Main/Pages/AddUsers/ApprovalRequest';
import ResetUserPassword from './Main/Pages/AddUsers/ResetPasword';

// Create a context for user data
const UserContext = React.createContext();

const stripePromise = loadStripe(
  'pk_test_51RoQo6BT7u3uYz1KIIKn6F2KvS3L27Wl3KFljhLwhxQpUURhdinGJgrF1FsnNjn0R2XcPZ3rKZoGxYXpgo80cDbv00NMFKr9m1'
);

function CaseRedirectHandler() {
  const { caseId, userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/case/') && caseId && userId) {
      localStorage.setItem('pendingCaseId', caseId);
      localStorage.setItem('pendingUserId', userId);
      localStorage.setItem('pendingScreenIndex', '1');
      localStorage.setItem('isPendingCase', 'true');
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
    if (location.pathname.startsWith('/acknowledgeCaseHandover/') && caseId) {
      localStorage.setItem('acknowledgeCaseId', caseId);
      localStorage.setItem('acknowledgeUserId', userId);
      localStorage.setItem('pendingScreenIndex', '1');
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
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/" replace />;
  }

  return children;
};

const GlobalTokenValidator = () => {
  const { validateToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = [
      '/',
      '/signup',
      '/forget-password',
      '/reset-password',
      '/client-consultation',
      '/LFQ_ClientCaseEvaluationForm',
      '/LFA_Form',
      '/clientAppointMent',
      '/reschedule',
      '/approval/:token',
      '/reset-user-password/:token',
    ];

    const pathname = location.pathname;

    const isPublicRoute = (path) => {
      return publicRoutes.some((route) => {
        if (route.includes(':token')) {
          const base = route.split('/:token')[0];
          return path.startsWith(base);
        }
        return path === route;
      });
    };

    if (isPublicRoute(pathname)) return;

    const redirectPath = localStorage.getItem('redirectPath');
    if (pathname === redirectPath) return;

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

// Global Socket Connection Component
const GlobalSocketConnection = () => {
  const { isAuthenticated } = useAuth();
  const [cookies] = useCookies(['token']);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeSocketConnection = async () => {
      if (isAuthenticated && cookies.token) {
        try {
          // Decode token to get user info
          const decodedToken = jwtDecode(cookies.token);
          const userId = decodedToken.userId;

          if (userId) {
            setUser({ _id: userId });

            // Connect user globally
            console.log('🌐 Initializing global socket connection for user:', userId);
            SocketService.connect(userId);

            // Set user online
            setTimeout(() => {
              SocketService.setUserOnline(userId);
            }, 1000);
          }
        } catch (error) {
          console.error('❌ Error decoding token:', error);
        }
      }
    };

    initializeSocketConnection();

    return () => {
      // Cleanup on unmount
      if (user?._id) {
        console.log('🔴 Cleaning up global socket connection for user:', user._id);
        SocketService.setUserOffline(user._id);
        SocketService.disconnect();
      }
    };
  }, [isAuthenticated, cookies.token]);

  // Listen for logout events
  useEffect(() => {
    const handleUserLogout = (data) => {
      console.log('🚪 User logout event received:', data);

      // Check if the logout is for current user
      if (data.Email && cookies.token) {
        try {
          const decodedToken = jwtDecode(cookies.token);
          if (decodedToken.email === data.Email) {
            console.log('🔒 Logging out current user due to verification event');
            // You can trigger your logout logic here
            // For example: clear tokens, redirect to login, etc.
            localStorage.removeItem('token');
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Error checking logout event:', error);
        }
      }
    };

    // Listen for logout events
    SocketService.onUserVerification(handleUserLogout);

    return () => {
      SocketService.socket.off('UserLogOut', handleUserLogout);
    };
  }, [cookies.token]);

  // Listen for online/offline events
  useEffect(() => {
    const handleUserOnline = (data) => {
      console.log('🟢 User came online:', data.userId);
      // Update your UI state if needed
    };

    const handleUserOffline = (data) => {
      console.log('🔴 User went offline:', data.userId);
      // Update your UI state if needed
    };

    SocketService.socket.on('userOnline', handleUserOnline);
    SocketService.socket.on('userOffline', handleUserOffline);

    return () => {
      SocketService.socket.off('userOnline', handleUserOnline);
      SocketService.socket.off('userOffline', handleUserOffline);
    };
  }, []);

  return null;
};

function App() {
  const [cookies] = useCookies(['token']);
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      {/* Global Socket Connection - Always active when authenticated */}
      {isAuthenticated && <GlobalSocketConnection />}

      <GlobalTokenValidator />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/book" element={<BookConsultation />} />
        <Route
          path="/clientAppointMent"
          element={
            <Elements stripe={stripePromise}>
              <LegalConsultationStepper />
            </Elements>
          }
        />
        <Route path="/reschedule" element={<RescheduleConfirm />} />
        <Route path="/approval/:token" element={<AdminApprovalPage />} />
        <Route path="/reset-user-password/:token" element={<ResetUserPassword />} />

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
          path="/LFQ_ClientCaseEvaluationForm"
          element={
            <AlertProvider>
              <LFQ_ClientCaseEvaluationForm />
              <GlobalAlert />
            </AlertProvider>
          }
        />

        <Route
          path="/LFA_Form"
          element={
            <AlertProvider>
              <LEA_Form />
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
