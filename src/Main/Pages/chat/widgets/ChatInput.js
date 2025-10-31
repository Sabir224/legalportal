import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faTimes,
  faCloudUploadAlt,
  faMessage,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import Clip from '../../Component/images/attachment.png';
import Send from '../../Component/images/send.png';
import vmsg from 'vmsg';
import Modal from 'react-modal';
import '../../chat/widgets/chatinputs.css';
import SocketService from '../../../../SocketService';
import { ApiEndPoint } from '../../Component/utils/utlis';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

import { Document, Page } from 'react-pdf';
import axios from 'axios';
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

export default function ChatInput({ selectedChat, user }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [previewCaption, setPreviewCaption] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const docInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef(null);
  const [isClientSessionExpired, setClientSession] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const [message, setMessage] = useState('');
  const [mentions, setMentions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isMessageSending, setMessageSending] = useState(false);
  const [isFileSending, setIsFileSending] = useState(false);

  // file state
  const [previewFile, setPreviewFile] = useState(null);
  const [previewFilePath, setPreviewFilePath] = useState(null);
  const [fileType, setFileType] = useState('');
  const [originalFile, setOriginalFile] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const recorderRef = useRef(
    new vmsg.Recorder({
      wasmURL: 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm',
    })
  );

  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // ✅ UPDATED: Fetch users based on chat type
  useEffect(() => {
    if (!selectedChat || !user?._id) return;

    const fetchUsers = async () => {
      try {
        if (selectedChat.isGroupChat) {
          // For group chats: get only group participants (excluding current user)
          const participants = selectedChat.participants || selectedChat.users || [];
          const filteredParticipants = participants.filter(
            (participant) => participant._id !== user._id && participant.UserName
          );
          setAllUsers(filteredParticipants);
          console.log('👥 Group participants for mentions:', filteredParticipants);
        } else {
          // For private chats: NO users for mentions
          setAllUsers([]);
          console.log('🔒 Private chat - no mention feature');
        }
      } catch (error) {
        console.error('Error processing users:', error);
        setAllUsers([]);
      }
    };

    fetchUsers();
  }, [selectedChat, user?._id]);

  useEffect(() => {
    let typingTimeout;
    if (isTyping) {
      SocketService.sendTyping(selectedChat._id, user._id);
      typingTimeout = setTimeout(() => {
        SocketService.stopTyping(selectedChat._id, user._id);
        setIsTyping(false);
      }, 2000);
    }
    return () => clearTimeout(typingTimeout);
  }, [isTyping, selectedChat?._id, user?._id]);

  // ✅ UPDATED: Handle typing with mention detection (only for group chats)
  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!isTyping) setIsTyping(true);

    // Only show mention suggestions for group chats
    if (selectedChat?.isGroupChat) {
      const mentionMatch = value.match(/@(\w*)$/);
      if (mentionMatch) {
        const search = mentionMatch[1].toLowerCase();
        const filtered = allUsers.filter((u) => u.UserName.toLowerCase().startsWith(search));
        setFilteredUsers(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }

      // Track mentioned users
      const mentionRegex = /@(\w+)/g;
      const matches = [...value.matchAll(mentionRegex)];
      const currentMentions = matches
        .map((m) => {
          const username = m[1];
          const foundUser = allUsers.find((u) => u.UserName === username);
          return foundUser ? { userId: foundUser._id, userName: foundUser.UserName } : null;
        })
        .filter(Boolean);
      setMentions(currentMentions);
    } else {
      // For private chats, clear any mentions and hide suggestions
      setShowSuggestions(false);
      setMentions([]);
    }
  };

  // ✅ UPDATED: Select mention from dropdown (only for group chats)
  const handleSelectMention = (selectedUser) => {
    if (!selectedChat?.isGroupChat) return;

    const textBefore = message.replace(/@\w*$/, '');
    const newText = `${textBefore}@${selectedUser.UserName} `;
    setMessage(newText);
    setShowSuggestions(false);

    if (!mentions.some((m) => m.userId === selectedUser._id)) {
      setMentions((prev) => [...prev, { userId: selectedUser._id, userName: selectedUser.UserName }]);
    }
    inputRef.current.focus();
  };

  // Send message (text or with file)
  const handleSendMessage = async () => {
    if (!message.trim() && !originalFile) return;

    setMessageSending(true);

    // For private chats, don't send mentions
    const messageMentions = selectedChat?.isGroupChat ? mentions : [];

    const messageData = {
      senderId: user._id,
      chatId: selectedChat._id,
      content: message.trim(),
      messageType: originalFile ? 'file' : 'text',
      file: originalFile || null,
      mentions: messageMentions,
    };

    if (originalFile) {
      await handleFileUpload(messageData);
    } else {
      SocketService.sendMessage(messageData);
    }

    SocketService.stopTyping(selectedChat._id, user._id);
    setIsTyping(false);
    setMessage('');
    setOriginalFile(null);
    setPreviewFile(null);
    setMentions([]);
    setMessageSending(false);
  };

  // File handling logic (same as before)
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setPopupMessage('File must be less than 20MB');
      e.target.value = null;
      return;
    }

    const extension = file.name.split('.').pop().toLowerCase();
    setFileType(extension);
    setPreviewFilePath(URL.createObjectURL(file));
    setPreviewFile(file);
    setOriginalFile(file);
    e.target.value = null;
  };

  const handleFileUpload = async (messageData) => {
    try {
      setIsFileSending(true);
      const formData = new FormData();
      formData.append('file', messageData.file);

      const response = await fetch(`${ApiEndPoint}uploadFile`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('File upload failed');

      const { fileUrl } = await response.json();
      SocketService.sendMessage({
        ...messageData,
        file: { name: messageData.file.name, url: fileUrl },
      });
    } catch (err) {
      console.error('Error sending file:', err);
    } finally {
      setIsFileSending(false);
    }
  };

  const handleClosePopup = () => setPopupMessage('');

  return (
    <div className="chat-input p-1 position-relative" style={{ backgroundColor: 'transparent' }}>
      <div className="input-container">
        {/* Clip Button for File Selection */}
        <img src={Clip} height={25} width={25} className="icon" onClick={() => fileInputRef.current.click()} />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleDocUpload}
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.svg"
        />

        <input
          type="text"
          ref={inputRef}
          value={message}
          onChange={(e) => handleTyping(e)}
          placeholder={selectedChat?.isGroupChat ? 'Type a message or mention with @' : 'Type a message'}
          className="text-input"
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />

        {/* Show loading spinner when sending */}
        {isMessageSending || isFileSending ? (
          <FaSpinner
            style={{
              color: '#25D366',
              fontSize: '20px',
              animation: 'spin 1s linear infinite',
            }}
          />
        ) : (
          <img src={Send} height={20} width={20} className="icon" onClick={handleSendMessage} />
        )}
      </div>

      {/* ✅ UPDATED: Mention suggestions (only for group chats) */}
      {selectedChat?.isGroupChat && showSuggestions && filteredUsers.length > 0 && (
        <div
          className="position-absolute bg-white border rounded shadow"
          style={{
            bottom: '50px',
            left: '10px',
            width: '250px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 999,
          }}
        >
          {filteredUsers.map((u) => (
            <div key={u._id} className="p-2" style={{ cursor: 'pointer' }} onClick={() => handleSelectMention(u)}>
              @{u.UserName}
            </div>
          ))}
        </div>
      )}

      {/* File Preview (same as before) */}
      {previewFile && (
        <div
          className="file-preview-container position-absolute p-2 border rounded shadow-sm bg-white"
          style={{
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%',
            maxWidth: '50%',
            zIndex: 1050,
          }}
        >
          <div
            className="border p-2 d-flex justify-content-center align-items-center main-bgcolor"
            style={{
              width: '100%',
              height: '250px',
              maxHeight: '25%',
            }}
          >
            {previewFile.type.startsWith('image/') ? (
              <img
                src={previewFilePath}
                alt="file preview"
                className="img-fluid"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
              />
            ) : fileType === 'pdf' ? (
              <Document file={previewFilePath}>
                <Page pageNumber={1} width={100} />
              </Document>
            ) : (
              <FontAwesomeIcon icon={faFileAlt} size="3x" color="gray" />
            )}
          </div>
          <div className="text-center mt-2 d-flex flex-column align-items-center">
            <p className="mb-1 fw-bold text-truncate text-center" style={{ maxWidth: '150px' }}>
              {previewFile.name}
            </p>
            <p className="text-muted small">{fileType.toUpperCase()} Document</p>
          </div>

          <div className="d-flex justify-content-center gap-2 mt-2">
            <button
              className="btn btn-outline-danger d-flex align-items-center justify-content-center"
              onClick={() => setPreviewFile(null)}
              style={{ width: '35px', height: '35px', borderRadius: '50%' }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <button
              className="btn btn-outline-success upload-btn d-flex align-items-center justify-content-center"
              onClick={handleFileUpload}
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                transition: '0.3s',
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}

      {popupMessage && (
        <Modal
          isOpen={!!popupMessage}
          onRequestClose={handleClosePopup}
          className="popup-modal"
          overlayClassName="popup-modal-overlay"
          ariaHideApp={false}
        >
          <h2>Error Message:</h2>
          <div className="popup">
            <p>{popupMessage}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
