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

import { useCallback, useEffect, useState } from 'react';
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

// MUI Components
import { Snackbar, Alert, Chip, Avatar, Badge, IconButton, Tooltip } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  MarkChatRead as MarkChatReadIcon,
  Chat,
} from '@mui/icons-material';
import notificationSound from './Main/Pages/Component/utils/notificationSound';

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
      '/LFQ_ClientCaseEvaluationForm',
      '/LFA_Form',
      '/clientAppointMent',
      '/reschedule',
      '/approval/:token',
      '/reset-user-password/:token',
    ];

    const pathname = location.pathname;

    // Helper function to check if route is public
    const isPublicRoute = (path) => {
      return publicRoutes.some((route) => {
        if (route.includes(':token')) {
          // Handle dynamic token routes
          const base = route.split('/:token')[0];
          return path.startsWith(base);
        }
        return path === route;
      });
    };

    // Don't validate on public routes
    if (isPublicRoute(pathname)) return;

    const redirectPath = localStorage.getItem('redirectPath');

    // Don't validate if user is on the redirect path
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

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [unreadMentions, setUnreadMentions] = useState([]);

  // MUI Notification States - GLOBAL
  const [mentionNotification, setMentionNotification] = useState(null);
  const [newMessageNotification, setNewMessageNotification] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [messageSnackbarOpen, setMessageSnackbarOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const notificationOpen = Boolean(notificationAnchor);
  const [decodedToken, setDecodedToken] = useState(null);

  // ✅ Initialize notification sound on component mount
  useEffect(() => {
    notificationSound.enableSound();

    // Optional: Load user preference from localStorage
    const soundPreference = localStorage.getItem('notificationSound');
    if (soundPreference === 'disabled') {
      notificationSound.disableSound();
    }
  }, []);

  // ✅ Global function to show notifications - can be called from anywhere
  const showGlobalNotification = useCallback((data) => {
    setMentionNotification(data);
    setSnackbarOpen(true);
    //  mention sound
    notificationSound.playMentionSound();
    setTimeout(() => setSnackbarOpen(false), 6000);
  }, []);

  const showNewMessageNotification = useCallback((data) => {
    setNewMessageNotification(data);
    setMessageSnackbarOpen(true);
    notificationSound.playBeep();
    setTimeout(() => setMessageSnackbarOpen(false), 6000);
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  useEffect(() => {
    // Only proceed if token exists and is valid
    if (!cookies.token || typeof cookies.token !== 'string') {
      console.log('🔴 No valid token found, skipping socket connection');
      if (SocketService.socket && SocketService.socket.connected) {
        SocketService.disconnect();
      }
      return;
    }

    try {
      const decoded = jwtDecode(cookies.token);
      setDecodedToken(decoded);

      if (!SocketService.socket || !SocketService.socket.connected) {
        console.log('🔌 Connecting to socket...');
        SocketService.connect(decoded._id);
      }

      // Global mention notification listener
      const handleGlobalMention = (data) => {
        console.log('🔔 Global mention notification:', data);
        showGlobalNotification(data);
      };

      // Global unread mentions listener
      const handleGlobalUnreadMentions = (data) => {
        console.log('📋 Global unread mentions:', data);
        setUnreadMentions(data.mentions || []);
      };
      // Global Message Delivery Status Listener
      const handleGlobalMessageDelivered = (data) => {
        console.log('📨 Global message delivered event:', data);
        // Yeh event trigger hoga jab koi message delivered ho
        // Aap yahan pe koi state update kar sakte hain agar chahiye
      };
      // New Message Notification Listener
      const handleNewMessageNotification = (data) => {
        console.log('📱 New message notification:', data);
        showNewMessageNotification(data);
      };

      // 2. New Message Notification Listener
      SocketService.onNewMessageNotification(showNewMessageNotification);
      // Set up global listeners
      SocketService.socket?.off('userMentioned', handleGlobalMention);
      SocketService.socket?.off('unreadMentions', handleGlobalUnreadMentions);
      SocketService.socket?.off('newMessageNotification', handleNewMessageNotification);
      SocketService.socket?.off('messagesDelivered', handleGlobalMessageDelivered);

      SocketService.onUserMentioned(handleGlobalMention);
      SocketService.onUnreadMentions(handleGlobalUnreadMentions);
      SocketService.onMessageDelivered(handleGlobalMessageDelivered);
    } catch (error) {
      console.error('❌ Token decoding failed:', error);
      removeCookie('token');
      if (SocketService.socket && SocketService.socket.connected) {
        SocketService.socket.disconnect();
      }
    }

    return () => {
      // Cleanup global listeners
      if (SocketService.socket) {
        SocketService.socket.off('userMentioned');
        SocketService.socket?.off('newMessageNotification');
        SocketService.socket.off('unreadMentions');
        SocketService.socket.off('messagesDelivered');
      }
    };
  }, [cookies.token, showGlobalNotification, showNewMessageNotification, removeCookie]);

  // ✅ Function to mark mention as read (Global)
  const handleMarkMentionAsRead = useCallback(
    (messageId) => {
      if (decodedToken?._id && messageId) {
        SocketService.markMentionAsRead(decodedToken._id, messageId);
        setUnreadMentions((prev) => prev.filter((mention) => mention._id !== messageId));
      }
    },
    [decodedToken?._id]
  );

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNavigateToMention = (mention) => {
    // You can implement global navigation logic here
    console.log('Navigate to chat from global:', mention.chat?._id);
    handleNotificationClose();
  };

  const handleMarkAllMentionsAsRead = () => {
    unreadMentions.forEach((mention) => {
      handleMarkMentionAsRead(mention._id);
    });
    handleNotificationClose();
  };

  return (
    <BrowserRouter>
      <GlobalTokenValidator />
      <Routes>
        {/* Your existing routes */}
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

      {/* Global Notification Badge - Always visible when there are unread mentions */}
      {unreadMentions.length > 0 && (
        <Tooltip title="Unread Mentions">
          <IconButton
            onClick={handleNotificationClick}
            color="primary"
            sx={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                background: '#f5f5f5',
              },
            }}
          >
            <Badge badgeContent={unreadMentions.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      )}

      {/* Global Mentions Popover */}
      {notificationOpen && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '16px',
            minWidth: '300px',
            maxWidth: '400px',
            maxHeight: '400px',
            overflow: 'auto',
            zIndex: 9998,
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 style={{ margin: 0 }}>Unread Mentions ({unreadMentions.length})</h6>
            <div>
              <Tooltip title="Mark all as read">
                <IconButton size="small" onClick={handleMarkAllMentionsAsRead}>
                  <MarkChatReadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton size="small" onClick={handleNotificationClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          {unreadMentions.map((mention) => (
            <div
              key={mention._id}
              style={{
                padding: '8px',
                margin: '4px 0',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => handleNavigateToMention(mention)}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
            >
              <div className="d-flex align-items-center">
                <Avatar src={mention.sender?.ProfilePicture} sx={{ width: 32, height: 32, mr: 1 }}>
                  {mention.sender?.UserName?.charAt(0)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <strong>{mention.sender?.UserName}</strong>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>{mention.content?.substring(0, 100)}...</div>
                  <Chip
                    label={mention.chat?.chatName || 'Direct Message'}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* New Message Notification Snackbar */}
      <Snackbar
        open={messageSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setMessageSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setMessageSnackbarOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: '100%', cursor: 'pointer' }}
          icon={<Chat />}
          onClick={() => {
            // Navigate to the chat when notification is clicked
            if (newMessageNotification?.chatId) {
              // Your navigation logic here
              console.log('Navigate to chat:', newMessageNotification.chatId);
              setMessageSnackbarOpen(false);
            }
          }}
        >
          <strong>New message in {newMessageNotification?.chatName}</strong>
          <br />
          <span style={{ fontSize: '0.875rem' }}>
            {newMessageNotification?.senderName}: {newMessageNotification?.messageContent}
          </span>
        </Alert>
      </Snackbar>
      {/* Global MUI Mention Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          zIndex: 9999,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
          icon={<NotificationsIcon />}
        >
          <strong>You were mentioned!</strong>
          <br />
          {mentionNotification?.mentionedByUserName} mentioned you in {mentionNotification?.chatName}
        </Alert>
      </Snackbar>
    </BrowserRouter>
  );
}

export default App;
