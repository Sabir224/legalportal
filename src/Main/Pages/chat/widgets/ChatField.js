import React, { useContext, useEffect, useRef, useState } from "react";
import UserListWidget from "./UserListWidget";
import ChatHeader from "./ChatHeader";
import LeftChatTextWidget from "../LeftChatTextWidget";
import chatstyle from "../Chat.module.css";
import RightChatTextWidget from "../RightChatTextWidget";
import axios from "axios";

import { UserContext } from "./userContext";
import mondayLogo from "../../Component/images/monLogo.png";

import botImage from "../../Component/assets/icons/bot.png";
import { SiGooglemessages } from "react-icons/si";
import ChatInput from "./ChatInput"; // Import ChatInput
import DynamicImage from "./dynamicImage";
import DynamicDocument from "./dynamicDocuments";
import DynamicAudio from "./dynamicAudio";
import { useMediaQuery } from "react-responsive";
import DropdownSheet from "./DropdownSheet";
import ReplyInput from "./ReplyChatInput";
import { base64ToUrl, mondayLogoImage } from "../../Component/utils/utlis";

const scrollToBottom = (ref) => {
  if (ref.current) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }
};
export default function ChatField({ user, isCollapsed }) {
  const [userData, setUserData] = useState([]);
  const [triggerEffect, setTriggerEffect] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(user ? user : null);
  const chatContainerRef = useRef(null);

  let [messagesArray, setMessagesArray] = useState([]);
  const messagesEndRef = useRef(null);

  const mouseMoveTimer = useRef(null);

  const jwtToken = sessionStorage.getItem("jwtToken");

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  useEffect(() => {

  }, [selectedUser, user]);

  const [scrollBlocked, setScrollBlocked] = useState(false);
  const [replyData, setReplyData] = useState(null);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [replyingMessage, setReplyingMessage] = useState(null); // State for the selected action
  const handleOpenDropdown = (messageData) => {
    setSelectedMessage(messageData); // Store the selected message
    setDropdownOpen(true); // Open the dropdown
  };

  const handleCloseDropdown = () => {
    setSelectedMessage(null);
    setDropdownOpen(false);
    setSelectedAction(""); // Reset the action state
  };

  const handleMessageClick = (data) => {
    // console.log("Datatata:", data);
    setSelectedMessage(data); // Set the selected message data to state
  };

  // Function to block scrolling
  const blockScroll = () => {
    if (chatContainerRef.current) {
      //chatContainerRef.current.style.overflowY = 'hidden';  // Disable vertical scrolling
      setScrollBlocked(true);
    }
  };

  // Function to unblock scrolling
  const unblockScroll = () => {
    if (chatContainerRef.current) {
      // chatContainerRef.current.style.overflowY = 'scroll';  // Enable vertical scrolling
      setScrollBlocked(false);
    }
  };


  const onSendReplyMessage = async (message) => {

  };
  const [refreshKey, setRefreshKey] = useState(0);

  const changeState = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the key to trigger re-render
  };
  const handleSendMessage = async (message) => {

  };

  const handleSendImage = async (file, caption) => {
    const phone = localStorage.getItem("phone");
    const currentTime = new Date().toLocaleTimeString(); // Get current time
    const newMessage = {
      message_text: caption || "Sent an image",
      timestamp: currentTime,
      sent_by: "Admin",
      files: file,
    };
    setMessagesArray((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleSendDoc = async (file, caption) => {
    const phone = localStorage.getItem("phone");
    const currentTime = new Date().toLocaleTimeString(); // Get current time
    const newMessage = {
      message_text: caption || "Sent a document",
      timestamp: currentTime,
      sent_by: "Admin",
      files: file,
    };
    setMessagesArray((prevMessages) => [...prevMessages, newMessage]);


  };

  const handleSendVoice = async (audioBlob) => {
    const phone = localStorage.getItem("phone");
    const currentTime = new Date().toLocaleTimeString();

  };

  if (!selectedUser && userData) {
    return (
      <div
        className={`${chatstyle["no-user-selected"]} d-flex justify-content-center align-items-center`}
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",

          padding: isTablet ? "1rem" : "2rem",
        }}
      >
        <div
          className={`${isDesktop ? "col-lg-9" : isTablet ? "col-md-8" : "col-sm-12"
            } d-none d-md-block`}
        >
          <div
            className=" text-center d-flex flex-column justify-content-center align-items-center h-100"
            style={{
              padding: isTablet ? "1rem" : "2rem",
            }}
          >
            <SiGooglemessages
              className={`fs-${isDesktop ? 1 : isTablet ? 2 : 3}`}
            />
            <div>
              <h4
                style={{
                  fontSize: isDesktop
                    ? "1.5rem"
                    : isTablet
                      ? "1.25rem"
                      : "1rem",
                }}
              >
                Conversation detail
              </h4>
              <p
                style={{
                  fontSize: isDesktop ? "1rem" : isTablet ? "0.9rem" : "0.8rem",
                }}
              >
                Select a contact to view conversation
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100vh", // Ensure it never grows beyond the viewport height
        width: "100%",
        maxWidth: "100%", // Keep within the screen width bounds
        overflow: "hidden", // Prevent overflow from causing the container to grow
        gap: "10px",
      }}
    >
      <div className="chatfield border-bottom  d-lg-block">
        <div className="d-flex align-items-center">
          <div
            className="pl-3 row container-fluid d-flex flex-grow-1"
          // style={{ maxHeight: "11vh", overflowY: "auto" }}
          >
            <ChatHeader
              refresh={refreshKey}
              clientId={selectedUser.id}
              name={selectedUser ? selectedUser.name : "Name"}
              phone={selectedUser ? selectedUser.phone : ""}
              profilePic={selectedUser ? selectedUser.profilepic : ""}
              color_code={selectedUser?.color_code}
              triggerEffect={triggerEffect}
              isArchived={selectedUser.isArchive}
            />
          </div>
        </div>
      </div>

      <div
        className="pl-5 py-4 mb-2 chat-messages"
        style={{
          height: "59vh",
          flexGrow: 1,
          width: "100%",
          maxWidth: "100%", // Prevent overflow horizontally
          overflowX: "hidden", // Ensure no horizontal scrolling
          // Allow vertical scrolling only
        }}
      >
        {loading ? (
          <div className={`${chatstyle["loading-indicator"]}`}>
            <div className={`${chatstyle["spinner"]}`}></div>
          </div>
        ) : (
          userData &&
          userData.map((user, index) =>
            messagesArray.map((message, messageIndex) => {
              if (message.message_text) {
                const replyMessage = message.reply_to
                  ? messagesArray.find(
                    (msg) => msg.message_id === message.reply_to
                  )
                  : null;
                return message.sent_by === "Client" ? (
                  <LeftChatTextWidget
                    key={messageIndex}
                    Name={selectedUser.name}
                    message={message.message_text}
                    time={message.timestamp}
                    profilePic={selectedUser ? selectedUser.profilepic : ""}
                    color_code={selectedUser ? selectedUser?.color_code : ""}
                    id={message.message_id}
                    blockScroll={blockScroll}
                    unblockScroll={unblockScroll}
                    onMessageClick={handleMessageClick}
                    reply_to={replyMessage ? replyMessage.message_text : null}
                  />
                ) : message.sent_by === "Admin" ? (
                  <RightChatTextWidget
                    key={messageIndex}
                    Name={message.admin_name}
                    message={message.message_text}
                    time={message.timestamp}
                    botImage={base64ToUrl(message.profilePIc)}
                    status={message.message_status}
                    id={message.message_id}
                    blockScroll={blockScroll}
                    unblockScroll={unblockScroll}
                    onMessageClick={handleMessageClick}
                    reply_to={replyMessage ? replyMessage.message_text : null}
                  />
                ) : message.sent_by === "monday" ? (
                  <RightChatTextWidget
                    key={messageIndex}
                    Name="Monday"
                    message={message.message_text}
                    time={message.timestamp}
                    botImage={mondayLogo}
                    status={message.message_status}
                    id={message.message_id}
                    onMessageClick={handleMessageClick}
                    reply_to={replyMessage ? replyMessage.message_text : null}
                  />
                ) : (
                  <RightChatTextWidget
                    key={messageIndex}
                    Name={"Bot"}
                    message={message.message_text}
                    time={message.timestamp}
                    botImage={botImage}
                    status={message.message_status}
                    id={message.message_id}
                    type="text"
                    onMessageClick={handleMessageClick}
                    reply_to={replyMessage ? replyMessage.message_text : null}
                  />
                );
              } else if (message.files) {
                const file = JSON.parse(message.files); // Assuming file is a JSON object
                if (file && file.filetype) {
                  const isClient = message.sent_by === "Client";
                  const position = isClient ? "left" : "right";
                  const senderName = isClient
                    ? ""
                    : message.sent_by === "Admin"
                      ? message.admin_name
                      : message.sent_by === "monday"
                        ? "Monday"
                        : "Bot";

                  const avatar = isClient
                    ? selectedUser.profilepic
                    : message.sent_by === "Admin"
                      ? message.profilePIc
                      : message.sent_by === "monday"
                        ? `${mondayLogoImage}`
                        : Buffer.from(botImage).toString("base64");

                  const status = isClient ? "" : message.message_status;

                  if (
                    file.filetype === "image/jpeg" ||
                    file.filetype === "image/png"
                  ) {
                    return (
                      <div style={{ position: "relative" }}>
                        <DynamicImage
                          key={messageIndex}
                          mimeType={file.filetype}
                          file_id={file.file_id}
                          position={position}
                          timestamp={message.timestamp}
                          fileName={file.filename}
                          senderName={senderName}
                          avatar={avatar}
                          status={status}
                          type="file"
                          blockScroll={blockScroll}
                          unblockScroll={unblockScroll}
                        // Pass the status here
                        />
                      </div>
                    );
                  } else if (file.filetype.startsWith("application/")) {
                    return (
                      <div style={{ position: "relative" }}>
                        <DynamicDocument
                          key={messageIndex}
                          fileId={file.file_id}
                          mimeType={file.filetype}
                          position={position}
                          timestamp={message.timestamp}
                          fileName={file.filename}
                          senderName={senderName}
                          avatar={avatar}
                          status={status} // Pass the status here
                          type="file"
                          blockScroll={blockScroll}
                          unblockScroll={unblockScroll}
                        />
                      </div>
                    );
                  } else if (file.filetype.startsWith("audio/")) {
                    return (
                      <div style={{ position: "relative" }}>
                        <DynamicAudio
                          key={messageIndex}
                          fileId={file.file_id}
                          mimeType={file.filetype}
                          position={position}
                          timestamp={message.timestamp}
                          fileName={file.filename}
                          senderName={senderName}
                          avatar={avatar}
                          status={status}
                          type="file"
                          blockScroll={blockScroll}
                          unblockScroll={unblockScroll}
                        />
                      </div>
                    );
                  }
                }
                return null;
              }
            })
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      {selectedMessage ? (
        <ReplyInput
          onSendReply={onSendReplyMessage}
          onClose={() => setSelectedMessage(null)}
        />
      ) : (
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendImage={handleSendImage}
          onSendDoc={handleSendDoc}
          onSendVoice={handleSendVoice}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
}
