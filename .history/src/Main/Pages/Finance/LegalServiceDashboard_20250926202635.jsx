'use client';
import jsPDF from 'jspdf';

import logo from '../../Pages/Images/logo.png';
import React, { useEffect, useState, useMemo } from 'react';
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
  Stack,
  Collapse,
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
  ExpandLess,
  ExpandMore,
  Email,
  Business,
} from '@mui/icons-material';
import { Today, CalendarMonth, ArrowBack, EventAvailable, History } from '@mui/icons-material';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import { ApiEndPoint, formatAvailability } from '../Component/utils/utlis';
import StatCard from './StatCard';
import FilterSection from './FilterSection';
import FilterableHeaderCell from './FilterableHeaderCell';
import { minWidth } from '@mui/system';
import { CheckCircleIcon, Receipt } from 'lucide-react';
import PaymentConfirmationDialog from './PaymentConfirmationDailog';
import axios from 'axios';
const lightTheme = {
  background: '#f8f9fa',
  accentColor: '#d4af37',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  cardBackground: '#ffffff',
  tableHeaderBg: alpha('#d4af37', 0.08),
  borderColor: '#e9ecef',
};

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

export default function LegalServicesDashboard() {
  // State management - FIXED: Corrected the initial state structure
  const [data, setData] = useState([]); // This should contain the cases array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [totals, setTotals] = useState({});

  // Filter states
  const [openFilter, setOpenFilter] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [actionItemFilter, setActionItemFilter] = useState([]);
  const [nameFilter, setNameFilter] = useState([]);
  const [emailFilter, setEmailFilter] = useState([]);
  const [phoneFilter, setPhoneFilter] = useState([]);
  const [caseIdFilter, setCaseIdFilter] = useState([]);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [expandedRows, setExpandedRows] = useState({});

  const [filterSearchTerms, setFilterSearchTerms] = useState({
    status: '',
    actionItem: '',
    name: '',
    email: '',
    phone: '',
    caseId: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data for development
  const mockData = {
    success: true,
    data: {
      cases: [
        {
          _id: '68d3e16f415569d2fe039dd7',
          caseId: 'C-1002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '9876543210',
          status: 'partial',
          LFA: 'Legal Fee Agreement',
          serviceValue: 15000,
          invoicedAmount: 15000,
          hasInvoice: false,
          receivedAmount: 3000,
          actionItem: 'active',
          paymentSubitems: [
            {
              dueDate: '2025-10-05T00:00:00.000Z',
              paymentDate: null,
              invoicedAmount: 7000,
              receivedAmount: 3000,
              paymentStatus: 'partial',
              paymentMethod: 'credit_card',
              transactionId: 'CC-98765',
              notes: 'First installment',
              _id: '68d3e16f415569d2fe039dd8',
              pendingAmount: 4000,
            },
            {
              dueDate: '2025-11-05T00:00:00.000Z',
              paymentDate: null,
              invoicedAmount: 8000,
              receivedAmount: 0,
              paymentStatus: 'pending',
              paymentMethod: 'bank_transfer',
              transactionId: null,
              notes: 'Second installment',
              _id: '68d3e16f415569d2fe039dd9',
              pendingAmount: 8000,
            },
          ],
          pendingAmount: 12000,
          createdAt: '2025-09-24T12:17:51.212Z',
          updatedAt: '2025-09-24T12:17:51.227Z',
        },
      ],
      totals: {
        invoiced: 15000,
        received: 3000,
        pending: 12000,
      },
      summary: {
        revenueLastMonth: 0,
        revenueThisMonth: 3000,
        revenueToday: 3000,
        bookingsLastMonth: 0,
        bookingsThisMonth: 1,
        bookingsToday: 1,
      },
      graph: [{ day: 24, amount: 3000 }],
    },
  };
  // ✅ Normalizers - Handle null/undefined values safely
  const normalizeCaseId = (id) => (!id ? 'blank' : String(id).trim().toLowerCase());
  const normalizeName = (name) => (!name ? 'blank' : String(name).trim().toLowerCase());
  const normalizeEmail = (email) => (!email ? 'blank' : String(email).trim().toLowerCase());
  const normalizePhone = (phone) => (!phone ? 'blank' : String(phone).replace(/\D/g, ''));
  const normalizeStatus = (status) => (!status ? 'blank' : String(status).trim().toLowerCase());
  const normalizeActionItem = (action) => (!action ? 'blank' : String(action).trim().toLowerCase());
  // Fetch data - FIXED: Correct data structure assignment
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${ApiEndPoint}legal-services`);

        const result = response.data;

        if (result.success && result.data) {
          const { cases = [], totals = {}, summary = {}, graph = [] } = result.data;

          setData(cases);
          setTotals(totals);
          setSummary(summary);
          setGraphData(graph);

          // Build distinct normalized sets
          const allCaseIds = [...new Set(cases.map((i) => normalizeCaseId(i.caseId)))];
          const allNames = [...new Set(cases.map((i) => normalizeName(i.name)))];
          const allEmails = [...new Set(cases.map((i) => normalizeEmail(i.email)))];
          const allPhones = [...new Set(cases.map((i) => normalizePhone(i.phone)))];
          const allStatuses = [...new Set(cases.map((i) => normalizeStatus(i.status)))];
          const allActionItems = [...new Set(cases.map((i) => normalizeActionItem(i.actionItem)))];

          // Default: select all
          setCaseIdFilter(allCaseIds);
          setNameFilter(allNames);
          setEmailFilter(allEmails);
          setPhoneFilter(allPhones);
          setStatusFilter(allStatuses);
          setActionItemFilter(allActionItems);
        } else {
          setError('API returned no data');
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

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Require at least one filter in each group
    if (
      caseIdFilter.length === 0 ||
      nameFilter.length === 0 ||
      emailFilter.length === 0 ||
      phoneFilter.length === 0 ||
      statusFilter.length === 0 ||
      actionItemFilter.length === 0
    ) {
      return [];
    }

    let filtered = data;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          (item.caseId && item.caseId.toLowerCase().includes(q)) ||
          (item.name && item.name.toLowerCase().includes(q)) ||
          (item.email && item.email.toLowerCase().includes(q)) ||
          (item.phone && item.phone.includes(searchTerm))
      );
    }

    if (caseIdFilter.length > 0) {
      filtered = filtered.filter((item) => caseIdFilter.includes(normalizeCaseId(item.caseId)));
    }

    if (nameFilter.length > 0) {
      filtered = filtered.filter((item) => nameFilter.includes(normalizeName(item.name)));
    }

    if (emailFilter.length > 0) {
      filtered = filtered.filter((item) => emailFilter.includes(normalizeEmail(item.email)));
    }

    if (phoneFilter.length > 0) {
      filtered = filtered.filter((item) => phoneFilter.includes(normalizePhone(item.phone)));
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter((item) => statusFilter.includes(normalizeStatus(item.status)));
    }

    if (actionItemFilter.length > 0) {
      filtered = filtered.filter((item) => actionItemFilter.includes(normalizeActionItem(item.actionItem)));
    }

    return filtered;
  }, [data, searchTerm, caseIdFilter, nameFilter, emailFilter, phoneFilter, statusFilter, actionItemFilter]);

  // FIXED: Simplified getDynamicFilterOptions function
  const getDynamicFilterOptions = (currentFilterType) => {
    let dynamicData = [...data];

    // If any other filter group is empty → zero out
    if (
      (currentFilterType !== 'caseId' && caseIdFilter.length === 0) ||
      (currentFilterType !== 'name' && nameFilter.length === 0) ||
      (currentFilterType !== 'email' && emailFilter.length === 0) ||
      (currentFilterType !== 'phone' && phoneFilter.length === 0) ||
      (currentFilterType !== 'status' && statusFilter.length === 0) ||
      (currentFilterType !== 'actionItem' && actionItemFilter.length === 0)
    ) {
      dynamicData = [];
    }

    // Apply filters except current
    if (currentFilterType !== 'caseId' && caseIdFilter.length > 0) {
      dynamicData = dynamicData.filter((i) => caseIdFilter.includes(normalizeCaseId(i.caseId)));
    }
    if (currentFilterType !== 'name' && nameFilter.length > 0) {
      dynamicData = dynamicData.filter((i) => nameFilter.includes(normalizeName(i.name)));
    }
    if (currentFilterType !== 'email' && emailFilter.length > 0) {
      dynamicData = dynamicData.filter((i) => emailFilter.includes(normalizeEmail(i.email)));
    }
    if (currentFilterType !== 'phone' && phoneFilter.length > 0) {
      dynamicData = dynamicData.filter((i) => phoneFilter.includes(normalizePhone(i.phone)));
    }
    if (currentFilterType !== 'status' && statusFilter.length > 0) {
      dynamicData = dynamicData.filter((i) => statusFilter.includes(normalizeStatus(i.status)));
    }
    if (currentFilterType !== 'actionItem' && actionItemFilter.length > 0) {
      dynamicData = dynamicData.filter((i) => actionItemFilter.includes(normalizeActionItem(i.actionItem)));
    }

    // Build option sets
    const availableCaseIds = [...new Set(dynamicData.map((i) => normalizeCaseId(i.caseId)))];
    const availableNames = [...new Set(dynamicData.map((i) => normalizeName(i.name)))];
    const availableEmails = [...new Set(dynamicData.map((i) => normalizeEmail(i.email)))];
    const availablePhones = [...new Set(dynamicData.map((i) => normalizePhone(i.phone)))];
    const availableStatuses = [...new Set(dynamicData.map((i) => normalizeStatus(i.status)))];
    const availableActionItems = [...new Set(dynamicData.map((i) => normalizeActionItem(i.actionItem)))];

    const allCaseIds = [...new Set(data.map((i) => normalizeCaseId(i.caseId)))];
    const allNames = [...new Set(data.map((i) => normalizeName(i.name)))];
    const allEmails = [...new Set(data.map((i) => normalizeEmail(i.email)))];
    const allPhones = [...new Set(data.map((i) => normalizePhone(i.phone)))];
    const allStatuses = [...new Set(data.map((i) => normalizeStatus(i.status)))];
    const allActionItems = [...new Set(data.map((i) => normalizeActionItem(i.actionItem)))];

    const buildOptions = (base, available, selected) =>
      base.map((v) => ({
        value: v,
        available: available.includes(v),
        selected: selected.includes(v),
      }));

    return {
      caseIds: buildOptions(
        currentFilterType === 'caseId' ? allCaseIds : availableCaseIds,
        availableCaseIds,
        caseIdFilter
      ),
      names: buildOptions(currentFilterType === 'name' ? allNames : availableNames, availableNames, nameFilter),
      emails: buildOptions(currentFilterType === 'email' ? allEmails : availableEmails, availableEmails, emailFilter),
      phones: buildOptions(currentFilterType === 'phone' ? allPhones : availablePhones, availablePhones, phoneFilter),
      statuses: buildOptions(
        currentFilterType === 'status' ? allStatuses : availableStatuses,
        availableStatuses,
        statusFilter
      ),
      actionItems: buildOptions(
        currentFilterType === 'actionItem' ? allActionItems : availableActionItems,
        availableActionItems,
        actionItemFilter
      ),
    };
  };

  const caseIdOptions = getDynamicFilterOptions('caseId');
  const nameOptions = getDynamicFilterOptions('name');
  const emailOptions = getDynamicFilterOptions('email');
  const phoneOptions = getDynamicFilterOptions('phone');
  const statusOptions = getDynamicFilterOptions('status');
  const actionItemOptions = getDynamicFilterOptions('actionItem');

  // Filter toggle handlers
  const handleToggleCaseId = (value) => {
    setCaseIdFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleSelectAllCaseId = () => {
    if (data && data.length > 0) {
      setCaseIdFilter([...new Set(data.map((i) => normalizeCaseId(i.caseId)))]);
    }
  };

  const handleClearAllCaseId = () => {
    setCaseIdFilter([]);
  };

  const handleToggleName = (value) => {
    setNameFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleSelectAllName = () => {
    if (data && data.length > 0) {
      setNameFilter([...new Set(data.map((i) => normalizeName(i.name)))]);
    }
  };

  const handleClearAllName = () => {
    setNameFilter([]);
  };

  const handleToggleEmail = (value) => {
    setEmailFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleSelectAllEmail = () => {
    if (data && data.length > 0) {
      setEmailFilter([...new Set(data.map((i) => normalizeEmail(i.email)))]);
    }
  };

  const handleClearAllEmail = () => {
    setEmailFilter([]);
  };

  const handleTogglePhone = (value) => {
    setPhoneFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleSelectAllPhone = () => {
    if (data && data.length > 0) {
      setPhoneFilter([...new Set(data.map((i) => normalizePhone(i.phone)))]);
    }
  };

  const handleClearAllPhone = () => {
    setPhoneFilter([]);
  };

  const handleToggleStatus = (value) => {
    setStatusFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleSelectAllStatus = () => {
    if (data && data.length > 0) {
      setStatusFilter([...new Set(data.map((i) => normalizeStatus(i.status)))]);
    }
  };

  const handleClearAllStatus = () => {
    setStatusFilter([]);
  };

  const handleToggleActionItem = (value) => {
    setActionItemFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleSelectAllActionItem = () => {
    if (data && data.length > 0) {
      setActionItemFilter([...new Set(data.map((i) => normalizeActionItem(i.actionItem)))]);
    }
  };

  const handleClearAllActionItem = () => {
    setActionItemFilter([]);
  };

  // Status chip component
  const getStatusChip = (status) => {
    const statusConfig = {
      paid: { label: 'Paid', color: 'success' },
      partial: { label: 'Partial', color: 'warning' },
      pending: { label: 'Pending', color: 'error' },
      unpaid: { label: 'Unpaid', color: 'default' },
    };

    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600 }} />;
  };

  // Handler functions
  const handleSearchChange = (filterKey, value) => {
    setFilterSearchTerms((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
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
      actionItem: '',
      name: '',
      email: '',
      phone: '',
      caseId: '',
    });
  };
  const toggleRowExpansion = (caseId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [caseId]: !prev[caseId],
    }));
  };

  // Filter handlers
  const filterHandlers = {
    status: {
      toggle: (value) =>
        setStatusFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])),
      selectAll: (values) => setStatusFilter(values),
      clearAll: () => setStatusFilter([]),
    },
    actionItem: {
      toggle: (value) =>
        setActionItemFilter((prev) =>
          prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        ),
      selectAll: (values) => setActionItemFilter(values),
      clearAll: () => setActionItemFilter([]),
    },
    name: {
      toggle: (value) =>
        setNameFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])),
      selectAll: (values) => setNameFilter(values),
      clearAll: () => setNameFilter([]),
    },
    email: {
      toggle: (value) =>
        setEmailFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])),
      selectAll: (values) => setEmailFilter(values),
      clearAll: () => setEmailFilter([]),
    },
    phone: {
      toggle: (value) =>
        setPhoneFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])),
      selectAll: (values) => setPhoneFilter(values),
      clearAll: () => setPhoneFilter([]),
    },
    caseId: {
      toggle: (value) =>
        setCaseIdFilter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value])),
      selectAll: (values) => setCaseIdFilter(values),
      clearAll: () => setCaseIdFilter([]),
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
            Loading legal services data...
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
          {/* Title Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: { xs: 2, sm: 3, md: 4 },
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <Business
              sx={{
                color: lightTheme.accentColor,
                fontSize: { xs: 24, sm: 28, md: 32 },
                flexShrink: 0,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                color: lightTheme.textPrimary,
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                whiteSpace: { xs: 'normal', sm: 'nowrap' },
              }}
            >
              Legal Services Dashboard
            </Typography>
          </Box>

          {/* Summary Statistics */}
          <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Revenue Last Month"
                value={summary.revenueLastMonth || 0}
                subtitle={`${summary.bookingsLastMonth || 0} services`}
                icon={ArrowBack}
                isCurrency
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Revenue This Month"
                value={summary.revenueThisMonth || 0}
                subtitle={`${summary.bookingsThisMonth || 0} services`}
                icon={CalendarMonth}
                isCurrency
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Revenue Today"
                value={summary.revenueToday || 0}
                subtitle={`${summary.bookingsToday || 0} services`}
                icon={Today}
                isCurrency
              />
            </Grid>
            {/* Revenue */}
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Revenue Last Month"
                value={summary.revenueLastMonth || 0}
                subtitle=""
                icon={ArrowBack}
                isCurrency
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Revenue This Month"
                value={summary.revenueThisMonth || 0}
                subtitle=""
                icon={CalendarMonth}
                isCurrency
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard title="Revenue Today" value={summary.revenueToday || 0} subtitle="" icon={Today} isCurrency />
            </Grid>

            {/* Bookings */}
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Legal Services Booked Last Month"
                value={summary.bookingsLastMonth || 0}
                subtitle="Services"
                icon={Receipt}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Legal Services Booked This Month"
                value={summary.bookingsThisMonth || 0}
                subtitle="Services"
                icon={Receipt}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Legal Services Booked Today"
                value={summary.bookingsToday || 0}
                subtitle="Services"
                icon={Receipt}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Total Invoiced"
                value={totals.invoiced || 0}
                subtitle="All legal services"
                icon={Receipt}
                isCurrency
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Total Received"
                value={totals.received || 0}
                subtitle="Payments received"
                icon={AttachMoney}
                isCurrency
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <StatCard
                title="Total Pending"
                value={totals.pending || 0}
                subtitle="Awaiting payment"
                icon={CalendarToday}
                isCurrency
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
                  Legal Services Revenue
                </Typography>
              }
            />
            <Divider sx={{ borderColor: alpha(lightTheme.accentColor, 0.2) }} />
            <CardContent>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* Format date labels */}
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) =>
                        new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      }
                    />

                    <YAxis
                      label={{
                        value: 'AED Amount',
                        angle: -90,
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' },
                      }}
                      tick={{ fontSize: 12 }}
                    />

                    {/* Tooltip with formatted date + revenue */}
                    <Tooltip
                      formatter={(value) => [`AED ${value}`, 'Revenue']}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      }
                    />

                    <Legend />

                    <Bar dataKey="revenue" name="Revenue" fill={lightTheme.accentColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </ElegantCard>

          {/* Main Data Table */}
          <ElegantCard sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
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
                      Legal Services Cases
                    </Typography>
                    <Chip
                      label={`${filteredData.length} of ${data.length}`}
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

            {/* Search */}
            <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
              <TextField
                fullWidth
                placeholder="Search by case ID, name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
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
                  '& .MuiInputBase-input': {
                    padding: { xs: '10px', sm: '12px' },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  },
                  '& .MuiSvgIcon-root': {
                    color: lightTheme.accentColor,
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
                          : 'No legal services found matching your criteria.'}
                      </Typography>
                    </Box>
                  ) : (
                    filteredData.map((item) => (
                      <ElegantCard key={item._id}>
                        <CardContent sx={{ p: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: lightTheme.textPrimary }}>
                              {item.caseId} - {item.name}
                            </Typography>
                            {getStatusChip(item.status)}
                          </Box>

                          <Box display="flex" flexDirection="column" gap={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Email fontSize="small" sx={{ color: lightTheme.accentColor }} />
                              <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                {item.email}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                              <Phone fontSize="small" sx={{ color: lightTheme.accentColor }} />
                              <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                {item.phone}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                              <AttachMoney fontSize="small" sx={{ color: lightTheme.accentColor }} />
                              <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                Service: ${item.serviceValue} | Received: ${item.receivedAmount} | Pending: $
                                {item.pendingAmount}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                              <Work fontSize="small" sx={{ color: lightTheme.accentColor }} />
                              <Typography variant="body2" sx={{ color: lightTheme.textPrimary }}>
                                {item.actionItem}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Payment Subitems */}
                          {item.paymentSubitems && item.paymentSubitems.length > 0 && (
                            <Box mt={2}>
                              <Typography variant="subtitle2" sx={{ color: lightTheme.textPrimary, mb: 1 }}>
                                Payment Details:
                              </Typography>
                              {item.paymentSubitems.map((subitem) => (
                                <Box
                                  key={subitem._id}
                                  sx={{
                                    p: 1,
                                    mb: 1,
                                    backgroundColor: alpha(lightTheme.accentColor, 0.05),
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                                    Due: {new Date(subitem.dueDate).toLocaleDateString()} | Invoiced: $
                                    {subitem.invoicedAmount} | Received: ${subitem.receivedAmount} | Status:{' '}
                                    {subitem.paymentStatus}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
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
                  <Box
                    sx={{
                      flex: 1,
                      width: '100%',
                      maxHeight: '60vh',
                      overflowX: 'auto',
                      overflowY: 'auto',
                    }}
                  >
                    <Table stickyHeader sx={{ minWidth: 1200 }}>
                      <TableHead>
                        <TableRow>
                          <FilterableHeaderCell
                            label="Case ID"
                            minWidth={120}
                            isActive={caseIdFilter.length < data.length}
                            onClick={(e) => handleOpenFilter('caseId', e)}
                          />
                          <FilterableHeaderCell
                            label="Name"
                            minWidth={150}
                            isActive={nameFilter.length < data.length}
                            onClick={(e) => handleOpenFilter('name', e)}
                          />
                          <FilterableHeaderCell
                            label="Email"
                            minWidth={180}
                            isActive={emailFilter.length < data.length}
                            onClick={(e) => handleOpenFilter('email', e)}
                          />
                          <FilterableHeaderCell
                            label="Phone"
                            minWidth={120}
                            isActive={phoneFilter.length < data.length}
                            onClick={(e) => handleOpenFilter('phone', e)}
                          />
                          <FilterableHeaderCell
                            label="Status"
                            minWidth={100}
                            isActive={statusFilter.length < new Set(data.map((i) => normalizeStatus(i.status))).size}
                            onClick={(e) => handleOpenFilter('status', e)}
                          />
                          <StyledTableCell
                            sx={{
                              minWidth: 120,
                              backgroundColor: lightTheme.textPrimary,
                              color: lightTheme.background,
                            }}
                          >
                            LFA
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              minWidth: 120,
                              backgroundColor: lightTheme.textPrimary,
                              color: lightTheme.background,
                            }}
                          >
                            Service Value
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              minWidth: 140,
                              backgroundColor: lightTheme.textPrimary,
                              color: lightTheme.background,
                            }}
                          >
                            Invoiced Amount
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              minWidth: 120,
                              backgroundColor: lightTheme.textPrimary,
                              color: lightTheme.background,
                            }}
                          >
                            Invoice
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              minWidth: 180,
                              backgroundColor: lightTheme.textPrimary,
                              color: lightTheme.background,
                            }}
                          >
                            Received Amount
                          </StyledTableCell>
                          <StyledTableCell
                            sx={{
                              minWidth: 180,
                              backgroundColor: lightTheme.textPrimary,
                              color: lightTheme.background,
                            }}
                          >
                            Pending Amount
                          </StyledTableCell>
                          <FilterableHeaderCell
                            label="Action Item"
                            minWidth={120}
                            isActive={
                              actionItemFilter.length < new Set(data.map((i) => normalizeActionItem(i.actionItem))).size
                            }
                            onClick={(e) => handleOpenFilter('actionItem', e)}
                          />
                          <StyledTableCell
                            sx={{ minWidth: 80, backgroundColor: lightTheme.textPrimary, color: lightTheme.background }}
                          >
                            Details
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {filteredData.map((item) => (
                          <React.Fragment key={item._id}>
                            <StyledTableRow hover>
                              <StyledTableCell>
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  sx={{ color: lightTheme.textPrimary, fontSize: '0.875rem' }}
                                >
                                  {item.caseId}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  sx={{ color: lightTheme.textPrimary, fontSize: '0.875rem' }}
                                >
                                  {item.name}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell sx={{ color: lightTheme.textPrimary, fontSize: '0.875rem' }}>
                                {item.email}
                              </StyledTableCell>
                              <StyledTableCell sx={{ color: lightTheme.textPrimary, fontSize: '0.875rem' }}>
                                {item.phone}
                              </StyledTableCell>
                              <StyledTableCell>{getStatusChip(item.status)}</StyledTableCell>
                              <StyledTableCell sx={{ color: lightTheme.textPrimary, fontSize: '0.875rem' }}>
                                {item.LFA}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ color: lightTheme.textPrimary, fontSize: '0.875rem', fontWeight: 600 }}
                              >
                                ${item.serviceValue?.toLocaleString()}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ color: lightTheme.textPrimary, fontSize: '0.875rem', fontWeight: 600 }}
                              >
                                ${item.invoicedAmount?.toLocaleString()}
                              </StyledTableCell>
                              <StyledTableCell>
                                {item.hasInvoice ? (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                  >
                                    View Invoice
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                  >
                                    Create Invoice
                                  </Button>
                                )}
                              </StyledTableCell>
                              <StyledTableCell sx={{ color: 'green', fontSize: '0.875rem', fontWeight: 600 }}>
                                ${item.receivedAmount?.toLocaleString()}
                              </StyledTableCell>
                              <StyledTableCell sx={{ color: 'orange', fontSize: '0.875rem', fontWeight: 600 }}>
                                ${item.pendingAmount?.toLocaleString()}
                              </StyledTableCell>
                              <StyledTableCell>
                                <Chip
                                  label={item.actionItem}
                                  color={item.actionItem === 'active' ? 'success' : 'default'}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => toggleRowExpansion(item._id)}
                                  sx={{ color: lightTheme.accentColor }}
                                >
                                  {expandedRows[item._id] ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                              </StyledTableCell>
                            </StyledTableRow>

                            {/* Expanded Payment Subitems */}
                            <StyledTableRow>
                              <StyledTableCell colSpan={13} sx={{ py: 0, border: 0 }}>
                                <Collapse in={expandedRows[item._id]} timeout="auto" unmountOnExit>
                                  <Box sx={{ margin: 2 }}>
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      component="div"
                                      sx={{ color: lightTheme.textPrimary }}
                                    >
                                      Payment Details
                                    </Typography>
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Due Date
                                          </StyledTableCell>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Payment Date
                                          </StyledTableCell>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Invoiced Amount
                                          </StyledTableCell>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Received Amount
                                          </StyledTableCell>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Pending Amount
                                          </StyledTableCell>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Payment Status
                                          </StyledTableCell>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Payment Method
                                          </StyledTableCell>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Transaction ID
                                          </StyledTableCell>
                                          <StyledTableCell
                                            sx={{
                                              backgroundColor: alpha(lightTheme.accentColor, 0.1),
                                              fontWeight: 600,
                                            }}
                                          >
                                            Notes
                                          </StyledTableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {item.paymentSubitems?.map((subitem) => (
                                          <TableRow key={subitem._id}>
                                            <StyledTableCell>
                                              {new Date(subitem.dueDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                              })}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                              {subitem.paymentDate
                                                ? new Date(subitem.paymentDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                  })
                                                : 'N/A'}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ fontWeight: 600 }}>
                                              ${subitem.invoicedAmount?.toLocaleString()}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ color: 'green', fontWeight: 600 }}>
                                              ${subitem.receivedAmount?.toLocaleString()}
                                            </StyledTableCell>
                                            <StyledTableCell sx={{ color: 'orange', fontWeight: 600 }}>
                                              ${subitem.pendingAmount?.toLocaleString()}
                                            </StyledTableCell>
                                            <StyledTableCell>{getStatusChip(subitem.paymentStatus)}</StyledTableCell>
                                            <StyledTableCell>
                                              {subitem.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}
                                            </StyledTableCell>
                                            <StyledTableCell>{subitem.transactionId || 'N/A'}</StyledTableCell>
                                            <StyledTableCell>{subitem.notes || 'N/A'}</StyledTableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                </Collapse>
                              </StyledTableCell>
                            </StyledTableRow>
                          </React.Fragment>
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
                          : 'No legal services found matching your criteria.'}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}
            </CardContent>
          </ElegantCard>

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
                {openFilter === 'caseId' && (
                  <FilterSection
                    title="Case ID"
                    filterKey="caseId"
                    filterData={caseIdOptions.caseIds}
                    searchTerm={filterSearchTerms.caseId}
                    onSearchChange={handleSearchChange}
                    onSelectAll={handleSelectAllCaseId}
                    onClearAll={handleClearAllCaseId}
                    onToggle={handleToggleCaseId}
                    selectedValues={caseIdFilter}
                    isCurrentFilter={openFilter === 'caseId'}
                    getLabel={(value) => value}
                  />
                )}
                {openFilter === 'name' && (
                  <FilterSection
                    title="Name"
                    filterKey="name"
                    filterData={nameOptions.names}
                    searchTerm={filterSearchTerms.name}
                    onSearchChange={handleSearchChange}
                    onSelectAll={handleSelectAllName}
                    onClearAll={handleClearAllName}
                    onToggle={handleToggleName}
                    selectedValues={nameFilter}
                    isCurrentFilter={openFilter === 'name'}
                    getLabel={(value) => value}
                  />
                )}
                {openFilter === 'email' && (
                  <FilterSection
                    title="Email"
                    filterKey="email"
                    filterData={emailOptions.emails}
                    searchTerm={filterSearchTerms.email}
                    onSearchChange={handleSearchChange}
                    onSelectAll={handleSelectAllEmail}
                    onClearAll={handleClearAllEmail}
                    onToggle={handleToggleEmail}
                    selectedValues={emailFilter}
                    isCurrentFilter={openFilter === 'email'}
                    getLabel={(value) => value}
                  />
                )}
                {openFilter === 'phone' && (
                  <FilterSection
                    title="Phone"
                    filterKey="phone"
                    filterData={phoneOptions.phones}
                    searchTerm={filterSearchTerms.phone}
                    onSearchChange={handleSearchChange}
                    onSelectAll={handleSelectAllPhone}
                    onClearAll={handleClearAllPhone}
                    onToggle={handleTogglePhone}
                    selectedValues={phoneFilter}
                    isCurrentFilter={openFilter === 'phone'}
                    getLabel={(value) => value}
                  />
                )}
                {openFilter === 'status' && (
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
                    isCurrentFilter={openFilter === 'status'}
                    getLabel={(value) => value}
                  />
                )}
                {openFilter === 'actionItem' && (
                  <FilterSection
                    title="Action Item"
                    filterKey="actionItem"
                    filterData={actionItemOptions.actionItems}
                    searchTerm={filterSearchTerms.actionItem}
                    onSearchChange={handleSearchChange}
                    onSelectAll={handleSelectAllActionItem}
                    onClearAll={handleClearAllActionItem}
                    onToggle={handleToggleActionItem}
                    selectedValues={actionItemFilter}
                    isCurrentFilter={openFilter === 'actionItem'}
                    getLabel={(value) => value}
                  />
                )}
              </Box>
            </Popover>
          )}
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
