import React, { useEffect, useRef, useState } from "react";
import "../chat/Chat.module.css";
import UserListWidget from "./widgets/UserListWidget";
import ChatField from "./widgets/ChatField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faComments } from "@fortawesome/free-solid-svg-icons";

export default function Chat({ isCollapsed }) {
  //const Users = useSelector((state) => state.Data.usersdetail);

  const [users, setUsers] = useState([]);
  const [selectUser, setSelectedUser] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [ArchivedMessageCount, setArchivedMessageCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 5000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    fetchPendingMessagesCount();
    const interval = setInterval(fetchPendingMessagesCount, 5000);
    return () => clearInterval(interval);
  });
  const fetchPendingMessagesCount = async () => {};

  const fetchUsers = async () => {};

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

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

  return (
    <div
      className="p-0 m-0 d-flex flex-row"
      style={{
        borderRadius: "0",
        height: "85vh",
        width: "100%",
        margin: "0px",
        padding: "0px",

        // Add padding to show grey background
      }}
    >
      <div
        className="col-lg-3 col-md-3 col-sm-12  border-end cursor-pointer p-1"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          width: "21%",
          backgroundColor: "#fff", // White background for the user list
          borderRadius: "10px", // Rounded corners for card-like appearance
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for card effect
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="search"
            className="form-control p-2 my-1 rounded"
            placeholder="Search User"
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>
        <div
          style={{
            paddingTop: "10px",
            paddingBottom: "20px",
            fontSize: "1.1rem",
            maxHeight: "calc(82vh - 70px)",
            overflowY: "auto",
          }}
        >
          <div>
            {/* Archive/Unarchive Toggle Icons */}
            <div
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                margin: 0,
                gap: "10px",
              }}
            >
              {/* Chats Icon */}
              <div
                onClick={() => setShowArchived(false)}
                style={{
                  backgroundColor: !showArchived ? "#d4af37" : "#001f3f",
                  width: "100%",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    marginRight: "10px",
                    color: "white",
                    padding: "8px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faComments}
                    style={{ fontSize: "20px" }}
                  />
                </div>
              </div>
              <div
                style={{
                  backgroundColor: showArchived ? "#d4af37" : "#001f3f",
                  width: "100%",
                  borderRadius: "5px",
                }}
              >
                <div
                  onClick={() => setShowArchived(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                    color: "white",
                    padding: "8px",

                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArchive}
                    style={{ fontSize: "20px", marginRight: "5px" }}
                  />

                  {ArchivedMessageCount > 0 && (
                    <div
                      style={{
                        backgroundColor: "#25D366", // Green background for the count
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        marginLeft: "10px",
                      }}
                    >
                      {ArchivedMessageCount}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User List */}
            <div
              style={{
                paddingTop: "10px",
                paddingBottom: "20px",
                fontSize: "1.1rem",
                maxHeight: "calc(82vh - 70px)",
                overflowY: "auto",
              }}
            >
              {filteredUsers.map((val) => (
                <UserListWidget
                  key={val.id}
                  user={val}
                  onClick={() => handleUserClick(val)}
                  picture={val.profilePic}
                  color={val.profilePic}
                  isChat={val.pendingMessagesCount ? true : false}
                />
              ))}
              {/* Show a message when no users are found */}
              {filteredUsers.length === 0 && (
                <p>
                  {showArchived
                    ? "No archived users found."
                    : "No user found in Chat."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="gap-3 text-center d-flex flex-column justify-content-center align-items-center h-100 w-100"
        style={{
          width: "78.5%",
          backgroundColor: "#fff", // White background for the chat field
          borderRadius: "10px", // Rounded corners for card-like appearance
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for card effect
          marginLeft: "10px", // Space between the two inner divs
          marginRight: "10px",
        }}
      >
        <ChatField user={selectUser} isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
