import React, { useState, useEffect } from 'react';
import './ViewCaseUpdates.css';
import { ApiEndPoint } from './Component/utils/utlis';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

const ViewCaseUpdates = ({ token }) => {
  const [updates, setUpdates] = useState([]);
  const [updateText, setUpdateText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [formVisible, setFormVisible] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();
  const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);
  const [caseId, setCaseId] = useState(reduxCaseInfo?._id);
  const sentById = token?._id;

  useEffect(() => {
    if (!caseId) return;
    setLoading(true);
    fetch(`${ApiEndPoint}view-updates/${caseId}`)
      .then(res => res.json())
      .then(data => {
        const updatesArray = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
        setUpdates(updatesArray);
      })
      .catch(() => setUpdates([]))
      .finally(() => setLoading(false));
  }, [caseId]);

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
        setUpdateText('');
        setMessageSent(true);
        setTimeout(() => setMessageSent(false), 3000);
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

  const fetchUserDetails = async (id) => {
    try {
      console.log(id)
      const res = await fetch(`${ApiEndPoint}getLawyerDetailsById/${id}`);
      const data = await res.json();
      console.log("data=",data)
      setSelectedUser(data.user);
      setShowUserModal(true);
    } catch (err) {
      alert('Failed to fetch user details');
    }
  };

  return (
    <div className="card container-fluid p-0 d-flex flex-column" style={{ height: '86vh', maxWidth: '100vw', overflow: 'hidden' }}>
      <div className="bg-white px-4 py-3 border-bottom sticky-top" style={{ zIndex: 10 }}>
        <h1 className="mb-0" style={{ color: '#18273e' }}>{reduxCaseInfo?.CaseNumber}</h1>
      </div>

      <section className="flex-grow-1 overflow-auto px-4 py-3">
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
                <div className="mb-2 fw-semibold" style={{ color: '#18273e' }}>
                  <i className="fas fa-user me-1"></i>
                  <span
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => fetchUserDetails(update.sentBy)}
                  >
                    {update.senderName || 'Unknown Sender'}
                  </span>
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

      <div className="bg-white border-top px-4 py-3" style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
        {formVisible ? (
          <section className="card shadow p-3 mb-0">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h2 className="h6 mb-0">
                <i className="fas fa-pen-nib me-2"></i>Send New Update
              </h2>
              <button className="btn btn-sm" style={{ background: '#18273e', color: 'white' }} onClick={() => setFormVisible(false)}>
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

              <button type="submit" className="btn" style={{ background: '#18273e', color: 'white' }}>
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
          <div className="btn fw-bold w-100" onClick={() => setFormVisible(true)} style={{ cursor: 'pointer', background: '#18273e', color: 'white' }}>
            <i className="fas fa-plus-circle me-2"></i>Add Case Update
          </div>
        )}
      </div>
      {/* User Info Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered size="sm">
        <div
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#001F3F',
          }}
        >
          <Modal.Body
            className="p-3 text-center"
            style={{
              backgroundColor: '#001F3F',
              color: 'white',
            }}
          >
            {selectedUser ? (
              <>
                <div
                  className="mx-auto mb-3"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid white',
                  }}
                >
                  <img
                    src={selectedUser?.ProfilePicture}
                    alt="Profile"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <h5 className="fw-bold mb-2">{selectedUser?.UserName || 'N/A'}</h5>
                <p className="mb-1">
                  <span className="fw-semibold">Email:</span> {selectedUser?.Email || 'N/A'}
                </p>
                <p className="mb-0">
                  <span className="fw-semibold">Role:</span> {selectedUser?.Role || 'N/A'}
                </p>
              </>
            ) : (
              <div className="py-5">
                <div className="spinner-border text-light" role="status"></div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer
            style={{
              backgroundColor: '#001F3F',
              borderTop: 'none',
              justifyContent: 'center',
            }}
          >
            <Button
              style={{
                backgroundColor: '#0e1a2b',
                color: 'white',
                border: '2px solid #c0a262',
                padding: '8px 20px',
                borderRadius: '12px',
                fontWeight: '500',
                fontSize: '15px',
                lineHeight: '1',
                minWidth: '80px',
                textAlign: 'center',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c0a262'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0e1a2b'}
              onClick={() => setShowUserModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>


    </div>
  );
};

export default ViewCaseUpdates;
