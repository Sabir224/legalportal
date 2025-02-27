import React, { useContext, useEffect, useState } from "react";
import ChatStyle from "../Chat.module.css";
import Contactprofile from "../../Component/images/Asset 70mdpi.png";
import { UserContext } from "./userContext";
import { ApiEndPoint } from "../../Component/utils/utlis";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import SocketService from "../../../../SocketService";
export default function UserListWidget({ setSelectedChat, userData }) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);

  const storedEmail = sessionStorage.getItem("Email");
  const isCompact = useMediaQuery({ maxWidth: 768 });
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
      if (userData._id) {
        console.log("🔌 Connecting to socket...");
        SocketService.connect(userData._id);

        // Ensure socket is fully connected before marking messages as delivered
        SocketService.socket?.on("connect", () => {
          console.log("✅ Socket Connected! Joining chat...");
          SocketService.markAsDelivered(userData._id);
        });
      }
    };
    loadUsers();
    const handleNewMessage = (newMessage) => {
      if (!newMessage) return;
      console.log("📩 New message received:", newMessage);

      // ✅ Only mark messages as Delivered if the sender is NOT the current user
      if (newMessage.sender._id !== userData._id) {
        console.log("📤 Marking Messages as Delivered...");
        SocketService.markAsDelivered(userData._id);
      }
      // ✅ Using a stable reference for event listeners
      SocketService.socket?.off("newMessage"); // Remove all previous listeners
      SocketService.socket?.on("newMessage", handleNewMessage);
    };
    return () => {
      // ✅ Cleanup the event listener when component unmounts or userData changes
      SocketService.socket?.off("newMessage", handleNewMessage);
    };
  }, [userData._id]);

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
      {users.map((user) => (
        <div
          key={user._id}
          className="d-flex d-block align-items-center"
          onClick={() => handleUserClick(user.Email)}
          style={{
            cursor: "pointer",
            padding: "5px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Profile Picture */}
          <div
            className="rounded-circle"
            style={{
              backgroundImage: user.ProfilePicture
                ? `url(${user.ProfilePicture})`
                : `url(${Contactprofile})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: isCompact ? "30px" : "30px",
              height: isCompact ? "30px" : "30px",
              marginRight: isCompact ? "5px" : "10px",
              border: `1px solid #d3b386`,
              transition: "all 0.3s ease",
            }}
          />

          {/* User Name - Hide when width is ≤ 80px */}
          <div
            className="flex-grow-1"
            style={{
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span className="username">
              {user.UserName &&
                user.UserName.length > 0 &&
                (user.UserName.includes(" ")
                  ? `${
                      user.UserName.split(" ")[0].length > 10
                        ? user.UserName.split(" ")[0].slice(0, 10) + "..."
                        : user.UserName.split(" ")[0]
                    } ${user.UserName.split(" ")[1]?.[0] || ""}`
                  : user.UserName.length > 10
                  ? user.UserName.slice(0, 10) + "..."
                  : user.UserName)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
