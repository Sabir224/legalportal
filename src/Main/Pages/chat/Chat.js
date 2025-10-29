import React, { useEffect, useRef, useState } from 'react';
import '../chat/Chat.module.css';
import UserListWidget from './widgets/UserListWidget';
import ChatField from './widgets/ChatField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faBars, faComments, faMessage } from '@fortawesome/free-solid-svg-icons';
import { ApiEndPoint } from '../Component/utils/utlis';
import { useMediaQuery } from 'react-responsive';
import { Socket } from 'socket.io-client';
import SocketService from '../../../SocketService';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Offcanvas } from 'bootstrap/dist/js/bootstrap.bundle.min';
import GroupCreationModal, { colorScheme } from './widgets/GroupCreationModal';
import { Box, IconButton, TextField } from '@mui/material';
import { GroupAdd } from '@mui/icons-material';

export default function Chat({ token }) {
  //const Users = useSelector((state) => state.Data.usersdetail);
  console.log('Email', token?.email);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [userId] = useState('67a4c17ab12c220e72bcf98d'); // Replace with actual user ID (could be from state or context)
  const storedEmail = sessionStorage.getItem('Email');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groups, setGroups] = useState([]); // Add this state for groups list
  const groupCreatedRef = useRef(null);

  const handleGroupCreated = (newGroup) => {
    console.log('New group created:', newGroup);
    setSelectedChat(newGroup);

    // Call the handler in UserListWidget to update the state
    if (groupCreatedRef.current) {
      groupCreatedRef.current(newGroup);
    }
  };

  // console.log("StoredEmail:", storedEmail);
  const hasFetched = useRef(false); // Ref to track if data has been fetched
  // Connect to the socket when the app loads
  useEffect(() => {
    if (!token?.email || hasFetched.current) return;

    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${ApiEndPoint}/getUserDetail/${token?.email}`);
        setUserData(response.data);

        if (response.data?._id) {
          // Only connect if the socket is NOT already connected
          if (!SocketService.socket || !SocketService.socket.connected) {
            console.log('🔌 Connecting to socket...');
            SocketService.connect(response.data?._id);
          }
          // Mark messages as delivered only once when connected
          SocketService.socket?.once('connect', () => {
            console.log('✅ Socket Connected! Marking messages as delivered...');
            SocketService.markAsDelivered(response.data?._id);
          });
        }
      } catch (err) {
        console.error('Error fetching client details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
    hasFetched.current = true; // Prevent multiple calls

    return () => {
      if (SocketService.socket?.connected) {
        console.log('🛑 Disconnecting socket...');
        SocketService.socket.disconnect();
      }
    };
  }, [token?.email]);

  // ✅ Depend only on userData._id to avoid unnecessary re-renders

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const isCompact = useMediaQuery({ maxWidth: 768 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isCompact); // Toggle state

  // Sync Bootstrap Offcanvas with React state
  useEffect(() => {
    const sidebarElement = document.getElementById('sidebarMenu');

    if (sidebarElement) {
      const offcanvasInstance = Offcanvas.getOrCreateInstance(sidebarElement);

      // Show or hide sidebar based on state
      if (isSidebarOpen) {
        offcanvasInstance.show();
      } else {
        offcanvasInstance.hide();
      }

      // Handle sidebar close event
      const handleSidebarClose = () => setIsSidebarOpen(false);
      sidebarElement.addEventListener('hidden.bs.offcanvas', handleSidebarClose);

      return () => {
        sidebarElement.removeEventListener('hidden.bs.offcanvas', handleSidebarClose);
      };
    }
  }, [isSidebarOpen]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state on screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <Box
      sx={{
        height: '85vh',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        p: 0,
        m: 0,
        position: 'relative',
      }}
    >
      {/* User List Widget */}
      <Box
        sx={{
          display: { xs: selectedChat ? 'none' : 'flex', md: 'flex' },
          flexDirection: 'column',
          p: 2,
          width: { xs: '100%', md: 300 },
          height: '82vh',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          m: 1,
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        {/* Search and Create Group Button */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            type="search"
            size="small"
            placeholder="Search User"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          {token?.Role === 'admin' && (
            <IconButton
              onClick={() => setShowGroupModal(true)}
              title="Create Group Chat"
              sx={{
                backgroundColor: colorScheme.navy,
                color: 'white',
                '&:hover': {
                  backgroundColor: colorScheme.textPrimary,
                },
              }}
            >
              <GroupAdd
                sx={{
                  color: colorScheme.gold,
                }}
              />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            height: 'calc(100% - 60px)',
          }}
        >
          <UserListWidget
            setSelectedChat={(chat) => setSelectedChat(chat)}
            userData={token}
            searchQuery={searchQuery}
            token={token}
            onGroupCreated={groupCreatedRef}
          />
        </Box>
      </Box>

      {/* Chat Section */}
      <Box
        sx={{
          display: { xs: selectedChat ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column',
          flexGrow: 1,
          height: '82vh',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          m: 1,
          borderRadius: '10px',
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <ChatField selectedChat={selectedChat} user={token} setSelectedChat={setSelectedChat} />
      </Box>

      {/* Group Creation Modal */}
      <GroupCreationModal
        show={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        userData={token}
        onGroupCreated={handleGroupCreated}
      />
    </Box>
  );
}
