import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBookBible,
  faBookReader,
  faBriefcase,
  faCalendar,
  faHome,
  faMessage,
  faNoteSticky,
  faPerson,
  faPersonCane,
  faPersonCircleMinus,
  faPersonCirclePlus,
  faPersonWalkingDashedLineArrowRight,
  faPowerOff,
  faStreetView,
  faTasks,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCcMastercard,
  faFacebook,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import Case_details from "../Component/Case_details";
import { useDispatch, useSelector } from "react-redux";
import BasicCase from "./Pages/Component/BasicCase";
import { goBackScreen, screenChange } from "../REDUX/sliece";
import LawyerProfile from "./Pages/LawyerProfile";

import { useNavigate } from "react-router-dom";
import Chat from "./Pages/chat/Chat";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import ViewUser from "./Pages/ViewUser";
import AddUser from "./Pages/AddUsers/AddUser";
import ViewUsers from "./Pages/AddUsers/ViewUsers";
import ViewClient from "./Pages/cases/ViewClient";
import AddCase from "./Pages/cases/AddCase";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";
import ViewFolder from "./Pages/Component/Casedetails/ViewFolder";
import Task from "./Pages/Component/TaskManagemnet/Task";
import TaskList from "./Pages/Component/TaskManagemnet/TaskList";

const Dashboard = () => {
  const navigate = useNavigate();
  const screen = useSelector((state) => state.screen.value);
  const [currenScreen, setCurrentScreen] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [isSheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userData, setUserData] = useState(null);
  const storedEmail = sessionStorage.getItem("Email");
  const [loading, setLoading] = useState(true);
  const [decodedToken, setDecodedToken] = useState(null);
  const hasFetched = useRef(false); // Ref to track if data has been fetched
  const [cookies] = useCookies(["token"]);
  const [viewClient, setViewClient] = useState(false);
  const [viewLawyer, setViewLawyer] = useState(false);
  // console.log("________", cookies.token);
  // Get the decoded token
  useEffect(() => {
    if (cookies.token) {
      try {
        handlescreen2(0); // Decode and store token
        setDecodedToken(jwtDecode(cookies.token));
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [cookies.token]); // Decode token only when token changes
  useEffect(() => {
    switch (screen) {
      case 0:
        setCurrentScreen(<BasicCase token={decodedToken} />);
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
          <ViewUsers token={decodedToken} screen={currenScreen} />
        );
        break;
      case 10:
        setCurrentScreen(<ViewClient token={decodedToken} />);
        break;
      case 11:
        setCurrentScreen(<AddCase token={decodedToken} />);
        break;
      case 12:
        setCurrentScreen(<ViewFolder token={decodedToken} />);
        break;
      case 13:
        setCurrentScreen(<Task token={decodedToken} />);
        break;
      case 14:
        setCurrentScreen(<TaskList token={decodedToken} />);
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
    navigate("/", { replace: true }); // ensures it replaces the current entry in the history stack
  };
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  const ScreenHeader = ({ title }) => (
    <div className="d-flex align-items-center">
      {title !== "Master List" &&
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
      }
      <span style={{}}>{title}</span>
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
      style={{ height: "96vh", overflowY: "auto" }}
    >
      {/* Sidebar */}
      <div
        className={`d-flex flex-column text-white  ${isCollapsed ? "col-1" : "col-2"
          } h-100 position-relative`}
        style={{
          minWidth: isCollapsed ? "50px" : "150px",
          maxWidth: isCollapsed ? "50px" : "180px",
          borderRadius: "6px",
          backgroundColor: "#18273e",
          transition: "all 0.3s ease",
          paddingTop: "10px",
        }}
      >
        {/* Collapse Toggle */}
        <div
          className="d-flex justify-content-center align-items-center mb-3"
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
            { icon: faHome, label: "Home", action: () => handlescreen2(0) },
            {
              icon: faMessage,
              label: "Messages",
              action: () => handlescreen2(3),
            },
            decodedToken?.Role === "admin"
              ? {
                icon: faPerson,
                label: "View Users",
                action: () => handlescreen2(9),
              }
              : null,
            decodedToken?.Role === "admin"
              ? {
                icon: faCcMastercard,
                label: "Add Case",
                action: () => handlescreen2(11),
              }
              : null,
            // decodedToken?.Role === "admin"
            //   ? {
            //     icon: faTasks,
            //     label: "Task Management",
            //     action: () => handlescreen2(13),
            //   }
            //   : null,
            // decodedToken?.Role === "admin"
            //   ? {
            //     icon: faStreetView,
            //     label: "View Client",
            //     action: () => handlescreen2(10),
            //   }
            //   : null,
            { icon: faPowerOff, label: "Logout", action: handleLogOut },
          ]
            .filter(Boolean) // Removes `null` or `false` values
            .map((item, index) => (
              <div
                key={index}
                className="d-flex align-items-center my-2"
                onClick={item.action}
                style={{ gap: "10px", cursor: "pointer" }}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  style={{
                    fontSize: "20px",
                    color: "white",
                    marginLeft: "6px",
                  }}
                />
                {!isCollapsed && (
                  <span
                    className="d-inline-block text-truncate"
                    style={{
                      fontSize: "16px",
                      maxWidth: "150px",
                    }}
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
                <ScreenHeader title="Case Details" onBack={handleGoBack} />
              )}
              {screen === 2 && <ScreenHeader title="Appointment" />}
              {screen === 3 && <ScreenHeader title="Chat" />}
              {screen === 4 && <ScreenHeader title="Profile" />}
              {screen === 5 && <ScreenHeader title="Profile" />}
              {screen === 7 && <ScreenHeader title="View Client" />}
              {screen === 8 && <ScreenHeader title="Add User" />}
              {screen === 9 && <ScreenHeader title="View User" />}
              {screen === 10 && <ScreenHeader title="View Client" />}
              {screen === 11 && <ScreenHeader title="Add Case" />}
              {screen === 12 && (
                <ScreenHeader title="View Folder" onBack={handleBack} />
              )}
              {screen === 13 && (
                <ScreenHeader title="Task Management" onBack={handleBack} />
              )}
              {screen === 14 && (
                <ScreenHeader title="View Task" onBack={handleBack} />
              )}


            </h3>

            {/* Admin Buttons */}
            {decodedToken?.Role === "admin" && screen === 9 && (
              <div
                className="d-flex align-items-center my-2"
                onClick={() => handlescreen2(8)}
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
                onClick={() => handlescreen2(11)}
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
          {/* <button
                  className="btn me-2 "
                  onClick={() => {
                    handlescreen2(14);
                  }}
                  style={{color:"white" , border:'1px solid #c0a262'}}
                  
                >
                  View Task
                </button> */}
            {(decodedToken?.Role === "lawyer" ||
              decodedToken?.Role === "receptionist") && (
                <button
                  className="btn me-2"
                  onClick={() => {
                    handlescreen2(5);
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
            {decodedToken?.Role === "client" && (
              <button
                className="btn"
                onClick={() => {
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
