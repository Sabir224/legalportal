import React, { useState, useEffect } from "react";
import leftChatStyle from "./Chat.module.css"; // Assuming your left chat style is in this file
import styles from "./widgets/dynamicDocument.module.css";
import RenderStatusIcon from "./widgets/renderMessageStatus";
import { FaChevronDown, FaChevronUp, FaReply } from "react-icons/fa";
import { formatTimestamp, splitSenderName } from "../Component/utils/utlis";

export default function LeftChatTextWidget({
  Name,
  time,
  message,
  botImage,
  status,
  id,
  profilePic,
  type,
  blockScroll,
  unblockScroll,
  onMessageClick,
  reply_to,
  color_code,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const date = new Date(time);

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
    onMessageClick({ id, action, message });
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
    <div className={`${leftChatStyle["chat-message-left"]} pb-4 d-flex`}>
      <center>
        <div className={styles[`avatar-left p2`]}>
          {profilePic ? (
            <img
              alt="User"
              src={
                profilePic ||
                "https://bootdey.com/img/Content/avatar/avatar1.png"
              }
              className="rounded-circle"
              width={30}
              height={30}
            />
          ) : (
            <div
              style={{
                backgroundColor: color_code,
                textAlign: "center",
                color: "#FFF",
                fontSize: "10px",
                borderRadius: "50px",
                height: "30px",
                width: "30px",
                display: "flex", // Use flexbox for centering
                alignItems: "center", // Vertically center
                justifyContent: "center", // Horizontally center
              }}
            >
              {!profilePic && Name && Name.length > 0
                ? Name.split(" ")
                    .map((n) => n[0])
                    .join("")
                : ""}
            </div>
          )}
          <div className="text-center text-wrap sender-name">
            {splitSenderName(Name)}
            <br />
            {formatTimestamp(time)}
          </div>
        </div>
      </center>

      <div
        className="flex-shrink-1 bg-light rounded pt-3 px-2 position-relative"
        style={{
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          maxWidth: "70%",
          minWidth: "20%",
          paddingTop: "8px",
          textAlign: "left",
        }}
      >
        {/* Reply Preview */}
        {reply_to && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderLeft: "4px solid #25D366", // WhatsApp green
              paddingLeft: "10px",
              marginBottom: "10px",
              backgroundColor: "#f9f9f9", // Light background for reply
              borderRadius: "5px",
            }}
          >
            <span
              style={{
                color: "#555", // Subtle text color
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {reply_to} {/* Only the replied message */}
            </span>
          </div>
        )}

        {/* Main Message */}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleMessageClick("reply")}
        >
          {message}
        </div>

        {/* Dropdown Toggle */}
        <div
          id="dropdown-button-left" // Add an id to the dropdown button for easy target reference
          style={{
            position: "absolute",
            right: "-30px", // Position for left chat
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
          onClick={toggleDropdown} // Pass event to toggleDropdown
        >
          {isDropdownOpen ? (
            <FaChevronUp size={10} />
          ) : (
            <FaChevronDown size={10} />
          )}
        </div>

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
          style={{
            marginBottom: "10px",
            marginLeft: "90%",
          }}
        ></div>
      </div>
    </div>
  );
}
