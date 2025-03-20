import React, { useEffect, useRef, useState } from "react";
import "../chat/Chat.module.css";
import UserListWidget from "./widgets/UserListWidget";
import ChatField from "./widgets/ChatField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faBars,
  faComments,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { ApiEndPoint } from "../Component/utils/utlis";
import { useMediaQuery } from "react-responsive";
import { Socket } from "socket.io-client";
import SocketService from "../../../SocketService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Offcanvas } from "bootstrap/dist/js/bootstrap.bundle.min";

export default function Chat({ token }) {
  //const Users = useSelector((state) => state.Data.usersdetail);

  const [users, setUsers] = useState([]);
  const [selectUser, setSelectedUser] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [ArchivedMessageCount, setArchivedMessageCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [userId] = useState("67a4c17ab12c220e72bcf98d"); // Replace with actual user ID (could be from state or context)
  const storedEmail = sessionStorage.getItem("Email");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  // console.log("StoredEmail:", storedEmail);
  const hasFetched = useRef(false); // Ref to track if data has been fetched
  // Connect to the socket when the app loads
  useEffect(() => {
    if (!token.email || hasFetched.current) return;

    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${ApiEndPoint}/getUserDetail/${token.email}`
        );
        setUserData(response.data);

        if (response.data?._id) {
          // Only connect if the socket is NOT already connected
          if (!SocketService.socket || !SocketService.socket.connected) {
            console.log("🔌 Connecting to socket...");
            SocketService.connect(response.data?._id);
          }
          // Mark messages as delivered only once when connected
          SocketService.socket?.once("connect", () => {
            console.log(
              "✅ Socket Connected! Marking messages as delivered..."
            );
            SocketService.markAsDelivered(response.data?._id);
          });
        }
      } catch (err) {
        console.error("Error fetching client details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
    hasFetched.current = true; // Prevent multiple calls

    return () => {
      if (SocketService.socket?.connected) {
        console.log("🛑 Disconnecting socket...");
        SocketService.socket.disconnect();
      }
    };
  }, [token.email]);

  // ✅ Depend only on userData._id to avoid unnecessary re-renders

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  // const searchedUsers = users.filter((user) => {
  //   const lowerCaseSearchQuery = searchQuery.toLowerCase();

  //   const matchesName =
  //     user.name && typeof user.name === "string"
  //       ? user.name.toLowerCase().includes(lowerCaseSearchQuery)
  //       : false;

  //   const matchesPhone =
  //     user.phone && typeof user.phone === "string"
  //       ? user.phone.toLowerCase().includes(lowerCaseSearchQuery)
  //       : false;

  //   return matchesName || matchesPhone;
  // });
  // // Filter users based on search query
  // const filteredUsers = searchedUsers.filter((user) =>
  //   showArchived ? user.isArchive : !user.isArchive
  // );
  const isCompact = useMediaQuery({ maxWidth: 768 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isCompact); // Toggle state

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  // Sync Bootstrap Offcanvas with React state
  useEffect(() => {
    const sidebarElement = document.getElementById("sidebarMenu");

    if (sidebarElement) {
      const offcanvasInstance = Offcanvas.getOrCreateInstance(sidebarElement);

      // Show or hide sidebar based on state
      if (isSidebarOpen) {
        offcanvasInstance.show();
      } else {
        offcanvasInstance.hide();
      }

      // Handle sidebar close event
      const handleSidebarClose = () => setIsSidebarOpen(false);
      sidebarElement.addEventListener(
        "hidden.bs.offcanvas",
        handleSidebarClose
      );

      return () => {
        sidebarElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleSidebarClose
        );
      };
    }
  }, [isSidebarOpen]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state on screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className="p-0 m-0 d-flex position-relative"
      style={{
        height: "85vh",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* User List Widget */}
      <div
        className={`d-flex flex-column p-3 ${
          isMobile && selectedChat ? "d-none" : "d-block"
        }`}
        style={{
          width: isMobile ? "100%" : "200px",
          height: "82vh",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "10px",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <input
          type="search"
          className="form-control p-2 my-2 rounded"
          placeholder="Search User"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="d-flex flex-column p-3 overflow-y-auto">
          <UserListWidget
            setSelectedChat={(chat) => setSelectedChat(chat)}
            userData={token}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Chat Section */}
      <div
        className={`d-flex flex-column flex-grow-1 ${
          isMobile && !selectedChat ? "d-none" : "d-block"
        }`}
        style={{
          height: "82vh",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "10px",
          borderRadius: "10px",
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <ChatField
          selectedChat={selectedChat}
          user={token}
          setSelectedChat={setSelectedChat}
        />
      </div>
    </div>
  );
}
