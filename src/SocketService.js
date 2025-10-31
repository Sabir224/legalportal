/* eslint-disable import/no-anonymous-default-export */
// services/SocketService.js
import { io } from 'socket.io-client';
const ApiBase = 'https://portal.aws-legalgroup.com';
//const ApiBase = 'https://awsrealestate.awschatbot.online'; // Use this for production
//const ApiBase = 'http://localhost:5001'; // Use this for local testing

const socket = io(ApiBase, {
  transports: ['websocket'], // Force WebSocket connection
  autoConnect: false, // Prevent auto-connecting
});
const connect = (userId) => {
  if (!userId) {
    console.error('Missing parameters:', { userId });
    return;
  }

  console.log('Received userId:', userId);

  if (!socket.connected) {
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully.');
      socket.emit('connectUser', { userId });
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected.');
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Connection Error:', err);
    });
  } else {
    socket.emit('connectUser', { userId });
  }
};

const joinChat = (chatId, userId) => {
  if (!socket.connected) {
    console.warn('⚠️ Socket is not connected yet. Trying to connect first...');
    connect(userId);

    socket.once('connect', () => {
      console.log('✅ Now joining chat after connection...');
      socket.emit('joinChat', { chatId, userId });
    });
  } else {
    console.log('✅ Joining chat directly...');
    socket.emit('joinChat', { chatId, userId });
  }
};

// Send message
const sendMessage = (messageData) => {
  if (socket.connected) {
    console.log('Sending message:', messageData);
    socket.emit('sendMessage', messageData);
  } else {
    console.error('sendMessage: Socket is not connected.');
  }
};

// Send file
const sendFile = (fileData) => {
  if (socket.connected) {
    console.log('Sending file:', fileData);
    socket.emit('sendFile', fileData);
  } else {
    console.error('sendFile: Socket is not connected.');
  }
};

const sendTyping = (chatId, userId) => {
  if (socket.connected) {
    socket.emit('typing', { chatId, userId });
  } else {
    console.error('sendTyping: Socket is not connected.');
  }
};

const stopTyping = (chatId, userId) => {
  if (socket.connected) {
    socket.emit('stopTyping', { chatId, userId });
  } else {
    console.error('stopTyping: Socket is not connected.');
  }
};

// Mark messages as delivered - UPDATED to match backend
const markAsDelivered = (chatId, userId, messageId = null) => {
  if (socket.connected) {
    console.log('markAsDelivered', { chatId, userId, messageId });
    socket.emit('markAsDelivered', { chatId, userId, messageId });
  } else {
    console.log('markAsDelivered: Not connected yet');
  }
};

// Mark messages as read - UPDATED to match backend
const markAsRead = (chatId, userId, messageId = null) => {
  if (socket.connected) {
    console.log('markAsRead', { chatId, userId, messageId });
    socket.emit('markAsRead', { chatId, userId, messageId });
  } else {
    console.log('markAsRead: Not connected yet');
  }
};

// Get message status
const getMessageStatus = (messageId) => {
  if (socket.connected) {
    socket.emit('getMessageStatus', { messageId });
  } else {
    console.log('getMessageStatus: Not connected yet');
  }
};

// Event listeners
const onUserTyping = (callback) => {
  socket.off('userTyping');
  socket.on('userTyping', callback);
};

const onUserStopTyping = (callback) => {
  socket.off('userStopTyping');
  socket.on('userStopTyping', callback);
};

const onNewMessage = (callback) => {
  socket.off('newMessage');
  socket.on('newMessage', callback);
};

const onMessageRead = (callback) => {
  socket.off('messagesRead');
  socket.on('messagesRead', (data) => {
    console.log('📩 Received messagesRead event:', data);
    callback(data);
  });
};

const onMessageDelivered = (callback) => {
  socket.off('messagesDelivered');
  socket.on('messagesDelivered', (data) => {
    console.log('📨 Received messagesDelivered event:', data);
    callback(data);
  });
};

const onUserMentioned = (callback) => {
  socket.off('userMentioned');
  socket.on('userMentioned', (data) => {
    console.log('🔔 User mentioned event:', data);
    callback(data);
  });
};

const onMessageStatus = (callback) => {
  socket.off('messageStatus');
  socket.on('messageStatus', (data) => {
    console.log('📊 Message status:', data);
    callback(data);
  });
};

// Get unread mentions
const getUnreadMentions = (userId) => {
  if (socket.connected) {
    console.log('Getting unread mentions for user:', userId);
    socket.emit('getUnreadMentions', { userId });
  } else {
    console.log('getUnreadMentions: Not connected yet');
  }
};

// Mark mention as read
const markMentionAsRead = (userId, messageId) => {
  if (socket.connected) {
    console.log('Marking mention as read:', { userId, messageId });
    socket.emit('markMentionAsRead', { userId, messageId });
  } else {
    console.log('markMentionAsRead: Not connected yet');
  }
};

// Event listeners for mentions
const onUnreadMentions = (callback) => {
  socket.off('unreadMentions');
  socket.on('unreadMentions', (data) => {
    console.log('📋 Received unread mentions:', data);
    callback(data);
  });
};

const onMessageWithMention = (callback) => {
  socket.off('messageWithMention');
  socket.on('messageWithMention', (data) => {
    console.log('🔔 Message with mention received:', data);
    callback(data);
  });
};

const onMentionRead = (callback) => {
  socket.off('mentionRead');
  socket.on('mentionRead', (data) => {
    console.log('📖 Mention read event:', data);
    callback(data);
  });
};
// ✅ UPDATED: New Message Notification Handler
const onNewMessageNotification = (callback) => {
  socket.off('newMessageNotification');
  socket.on('newMessageNotification', (data) => {
    console.log('📱 Received new message notification:', data);
    callback(data);
  });
};
// ✅ NEW: User joined chat (track current active chat)
const userJoinedChat = (userId, chatId) => {
  if (socket.connected) {
    console.log(`👤 User ${userId} joined chat ${chatId}`);
    socket.emit('userJoinedChat', { userId, chatId });
  } else {
    console.error('userJoinedChat: Socket is not connected.');
  }
};

// ✅ NEW: User left chat
const userLeftChat = (userId, chatId) => {
  if (socket.connected) {
    console.log(`👤 User ${userId} left chat ${chatId}`);
    socket.emit('userLeftChat', { userId, chatId });
  } else {
    console.error('userLeftChat: Socket is not connected.');
  }
};

//----- Socket functions for appointment
const bookAppointment = (update) => {
  console.log('BOOK Appointment', update);
  if (socket.connected) {
    socket.emit('appointmentBooked', update);
  } else {
    console.log('Socket Not Connected_____________');
  }
};
const onBookAppointment = (callback) => {
  socket.off('slotHasBooked');
  socket.on('slotHasBooked', (data) => {
    console.log('📨 Received slotHasBooked event:', data);
    callback(data);
  });
};
const onUserVerification = (callback) => {
  socket.off('UserLogOut');
  socket.on('UserLogOut', (data) => {
    console.log('📨 Received UserLogOut event:', data);
    callback(data);
  });
};

const UserVerification = (update) => {
  console.log('check UserVerifcation', update);
  if (socket.connected) {
    socket.emit('UserVerifcation', update);
  } else {
    console.log('Socket Not Connected_____________');
  }
};
const TaskManagement = (update) => {
  console.log('Task Updated', update);
  if (socket.connected) {
    console.log('task update socket emit');
    socket.emit('Tasksave', update);
  } else {
    console.log('Socket Not Connected_____________');
  }
};
const onTaskManagement = (callback) => {
  socket.off('TaskManagement');
  socket.on('TaskManagement', (data) => {
    console.log('📨 Received TaskManagement event:', data);
    callback(data);
  });
};

// Export functions

export default {
  socket,
  connect,
  sendMessage,
  sendTyping,
  stopTyping,
  sendFile,
  onNewMessage,
  onUserTyping,
  onUserStopTyping,
  markAsRead,
  markAsDelivered,
  onMessageDelivered,
  onMessageRead,
  onUserMentioned,
  onMessageStatus,
  getMessageStatus,
  joinChat,
  onNewMessageNotification,
  userJoinedChat,
  userLeftChat,
  getUnreadMentions,
  markMentionAsRead,
  onUnreadMentions,
  onMessageWithMention,
  onMentionRead,
  bookAppointment,
  onBookAppointment,
  TaskManagement,
  onTaskManagement,
  onUserVerification,
  UserVerification,
};
