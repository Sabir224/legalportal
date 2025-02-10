import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faHome,
  faMessage,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Case_details from "../Component/Case_details";
import { useDispatch, useSelector } from "react-redux";
import BasicCase from "./Pages/Component/BasicCase";
import { screenChange } from "../REDUX/sliece";
import LawyerProfile from "./Pages/LawyerProfile";

import { useNavigate } from "react-router-dom";
import Chat from "./Pages/chat/Chat";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import UserProfile from "./Pages/UserProfile";
import ChatVat from "./Pages/NewChat/Chat";

const Dashboard = () => {
  const navigate = useNavigate();
  const screen = useSelector((state) => state.screen.value);
  const [currenScreen, setCurrentScreen] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (screen === 0) {
      setCurrentScreen(<BasicCase />);
    } else if (screen === 1) {
      setCurrentScreen(<Case_details />);
    } else if (screen === 2) {
      setCurrentScreen(<LawyerProfile />);
    } else if (screen === 3) {
      setCurrentScreen(<ChatVat />);
    }
    if (screen === 4) {
      setCurrentScreen(<UserProfile />);
    }
  }, [screen]);

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

  return (
    <div
      className="d-flex w-99 gap-3 m-1"
      style={{ height: "96vh", overflowY: "auto" }}
    >
      {/* Sidebar */}
      <div
        className={`d-flex flex-column text-white bg-dark ${
          isCollapsed ? "col-1" : "col-2"
        } h-100 position-relative`}
        style={{
          minWidth: isCollapsed ? "50px" : "150px",
          maxWidth: isCollapsed ? "50px" : "180px",
          borderRadius: "6px",
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
            backgroundColor: "#d3b386",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            zIndex: 1100,
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
            {
              icon: faCalendar,
              label: "Calendar",
              action: () => handlescreen2(2),
            },
            { icon: faWhatsapp, label: "WhatsApp" },
            { icon: faFacebook, label: "Facebook" },
            { icon: faPowerOff, label: "Logout", action: handleLogOut },
          ].map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center my-2"
              onClick={item.action}
              style={{ gap: "10px", cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={item.icon}
                style={{ fontSize: "20px", color: "white", marginLeft: "6px" }}
              />
              {!isCollapsed && (
                <span
                  className="d-inline-block text-truncate"
                  style={{
                    fontSize: "16px",
                    lineHeight: "1",
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
          <h2 className="m-0">Case</h2>
          <div id="notification-profile">
            <button className="btn me-2">🔔</button>
            <button
              className="btn"
              onClick={() => {
                handlescreen2(4);
              }}
            >
              👤
            </button>
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
