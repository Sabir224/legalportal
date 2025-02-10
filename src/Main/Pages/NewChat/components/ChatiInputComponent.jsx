// components/MessageInput.js
import React, { useState, useEffect } from "react";
import SocketService from "../../../../SocketService";

const MessageInput = ({ chatId, userId }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleSendMessage = () => {
    if (message.trim() === "" && !file) return;

    const messageData = {
      senderId: userId,
      chatId,
      content: message,
      messageType: file ? "file" : "text",
      file,
    };

    SocketService.sendMessage(messageData);
    setMessage("");
    setFile(null); // reset the file
  };

  const handleTyping = () => {
    SocketService.sendTyping(chatId, userId);
  };

  const handleStopTyping = () => {
    SocketService.stopTyping(chatId, userId);
  };

  useEffect(() => {
    if (message.trim()) {
      handleTyping();
    } else {
      handleStopTyping();
    }
  }, [message]);

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
