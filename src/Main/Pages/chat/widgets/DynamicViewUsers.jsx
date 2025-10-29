import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { Close, Email, Phone, Person, LocationOn, Work, Business, School } from '@mui/icons-material';

// Use the same color scheme
const colorScheme = {
  navy: '#18273e',
  gold: '#b8941f',
  white: '#ffffff',
  background: '#f8f9fa',
  textPrimary: '#2c3e50',
  textSecondary: '#6c757d',
};

const ViewChatUser = ({ isOpen, onClose, selectedChat, user, currentUserId }) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [otherParticipants, setOtherParticipants] = useState([]);

  // Filter out current user and get other participants
  useEffect(() => {
    if (user && currentUserId) {
      const filteredParticipants = user.filter((participant) => String(participant._id) !== String(currentUserId));
      setOtherParticipants(filteredParticipants);

      if (filteredParticipants.length > 0) {
        setSelectedUserId(filteredParticipants[0]._id);
      }
    }
  }, [user, currentUserId]);

  const isGroupChat = selectedChat?.isGroupChat;
  const selectedUser = isGroupChat
    ? otherParticipants.find((u) => u._id === selectedUserId) || otherParticipants[0]
    : otherParticipants[0];

  // Get avatar color function
  const getAvatarColor = (name) => {
    if (!name) return colorScheme.navy;
    const colors = ['#1976d2', '#d32f2f', '#388e3c', '#f57c00', '#7b1fa2', '#0097a7'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Format phone number
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Not provided';
    return phone.startsWith('+') ? phone : `+${phone}`;
  };

  // Handle close function
  const handleClose = () => {
    onClose(false); // Call the onClose function passed from parent
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose} // Use the handleClose function
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: colorScheme.background,
          py: 2,
          px: 3,
          borderBottom: `1px solid #e0e0e0`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" fontWeight="600" color={colorScheme.textPrimary}>
          {isGroupChat ? 'Group Members' : 'Contact Information'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          {' '}
          {/* Use handleClose here too */}
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: colorScheme.background }}>
        {/* User Selection Dropdown for Group Chats */}
        {isGroupChat && otherParticipants.length > 1 && (
          <Box sx={{ p: 3, pb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Member</InputLabel>
              <Select
                value={selectedUserId}
                label="Select Member"
                onChange={(e) => setSelectedUserId(e.target.value)}
                sx={{
                  backgroundColor: colorScheme.white,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: colorScheme.gold,
                  },
                }}
              >
                {otherParticipants.map((participant) => (
                  <MenuItem key={participant._id} value={participant._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: getAvatarColor(participant.UserName),
                          fontSize: '0.8rem',
                        }}
                      >
                        {participant.UserName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Typography variant="body2">{participant.UserName}</Typography>
                      {participant.Role && (
                        <Chip
                          label={participant.Role}
                          size="small"
                          sx={{
                            height: '20px',
                            fontSize: '0.6rem',
                            backgroundColor: colorScheme.navy,
                            color: colorScheme.white,
                          }}
                        />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* User Information */}
        {selectedUser && (
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Profile Header Card */}
              <Card sx={{ backgroundColor: colorScheme.white }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: getAvatarColor(selectedUser.UserName),
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {selectedUser.UserName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" fontWeight="600" color={colorScheme.textPrimary} gutterBottom>
                    {selectedUser.UserName}
                  </Typography>
                  <Typography variant="body1" color={colorScheme.textSecondary} sx={{ mb: 2 }}>
                    {selectedUser.Role}
                  </Typography>
                  {/* <Chip
                    label={selectedUser.isOnline ? 'Online' : 'Offline'}
                    color={selectedUser.isOnline ? 'success' : 'default'}
                    size="small"
                  /> */}
                </CardContent>
              </Card>

              {/* Contact Information Card */}
              <Card sx={{ backgroundColor: colorScheme.white }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" color={colorScheme.textPrimary} sx={{ mb: 2 }}>
                    Contact Information
                  </Typography>

                  <Stack spacing={2}>
                    {/* Email */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Email sx={{ color: colorScheme.gold, fontSize: 24 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color={colorScheme.textSecondary} display="block">
                          Email Address
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="500"
                          color={colorScheme.textPrimary}
                          component="a"
                          href={`mailto:${selectedUser.Email}`}
                          sx={{
                            textDecoration: 'none',
                            color: colorScheme.textPrimary,
                            '&:hover': {
                              color: colorScheme.gold,
                            },
                          }}
                        >
                          {selectedUser.Email}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Phone */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone sx={{ color: colorScheme.gold, fontSize: 24 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color={colorScheme.textSecondary} display="block">
                          Phone Number
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="500"
                          color={colorScheme.textPrimary}
                          component="a"
                          href={`tel:${selectedUser.Phone || selectedUser.Contact}`}
                          sx={{
                            textDecoration: 'none',
                            color: colorScheme.textPrimary,
                            '&:hover': {
                              color: colorScheme.gold,
                            },
                          }}
                        >
                          {formatPhoneNumber(selectedUser.Phone || selectedUser.Contact)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />
                  </Stack>
                </CardContent>
              </Card>

              {/* Professional Information Card */}
              <Card sx={{ backgroundColor: colorScheme.white }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" color={colorScheme.textPrimary} sx={{ mb: 2 }}>
                    Professional Information
                  </Typography>

                  <Stack spacing={2}>
                    {/* Department */}
                    {(selectedUser.Department || selectedUser.clientDetails?.Department) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Business sx={{ color: colorScheme.gold, fontSize: 24 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color={colorScheme.textSecondary} display="block">
                            Department
                          </Typography>
                          <Typography variant="body1" fontWeight="500" color={colorScheme.textPrimary}>
                            {selectedUser.Department || selectedUser.clientDetails?.Department}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Position/Role */}
                    {(selectedUser.Position || selectedUser.clientDetails?.Position) && (
                      <>
                        <Divider />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Work sx={{ color: colorScheme.gold, fontSize: 24 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color={colorScheme.textSecondary} display="block">
                              Position
                            </Typography>
                            <Typography variant="body1" fontWeight="500" color={colorScheme.textPrimary}>
                              {selectedUser.Position || selectedUser.clientDetails?.Position}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}

                    {/* Expertise */}
                    {(selectedUser.Expertise || selectedUser.clientDetails?.Expertise) && (
                      <>
                        <Divider />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <School sx={{ color: colorScheme.gold, fontSize: 24 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color={colorScheme.textSecondary} display="block">
                              Expertise
                            </Typography>
                            <Typography variant="body1" fontWeight="500" color={colorScheme.textPrimary}>
                              {selectedUser.Expertise || selectedUser.clientDetails?.Expertise}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}

                    {/* Address */}
                    {(selectedUser.Address || selectedUser.clientDetails?.Address) && (
                      <>
                        <Divider />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LocationOn sx={{ color: colorScheme.gold, fontSize: 24 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color={colorScheme.textSecondary} display="block">
                              Address
                            </Typography>
                            <Typography variant="body1" fontWeight="500" color={colorScheme.textPrimary}>
                              {selectedUser.Address || selectedUser.clientDetails?.Address}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}

                    {/* Bio */}
                    {(selectedUser.Bio || selectedUser.clientDetails?.Bio) && (
                      <>
                        <Divider />
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                          <Person sx={{ color: colorScheme.gold, fontSize: 24, mt: 0.5 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color={colorScheme.textSecondary} display="block">
                              Bio
                            </Typography>
                            <Typography variant="body2" fontWeight="500" color={colorScheme.textPrimary}>
                              {selectedUser.Bio || selectedUser.clientDetails?.Bio}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        )}

        {/* No participants found */}
        {otherParticipants.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color={colorScheme.textSecondary}>
              No participants found
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewChatUser;
