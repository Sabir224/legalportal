import React, { useState, useEffect } from "react";
import SocketService from "../../../../SocketService";

const MessageInput = ({ chatId, userId, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let typingTimeout;

    if (isTyping) {
      SocketService.sendTyping(chatId, userId);

      typingTimeout = setTimeout(() => {
        SocketService.stopTyping(chatId, userId);
        setIsTyping(false);
      }, 3000);
    }

    return () => clearTimeout(typingTimeout);
  }, [isTyping, chatId, userId]);

  // useEffect(() => {
  //   // Listen for typing event from other users
  //   const handleUserTyping = ({
  //     chatId: receivedChatId,
  //     userId: typingUserId,
  //   }) => {
  //     if (receivedChatId === chatId && typingUserId !== userId) {
  //       setTypingUsers((prev) => [...new Set([...prev, typingUserId])]); // Add unique users
  //     }
  //   };

  //   const handleUserStopTyping = ({
  //     chatId: receivedChatId,
  //     userId: typingUserId,
  //   }) => {
  //     if (receivedChatId === chatId && typingUserId !== userId) {
  //       setTypingUsers((prev) => prev.filter((id) => id !== typingUserId)); // Remove user from list
  //     }
  //   };

  //   SocketService.onUserTyping(handleUserTyping);
  //   SocketService.onUserStopTyping(handleUserStopTyping);
  // }, [chatId, userId]);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === "" && !file) return;

    SocketService.sendMessage({
      senderId: userId,
      chatId,
      content: message,
      messageType: file ? "file" : "text",
      file,
    });

    // Stop typing when message is sent
    SocketService.stopTyping(chatId, userId);
    setIsTyping(false);
    setMessage("");
    setFile(null);
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={handleTyping}
        placeholder="Type a message..."
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSendMessage}>Send</button>

      {/* Display typing indicator if someone else is typing */}
    </div>
  );
};

export default MessageInput;
