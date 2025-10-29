import React, { useContext, useEffect, useState } from 'react';
import ChatStyle from '../Chat.module.css';
import Contactprofile from '../../Component/images/Asset 70mdpi.png';
import GroupIcon from '@mui/icons-material/Group'; // Import group icon
import { UserContext } from './userContext';
import { ApiEndPoint } from '../../Component/utils/utlis';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import SocketService from '../../../../SocketService';
import { useCookies } from 'react-cookie';
import { Tooltip } from '@mui/material';
import { colorScheme } from './GroupCreationModal';

export default function UserListWidget({ setSelectedChat, userData, searchQuery, onGroupCreated }) {
  const [users, setUsers] = useState([]);
  const [allChats, setAllChats] = useState([]); // Both private and group chats
  const [loading, setLoading] = useState(true);
  const isCompact = useMediaQuery({ maxWidth: 768 });
  const [cookies] = useCookies(['token']);

  // Fetch users available for new chats
  const fetchUsersForChat = async (email) => {
    try {
      const response = await axios.get(`${ApiEndPoint}getUsersForChat/${email}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users for chat:', error);
      return [];
    }
  };

  // Fetch user's all chats (both private and group)
  const fetchUserChats = async (email) => {
    try {
      const response = await axios.get(`${ApiEndPoint}getUserChats/${email}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user chats:', error);
      return [];
    }
  };

  // Get or create private chat when clicking on a user
  const getOrCreatePrivateChat = async (targetUserEmail) => {
    try {
      const response = await axios.post(
        `${ApiEndPoint}chats/getOrCreatePrivateChat`,
        {
          currentUserEmail: userData?.email,
          targetUserEmail: targetUserEmail,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting/creating private chat:', error);
      return null;
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (userData?.email) {
      const loadData = async () => {
        setLoading(true);
        try {
          const [availableUsers, userChats] = await Promise.all([
            fetchUsersForChat(userData?.email),
            fetchUserChats(userData?.email),
          ]);
          setUsers(availableUsers);
          setAllChats(userChats);
        } catch (error) {
          console.error('Error loading chat data:', error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [userData, userData?.email]);

  // Handle when a new group is created (from parent component)
  useEffect(() => {
    if (onGroupCreated) {
      // This function will be called by parent when a group is created
      const handleExternalGroupCreated = (newGroup) => {
        console.log('New group received in UserListWidget:', newGroup);

        // Add the new group to allChats state
        setAllChats((prevChats) => {
          // Check if group already exists to avoid duplicates
          const exists = prevChats.some((chat) => chat._id === newGroup._id);
          if (exists) {
            return prevChats;
          }
          return [newGroup, ...prevChats];
        });

        // Optionally select the new group
        setSelectedChat(newGroup);
      };

      // Assign the handler
      onGroupCreated.current = handleExternalGroupCreated;
    }
  }, [onGroupCreated, setSelectedChat]);

  // Handle user click - create/get private chat
  const handleUserClick = async (selectedUser) => {
    const chat = await getOrCreatePrivateChat(selectedUser?.Email);
    if (chat) {
      setSelectedChat(chat);
      // Refresh chats list to include the new chat
      const updatedChats = await fetchUserChats(userData?.email);
      setAllChats(updatedChats);
    }
  };

  // Handle group chat click
  const handleGroupClick = (groupChat) => {
    setSelectedChat(groupChat);
  };

  // Separate private and group chats from all chats
  const privateChats = allChats.filter((chat) => !chat.isGroupChat);
  const groupChats = allChats.filter((chat) => chat.isGroupChat);

  // Filter based on search query
  const filteredPrivateChats = privateChats.filter((chat) => {
    if (!searchQuery) return true;
    const lowerCaseQuery = searchQuery.toLowerCase();

    // For private chats, search in participant names (excluding current user)
    const otherParticipants = chat.participants.filter((participant) => participant.Email !== userData?.email);

    return otherParticipants.some((participant) => participant.UserName?.toLowerCase().includes(lowerCaseQuery));
  });

  const filteredGroupChats = groupChats.filter((group) => {
    if (!searchQuery) return true;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      group.groupName?.toLowerCase().includes(lowerCaseQuery) ||
      group.groupDescription?.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return user.UserName?.toLowerCase().includes(lowerCaseQuery);
  });

  if (loading) {
    return <div className="text-center py-3">Loading chats...</div>;
  }

  const hasGroups = filteredGroupChats.length > 0;
  const hasPrivateChats = filteredPrivateChats.length > 0;
  const hasAvailableUsers = filteredUsers.length > 0;

  if (!hasGroups && !hasPrivateChats && !hasAvailableUsers) {
    return <div className="text-center py-3">{searchQuery ? 'No matching chats found' : 'No chats available'}</div>;
  }

  return (
    <>
      {/* Existing Group Chats */}
      {hasGroups && (
        <div className="mb-3">
          <div className="text-muted small fw-bold px-2 mb-2" style={{ fontSize: '12px', textTransform: 'uppercase' }}>
            Group Chats
          </div>
          {filteredGroupChats.map((group) => (
            <div
              key={group._id}
              className="d-flex align-items-center p-2 hover-bg"
              onClick={() => handleGroupClick(group)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '5px',
                marginBottom: '5px',
                backgroundColor: '#f8f9fa',
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: colorScheme.navy,
                  width: '40px',
                  height: '40px',
                  marginRight: '10px',
                  border: '1px solid #d3b386',
                }}
              >
                <GroupIcon style={{ color: colorScheme.gold, fontSize: '20px' }} />
              </div>
              <div className="flex-grow-1">
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{group.groupName}</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {group.participants?.length || 0} members
                  {group.groupDescription && (
                    <>
                      {' • '}
                      <Tooltip title={group.groupDescription} arrow placement="top">
                        <span
                          style={{
                            display: 'inline-block',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            verticalAlign: 'bottom',
                          }}
                        >
                          {group.groupDescription}
                        </span>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Private Chats */}
      {hasPrivateChats && (
        <div className="mb-3">
          <div className="text-muted small fw-bold px-2 mb-2" style={{ fontSize: '12px', textTransform: 'uppercase' }}>
            Recent Chats
          </div>
          {filteredPrivateChats.map((chat) => {
            // Find the other participant (not current user)
            const otherParticipant = chat.participants.find((participant) => participant.Email !== userData?.email);

            if (!otherParticipant) return null;

            return (
              <div
                key={chat?._id}
                className="d-flex align-items-center p-2 hover-bg"
                onClick={() => setSelectedChat(chat)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '5px',
                  marginBottom: '5px',
                }}
              >
                <div
                  className="rounded-circle"
                  style={{
                    backgroundImage: otherParticipant?.ProfilePicture
                      ? `url(${otherParticipant?.ProfilePicture})`
                      : `url(${Contactprofile})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '40px',
                    height: '40px',
                    marginRight: '10px',
                    border: '1px solid #d3b386',
                  }}
                />
                <div className="flex-grow-1">
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{otherParticipant?.UserName}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{otherParticipant?.Role}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Users for New Chats */}
      {hasAvailableUsers && (
        <div>
          <div className="text-muted small fw-bold px-2 mb-2" style={{ fontSize: '12px', textTransform: 'uppercase' }}>
            Start New Chat
          </div>
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="d-flex align-items-center p-2 hover-bg"
              onClick={() => handleUserClick(user)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '5px',
                marginBottom: '5px',
              }}
            >
              <div
                className="rounded-circle"
                style={{
                  backgroundImage: user?.ProfilePicture ? `url(${user?.ProfilePicture})` : `url(${Contactprofile})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  width: '40px',
                  height: '40px',
                  marginRight: '10px',
                  border: '1px solid #d3b386',
                }}
              />
              <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{user.UserName}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{user.Role}</div>
                </div>
                {user.isOnline && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#28a745',
                      borderRadius: '50%',
                    }}
                    title="Online"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
