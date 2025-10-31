import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faA,
  faAddressCard,
  faArrowAltCircleDown,
  faArrowCircleDown,
  faArrowDown,
  faArrowDownWideShort,
  faBan,
  faBolt,
  faBook,
  faBookBible,
  faBookOpen,
  faBookReader,
  faBriefcase,
  faCalendar,
  faCashRegister,
  faChartArea,
  faChartBar,
  faChartColumn,
  faChartLine,
  faChartPie,
  faChartSimple,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faDashboard,
  faDoorOpen,
  faFolder,
  faForward,
  faHistory,
  faHome,
  faList,
  faList12,
  faListAlt,
  faListDots,
  faMessage,
  faMoneyBill1,
  faMoneyCheckDollar,
  faNoteSticky,
  faPerson,
  faPersonCane,
  faPersonCircleCheck,
  faPersonCircleMinus,
  faPersonCirclePlus,
  faPersonWalkingDashedLineArrowRight,
  faPowerOff,
  faQuestion,
  faRegistered,
  faScaleBalanced,
  faSignOut,
  faStamp,
  faStreetView,
  faTasks,
  faTasksAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faCcMastercard, faFacebook, faWhatsapp, faWpforms } from '@fortawesome/free-brands-svg-icons';
import Case_details from '../Component/Case_details';
import { useDispatch, useSelector } from 'react-redux';
import BasicCase from './Pages/Component/BasicCase';
import {
  Caseinfo,
  clientEmail,
  CloseType,
  FormCDetails,
  FormHDetails,
  goBackScreen,
  screenChange,
} from '../REDUX/sliece';
import LawyerProfile from './Pages/LawyerProfile';

import { useNavigate } from 'react-router-dom';
import Chat from './Pages/chat/Chat';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaWpforms } from 'react-icons/fa';
import UserProfile from './Pages/UserProfile';
import ChatVat from './Pages/NewChat/Chat';

import ClientAppointment from './Pages/ClientAppointment';
import { BsChevronRight } from 'react-icons/bs';
import UserListWidget from './Pages/chat/widgets/UserListWidget';
import SocketService from '../SocketService';
import axios from 'axios';
import { ApiEndPoint, useDecodedToken } from './Pages/Component/utils/utlis';
import AddCaseForm from './Pages/cases/CaseForm';
import CaseFilingForm from './Pages/cases/CaseMatter';
import { Cookies, useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import ViewUser from './Pages/ViewUser';
import AddUser from './Pages/AddUsers/AddUser';
import ViewUsers from './Pages/AddUsers/ViewUsers';
import ViewClient from './Pages/cases/ViewClient';
import AddCase from './Pages/cases/AddCase';
import { faAddressBook, faQuestionCircle, faStickyNote } from '@fortawesome/free-regular-svg-icons';
import ViewFolder from './Pages/Component/Casedetails/ViewFolder';
import Task from './Pages/Component/TaskManagemnet/Task';
import TaskList from './Pages/Component/TaskManagemnet/TaskList';

import AddTask from './Pages/Component/TaskManagemnet/AddTask';
import ClientConsultationForm from './Pages/Component/Case_Forms/FormC';
import FormHandover from './Pages/Component/Case_Forms/FormH';
import ViewFormC from './Pages/Component/Case_Forms/ViewFormC';
import DocumentFormCShow from './Pages/Component/Case_Forms/DocumentFormCShow';
import { AlertProvider } from '../Component/AlertContext';
import GlobalAlert from '../Component/GlobalAlert';
import ViewCaseUpdates from './Pages/ViewCaseUpdates';
import FAQ from './Pages/FAQ/FAQ';
import ViewFormH from './Pages/Component/Case_Forms/ViewFormH';
import FormTemplateUploader from './Pages/Component/Case_Forms/FormTemplateUploader';
import MOMEditor from './Pages/Component/Case_Forms/MOMEditor';
import ReceptionistCalendar from './Pages/ReceptionistCalendar';
import PublicAppointment from './Pages/AppointMents/Appointment';
import { alignContent, alignItems, fontSize, justifyContent, justifyItems, padding } from '@mui/system';
import CaseSummary from './Pages/cases/CaseSummary';
import LEA_Form from './Pages/Component/Case_Forms/LFA_form';
import LFQ_ClientCaseEvaluationForm from './Pages/Component/Case_Forms/LFQFrom';
import PaymentDashboard from './Pages/Finance/PaymentDashboard';
import InvoiceForm from './Pages/Finance/Legalportal_Finance/InvoiceForm';
import LegalServiceDashboard from './Pages/Finance/LegalServiceDashboard';
import { faCog } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const navigate = useNavigate();
  const screen = useSelector((state) => state.screen.value);
  const [currenScreen, setCurrentScreen] = useState('');
  const currentScreen = useSelector((state) => state.screen.value);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);

  const dispatch = useDispatch();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userData, setUserData] = useState(null);
  const storedEmail = sessionStorage.getItem('Email');
  const [loading, setLoading] = useState(true);
  let caseDetailsScreenTitle = ` ${reduxCaseInfo?.CaseNumber ? `(${reduxCaseInfo?.CaseNumber})` : ''}`;
  const hasFetched = useRef(false); // Ref to track if data has been fetched
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [viewClient, setViewClient] = useState(false);
  const [viewLawyer, setViewLawyer] = useState(false);
  // At the top of your component
  const [showCaseOptions, setShowCaseOptions] = useState(false);
  const [ShowFinanceOptions, setShowFinanceOptions] = useState(false);
  // Add state at top of component
  const [showFormOptions, setShowFormOptions] = useState(false);
  const [adminWidgetHandler, setAdminWidgetHandler] = useState(null);
  const [showSettingsOptions, setShowSettingsOptions] = useState(false);
  const adminWidgetState = useSelector((state) => state.screen.adminWidgetState);

  // console.log("________", cookies.token);
  // Get the decoded token
  const [decodedToken, setDecodedToken] = useState(null);
  useEffect(() => {
    if (cookies.token) {
      try {
        handlescreen2(0);

        setDecodedToken(jwtDecode(cookies.token));
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, [cookies.token]); // Decode token only when token changes
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!SocketService.socket || !SocketService.socket.connected) {
      console.log('🔌 Connecting to socket...');
      SocketService.socket.connect();
    }

    const handleMessagesDelivered = (data) => {
      console.log(' Logout 1 ', jwtDecode(cookies.token));
      if (data?.Email === jwtDecode(cookies.token)?.email) {
        navigate('/');
      }
    };

    SocketService.socket.off('UserLogOut', handleMessagesDelivered);
    SocketService.onUserVerification(handleMessagesDelivered);
  }, []);
  const validateToken = (decodedToken) => {
    console.log('Validating token:', decodedToken);

    // Check if token exists and has required structure
    if (!decodedToken || typeof decodedToken !== 'object') {
      console.log('Invalid token structure - redirecting');
      removeCookie('token');
      navigate('/');
      return false;
    }

    const currentTime = Date.now() / 1000;
    const isExpired = decodedToken.exp < currentTime;
    const hasRequiredFields = decodedToken?._id && decodedToken?.email && decodedToken?.Role;

    console.log(`Validation results - Expired: ${isExpired}, Has fields: ${hasRequiredFields}`);

    if (isExpired || !hasRequiredFields) {
      console.log('Token invalid - redirecting');
      removeCookie('token');
      navigate('/');
      return false;
    }

    console.log('Token is valid');
    return true;
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!authValidator.validateToken()) {
  //       return;
  //     }
  //   }, 5 * 60 * 1000); // Check every 5 minutes

  //   return () => clearInterval(interval);
  // }, []);
  const hasRun = useRef(false);

  useEffect(() => {
    // Retrieve any stored caseId, userId, screenIndex and formType from localStorage
    const pendingCaseId = localStorage.getItem('pendingCaseId');
    const pendingUserId = localStorage.getItem('pendingUserId');
    const pendingScreenIndex = localStorage.getItem('pendingScreenIndex');
    const pendingFormType = localStorage.getItem('pendingFormType');

    console.log('Pending values:', { pendingCaseId, pendingScreenIndex, pendingFormType });

    // If all values exist and it's an LFA form, dispatch screenChange
    if (pendingCaseId && pendingScreenIndex && pendingFormType === 'lfa') {
      console.log('Redirecting to LFA form for case:', pendingCaseId);

      // Also store the caseId in a way that the LFA form can access it
      localStorage.setItem('lfaCaseId', pendingCaseId);

      // Set the current screen to LFA form (screen 27)
      handlescreen2(27);
      setCurrentScreen(
        <AlertProvider>
          <LEA_Form token={decodedToken} />
          <GlobalAlert />
        </AlertProvider>
      );

      // Clear the stored values
      localStorage.removeItem('pendingCaseId');
      localStorage.removeItem('pendingUserId');
      localStorage.removeItem('pendingScreenIndex');
      localStorage.removeItem('pendingFormType');
    }
  }, [dispatch]);

  useEffect(() => {
    // Retrieve any stored caseId, userId, and screenIndex from localStorage
    const pendingCaseId = localStorage.getItem('pendingCaseId');
    const pendingUserId = localStorage.getItem('pendingUserId');
    const pendingScreenIndex = localStorage.getItem('pendingScreenIndex');
    console.log('________________:', pendingScreenIndex);
    // If all values exist, dispatch screenChange and clear the storage
    if (pendingCaseId && pendingUserId && pendingScreenIndex) {
      // Dispatch action to change to the Case Details screen (index 1)
      console.log('____________Checkt');
      handlescreen2(Number(pendingScreenIndex));
      setCurrentScreen(<Case_details token={decodedToken} />);

      // (Optional) If your Case Details component needs the caseId/userId,
      // you might dispatch additional actions or set state here.
      // e.g., dispatch(setCurrentCase(pendingCaseId, pendingUserId));

      // Clear the stored values to avoid repeating the action on future loads
      // localStorage.removeItem("pendingCaseId");
      // localStorage.removeItem("pendingUserId");
      // localStorage.removeItem("pendingScreenIndex");
    }
  }, [dispatch]);

  useEffect(() => {
    // Retrieve any stored caseId, userId, and screenIndex from localStorage
    const pendingCaseId = localStorage.getItem('acknowledgeCaseId');
    const pendingUserId = localStorage.getItem('acknowledgeUserId');
    const pendingScreenIndex = localStorage.getItem('pendingScreenIndex');
    console.log('________________:', pendingScreenIndex, decodedToken);
    if (pendingCaseId && pendingUserId && pendingScreenIndex && jwtDecode(cookies.token)?._id === pendingUserId) {
      console.log('____________Checkt');
      handlescreen2(Number(pendingScreenIndex));
      setCurrentScreen(<Case_details token={decodedToken} />);
    }
  }, [dispatch]);

  useEffect(() => {
    // if (!authValidator.validateToken()) {
    //   return;
    // }

    switch (screen) {
      case 0:
        setCurrentScreen(
          <AlertProvider>
            <BasicCase token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 1:
        setCurrentScreen(<Case_details token={decodedToken} />);
        break;
      case 2:
        setCurrentScreen(<ClientAppointment token={decodedToken} />);
        break;
      case 3:
        setCurrentScreen(<Chat token={decodedToken} />);
        break;
      case 4:
        setCurrentScreen(<UserProfile token={decodedToken} />);
        break;
      case 5:
        setCurrentScreen(<LawyerProfile token={decodedToken} />);
        break;

      case 6:
        setCurrentScreen(<CaseFilingForm token={decodedToken} />);
        break;
      case 7:
        setCurrentScreen(<ViewUser token={decodedToken} />);
        break;
      case 8:
        setCurrentScreen(
          <AlertProvider>
            <AddUser token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 9:
        setCurrentScreen(
          <AlertProvider>
            <ViewUsers token={decodedToken} screen={currenScreen} onRegisterAdminHandler={setAdminWidgetHandler} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 10:
        setCurrentScreen(<ViewClient token={decodedToken} />);

        break;
      case 11:
        setCurrentScreen(
          <AlertProvider>
            <AddCase token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 12:
        setCurrentScreen(
          <AlertProvider>
            <ViewFolder token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 13:
        setCurrentScreen(<Task token={decodedToken} />);
        break;
      case 14:
        setCurrentScreen(
          <AlertProvider>
            <TaskList token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 15:
        setCurrentScreen(
          <AlertProvider>
            <AddTask token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 16:
        setCurrentScreen(
          <AlertProvider>
            <ClientConsultationForm token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 17:
        setCurrentScreen(
          <AlertProvider>
            <FormHandover token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 18:
        setCurrentScreen(
          <AlertProvider>
            <ViewFormC token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 19:
        setCurrentScreen(<DocumentFormCShow token={decodedToken} />);
        break;
      case 20:
        setCurrentScreen(<ViewCaseUpdates token={decodedToken} />);
        break;
      case 21:
        setCurrentScreen(<FAQ token={decodedToken} />);
        break;
      case 22:
        setCurrentScreen(
          <AlertProvider>
            <ViewFormH token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 23:
        setCurrentScreen(
          <AlertProvider>
            <MOMEditor token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 24:
        setCurrentScreen(<ReceptionistCalendar token={decodedToken} />);
        break;
      case 25:
        <AlertProvider>
          <PublicAppointment />
        </AlertProvider>;
        break;
      case 26:
        setCurrentScreen(
          <AlertProvider>
            <CaseSummary token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 27:
        setCurrentScreen(
          <AlertProvider>
            <LEA_Form token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 28:
        setCurrentScreen(
          <AlertProvider>
            <LFQ_ClientCaseEvaluationForm token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 29:
        setCurrentScreen(
          <AlertProvider>
            <PaymentDashboard token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );
        break;
      case 30:
        setCurrentScreen(
          <AlertProvider>
            <InvoiceForm token={decodedToken} />
            <GlobalAlert />
          </AlertProvider>
        );

        break;
      case 31:
        setCurrentScreen(
          <AlertProvider>
            <LegalServiceDashboard />
            <GlobalAlert />
          </AlertProvider>
        );

        break;
      default:
        setCurrentScreen(<div>Invalid screen</div>);
    }
  }, [screen, decodedToken]); // Update screen when screen or token changes

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSheetOpen && sheetRef.current && !sheetRef.current.contains(event.target)) {
        setSheetOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSheetOpen]);
  const handleGoBack = () => {
    // Check if we're in LFA screen and showCaseSheet is true

    // Default back behavior
    dispatch(goBackScreen());
  };
  const onRegisterAdminHandler = (handler) => {
    setAdminWidgetHandler(handler);
  };
  useEffect(() => {
    if (storedEmail && !hasFetched.current) {
      const fetchClientDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${ApiEndPoint}getUserDetail/${storedEmail}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${cookies.token}`, // Manually send token
            },
          });

          console.log(response?.data); // ✅ Handle response data
          setUserData(response?.data);

          // ✅ Check if socket is already connected before reconnecting
          if (!SocketService.socket?.connected) {
            console.log('🔌 Connecting to socket...');
            // console.log("UserData", response.data);
            SocketService.connect(response?.data?._id);
          } else {
            console.log('⚡ Socket already connected');
          }
        } catch (err) {
          console.error('Error fetching client details:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchClientDetails();
      hasFetched.current = true;
    }

    return () => {
      if (SocketService.socket?.connected) {
        console.log('🛑 Disconnecting socket...');
        SocketService.socket.disconnect();
      }
    };
  }, [storedEmail]);

  const data = [
    { status: 'Active', name: 'ABC', number: '1234' },
    { status: 'Inactive', name: 'DEF', number: '5678' },
    { status: 'Pending', name: 'GHI', number: '9101' },
  ];

  const handlescreen2 = (number) => {
    dispatch(screenChange(number));
  };

  const handleLogOut = () => {
    removeCookie('token', { path: '/' });
    sessionStorage.clear();
    localStorage.removeItem('redirectPath');
    localStorage.removeItem('pendingCaseId');
    localStorage.removeItem('pendingUserId');
    navigate('/', { replace: true });
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const ScreenHeader = ({ title, onBack }) => {
    return (
      <div className="d-flex align-items-center">
        {title && !['Active', 'Close Negative', 'Close Positive'].includes(title.trim()) && (
          <button
            onClick={() => (onBack ? onBack() : handleGoBack())}
            className="p-0 me-2"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {/* Icon size responsive with Bootstrap utility classes */}
            <FaArrowLeft className="text-white d-none d-md-inline" style={{ fontSize: '24px' }} />
            <FaArrowLeft className="text-white d-inline d-md-none" style={{ fontSize: '15px' }} />
          </button>
        )}

        {/* Title responsive sizes */}
        <span className="text-white">
          <span className="d-none d-md-inline fs-4">{title}</span>
          <span className="d-inline d-md-none" style={{ fontSize: '15px' }}>
            {title}
          </span>
        </span>
      </div>
    );
  };

  // This function will reset the view state
  const handleBack = () => {
    setViewClient(false);
    setViewLawyer(false);
  };

  const reduxCaseCloseType = useSelector((state) => state.screen.CloseType);
  const [selectedOption, setSelectedOption] = useState(reduxCaseCloseType);
  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = async (option) => {
    await setSelectedOption(option);
    setShowOptions(false);

    // Example actions if needed per selection:
    dispatch(clientEmail(null));
    dispatch(CloseType(option));
    dispatch(Caseinfo(null));
    dispatch(FormCDetails(null));
    dispatch(FormHDetails(null));
    handlescreen2(0);
  };

  return (
    <div className="d-flex w-99 gap-3 m-1" style={{ height: '96vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div
        className={`sidebar d-flex flex-column text-white position-relative ${isCollapsed ? 'col-1' : 'col-2'}`}
        style={{
          width: isCollapsed ? '50px' : '180px',
          Width: isCollapsed ? '50px' : '180px',
        }}
      >
        {/* Collapse Toggle - hidden on small screens via CSS */}
        <div
          className="sidebar-toggle d-none d-lg-flex justify-content-center align-items-center mb-3"
          onClick={toggleCollapse}
          style={{
            position: 'absolute',
            right: '-10px',
            top: '10px',
            cursor: 'pointer',
            backgroundColor: '#d4af37',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            zIndex: 1010,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          {isCollapsed ? (
            <FaChevronRight style={{ color: 'white', fontSize: '10px' }} />
          ) : (
            <FaChevronLeft style={{ color: 'white', fontSize: '10px' }} />
          )}
        </div>

        {/* Sidebar Items */}
        {/* <div className="d-flex flex-column align-items-start px-2 mt-3">
          {[
            {
              icon: showOptions ? faChevronUp : faChevronDown,
              label: 'Dashboard',
              action: () => setShowOptions(!showOptions),
            },
            showOptions
              ? {
                  icon: faBolt,
                  label: 'Active',
                  style: {
                    backgroundColor: selectedOption === '' ? '#c0a262' : '#18273e', // Golden background
                    borderRadius: '6px',
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    marginLeft: 10,
                    // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },
                  action: () => {
                    handleSelect('');
                  },
                }
              : null,
            showOptions && decodedToken?.Role === 'admin'
              ? {
                  icon: faCheckCircle,
                  label: 'Close Positive',
                  style: {
                    backgroundColor: selectedOption === 'Close Positive' ? '#c0a262' : '#18273e', // Golden background
                    borderRadius: '6px',
                    marginLeft: 10,
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex', // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },
                  action: () => {
                    handleSelect('Close Positive');
                  },
                }
              : null,
            showOptions && decodedToken?.Role === 'admin'
              ? {
                  icon: faBan,
                  label: 'Close Negative',
                  style: {
                    marginLeft: 10,
                    backgroundColor: selectedOption === 'Close Negative' ? '#c0a262' : '#18273e', // Golden background
                    borderRadius: '6px',
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    // Horizontal center
                  },
                  action: () => {
                    handleSelect('Close Negative');
                  },
                }
              : null,
            {
              icon: faMessage,
              label: 'Messages',
              action: () => {
                dispatch(clientEmail(null));
                dispatch(FormCDetails(null));
                dispatch(FormHDetails(null));

                dispatch(Caseinfo(null));
                handlescreen2(3);
              },
            },
            decodedToken?.Role === 'admin'
              ? {
                  icon: faPersonCircleCheck,
                  label: 'View Users',
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));

                    handlescreen2(9);
                  },
                }
              : null,
            // decodedToken?.Role === 'admin'
            //   ? {
            //     icon: faBookOpen,

            //     label: 'Add Case',
            //     action: () => {
            //       dispatch(clientEmail(null));
            //       dispatch(Caseinfo(null));
            //       dispatch(FormCDetails(null));
            //       dispatch(FormHDetails(null));

            //       handlescreen2(11);
            //     },
            //   }
            //   : null,
            // decodedToken?.Role === 'admin'
            //   ? {
            //     icon: faBookReader,

            //     label: 'Case Summary',
            //     action: () => {
            //       dispatch(clientEmail(null));
            //       dispatch(Caseinfo(null));
            //       dispatch(FormCDetails(null));
            //       dispatch(FormHDetails(null));

            //       handlescreen2(26);
            //     },
            //   }
            //   : null,

            // Inside your items array or menu render
            decodedToken?.Role === 'admin'
              ? {
                  icon: faFolder,
                  label: 'Case',
                  action: () => setShowCaseOptions(!showCaseOptions), // Toggle options on click
                }
              : null,

            showCaseOptions && decodedToken?.Role === 'admin'
              ? {
                  icon: faBookOpen,
                  label: 'Add Case',
                  style: {
                    // backgroundColor: selectedOption === "Close Positive" ? '#c0a262' : "#18273e",      // Golden background
                    borderRadius: '6px',
                    marginLeft: 10,
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex', // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(11);
                  },
                }
              : null,

            showCaseOptions && decodedToken?.Role === 'admin'
              ? {
                  icon: faBookReader,
                  label: 'Summary',
                  style: {
                    // backgroundColor: selectedOption === "Close Positive" ? '#c0a262' : "#18273e",      // Golden background
                    borderRadius: '6px',
                    marginLeft: 10,
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex', // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(26);
                  },
                }
              : null,

            decodedToken?.Role !== 'client'
              ? {
                  icon: faTasksAlt,
                  label: 'View Task',
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));

                    handlescreen2(14);
                  },
                }
              : null,
            // {
            //   icon: faStickyNote,
            //   label: "Client Consultation Form",
            //   action: () => {
            //     dispatch(clientEmail(null));
            //     dispatch(Caseinfo(null));
            //     handlescreen2(16);
            //   },
            // },

            // decodedToken?.Role !== 'client'
            //   ? {
            //     icon: faList12,
            //     label: 'Form C List',
            //     action: () => {
            //       dispatch(clientEmail(null));
            //       dispatch(Caseinfo(null));
            //       dispatch(FormCDetails(null));
            //       dispatch(FormHDetails(null));

            //       handlescreen2(18);
            //     },
            //   }
            //   : null,
            // decodedToken?.Role !== 'client'
            //   ? {
            //     icon: faList,
            //     label: 'Form H List',
            //     action: () => {
            //       dispatch(clientEmail(null));
            //       dispatch(Caseinfo(null));
            //       dispatch(FormCDetails(null));
            //       dispatch(FormHDetails(null));

            //       handlescreen2(22);
            //     },
            //   }
            //   : null,

            // Inside your array of menu items — same pattern used
            decodedToken?.Role !== 'client'
              ? {
                  icon: faWpforms, // Or any icon for "Form"
                  label: 'Form',
                  action: () => setShowFormOptions(!showFormOptions), // Toggle sub-options
                }
              : null,

            showFormOptions && decodedToken?.Role !== 'client'
              ? {
                  icon: faList12,
                  label: 'Form C List',
                  style: {
                    // backgroundColor: selectedOption === "Close Positive" ? '#c0a262' : "#18273e",      // Golden background
                    borderRadius: '6px',
                    marginLeft: 10,
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex', // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(18);
                  },
                }
              : null,

            showFormOptions && decodedToken?.Role !== 'client'
              ? {
                  icon: faList,
                  label: 'Form H List',
                  style: {
                    // backgroundColor: selectedOption === "Close Positive" ? '#c0a262' : "#18273e",      // Golden background
                    borderRadius: '6px',
                    marginLeft: 10,
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex', // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(22);
                  },
                }
              : null,

            decodedToken?.Role === 'receptionist'
              ? {
                  icon: faCalendar,
                  label: 'Meeting Calendar',
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));

                    handlescreen2(24);
                  },
                }
              : null,
            // {
            //   icon: faStickyNote,
            //   label: "Form Hand Over",
            //   action: () => {
            //     dispatch(clientEmail(null));
            //     dispatch(Caseinfo(null));
            //     dispatch(FormCDetails(null));
            // dispatch(FormHDetails(null));

            //     handlescreen2(17);
            //   },
            // },

            decodedToken?.Role === 'admin'
              ? {
                  icon: faFolder,
                  label: 'Finance',
                  action: () => setShowFinanceOptions(!ShowFinanceOptions), // Toggle options on click
                }
              : null,

            ShowFinanceOptions && decodedToken?.Role === 'admin'
              ? {
                  icon: faBookOpen,
                  label: 'Invoice',
                  style: {
                    // backgroundColor: selectedOption === "Close Positive" ? '#c0a262' : "#18273e",      // Golden background
                    borderRadius: '6px',
                    marginLeft: 10,
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex', // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(30);
                  },
                }
              : null,
            ShowFinanceOptions && decodedToken?.Role === 'admin'
              ? {
                  icon: faMoneyBill1,
                  label: 'Payments',
                  style: {
                    // backgroundColor: selectedOption === "Close Positive" ? '#c0a262' : "#18273e",      // Golden background
                    borderRadius: '6px',
                    marginLeft: 10,
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex', // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },

                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(29);
                  },
                }
              : null,
            ShowFinanceOptions && decodedToken?.Role === 'admin'
              ? {
                  icon: faDashboard,
                  label: 'Legal Service',
                  style: {
                    // backgroundColor: selectedOption === "Close Positive" ? '#c0a262' : "#18273e",      // Golden background
                    borderRadius: '6px',
                    marginLeft: 10,
                    padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex', // Important for centering
                    alignItems: 'center', // Vertical center
                    justifyContent: 'center', // Horizontal center
                  },
                  action: () => {
                    // dispatch(clientEmail(null));
                    // dispatch(Caseinfo(null));
                    // dispatch(FormCDetails(null));
                    // dispatch(FormHDetails(null));
                    handlescreen2(31);
                  },
                }
              : null,

            {
              icon: faQuestionCircle,
              label: 'FAQs',
              action: () => {
                dispatch(clientEmail(null));
                dispatch(Caseinfo(null));
                dispatch(FormCDetails(null));
                dispatch(FormHDetails(null));

                handlescreen2(21);
              },
            },
            // {
            //   icon: faQuestionCircle,
            //   label: 'LFQ form',
            //   action: () => {
            //     dispatch(clientEmail(null));
            //     dispatch(Caseinfo(null));
            //     dispatch(FormCDetails(null));
            //     dispatch(FormHDetails(null));

            //     handlescreen2(28);
            //   },
            // },

            { icon: faSignOut, label: 'Logout', action: handleLogOut },
          ]
            .filter(Boolean)
            .map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center my-2"
                onClick={item.action}
                style={!item.style ? { gap: '10px', cursor: 'pointer' } : item.style}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  title={item.label} // Add title for hover effect
                  style={{
                    fontSize: '20px',
                    color: 'white',
                    marginLeft: isCollapsed ? '' : '',
                  }}
                />
                {!isCollapsed && (
                  <span
                    className="sidebar-label d-none d-lg-inline text-truncate"
                    style={{ fontSize: '16px', maxWidth: '150px', marginRight: '6px' }}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            ))}
        </div> */}

        <div
          className="d-flex flex-column align-items-center align-items-md-start px-3 mt-3 mb-3"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'none', // hides scrollbar in Firefox
            msOverflowStyle: 'none', // hides scrollbar in IE/Edge
          }}
        >
          {[
            // CASE (now contains everything Dashboard had)

            {
              icon: faScaleBalanced,
              label: 'Cases',
              style: {
                // padding: '5px',
                borderRadius: '6px',
                // padding: '5px',
                gap: '10px',
                cursor: 'pointer',
                display: 'flex',
                // marginLeft: 10,
                alignItems: 'center',
                justifyContent: 'center',
              },
              action: () => setShowCaseOptions(!showCaseOptions), // Toggle Case sub-menu
            },
            // Show Case submenu items when expanded
            showCaseOptions
              ? {
                  icon: faBolt,
                  label: 'Active Board',
                  style: {
                    // backgroundColor: selectedOption === '' ? '#c0a262' : '#18273e',
                    borderRadius: '6px',
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    // marginLeft: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => handleSelect(''),
                }
              : null,

            showCaseOptions && (decodedToken?.Role === 'admin' || decodedToken?.Role === 'finance')
              ? {
                  icon: faCheckCircle,
                  label: 'Close +ve Board',
                  style: {
                    // backgroundColor:
                    //   selectedOption === 'Close Positive' ? '#c0a262' : '#18273e',
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => handleSelect('Close Positive'),
                }
              : null,

            showCaseOptions && (decodedToken?.Role === 'admin' || decodedToken?.Role === 'finance')
              ? {
                  icon: faBan,
                  label: 'Close -ve Board',
                  style: {
                    //marginLeft: 10,
                    // backgroundColor:
                    //   selectedOption === 'Close Negative' ? '#c0a262' : '#18273e',
                    borderRadius: '6px',
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                  },
                  action: () => handleSelect('Close Negative'),
                }
              : null,

            // Additional Case submenu items
            showCaseOptions && (decodedToken?.Role === 'admin' || decodedToken?.Role === 'finance')
              ? {
                  icon: faBookOpen,
                  label: 'Add Case',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(11);
                  },
                }
              : null,

            showCaseOptions && (decodedToken?.Role === 'admin' || decodedToken?.Role === 'finance')
              ? {
                  icon: faBookReader,
                  label: 'Cases Summary',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(26);
                  },
                }
              : null,

            // Messages
            {
              icon: faMessage,
              label: 'Messages',
              action: () => {
                dispatch(clientEmail(null));
                dispatch(FormCDetails(null));
                dispatch(FormHDetails(null));
                dispatch(Caseinfo(null));
                handlescreen2(3);
              },
            },

            // Form Dropdown (now also includes View Task)
            decodedToken?.Role !== 'client'
              ? {
                  icon: faWpforms,
                  label: 'Forms & Tasks',
                  style: {
                    // padding: '5px',
                    borderRadius: '6px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    // marginLeft: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => setShowFormOptions(!showFormOptions),
                }
              : null,

            // === Form Submenu Items ===
            showFormOptions && decodedToken?.Role !== 'client'
              ? {
                  icon: faTasksAlt,
                  label: 'Tasks Board',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(14);
                  },
                }
              : null,

            showFormOptions && decodedToken?.Role !== 'client'
              ? {
                  icon: faList12,
                  label: 'Form C Board',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(18);
                  },
                }
              : null,

            showFormOptions && decodedToken?.Role !== 'client'
              ? {
                  icon: faList,
                  label: 'Form H Board',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(22);
                  },
                }
              : null,

            // Receptionist only
            decodedToken?.Role === 'receptionist'
              ? {
                  icon: faCalendar,
                  label: 'Meeting Calendar',
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(24);
                  },
                }
              : null,

            // Finance (Admin only)
            decodedToken?.Role === 'admin' || decodedToken?.Role === 'finance'
              ? {
                  icon: faChartColumn,
                  label: 'Finance',
                  style: {
                    // padding: '5px',
                    borderRadius: '6px',
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    // marginLeft: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => setShowFinanceOptions(!ShowFinanceOptions),
                }
              : null,

            ShowFinanceOptions && (decodedToken?.Role === 'admin' || decodedToken?.Role === 'finance')
              ? {
                  icon: faMoneyBill1,
                  label: 'Invoice',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(30);
                  },
                }
              : null,

            ShowFinanceOptions && (decodedToken?.Role === 'admin' || decodedToken?.Role === 'finance')
              ? {
                  icon: faChartLine,
                  label: 'Inquries Board',
                  style: {
                    borderRadius: '6px',

                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(29);
                  },
                }
              : null,

            ShowFinanceOptions && (decodedToken?.Role === 'admin' || decodedToken?.Role === 'finance')
              ? {
                  icon: faChartArea,
                  label: 'Services Board',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => handlescreen2(31),
                }
              : null,

            // === SETTINGS DROPDOWN ===
            {
              icon: faCog,
              label: 'Settings',
              action: () => setShowSettingsOptions(!showSettingsOptions),
            },

            // Settings submenu items
            showSettingsOptions && decodedToken?.Role === 'admin'
              ? {
                  icon: faPersonCircleCheck,
                  label: 'View Users',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(9);
                  },
                }
              : null,

            showSettingsOptions
              ? {
                  icon: faQuestionCircle,
                  label: 'FAQs',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: () => {
                    dispatch(clientEmail(null));
                    dispatch(Caseinfo(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(21);
                  },
                }
              : null,

            showSettingsOptions
              ? {
                  icon: faSignOut,
                  label: 'Logout',
                  style: {
                    borderRadius: '6px',
                    // marginLeft: 10,
                    // padding: '5px',
                    gap: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  action: handleLogOut,
                }
              : null,
          ]
            .filter(Boolean)
            .map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center my-2"
                onClick={item.action}
                style={!item.style ? { gap: '10px', cursor: 'pointer' } : item.style}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  title={item.label}
                  style={{
                    fontSize: '20px',
                    color: 'white',
                  }}
                />
                {!isCollapsed && (
                  <span
                    className="sidebar-label d-none d-lg-inline text-truncate"
                    style={{ fontSize: '16px', maxWidth: '150px', marginRight: '6px' }}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // keeps content inside
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between mb-2 px-3"
          style={{
            height: '50px',
            backgroundColor: '#18273e',
            borderBottom: '1px solid #ddd',
            borderRadius: '6px',
            marginRight: '10px',
            color: 'white',
          }}
        >
          <div className="d-flex align-items-center gap-2 justify-content-between p-3 position-relative">
            <h3 className="m-0">
              {screen === 0 && <ScreenHeader title={!selectedOption ? 'Active' : selectedOption} />}
              {screen === 1 && <ScreenHeader title={`Case Details${caseDetailsScreenTitle}`} onBack={handleGoBack} />}
              {screen === 2 && <ScreenHeader title={`Appointment${caseDetailsScreenTitle}`} />}
              {screen === 3 && <ScreenHeader title="Chat" />}
              {screen === 4 && <ScreenHeader title="Profile" />}
              {screen === 5 && <ScreenHeader title="Profile" />}
              {screen === 7 && <ScreenHeader title={`View Client${caseDetailsScreenTitle}`} />}
              {screen === 8 && <ScreenHeader title="Add User" />}
              {screen === 9 && (
                <ScreenHeader
                  title="View User"
                  onBack={() => {
                    if (adminWidgetHandler && adminWidgetHandler.handleBackNavigation) {
                      console.log('🔄 Dashboard: Using widget internal back navigation');
                      adminWidgetHandler.handleBackNavigation();
                    } else if (adminWidgetHandler && adminWidgetHandler.getIsProfile) {
                      // Check if profile is FALSE before calling normal back
                      const isProfile = adminWidgetHandler.getIsProfile();
                      console.log('📊 Dashboard: Profile state:', isProfile);

                      if (!isProfile) {
                        console.log('✅ Dashboard: Profile is FALSE, calling normal back');
                        dispatch(goBackScreen());
                      }
                    } else {
                      console.log('📱 Dashboard: No widget handler — calling normal back');
                      dispatch(goBackScreen());
                    }
                  }}
                />
              )}
              {screen === 10 && <ScreenHeader title={`View Client${caseDetailsScreenTitle}`} />}
              {screen === 11 && <ScreenHeader title="Add Case" />}
              {screen === 12 && <ScreenHeader title={`View Folder${caseDetailsScreenTitle}`} />}
              {screen === 20 && <ScreenHeader title={`Case Update${caseDetailsScreenTitle}`} />}
              {screen === 21 && <ScreenHeader title="FAQS" />}
              {screen === 14 && <ScreenHeader title={`View Task${caseDetailsScreenTitle}`} />}
              {screen === 15 && <ScreenHeader title={`Add Task${caseDetailsScreenTitle}`} />}
              {screen === 16 && <ScreenHeader title={`Form C${caseDetailsScreenTitle}`} />}
              {screen === 18 && <ScreenHeader title="Form C Board" />}
              {screen === 17 && <ScreenHeader title={`Form H${caseDetailsScreenTitle}`} />}
              {screen === 22 && <ScreenHeader title="Form H Board" />}
              {screen === 23 && <ScreenHeader title={`View Form MOM${caseDetailsScreenTitle}`} />}
              {screen === 24 && <ScreenHeader title="Meeting Calendar" />}
              {screen === 26 && <ScreenHeader title="Case Summary" />}
              {screen === 27 && <ScreenHeader title={`View LFA${caseDetailsScreenTitle}`} />}
              {screen === 28 && <ScreenHeader title={`View LFQ${caseDetailsScreenTitle}`} />}{' '}
              {screen === 29 && <ScreenHeader title={`Payment Dashboard`} />}
              {screen === 30 && <ScreenHeader title={`Finance ${caseDetailsScreenTitle}`} />}
              {screen === 31 && <ScreenHeader title={`Legal Service Dashboard `} />}
            </h3>

            {/* Admin Buttons */}
            {decodedToken?.Role === 'admin' && screen === 9 && (
              <div
                className="d-flex align-items-center my-2"
                onClick={() => {
                  dispatch(Caseinfo(null));
                  dispatch(clientEmail(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));

                  handlescreen2(8);
                }}
                style={{ gap: '10px', cursor: 'pointer' }}
              >
                <FontAwesomeIcon
                  icon={faPersonCirclePlus}
                  style={{
                    fontSize: '20px',
                    color: 'white',
                    marginLeft: '6px',
                  }}
                />
              </div>
            )}

            {decodedToken?.Role === 'admin' && screen === 10 && (
              <div
                className="d-flex align-items-center my-2"
                onClick={() => {
                  dispatch(Caseinfo(null));
                  dispatch(clientEmail(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));
                  handlescreen2(11);
                }}
                style={{ gap: '10px', cursor: 'pointer' }}
              >
                <FontAwesomeIcon
                  icon={faBookBible}
                  style={{
                    fontSize: '20px',
                    color: 'white',
                    marginLeft: '6px',
                  }}
                />
              </div>
            )}
          </div>

          <div id="notification-profile">
            {decodedToken?.Role !== 'admin' && decodedToken?.Role !== 'client' && (
              <div
                className="d-flex align-items-center px-2"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  dispatch(Caseinfo(null));
                  dispatch(clientEmail(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));
                  handlescreen2(5);
                }}
              >
                <FontAwesomeIcon icon={faUser} size="1x" color="white" className="me-2" />
                <p className="text-white m-0 fw-bold">{decodedToken?.Role?.toUpperCase()}</p>
              </div>
            )}
            {decodedToken?.Role === 'client' && (
              <button
                className="btn"
                onClick={() => {
                  dispatch(Caseinfo(null));
                  dispatch(clientEmail(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));

                  handlescreen2(4);
                }}
              >
                <FontAwesomeIcon icon={faUser} size="1x" color="white" className="" />
              </button>
            )}
          </div>
        </div>

        {/* Main Form */}
        {/* <div className=" py-2"> */}
        <div style={{ padding: 1, marginRight: '10px' }}>{currenScreen}</div>
        {/* </div> */}
      </div>
    </div>
  );
};
export default Dashboard;
