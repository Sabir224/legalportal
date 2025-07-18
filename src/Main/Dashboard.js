import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faBook,
  faBookBible,
  faBookOpen,
  faBookReader,
  faBriefcase,
  faCalendar,
  faCashRegister,
  faForward,
  faHome,
  faList,
  faList12,
  faListAlt,
  faListDots,
  faMessage,
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
  faSignOut,
  faStamp,
  faStreetView,
  faTasks,
  faTasksAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCcMastercard,
  faFacebook,
  faWhatsapp,
  faWpforms,
} from "@fortawesome/free-brands-svg-icons";
import Case_details from "../Component/Case_details";
import { useDispatch, useSelector } from "react-redux";
import BasicCase from "./Pages/Component/BasicCase";
import {
  Caseinfo,
  clientEmail,
  FormCDetails,
  FormHDetails,
  goBackScreen,
  screenChange,
} from "../REDUX/sliece";
import LawyerProfile from "./Pages/LawyerProfile";

import { useNavigate } from "react-router-dom";
import Chat from "./Pages/chat/Chat";
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaWpforms,
} from "react-icons/fa";
import UserProfile from "./Pages/UserProfile";
import ChatVat from "./Pages/NewChat/Chat";

import ClientAppointment from "./Pages/ClientAppointment";
import { BsChevronRight } from "react-icons/bs";
import UserListWidget from "./Pages/chat/widgets/UserListWidget";
import SocketService from "../SocketService";
import axios from "axios";
import { ApiEndPoint, useDecodedToken } from "./Pages/Component/utils/utlis";
import AddCaseForm from "./Pages/cases/CaseForm";
import CaseFilingForm from "./Pages/cases/CaseMatter";
import { Cookies, useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import ViewUser from "./Pages/ViewUser";
import AddUser from "./Pages/AddUsers/AddUser";
import ViewUsers from "./Pages/AddUsers/ViewUsers";
import ViewClient from "./Pages/cases/ViewClient";
import AddCase from "./Pages/cases/AddCase";
import {
  faAddressBook,
  faQuestionCircle,
  faStickyNote,
} from "@fortawesome/free-regular-svg-icons";
import ViewFolder from "./Pages/Component/Casedetails/ViewFolder";
import Task from "./Pages/Component/TaskManagemnet/Task";
import TaskList from "./Pages/Component/TaskManagemnet/TaskList";

import AddTask from "./Pages/Component/TaskManagemnet/AddTask";
import ClientConsultationForm from "./Pages/Component/Case_Forms/FormC";
import FormHandover from "./Pages/Component/Case_Forms/FormH";
import ViewFormC from "./Pages/Component/Case_Forms/ViewFormC";
import DocumentFormCShow from "./Pages/Component/Case_Forms/DocumentFormCShow";
import { AlertProvider } from "../Component/AlertContext";
import GlobalAlert from "../Component/GlobalAlert";
import ViewCaseUpdates from "./Pages/ViewCaseUpdates";
import FAQ from "./Pages/FAQ/FAQ";
import ViewFormH from "./Pages/Component/Case_Forms/ViewFormH";
import FormTemplateUploader from "./Pages/Component/Case_Forms/FormTemplateUploader";
import MOMEditor from "./Pages/Component/Case_Forms/MOMEditor";
import ReceptionistCalendar from "./Pages/ReceptionistCalendar";

const Dashboard = () => {
  const navigate = useNavigate();
  const screen = useSelector((state) => state.screen.value);
  const [currenScreen, setCurrentScreen] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);

  const dispatch = useDispatch();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userData, setUserData] = useState(null);
  const storedEmail = sessionStorage.getItem("Email");
  const [loading, setLoading] = useState(true);
  let caseDetailsScreenTitle = ` ${reduxCaseInfo?.CaseNumber ? `(${reduxCaseInfo?.CaseNumber})` : ""}`
  const hasFetched = useRef(false); // Ref to track if data has been fetched
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [viewClient, setViewClient] = useState(false);
  const [viewLawyer, setViewLawyer] = useState(false);

  // console.log("________", cookies.token);
  // Get the decoded token
  const [decodedToken, setDecodedToken] = useState(null);
  useEffect(() => {
    if (cookies.token) {
      try {
        handlescreen2(0);
        console.log("token dashborad", jwtDecode(cookies.token))// Decode and store token
        setDecodedToken(jwtDecode(cookies.token));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [cookies.token]); // Decode token only when token changes
  const [isValidating, setIsValidating] = useState(false);

  const validateToken = (decodedToken) => {
    console.log("Validating token:", decodedToken);

    // Check if token exists and has required structure
    if (!decodedToken || typeof decodedToken !== "object") {
      console.log("Invalid token structure - redirecting");
      removeCookie("token");
      navigate("/");
      return false;
    }

    const currentTime = Date.now() / 1000;
    const isExpired = decodedToken.exp < currentTime;
    const hasRequiredFields =
      decodedToken?._id && decodedToken?.email && decodedToken?.Role;

    console.log(
      `Validation results - Expired: ${isExpired}, Has fields: ${hasRequiredFields}`
    );

    if (isExpired || !hasRequiredFields) {
      console.log("Token invalid - redirecting");
      removeCookie("token");
      navigate("/");
      return false;
    }

    console.log("Token is valid");
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
    // Retrieve any stored caseId, userId, and screenIndex from localStorage
    const pendingCaseId = localStorage.getItem("pendingCaseId");
    const pendingUserId = localStorage.getItem("pendingUserId");
    const pendingScreenIndex = localStorage.getItem("pendingScreenIndex");
    console.log("________________:", pendingScreenIndex);
    // If all values exist, dispatch screenChange and clear the storage
    if (pendingCaseId && pendingUserId && pendingScreenIndex) {
      // Dispatch action to change to the Case Details screen (index 1)
      console.log("____________Checkt");
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
    const pendingCaseId = localStorage.getItem("acknowledgeCaseId");
    const pendingUserId = localStorage.getItem("acknowledgeUserId");
    const pendingScreenIndex = localStorage.getItem("pendingScreenIndex");
    console.log("________________:", pendingScreenIndex, decodedToken);
    if (pendingCaseId && pendingUserId && pendingScreenIndex && jwtDecode(cookies.token)?._id === pendingUserId) {
      console.log("____________Checkt");
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
        setCurrentScreen(<AddUser token={decodedToken} />);
        break;
      case 9:
        setCurrentScreen(
          <AlertProvider>
            <ViewUsers token={decodedToken} screen={currenScreen} />
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
        setCurrentScreen(<TaskList token={decodedToken} />);
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
        setCurrentScreen(<ViewFormH token={decodedToken} />);
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
      default:
        setCurrentScreen(<div>Invalid screen</div>);
    }
  }, [screen, decodedToken]); // Update screen when screen or token changes

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSheetOpen &&
        sheetRef.current &&
        !sheetRef.current.contains(event.target)
      ) {
        setSheetOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSheetOpen]);
  const handleGoBack = () => {
    dispatch(goBackScreen());
  };
  useEffect(() => {
    if (storedEmail && !hasFetched.current) {
      const fetchClientDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${ApiEndPoint}getUserDetail/${storedEmail}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.token}`, // Manually send token
              },
            }
          );

          console.log(response?.data); // ✅ Handle response data
          setUserData(response?.data);

          // ✅ Check if socket is already connected before reconnecting
          if (!SocketService.socket?.connected) {
            console.log("🔌 Connecting to socket...");
            // console.log("UserData", response.data);
            SocketService.connect(response?.data?._id);
          } else {
            console.log("⚡ Socket already connected");
          }
        } catch (err) {
          console.error("Error fetching client details:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchClientDetails();
      hasFetched.current = true;
    }

    return () => {
      if (SocketService.socket?.connected) {
        console.log("🛑 Disconnecting socket...");
        SocketService.socket.disconnect();
      }
    };
  }, [storedEmail]);

  const data = [
    { status: "Active", name: "ABC", number: "1234" },
    { status: "Inactive", name: "DEF", number: "5678" },
    { status: "Pending", name: "GHI", number: "9101" },
  ];

  const handlescreen2 = (number) => {
    dispatch(screenChange(number));
  };

  const handleLogOut = () => {
    removeCookie("token", { path: "/" });
    sessionStorage.clear();
    localStorage.removeItem("redirectPath");
    localStorage.removeItem("pendingCaseId");
    localStorage.removeItem("pendingUserId");
    navigate("/", { replace: true });
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const ScreenHeader = ({ title }) => (
    <div className="d-flex align-items-center">
      {title !== "Master List" && (
        <button
          onClick={handleGoBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
        >
          <FaArrowLeft color="white" />
        </button>
      )}
      <span>
        {/* Show normal font size on desktop */}
        <span className="d-none d-md-inline fs-4 text-white">{title}</span>
        {/* Show smaller font size on mobile */}
        <span className="d-inline-block d-md-none text-white"
          style={{ fontSize: 15 }}
        >
          {title}</span>
      </span>
    </div>
  );


  // This function will reset the view state
  const handleBack = () => {
    setViewClient(false);
    setViewLawyer(false);
  };
  return (
    <div
      className="d-flex w-99 gap-3 m-1"
      style={{ height: "96vh", overflow: "hidden" }}
    >
      {/* Sidebar */}
      <div
        className={`sidebar d-flex flex-column text-white position-relative ${isCollapsed ? "col-1" : "col-2"
          }`}
        style={{
          minWidth: isCollapsed ? "50px" : "150px",
          maxWidth: isCollapsed ? "50px" : "180px",
        }}
      >
        {/* Collapse Toggle - hidden on small screens via CSS */}
        <div
          className="sidebar-toggle d-none d-lg-flex justify-content-center align-items-center mb-3"
          onClick={toggleCollapse}
          style={{
            position: "absolute",
            right: "-10px",
            top: "10px",
            cursor: "pointer",
            backgroundColor: "#d4af37",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            zIndex: 1010,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {isCollapsed ? (
            <FaChevronRight style={{ color: "white", fontSize: "10px" }} />
          ) : (
            <FaChevronLeft style={{ color: "white", fontSize: "10px" }} />
          )}
        </div>

        {/* Sidebar Items */}
        <div className="d-flex flex-column align-items-start px-2 mt-3">

          {[
            {
              icon: faHome,
              label: "Home",
              action: () => {
                dispatch(clientEmail(null));
                dispatch(Caseinfo(null));
                dispatch(FormCDetails(null));
                dispatch(FormHDetails(null));

                handlescreen2(0);
              },
            },
            {
              icon: faMessage,
              label: "Messages",
              action: () => {
                dispatch(clientEmail(null));
                dispatch(FormCDetails(null));
                dispatch(FormHDetails(null));

                dispatch(Caseinfo(null));
                handlescreen2(3);
              },
            },
            decodedToken?.Role === "admin"
              ? {
                icon: faPersonCircleCheck,
                label: "View Users",
                action: () => {
                  dispatch(clientEmail(null));
                  dispatch(Caseinfo(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));

                  handlescreen2(9);
                },
              }
              : null,
            decodedToken?.Role === "admin"
              ? {
                icon: faBookOpen,

                label: "Add Case",
                action: () => {
                  dispatch(clientEmail(null));
                  dispatch(Caseinfo(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));

                  handlescreen2(11);
                },
              }
              : null,
            decodedToken?.Role !== "client"
              ? {
                icon: faTasksAlt,
                label: "View Task",
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
            decodedToken?.Role !== "client"
              ? {
                icon: faList12,
                label: "Form C List",
                action: () => {
                  dispatch(clientEmail(null));
                  dispatch(Caseinfo(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));

                  handlescreen2(18);
                },
              }
              : null,
            decodedToken?.Role !== "client"
              ? {
                icon: faList,
                label: "Form H List",
                action: () => {
                  dispatch(clientEmail(null));
                  dispatch(Caseinfo(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));

                  handlescreen2(22);
                },
              }
              : null,
            decodedToken?.Role === "receptionist"
              ? {
                icon: faCalendar,
                label: "Meeting Calendar",
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
            {
              icon: faQuestionCircle,
              label: "FAQs",
              action: () => {
                dispatch(clientEmail(null));
                dispatch(Caseinfo(null));
                dispatch(FormCDetails(null));
                dispatch(FormHDetails(null));

                handlescreen2(21);
              },
            },
            { icon: faSignOut, label: "Logout", action: handleLogOut },
          ]
            .filter(Boolean)
            .map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center my-2"
                onClick={item.action}
                style={{ gap: "10px", cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  title={item.label} // Add title for hover effect
                  style={{
                    fontSize: "20px",
                    color: "white",
                    marginLeft: "6px",
                  }}
                />
                {!isCollapsed && (
                  <span
                    className="sidebar-label d-none d-lg-inline text-truncate"
                    style={{ fontSize: "16px", maxWidth: "150px" }}
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
        className="flex-grow-1 ms-auto"
        style={{
          marginLeft: isCollapsed ? "50px" : "200px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between mb-2 px-3"
          style={{
            height: "50px",
            backgroundColor: "#18273e",
            borderBottom: "1px solid #ddd",
            borderRadius: "6px",
            marginRight: "10px",
            color: "white",
          }}
        >
          <div className="d-flex align-items-center gap-2 justify-content-between p-3 position-relative">
            <h3 className="m-0">
              {screen === 0 && <ScreenHeader title="Master List" />}
              {screen === 1 && (
                <ScreenHeader title={`Case Details${caseDetailsScreenTitle}`} onBack={handleGoBack} />
              )}
              {screen === 2 && <ScreenHeader title={`Appointment${caseDetailsScreenTitle}`} />}
              {screen === 3 && <ScreenHeader title="Chat" />}
              {screen === 4 && <ScreenHeader title="Profile" />}
              {screen === 5 && <ScreenHeader title="Profile" />}
              {screen === 7 && <ScreenHeader title={`View Client${caseDetailsScreenTitle}`} />}
              {screen === 8 && <ScreenHeader title="Add User" />}
              {screen === 9 && <ScreenHeader title="View User" />}
              {screen === 10 && <ScreenHeader title={`View Client${caseDetailsScreenTitle}`} />}
              {screen === 11 && <ScreenHeader title="Add Case" />}
              {screen === 12 && (
                <ScreenHeader title={`View Folder${caseDetailsScreenTitle}`} onBack={handleBack} />
              )}
              {screen === 20 && (
                <ScreenHeader title={`Case Update${caseDetailsScreenTitle}`} onBack={handleBack} />
              )}
              {/* {screen === 13 && (
                <ScreenHeader title="Task Management" onBack={handleBack} />
              )} */}
              {screen === 14 && (
                <ScreenHeader title={`View Task${caseDetailsScreenTitle}`} onBack={handleBack} />
              )}
              {screen === 15 && (
                <ScreenHeader title={`Add Task${caseDetailsScreenTitle}`} onBack={handleBack} />
              )}
              {screen === 16 && (
                <ScreenHeader title={`Form C${caseDetailsScreenTitle}`} onBack={handleBack} />
              )}
              {screen === 18 && (
                <ScreenHeader title="Form C List" onBack={handleBack} />
              )}
              {screen === 17 && (
                <ScreenHeader title={`Form H${caseDetailsScreenTitle}`} onBack={handleBack} />
              )}
              {screen === 22 && (
                <ScreenHeader title="Form H List" onBack={handleBack} />
              )}
              {screen === 23 && (
                <ScreenHeader title={`View Form MOM${caseDetailsScreenTitle}`} onBack={handleBack} />
              )}
              {screen === 24 && (
                <ScreenHeader title="Meeting Calendar" onBack={handleBack} />
              )}
            </h3>

            {/* Admin Buttons */}
            {decodedToken?.Role === "admin" && screen === 9 && (
              <div
                className="d-flex align-items-center my-2"
                onClick={() => {
                  dispatch(Caseinfo(null));
                  dispatch(clientEmail(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));

                  handlescreen2(8);
                }}
                style={{ gap: "10px", cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  icon={faPersonCirclePlus}
                  style={{
                    fontSize: "20px",
                    color: "white",
                    marginLeft: "6px",
                  }}
                />
              </div>
            )}

            {decodedToken?.Role === "admin" && screen === 10 && (
              <div
                className="d-flex align-items-center my-2"
                onClick={() => {
                  dispatch(Caseinfo(null));
                  dispatch(clientEmail(null));
                  dispatch(FormCDetails(null));
                  dispatch(FormHDetails(null));
                  handlescreen2(11);
                }}
                style={{ gap: "10px", cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  icon={faBookBible}
                  style={{
                    fontSize: "20px",
                    color: "white",
                    marginLeft: "6px",
                  }}
                />
              </div>
            )}
          </div>

          <div id="notification-profile">
            {(decodedToken?.Role !== "admin" &&
              decodedToken?.Role !== "client") && (
                <div
                  className="d-flex align-items-center px-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch(Caseinfo(null));
                    dispatch(clientEmail(null));
                    dispatch(FormCDetails(null));
                    dispatch(FormHDetails(null));
                    handlescreen2(5);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    size="1x"
                    color="white"
                    className="me-2"
                  />
                  <p className="text-white m-0 fw-bold">
                    {decodedToken?.Role?.toUpperCase()}
                  </p>
                </div>

              )}
            {decodedToken?.Role === "client" && (
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
                <FontAwesomeIcon
                  icon={faUser}
                  size="1x"
                  color="white"
                  className=""
                />
              </button>
            )}
          </div>
        </div>

        {/* Main Form */}
        {/* <div className=" py-2"> */}
        <div style={{ padding: 1, marginRight: "10px" }}>{currenScreen}</div>
        {/* </div> */}
      </div>
    </div>
  );
};
export default Dashboard;
