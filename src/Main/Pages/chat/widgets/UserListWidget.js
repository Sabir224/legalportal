import React, { useContext, useEffect, useState } from "react";
import ChatStyle from "../Chat.module.css";
import Contactprofile from "../../Component/images/Asset 70mdpi.png";
import { UserContext } from "./userContext";
import { ApiEndPoint } from "../../Component/utils/utlis";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import SocketService from "../../../../SocketService";
import { useCookies } from "react-cookie";
export default function UserListWidget({
  setSelectedChat,
  userData,
  searchQuery,
}) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);

  const storedEmail = sessionStorage.getItem("Email");
  const isCompact = useMediaQuery({ maxWidth: 768 });
  const [cookies] = useCookies(["token"]);
  // Fetch users list (not chats)

  const fetchUsersForChat = async (email) => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}getUsersForChat/${userData.email}`
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
          participants: [userData?.email, selectedUserEmail], // Pass emails to the backend
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
      console.log("userData", userData);
      const fetchedUsers = await fetchUsersForChat(userData?.email);
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, [userData, userData?.email]);

  // Handle user click (select chat)
  const handleUserClick = async (selectedUserEmail) => {
    const existingChat = await checkIfChatExists(selectedUserEmail);

    if (existingChat) {
      setSelectedChat(existingChat); // If chat exists, set it as selected
    } else {
      const newChat = await createChat([storedEmail, selectedUserEmail]); // If no chat, create a new one
      setSelectedChat(newChat); // Set the new chat as selected
    }
    // const newChat = await createChat([storedEmail, selectedUserEmail]); // If no chat, create a new one
    // setSelectedChat(newChat); // Set the new chat as selected
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
  const searchedUsers = users.filter((user) => {
    if (!searchQuery) return true; // If no search query, return all users

    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    // Use empty string as a fallback to prevent undefined errors
    return (user.UserName?.toLowerCase() || "").includes(lowerCaseSearchQuery);
  });

  return (
    <>
      {searchedUsers.map((user) => (
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
              width: "30px",
              height: "30px",
              marginRight: isCompact ? "5px" : "10px",
              border: "1px solid #d3b386",
              transition: "all 0.3s ease",
            }}
          />

          {/* User Name */}
          <div
            className="flex-grow-1"
            style={{ fontSize: "14px", display: "flex", alignItems: "center" }}
          >
            <span className="username">
              {user.UserName &&
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
    </>
  );
}
