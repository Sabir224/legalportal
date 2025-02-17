// components/MessageInput.js
import React, { useState, useEffect } from "react";
import SocketService from "../../../../SocketService";
const MessageInput = ({ chatId, userId }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  // Function to send a message
  const handleSendMessage = () => {
    if (message.trim() === "" && !file) return;

    const messageData = {
      senderId: userId,
      chatId,
      content: message,
      messageType: file ? "file" : "text",
      file,
    };

    // Log to debug message sending
    console.log("Sending message:", messageData);

    SocketService.sendMessage(messageData); // Send message via socket
    setMessage(""); // Clear the message input field
    setFile(null); // Clear the file input
  };

  // Handle typing notifications
  const handleTyping = () => {
    SocketService.sendTyping(chatId, userId);
  };

  // Handle stop typing notifications
  const handleStopTyping = () => {
    SocketService.stopTyping(chatId, userId);
  };

  // Effect to handle typing and stop typing notifications
  useEffect(() => {
    if (message.trim()) {
      handleTyping(); // Notify that the user is typing
    } else {
      handleStopTyping(); // Stop typing notification
    }
  }, [message]); // Run the effect when message changes

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
