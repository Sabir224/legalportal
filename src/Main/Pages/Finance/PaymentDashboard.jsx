'use client';

import { useEffect, useState, useMemo } from 'react';
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
  FormControlLabel,
  Popover,
  FormGroup,
  Checkbox,
} from '@mui/material';
import {
  CalendarToday,
  AttachMoney,
  People,
  Description,
  Search,
  FilterList,
  DateRange,
  Phone,
  Person,
  Work,
  Payment,
  EventBusy,
} from '@mui/icons-material';
import { Today, CalendarMonth, ArrowBack, EventAvailable, History } from '@mui/icons-material';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import { ApiEndPoint } from '../Component/utils/utlis';
import StatCard from './StatCard';
import FilterSection from './FilterSection';
import FilterableHeaderCell from './FilterableHeaderCell';

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
const BLANK_LAWYER = {
  _id: 'blank',
  FkUserId: {
    _id: 'blank-user',
    UserName: '(Blank)',
    Email: '',
    Role: 'lawyer',
    CanManageEverything: false,
    ProfilePicture: null,
    createdAt: null,
    updatedAt: null,
  },
  Contact: '',
  ImagePath: null,
  Position: '',
  YearOfExperience: '',
  ConsultationFee: '',
  Expertise: 'blank',
  Department: '',
  Bio: '',
  Address: '',
  Language: '',
  createdAt: null,
  updatedAt: null,
};

export default function PaymentDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [serviceFilter, setServiceFilter] = useState([]);
  const [consultationTypeFilter, setConsultationTypeFilter] = useState([]);
  const [lawyerFilter, setLawyerFilter] = useState([]);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [openFilter, setOpenFilter] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [methodFilter, setMethodFilter] = useState([]);

  const [filterSearchTerms, setFilterSearchTerms] = useState({
    status: '',
    service: '',
    consultation: '',
    lawyer: '',
    method: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFilter, setActiveFilter] = useState(null);
  // ✅ Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${ApiEndPoint}payments/getAllPaymentData`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data);

          // Default: select all filters initially
          const allServices = [
            ...new Set(result.data.map((i) => i.lawyer?.Expertise || 'blank').filter(Boolean)), // 🟡 include blank
          ];
          const allConsultations = [
            ...new Set(result.data.map((i) => i.payment?.consultationType || 'blank').filter(Boolean)), // 🟡 include blank
          ];
          const allStatuses = [
            ...new Set(result.data.map((i) => i.payment?.status || 'no-booked').filter(Boolean)), // (already had no-booked)
          ];
          const allLawyers = [
            ...new Map(
              result.data.map((i) => {
                if (i.lawyer && i.lawyer._id) {
                  return [i.lawyer._id, i.lawyer];
                }
                return [BLANK_LAWYER._id, BLANK_LAWYER]; // 🟡 inject dummy lawyer
              })
            ).values(),
          ];
          const allMethods = [...new Set(result.data.map((i) => i.payment?.paymentMethod || 'blank'))];

          // ✅ Default select all methods
          setMethodFilter(allMethods);
          setServiceFilter(allServices);
          setConsultationTypeFilter(allConsultations);
          setStatusFilter(allStatuses);
          setLawyerFilter(allLawyers.map((l) => l._id)); // 👈 only IDs
        } else {
          setError('API returned no data or unsuccessful result');
          setData([]);
        }
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Filter the data based on all active filters
  const filteredData = useMemo(() => {
    let filtered = data;

    if (
      statusFilter.length === 0 ||
      serviceFilter.length === 0 ||
      consultationTypeFilter.length === 0 ||
      lawyerFilter.length === 0
    ) {
      return [];
    }

    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const clientName = item.link?.name?.toLowerCase() || '';
        const clientPhone = item.link?.phone || '';
        const lawyerName = item.lawyer?.FkUserId?.UserName?.toLowerCase() || '';
        const serviceType = item.lawyer?.Expertise?.toLowerCase() || '';

        return (
          clientName.includes(searchTerm.toLowerCase()) ||
          clientPhone.includes(searchTerm) ||
          lawyerName.includes(searchTerm.toLowerCase()) ||
          serviceType.includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter((item) => statusFilter.includes(item.payment?.status || 'no-booked'));
    }
    if (serviceFilter.length > 0) {
      filtered = filtered.filter(
        (item) => serviceFilter.includes(item.lawyer?.Expertise || 'blank') // 🟡 include blank
      );
    }
    if (consultationTypeFilter.length > 0) {
      filtered = filtered.filter(
        (item) => consultationTypeFilter.includes(item.payment?.consultationType || 'blank') // 🟡 include blank
      );
    }
    if (lawyerFilter.length > 0) {
      filtered = filtered.filter((item) => lawyerFilter.includes(item.lawyer?._id || BLANK_LAWYER._id));
    }
    if (methodFilter.length > 0) {
      filtered = filtered.filter((item) => methodFilter.includes(item.payment?.paymentMethod || 'blank'));
    }

    if (dateFilter.startDate) {
      const startDate = new Date(dateFilter.startDate);
      filtered = filtered.filter((item) => {
        if (!item.link?.createdAt) return false;
        return new Date(item.link.createdAt) >= startDate;
      });
    }

    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => {
        if (!item.link?.createdAt) return false;
        return new Date(item.link.createdAt) <= endDate;
      });
    }

    return filtered;
  }, [data, searchTerm, statusFilter, serviceFilter, consultationTypeFilter, lawyerFilter, dateFilter]);

  // ✅ Dynamic options with blank
  const getDynamicFilterOptions = (currentFilterType) => {
    let dynamicData = [...data];

    if (
      (currentFilterType !== 'status' && statusFilter.length === 0) ||
      (currentFilterType !== 'service' && serviceFilter.length === 0) ||
      (currentFilterType !== 'consultation' && consultationTypeFilter.length === 0) ||
      (currentFilterType !== 'lawyer' && lawyerFilter.length === 0)
    ) {
      dynamicData = [];
    }

    if (currentFilterType !== 'status' && statusFilter.length > 0) {
      dynamicData = dynamicData.filter((item) => statusFilter.includes(item.payment?.status || 'no-booked'));
    }
    if (currentFilterType !== 'service' && serviceFilter.length > 0) {
      dynamicData = dynamicData.filter((item) => serviceFilter.includes(item.lawyer?.Expertise || 'blank'));
    }
    if (currentFilterType !== 'consultation' && consultationTypeFilter.length > 0) {
      dynamicData = dynamicData.filter((item) =>
        consultationTypeFilter.includes(item.payment?.consultationType || 'blank')
      );
    }
    if (currentFilterType !== 'lawyer' && lawyerFilter.length > 0) {
      dynamicData = dynamicData.filter((item) => lawyerFilter.includes(item.lawyer?._id || 'blank'));
    }
    if (currentFilterType !== 'method' && methodFilter.length > 0) {
      dynamicData = dynamicData.filter((item) => methodFilter.includes(item.payment?.paymentMethod || 'blank'));
    }
    // ✅ ensure blank/no-booked always included
    const availableServices = [...new Set(dynamicData.map((i) => i.lawyer?.Expertise || 'blank').filter(Boolean))];
    if (!availableServices.includes('blank')) availableServices.push('blank');

    const availableConsultations = [
      ...new Set(dynamicData.map((i) => i.payment?.consultationType || 'blank').filter(Boolean)),
    ];
    if (!availableConsultations.includes('blank')) availableConsultations.push('blank');

    const availableStatuses = [...new Set(dynamicData.map((i) => i.payment?.status || 'no-booked'))];
    if (!availableStatuses.includes('no-booked')) availableStatuses.push('no-booked');

    const availableLawyers = [
      ...new Map(
        dynamicData.map((i) => {
          if (i.lawyer && i.lawyer._id) {
            return [i.lawyer._id, i.lawyer];
          }
          return [BLANK_LAWYER._id, BLANK_LAWYER];
        })
      ).values(),
    ];
    if (!availableLawyers.some((l) => l._id === BLANK_LAWYER._id)) {
      availableLawyers.push(BLANK_LAWYER);
    }
    const availableMethods = [...new Set(dynamicData.map((i) => i.payment?.paymentMethod || 'blank'))];
    if (!availableMethods.includes('blank')) availableMethods.push('blank');

    const allServices = [...new Set(data.map((i) => i.lawyer?.Expertise || 'blank').filter(Boolean))];
    const allConsultations = [...new Set(data.map((i) => i.payment?.consultationType || 'blank').filter(Boolean))];
    const allStatuses = [...new Set(data.map((i) => i.payment?.status || 'no-booked'))];
    const allLawyers = [
      ...new Map(
        data.map((i) => {
          if (i.lawyer && i.lawyer._id) {
            return [i.lawyer._id, i.lawyer];
          }
          return [BLANK_LAWYER._id, BLANK_LAWYER]; // 🟡 inject dummy lawyer
        })
      ).values(),
    ];
    const allMethods = [...new Set(data.map((i) => i.payment?.paymentMethod || 'blank'))];

    const buildServiceOptions = () => {
      const baseOptions = currentFilterType === 'service' ? allServices : availableServices;
      return baseOptions.map((service) => ({
        value: service,
        available: availableServices.includes(service),
        selected: serviceFilter.includes(service),
      }));
    };

    const buildConsultationOptions = () => {
      const baseOptions = currentFilterType === 'consultation' ? allConsultations : availableConsultations;
      return baseOptions.map((c) => ({
        value: c,
        available: availableConsultations.includes(c),
        selected: consultationTypeFilter.includes(c),
      }));
    };

    const buildStatusOptions = () => {
      const baseOptions = currentFilterType === 'status' ? allStatuses : availableStatuses;
      return baseOptions.map((s) => ({
        value: s,
        available: availableStatuses.includes(s),
        selected: statusFilter.includes(s),
      }));
    };

    const buildLawyerOptions = () => {
      const baseOptions = currentFilterType === 'lawyer' ? allLawyers : availableLawyers;
      return baseOptions.map((lawyer) => ({
        value: lawyer,
        available: availableLawyers.some((l) => l._id === lawyer._id),
        selected: lawyerFilter.includes(lawyer._id),
      }));
    };
    const buildMethodOptions = () => {
      const baseOptions = currentFilterType === 'method' ? allMethods : availableMethods;
      return baseOptions.map((m) => ({
        value: m,
        available: availableMethods.includes(m),
        selected: methodFilter.includes(m),
      }));
    };
    return {
      services: buildServiceOptions(),
      consultations: buildConsultationOptions(),
      statuses: buildStatusOptions(),
      lawyers: buildLawyerOptions(),
      methods: buildMethodOptions(), // ✅ NEW
    };
  };

  // Handler functions for FilterSection
  const handleSearchChange = (filterKey, value) => {
    setFilterSearchTerms((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleToggleStatus = (value) => {
    setStatusFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleToggleService = (value) => {
    setServiceFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const handleToggleConsultation = (value) => {
    setConsultationTypeFilter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleToggleLawyer = (value) => {
    setLawyerFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };
  // ✅ Toggle single method
  const handleToggleMethod = (value) => {
    setMethodFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  // ✅ Select all methods
  const handleSelectAllMethod = (availableValues) => {
    setMethodFilter(availableValues);
  };

  // ✅ Clear all methods
  const handleClearAllMethod = () => {
    setMethodFilter([]);
  };

  const handleSelectAllStatus = (availableValues) => {
    setStatusFilter(availableValues);
  };

  const handleSelectAllService = (availableValues) => {
    setServiceFilter(availableValues);
  };

  const handleSelectAllConsultation = (availableValues) => {
    setConsultationTypeFilter(availableValues);
  };

  const handleSelectAllLawyer = (availableValues) => {
    setLawyerFilter(availableValues);
  };

  const handleClearAllStatus = () => setStatusFilter([]);
  const handleClearAllService = () => setServiceFilter([]);
  const handleClearAllConsultation = () => setConsultationTypeFilter([]);
  const handleClearAllLawyer = () => setLawyerFilter([]);

  // Get dynamic options for each filter
  const statusOptions = getDynamicFilterOptions('status');
  const serviceOptions = getDynamicFilterOptions('service');
  const consultationOptions = getDynamicFilterOptions('consultation');
  const lawyerOptions = getDynamicFilterOptions('lawyer');
  const methodOptions = getDynamicFilterOptions('method');

  // ✅ Filter handlers
  const handleStatusFilterChange = (status) => {
    setStatusFilter((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  const handleServiceFilterChange = (service) => {
    setServiceFilter((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]));
  };

  const handleConsultationTypeFilterChange = (type) => {
    setConsultationTypeFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const handleLawyerFilterChange = (lawyerId) => {
    setLawyerFilter((prev) => (prev.includes(lawyerId) ? prev.filter((id) => id !== lawyerId) : [...prev, lawyerId]));
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilterSearch = (filterType, searchTerm) => {
    setFilterSearchTerms((prev) => ({
      ...prev,
      [filterType]: searchTerm,
    }));
  };

  const handleDeselectAllStatus = () => {
    setStatusFilter([]);
  };

  const handleDeselectAllService = () => {
    setServiceFilter([]);
  };

  const handleDeselectAllConsultation = () => {
    setConsultationTypeFilter([]);
  };

  const handleDeselectAllLawyer = () => {
    setLawyerFilter([]);
  };

  const handleOpenFilter = (columnKey, event) => {
    setOpenFilter(columnKey);
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setOpenFilter(null);
    setFilterAnchorEl(null);
    setFilterSearchTerms({
      status: '',
      service: '',
      consultation: '',
      lawyer: '',
      method: '',
    });
  };

  // ✅ Stats calculations
  const totalClients = data.length;
  const paidPayments = data.filter((item) => item.payment?.status === 'paid').length;
  const pendingPayments = data.filter((item) => item.payment?.status === 'pending').length;
  const noBookedPayments = data.filter((item) => !item.payment || item.payment?.status === 'not_booked').length;
  const totalRevenue = data
    .filter((item) => item.payment?.status === 'paid')
    .reduce((sum, item) => sum + (item.payment?.amount || 0), 0);

  const getStatusChip = (status) => {
    if (!status) return <Chip label="No Booked" variant="outlined" size="small" sx={{ fontWeight: 600 }} />;

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

  const lightTheme = {
    background: '#f8f9fa',
    accentColor: '#d4af37',
    textPrimary: '#2c3e50',
    textSecondary: '#7f8c8d',
    cardBackground: '#ffffff',
    tableHeaderBg: alpha('#d4af37', 0.08),
    borderColor: '#e9ecef',
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderBottom: `1px solid ${alpha('#d4af37', 0.1)}`,
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

  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Calculate revenue metrics
  const revenueToday = data
    .filter((item) => {
      const paymentDate = item.payment?.createdAt ? new Date(item.payment.createdAt) : null;
      return paymentDate && paymentDate >= startOfToday && item.payment?.status === 'paid';
    })
    .reduce((sum, item) => sum + (item.payment?.amount || 0), 0);

  const revenueThisMonth = data
    .filter((item) => {
      const paymentDate = item.payment?.createdAt ? new Date(item.payment.createdAt) : null;
      return paymentDate && paymentDate >= startOfThisMonth && item.payment?.status === 'paid';
    })
    .reduce((sum, item) => sum + (item.payment?.amount || 0), 0);

  const revenueLastMonth = data
    .filter((item) => {
      const paymentDate = item.payment?.createdAt ? new Date(item.payment.createdAt) : null;
      return (
        paymentDate &&
        paymentDate >= startOfLastMonth &&
        paymentDate <= endOfLastMonth &&
        item.payment?.status === 'paid'
      );
    })
    .reduce((sum, item) => sum + (item.payment?.amount || 0), 0);

  const consultationsToday = data.filter((item) => {
    const paymentDate = item.payment?.createdAt ? new Date(item.payment.createdAt) : null;
    return paymentDate && paymentDate >= startOfToday;
  }).length;

  const consultationsThisMonth = data.filter((item) => {
    const paymentDate = item.payment?.createdAt ? new Date(item.payment.createdAt) : null;
    return paymentDate && paymentDate >= startOfThisMonth;
  }).length;

  const consultationsLastMonth = data.filter((item) => {
    const paymentDate = item.payment?.createdAt ? new Date(item.payment.createdAt) : null;
    return paymentDate && paymentDate >= startOfLastMonth && paymentDate <= endOfLastMonth;
  }).length;

  const prepareGraphData = () => {
    const graphData = [];
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const dayRevenue = data
        .filter((item) => {
          const paymentDate = item.payment?.createdAt ? new Date(item.payment.createdAt) : null;
          return paymentDate && paymentDate >= startOfDay && paymentDate <= endOfDay && item.payment?.status === 'paid';
        })
        .reduce((sum, item) => sum + (item.payment?.amount || 0), 0);

      graphData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayRevenue,
      });
    }

    return graphData;
  };

  const graphData = prepareGraphData();

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

          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 }, flex: '0 0 auto' }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Appointments" value={totalClients} subtitle="Active appointments" icon={People} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Paid Payments"
                value={paidPayments}
                subtitle="Completed transactions"
                icon={AttachMoney}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Payments"
                value={pendingPayments}
                subtitle="Awaiting payment"
                icon={CalendarToday}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={totalRevenue}
                subtitle="From paid consultations"
                icon={Description}
                isCurrency
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="No Booked"
                value={noBookedPayments}
                subtitle="Appointments not booked"
                icon={EventBusy}
              />
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Revenue Last Month"
                value={revenueLastMonth}
                subtitle={`${consultationsLastMonth} consultations`}
                icon={ArrowBack}
                isCurrency
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Revenue This Month"
                value={revenueThisMonth}
                subtitle={`${consultationsThisMonth} consultations`}
                icon={CalendarMonth}
                isCurrency
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Revenue Today"
                value={revenueToday}
                subtitle={`${consultationsToday} consultations`}
                icon={Today}
                isCurrency
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Consultations Last Month"
                value={consultationsLastMonth}
                subtitle={`$${revenueLastMonth.toLocaleString()} revenue`}
                icon={History}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Consultations This Month"
                value={consultationsThisMonth}
                subtitle={`$${revenueThisMonth.toLocaleString()} revenue`}
                icon={DateRange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Consultations Today"
                value={consultationsToday}
                subtitle={`$${revenueToday.toLocaleString()} revenue`}
                icon={EventAvailable}
              />
            </Grid>
          </Grid>
          {/* Revenue Graph */}
          <ElegantCard sx={{ mb: { xs: 2, sm: 3, md: 4 }, p: 2 }}>
            <CardHeader
              title={
                <Typography
                  variant="h6"
                  sx={{
                    color: lightTheme.textPrimary,
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                  }}
                >
                  Revenue Over Last 30 Days
                </Typography>
              }
            />
            <Divider sx={{ borderColor: alpha(lightTheme.accentColor, 0.2) }} />
            <CardContent>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis
                      label={{
                        value: 'AED Amount',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' },
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`AED ${value}`, 'Revenue']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill={lightTheme.accentColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </ElegantCard>
          {/* MAIN AREA - take remaining space and let inner content scroll */}
          <Box sx={{ p: 3, backgroundColor: '#f5f7fa' }}>
            <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
              {/* MAIN AREA - take remaining space and let inner content scroll */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 0,
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
                        </Box>
                      }
                    />

                    {/* Filters Section */}
                    <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
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
                    </Box>

                    <Divider sx={{ borderColor: alpha(lightTheme.accentColor, 0.2) }} />

                    {/* Content */}
                    <CardContent
                      sx={{
                        pt: 0,
                        pb: '50px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                      }}
                    >
                      {loading ? (
                        <Box textAlign="center" py={6}>
                          <Typography variant="h6" sx={{ color: lightTheme.textSecondary }}>
                            Loading data...
                          </Typography>
                        </Box>
                      ) : error ? (
                        <Box textAlign="center" py={6}>
                          <Typography variant="h6" sx={{ color: lightTheme.textSecondary }}>
                            {error}
                          </Typography>
                        </Box>
                      ) : isMobile ? (
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
                                      <Phone fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                      <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                        {item.link?.phone || 'N/A'}
                                      </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Person fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                      <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                        {item.lawyer?.FkUserId?.UserName || 'N/A'}
                                      </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1}>
                                      <Work fontSize="small" sx={{ color: lightTheme.accentColor }} />
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
                                      <Payment fontSize="small" sx={{ color: lightTheme.accentColor }} />
                                      <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                        {item.payment?.paymentMethod ? `${item.payment.paymentMethod}` : '—'}
                                      </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1}>
                                      <CalendarMonth fontSize="small" sx={{ color: lightTheme.accentColor }} />
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
                          {/* Table wrapper */}
                          <Box
                            sx={{
                              flex: 1,
                              width: '100%',
                              maxHeight: '60vh',
                              overflowX: 'auto',
                              overflowY: 'auto',
                            }}
                          >
                            <Table stickyHeader sx={{ minWidth: 600 }}>
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell
                                    sx={{
                                      minWidth: 150,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Client Name
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{
                                      minWidth: 120,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Phone
                                  </StyledTableCell>
                                  <StyledTableCell
                                    sx={{
                                      minWidth: 120,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Email
                                  </StyledTableCell>
                                  <FilterableHeaderCell
                                    label="Lawyer"
                                    minWidth={150}
                                    isActive={lawyerFilter.length > 0}
                                    onClick={(e) => handleOpenFilter('lawyer', e)}
                                  />

                                  <FilterableHeaderCell
                                    label="Service"
                                    minWidth={160}
                                    isActive={serviceFilter.length > 0}
                                    onClick={(e) => handleOpenFilter('service', e)}
                                  />

                                  <FilterableHeaderCell
                                    label="Consultation Type"
                                    minWidth={200}
                                    isActive={consultationTypeFilter.length > 0}
                                    onClick={(e) => handleOpenFilter('consultation', e)}
                                  />

                                  <StyledTableCell
                                    sx={{
                                      minWidth: 120,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Amount
                                  </StyledTableCell>
                                  {/* <StyledTableCell
                                    sx={{
                                      minWidth: 120,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Amount
                                  </StyledTableCell> */}
                                  <FilterableHeaderCell
                                    label="Method"
                                    minWidth={120}
                                    isActive={methodFilter.length > 0}
                                    onClick={(e) => handleOpenFilter('method', e)}
                                  />

                                  <FilterableHeaderCell
                                    label="Status"
                                    minWidth={120}
                                    isActive={statusFilter.length > 0}
                                    onClick={(e) => handleOpenFilter('status', e)}
                                  />

                                  <FilterableHeaderCell
                                    label="Created At"
                                    minWidth={160}
                                    isActive={!!(dateFilter.startDate || dateFilter.endDate)}
                                    onClick={(e) => handleOpenFilter('date', e)}
                                  />
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
                                    <StyledTableCell
                                      sx={{
                                        color: lightTheme.textPrimary,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {item.payment?.email || 'N/A'}
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
            </Box>
            {/* Filter Popover */}

            {openFilter !== null && (
              <Popover
                open={openFilter !== null}
                anchorEl={filterAnchorEl}
                onClose={handleCloseFilter}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                PaperProps={{
                  sx: {
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                    maxWidth: '100%',
                    minWidth: '300px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <Box sx={{ p: 1, width: '280px', color: '#374151' }}>
                  {/* Status Filter */}
                  {openFilter === 'status' && (
                    <Box
                      sx={{ mb: 3 }}
                      // onFocus={() => setActiveFilter('status')}
                      // onMouseEnter={() => setActiveFilter('status')}
                    >
                      <FilterSection
                        title="Status"
                        filterKey="status"
                        filterData={statusOptions.statuses}
                        searchTerm={filterSearchTerms.status}
                        onSearchChange={handleSearchChange}
                        onSelectAll={handleSelectAllStatus}
                        onClearAll={handleClearAllStatus}
                        onToggle={handleToggleStatus}
                        selectedValues={statusFilter}
                        isCurrentFilter={activeFilter === 'status'}
                        getLabel={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                      />
                    </Box>
                  )}

                  {openFilter === 'service' && (
                    <Box
                      sx={{ mb: 3 }}
                      // onFocus={() => setActiveFilter('service')}
                      // onMouseEnter={() => setActiveFilter('service')}
                    >
                      <FilterSection
                        title="Services"
                        filterKey="service"
                        filterData={serviceOptions.services}
                        searchTerm={filterSearchTerms.service}
                        onSearchChange={handleSearchChange}
                        onSelectAll={handleSelectAllService}
                        onClearAll={handleClearAllService}
                        onToggle={handleToggleService}
                        selectedValues={serviceFilter}
                        isCurrentFilter={activeFilter === 'service'}
                        getLabel={(value) => value}
                      />
                    </Box>
                  )}

                  {openFilter === 'consultation' && (
                    <Box
                      sx={{ mb: 3 }}
                      // onFocus={() => setActiveFilter('consultation')}
                      // onMouseEnter={() => setActiveFilter('consultation')}
                    >
                      <FilterSection
                        title="Consultation Types"
                        filterKey="consultation"
                        filterData={consultationOptions.consultations}
                        searchTerm={filterSearchTerms.consultation}
                        onSearchChange={handleSearchChange}
                        onSelectAll={handleSelectAllConsultation}
                        onClearAll={handleClearAllConsultation}
                        onToggle={handleToggleConsultation}
                        selectedValues={consultationTypeFilter}
                        isCurrentFilter={activeFilter === 'consultation'}
                        getLabel={(value) => value}
                      />
                    </Box>
                  )}

                  {openFilter === 'lawyer' && (
                    <Box
                      sx={{ mb: 3 }}
                      // onFocus={() => setActiveFilter('lawyer')}
                      // onMouseEnter={() => setActiveFilter('lawyer')}
                    >
                      <FilterSection
                        title="Lawyers"
                        filterKey="lawyer"
                        filterData={lawyerOptions.lawyers}
                        searchTerm={filterSearchTerms.lawyer}
                        onSearchChange={handleSearchChange}
                        onSelectAll={handleSelectAllLawyer}
                        onClearAll={handleClearAllLawyer}
                        onToggle={handleToggleLawyer}
                        selectedValues={lawyerFilter}
                        isCurrentFilter={activeFilter === 'lawyer'}
                        getLabel={(lawyer) => lawyer.FkUserId?.UserName || lawyer.UserName || 'Unknown Lawyer'}
                      />
                    </Box>
                  )}
                  {openFilter === 'method' && (
                    <Box sx={{ mb: 3 }}>
                      <FilterSection
                        title="Method"
                        filterKey="method"
                        filterData={methodOptions.methods} // replace with your method options from getDynamicFilterOptions
                        searchTerm={filterSearchTerms.method}
                        onSearchChange={handleSearchChange}
                        onSelectAll={handleSelectAllMethod} // implement this function similar to others
                        onClearAll={handleClearAllMethod} // implement this function similar to others
                        onToggle={handleToggleMethod} // implement this function similar to others
                        selectedValues={methodFilter}
                        isCurrentFilter={activeFilter === 'method'}
                        getLabel={(value) => (value === 'Blank' ? 'Blank' : value)}
                      />
                    </Box>
                  )}

                  {/* Date Filter */}
                  {openFilter === 'date' && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: '#d4af37', fontWeight: 600 }}>
                        Filter by Date Range
                      </Typography>

                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                          <DatePicker
                            label="Start Date"
                            value={dateFilter.startDate ? new Date(dateFilter.startDate) : null}
                            onChange={(newValue) =>
                              handleDateFilterChange('startDate', newValue ? newValue.toISOString() : '')
                            }
                            format="dd/MM/yyyy"
                            slotProps={{
                              textField: {
                                size: 'small',
                                sx: {
                                  '& .MuiInputBase-root': {
                                    background: '#f9fafb',
                                    color: '#374151',
                                  },
                                  '& input': { color: '#374151' },
                                  '& .MuiInputLabel-root': { color: '#d4af37' },
                                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
                                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                                  '& .MuiSvgIcon-root': { color: '#d4af37' },
                                },
                              },
                            }}
                          />

                          <DatePicker
                            label="End Date"
                            value={dateFilter.endDate ? new Date(dateFilter.endDate) : null}
                            onChange={(newValue) =>
                              handleDateFilterChange('endDate', newValue ? newValue.toISOString() : '')
                            }
                            format="dd/MM/yyyy"
                            slotProps={{
                              textField: {
                                size: 'small',
                                sx: {
                                  '& .MuiInputBase-root': {
                                    background: '#f9fafb',
                                    color: '#374151',
                                  },
                                  '& input': { color: '#374151' },
                                  '& .MuiInputLabel-root': { color: '#d4af37' },
                                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
                                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d4af37' },
                                  '& .MuiSvgIcon-root': { color: '#d4af37' },
                                },
                              },
                            }}
                          />
                        </Box>
                      </LocalizationProvider>

                      <Button
                        size="small"
                        onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                        sx={{
                          mt: 2,
                          backgroundColor: '#d4af37',
                          color: '#ffffff',
                          fontWeight: 600,
                          borderRadius: '8px',
                          textTransform: 'none',
                          '&:hover': { backgroundColor: '#b8941f' },
                        }}
                      >
                        Clear Date Filter
                      </Button>
                    </>
                  )}
                </Box>
              </Popover>
            )}
          </Box>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
