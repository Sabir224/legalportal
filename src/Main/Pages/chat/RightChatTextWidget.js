import React, { useState, useEffect } from "react";
import rightChatstyle from "./Chat.module.css";
import styles from "./widgets/dynamicDocument.module.css";
import RenderStatusIcon from "./widgets/renderMessageStatus";
import "../../../style/PortalTheme.css";
import { FaChevronDown, FaChevronUp, FaReply } from "react-icons/fa";
import { formatTimestamp, splitSenderName } from "../Component/utils/utlis";

export default function RightChatTextWidget({ message, selectedChat, user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const date = new Date(message.createdAt);

  const timeDate = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    // Prevent event propagation to avoid immediate closing when clicking the toggle
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
      const dropdownMenu = document.getElementById("dropdown-menu"); // The dropdown menu element
      const dropdownButton = document.getElementById("dropdown-button"); // The button that opens the dropdown

      // If the click is outside both the dropdown menu and button, close the dropdown
      if (
        dropdownMenu &&
        dropdownButton &&
        !dropdownMenu.contains(event.target) &&
        !dropdownButton.contains(event.target)
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
    <div className={`${rightChatstyle["chat-message-right"]} pb-1 d-flex`}>
      <div
        className="flex-shrink-1 rounded px-2 position-relative main-bgcolor simple-text"
        style={{
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          maxWidth: "70%",
          minWidth: "100px",
          textAlign: "right",
          marginRight: "5px",
        }}
      >
        {/* Main Message */}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleMessageClick("reply")}
        >
          <div
            className=""
            style={{
              textAlign: "left",
              fontSize: "13px",
              minWidth: "20%",
            }}
          >
            {message.content}
          </div>

          {/* Timestamp and Status Icon inside the message content */}
          <div
            className="d-flex p-0 m-0 gap-1 justify-content-end text-secondary"
            style={{
              fontSize: "10px",
              whiteSpace: "nowrap",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
            }}
          >
            <p className="p-0 m-0">{formatTimestamp(message.createdAt)}</p>
            <RenderStatusIcon status={message.status} message={message} />
          </div>
        </div>
      </div>
    </div>
  );
}
