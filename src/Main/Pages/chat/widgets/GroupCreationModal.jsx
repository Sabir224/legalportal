// GroupCreationModal.js
import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Badge,
  Tabs,
  Tab,
  Paper,
  alpha,
} from '@mui/material';
import { Close, GroupAdd, PersonAdd, Email, Search, CheckCircle, Circle, People, Person } from '@mui/icons-material';
import { ApiEndPoint } from '../../Component/utils/utlis';
import { Star } from 'lucide-react';
import { color } from '@mui/system';

// Clean color scheme
export const colorScheme = {
  navy: '#18273e',
  gold: '#b8941f',
  white: '#ffffff',
  background: '#f8f9fa',
  textPrimary: '#2c3e50',
  textSecondary: '#6c757d',
};

const GroupCreationModal = ({ show, onClose, userData, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [error, setError] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Text field styles based on color scheme
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: colorScheme.textSecondary,
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderColor: colorScheme.gold,
      },
      '&.Mui-focused fieldset': {
        borderColor: colorScheme.gold,
        borderWidth: '2px',
      },
      '&.Mui-error fieldset': {
        borderColor: '#d32f2f',
      },
    },
    '& .MuiInputLabel-root': {
      color: colorScheme.textSecondary,
      '&.Mui-focused': {
        color: colorScheme.gold,
      },
      '&.Mui-error': {
        color: '#d32f2f',
      },
    },
    '& .MuiInputBase-input': {
      color: colorScheme.textPrimary,
      '&::placeholder': {
        color: colorScheme.textSecondary,
        opacity: 0.7,
      },
    },
    '& .MuiFormHelperText-root': {
      color: colorScheme.textSecondary,
      '&.Mui-error': {
        color: '#d32f2f',
      },
    },
  };

  // Search field styles
  const searchFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#e0e0e0',
      },
      '&:hover fieldset': {
        borderColor: colorScheme.gold,
      },
      '&.Mui-focused fieldset': {
        borderColor: colorScheme.gold,
        borderWidth: '1px',
      },
    },
    '& .MuiInputBase-input': {
      color: colorScheme.textPrimary,
      '&::placeholder': {
        color: colorScheme.textSecondary,
        opacity: 0.7,
      },
    },
  };

  // Fetch available users when modal opens
  useEffect(() => {
    if (show && userData?.email) {
      fetchAvailableUsers();
    }
  }, [show, userData?.email]);

  const fetchAvailableUsers = async () => {
    try {
      setFetchingUsers(true);
      const response = await axios.get(`${ApiEndPoint}getUsersForChat/${userData?.email}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        const filteredUsers = response.data.filter((user) => user.Email !== (userData?.email || userData?.Email));
        setAvailableUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users list');
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleUserSelect = (user) => {
    const isSelected = selectedUsers.some((selected) => selected.Email === user.Email);

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((selected) => selected.Email !== user.Email));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (selectedUsers.length < 1) {
      setError('Please select at least 1 member to create a group');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const selectedEmails = selectedUsers.map((user) => user.Email);
      const allParticipants = [userData?.email || userData?.Email, ...selectedEmails];

      const response = await axios.post(
        `${ApiEndPoint}chats/group`,
        {
          groupName: groupName.trim(),
          groupDescription: groupDescription.trim(),
          emailList: allParticipants,
          createdBy: userData?.email || userData?.Email,
          groupAvatar: '',
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
      } else if (response.data.message && response.data.chat) {
        onGroupCreated(response.data.chat);
        handleClose();
      } else {
        setError(response.data.message || 'Group creation failed');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create group. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setGroupName('');
      setGroupDescription('');
      setSelectedUsers([]);
      setSearchQuery('');
      setError('');
      onClose();
    }
  };

  // Filter users based on search query
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.UserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.Role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colorScheme.navy,
          color: colorScheme.white,
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupAdd sx={{ mr: 2, fontSize: 24, color: colorScheme.gold }} />
          <Box>
            <Typography variant="h6" fontWeight="600">
              Create Group Chat
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Select members to add to your group
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: colorScheme.white,
          }}
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              m: 2,
              mb: 1,
              borderRadius: 1,
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ p: 2 }}>
          {/* Group Info Section */}
          <Card
            sx={{
              mb: 2,
              borderRadius: 1,
              border: `1px solid #e0e0e0`,
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                {/* Current User Info */}
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 1,
                    border: `1px solid #e0e0e0`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: colorScheme.navy,
                        fontSize: '0.75rem',
                      }}
                    >
                      <Email sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600">
                        {userData?.UserName || 'You'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Group Admin • {currentUserEmail}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <TextField
                  label="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  disabled={loading}
                  fullWidth
                  required
                  error={!groupName.trim()}
                  helperText={!groupName.trim() ? 'Group name is required' : ''}
                  sx={textFieldStyles}
                />

                <TextField
                  label="Description (Optional)"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Group description"
                  disabled={loading}
                  fullWidth
                  multiline
                  rows={2}
                  sx={textFieldStyles}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Member Selection Section */}
          <Card
            sx={{
              borderRadius: 1,
              border: `1px solid #e0e0e0`,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Header with search and selection count */}
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight="600">
                    Select Members
                  </Typography>
                  {selectedUsers.length > 0 && (
                    <Chip
                      label={`${selectedUsers.length} selected`}
                      size="small"
                      sx={{
                        backgroundColor: colorScheme.gold,
                        color: colorScheme.white,
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={searchFieldStyles}
                />
              </Box>

              {/* Users List with scroll and max-height */}
              <Box sx={{ maxHeight: '40vh', overflow: 'auto' }}>
                {fetchingUsers ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : filteredUsers.length === 0 ? (
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <People sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'No users found' : 'No users available'}
                    </Typography>
                  </Box>
                ) : (
                  <List disablePadding>
                    {filteredUsers.map((user) => {
                      const isSelected = selectedUsers.some((selected) => selected.Email === user.Email);

                      return (
                        <ListItem
                          key={user._id}
                          button
                          onClick={() => handleUserSelect(user)}
                          sx={{
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: isSelected ? '#fff8e1' : 'transparent',
                            py: 1.5,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Checkbox
                              edge="start"
                              checked={isSelected}
                              tabIndex={-1}
                              disableRipple
                              icon={<Circle />}
                              checkedIcon={<CheckCircle sx={{ color: colorScheme.gold }} />}
                            />
                          </ListItemIcon>
                          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 2 }}>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              variant="dot"
                              color={user.isOnline ? 'success' : 'default'}
                            >
                              <Avatar
                                src={user.ProfilePicture}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  backgroundColor: colorScheme.navy,
                                }}
                              >
                                {user.UserName?.charAt(0).toUpperCase()}
                              </Avatar>
                            </Badge>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="subtitle2" fontWeight="500">
                                {user.UserName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {user.Email}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {user.Role}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Selection Summary */}
          {selectedUsers.length > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                backgroundColor: '#f8f9fa',
                borderRadius: 1,
                border: `1px solid #e0e0e0`,
              }}
            >
              <Typography variant="body2" fontWeight="500">
                {selectedUsers.length + 1} members will be added to the group (including you)
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{
            minWidth: 100,
            borderColor: 'none',
            color: colorScheme.white,
            backgroundColor: '#d32f2f',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
            '&:disabled': {
              backgroundColor: 'grey.300',
              color: 'grey.500',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateGroup}
          disabled={loading || selectedUsers.length < 1 || !groupName.trim()}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <GroupAdd />}
          sx={{
            minWidth: 140,
            backgroundColor: colorScheme.gold,
            '&:hover': {
              backgroundColor: '#9c7c1a',
            },
            '&:disabled': {
              backgroundColor: 'grey.300',
            },
          }}
        >
          {loading ? 'Creating...' : `Create Group`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupCreationModal;
