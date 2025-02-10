// components/ChatList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ApiEndPoint } from "../../Component/utils/utlis";
const fetchChatsForUser = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/chats?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching chats for user:", error);
    return [];
  }
};

const ChatList = ({ setSelectedChat, userId }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      const userChats = await fetchChatsForUser(userId);
      setChats(userChats);
    };

    if (userId) {
      getChats();
    }
  }, [userId]); // Trigger when the userId changes

  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} onClick={() => setSelectedChat(chat)}>
            {chat.isGroupChat ? `Group Chat: ${chat.name}` : `Private Chat`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
