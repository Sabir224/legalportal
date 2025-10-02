import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ApiEndPoint } from '../Component/utils/utlis';
import { Close } from '@mui/icons-material';
import { CircleCheck } from 'lucide-react';

const AdminApprovalPage = () => {
  const { token } = useParams();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | pending | done | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${ApiEndPoint}users/approval/${token}`);
        console.log('response:', res.data);

        setUser(res.data.user);

        // 🔹 Decide status based on approval state
        if (res.data.user.isApproved === true) {
          setStatus('done');
          setMessage('✅ This user has already been approved.');
        } else {
          setStatus('pending');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Invalid or expired link.');
      }
    };
    fetchUser();
  }, [token]);

  const handleAction = async (action) => {
    try {
      const res = await axios.post(`${ApiEndPoint}users/approval/${token}/action`, { action });
      console.log('response:', res.data);
      setStatus('done');
      setMessage(res.data.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Action failed.');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f4f7fa',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        {status === 'loading' && <p>Loading user details...</p>}

        {status === 'pending' && user && (
          <>
            <h2 style={{ color: '#18273e' }}>Approve User</h2>
            <p>
              New user <b>{user.UserName}</b> ({user.Role}) with email <b>{user.Email}</b> is requesting access.
            </p>
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => handleAction('approve')}
                style={{
                  backgroundColor: '#18273e',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  marginRight: '10px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <CircleCheck color="green" /> Approve
              </button>
              <button
                onClick={() => handleAction('reject')}
                style={{
                  backgroundColor: 'red',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Close /> Reject
              </button>
            </div>
          </>
        )}

        {(status === 'done' || status === 'error') && (
          <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>
        )}
      </div>
    </div>
  );
};
export default AdminApprovalPage;
