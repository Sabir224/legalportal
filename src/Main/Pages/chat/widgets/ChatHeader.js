import React, { useState } from 'react';
import '../Chat.module.css';
import SocketService from '../../../../SocketService';
import { FaArrowLeft } from 'react-icons/fa';
import ViewChatUser from './DynamicViewUsers';

const dropdownData = {
  firstStage: ['Option 1', 'Option 2', 'Option 3'],
  secondStage: ['Option A', 'Option B', 'Option C'],
};

export default function ChatHeader({ selectedChat, user, setSelectedChat }) {
  const [IsDetailView, setDetailView] = useState(false);

  console.log('users headers', selectedChat);

  // Function to get the correct chat name
  const getChatName = () => {
    if (!selectedChat) return 'Name';

    // For group chats
    if (selectedChat.isGroupChat) {
      return selectedChat.groupName || 'Group Chat';
    }

    // For private chats, find the other participant
    if (selectedChat.participants && selectedChat.participants.length > 0) {
      const otherParticipant = selectedChat.participants.find(
        (participant) => String(participant._id) !== String(user._id)
      );
      return otherParticipant?.UserName || 'Unknown User';
    }

    return 'Name';
  };

  // Function to get avatar initials
  const getAvatarInitials = () => {
    if (!selectedChat) return 'N';

    // For group chats
    if (selectedChat.isGroupChat) {
      const name = selectedChat.groupName || 'Group Chat';
      const nameParts = name.split(' ');
      if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }

    // For private chats
    if (selectedChat.participants && selectedChat.participants.length > 0) {
      const otherParticipant = selectedChat.participants.find(
        (participant) => String(participant._id) !== String(user._id)
      );

      if (otherParticipant?.UserName) {
        const nameParts = otherParticipant.UserName.split(' ');
        if (nameParts.length > 1) {
          return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        }
        return otherParticipant.UserName.substring(0, 2).toUpperCase();
      }
    }

    return 'N';
  };

  // Function to get avatar color based on chat name
  const getAvatarColor = () => {
    const chatName = getChatName();
    const colors = [
      '#1976d2',
      '#d32f2f',
      '#388e3c',
      '#f57c00',
      '#7b1fa2',
      '#0097a7',
      '#c2185b',
      '#5d4037',
      '#455a64',
      '#0288d1',
      '#c62828',
      '#2e7d32',
    ];

    // Generate consistent color based on chat name
    let hash = 0;
    for (let i = 0; i < chatName.length; i++) {
      hash = chatName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div
      className="py-0 px-0 d-block mt-1 mb-1"
      style={{
        maxHeight: '9vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div className="d-flex align-items-center" style={{ height: '100%', marginLeft: '10px', marginRight: '10px' }}>
        {/* Back Arrow */}
        <div className="me-2 d-lg-none">
          <FaArrowLeft
            className="main-color"
            size={20}
            onClick={() => {
              setSelectedChat(null);
              SocketService.socket.disconnect();
            }}
          />
        </div>

        <div
          className="d-flex gap-2 align-items-center"
          onClick={() => setDetailView(true)}
          style={{ marginRight: '10px', cursor: 'pointer', flex: 1 }}
        >
          {/* Profile Image */}
          <div className="position-relative">
            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: getAvatarColor(),
                backgroundImage: selectedChat?.chatProfilePicture ? `url(${selectedChat.chatProfilePicture})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '40px',
                height: '40px',
                border: '2px solid #FFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden',
              }}
            >
              {!selectedChat?.chatProfilePicture && (
                <div
                  style={{
                    margin: 'auto',
                    textAlign: 'center',
                    color: '#FFF',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {getAvatarInitials()}
                </div>
              )}
            </div>
          </div>

          {/* Name and Info */}
          <div className="flex-grow-1 d-flex flex-column">
            <strong className="text-start w-100" style={{ fontSize: '16px', lineHeight: '1.2' }}>
              {getChatName()}
            </strong>
            {/* You can add additional info here like online status, typing indicator, etc. */}
            {selectedChat?.isGroupChat && (
              <span style={{ fontSize: '12px', color: '#6c757d' }}>
                {selectedChat.participants?.length || 0} members
              </span>
            )}
          </div>
        </div>

        <ViewChatUser
          isOpen={IsDetailView}
          onClose={(value) => setDetailView(value)}
          user={selectedChat?.participants}
          selectedChat={selectedChat}
          currentUserId={user._id}
        />
      </div>
    </div>
  );
}
