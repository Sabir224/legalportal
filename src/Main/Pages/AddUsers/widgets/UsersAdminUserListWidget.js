import React, { useContext, useEffect, useState } from 'react';
// import ChatStyle from "../Chat.module.css";
import Contactprofile from '../../Component/images/Asset 70mdpi.png';
// import { UserContext } from "./userContext";
import { ApiEndPoint } from '../../Component/utils/utlis';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import SocketService from '../../../../SocketService';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { clientEmail } from '../../../../REDUX/sliece';
export default function UsersAdminUserListWidget({ setSelectedChat, userData, searchQuery, screen, refreshTrigger }) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [buttonSelected, setbuttonSelected] = useState('All');
  const [buttonColor, setbuttonColor] = useState('#18273e');

  const storedEmail = sessionStorage.getItem('Email');
  const isCompact = useMediaQuery({ maxWidth: 768 });
  const [cookies] = useCookies(['token']);
  const dispatch = useDispatch();
  // Fetch users list (not chats)

  const fetchUsersForChat = async (email) => {
    try {
      const response = await axios.get(`${ApiEndPoint}getAllUser`);
      const users = response.data.users || [];

      // console.log("screen", screen)
      // if (screen !== null) {
      // const filteredUsers = users.filter(user => user.Role === "client");
      // console.log("Filtered Users (clients):", filteredUsers);
      // return filteredUsers;
      // }

      console.log('All Users:', users);
      return users;
    } catch (error) {
      console.error('Error fetching users for chat:', error);
      return [];
    }
  };

  // Check if chat exists between two users
  //   const checkIfChatExists = async (selectedUserEmail) => {
  //     try {
  //       const response = await axios.post(
  //         `${ApiEndPoint}chats/checkIfChatExists`,
  //         {
  //           participants: [userData?.email, selectedUserEmail], // Pass emails to the backend
  //         }
  //       );
  //       console.log("Chat Exists Response:", response.data);
  //       return response.data; // Return the chat data or null if no chat
  //     } catch (error) {
  //       console.error("Error checking if chat exists:", error);
  //       return null;
  //     }
  //   };

  // Fetch users and chats on initial load
  useEffect(() => {
    const loadUsers = async () => {
      console.log('userData', userData);
      const fetchedUsers = await fetchUsersForChat(userData?.email);
      setUsers(fetchedUsers);
    };

    loadUsers();
  }, [userData, userData?.email, refreshTrigger]);

  // Handle user click (select chat)
  const handleUserClick = async (selectedUserEmail) => {
    // const existingChat = await checkIfChatExists(selectedUserEmail);

    // if (existingChat) {
    //     setSelectedChat(existingChat); // If chat exists, set it as selected
    // } else {
    //     const newChat = await createChat([storedEmail, selectedUserEmail]); // If no chat, create a new one
    setSelectedChat(selectedUserEmail); // Set the new chat as selected
    // }
    dispatch(clientEmail(selectedUserEmail));
    // const newChat = await createChat([storedEmail, selectedUserEmail]); // If no chat, create a new one
    // setSelectedChat(newChat); // Set the new chat as selected
  };
  const handlefilterbutton = async (value) => {
    if (value === 'All') {
      //  console.log('userData', userData);
      const fetchedUsers = await fetchUsersForChat(userData?.email);
      setUsers(fetchedUsers);
      setbuttonSelected('All');
    } else if (value === 'Client') {
      console.log('userData', userData);
      const fetchedUsers = await fetchUsersForChat(userData?.email);
      const filteredUsers = fetchedUsers.filter((user) => user.Role === 'client');
      setUsers(filteredUsers);
      console.log('Filtered Users (clients):', filteredUsers);
      setbuttonSelected('Client');
    } else {
      console.log('userData', userData);
      const fetchedUsers = await fetchUsersForChat(userData?.email);
      const filteredUsers = fetchedUsers.filter((user) => user.Role !== 'client');
      setUsers(filteredUsers);
      console.log('Filtered Users (clients):', filteredUsers);
      setbuttonSelected('Team');
    }
  };

  const searchedUsers = users?.filter((user) => {
    if (!searchQuery) return true; // If no search query, return all users

    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    // Use empty string as a fallback to prevent undefined errors
    return (user.UserName?.toLowerCase() || '').includes(lowerCaseSearchQuery);
  });

  return (
    <>
      <div className="d-flex justify-content-center gap-1 mb-3">
        <button
          className="btn btn-sm border"
          onClick={() => handlefilterbutton('All')}
          style={{
            backgroundColor: buttonSelected === 'All' ? '#c0a262' : buttonColor,
            color: 'white',
          }}
        >
          All
        </button>
        <button
          className="btn btn-sm border"
          onClick={() => handlefilterbutton('Client')}
          style={{
            backgroundColor: buttonSelected === 'Client' ? '#c0a262' : buttonColor,
            color: 'white',
          }}
        >
          Clients
        </button>
        <button
          className="btn btn-sm border"
          onClick={() => handlefilterbutton('Team')}
          style={{
            backgroundColor: buttonSelected === 'Team' ? '#c0a262' : buttonColor,
            color: 'white',
          }}
        >
          Team
        </button>
      </div>
      {searchedUsers.map((user) => (
        <div
          key={user._id}
          className="d-flex d-block align-items-center"
          onClick={() => handleUserClick(user)}
          style={{
            cursor: 'pointer',
            padding: '5px',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Profile Picture */}
          <div
            className="rounded-circle"
            style={{
              backgroundImage: user?.ProfilePicture ? `url(${user?.ProfilePicture})` : `url(${Contactprofile})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '30px',
              height: '30px',
              marginRight: isCompact ? '5px' : '10px',
              border: '1px solid #d3b386',
              transition: 'all 0.3s ease',
            }}
          />

          {/* User Info */}
          <div
            className="flex-grow-1"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* User Name */}
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {user.UserName &&
                (user.UserName.includes(' ')
                  ? `${user.UserName.split(' ')[0]} ${user.UserName.split(' ')[1]?.[0] || ''}.`
                  : user.UserName)}
            </span>

            {/* User Status */}
            <div>
              <span className={`badge bg-${user.isActive ? 'success' : 'danger'} me-1`}>
                {user.isActive ? 'Active' : 'Deactivated'}
              </span>
              <span
                className={`badge ${
                  user.approvalStatus === 'approved'
                    ? 'bg-success'
                    : user.approvalStatus === 'pending'
                    ? 'bg-warning text-dark'
                    : 'bg-danger'
                }`}
              >
                {user.approvalStatus === 'rejected'
                  ? 'Rejected By Admin'
                  : user.approvalStatus.charAt(0).toUpperCase() + user.approvalStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
