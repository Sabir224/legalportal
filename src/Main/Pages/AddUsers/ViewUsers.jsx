import React, { useEffect, useState } from 'react';
import UsersAdminUserListWidget from './widgets/UsersAdminUserListWidget';
import ViewUsersAdminWidget from './widgets/ViewUsersAdminWidget';
import { useMediaQuery } from 'react-responsive';
import { GrContactInfo } from 'react-icons/gr';

import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat, setAdminWidgetState, resetAdminWidget, goBackScreen } from '../../../REDUX/sliece';

export default function ViewUsers({ token, screen, onRegisterAdminHandler }) {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersRefreshTrigger, setUsersRefreshTrigger] = useState(0);

  // Get admin widget state from Redux
  const adminWidgetState = useSelector((state) => state.screen.adminWidgetState);
  const selectedChat = adminWidgetState.selectedChat;
  const [adminWidgetHandler, setAdminWidgetHandler] = useState(null);

  const updateAdminWidgetState = (updates) => {
    dispatch(setAdminWidgetState(updates));
  };
  const handleRegisterAdminHandler = (handler) => {
    console.log('📝 Storing admin widget handler:', handler);
    setAdminWidgetHandler(handler);
  };

  // When selecting a chat
  const handleSelectChat = (chat) => {
    dispatch(setSelectedChat(chat));
    updateAdminWidgetState({
      showCaseSheet: false,
      isProfile: true,
      adminData: null,
      profilePicBase64: null,
      selectedRole: chat?.Role || null,
      editableFields: false,
    });
  };

  // Handle widget close
  // ViewUsers.js mein
  const handleWidgetClose = () => {
    // ✅ SABSE PEHLE isProfile ki state change karen - always set to false
    dispatch(
      setAdminWidgetState({
        isProfile: false, // ✅ Pehle isProfile false karen
        showLFA: false,
        showCaseSheet: false,
        navigationLevel: 1,
        selectedChat: null,
        adminData: null,
        profilePicBase64: null,
        selectedRole: null,
        editableFields: false,
        selectedCase: null,
      })
    );
    dispatch(resetAdminWidget());
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to refresh users list
  const refreshUsersList = (updatedUserData = null) => {
    setUsersRefreshTrigger((prev) => prev + 1);

    if (updatedUserData && selectedChat && selectedChat._id === updatedUserData._id) {
      dispatch(
        setSelectedChat({
          ...selectedChat,
          ...updatedUserData,
        })
      );
      updateAdminWidgetState({
        selectedChat: {
          ...adminWidgetState.selectedChat,
          ...updatedUserData,
        },
      });
    }
  };

  // Update isMobile state on screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  return (
    <div
      className="p-0 m-0 d-flex position-relative"
      style={{
        height: '85vh',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        gap: '10px',
        padding: '10px',
      }}
    >
      {/* User List Widget */}
      <div
        className={`d-flex flex-column p-3 ${isMobile && selectedChat ? 'd-none' : 'd-block'}`}
        style={{
          width: isMobile ? '100%' : '300px',
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'margin-left 0.3s ease-in-out',
        }}
      >
        <input
          type="search"
          className="form-control p-2 my-2 rounded"
          placeholder="Search User"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="d-flex flex-column p-3 overflow-y-auto">
          <UsersAdminUserListWidget
            setSelectedChat={handleSelectChat}
            userData={token}
            searchQuery={searchQuery}
            token={token}
            screen={null}
            refreshTrigger={usersRefreshTrigger}
          />
        </div>
      </div>

      {/* Chat Section */}
      <div
        className={`d-flex flex-column flex-grow-1 ${isMobile && !selectedChat ? 'd-none' : 'd-block'}`}
        style={{
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'opacity 0.3s ease-in-out',
          overflow: 'hidden',
        }}
      >
        {selectedChat ? (
          <ViewUsersAdminWidget
            user={selectedChat}
            widgetState={adminWidgetState}
            updateWidgetState={updateAdminWidgetState}
            onUserUpdate={refreshUsersList}
            onClose={handleWidgetClose}
            registerCloseHandler={onRegisterAdminHandler}
          />
        ) : (
          <div
            className="gap-3 text-center d-flex flex-column justify-content-center align-items-center h-100 w-100"
            style={{
              padding: isDesktop ? '2rem' : isTablet ? '1rem' : '0.5rem',
            }}
          >
            <GrContactInfo className={isDesktop ? 'fs-1' : isTablet ? 'fs-2' : 'fs-3'} />
            <div>
              <h4
                style={{
                  fontSize: isDesktop ? '1.75rem' : isTablet ? '1.5rem' : '1.25rem',
                }}
              >
                Admin Detail
              </h4>
              <p
                style={{
                  fontSize: isDesktop ? '1rem' : isTablet ? '0.9rem' : '0.8rem',
                }}
              >
                Click any Admin to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
