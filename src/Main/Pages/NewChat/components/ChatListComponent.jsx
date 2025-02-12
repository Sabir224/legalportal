import { useState, useEffect } from "react";
import axios from "axios";
import { ApiEndPoint } from "../../Component/utils/utlis";

const ChatList = ({ setSelectedChat, userData }) => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const storedEmail = sessionStorage.getItem("Email");

  // Fetch users list (not chats)
  const fetchUsersForChat = async () => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}getUsersForChat/${storedEmail}`
      );
      console.log("Users:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching users for chat:", error);
      return [];
    }
  };

  // Check if chat exists between two users
  const checkIfChatExists = async (selectedUserEmail) => {
    try {
      const response = await axios.post(
        `${ApiEndPoint}chats/checkIfChatExists`,
        {
          participants: [storedEmail, selectedUserEmail], // Pass emails to the backend
        }
      );
      console.log("Chat Exists Response:", response.data);
      return response.data; // Return the chat data or null if no chat
    } catch (error) {
      console.error("Error checking if chat exists:", error);
      return null;
    }
  };

  // Fetch users and chats on initial load
  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsersForChat();
      setUsers(fetchedUsers);
    };
    loadUsers();
  }, [storedEmail]);

  // Handle user click (select chat)
  const handleUserClick = async (selectedUserEmail) => {
    const existingChat = await checkIfChatExists(selectedUserEmail);

    if (existingChat) {
      setSelectedChat(existingChat); // If chat exists, set it as selected
    } else {
      const newChat = await createChat([storedEmail, selectedUserEmail]); // If no chat, create a new one
      setSelectedChat(newChat); // Set the new chat as selected
    }
  };

  // Create a new chat between two users
  const createChat = async (participants) => {
    try {
      const response = await axios.post(`${ApiEndPoint}chats`, {
        participants,
      });
      console.log("New Chat Created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => handleUserClick(user.Email)}>
            {user.UserName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
