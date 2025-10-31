// contexts/MessageStatusContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import SocketService from '../../../../SocketService';

const MessageStatusContext = createContext();

export const useMessageStatus = () => {
  const context = useContext(MessageStatusContext);
  if (!context) {
    throw new Error('useMessageStatus must be used within a MessageStatusProvider');
  }
  return context;
};

export const MessageStatusProvider = ({ children }) => {
  const [messageStatus, setMessageStatus] = useState({});

  // ✅ Global function to update message status
  const updateGlobalMessageStatus = useCallback((messageId, updates) => {
    setMessageStatus((prev) => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        ...updates,
      },
    }));
  }, []);

  // ✅ Global function to mark messages as delivered
  const markMessagesAsDeliveredGlobally = useCallback((chatId, userId, messageId = null) => {
    if (userId && chatId) {
      console.log(`📨 Global marking as delivered - Chat: ${chatId}, User: ${userId}, Message: ${messageId || 'ALL'}`);
      SocketService.markAsDelivered(chatId, userId, messageId);
    }
  }, []);

  // ✅ Global function to mark messages as read
  const markMessagesAsReadGlobally = useCallback((chatId, userId, messageId = null) => {
    if (userId && chatId) {
      console.log(`👀 Global marking as read - Chat: ${chatId}, User: ${userId}, Message: ${messageId || 'ALL'}`);
      SocketService.markAsRead(chatId, userId, messageId);
    }
  }, []);

  // ✅ Get message status for a specific message
  const getMessageStatus = useCallback(
    (messageId) => {
      return messageStatus[messageId] || { status: 'sent', deliveredTo: [], readBy: [] };
    },
    [messageStatus]
  );

  const value = {
    messageStatus,
    updateGlobalMessageStatus,
    markMessagesAsDeliveredGlobally,
    markMessagesAsReadGlobally,
    getMessageStatus,
  };

  return <MessageStatusContext.Provider value={value}>{children}</MessageStatusContext.Provider>;
};

export default MessageStatusContext;
