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
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5001/api/payments/getAllPaymentData');

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
          <Typography sx={{ color: lightTheme.textPrimary, mt: 2, fontSize: '1.1rem' }}>
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
          minHeight: '100vh',
          background: lightTheme.background,
          py: 4,
          px: { xs: 2, sm: 4 },
          maxHeight: '86vh',
          overflowY: 'auto',
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Typography
            variant="h4"
            sx={{
              color: lightTheme.textPrimary,
              fontWeight: 700,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <AttachMoney sx={{ color: lightTheme.accentColor, fontSize: 32 }} />
            Payment Dashboard
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ElegantCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lightTheme.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: '0.75rem',
                      }}
                    >
                      Total Payments
                    </Typography>
                    <People sx={{ color: lightTheme.accentColor, fontSize: 28 }} />
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    sx={{ color: lightTheme.textPrimary, mb: 1 }}
                  >
                    {totalClients}
                  </Typography>
                  <Typography variant="body2" sx={{ color: lightTheme.textSecondary, fontSize: '0.875rem' }}>
                    Active appointments
                  </Typography>
                </CardContent>
              </ElegantCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <ElegantCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lightTheme.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: '0.75rem',
                      }}
                    >
                      Paid Payments
                    </Typography>
                    <AttachMoney sx={{ color: lightTheme.accentColor, fontSize: 28 }} />
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    sx={{ color: lightTheme.textPrimary, mb: 1 }}
                  >
                    {paidPayments}
                  </Typography>
                  <Typography variant="body2" sx={{ color: lightTheme.textSecondary, fontSize: '0.875rem' }}>
                    Completed transactions
                  </Typography>
                </CardContent>
              </ElegantCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <ElegantCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lightTheme.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: '0.75rem',
                      }}
                    >
                      Pending Payments
                    </Typography>
                    <CalendarToday sx={{ color: lightTheme.accentColor, fontSize: 28 }} />
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    sx={{ color: lightTheme.textPrimary, mb: 1 }}
                  >
                    {pendingPayments}
                  </Typography>
                  <Typography variant="body2" sx={{ color: lightTheme.textSecondary, fontSize: '0.875rem' }}>
                    Awaiting payment
                  </Typography>
                </CardContent>
              </ElegantCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <ElegantCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: lightTheme.textSecondary,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: '0.75rem',
                      }}
                    >
                      Total Revenue
                    </Typography>
                    <Description sx={{ color: lightTheme.accentColor, fontSize: 28 }} />
                  </Box>
                  <Typography
                    variant="h4"
                    component="div"
                    fontWeight="bold"
                    sx={{ color: lightTheme.textPrimary, mb: 1 }}
                  >
                    ${totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: lightTheme.textSecondary, fontSize: '0.875rem' }}>
                    From paid consultations
                  </Typography>
                </CardContent>
              </ElegantCard>
            </Grid>
          </Grid>

          <ElegantCard>
            <CardHeader
              title={
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6" sx={{ color: lightTheme.textPrimary, fontWeight: 600 }}>
                      Client Appointments & Payments
                    </Typography>
                    <Chip
                      label={`${filteredData.length} of ${totalClients}`}
                      variant="outlined"
                      sx={{
                        borderColor: lightTheme.accentColor,
                        color: lightTheme.textPrimary,
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() => setShowFilters(!showFilters)}
                      sx={{ color: lightTheme.accentColor, mr: 1 }}
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
              sx={{ pb: 1 }}
            />

            {/* Filters Section */}
            <Box sx={{ px: 3, pb: 2 }}>
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
                            padding: '12px',
                          },
                          '& .MuiInputBase-input::placeholder': {
                            color: lightTheme.textSecondary,
                            opacity: 0.8,
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search sx={{ color: lightTheme.accentColor, fontSize: 22, mr: 1 }} />
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
                        <InputLabel
                          sx={{
                            color: lightTheme.textSecondary,
                            '&.Mui-focused': {
                              color: lightTheme.accentColor,
                            },
                          }}
                        >
                          Status
                        </InputLabel>
                        <Select
                          value={statusFilter}
                          label="Status"
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
                        <InputLabel
                          sx={{
                            color: lightTheme.textSecondary,
                            '&.Mui-focused': {
                              color: lightTheme.accentColor,
                            },
                          }}
                        >
                          Service
                        </InputLabel>
                        <Select
                          value={serviceFilter}
                          label="Service"
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
                        <InputLabel
                          sx={{
                            color: lightTheme.textSecondary,
                            '&.Mui-focused': {
                              color: lightTheme.accentColor,
                            },
                          }}
                        >
                          Consultation Type
                        </InputLabel>
                        <Select
                          value={consultationTypeFilter}
                          label="Consultation Type"
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
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            sx: filterInputSx,
                            InputLabelProps: {
                              shrink: true,
                              sx: {
                                color: lightTheme.textSecondary,
                                '&.Mui-focused': {
                                  color: lightTheme.accentColor,
                                },
                              },
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <DatePicker
                        label="End Date"
                        value={endDateFilter}
                        onChange={(newValue) => setEndDateFilter(newValue)}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            sx: filterInputSx,
                            InputLabelProps: {
                              shrink: true,
                              sx: {
                                color: lightTheme.textSecondary,
                                '&.Mui-focused': {
                                  color: lightTheme.accentColor,
                                },
                              },
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>

            <Divider sx={{ borderColor: alpha(lightTheme.accentColor, 0.2) }} />

            <CardContent sx={{ pt: 0 }}>
              <Paper
                sx={{
                  overflow: 'hidden',
                  background: 'transparent',
                  border: `1px solid ${alpha(lightTheme.accentColor, 0.2)}`,
                  borderRadius: 2,
                }}
              >
                <Box sx={{ overflowX: 'auto', maxHeight: '60vh' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          sx={{
                            backgroundColor: lightTheme.textPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Client Name
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            backgroundColor: lightTheme.textPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Phone
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            backgroundColor: lightTheme.textPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Lawyer
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            backgroundColor: lightTheme.textPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Service
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            backgroundColor: lightTheme.textPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Consultation Type
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            backgroundColor: lightTheme.textPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Amount
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            backgroundColor: lightTheme.textPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Status
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            backgroundColor: lightTheme.textPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            py: 2,
                          }}
                        >
                          Created At
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((item, idx) => (
                        <StyledTableRow key={item.link?._id || idx} hover>
                          <StyledTableCell>
                            <Typography variant="body2" fontWeight="medium" sx={{ color: lightTheme.textPrimary }}>
                              {item.link?.name || 'N/A'}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: lightTheme.textPrimary }}>
                            {item.link?.phone || 'N/A'}
                          </StyledTableCell>
                          <StyledTableCell>
                            {item.lawyer ? (
                              <Box>
                                <Typography variant="body2" fontWeight="medium" sx={{ color: lightTheme.textPrimary }}>
                                  {item.lawyer.FkUserId.UserName || 'N/A'}
                                </Typography>
                                {item.lawyer.Expertise && (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: lightTheme.textSecondary, fontSize: '0.75rem' }}
                                  >
                                    {item?.lawyer?.Expertise || 'N/A'}
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Typography sx={{ color: lightTheme.textSecondary }}>—</Typography>
                            )}
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: lightTheme.textPrimary }}>
                            {item?.lawyer?.Expertise || '—'}
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: lightTheme.textPrimary }}>
                            {item.payment?.consultationType || '—'}
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: lightTheme.textPrimary }}>
                            {item.payment?.amount ? `$${item.payment.amount}` : '—'}
                          </StyledTableCell>
                          <StyledTableCell>{getStatusChip(item.payment?.status)}</StyledTableCell>
                          <StyledTableCell sx={{ color: lightTheme.textPrimary }}>
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
                    <Typography variant="h6" sx={{ color: lightTheme.textSecondary }}>
                      {data.length === 0
                        ? 'No data received from API'
                        : 'No appointments found matching your criteria.'}
                    </Typography>
                    {data.length === 0 && (
                      <Typography variant="body2" sx={{ color: lightTheme.textSecondary, mt: 1 }}>
                        Check the console (F12) for API debugging information.
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>
            </CardContent>
          </ElegantCard>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
