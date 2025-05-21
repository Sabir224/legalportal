import React, { useState, useEffect } from 'react';
import './ViewCaseUpdates.css';

const API_BASE = 'http://localhost:5001/api/';

const ViewCaseUpdates = () => {
  const [caseId, setCaseId] = useState('');
  const [cases, setCases] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [updateText, setUpdateText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  // Sender ID (e.g., lawyer or staff)
  const sentById = '68248dafab42853d725c477a';
  //const sentById = '68121dfbe55d81b4b0dbbde4';


  // Fetch all cases on mount
  useEffect(() => {
    fetch(`${API_BASE}getcase`)
      .then(res => res.json())
      .then(data => {
        const uniqueCases = [...new Set(data.data.map(item => item?.CaseId))];
        setCases(uniqueCases);
        if (uniqueCases.length > 0) {
          setCaseId(uniqueCases[0]);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch updates for selected case
  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`${API_BASE}view-updates/${caseId}`)
      .then(res => res.json())
      .then(data => {
        const updatesArray = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];
        setUpdates(updatesArray);
      })
      .catch(() => setUpdates([]))
      .finally(() => setLoading(false));
  }, [caseId]);

  // Submit new case update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caseId || !updateText.trim()) {
      alert('Please complete all fields');
      return;
    }

    const payload = {
      caseId,
      sentBy: sentById,
      message: updateText.trim(),
    };

    try {
      const res = await fetch(`${API_BASE}send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        // Optional: refetch or push new update manually
        setUpdateText('');
        setMessageSent(true);
        setTimeout(() => setMessageSent(false), 3000);
        // Refresh updates
        const refreshed = await fetch(`${API_BASE}view-updates/${caseId}`);
        const refreshedData = await refreshed.json();
        setUpdates(Array.isArray(refreshedData) ? refreshedData : refreshedData.data || []);
      } else {
        alert(`❌ ${result.message || result.error || 'Submission failed'}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Network error');
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <main className="updates-wrapper">
      <h1 className="page-title">
        <i className="fas fa-folder-open"></i> Case {caseId || '...'} Update
      </h1>

      <section className="updates-container">
        {loading ? (
          <p className="loading-text">Loading updates...</p>
        ) : updates.length === 0 ? (
          <p className="no-updates-text">
            <i className="fas fa-info-circle"></i> No updates found for case ID "{caseId}".
          </p>
        ) : (
          updates.map((update, index) => (
            <article className="update-card" key={index}>
              <div className="update-message">
                <i className="fas fa-comment-dots"></i> {update.message || 'No message available'}
              </div>
              <div className="update-meta">
                <div className="update-timestamp">
                  <i className="fas fa-clock"></i>{' '}
                  {update.date ? formatDateTime(update.date) : 'No date available'}
                </div>
                <div className="update-sender">
                  <i className="fas fa-user"></i>{' '}
                  {update.senderName || 'Unknown Sender'}
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {formVisible ? (
        <section className="update-form-section">
          <div className="form-header">
            <h2><i className="fas fa-pen-nib"></i> Send New Update</h2>
            <button className="toggle-form-btn" onClick={() => setFormVisible(false)}>
              <i className="fas fa-eye-slash"></i> Hide
            </button>
          </div>

          <form onSubmit={handleSubmit} className="update-case-form">
            <div className="form-group">
              <label htmlFor="caseId"><i className="fas fa-briefcase"></i> Case ID:</label>
              <select id="caseId" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
                {cases.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="updateText"><i className="fas fa-comment-dots"></i> Update Message:</label>
              <textarea
                id="updateText"
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                placeholder="Type your update here..."
                rows={4}
                maxLength={100}
              />
              <small>{updateText.length}/100 characters</small>
            </div>

            <button type="submit"><i className="fas fa-paper-plane"></i> Send Update</button>

            {messageSent && (
              <div className="toast-notification">
                <i className="fas fa-check-circle"></i> Update sent successfully!
              </div>
            )}
          </form>
        </section>
      ) : (
        <div className="add-update-toggle" onClick={() => setFormVisible(true)}>
          <i className="fas fa-plus-circle"></i> Add Case Update
        </div>
      )}
    </main>
  );
};

export default ViewCaseUpdates;
