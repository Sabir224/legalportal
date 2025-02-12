/* eslint-disable import/no-anonymous-default-export */
// services/SocketService.js
import { io } from "socket.io-client";
// const ApiBase = "https://awsrealestate.awschatbot.online";
const ApiBase = "http://localhost:5001";
const socket = io(`${ApiBase}`, {
  transports: ["websocket"], // Force WebSocket connection
  autoConnect: false, // Prevent auto-connecting
});

const connect = (userId) => {
  if (!socket.connected) {
    socket.connect(); // Connect only if not already connected
    socket.emit("joinChat", "some-chat-id", userId); // Join a chat room
  }
};

const sendMessage = (messageData) => {
  if (socket.connected) {
    socket.emit("sendMessage", messageData);
  }
};

const sendTyping = (chatId, userId) => {
  if (socket.connected) {
    socket.emit("typing", chatId, userId);
  }
};

const stopTyping = (chatId, userId) => {
  if (socket.connected) {
    socket.emit("stopTyping", chatId, userId);
  }
};

const sendFile = (fileData) => {
  if (socket.connected) {
    socket.emit("sendFile", fileData);
  }
};

// Event listeners
const onNewMessage = (callback) => {
  socket.on("newMessage", callback);
};

const onUserTyping = (callback) => {
  socket.on("userTyping", callback);
};

const onUserStopTyping = (callback) => {
  socket.on("userStopTyping", callback);
};

export default {
  connect,
  sendMessage,
  sendTyping,
  stopTyping,
  sendFile,
  onNewMessage,
  onUserTyping,
  onUserStopTyping,
};
