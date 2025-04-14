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
        className="flex-shrink-1 bg-light rounded pt-1 px-2 position-relative"
        style={{
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          maxWidth: "80%", // Increase for responsiveness
          minWidth: "100px",
          padding: "8px",
          textAlign: "left",
          marginLeft: "5px",
          fontSize: "0.9rem", // Scales better on small screens
        }}
      >
        {/* User Info */}
        {user?.Role === "client" && (
          <div className="d-flex align-items-center">
            <img
              alt="User"
              src={
                message.sender?.ProfilePicture
                  ? message.sender?.ProfilePicture
                  : "https://bootdey.com/img/Content/avatar/avatar1.png"
              }
              className="rounded-circle"
              width={20}
              height={20}
            />
            <div
              className="ms-2 text-secondary fw-normal  d-sm-block d-none d-md-inline"
              style={{
                fontSize: "12px",
              }}
            >
              {message.sender?.UserName.split(" ")[0]}
            </div>
          </div>
        )}

        {/* Main Message */}
        <div
          className="mt-1"
          style={{ cursor: "pointer", minWidth: "20%" }}
          onClick={() => handleMessageClick("reply")}
        >
          {message.content}
        </div>

        {/* Status & Timestamp */}
        <div
          className="d-flex p-0 m-0 gap-1 justify-content-end text-secondary"
          style={{
            fontSize: "10px",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          <p className="p-0 m-0">{formatTimestamp(message.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
