import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  Typography,
  Grid,
  Container,
  Alert,
  Divider,
  Chip,
  InputAdornment,
  Fade,
  Popper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// Color constants for the theme
const COLORS = {
  navy: {
    main: '#1a237e',
    light: '#534bae',
    dark: '#000051',
  },
  gold: {
    main: '#b4a269',
    light: '#e6d4a3',
    dark: '#847339',
  },
  background: {
    light: '#f8f9fa',
    white: '#ffffff',
  },
};

// Custom Dropdown Component
const CustomDropdown = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  error,
  icon: Icon,
  anchorRef,
  isOpen,
  onToggle,
  dropdownKey,
}) => {
  const getDisplayValue = () => {
    if (!value) return '';
    return typeof options[value] === 'object' ? options[value].label : options[value];
  };

  const handleOptionSelect = (optionValue) => {
    onChange(optionValue);
    onToggle(null);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <TextField
        fullWidth
        label={label}
        value={getDisplayValue()}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(dropdownKey);
        }}
        placeholder={placeholder}
        error={!!error}
        helperText={error}
        InputProps={{
          readOnly: true,
          startAdornment: Icon && (
            <InputAdornment position="start">
              <Icon size={20} color={COLORS.navy.main} />
            </InputAdornment>
          ),
          endAdornment: (
            <ChevronDown
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              style={{ color: COLORS.navy.main, cursor: 'pointer' }}
              size={20}
            />
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            cursor: 'pointer',
            backgroundColor: 'white',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: COLORS.navy.main,
            },
          },
        }}
      />

      <Popper
        open={isOpen}
        anchorEl={anchorRef?.current}
        placement="bottom-start"
        style={{
          zIndex: 1300,
          width: anchorRef?.current ? anchorRef.current.offsetWidth : 'auto',
        }}
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
        ]}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              sx={{
                width: '100%',
                maxHeight: 200,
                overflow: 'auto',
                border: `1px solid ${COLORS.gold.main}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: 1,
                mt: 0.5,
              }}
            >
              {Object.entries(options).map(([optionValue, optionData]) => {
                const label = typeof optionData === 'object' ? optionData.label : optionData;
                const color = typeof optionData === 'object' ? optionData.color : 'default';

                return (
                  <Box
                    key={optionValue}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionSelect(optionValue);
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      cursor: 'pointer',
                      backgroundColor: optionValue === value ? alpha(COLORS.navy.main, 0.08) : 'background.paper',
                      '&:hover': {
                        backgroundColor: alpha(COLORS.navy.main, 0.12),
                      },
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {typeof optionData === 'object' ? (
                      <Chip
                        label={label}
                        size="small"
                        color={color}
                        variant={optionValue === value ? 'filled' : 'outlined'}
                        sx={{ minWidth: 80 }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.primary">
                        {label}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};
const actionItemOptions = {
  prepare_contract: 'Prepare Contract',
  review_document: 'Review Document',
  client_meeting: 'Client Meeting',
  court_hearing: 'Court Hearing',
  filing: 'Filing',
  follow_up: 'Follow Up',
  payment_collection: 'Payment Collection',
  consultation: 'Client Consultation',
  draft_agreement: 'Draft Agreement',
  legal_research: 'Legal Research',
};
// Action Items Dropdown Component
const ActionItemsDropdown = ({
  value,
  onChange,
  error,
  anchorRef,
  isOpen,
  onToggle,
  dropdownKey,
  onAddCustomAction,
}) => {
  const actionOptions = {
    prepare_contract: { label: 'Prepare Contract', icon: FileText, status: 'pending' },
    review_documents: { label: 'Review Documents', icon: FileText, status: 'pending' },
    client_meeting: { label: 'Schedule Client Meeting', icon: Calendar, status: 'pending' },
    payment_followup: { label: 'Payment Follow-up', icon: DollarSign, status: 'pending' },
    legal_research: { label: 'Legal Research', icon: FileText, status: 'pending' },
    draft_agreement: { label: 'Draft Agreement', icon: FileText, status: 'pending' },
    file_court_docs: { label: 'File Court Documents', icon: FileText, status: 'pending' },
  };

  const [customAction, setCustomAction] = useState('');

  const handleOptionSelect = (optionValue) => {
    onChange(optionValue);
    onToggle(null);
  };

  const handleAddCustomAction = () => {
    if (customAction.trim()) {
      onAddCustomAction(customAction.trim());
      setCustomAction('');
      onToggle(null);
    }
  };

  const getDisplayValue = () => {
    if (!value) return '';
    return actionOptions[value]?.label || value;
  };

  const getIcon = (iconName) => {
    const icons = {
      FileText: FileText,
      Calendar: Calendar,
      DollarSign: DollarSign,
    };
    return icons[iconName] || FileText;
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <TextField
        fullWidth
        label="Action Item"
        value={getDisplayValue()}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(dropdownKey);
        }}
        placeholder="Select or add an action item"
        error={!!error}
        helperText={error}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <CheckCircle size={20} color={COLORS.navy.main} />
            </InputAdornment>
          ),
          endAdornment: (
            <ChevronDown
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              style={{ color: COLORS.navy.main, cursor: 'pointer' }}
              size={20}
            />
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            cursor: 'pointer',
            backgroundColor: 'white',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: COLORS.navy.main,
            },
          },
        }}
      />

      <Popper
        open={isOpen}
        anchorEl={anchorRef?.current}
        placement="bottom-start"
        style={{
          zIndex: 1300,
          width: anchorRef?.current ? anchorRef.current.offsetWidth : 'auto',
        }}
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
        ]}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              sx={{
                width: '100%',
                maxHeight: 300,
                overflow: 'auto',
                border: `1px solid ${COLORS.gold.main}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: 1,
                mt: 0.5,
              }}
            >
              {/* Predefined Actions */}
              {Object.entries(actionOptions).map(([optionValue, optionData]) => {
                const IconComponent = getIcon(optionData.icon.name);
                return (
                  <Box
                    key={optionValue}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionSelect(optionValue);
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      cursor: 'pointer',
                      backgroundColor: optionValue === value ? alpha(COLORS.navy.main, 0.08) : 'background.paper',
                      '&:hover': {
                        backgroundColor: alpha(COLORS.navy.main, 0.12),
                      },
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <IconComponent size={16} color={COLORS.navy.main} />
                    <Typography variant="body2" color="text.primary">
                      {optionData.label}
                    </Typography>
                  </Box>
                );
              })}

              {/* Custom Action Input */}
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Add Custom Action
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter custom action..."
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCustomAction();
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddCustomAction}
                    disabled={!customAction.trim()}
                    sx={{
                      backgroundColor: COLORS.navy.main,
                      '&:hover': {
                        backgroundColor: COLORS.navy.dark,
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

// Completed Actions Section Component
const CompletedActionsSection = ({ completedActions, onMoveBackToPending }) => {
  if (!completedActions || completedActions.length === 0) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <CheckCircle color={COLORS.gold.main} size={24} />
        <Typography variant="h6" fontWeight="600" color={COLORS.gold.main}>
          Completed Actions
        </Typography>
        <Chip label={completedActions.length} size="small" sx={{ backgroundColor: COLORS.gold.light }} />
      </Box>

      <Card variant="outlined" sx={{ borderColor: COLORS.gold.light }}>
        <CardContent>
          <List dense>
            {completedActions.map((action, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => onMoveBackToPending(index)}
                    title="Move back to pending"
                  >
                    <Clock size={16} />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <CheckCircle color={COLORS.gold.main} size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={action.label || action}
                  primaryTypographyProps={{
                    sx: { textDecoration: 'line-through', color: 'text.secondary' },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

// Service Dropdown Component
const ServiceDropdown = ({ serviceIndex, value, onChange, error, anchorRef, isOpen, onToggle, dropdownKey }) => {
  const serviceOptions = {
    company_formation: 'Company Formation',
    legal_consultation: 'Legal Consultation',
    document_review: 'Document Review',
    business_registration: 'Business Registration',
    tax_advisory: 'Tax Advisory',
    compliance: 'Compliance Services',
  };

  const handleOptionSelect = (optionValue) => {
    onChange(optionValue);
    onToggle(null);
  };

  const getDisplayValue = () => {
    if (!value) return '';
    return serviceOptions[value] || '';
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <TextField
        fullWidth
        label="Service Type"
        value={getDisplayValue()}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(dropdownKey);
        }}
        placeholder="Select service type"
        error={!!error}
        helperText={error}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <FileText size={20} color={COLORS.navy.main} />
            </InputAdornment>
          ),
          endAdornment: (
            <ChevronDown
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              style={{ color: COLORS.navy.main, cursor: 'pointer' }}
              size={20}
            />
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            cursor: 'pointer',
            backgroundColor: 'white',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: COLORS.navy.main,
            },
          },
        }}
      />

      <Popper
        open={isOpen}
        anchorEl={anchorRef?.current}
        placement="bottom-start"
        style={{
          zIndex: 1300,
          width: anchorRef?.current ? anchorRef.current.offsetWidth : 'auto',
        }}
        modifiers={[
          {
            name: 'flip',
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: 'document',
              padding: 8,
            },
          },
        ]}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              sx={{
                width: '100%',
                maxHeight: 200,
                overflow: 'auto',
                border: `1px solid ${COLORS.gold.main}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: 1,
                mt: 0.5,
              }}
            >
              {Object.entries(serviceOptions).map(([optionValue, label]) => (
                <Box
                  key={optionValue}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionSelect(optionValue);
                  }}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: 'pointer',
                    backgroundColor: optionValue === value ? alpha(COLORS.navy.main, 0.08) : 'background.paper',
                    '&:hover': {
                      backgroundColor: alpha(COLORS.navy.main, 0.12),
                    },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    {label}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    caseId: '',
    name: '',
    email: '',
    phone: '',
    status: '',
    LFA: '',
    hasInvoice: false,
    actionItem: '',
    actionItemStatus: 'pending', // 'pending' or 'completed'
    services: [],
  });

  const [completedActions, setCompletedActions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  // Refs for dropdowns
  const statusAnchorRef = useRef(null);
  const lfaAnchorRef = useRef(null);
  const actionItemAnchorRef = useRef(null);
  const serviceAnchorRefs = useRef({});

  // Dropdown options
  const statusOptions = {
    unpaid: { label: 'Unpaid', color: 'error' },
    paid: { label: 'Paid', color: 'success' },
    pending: { label: 'Pending', color: 'warning' },
    overdue: { label: 'Overdue', color: 'error' },
    cancelled: { label: 'Cancelled', color: 'default' },
  };

  const lfaOptions = {
    contract_draft: 'Contract Draft Agreement',
    service_agreement: 'Service Agreement',
    partnership: 'Partnership Agreement',
    employment: 'Employment Contract',
    nda: 'NDA Agreement',
  };

  // Enhanced Phone Input Component
  const PhoneInput = ({ value, onChange, error }) => {
    const formatPhoneNumber = (value) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 2) {
        return `+${numbers}`;
      } else if (numbers.length <= 5) {
        return `+${numbers.slice(0, 2)} ${numbers.slice(2)}`;
      } else {
        return `+${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 12)}`;
      }
    };

    const handleChange = (e) => {
      const formatted = formatPhoneNumber(e.target.value);
      onChange(formatted);
    };

    return (
      <TextField
        fullWidth
        label="Phone Number"
        value={value}
        onChange={handleChange}
        placeholder="+92 300 1234567"
        error={!!error}
        helperText={error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone size={20} color={COLORS.navy.main} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: COLORS.navy.main,
            },
          },
        }}
      />
    );
  };

  // Close dropdown when clicking outside
  const handleClickAway = () => {
    setOpenDropdown(null);
  };

  const handleToggleDropdown = (dropdownKey) => {
    setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey);
  };

  // Store service dropdown refs
  useEffect(() => {
    return () => {
      serviceAnchorRefs.current = {};
    };
  }, []);

  const getServiceAnchorRef = (index) => {
    if (!serviceAnchorRefs.current[index]) {
      serviceAnchorRefs.current[index] = React.createRef();
    }
    return serviceAnchorRefs.current[index];
  };

  // Action Items Handlers
  const handleActionItemChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      actionItem: value,
      actionItemStatus: 'pending',
    }));
    if (errors.actionItem) {
      setErrors((prev) => ({ ...prev, actionItem: '' }));
    }
  };

  const handleAddCustomAction = (customAction) => {
    handleActionItemChange(customAction);
  };

  const handleMarkActionCompleted = () => {
    if (formData.actionItem) {
      setCompletedActions((prev) => [
        ...prev,
        {
          label: formData.actionItem,
          completedAt: new Date().toISOString(),
        },
      ]);
      setFormData((prev) => ({ ...prev, actionItem: '', actionItemStatus: 'pending' }));
    }
  };

  const handleMoveBackToPending = (index) => {
    const actionToMove = completedActions[index];
    setFormData((prev) => ({
      ...prev,
      actionItem: actionToMove.label,
      actionItemStatus: 'pending',
    }));
    setCompletedActions((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.caseId.trim()) newErrors.caseId = 'Case ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.LFA) newErrors.LFA = 'LFA is required';
    if (!formData.actionItem.trim()) newErrors.actionItem = 'Action item is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (Pakistan format)
    const phoneRegex = /^\+92\s?[0-9]{3}\s?[0-9]{7}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be in Pakistani format (+92 XXX XXXXXXX)';
    }

    // Services validation
    if (formData.services.length === 0) {
      newErrors.services = 'At least one service is required';
    }

    formData.services.forEach((service, index) => {
      if (!service.serviceName) {
        newErrors[`service_${index}_name`] = 'Service name is required';
      }
      if (!service.serviceValue || service.serviceValue <= 0) {
        newErrors[`service_${index}_value`] = 'Service value must be greater than 0';
      }

      // Validate sub-items
      const subItems = Array.isArray(service.subItems) ? service.subItems : [];
      subItems.forEach((subItem, subIndex) => {
        if (!subItem.dueDate) {
          newErrors[`service_${index}_sub_${subIndex}_date`] = 'Due date is required';
        }
        if (!subItem.invoicedAmount || subItem.invoicedAmount <= 0) {
          newErrors[`service_${index}_sub_${subIndex}_invoiced`] = 'Invoiced amount must be greater than 0';
        }
        if (subItem.receivedAmount < 0) {
          newErrors[`service_${index}_sub_${subIndex}_received`] = 'Received amount cannot be negative';
        }
        if (subItem.receivedAmount > subItem.invoicedAmount) {
          newErrors[`service_${index}_sub_${subIndex}_received`] = 'Received amount cannot exceed invoiced amount';
        }
      });

      // Validate total sub-item amounts don't exceed service value
      const totalInvoiced = subItems.reduce((sum, item) => sum + (item.invoicedAmount || 0), 0);
      if (totalInvoiced > service.serviceValue) {
        newErrors[`service_${index}_total`] = 'Total invoiced amount cannot exceed service value';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Other handlers remain the same...
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleDropdownChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
      subItems: Array.isArray(updatedServices[index].subItems) ? updatedServices[index].subItems : [],
    };

    setFormData((prev) => ({ ...prev, services: updatedServices }));

    const errorKey = `service_${index}_${field === 'serviceName' ? 'name' : 'value'}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleSubItemChange = (serviceIndex, subIndex, field, value) => {
    const updatedServices = [...formData.services];
    if (!Array.isArray(updatedServices[serviceIndex].subItems)) {
      updatedServices[serviceIndex].subItems = [];
    }
    updatedServices[serviceIndex].subItems[subIndex] = {
      ...updatedServices[serviceIndex].subItems[subIndex],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, services: updatedServices }));

    const errorKey = `service_${serviceIndex}_sub_${subIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addService = () => {
    const newService = {
      serviceName: '',
      serviceValue: 0,
      subItems: [
        {
          dueDate: new Date().toISOString().split('T')[0],
          invoicedAmount: 0,
          receivedAmount: 0,
          notes: '',
        },
      ],
    };
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const addSubItem = (serviceIndex) => {
    const updatedServices = [...formData.services];
    if (!Array.isArray(updatedServices[serviceIndex].subItems)) {
      updatedServices[serviceIndex].subItems = [];
    }
    updatedServices[serviceIndex].subItems.push({
      dueDate: new Date().toISOString().split('T')[0],
      invoicedAmount: 0,
      receivedAmount: 0,
      notes: '',
    });
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const removeSubItem = (serviceIndex, subIndex) => {
    const updatedServices = [...formData.services];
    updatedServices[serviceIndex].subItems = updatedServices[serviceIndex].subItems.filter((_, i) => i !== subIndex);
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Submitting form data:', formData);
      setSuccessMessage('Case submitted successfully!');

      setFormData({
        caseId: '',
        name: '',
        email: '',
        phone: '',
        status: '',
        LFA: '',
        hasInvoice: false,
        actionItem: '',
        actionItemStatus: 'pending',
        services: [],
      });
      setCompletedActions([]);
      setErrors({});
      setOpenDropdown(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Error submitting case. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          maxHeight: '84vh',
          backgroundColor: COLORS.background.light,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: COLORS.gold.main,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: COLORS.gold.dark,
          },
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            background: COLORS.background.white,
            border: `1px solid ${alpha(COLORS.navy.main, 0.1)}`,
            overflow: 'visible',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            mb: 4,
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${COLORS.navy.main} 0%, ${COLORS.navy.dark} 100%)`,
              color: 'white',
              p: 3,
              textAlign: 'center',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <FileText size={40} style={{ marginBottom: 12, color: COLORS.gold.main }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Invoice Management
            </Typography>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 3 }}>
            {successMessage && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 1,
                  border: `1px solid`,
                  borderColor: 'success.light',
                }}
              >
                {successMessage}
              </Alert>
            )}

            {errors.submit && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 1,
                }}
              >
                {errors.submit}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Basic Information Section */}
              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <User color={COLORS.navy.main} size={24} />
                  <Typography variant="h5" fontWeight="600" color={COLORS.navy.main}>
                    Basic Information
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Case ID"
                      name="caseId"
                      value={formData.caseId}
                      onChange={handleInputChange}
                      placeholder="CASE-1002"
                      error={!!errors.caseId}
                      helperText={errors.caseId}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ali Raza"
                      error={!!errors.name}
                      helperText={errors.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={20} color={COLORS.navy.main} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ali.raza@example.com"
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} color={COLORS.navy.main} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <PhoneInput value={formData.phone} onChange={handlePhoneChange} error={errors.phone} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box ref={statusAnchorRef}>
                      <CustomDropdown
                        label="Status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(value) => handleDropdownChange('status', value)}
                        error={errors.status}
                        dropdownKey="status"
                        anchorRef={statusAnchorRef}
                        icon={FileText}
                        isOpen={openDropdown === 'status'}
                        onToggle={handleToggleDropdown}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box ref={lfaAnchorRef}>
                      <CustomDropdown
                        label="Legal Framework Agreement (LFA)"
                        options={lfaOptions}
                        value={formData.LFA}
                        onChange={(value) => handleDropdownChange('LFA', value)}
                        error={errors.LFA}
                        dropdownKey="lfa"
                        anchorRef={lfaAnchorRef}
                        icon={FileText}
                        isOpen={openDropdown === 'lfa'}
                        onToggle={handleToggleDropdown}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.hasInvoice}
                          onChange={handleInputChange}
                          name="hasInvoice"
                          sx={{ color: COLORS.navy.main }}
                        />
                      }
                      label="Has Invoice"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box ref={actionItemAnchorRef}>
                      <CustomDropdown
                        label="Action Item"
                        options={actionItemOptions}
                        value={formData.actionItem}
                        onChange={(value) => handleDropdownChange('actionItem', value)}
                        error={errors.actionItem}
                        dropdownKey="actionItem"
                        anchorRef={actionItemAnchorRef}
                        icon={FileText}
                        isOpen={openDropdown === 'actionItem'}
                        onToggle={handleToggleDropdown}
                        placeholder="Select action item"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 4, borderColor: alpha(COLORS.navy.main, 0.1) }} />

              {/* Services Section */}
              <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <DollarSign color={COLORS.navy.main} size={24} />
                    <Typography variant="h5" fontWeight="600" color={COLORS.navy.main}>
                      Services & Payments
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={addService}
                    sx={{
                      borderRadius: 1,
                      px: 3,
                      py: 1,
                      backgroundColor: COLORS.navy.main,
                      '&:hover': {
                        backgroundColor: COLORS.navy.dark,
                      },
                    }}
                  >
                    Add Service
                  </Button>
                </Box>

                {errors.services && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                    {errors.services}
                  </Alert>
                )}

                {formData.services.map((service, serviceIndex) => (
                  <Box
                    key={serviceIndex}
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 1,
                      border: `1px solid ${alpha(COLORS.navy.main, 0.1)}`,
                      backgroundColor: alpha(COLORS.background.light, 0.5),
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="600" color={COLORS.navy.main}>
                        Service {serviceIndex + 1}
                      </Typography>
                      <IconButton color="error" onClick={() => removeService(serviceIndex)} size="small">
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box ref={getServiceAnchorRef(serviceIndex)}>
                          <ServiceDropdown
                            serviceIndex={serviceIndex}
                            value={service.serviceName}
                            onChange={(value) => handleServiceChange(serviceIndex, 'serviceName', value)}
                            error={errors[`service_${serviceIndex}_name`]}
                            anchorRef={getServiceAnchorRef(serviceIndex)}
                            isOpen={openDropdown === `service-${serviceIndex}`}
                            onToggle={handleToggleDropdown}
                            dropdownKey={`service-${serviceIndex}`}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Service Value (PKR)"
                          type="number"
                          value={service.serviceValue}
                          onChange={(e) =>
                            handleServiceChange(serviceIndex, 'serviceValue', parseFloat(e.target.value) || 0)
                          }
                          error={!!errors[`service_${serviceIndex}_value`]}
                          helperText={errors[`service_${serviceIndex}_value`]}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DollarSign size={20} color={COLORS.navy.main} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Payment Schedule */}
                    <Box sx={{ mt: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                          Payment Schedule
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => addSubItem(serviceIndex)}
                          startIcon={<Plus size={16} />}
                          sx={{
                            borderRadius: 1,
                            borderColor: COLORS.navy.main,
                            color: COLORS.navy.main,
                            '&:hover': {
                              borderColor: COLORS.navy.dark,
                              backgroundColor: alpha(COLORS.navy.main, 0.04),
                            },
                          }}
                        >
                          Add Payment
                        </Button>
                      </Box>

                      {(Array.isArray(service.subItems) ? service.subItems : []).map((subItem, subIndex) => (
                        <Box
                          key={subIndex}
                          sx={{
                            mb: 1,
                            p: 2,
                            borderRadius: 1,
                            border: `1px solid ${alpha(COLORS.navy.main, 0.05)}`,
                            backgroundColor: 'white',
                          }}
                        >
                          <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12} md={3}>
                              <TextField
                                fullWidth
                                type="date"
                                label="Due Date"
                                InputLabelProps={{ shrink: true }}
                                value={subItem.dueDate}
                                onChange={(e) => handleSubItemChange(serviceIndex, subIndex, 'dueDate', e.target.value)}
                                error={!!errors[`service_${serviceIndex}_sub_${subIndex}_date`]}
                                helperText={errors[`service_${serviceIndex}_sub_${subIndex}_date`]}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Calendar size={16} color={COLORS.navy.main} />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                  },
                                }}
                              />
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                type="number"
                                label="Invoiced Amount"
                                value={subItem.invoicedAmount}
                                onChange={(e) =>
                                  handleSubItemChange(
                                    serviceIndex,
                                    subIndex,
                                    'invoicedAmount',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                error={!!errors[`service_${serviceIndex}_sub_${subIndex}_invoiced`]}
                                helperText={errors[`service_${serviceIndex}_sub_${subIndex}_invoiced`]}
                              />
                            </Grid>

                            <Grid item xs={12} md={2}>
                              <TextField
                                fullWidth
                                type="number"
                                label="Received Amount"
                                value={subItem.receivedAmount}
                                onChange={(e) =>
                                  handleSubItemChange(
                                    serviceIndex,
                                    subIndex,
                                    'receivedAmount',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                error={!!errors[`service_${serviceIndex}_sub_${subIndex}_received`]}
                                helperText={errors[`service_${serviceIndex}_sub_${subIndex}_received`]}
                              />
                            </Grid>

                            <Grid item xs={12} md={4}>
                              <TextField
                                fullWidth
                                label="Notes"
                                value={subItem.notes}
                                onChange={(e) => handleSubItemChange(serviceIndex, subIndex, 'notes', e.target.value)}
                                placeholder="Payment description..."
                              />
                            </Grid>

                            <Grid item xs={12} md={1}>
                              {service.subItems && service.subItems.length > 1 && (
                                <IconButton
                                  color="error"
                                  onClick={() => removeSubItem(serviceIndex, subIndex)}
                                  size="small"
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              )}
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Submit Button */}
              <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFormData({
                      caseId: '',
                      name: '',
                      email: '',
                      phone: '',
                      status: '',
                      LFA: '',
                      hasInvoice: false,
                      actionItem: '',
                      services: [],
                    });
                    setErrors({});
                    setSuccessMessage('');
                  }}
                  disabled={isSubmitting}
                  sx={{
                    borderRadius: 1,
                    px: 4,
                    py: 1,
                    minWidth: 120,
                    borderColor: COLORS.navy.main,
                    color: COLORS.navy.main,
                    '&:hover': {
                      borderColor: COLORS.navy.dark,
                      backgroundColor: alpha(COLORS.navy.main, 0.04),
                    },
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={isSubmitting}
                  size="large"
                  sx={{
                    borderRadius: 1,
                    px: 4,
                    py: 1,
                    minWidth: 150,
                    backgroundColor: COLORS.navy.main,
                    '&:hover': {
                      backgroundColor: COLORS.navy.dark,
                    },
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Case'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </ClickAwayListener>
  );
};

export default InvoiceForm;
