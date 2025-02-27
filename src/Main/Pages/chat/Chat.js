import React, { useEffect, useRef, useState } from "react";
import "../chat/Chat.module.css";
import UserListWidget from "./widgets/UserListWidget";
import ChatField from "./widgets/ChatField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faComments } from "@fortawesome/free-solid-svg-icons";
import { ApiEndPoint } from "../Component/utils/utlis";
import { useMediaQuery } from "react-responsive";
import { Socket } from "socket.io-client";
import SocketService from "../../../SocketService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Offcanvas } from "bootstrap/dist/js/bootstrap.bundle.min";

export default function Chat() {
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
  // console.log("StoredEmail:", storedEmail);
  const hasFetched = useRef(false); // Ref to track if data has been fetched
  // Connect to the socket when the app loads
  useEffect(() => {
    if (storedEmail && !hasFetched.current) {
      const fetchClientDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${ApiEndPoint}/getUserDetail/${storedEmail}`
          );
          setUserData(response.data);
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

  // ✅ Depend only on userData._id to avoid unnecessary re-renders

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const searchedUsers = users.filter((user) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const matchesName =
      user.name && typeof user.name === "string"
        ? user.name.toLowerCase().includes(lowerCaseSearchQuery)
        : false;

    const matchesPhone =
      user.phone && typeof user.phone === "string"
        ? user.phone.toLowerCase().includes(lowerCaseSearchQuery)
        : false;

    return matchesName || matchesPhone;
  });
  // Filter users based on search query
  const filteredUsers = searchedUsers.filter((user) =>
    showArchived ? user.isArchive : !user.isArchive
  );

  // return (
  //   <div
  //     className="p-0 m-0 d-flex flex-row"
  //     style={{
  //       borderRadius: "0",
  //       height: "85vh",
  //       width: "100%",
  //       margin: "0px",
  //       padding: "0px",

  //       // Add padding to show grey background
  //     }}
  //   >
  //     <div
  //       className="col-lg-3 col-md-3 col-sm-12  border-end cursor-pointer p-1"
  //       style={{
  //         maxHeight: "90vh",
  //         overflowY: "auto",
  //         width: "21%",
  //         backgroundColor: "#fff", // White background for the user list
  //         borderRadius: "10px", // Rounded corners for card-like appearance
  //         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for card effect
  //       }}
  //     >
  //       <div className="d-flex justify-content-between align-items-center">
  //         <input
  //           type="search"
  //           className="form-control p-2 my-1 rounded"
  //           placeholder="Search User"
  //           onChange={handleSearchChange}
  //           value={searchQuery}
  //         />
  //       </div>
  //       <div
  //         style={{
  //           paddingTop: "10px",
  //           paddingBottom: "20px",
  //           fontSize: "1.1rem",
  //           maxHeight: "calc(82vh - 70px)",
  //           overflowY: "auto",
  //         }}
  //       >
  //         {/*

  //         */}
  //         <div>
  //           {/* Archive/Unarchive Toggle Icons */}
  //           <div
  //             style={{
  //               marginBottom: "1rem",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "space-evenly",
  //               margin: 0,
  //               gap: "10px",
  //             }}
  //           >
  //             {/* Chats Icon */}
  //             <div
  //               onClick={() => setShowArchived(false)}
  //               style={{
  //                 backgroundColor: !showArchived ? "#d4af37" : "#001f3f",
  //                 width: "100%",
  //                 borderRadius: "5px",
  //                 display: "flex",
  //                 justifyContent: "flex-start",
  //               }}
  //             >
  //               <div
  //                 style={{
  //                   marginRight: "10px",
  //                   color: "white",
  //                   padding: "8px",
  //                   borderRadius: "5px",
  //                   cursor: "pointer",
  //                   display: "flex",
  //                   alignItems: "center",
  //                   justifyContent: "center",
  //                 }}
  //               >
  //                 <FontAwesomeIcon
  //                   icon={faComments}
  //                   style={{ fontSize: "20px" }}
  //                 />
  //               </div>
  //             </div>
  //             <div
  //               style={{
  //                 backgroundColor: showArchived ? "#d4af37" : "#001f3f",
  //                 width: "100%",
  //                 borderRadius: "5px",
  //               }}
  //             >
  //               <div
  //                 onClick={() => setShowArchived(true)}
  //                 style={{
  //                   display: "flex",
  //                   alignItems: "center",
  //                   justifyContent: "space-between",

  //                   color: "white",
  //                   padding: "8px",

  //                   cursor: "pointer",
  //                 }}
  //               >
  //                 <FontAwesomeIcon
  //                   icon={faArchive}
  //                   style={{ fontSize: "20px", marginRight: "5px" }}
  //                 />

  //                 {ArchivedMessageCount > 0 && (
  //                   <div
  //                     style={{
  //                       backgroundColor: "#25D366", // Green background for the count
  //                       color: "white",
  //                       borderRadius: "50%",
  //                       width: "20px",
  //                       height: "20px",
  //                       display: "flex",
  //                       alignItems: "center",
  //                       justifyContent: "center",
  //                       fontSize: "12px",
  //                       marginLeft: "10px",
  //                     }}
  //                   >
  //                     {ArchivedMessageCount}
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //           {/* User List */}{" "}
  //           {loading ? (
  //             <p>Loading...</p>
  //           ) : (
  //             <UserListWidget
  //               setSelectedChat={setSelectedChat}
  //               userData={userData}
  //             />
  //           )}
  //           {/* Show a message when no users are found */}
  //         </div>
  //       </div>
  //     </div>
  //     <div
  //       className="gap-3 text-center d-flex flex-column justify-content-center align-items-center h-100 w-100"
  //       style={{
  //         width: "78.5%",
  //         backgroundColor: "#fff", // White background for the chat field
  //         borderRadius: "10px", // Rounded corners for card-like appearance
  //         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for card effect
  //         marginLeft: "10px", // Space between the two inner divs
  //         marginRight: "10px",
  //       }}
  //     >
  //       {loading ? (
  //         <p>Loading...</p>
  //       ) : (
  //         <ChatField selectedChat={selectedChat} user={userData} />
  //       )}
  //     </div>
  //   </div>
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
  return (
    <div
      className="p-0 m-0 d-flex position-relative"
      style={{
        height: "85vh",
        width: "100%",
      }}
    >
      {/* Sidebar - User List */}
      <div
        className={`offcanvas-lg offcanvas-start ${
          isSidebarOpen ? "show" : ""
        }`}
        id="sidebarMenu"
        tabIndex="-1"
        aria-labelledby="sidebarMenuLabel"
        style={{
          width: "250px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1050, // Ensure sidebar is on top
        }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarMenuLabel">
            User List
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setIsSidebarOpen(false)} // ✅ Close manually
          ></button>
        </div>

        {/* Search Input */}
        <div className="offcanvas-body d-flex flex-column">
          <input
            type="search"
            className="form-control p-2 my-1 rounded"
            placeholder="Search User"
            onChange={handleSearchChange}
            value={searchQuery}
          />
          <div
            className="mt-3 flex-grow-1"
            style={{
              fontSize: "1.1rem",
              overflowY: "auto",
              maxHeight: "calc(82vh - 70px)",
            }}
          >
            {loading ? (
              <p>Loading...</p>
            ) : (
              <UserListWidget
                setSelectedChat={setSelectedChat}
                userData={userData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button (Only Visible When Sidebar is Closed) */}
      {!isSidebarOpen && (
        <button
          className="position-absolute top-50 translate-middle-y btn btn-light shadow-sm d-lg-none"
          style={{
            left: "0px",
            transition: "left 0.3s ease-in-out",
            borderRadius: "6px",
            padding: "5px 10px",
            zIndex: 1100, // Ensure it's on top
            background: "#c0a262",
          }}
          onClick={toggleSidebar}
        >
          <FaChevronRight color="white" />
        </button>
      )}

      {/* Chat Section */}
      <div
        className="d-flex flex-column justify-content-center align-items-center h-100 w-100"
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ChatField selectedChat={selectedChat} user={userData} />
        )}
      </div>
    </div>
  );
}
