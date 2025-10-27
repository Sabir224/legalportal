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

    if (selectedEmails.length < 2) {
      setError('Please add at least 2 members to create a group');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${ApiEndPoint}chats/group`, {
        groupName: groupName.trim(),
        groupDescription: groupDescription.trim(),
        emailList: selectedEmails,
        createdBy: userData?.email || userData?.Email,
      });

      if (response.data.chat) {
        onGroupCreated(response.data.chat);
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create group');
      console.error('Error creating group:', err);
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
    // Reset form
    setGroupName('');
    setGroupDescription('');
    setSelectedEmails([]);
    setEmailInput('');
    setError('');
    onClose();
  };

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
          >
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            disabled={loading}
            fullWidth
            required
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
                placeholder="Enter email address"
                disabled={loading}
                fullWidth
                size="small"
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
                    variant="outlined"
                    deleteIcon={<Close />}
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
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateGroup}
          disabled={loading || selectedEmails.length < 2 || !groupName.trim()}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <GroupAdd />}
          sx={{
            minWidth: 120,
            width: isMobile ? '100%' : 'auto',
          }}
          size={isMobile ? 'large' : 'medium'}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupCreationModal;
