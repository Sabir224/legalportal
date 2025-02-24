import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Chat.module.css";
import Video from "../../Component/images/video call.png";
import Voice from "../../Component/images/dialer.png";
import OPT from "../../Component/images/options.png";
import { ApiEndPoint } from "../../Component/utils/utlis";
import axios from "axios";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import SocketService from "../../../../SocketService";

const dropdownData = {
  firstStage: ["Option 1", "Option 2", "Option 3"],
  secondStage: ["Option A", "Option B", "Option C"],
};

export default function ChatHeader({ selectedChat, user }) {
  const [isHumanActive, setIsHumanActive] = useState(false);
  const [isClientSessionExpired, setClientSession] = useState(false);

  const [showSheet, setShowSheet] = useState(false);
  const [sheetPosition, setSheetPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const [isArchived, setArchived] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  // The empty dependency array ensures this only runs once on mount
  const handleButtonClick = (e) => {
    const buttonRect = e.target.getBoundingClientRect();
    setSheetPosition({
      top: buttonRect.bottom + window.scrollY, // Position just below the button
      left: buttonRect.left + window.scrollX - "150px", // Adjust to the left (150 is the approximate sheet width)
    });
    setShowSheet(!showSheet); // Toggle sheet visibility
  };

  const handleArchive = async (archive) => {};
  const handlBlock = async (block) => {};

  useEffect(() => {
    if (!selectedChat) return;

    const chatId = selectedChat._id;

    // const handleTyping = (typingUserId) => setTypingUser(typingUserId);
    // const handleStopTyping = () => setTypingUser(null);
    const handleUserTyping = ({
      chatId: receivedChatId,
      userId: typingUserId,
    }) => {
      if (receivedChatId === chatId && typingUserId !== user._id) {
        setTypingUsers((prev) => [...new Set([...prev, typingUserId])]); // Add unique users
      }
    };
    const handleUserStopTyping = ({
      chatId: receivedChatId,
      userId: typingUserId,
    }) => {
      if (receivedChatId === chatId && typingUserId !== user._id) {
        setTypingUsers((prev) => prev.filter((id) => id !== typingUserId)); // Remove user from list
      }
    };
    SocketService?.socket?.off("userTyping", handleUserTyping);
    SocketService?.socket?.off("userStopTyping", handleUserStopTyping);
    // ✅ Now add listeners

    SocketService.onUserTyping(handleUserTyping);
    SocketService.onUserStopTyping(handleUserStopTyping);

    return () => {
      // 🧹 Cleanup on unmount
      SocketService?.socket?.off("userTyping", handleUserTyping);
      SocketService?.socket?.off("userStopTyping", handleUserStopTyping);
    };
  }, [selectedChat, user._id]);

  // Function to allow children to trigger updates

  // Re-run the effect when the `phone` prop changes

  return (
    <div
      className="py-0 px-0  d-block mt-1 mb-1"
      style={{
        maxHeight: "9vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        className="d-flex align-items-center"
        style={{ height: "100%", marginLeft: "10px", marginRight: "10px" }}
      >
        <div
          className="position-relative"
          style={{ marginLeft: "5px", marginRight: "10px" }}
        >
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              backgroundImage: (() => {
                const participant = selectedChat?.participants
                  ?.filter(
                    (participant) =>
                      String(participant._id) !== String(user._id)
                  ) // Exclude current user
                  .find(
                    (participant) =>
                      participant.ProfilePicture || participant.AvatarColor
                  ); // Find first non-null ProfilePicture or AvatarColor

                return participant?.ProfilePicture
                  ? `url(${participant.ProfilePicture})`
                  : participant?.AvatarColor || "none";
              })(),

              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "30px",
              height: "30px",
              border: "1px solid #FFF",
              boxShadow: "none",
              backgroundColor:
                selectedChat?.participants
                  ?.filter(
                    (participant) =>
                      String(participant._id) !== String(user._id)
                  ) // Exclude current user
                  .find((participant) => participant.AvatarColor)
                  ?.AvatarColor || "black",
            }}
          >
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                color: "#FFF",
                fontSize: "10px",
              }}
            >
              {/* Show initials if no profilePic */}
              {(() => {
                const participant = selectedChat?.participants
                  ?.filter(
                    (participant) =>
                      String(participant._id) !== String(user._id)
                  ) // Exclude current user
                  .find((participant) => participant.UserName); // Find first participant with a UserName

                return participant?.UserName
                  ? participant.UserName.split(" ")
                      .map((word) => word[0])
                      .join("")
                  : "N"; // Default to "N" (or anything you prefer)
              })()}
            </div>
          </div>
        </div>
        {/* Name and phone */}
        <div className="flex-grow-1 d-flex flex-column align-items-start pl-2">
          <strong className="text-start w-100">
            {[
              ...new Set(
                selectedChat?.participants
                  ?.filter((participant) => {
                    console.log(
                      "Checking participant:",
                      participant.UserName,
                      "ID:",
                      participant._id
                    );
                    return String(participant._id) !== String(user._id); // Ensure correct type
                  })
                  .map((participant) => participant.UserName) // Extract names
              ),
            ].join(", ") || "Name"}
          </strong>
        </div>

        <div className="d-flex align-items-center">
          <button
            className="mr-1"
            style={{
              marginRight: "10px",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <img src={Voice} width={25} height={25} alt="Voice" />
          </button>
          <button
            className="mr-1"
            style={{
              marginRight: "10px",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <img src={Video} width={25} height={25} alt="Video" />
          </button>
          <div>
            <button
              style={{ background: "none", border: "none", padding: 0 }}
              onClick={handleButtonClick}
            >
              <img src={OPT} width={25} height={25} alt="Options" />
            </button>
            {showSheet && (
              <div
                style={{
                  position: "absolute",
                  top: sheetPosition.top,
                  right: "60px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  zIndex: 1000,
                  padding: "10px",
                  width: "200px", // Adjust width for better tile appearance
                }}
              >
                {/* Archive Client Button */}
                {!isArchived && (
                  <h5
                    style={{
                      display: "block",
                      background: "#a66cff",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      textAlign: "center",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handleArchive(true)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#FF7640")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#a66cff")
                    }
                  >
                    Archive Client
                  </h5>
                )}

                {/* Unarchive Client Button */}
                {isArchived && (
                  <h5
                    style={{
                      display: "block",
                      background: "#a66cff",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      textAlign: "center",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handleArchive(false)} // Corrected to unarchive
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#FF7640")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#a66cff")
                    }
                  >
                    Unarchive Client
                  </h5>
                )}

                {/* Block Client Button */}
                {/* {!isBlocked && (
                  <h5
                    style={{
                      display: "block",
                      background: "#a66cff",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      textAlign: "center",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handlBlock(true)} // Block
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#FF7640")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#a66cff")
                    }
                  >
                    Block
                  </h5>
                )} */}

                {/* Unblock Client Button */}
                {/* {isBlocked && (
                  <h5
                    style={{
                      display: "block",
                      background: "#a66cff",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      textAlign: "center",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handlBlock(false)} // Unblock
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#FF7640")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#a66cff")
                    }
                  >
                    Unblock
                  </h5>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
