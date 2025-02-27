import React, { useContext, useEffect, useRef, useState } from "react";
import UserListWidget from "./UserListWidget";
import ChatHeader from "./ChatHeader";
import LeftChatTextWidget from "../LeftChatTextWidget";
import chatstyle from "../Chat.module.css";
import RightChatTextWidget from "../RightChatTextWidget";
import axios from "axios";
import "./chatField.css";
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
import {
  ApiEndPoint,
  base64ToUrl,
  mondayLogoImage,
} from "../../Component/utils/utlis";
import SocketService from "../../../../SocketService";
import { FaArrowDown } from "react-icons/fa";

const scrollToBottom = (ref) => {
  if (ref.current) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }
};
export default function ChatField({ selectedChat, user }) {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]); // Store typing users
  const [isAtBottom, setIsAtBottom] = useState(false);
  // console.log("UserData", user);
  const chatContainerRef = useRef(null);
  const [isNewMessage, setNewMessage] = useState(false);
  // ✅ Function to check if the scroll is at the bottom
  const isScrollAtBottom = () => {
    if (!chatContainerRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return scrollTop + clientHeight >= scrollHeight - 10; // Small buffer
  };

  // ✅ Function to scroll to the bottom
  const scrollToBottom = (smooth = true) => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "instant",
    });
    setNewMessage(false);
  };
  let count = 0;
  // function trackUserScroll() {
  //   const chatContainer = document.getElementById("chat-container");
  //   if (!chatContainer) return;

  //   chatContainer.addEventListener("scroll", () => {
  //     const isAtBottom =
  //       chatContainer.scrollHeight - chatContainer.scrollTop ===
  //       chatContainer.clientHeight;

  //     setIsAtBottom(isAtBottom);

  //     if (isAtBottom) {
  //       const chatId = selectedChat._id;
  //       console.log("📤 Marking Messages as Read...", count + 1);

  //       SocketService.markAsRead(chatId, user._id);
  //     }
  //   });
  // }

  // useEffect(() => {
  //   console.log("Typing Users:", typingUsers);
  // }, [typingUsers]); // Runs whenever typingUsers updates
  // useEffect(() => {
  //   if (isScrollAtBottom()) {
  //     scrollToBottom();
  //   } else {
  //     setNewMessage(true); // Show arrow if not at bottom
  //   }
  // }, [messages]);

  useEffect(() => {
    if (!selectedChat) return;

    const chatId = selectedChat._id;

    async function initializeChat() {
      console.log(`🔗 Joining chat: ${chatId}`);
      await SocketService.joinChat(chatId, user._id);

      fetchMessages(); // Fetch messages after joining
      subscribeToEvents(); // Subscribe only after joining
    }

    async function fetchMessages() {
      setLoading(true);
      try {
        console.log("📥 Fetching Messages...");
        const { data } = await axios.get(
          `${ApiEndPoint}chats/${chatId}/messages`
        );
        setMessages(data);
        setLoading(false);

        console.log("📤 Marking Messages as Read...");
        SocketService.markAsRead(chatId, user._id);

        setTimeout(() => scrollToBottom(false), 100);
        setIsAtBottom(true);
        setNewMessage(false);
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
      }
    }

    function subscribeToEvents() {
      const handleNewMessage = (newMessage) => {
        if (!newMessage || newMessage.chat !== chatId) return;

        const atBottom = isScrollAtBottom();
        setIsAtBottom(atBottom);

        // ✅ Only mark messages as Delivered & Read if the sender is NOT the current user
        if (newMessage.sender._id !== user._id) {
          console.log("📤 Marking Messages as Delivered...");
          SocketService.markAsDelivered(user._id);

          console.log("📤 Marking Messages as Read...");
          SocketService.markAsRead(chatId, user._id);

          setNewMessage(true);
        }

        // ✅ Add message to state only if it's not a duplicate
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            (msg) => msg._id === newMessage._id
          );
          return isDuplicate ? prevMessages : [...prevMessages, newMessage];
        });

        // ✅ Scroll to bottom only if the user is at the bottom or the message was sent by the user
        if (atBottom || newMessage.sender._id === user._id) {
          setTimeout(() => scrollToBottom(true), 100);
        }
      };

      const handleUserTyping = ({
        chatId: receivedChatId,
        userId: typingUserId,
      }) => {
        if (receivedChatId === chatId && typingUserId !== user._id) {
          setTypingUsers((prev) => [...new Set([...prev, typingUserId])]);
        }
      };

      const handleUserStopTyping = ({
        chatId: receivedChatId,
        userId: typingUserId,
      }) => {
        if (receivedChatId === chatId && typingUserId !== user._id) {
          setTypingUsers((prev) => prev.filter((id) => id !== typingUserId));
        }
      };
      const handleMessagesRead = ({ chatId: receivedChatId, userId }) => {
        if (receivedChatId === chatId && userId !== user._id) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.sender !== user._id
                ? { ...msg, status: "read", isRead: true }
                : msg
            )
          );
        }
      };
      const handleMessagesDelivered = ({ userId }) => {
        if (userId !== user._id) {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.sender !== user._id &&
              msg.status !== "delivered" &&
              msg.status !== "read"
                ? { ...msg, status: "delivered" }
                : msg
            )
          );
          console.log("🔔 Messages marked as delivered for:", userId);
        }
      };

      SocketService.socket.off("userTyping", handleUserTyping);
      SocketService.socket.off("userStopTyping", handleUserStopTyping);
      SocketService.socket.off("newMessage", handleNewMessage);
      SocketService.socket.off("messagesRead", handleMessagesRead);
      SocketService.socket.off("messagesDelivered", handleMessagesDelivered);

      // Add new event listeners
      SocketService.onUserTyping(handleUserTyping);
      SocketService.onUserStopTyping(handleUserStopTyping);
      SocketService.onNewMessage(handleNewMessage);
      SocketService.onMessageRead(handleMessagesRead);
      SocketService.onMessageDelivered(handleMessagesDelivered);

      return () => {
        // Remove event listeners when chat changes
        SocketService.socket.off("userTyping", handleUserTyping);
        SocketService.socket.off("userStopTyping", handleUserStopTyping);
        SocketService.socket.off("newMessage", handleNewMessage);
        SocketService.socket.off("messagesRead", handleMessagesRead);
        SocketService.socket.off("messagesDelivered", handleMessagesDelivered);
      };
    }

    initializeChat();

    return () => {
      console.log("🧹 Cleaning up chat listeners");
    };
  }, [selectedChat, user._id]);

  if (!selectedChat && user?._id) {
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
          className={`${
            isDesktop ? "col-lg-9" : isTablet ? "col-md-8" : "col-sm-12"
          } d-block`}
        >
          <div
            className="text-center d-flex flex-column justify-content-center align-items-center h-100"
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
        maxHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        gap: "10px",
      }}
    >
      {/* Chat Header */}
      <div
        className="chatfield border-bottom d-block"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1001,
          background: "#fff",
          width: "100%",
        }}
      >
        <div className="d-flex align-items-center">
          <div className="pl-3 row container-fluid d-flex flex-grow-1">
            <ChatHeader
              isUserTyping={typingUsers}
              selectedChat={selectedChat}
              user={user}
            />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="pl-5 py-4 mb-2 chat-messages"
        style={{
          height: "calc(100vh - 150px)", // Adjusted height to accommodate typing indicator
          flexGrow: 1,
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <div className={`${chatstyle["loading-indicator"]}`}>
            <div className={`${chatstyle["spinner"]}`}></div>
          </div>
        ) : (
          messages.map((message) => {
            const senderId =
              typeof message.sender === "object" && message.sender._id
                ? message.sender._id
                : String(message.sender);
            const userId = String(user._id);

            return message.content ? (
              senderId === userId ? (
                <RightChatTextWidget
                  key={message._id}
                  message={message}
                  selectedChat={selectedChat}
                  user={user}
                />
              ) : (
                <LeftChatTextWidget
                  key={message._id}
                  message={message}
                  selectedChat={selectedChat}
                  user={user}
                />
              )
            ) : null;
          })
        )}
      </div>
      {/* Typing Indicator (Moved to Bottom) */}

      <div style={{ position: "relative", width: "100%" }}>
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>
      {isNewMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "50px",
            background: "#18273e",
            borderRadius: "8px",
            width: "30px",
            height: "30px", // Increased height to accommodate the arrow and count
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          onClick={scrollToBottom}
        >
          {/* Arrow Icon */}
          <div
            style={{
              color: "white",
              fontSize: "20px", // Slightly larger size for better visibility
              fontWeight: "bold",
              padding: "5px", // Space between arrow and count
            }}
          >
            <FaArrowDown color=" white" size={20} />
          </div>
        </div>
      )}
      {/* Chat Input */}
      <ChatInput selectedChat={selectedChat} user={user} />
    </div>
  );
}
