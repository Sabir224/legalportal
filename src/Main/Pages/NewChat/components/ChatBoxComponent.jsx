// components/ChatBox.js
import React, { useEffect, useState } from "react";

import axios from "axios";
import MessageInput from "./ChatiInputComponent";
import SocketService from "../../../../SocketService";

const ChatBox = ({ selectedChat, userId }) => {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const chatId = "67a4c1af8e51d355c298084a";
  useEffect(() => {
    if (selectedChat) {
      // Get initial messages
      const fetchMessages = async () => {
        const { data } = await axios.get(
          `http://localhost:5001/api/chats/${chatId}/messages`
        );
        setMessages(data);
      };
      fetchMessages();

      // Listen for new messages
      SocketService.onNewMessage((newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
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
  }, [selectedChat, messages]);

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
