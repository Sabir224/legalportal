// components/ChatBox.js
import React, { useEffect, useState } from "react";

import axios from "axios";
import MessageInput from "./ChatiInputComponent";
import SocketService from "../../../../SocketService";

const ChatBox = ({ selectedChat, userId }) => {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (selectedChat) {
      const chatId = selectedChat._id;

      // Fetch initial messages for the selected chat
      const fetchMessages = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:5001/api/chats/${chatId}/messages`
          );
          setMessages(data); // Set the initial list of messages
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();

      // Listen for new messages
      SocketService.onNewMessage((newMessage) => {
        // Only append the message if it belongs to the current chat
        if (newMessage.chatId === chatId) {
          console.log("New message received:", newMessage); // Log the new message
          setMessages((prevMessages) => [...prevMessages, newMessage]); // Append the message to state
        }
      });

      // Listen for typing notifications
      SocketService.onUserTyping((userId) => {
        setTypingUser(userId);
      });

      // Listen for stop typing notifications
      SocketService.onUserStopTyping(() => {
        setTypingUser(null);
      });
    }
  }, [selectedChat]); // This hook runs when selectedChat changes

  return (
    <div>
      <h3>{selectedChat?.isGroupChat ? "Group Chat" : "Private Chat"}</h3>
      <div>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.sender.UserName}: </strong>
            {msg.content}
          </div>
        ))}
        {typingUser && <p>Typing...</p>}
      </div>

      <MessageInput chatId={selectedChat._id} userId={userId} />
    </div>
  );
};

export default ChatBox;
