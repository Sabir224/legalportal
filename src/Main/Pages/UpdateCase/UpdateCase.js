import React, { useState, useEffect } from 'react';
import './UpdateCase.css';
import { ApiEndPoint } from '../Component/utils/utlis';

const UpdateCase = () => {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [updateText, setUpdateText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  //const sentById = localStorage.getItem('userId'); // Logged-in user ID
 const sentById = '6819a8f73e84e5d52f60492b';
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('[Init] Loaded token:', token);
    console.log('[Init] Loaded userId:', sentById);

    fetch(`${ApiEndPoint}getcase`)
      .then((res) => res.json())
      .then((data) => {
        console.log('[Fetch Cases] Raw data:', data);
        const caseList = [...new Set(data.data.map(item => item?.CaseId))];
        setCases(caseList);
        console.log('[Fetch Cases] Extracted Case IDs:', caseList);
      })
      .catch((err) => console.error('[Fetch Cases] Error:', err));
  }, [sentById]);

  useEffect(() => {
    if (selectedCaseId) {
      console.log('[Fetch Users] Selected Case ID:', selectedCaseId);

      // ❗TODO: Replace hardcoded ID with dynamic one if available
      fetch(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/6813209a19486ab461ad4a59`)
        .then((res) => res.json())
        .then((data) => {
          console.log('[Fetch Users] Raw response:', data);
          const combinedUsers = [...(data.AssignedUsers || []), ...(data.Client || [])];
          console.log('[Fetch Users] Combined Users:', combinedUsers);
          setAvailableUsers(combinedUsers);
        })
        .catch((err) => console.error('[Fetch Users] Error:', err));
    }
  }, [selectedCaseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('[Form Submission] Values:', {
      selectedUser,
      selectedCaseId,
      trimmedMessage: updateText.trim(),
      sentById,
    });

    if (selectedCaseId && selectedUser && updateText.trim() && sentById) {
      try {
        const payload = {
          caseId: selectedCaseId,
         // receivedBy: selectedUser,
         receivedBy:'6613209a19486ab461ad4a59',
          sentBy: sentById,
          message: updateText,
        };

        console.log('[Form Submission] Sending payload:', payload);

        const res = await fetch(`${ApiEndPoint}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log('[Form Submission] Response:', result);

        if (res.ok) {
          setMessageSent(true);
          setUpdateText('');
          setTimeout(() => setMessageSent(false), 3000);
        } else {
          alert(`❌ Error: ${result.error || result.message}`);
        }
      } catch (err) {
        console.error('[Form Submission] Network Error:', err);
        alert('❌ Network error while sending update.');
      }
    } else {
      alert('Please complete all fields before sending.');
    }
  };

   return (
    <div className="update-case-container">
      <form onSubmit={handleSubmit} className="update-case-form">
        <h2 className="form-title">Send Case Update</h2>

        <div className="form-group">
          <label htmlFor="caseId">Case ID:</label>
          <select
            id="caseId"
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
          >
            <option value="">Select Case ID</option>
            {cases.map((caseId) => (
              <option key={caseId} value={caseId}>{caseId}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="recipient">Recipient:</label>
          <select
            id="recipient"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            disabled={!selectedCaseId}
          >
            <option value="">Select User</option>
            {availableUsers.map(user => (
              <option key={user._id} value={user._id}>{user.UserName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="updateText">Update Message:</label>
          <textarea
            id="updateText"
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Type your update here..."
            rows={5}
            maxLength={100}
          />
          <small>{updateText.length}/100 characters</small>
        </div>

        <div className="update-button-wrapper">
          <button type="submit">Send Update</button>
        </div>

        {messageSent && (
          <div className="toast-notification">✅ Update sent successfully!</div>
        )}
      </form>
    </div>
  );
};

export default UpdateCase;