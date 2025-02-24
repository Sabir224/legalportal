import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageInput from "./ChatiInputComponent";
import SocketService from "../../../../SocketService";

const ChatBox = ({ selectedChat, userId }) => {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]); // Store typing users

  useEffect(() => {
    if (!selectedChat) return;

    const chatId = selectedChat._id;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5001/api/chats/${chatId}/messages`
        );
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    SocketService.connect(selectedChat._id, userId);

    const handleNewMessage = (newMessage) => {
      console.log("New Message:", newMessage);

      if (newMessage.chat === chatId) {
        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some(
            (msg) => msg._id === newMessage._id
          );
          return isDuplicate ? prevMessages : [...prevMessages, newMessage];
        });
      }
    };

    // const handleTyping = (typingUserId) => setTypingUser(typingUserId);
    // const handleStopTyping = () => setTypingUser(null);
    const handleUserTyping = ({
      chatId: receivedChatId,
      userId: typingUserId,
    }) => {
      if (receivedChatId === chatId && typingUserId !== userId) {
        setTypingUsers((prev) => [...new Set([...prev, typingUserId])]); // Add unique users
      }
    };
    const handleUserStopTyping = ({
      chatId: receivedChatId,
      userId: typingUserId,
    }) => {
      if (receivedChatId === chatId && typingUserId !== userId) {
        setTypingUsers((prev) => prev.filter((id) => id !== typingUserId)); // Remove user from list
      }
    };
    SocketService?.socket?.off("userTyping", handleUserTyping);
    SocketService?.socket?.off("userStopTyping", handleUserStopTyping);
    // ✅ Now add listeners

    SocketService.onNewMessage(handleNewMessage);
    SocketService.onUserTyping(handleUserTyping);
    SocketService.onUserStopTyping(handleUserStopTyping);

    return () => {
      // 🧹 Cleanup on unmount
      SocketService?.socket?.off("newMessage", handleNewMessage);
      SocketService?.socket?.off("userTyping", handleUserTyping);
      SocketService?.socket?.off("userStopTyping", handleUserStopTyping);
    };
  }, [selectedChat, userId]);

  return (
    <div>
      {selectedChat ? (
        <>
          <h3>{selectedChat?.isGroupChat ? "Group Chat" : "Private Chat"}</h3>
          <div>
            {messages.map((msg) => (
              <div key={msg._id}>
                <strong>{msg.sender?.UserName || "Unknown"}: </strong>
                {msg.content}
              </div>
            ))}
            {typingUsers.length > 0 && (
              <div>
                {typingUsers.length === 1
                  ? "typing..."
                  : `${typingUsers.length} people are typing...`}
              </div>
            )}
          </div>

          <MessageInput
            chatId={selectedChat._id}
            userId={userId}
            onMessageSent={setMessages}
          />
        </>
      ) : (
        <p>Select a chat to start messaging</p>
      )}
    </div>
  );
};

export default ChatBox;
