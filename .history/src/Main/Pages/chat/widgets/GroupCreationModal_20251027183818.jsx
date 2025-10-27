// GroupCreationModal.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
  Box,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, GroupAdd, PersonAdd, Email } from '@mui/icons-material';
import { ApiEndPoint } from '../../Component/utils/utlis';

const GroupCreationModal = ({ show, onClose, userData, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddEmail = () => {
    const email = emailInput.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (selectedEmails.includes(email)) {
      setError('This email is already added');
      return;
    }

    // Don't allow adding your own email
    if (email === userData?.email || email === userData?.Email) {
      setError('You cannot add yourself to the group');
      return;
    }

    setSelectedEmails([...selectedEmails, email]);
    setEmailInput('');
    setError('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setSelectedEmails(selectedEmails.filter((email) => email !== emailToRemove));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (selectedEmails.length < 1) {
      setError('Please add at least 1 member to create a group');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Include current user's email in the participant list
      const allParticipants = [userData?.email || userData?.Email, ...selectedEmails];

      const response = await axios.post(
        `${ApiEndPoint}chats/group`,
        {
          groupName: groupName.trim(),
          groupDescription: groupDescription.trim(),
          emailList: allParticipants, // Include creator in the participants
          createdBy: userData?.email || userData?.Email,
          groupAvatar: '', // You can add avatar functionality later
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.chat) {
        onGroupCreated(response.data.chat);
        handleClose();
      } else if (response.data.message) {
        // If group already exists, still call onGroupCreated with the existing chat
        if (response.data.chat) {
          onGroupCreated(response.data.chat);
          handleClose();
        } else {
          setError(response.data.message || 'Group creation failed');
        }
      }
    } catch (err) {
      console.error('Error creating group:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to create group. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Reset form
      setGroupName('');
      setGroupDescription('');
      setSelectedEmails([]);
      setEmailInput('');
      setError('');
      onClose();
    }
  };

  // Add current user info display
  const currentUserEmail = userData?.email || userData?.Email;

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          boxShadow: 24,
          minHeight: isMobile ? '100vh' : 'auto',
          m: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'primary.main',
          color: 'white',
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupAdd sx={{ mr: 1 }} />
          <Typography variant="h6">Create New Group</Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{ color: 'white' }}
          size={isMobile ? 'medium' : 'small'}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          pt: 3,
          px: 3,
          pb: 1,
          '&:first-of-type': {
            pt: 3,
          },
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              '& .MuiAlert-message': {
                overflow: 'hidden',
              },
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Current User Info */}
          <Box
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Group Creator
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email color="action" fontSize="small" />
              {currentUserEmail}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You will be the group admin
            </Typography>
          </Box>

          <TextField
            label="Group Name *"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            disabled={loading}
            fullWidth
            required
            error={!groupName.trim()}
            helperText={!groupName.trim() ? 'Group name is required' : ''}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GroupAdd color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 1,
              },
            }}
          />

          <TextField
            label="Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="Enter group description (optional)"
            disabled={loading}
            fullWidth
            multiline
            rows={isMobile ? 2 : 3}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 1,
              },
            }}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Add Members *
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mb: 2,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <TextField
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter member's email address"
                disabled={loading}
                fullWidth
                size="small"
                error={!!error && error.includes('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 1,
                  },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddEmail}
                disabled={loading || !emailInput.trim()}
                startIcon={<PersonAdd />}
                sx={{
                  minWidth: 'auto',
                  width: isMobile ? '100%' : 'auto',
                  height: isMobile ? '40px' : 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                Add
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Press Enter or click Add to include members
            </Typography>
          </Box>

          {selectedEmails.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Selected Members ({selectedEmails.length})
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  maxHeight: isMobile ? 120 : 150,
                  overflow: 'auto',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  backgroundColor: 'grey.50',
                }}
              >
                {selectedEmails.map((email, index) => (
                  <Chip
                    key={index}
                    label={email}
                    onDelete={() => handleRemoveEmail(email)}
                    disabled={loading}
                    color="primary"
                    variant="filled"
                    size={isMobile ? 'medium' : 'small'}
                    sx={{
                      maxWidth: isMobile ? '100%' : 200,
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      },
                    }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Total members: {selectedEmails.length + 1} (including you)
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          p: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1 : 0,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          color="inherit"
          fullWidth={isMobile}
          size={isMobile ? 'large' : 'medium'}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateGroup}
          disabled={loading || selectedEmails.length < 1 || !groupName.trim()}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <GroupAdd />}
          sx={{
            minWidth: 140,
            width: isMobile ? '100%' : 'auto',
          }}
          size={isMobile ? 'large' : 'medium'}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Creating...
            </Box>
          ) : (
            `Create Group (${selectedEmails.length + 1})`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupCreationModal;
