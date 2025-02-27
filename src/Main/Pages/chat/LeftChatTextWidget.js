import React, { useState, useEffect } from "react";
import leftChatStyle from "./Chat.module.css"; // Assuming your left chat style is in this file
import styles from "./widgets/dynamicDocument.module.css";
import RenderStatusIcon from "./widgets/renderMessageStatus";
import { FaChevronDown, FaChevronUp, FaReply } from "react-icons/fa";
import { formatTimestamp, splitSenderName } from "../Component/utils/utlis";

export default function LeftChatTextWidget({ message, selectedChat, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const date = new Date(message.createdAt);

  const timeDate = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Handle message click (trigger action in the parent component)
  const handleMessageClick = (action) => {
    // onMessageClick({ id, action, message });
    setIsDropdownOpen(false); // Close the dropdown when replying
  };

  // Close dropdown if click happens outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside of the dropdown button or menu, close the dropdown
      if (
        !event.target.closest(`.${leftChatStyle["chat-message-left"]}`) &&
        !event.target.closest(`#dropdown-button-left`)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Add event listener to detect clicks outside of dropdown
    document.addEventListener("click", handleClickOutside);

    // Cleanup on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={`${leftChatStyle["chat-message-left"]} pb-1 d-flex`}>
      <div
        className="flex-shrink-1 bg-light rounded pt-1 px-2  position-relative"
        style={{
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          maxWidth: "70%",
          minWidth: "20%",
          paddingTop: "8px",
          textAlign: "left",
          marginLeft: "5px",
          fontSize: "13px",
        }}
      >
        {/* Reply Preview */}

        {/* Main Message */}
        <div
          className=""
          style={{ cursor: "pointer" }}
          onClick={() => handleMessageClick("reply")}
        >
          {/* <div className={styles[`avatar-left p2`]}>
            <img
              alt="User"
              src={
                message.sender.ProfilePicture
                  ? message.sender.ProfilePicture
                  : "https://bootdey.com/img/Content/avatar/avatar1.png"
              }
              className="rounded-circle"
              width={20}
              height={20}
            />
          </div> */}
          {message.content}
        </div>

        {/* Dropdown Toggle */}

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            id="dropdown-menu-left" // Add an id to the dropdown menu
            style={{
              position: "absolute",
              right: "-160px", // Position for left chat
              top: "35px",
              background: "white",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              zIndex: "1000",
              width: "150px",
            }}
          >
            <ul style={{ listStyleType: "none", padding: "0", margin: "0" }}>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 10px",
                  cursor: "pointer",
                }}
                onClick={() => handleMessageClick("Reply")}
              >
                <FaReply size={16} />
                <span style={{ marginLeft: "10px" }}>Reply</span>
              </li>
            </ul>
          </div>
        )}

        {/* Status Icon */}
        <div
          className="d-flex p-0 m-0 gap-1 justify-content-end text-secondary"
          style={{
            fontSize: "10px",
          }}
        >
          <p className="p-0 m-0">{formatTimestamp(message.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
