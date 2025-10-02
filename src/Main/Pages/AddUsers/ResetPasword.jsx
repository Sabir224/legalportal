import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiEndPoint } from '../Component/utils/utlis';

const ResetUserPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setMessage('Passwords do not match.');
    }

    try {
      setLoading(true);
      const res = await axios.post(`${ApiEndPoint}reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error setting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Set Your Password</h2>
        <form onSubmit={handleReset} style={styles.form}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Setting...' : 'Set Password'}
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    color: '#16213e',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    backgroundColor: '#d3b386',
    color: '#fff',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
  },
  message: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#2d3748',
  },
};

export default ResetUserPassword;
