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
  const [loading, setLoading] = useState(true);
  const storedEmail = sessionStorage.getItem("Email");
  const isCompact = useMediaQuery({ maxWidth: 768 });
  const [cookies] = useCookies(["token"]);

  // Fetch users list based on case assignments
  const fetchUsersForChat = async (email) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${ApiEndPoint}getUsersForChat/${email}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      console.log("Filtered Users:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching users for chat:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Check if chat exists between two users
  const checkIfChatExists = async (selectedUserEmail) => {
    try {
      const response = await axios.post(
        `${ApiEndPoint}chats/checkIfChatExists`,
        {
          participants: [userData?.email, selectedUserEmail],
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error checking if chat exists:", error);
      return null;
    }
  };

  // Create a new chat between two users
  const createChat = async (participants) => {
    try {
      const response = await axios.post(
        `${ApiEndPoint}chats`,
        { participants },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  // Fetch users on initial load and when userData changes
  useEffect(() => {
    if (userData?.email) {
      const loadUsers = async () => {
        const fetchedUsers = await fetchUsersForChat(userData?.email);
        setUsers(fetchedUsers);
      };
      loadUsers();
    }
  }, [userData, userData?.email]);

  // Handle user click (select chat)
  const handleUserClick = async (selectedUserEmail) => {
    const existingChat = await checkIfChatExists(selectedUserEmail);

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat = await createChat([storedEmail, selectedUserEmail]);
      if (newChat) {
        setSelectedChat(newChat);
      }
    }
  };

  // Filter users based on search query
  const searchedUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return (user.UserName?.toLowerCase() || "").includes(lowerCaseSearchQuery);
  });

  if (loading) {
    return <div className="text-center py-3">Loading users...</div>;
  }

  if (searchedUsers.length === 0) {
    return (
      <div className="text-center py-3">
        {searchQuery ? "No matching users found" : "No users available to chat"}
      </div>
    );
  }

  return (
    <>
      {searchedUsers.map((user) => (
        <div
          key={user?._id}
          className="d-flex d-block align-items-center p-2 hover-bg"
          onClick={() => handleUserClick(user?.Email)}
          style={{
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderRadius: "5px",
            marginBottom: "5px",
          }}
        >
          {/* Profile Picture */}
          <div
            className="rounded-circle"
            style={{
              backgroundImage: user?.ProfilePicture
                ? `url(${user?.ProfilePicture})`
                : `url(${Contactprofile})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "40px",
              height: "40px",
              marginRight: isCompact ? "5px" : "10px",
              border: "1px solid #d3b386",
            }}
          />

          {/* User Name */}
          <div
            className="flex-grow-1"
            style={{ fontSize: "14px", display: "flex", alignItems: "center" }}
          >
            <span className="username">
              {user?.UserName &&
                (user?.UserName.includes(" ")
                  ? `${user?.UserName.split(" ")[0]} ${
                      user?.UserName.split(" ")[1]?.[0] || ""
                    }`
                  : user?.UserName)}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
