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
import { format, parseISO } from "date-fns";
import "../../../../style/divider.css";
import {
  ApiEndPoint,
  base64ToUrl,
  formatMessageDate,
  mondayLogoImage,
} from "../../Component/utils/utlis";
import SocketService from "../../../../SocketService";
import { FaArrowDown } from "react-icons/fa";

const scrollToBottom = (ref) => {
  if (ref.current) {
    ref.current.scrollTop = ref.current.scrollHeight;
  }
};
export default function ChatField({ selectedChat, user, setSelectedChat }) {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]); // Store typing users
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isUserScrollingDown, setIsUserScrollingDown] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const displayedDates = new Set(); // Track unique dates
  const [visibleDate, setVisibleDate] = useState(null);
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
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (!chatContainerRef.current) return;
  //     const isAtBottom = isScrollAtBottom();

  //     if (isAtBottom) {
  //       setNewMessage(false);
  //     }
  //   };

  //   const chatContainer = chatContainerRef.current;
  //   if (chatContainer) {
  //     chatContainer.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     if (chatContainer) {
  //       chatContainer.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, [lastScrollTop]);
  useEffect(() => {
    let scrollTimeout;
    const chatContainer = chatContainerRef.current; // Store the ref value

    const handleScroll = () => {
      if (!chatContainer) return;
      const messageDivs = chatContainer.querySelectorAll(".message-item");

      const isAtBottom =
        chatContainer.scrollHeight - chatContainer.scrollTop ===
        chatContainer.clientHeight;

      if (isAtBottom) {
        setNewMessage(false);
        setVisibleDate(null); // Hide date when at bottom
        return;
      }

      let topDate = null;
      for (let div of messageDivs) {
        const rect = div.getBoundingClientRect();
        const containerRect = chatContainer.getBoundingClientRect();

        if (rect.top >= containerRect.top + 10) {
          // Find first visible message
          topDate = div.getAttribute("data-date");
          break;
        }
      }

      setVisibleDate(topDate);

      // Hide date after scrolling stops (e.g., 2s delay)
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setVisibleDate(null);
      }, 2000);
    };

    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, [messages, lastScrollTop]); // Keep dependencies the same

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
        SocketService.markAsRead(chatId, user?._id);

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
          SocketService.markAsDelivered(user?._id);

          console.log("📤 Marking Messages as Read...");
          SocketService.markAsRead(chatId, user?._id);

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
        console.log("TYpingUSers:", typingUserId);
        if (receivedChatId === chatId && typingUserId !== user?._id) {
          // Get typing user details from selectedChat participants
          const typingUser = selectedChat?.participants?.find(
            (u) => u._id === typingUserId
          );

          if (typingUser) {
            setTypingUsers((prev) => {
              if (!prev.some((u) => u._id === typingUser._id)) {
                return [...prev, typingUser]; // Add unique user
              }
              return prev; // Return unchanged if already exists
            });
          }
        }
      };

      const handleUserStopTyping = ({
        chatId: receivedChatId,
        userId: typingUserId,
      }) => {
        if (receivedChatId === chatId && typingUserId !== user?._id) {
          setTypingUsers((prev) => prev.filter((u) => u._id !== typingUserId));
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
  }, [selectedChat, user?._id]);

  return selectedChat ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        gap: "3px",
      }}
    >
      {/* Chat Header */}
      <div
        className="d-block"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1001,
          background: "#fff",
          width: "100%",
        }}
      >
        <div className="d-flex align-items-center">
          <div className="px-3 row container-fluid d-flex flex-grow-1">
            <ChatHeader
              isUserTyping={typingUsers}
              selectedChat={selectedChat}
              user={user}
              setSelectedChat={setSelectedChat}
            />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="chat-messages m-0 flex-grow-1 border overflow-hidden-auto px-2 position-relative d-flex flex-column justify-content-end"
        style={{
          height: "100%",
          maxHeight: "100%",
          width: "100%",
          maxWidth: "100%",

          overflow: "hidden",
        }}
      >
        {/* Sticky Date Bubble */}
        {visibleDate && (
          <div className="sticky-date main-bgcolor">
            <span>{visibleDate}</span>
          </div>
        )}

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="d-flex flex-column p-0 m-0"
          style={{ overflowY: "auto", flexGrow: 1, position: "relative" }}
        >
          {loading ? (
            <div className={`${chatstyle["loading-indicator"]}`}>
              <div className={`${chatstyle["spinner"]}`}></div>
            </div>
          ) : (
            messages.map((message) => {
              const senderRole =
                typeof message.sender === "object" && message.sender.Role
                  ? message.sender.Role
                  : String(message.sender);

              const formattedDate = formatMessageDate(message.createdAt);
              const messageDate = format(
                parseISO(message.createdAt),
                "yyyy-MM-dd"
              );

              const showDateDivider = !displayedDates.has(messageDate);
              displayedDates.add(messageDate);

              const userId = String(user._id);
              const isClient = user.Role === "client";
              const isSenderClient = senderRole === "client";
              const isOwnMessage = String(message.sender._id) === userId;

              return (
                <React.Fragment key={message._id}>
                  {showDateDivider && (
                    <div className="date-divider">
                      <span className="main-bgcolor">{formattedDate}</span>
                    </div>
                  )}

                  <div className="message-item" data-date={formattedDate}>
                    {message.messageType === "file" ? (
                      <DynamicDocument message={message} user={user} />
                    ) : message.content ? (
                      isOwnMessage ? (
                        <RightChatTextWidget
                          key={message._id}
                          message={message}
                          selectedChat={selectedChat}
                          user={user}
                        />
                      ) : isClient || isSenderClient ? (
                        <LeftChatTextWidget
                          key={message._id}
                          message={message}
                          selectedChat={selectedChat}
                          user={user}
                        />
                      ) : (
                        <RightChatTextWidget
                          key={message._id}
                          message={message}
                          selectedChat={selectedChat}
                          user={user}
                        />
                      )
                    ) : null}
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Typing Indicator (Always at Bottom) */}
        <div
          className="typing-indicator d-flex align-items-center"
          style={{
            position: "absolute",
            bottom: "-3px",
            left: "10px",
            background: "white",
            borderRadius: "10px",
            zIndex: 10,
            minHeight: "20px",
            padding: "5px 10px",
            visibility: typingUsers.length > 0 ? "visible" : "hidden",
          }}
        >
          {typingUsers.length > 0 && (
            <span
              style={{ fontSize: "12px", marginRight: "8px", color: "#555" }}
            >
              {typingUsers.map((u) => u.UserName.split(" ")[0]).join(", ")}{" "}
              {typingUsers.length > 1 ? "are" : "is"} typing
            </span>
          )}

          {/* Typing animation */}
          <span className="dot" style={{ width: "4px", height: "4px" }}></span>
          <span className="dot" style={{ width: "4px", height: "4px" }}></span>
          <span className="dot" style={{ width: "4px", height: "4px" }}></span>
        </div>
      </div>

      {/* New Message Notification */}
      {isNewMessage && (
        <div
          className="main-second-bgcolor position-fixed d-flex flex-column align-items-center justify-content-center"
          style={{
            bottom: "15%",
            right: "50px",

            borderRadius: "8px",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
          onClick={scrollToBottom}
        >
          <FaArrowDown color="white" size={20} />
        </div>
      )}

      {/* Chat Input */}
      <div className="w-100">
        <ChatInput selectedChat={selectedChat} user={user} />
      </div>
    </div>
  ) : (
    // Show Empty Screen when no chat is selected
    <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center text-center">
      <SiGooglemessages size={50} color="#888" />
      <h4>Conversation Detail</h4>
      <p>Select a contact to view the conversation</p>
    </div>
  );
}
