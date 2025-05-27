import React, { useState, useEffect } from 'react';
import './ViewCaseUpdates.css';
import { ApiEndPoint } from './Component/utils/utlis';
import { useDispatch, useSelector } from 'react-redux';


const ViewCaseUpdates = ({ token }) => {
  const [cases, setCases] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [updateText, setUpdateText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const dispatch = useDispatch();
  const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);
  const [caseId, setCaseId] = useState(reduxCaseInfo?._id);

  // Sender ID (e.g., lawyer or staff)
  const sentById = token?._id;
  //const sentById = '68121dfbe55d81b4b0dbbde4';


  // Fetch all cases on mount
  useEffect(() => {
    // fetch(`${ApiEndPoint}getcase`)
    //   .then(res => res.json())
    //   .then(data => {
    //     const uniqueCases = [...new Set(data.data.map(item => item?.CaseId))];
    //     setCases(uniqueCases);
    //     if (uniqueCases.length > 0) {
    //       setCaseId(uniqueCases[0]);
    //     }
    //   })
    // .catch(console.error);
  }, []);

  // Fetch updates for selected case
  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`${ApiEndPoint}view-updates/${caseId}`)
      .then(res => res.json())
      .then(data => {
        const updatesArray = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [];
        setUpdates(updatesArray);

        console.log("updatesArray", updatesArray)
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
      const res = await fetch(`${ApiEndPoint}send`, {
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
        const refreshed = await fetch(`${ApiEndPoint}view-updates/${caseId}`);
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
    <div
      className="card container-fluid p-0 d-flex flex-column"
      style={{ height: "86vh", maxWidth: "100vw", overflow: "hidden" }}
    >
      {/* Sticky Header */}
      <div
        className="bg-white px-4 py-3 border-bottom sticky-top"
        style={{ zIndex: 10 }}
      >
        <h1 className="mb-0" style={{ color: "#18273e" }}>
          {/* <i className="fas fa-folder-open me-2"></i> */}
          {reduxCaseInfo?.CaseNumber}
        </h1>
      </div>

      {/* Scrollable Body */}
      <section
        className="flex-grow-1 overflow-auto px-4 py-3"
        style={{ position: "relative" }}
      >
        {loading ? (
          <div className="text-center text-warning fw-bold">Loading updates...</div>
        ) : updates.length === 0 ? (
          <div className="text-center text-warning fw-bold">
            <i className="fas fa-info-circle me-2"></i>No updates found for case ID "{reduxCaseInfo?.CaseNumber}"
          </div>
        ) : (
          updates.map((update, index) => (
            <div className="card mb-3 shadow-sm" key={index}>
              <div className="card-body">
                <div className="mb-2 fw-semibold" style={{ color: "#18273e" }}>
                  <i className="fas fa-user me-1"></i>
                  {update.senderName || 'Unknown Sender'}
                </div>
                <p className="card-text fs-6">
                  <i className="fas fa-comment-dots me-2 text-secondary"></i>
                  {update.message || 'No message available'}
                </p>
                <div className="text-end text-muted small">
                  <i className="fas fa-clock me-1"></i>
                  {update.date ? formatDateTime(update.date) : 'No date available'}
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Sticky Footer */}
      <div
        className="bg-white border-top px-4 py-3"
        style={{ position: "sticky", bottom: 0, zIndex: 10 }}
      >
        {formVisible ? (
          <section className="card shadow p-3 mb-0">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 mb-0">
                <i className="fas fa-pen-nib me-2"></i>Send New Update
              </h2>
              <button className="btn btn-sm" style={{ background: "#18273e", color: "white" }} onClick={() => setFormVisible(false)}>
                <i className="fas fa-eye-slash me-1"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="updateText" className="form-label">
                  <i className="fas fa-comment-dots me-1"></i>Update Message:
                </label>
                <textarea
                  id="updateText"
                  className="form-control"
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  placeholder="Type your update here..."
                  rows={3}
                  maxLength={100}
                />
                <small className="text-muted">{updateText.length}/100 characters</small>
              </div>

              <button type="submit" className="btn" style={{ background: "#18273e", color: "white" }}>
                <i className="fas fa-paper-plane me-1"></i>Send Update
              </button>

              {messageSent && (
                <div className="alert alert-success mt-2 d-flex align-items-center" role="alert">
                  <i className="fas fa-check-circle me-2"></i>Update sent successfully!
                </div>
              )}
            </form>
          </section>
        ) : (
          <div
            className="btn  fw-bold w-100"
            onClick={() => setFormVisible(true)}
            style={{ cursor: 'pointer', background: "#18273e", color: "white" }}
          >
            <i className="fas fa-plus-circle me-2"></i>Add Case Update
          </div>
        )}
      </div>
    </div>


  );
};

export default ViewCaseUpdates;
