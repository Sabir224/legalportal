// App.js
import React, { useEffect, useState } from "react";
import ChatList from "./components/ChatListComponent";
import ChatBox from "./components/ChatBoxComponent";
import SocketService from "../../../SocketService";

function ChatVat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [userId] = useState("67a4c17ab12c220e72bcf98d"); // Replace with actual user ID (could be from state or context)

  // Connect to the socket when the app loads
  useEffect(() => {
    SocketService.connect(userId);
  }, [userId]);

  return (
    <div className="App">
      <div className="chat-container">
        <ChatList setSelectedChat={setSelectedChat} userId={userId} />
        {selectedChat && (
          <ChatBox selectedChat={selectedChat} userId={userId} />
        )}
      </div>
    </div>
  );
}

export default ChatVat;
