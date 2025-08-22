'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Paper,
  InputAdornment,
  CircularProgress,
  Container,
  alpha,
  IconButton,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CalendarToday,
  AttachMoney,
  People,
  Description,
  Search,
  FilterList,
  Close,
  DateRange,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Payment as PaymentIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import { ApiEndPoint } from '../Component/utils/utlis';

// Styled components with white and gold theme
const ElegantCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: 12,
  border: `1px solid ${alpha('#d4af37', 0.3)}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  color: '#2c3e50',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha('#d4af37', 0.03),
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: alpha('#d4af37', 0.06),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha('#d4af37', 0.1)}`,
}));

export default function PaymentDashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [consultationTypeFilter, setConsultationTypeFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${ApiEndPoint}payments/getAllPaymentData`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setData(result.data);
          setFilteredData(result.data);
        } else {
          setError('API returned no data or unsuccessful result');
          setData([]);
          setFilteredData([]);
        }
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const clientName = item.link?.name?.toLowerCase() || '';
        const clientPhone = item.link?.phone || '';
        const lawyerName = item.lawyer?.name?.toLowerCase() || '';
        const serviceType = item.payment?.service?.toLowerCase() || '';

        const matches =
          clientName.includes(searchTerm.toLowerCase()) ||
          clientPhone.includes(searchTerm) ||
          lawyerName.includes(searchTerm.toLowerCase()) ||
          serviceType.includes(searchTerm.toLowerCase());

        return matches;
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) =>
        statusFilter === 'no-payment' ? !item.payment : item.payment?.status === statusFilter
      );
    }

    if (serviceFilter !== 'all') {
      filtered = filtered.filter((item) => item.payment?.service === serviceFilter);
    }

    if (consultationTypeFilter !== 'all') {
      filtered = filtered.filter((item) => item.payment?.consultationType === consultationTypeFilter);
    }

    if (startDateFilter) {
      filtered = filtered.filter((item) => {
        if (!item.link?.createdAt) return false;
        const itemDate = new Date(item.link.createdAt);
        return itemDate >= startDateFilter;
      });
    }

    if (endDateFilter) {
      filtered = filtered.filter((item) => {
        if (!item.link?.createdAt) return false;
        const itemDate = new Date(item.link.createdAt);
        // Set end date to end of day
        const endOfDay = new Date(endDateFilter);
        endOfDay.setHours(23, 59, 59, 999);
        return itemDate <= endOfDay;
      });
    }

    setFilteredData(filtered);
  }, [data, searchTerm, statusFilter, serviceFilter, consultationTypeFilter, startDateFilter, endDateFilter]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setServiceFilter('all');
    setConsultationTypeFilter('all');
    setStartDateFilter(null);
    setEndDateFilter(null);
  };

  const totalClients = data.length;
  const paidPayments = data.filter((item) => item.payment?.status === 'paid').length;
  const pendingPayments = data.filter((item) => item.payment?.status === 'pending').length;
  const totalRevenue = data
    .filter((item) => item.payment?.status === 'paid')
    .reduce((sum, item) => sum + (item.payment?.amount || 0), 0);

  const getStatusChip = (status) => {
    if (!status) return <Chip label="No Payment" variant="outlined" size="small" sx={{ fontWeight: 600 }} />;

    switch (status) {
      case 'paid':
        return <Chip label="Paid" color="success" size="small" sx={{ fontWeight: 600 }} />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 600 }} />;
      case 'failed':
        return <Chip label="Failed" color="error" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={status} variant="outlined" size="small" sx={{ fontWeight: 600 }} />;
    }
  };

  const uniqueServices = [
    ...new Set(data.filter((item) => item.lawyer?.Expertise).map((item) => item.lawyer?.Expertise)),
  ];

  const uniqueConsultationTypes = [
    ...new Set(data.filter((item) => item.payment?.consultationType).map((item) => item.payment?.consultationType)),
  ];

  const lightTheme = {
    background: '#f8f9fa',
    accentColor: '#d4af37',
    textPrimary: '#2c3e50',
    textSecondary: '#7f8c8d',
    cardBackground: '#ffffff',
    tableHeaderBg: alpha('#d4af37', 0.08),
    borderColor: '#e9ecef',
  };

  const filterInputSx = {
    color: lightTheme.textPrimary,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(lightTheme.accentColor, 0.3),
      borderWidth: 1,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: lightTheme.accentColor,
      borderWidth: 1,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: lightTheme.accentColor,
      borderWidth: 1,
      boxShadow: `0 0 0 2px ${alpha(lightTheme.accentColor, 0.1)}`,
    },
    '& .MuiSvgIcon-root': {
      color: lightTheme.accentColor,
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: lightTheme.background,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: lightTheme.accentColor }} />
          <Typography
            sx={{
              color: lightTheme.textPrimary,
              mt: 2,
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
            }}
          >
            Loading payment data...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <Box
        sx={{
          background: lightTheme.background,
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3, lg: 4 },
          maxHeight: '86vh',
          overflowY: 'auto',
        }}
      >
        <Container maxWidth="xl" disableGutters>
          {/* Fixed Title Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: { xs: 2, sm: 3, md: 4 },
              flexWrap: { xs: 'wrap', sm: 'nowrap' }, // Allow wrapping on mobile
            }}
          >
            <AttachMoney
              sx={{
                color: lightTheme.accentColor,
                fontSize: { xs: 24, sm: 28, md: 32 },
                flexShrink: 0, // Prevent icon from shrinking
              }}
            />
            <Typography
              variant="h4"
              sx={{
                color: lightTheme.textPrimary,
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                whiteSpace: { xs: 'normal', sm: 'nowrap' }, // Allow text wrap on mobile
              }}
            >
              Payment Dashboard
            </Typography>
          </Box>
          <Grid
            container
            spacing={{ xs: 2, sm: 3 }}
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              flex: '0 0 auto', // cards area keeps intrinsic height
            }}
          >
            {/* Total Payments Card */}
            <Grid item xs={12} sm={6} md={3}>
              <ElegantCard>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lightTheme.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      Total Payments
                    </Typography>
                    <People
                      sx={{
                        color: lightTheme.accentColor,
                        fontSize: { xs: 24, sm: 28 },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    sx={{
                      color: lightTheme.textPrimary,
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    }}
                  >
                    {totalClients}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: lightTheme.textSecondary,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Active appointments
                  </Typography>
                </CardContent>
              </ElegantCard>
            </Grid>

            {/* Paid Payments Card */}
            <Grid item xs={12} sm={6} md={3}>
              <ElegantCard>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lightTheme.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      Paid Payments
                    </Typography>
                    <AttachMoney
                      sx={{
                        color: lightTheme.accentColor,
                        fontSize: { xs: 24, sm: 28 },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    sx={{
                      color: lightTheme.textPrimary,
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    }}
                  >
                    {paidPayments}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: lightTheme.textSecondary,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Completed transactions
                  </Typography>
                </CardContent>
              </ElegantCard>
            </Grid>

            {/* Pending Payments Card */}
            <Grid item xs={12} sm={6} md={3}>
              <ElegantCard>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lightTheme.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      Pending Payments
                    </Typography>
                    <CalendarToday
                      sx={{
                        color: lightTheme.accentColor,
                        fontSize: { xs: 24, sm: 28 },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    sx={{
                      color: lightTheme.textPrimary,
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    }}
                  >
                    {pendingPayments}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: lightTheme.textSecondary,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Awaiting payment
                  </Typography>
                </CardContent>
              </ElegantCard>
            </Grid>

            {/* Total Revenue Card */}
            <Grid item xs={12} sm={6} md={3}>
              <ElegantCard>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lightTheme.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    >
                      Total Revenue
                    </Typography>
                    <Description
                      sx={{
                        color: lightTheme.accentColor,
                        fontSize: { xs: 24, sm: 28 },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    sx={{
                      color: lightTheme.textPrimary,
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                    }}
                  >
                    ${totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: lightTheme.textSecondary,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    From paid consultations
                  </Typography>
                </CardContent>
              </ElegantCard>
            </Grid>
          </Grid>

          {/* MAIN AREA - take remaining space and let inner content scroll */}
          <Box
            sx={{
              flex: 1, // take the remaining space in the parent
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0, // important to allow children to scroll inside flex
              gap: 2,
            }}
          >
            {/* Main Data Table/Card Section - ensure it fills the area */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 0,
              }}
            >
              <ElegantCard
                // forward height styles to make sure card occupies full area
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minHeight: 0,
                }}
              >
                {/* Header */}
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                        <Typography
                          variant="h6"
                          sx={{
                            color: lightTheme.textPrimary,
                            fontWeight: 600,
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                          }}
                        >
                          Client Appointments & Payments
                        </Typography>
                        <Chip
                          label={`${filteredData.length} of ${totalClients}`}
                          variant="outlined"
                          sx={{
                            borderColor: lightTheme.accentColor,
                            color: lightTheme.textPrimary,
                            fontWeight: 500,
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          onClick={() => setShowFilters(!showFilters)}
                          sx={{ color: lightTheme.accentColor }}
                          size="small"
                        >
                          <FilterList />
                        </IconButton>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={clearAllFilters}
                          sx={{
                            color: lightTheme.textSecondary,
                            borderColor: alpha(lightTheme.accentColor, 0.3),
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            '&:hover': {
                              borderColor: lightTheme.accentColor,
                              backgroundColor: alpha(lightTheme.accentColor, 0.05),
                            },
                          }}
                        >
                          Clear Filters
                        </Button>
                      </Box>
                    </Box>
                  }
                />

                {/* Filters Section */}
                <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                  {showFilters && (
                    <>
                      {/* Search Row */}
                      <Grid container spacing={2} sx={{ mb: 1 }}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            placeholder="Search by client name, phone, lawyer, or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                              ...filterInputSx,
                              '& .MuiInputBase-input': {
                                padding: { xs: '10px', sm: '12px' },
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Search
                                    sx={{
                                      color: lightTheme.accentColor,
                                      fontSize: { xs: 18, sm: 22 },
                                      mr: { xs: 0.5, sm: 1 },
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>

                      {/* Filters Row */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              sx={filterInputSx}
                            >
                              <MenuItem value="all">All Statuses</MenuItem>
                              <MenuItem value="paid">Paid</MenuItem>
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="failed">Failed</MenuItem>
                              <MenuItem value="no-payment">No Payment</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Service</InputLabel>
                            <Select
                              value={serviceFilter}
                              onChange={(e) => setServiceFilter(e.target.value)}
                              sx={filterInputSx}
                            >
                              <MenuItem value="all">All Services</MenuItem>
                              {uniqueServices.map((service) => (
                                <MenuItem key={service} value={service}>
                                  {service}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Consultation Type</InputLabel>
                            <Select
                              value={consultationTypeFilter}
                              onChange={(e) => setConsultationTypeFilter(e.target.value)}
                              sx={filterInputSx}
                            >
                              <MenuItem value="all">All Types</MenuItem>
                              {uniqueConsultationTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <DatePicker
                            label="Start Date"
                            value={startDateFilter}
                            onChange={(newValue) => setStartDateFilter(newValue)}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <DatePicker
                            label="End Date"
                            value={endDateFilter}
                            onChange={(newValue) => setEndDateFilter(newValue)}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Box>

                <Divider sx={{ borderColor: alpha(lightTheme.accentColor, 0.2) }} />

                {/* Content - make this area flexible so it fills remaining card space and scrolls internally */}
                <CardContent
                  sx={{
                    pt: 0,
                    pb: '50px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0, // needed for nested scrolling with flex
                  }}
                >
                  {isMobile ? (
                    // Mobile Card View
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto', pr: 1 }}>
                      {filteredData.length === 0 ? (
                        <Box textAlign="center" py={6}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: lightTheme.textSecondary,
                              fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}
                          >
                            {data.length === 0
                              ? 'No data received from API'
                              : 'No appointments found matching your criteria.'}
                          </Typography>
                        </Box>
                      ) : (
                        filteredData.map((item, idx) => (
                          <ElegantCard key={item.link?._id || idx}>
                            <CardContent sx={{ p: 2 }}>
                              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  sx={{ color: lightTheme.textPrimary }}
                                >
                                  {item.link?.name || 'N/A'}
                                </Typography>
                                {getStatusChip(item.payment?.status)}
                              </Box>

                              <Box display="flex" flexDirection="column" gap={1}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <PhoneIcon fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                  <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                    {item.link?.phone || 'N/A'}
                                  </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                  <PersonIcon fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                  <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                    {item.lawyer?.FkUserId?.UserName || 'N/A'}
                                  </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                  <WorkIcon fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                  <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                    {item?.lawyer?.Expertise || '—'}
                                  </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                  <Description fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                  <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                    {item.payment?.consultationType || '—'}
                                  </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                  <AttachMoney fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                  <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                    {item.payment?.amount ? `$${item.payment.amount}` : '—'}
                                  </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                  <PaymentIcon fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                  <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                    {item.payment?.paymentMethod ? `${item.payment.paymentMethod}` : '—'}
                                  </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" gap={1}>
                                  <CalendarMonthIcon fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                  <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                    {item.link?.createdAt
                                      ? new Date(item.link.createdAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        })
                                      : 'N/A'}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </ElegantCard>
                        ))
                      )}
                    </Box>
                  ) : (
                    // Desktop Table View
                    <Paper
                      sx={{
                        background: 'transparent',
                        border: `1px solid ${alpha(lightTheme.accentColor, 0.2)}`,
                        borderRadius: 2,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Table wrapper - this will handle both horizontal and vertical scroll while filling available height */}
                      <Box
                        sx={{
                          flex: 1,
                          width: '100%',
                          height: '100%',
                          overflowX: 'auto',
                          overflowY: 'auto',
                        }}
                      >
                        <Table stickyHeader sx={{ minWidth: 600 }}>
                          <TableHead sx={{ backgroundColor: lightTheme.textPrimary }}>
                            <TableRow
                              sx={{
                                '& th': {
                                  backgroundColor: lightTheme.textPrimary, // dark background
                                  color: '#fff', // force text white
                                  fontWeight: 600,
                                },
                              }}
                            >
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 150 }}>
                                Client Name
                              </StyledTableCell>
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 120 }}>Phone</StyledTableCell>
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 150 }}>Lawyer</StyledTableCell>
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 160 }}>Service</StyledTableCell>
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 200 }}>
                                Consultation Type
                              </StyledTableCell>
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 120 }}>Amount</StyledTableCell>
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 150 }}>Method</StyledTableCell>
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 120 }}>Status</StyledTableCell>
                              <StyledTableCell sx={{ whiteSpace: 'nowrap', minWidth: 160 }}>Created At</StyledTableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {filteredData.map((item, idx) => (
                              <StyledTableRow key={item.link?._id || idx} hover>
                                <StyledTableCell>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{
                                      color: lightTheme.textPrimary,
                                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {item.link?.name || 'N/A'}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{
                                    color: lightTheme.textPrimary,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {item.link?.phone || 'N/A'}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {item.lawyer ? (
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        fontWeight="medium"
                                        sx={{
                                          color: lightTheme.textPrimary,
                                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        }}
                                      >
                                        {item.lawyer.FkUserId.UserName || 'N/A'}
                                      </Typography>
                                      {item.lawyer.Expertise && (
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: lightTheme.textSecondary,
                                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                          }}
                                        >
                                          {item?.lawyer?.Expertise || 'N/A'}
                                        </Typography>
                                      )}
                                    </Box>
                                  ) : (
                                    <Typography
                                      sx={{
                                        color: lightTheme.textSecondary,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                      }}
                                    >
                                      —
                                    </Typography>
                                  )}
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{
                                    color: lightTheme.textPrimary,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {item?.lawyer?.Expertise || '—'}
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{
                                    color: lightTheme.textPrimary,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {item.payment?.consultationType || '—'}
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{
                                    color: lightTheme.textPrimary,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {item.payment?.amount ? `$${item.payment.amount}` : '—'}
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{
                                    color: lightTheme.textPrimary,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {item.payment?.paymentMethod || '—'}
                                </StyledTableCell>
                                <StyledTableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                  {getStatusChip(item.payment?.status)}
                                </StyledTableCell>
                                <StyledTableCell
                                  sx={{
                                    color: lightTheme.textPrimary,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {item.link?.createdAt
                                    ? new Date(item.link.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                      })
                                    : 'N/A'}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>

                      {filteredData.length === 0 && !loading && (
                        <Box textAlign="center" py={6}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: lightTheme.textSecondary,
                              fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}
                          >
                            {data.length === 0
                              ? 'No data received from API'
                              : 'No appointments found matching your criteria.'}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  )}
                </CardContent>
              </ElegantCard>
            </Box>
          </Box>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
