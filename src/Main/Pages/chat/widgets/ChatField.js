import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import UserListWidget from './UserListWidget';
import ChatHeader from './ChatHeader';
import LeftChatTextWidget from '../LeftChatTextWidget';
import chatstyle from '../Chat.module.css';
import '../../../../style/mentionUsers.css';
import RightChatTextWidget from '../RightChatTextWidget';
import axios from 'axios';
import './chatField.css';
import { UserContext } from './userContext';
import mondayLogo from '../../Component/images/monLogo.png';
import botImage from '../../Component/assets/icons/bot.png';
import { SiGooglemessages } from 'react-icons/si';
import ChatInput from './ChatInput';
import DynamicImage from './dynamicImage';
import DynamicDocument from './dynamicDocuments';
import DynamicAudio from './dynamicAudio';
import { useMediaQuery } from 'react-responsive';
import DropdownSheet from './DropdownSheet';
import ReplyInput from './ReplyChatInput';
import { format, parseISO } from 'date-fns';
import '../../../../style/divider.css';
import { ApiEndPoint, base64ToUrl, formatMessageDate, mondayLogoImage } from '../../Component/utils/utlis';
import SocketService from '../../../../SocketService';
import { FaArrowDown } from 'react-icons/fa';

// MUI Components
import { Snackbar, Alert, Chip, Avatar, Badge, IconButton, Tooltip } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  MarkChatRead as MarkChatReadIcon,
} from '@mui/icons-material';

export default function ChatField({ selectedChat, user, setSelectedChat }) {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const displayedDates = new Set();
  const [visibleDate, setVisibleDate] = useState(null);
  const chatContainerRef = useRef(null);
  const [isNewMessage, setNewMessage] = useState(false);
  const [unreadMentions, setUnreadMentions] = useState([]);

  // MUI Notification States
  const [mentionNotification, setMentionNotification] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const notificationOpen = Boolean(notificationAnchor);

  // ✅ Function to check if the scroll is at the bottom
  const isScrollAtBottom = useCallback(() => {
    if (!chatContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return scrollTop + clientHeight >= scrollHeight - 10;
  }, []);

  // ✅ Function to scroll to the bottom
  const scrollToBottom = useCallback((smooth = true) => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    });
    setNewMessage(false);
  }, []);

  // ✅ Function to update message status in state
  const updateMessageStatus = useCallback((messageId, updates) => {
    setMessages((prev) => prev.map((msg) => (msg._id === messageId ? { ...msg, ...updates } : msg)));
  }, []);

  // ✅ Fetch unread mentions when user connects
  useEffect(() => {
    if (user?._id) {
      SocketService.getUnreadMentions(user._id);
    }
  }, [user?._id]);

  // ✅ MUI Notification Handlers
  const showMentionNotification = useCallback((data) => {
    setMentionNotification(data);
    setSnackbarOpen(true);

    // Auto-hide notification after 6 seconds
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 6000);
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNavigateToMention = (mention) => {
    if (mention.chat?._id) {
      // You can implement navigation logic here
      console.log('Navigate to chat:', mention.chat._id);
      // setSelectedChat(mention.chat); // Uncomment if you want to auto-navigate
    }
    handleNotificationClose();
  };

  const handleMarkAllMentionsAsRead = () => {
    unreadMentions.forEach((mention) => {
      handleMarkMentionAsRead(mention._id);
    });
    handleNotificationClose();
  };

  // ✅ Socket Event Listeners
  useEffect(() => {
    // Listen for mention notifications
    SocketService.onUserMentioned((data) => {
      console.log('🔔 You were mentioned in a message:', data);
      showMentionNotification(data);
    });

    // Listen for messages with mentions
    SocketService.onMessageWithMention((data) => {
      console.log('💬 Message with mention received:', data);
      if (data.message && data.chatId === selectedChat?._id) {
        highlightMentionedMessage(data.message._id);
      }
    });

    // Listen for unread mentions
    SocketService.onUnreadMentions((data) => {
      console.log('📋 Unread mentions received:', data);
      setUnreadMentions(data.mentions || []);
    });

    // Listen for mention read events
    SocketService.onMentionRead((data) => {
      console.log('📖 Mention read event:', data);
      if (data.messageId) {
        setMessages((prev) => prev.map((msg) => (msg._id === data.messageId ? { ...msg, readBy: data.readBy } : msg)));
      }
    });

    return () => {
      SocketService.socket.off('userMentioned');
      SocketService.socket.off('messageWithMention');
      SocketService.socket.off('unreadMentions');
      SocketService.socket.off('mentionRead');
    };
  }, [selectedChat, showMentionNotification]);

  // ✅ Function to highlight mentioned message
  const highlightMentionedMessage = (messageId) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.classList.add('mentioned-highlight');
      setTimeout(() => {
        messageElement.classList.remove('mentioned-highlight');
      }, 3000);
    }
  };

  // ✅ Function to mark mention as read
  const handleMarkMentionAsRead = useCallback(
    (messageId) => {
      if (user?._id && messageId) {
        SocketService.markMentionAsRead(user._id, messageId);
        setUnreadMentions((prev) => prev.filter((mention) => mention._id !== messageId));
      }
    },
    [user?._id]
  );

  // ✅ Auto-mark mentions as read when viewed in chat
  useEffect(() => {
    if (selectedChat && messages.length > 0) {
      const unreadMentionsInChat = unreadMentions.filter((mention) => mention.chat?._id === selectedChat._id);
      unreadMentionsInChat.forEach((mention) => {
        handleMarkMentionAsRead(mention._id);
      });
    }
  }, [selectedChat, messages, unreadMentions, handleMarkMentionAsRead]);

  // ✅ Enhanced message rendering with mention highlighting
  const renderMessageWithMentions = (content, mentions = []) => {
    if (!content || !mentions.length) return content;

    let processedContent = content;
    mentions.forEach((mention) => {
      const mentionPattern = new RegExp(`@${mention.userName}`, 'g');
      processedContent = processedContent.replace(
        mentionPattern,
        `<span class="mention-text" data-user-id="${mention.userId}">@${mention.userName}</span>`
      );
    });

    return <span dangerouslySetInnerHTML={{ __html: processedContent }} />;
  };

  // Function to mark ALL messages as read when user views the chat
  const markMessagesAsRead = useCallback(() => {
    if (selectedChat && user) {
      SocketService.markAsRead(selectedChat._id, user._id, null);
    }
  }, [selectedChat, user]);

  // Function to mark ALL messages as delivered when user receives them
  const markMessagesAsDelivered = useCallback(() => {
    if (selectedChat && user) {
      SocketService.markAsDelivered(selectedChat._id, user._id, null);
    }
  }, [selectedChat, user]);

  // But only call these on initial load or when scrolling to bottom
  useEffect(() => {
    if (selectedChat) {
      markMessagesAsDelivered();
      markMessagesAsRead();
    }
  }, [selectedChat, markMessagesAsDelivered, markMessagesAsRead]);

  // Scroll handling
  useEffect(() => {
    let scrollTimeout;
    const chatContainer = chatContainerRef.current;

    const handleScroll = () => {
      if (!chatContainer) return;

      const isAtBottom = isScrollAtBottom();
      if (isAtBottom) {
        setNewMessage(false);
        setVisibleDate(null);
        return;
      }

      const messageDivs = chatContainer.querySelectorAll('.message-item');
      let topDate = null;

      for (let div of messageDivs) {
        const rect = div.getBoundingClientRect();
        const containerRect = chatContainer.getBoundingClientRect();

        if (rect.top >= containerRect.top + 10) {
          topDate = div.getAttribute('data-date');
          break;
        }
      }

      setVisibleDate(topDate);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setVisibleDate(null);
      }, 2000);
    };

    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, [messages, lastScrollTop, isScrollAtBottom]);

  // Main chat initialization
  useEffect(() => {
    if (!selectedChat) return;

    const chatId = selectedChat._id;
    let isSubscribed = true;

    async function initializeChat() {
      console.log(`🔗 Joining chat: ${chatId}`);
      await SocketService.joinChat(chatId, user?._id);
      if (isSubscribed) {
        fetchMessages();
        subscribeToEvents();
      }
    }

    async function fetchMessages() {
      setLoading(true);
      try {
        console.log('📥 Fetching Messages...');
        const { data } = await axios.get(`${ApiEndPoint}chats/${chatId}/messages`);

        if (isSubscribed) {
          const enhancedMessages = data.map((msg) => ({
            ...msg,
            deliveredTo: msg.deliveredTo || [],
            readBy: msg.readBy || [],
            mentions: msg.mentions || [],
          }));

          setMessages(enhancedMessages);
          setLoading(false);

          SocketService.markAsRead(chatId, user?._id);
          setTimeout(() => scrollToBottom(false), 100);
          setIsAtBottom(true);
          setNewMessage(false);
        }
      } catch (error) {
        console.error('❌ Error fetching messages:', error);
        if (isSubscribed) setLoading(false);
      }
    }

    function subscribeToEvents() {
      const handleNewMessage = (newMessage) => {
        if (!newMessage || newMessage.chat !== chatId || !isSubscribed) return;

        const atBottom = isScrollAtBottom();
        setIsAtBottom(atBottom);

        const enhancedMessage = {
          ...newMessage,
          deliveredTo: newMessage.deliveredTo || [],
          readBy: newMessage.readBy || [],
          mentions: newMessage.mentions || [],
        };

        if (newMessage?.sender?._id !== user?._id) {
          SocketService.markAsDelivered(chatId, user?._id, newMessage._id);
          SocketService.markAsRead(chatId, user?._id, newMessage._id);
          setNewMessage(true);
        }

        setMessages((prevMessages) => {
          const isDuplicate = prevMessages.some((msg) => msg?._id === newMessage?._id);
          return isDuplicate ? prevMessages : [...prevMessages, enhancedMessage];
        });

        if (atBottom || newMessage.sender?._id === user?._id) {
          setTimeout(() => scrollToBottom(true), 100);
        }
      };

      const handleUserTyping = ({ chatId: receivedChatId, userId: typingUserId }) => {
        if (receivedChatId === chatId && typingUserId !== user?._id && isSubscribed) {
          const typingUser = selectedChat?.participants?.find((u) => u._id === typingUserId);
          if (typingUser) {
            setTypingUsers((prev) => {
              if (!prev.some((u) => u._id === typingUser._id)) {
                return [...prev, typingUser];
              }
              return prev;
            });
          }
        }
      };

      const handleUserStopTyping = ({ chatId: receivedChatId, userId: typingUserId }) => {
        if (receivedChatId === chatId && typingUserId !== user?._id && isSubscribed) {
          setTypingUsers((prev) => prev.filter((u) => u._id !== typingUserId));
        }
      };

      const handleMessagesRead = ({ chatId: receivedChatId, userId, messageId, readCount }) => {
        if (receivedChatId === chatId && isSubscribed) {
          console.log('📖 Messages read event received:', { messageId, userId, readCount });

          if (messageId) {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg._id === messageId && !msg.readBy?.includes(userId)) {
                  const newReadBy = [...(msg.readBy || []), userId];
                  const totalParticipants = selectedChat?.participants?.length || 0;
                  const isFullyRead = newReadBy.length === totalParticipants;

                  return {
                    ...msg,
                    readBy: newReadBy,
                    status: isFullyRead ? 'read' : msg.status,
                  };
                }
                return msg;
              })
            );
          } else {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.sender?._id !== user?._id && !msg.readBy?.includes(userId)) {
                  const newReadBy = [...(msg.readBy || []), userId];
                  const totalParticipants = selectedChat?.participants?.length || 0;
                  const isFullyRead = newReadBy.length === totalParticipants;

                  return {
                    ...msg,
                    readBy: newReadBy,
                    status: isFullyRead ? 'read' : msg.status,
                  };
                }
                return msg;
              })
            );
          }
        }
      };

      const handleMessagesDelivered = ({ chatId: receivedChatId, userId, messageId, deliveredCount }) => {
        if (receivedChatId === chatId && isSubscribed) {
          console.log('📨 Messages delivered event received:', { messageId, userId, deliveredCount });

          if (messageId) {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg._id === messageId && !msg.deliveredTo?.includes(userId)) {
                  const newDeliveredTo = [...(msg.deliveredTo || []), userId];
                  const totalParticipants = selectedChat?.participants?.length || 0;
                  const isFullyDelivered = newDeliveredTo.length === totalParticipants;

                  return {
                    ...msg,
                    deliveredTo: newDeliveredTo,
                    status: isFullyDelivered ? 'delivered' : msg.status,
                  };
                }
                return msg;
              })
            );
          } else {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.sender?._id !== user?._id && !msg.deliveredTo?.includes(userId)) {
                  const newDeliveredTo = [...(msg.deliveredTo || []), userId];
                  const totalParticipants = selectedChat?.participants?.length || 0;
                  const isFullyDelivered = newDeliveredTo.length === totalParticipants;

                  return {
                    ...msg,
                    deliveredTo: newDeliveredTo,
                    status: isFullyDelivered ? 'delivered' : msg.status,
                  };
                }
                return msg;
              })
            );
          }
        }
      };

      // Remove previous listeners
      SocketService.socket.off('userTyping', handleUserTyping);
      SocketService.socket.off('userStopTyping', handleUserStopTyping);
      SocketService.socket.off('newMessage', handleNewMessage);
      SocketService.socket.off('messagesRead', handleMessagesRead);
      SocketService.socket.off('messagesDelivered', handleMessagesDelivered);

      // Add new event listeners
      SocketService.onUserTyping(handleUserTyping);
      SocketService.onUserStopTyping(handleUserStopTyping);
      SocketService.onNewMessage(handleNewMessage);
      SocketService.onMessageRead(handleMessagesRead);
      SocketService.onMessageDelivered(handleMessagesDelivered);

      return () => {
        SocketService.socket.off('userTyping', handleUserTyping);
        SocketService.socket.off('userStopTyping', handleUserStopTyping);
        SocketService.socket.off('newMessage', handleNewMessage);
        SocketService.socket.off('messagesRead', handleMessagesRead);
        SocketService.socket.off('messagesDelivered', handleMessagesDelivered);
      };
    }

    initializeChat();

    return () => {
      isSubscribed = false;
      SocketService.socket.off('userTyping');
      SocketService.socket.off('userStopTyping');
      SocketService.socket.off('newMessage');
      SocketService.socket.off('messagesRead');
      SocketService.socket.off('messagesDelivered');
    };
  }, [selectedChat, user?._id, isScrollAtBottom, scrollToBottom, updateMessageStatus]);

  const handleScrollToBottom = () => {
    scrollToBottom(true);
    markMessagesAsRead();
  };

  return (
    <>
      {selectedChat ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            maxHeight: '100vh',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            gap: '3px',
          }}
        >
          {/* MUI Mention Notification Snackbar */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="info"
              variant="filled"
              sx={{ width: '100%' }}
              icon={<NotificationsIcon />}
            >
              <strong>You were mentioned!</strong>
              <br />
              {mentionNotification?.mentionedByUserName} mentioned you in {mentionNotification?.chatName}
            </Alert>
          </Snackbar>

          <div
            className="d-block"
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 1001,
              background: '#fff',
              width: '100%',
            }}
          >
            <div className="d-flex align-items-center justify-content-between px-3">
              <div className="row container-fluid d-flex flex-grow-1">
                <ChatHeader
                  isUserTyping={typingUsers}
                  selectedChat={selectedChat}
                  user={user}
                  setSelectedChat={setSelectedChat}
                />
              </div>

              {/* Mentions Badge */}
              {unreadMentions.length > 0 && (
                <Tooltip title="Unread Mentions">
                  <IconButton onClick={handleNotificationClick} color="primary" sx={{ position: 'relative' }}>
                    <Badge badgeContent={unreadMentions.length} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Mentions Popover */}
          {notificationOpen && (
            <div
              style={{
                position: 'absolute',
                top: '60px',
                right: '20px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '16px',
                minWidth: '300px',
                maxWidth: '400px',
                maxHeight: '400px',
                overflow: 'auto',
                zIndex: 9999,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 style={{ margin: 0 }}>Unread Mentions ({unreadMentions.length})</h6>
                <div>
                  <Tooltip title="Mark all as read">
                    <IconButton size="small" onClick={handleMarkAllMentionsAsRead}>
                      <MarkChatReadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={handleNotificationClose}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>

              {unreadMentions.map((mention) => (
                <div
                  key={mention._id}
                  style={{
                    padding: '8px',
                    margin: '4px 0',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleNavigateToMention(mention)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                >
                  <div className="d-flex align-items-center">
                    <Avatar src={mention.sender?.ProfilePicture} sx={{ width: 32, height: 32, mr: 1 }}>
                      {mention.sender?.UserName?.charAt(0)}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <strong>{mention.sender?.UserName}</strong>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>{mention.content?.substring(0, 100)}...</div>
                      <Chip
                        label={mention.chat?.chatName || 'Direct Message'}
                        size="small"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className="chat-messages m-0 flex-grow-1 border overflow-hidden-auto px-2 position-relative d-flex flex-column justify-content-end"
            style={{
              height: '100%',
              maxHeight: '100%',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            {visibleDate && (
              <div className="sticky-date main-bgcolor">
                <span>{visibleDate}</span>
              </div>
            )}

            <div
              ref={chatContainerRef}
              className="d-flex flex-column p-0 m-0"
              style={{ overflowY: 'auto', flexGrow: 1, position: 'relative' }}
            >
              {loading ? (
                <div className={`${chatstyle['loading-indicator']}`}>
                  <div className={`${chatstyle['spinner']}`}></div>
                </div>
              ) : (
                messages.map((message) => {
                  const isMentioned = message.mentions?.some((mention) => mention.userId === user?._id);
                  const isUnreadMention = isMentioned && !message.readBy?.includes(user?._id);
                  const formattedDate = formatMessageDate(message.createdAt);
                  const messageDate = format(parseISO(message.createdAt), 'yyyy-MM-dd');
                  const showDateDivider = !displayedDates.has(messageDate);
                  if (showDateDivider) displayedDates.add(messageDate);

                  const userId = String(user._id);
                  const isClient = user?.Role === 'client';
                  const isSenderClient = message.sender?.Role === 'client';
                  const isOwnMessage = String(message.sender?._id) === userId;

                  return (
                    <React.Fragment key={message?._id}>
                      {showDateDivider && (
                        <div className="date-divider">
                          <span className="main-bgcolor">{formattedDate}</span>
                        </div>
                      )}

                      <div
                        className={`message-item ${isMentioned ? 'mentioned-message' : ''} ${
                          isUnreadMention ? 'unread-mention' : ''
                        }`}
                        data-message-id={message._id}
                        data-date={formattedDate}
                      >
                        {message.messageType === 'file' ? (
                          <DynamicDocument message={message} user={user} />
                        ) : message.content ? (
                          isOwnMessage ? (
                            <RightChatTextWidget
                              key={message._id}
                              message={message}
                              selectedChat={selectedChat}
                              user={user}
                              isMentioned={isMentioned}
                              renderContent={() => renderMessageWithMentions(message.content, message.mentions)}
                            />
                          ) : isClient || isSenderClient ? (
                            <LeftChatTextWidget
                              key={message._id}
                              message={message}
                              selectedChat={selectedChat}
                              user={user}
                              isMentioned={isMentioned}
                              isUnreadMention={isUnreadMention}
                              onMarkAsRead={() => handleMarkMentionAsRead(message._id)}
                              renderContent={() => renderMessageWithMentions(message.content, message.mentions)}
                            />
                          ) : (
                            <RightChatTextWidget
                              key={message._id}
                              message={message}
                              selectedChat={selectedChat}
                              user={user}
                              isMentioned={isMentioned}
                              renderContent={() => renderMessageWithMentions(message.content, message.mentions)}
                            />
                          )
                        ) : null}
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            <div
              className="typing-indicator d-flex align-items-center"
              style={{
                position: 'absolute',
                bottom: '-3px',
                left: '10px',
                background: 'white',
                borderRadius: '10px',
                zIndex: 10,
                minHeight: '20px',
                padding: '5px 10px',
                visibility: typingUsers.length > 0 ? 'visible' : 'hidden',
              }}
            >
              {typingUsers.length > 0 && (
                <span style={{ fontSize: '12px', marginRight: '8px', color: '#555' }}>
                  {typingUsers.map((u) => u.UserName.split(' ')[0]).join(', ')} {typingUsers.length > 1 ? 'are' : 'is'}{' '}
                  typing
                </span>
              )}
              <span className="dot" style={{ width: '4px', height: '4px' }}></span>
              <span className="dot" style={{ width: '4px', height: '4px' }}></span>
              <span className="dot" style={{ width: '4px', height: '4px' }}></span>
            </div>
          </div>

          {isNewMessage && (
            <div
              className="main-second-bgcolor position-fixed d-flex flex-column align-items-center justify-content-center"
              style={{
                bottom: '15%',
                right: '50px',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              }}
              onClick={handleScrollToBottom}
            >
              <FaArrowDown color="white" size={20} />
            </div>
          )}

          <div className="w-100">
            <ChatInput selectedChat={selectedChat} user={user} />
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center text-center">
          <SiGooglemessages size={50} color="#888" />
          <h4>Conversation Detail</h4>
          <p>Select a contact to view the conversation</p>
        </div>
      )}
    </>
  );
}
