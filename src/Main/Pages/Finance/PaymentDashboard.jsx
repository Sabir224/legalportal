'use client';
import jsPDF from 'jspdf';

import logo from '../../Pages/Images/logo.png';
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
import { minWidth } from '@mui/system';

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
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [clientFilter, setClientFilter] = useState([]);
  const [phoneFilter, setPhoneFilter] = useState([]);
  const [amountFilter, setAmountFilter] = useState([]);
  const [emailFilter, setEmailFilter] = useState([]);

  const [filterSearchTerms, setFilterSearchTerms] = useState({
    status: '',
    service: '',
    consultation: '',
    lawyer: '',
    method: '',
    phone: '',
    client: '',
    amount: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeFilter, setActiveFilter] = useState(null);
  const dullBlackColor = [50, 50, 50];
  const generateInvoice = (appointment) => {
    const { payment, lawyer, link } = appointment;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // === HEADER ===
    const addHeader = () => {
      doc.setFillColor(26, 43, 66);
      doc.rect(0, 0, pageWidth, 45, 'F');

      // Logo
      doc.addImage(logo, 'PNG', 15, 10, 25, 25);

      // Company Info
      const infoX = 45,
        infoY = 14;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(255, 255, 255);
      const companyInfo = [
        'AWS Legal Consultancy FZ-LLC',
        'The H Hotel - office tower 1602',
        'Sheikh Zayed Road, Dubai',
        'United Arab Emirates',
        'TRN 100487818500003',
      ];
      companyInfo.forEach((line, i) => {
        doc.text(line, infoX, infoY + i * 5);
      });

      // Invoice Title
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', pageWidth - 20, 20, { align: 'right' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice #: INV-${payment?._id}`, pageWidth - 20, 28, { align: 'right' });

      return 50;
    };

    let currentY = addHeader();

    // === CLIENT INFO ===
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text('Billed To:', 15, currentY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${payment.name || link.name || '-'}`, 15, currentY + 22);
    doc.text(`${payment.email || '-'}`, 15, currentY + 28);
    doc.text(`${payment.phone || link.phone || '-'}`, 15, currentY + 34);

    // === APPOINTMENT & PAYMENT INFO ===
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Invoice Details:', pageWidth - 20, currentY + 10, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const invoiceInfo = [
      `Date Issued: ${new Date(payment.createdAt).toLocaleDateString()}`,
      `Payment Status: ${payment.status}`,
      `Payment Method: ${payment.paymentMethod}`,
    ];

    // Fixed X position (align everything on the right edge)
    const rightMargin = pageWidth - 20;
    const textWidth = Math.max(...invoiceInfo.map((line) => doc.getTextWidth(line)));
    const startX = rightMargin - textWidth; // align all lines to same left edge

    invoiceInfo.forEach((line, i) => {
      doc.text(line, startX, currentY + 18 + i * 6);
    });

    currentY += 45;

    // === PAYMENT SUMMARY TABLE ===
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Payment Summary', 15, currentY);

    currentY += 10;
    doc.setFontSize(10);
    doc.setTextColor(200, 170, 90);
    doc.text('Description', 15, currentY);
    doc.text('Consultation Type', pageWidth / 2, currentY, { align: 'center' });
    doc.text('Amount (AED)', pageWidth - 20, currentY, { align: 'right' });

    // Line
    doc.setDrawColor(0, 0, 0);
    doc.line(15, currentY + 2, pageWidth - 15, currentY + 2);

    // Row
    currentY += 8;
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${payment.serviceType} Consultation`, 15, currentY);
    doc.text(`${payment.consultationType}`, pageWidth / 2, currentY, { align: 'center' });
    doc.text(`${payment.amount}`, pageWidth - 20, currentY, { align: 'right' });

    // Subtotal & Balance
    currentY += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Sub Total:', pageWidth - 60, currentY);
    doc.text(`AED ${payment.amount}`, pageWidth - 20, currentY, { align: 'right' });

    currentY += 7;
    doc.text('Balance Due:', pageWidth - 60, currentY);
    doc.text(`${payment.status === 'paid' ? 'AED 0.00' : `AED ${payment.amount}`}`, pageWidth - 20, currentY, {
      align: 'right',
    });

    // === LAWYER DETAILS ===
    const marginLeft = 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...dullBlackColor);
    doc.text('Lawyer Details', marginLeft, currentY + 25);

    doc.setFontSize(10);

    currentY += 3;
    const lawyerDetails = [
      `Name: ${lawyer?.FkUserId?.UserName || 'N/A'}`,
      `Email: ${lawyer?.FkUserId?.Email || 'N/A'}`,
      `Phone: ${lawyer?.Contact || 'N/A'}`,
      `Position: ${lawyer?.Position || 'N/A'}`,
      `Experience: ${lawyer?.YearOfExperience ? lawyer.YearOfExperience + ' years' : 'N/A'}`,
      `Expertise: ${lawyer?.Expertise || 'N/A'}`,
      `Department: ${lawyer?.Department || 'N/A'}`,
      `Language: ${lawyer?.Language || 'N/A'}`,
      `Address: ${lawyer?.Address || 'N/A'}`,
    ];

    const lawyerStartY = currentY + 31;
    const lineHeight = 8;

    // step 1: find widest label
    let maxLawyerLabelWidth = 0;
    lawyerDetails.forEach((line) => {
      const [label] = line.split(':');
      const width = doc.getTextWidth(label.trim());
      if (width > maxLawyerLabelWidth) maxLawyerLabelWidth = width;
    });

    // fixed position for values
    const lawyerValueX = marginLeft + maxLawyerLabelWidth + 5;

    // step 2: draw labels and values
    lawyerDetails.forEach((line, i) => {
      const y = lawyerStartY + i * lineHeight;
      const [label, value] = line.split(':');

      // label
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...dullBlackColor);
      doc.text(label.trim(), marginLeft, y);

      // value
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...dullBlackColor);
      doc.text(value.trim(), lawyerValueX, y);
    });

    // === FOOTER ===
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('AWS Legal Consultancy!', pageWidth / 2, 280, {
      align: 'center',
    });

    doc.save(`Invoice_${payment.name}.pdf`);
  };
  // Normalizers
  const normalizeClient = (name) => {
    if (!name) return 'blank';
    return String(name).toLowerCase().trim();
  };

  const normalizePhone = (phone) => {
    if (!phone) return 'blank';
    // remove everything except digits
    const digits = String(phone).replace(/\D/g, '');
    return digits === '' ? 'blank' : digits;
  };

  const normalizeAmount = (amount) => {
    if (amount === null || amount === undefined || amount === '') return 'blank';
    return String(amount);
  };

  const normalizeMethod = (method) => {
    if (!method) return 'blank';
    return String(method).toLowerCase().trim();
  };
  const normalizeEmail = (email) => {
    if (!email) return 'blank';
    return email.trim().toLowerCase();
  };

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

          // Default: select all filters initially (normalized)
          const allServices = [...new Set(result.data.map((i) => i.lawyer?.Expertise || 'blank').filter(Boolean))];
          const allConsultations = [
            ...new Set(result.data.map((i) => i.payment?.consultationType || 'blank').filter(Boolean)),
          ];
          const allStatuses = [...new Set(result.data.map((i) => i.payment?.status || 'not-booked').filter(Boolean))];
          const allLawyers = [
            ...new Map(
              result.data.map((i) => {
                if (i.lawyer && i.lawyer._id) return [i.lawyer._id, i.lawyer];
                return [BLANK_LAWYER._id, BLANK_LAWYER];
              })
            ).values(),
          ];

          // normalized sets for new fields
          const allClient = [
            ...new Set(result.data.map((i) => normalizeClient(i.payment?.name || i.link?.name || 'blank'))),
          ];
          const allPhone = [
            ...new Set(result.data.map((i) => normalizePhone(i.payment?.phone || i.link?.phone || 'blank'))),
          ];
          const allAmount = [...new Set(result.data.map((i) => normalizeAmount(i.payment?.amount || 'blank')))];
          const allMethods = [...new Set(result.data.map((i) => normalizeMethod(i.payment?.paymentMethod || 'blank')))];
          const allEmails = [...new Set(result.data.map((i) => normalizeEmail(i.payment?.email || 'blank')))];

          // set defaults (select all)
          setMethodFilter(allMethods);
          setServiceFilter(allServices);
          setConsultationTypeFilter(allConsultations);
          setStatusFilter(allStatuses);
          setLawyerFilter(allLawyers.map((l) => l._id));
          setClientFilter(allClient);
          setAmountFilter(allAmount);
          setPhoneFilter(allPhone);
          setEmailFilter(allEmails);
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

    // require at least one selection in each filter group (your original behavior).
    if (
      statusFilter.length === 0 ||
      serviceFilter.length === 0 ||
      consultationTypeFilter.length === 0 ||
      lawyerFilter.length === 0 ||
      amountFilter.length === 0 ||
      clientFilter.length === 0 ||
      phoneFilter.length === 0 ||
      methodFilter.length === 0
    ) {
      return [];
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        const clientName = (item.link?.name || item.payment?.name || '').toLowerCase();
        const clientPhone = String(item.link?.phone || item.payment?.phone || '');
        const lawyerName = item.lawyer?.FkUserId?.UserName?.toLowerCase() || '';
        const serviceType = item.lawyer?.Expertise?.toLowerCase() || '';

        return (
          clientName.includes(q) ||
          clientPhone.includes(searchTerm) ||
          lawyerName.includes(q) ||
          serviceType.includes(q)
        );
      });
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter((item) => statusFilter.includes(item.payment?.status || 'not-booked'));
    }
    if (serviceFilter.length > 0) {
      filtered = filtered.filter((item) => serviceFilter.includes(item.lawyer?.Expertise || 'blank'));
    }
    if (consultationTypeFilter.length > 0) {
      filtered = filtered.filter((item) => consultationTypeFilter.includes(item.payment?.consultationType || 'blank'));
    }
    if (lawyerFilter.length > 0) {
      filtered = filtered.filter((item) => lawyerFilter.includes(item.lawyer?._id || BLANK_LAWYER._id));
    }

    // methodFilter contains normalized strings
    if (methodFilter.length > 0) {
      filtered = filtered.filter((item) =>
        methodFilter.includes(normalizeMethod(item.payment?.paymentMethod || 'blank'))
      );
    }

    // client / phone / amount comparisons use normalizers
    if (clientFilter.length > 0) {
      filtered = filtered.filter((item) =>
        clientFilter.includes(normalizeClient(item.payment?.name || item.link?.name || 'blank'))
      );
    }

    if (phoneFilter.length > 0) {
      filtered = filtered.filter((item) =>
        phoneFilter.includes(normalizePhone(item.payment?.phone || item.link?.phone || 'blank'))
      );
    }

    if (amountFilter.length > 0) {
      filtered = filtered.filter((item) => amountFilter.includes(normalizeAmount(item.payment?.amount || 'blank')));
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
  }, [
    data,
    searchTerm,
    statusFilter,
    serviceFilter,
    consultationTypeFilter,
    lawyerFilter,
    methodFilter,
    clientFilter,
    phoneFilter,
    amountFilter,
    dateFilter,
  ]);

  // ✅ Dynamic options with blank
  const getDynamicFilterOptions = (currentFilterType) => {
    let dynamicData = [...data];

    // if any other filter (except current) is empty, follow existing logic and zero-out dynamicData
    if (
      (currentFilterType !== 'status' && statusFilter.length === 0) ||
      (currentFilterType !== 'service' && serviceFilter.length === 0) ||
      (currentFilterType !== 'consultation' && consultationTypeFilter.length === 0) ||
      (currentFilterType !== 'lawyer' && lawyerFilter.length === 0) ||
      (currentFilterType !== 'method' && methodFilter.length === 0) ||
      (currentFilterType !== 'client' && clientFilter.length === 0) ||
      (currentFilterType !== 'phone' && phoneFilter.length === 0) ||
      (currentFilterType !== 'amount' && amountFilter.length === 0)
    ) {
      dynamicData = [];
    }

    // apply active filters (except the currentFilterType)
    if (currentFilterType !== 'status' && statusFilter.length > 0) {
      dynamicData = dynamicData.filter((item) => statusFilter.includes(item.payment?.status || 'not-booked'));
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
      dynamicData = dynamicData.filter((item) =>
        methodFilter.includes(normalizeMethod(item.payment?.paymentMethod || 'blank'))
      );
    }
    if (currentFilterType !== 'client' && clientFilter.length > 0) {
      dynamicData = dynamicData.filter((item) =>
        clientFilter.includes(normalizeClient(item.payment?.name || item.link?.name || 'blank'))
      );
    }
    if (currentFilterType !== 'phone' && phoneFilter.length > 0) {
      dynamicData = dynamicData.filter((item) =>
        phoneFilter.includes(normalizePhone(item.payment?.phone || item.link?.phone || 'blank'))
      );
    }
    if (currentFilterType !== 'amount' && amountFilter.length > 0) {
      dynamicData = dynamicData.filter((item) =>
        amountFilter.includes(normalizeAmount(item.payment?.amount || 'blank'))
      );
    }

    // Build normalized available sets from dynamicData
    const availableServices = [...new Set(dynamicData.map((i) => i.lawyer?.Expertise || 'blank'))];
    if (!availableServices.includes('blank')) availableServices.push('blank');

    const availableConsultations = [...new Set(dynamicData.map((i) => i.payment?.consultationType || 'blank'))];
    if (!availableConsultations.includes('blank')) availableConsultations.push('blank');

    const availableStatuses = [...new Set(dynamicData.map((i) => i.payment?.status || 'not-booked'))];
    if (!availableStatuses.includes('not-booked')) availableStatuses.push('not-booked');

    const availableLawyers = [
      ...new Map(
        dynamicData.map((i) => {
          if (i.lawyer && i.lawyer._id) return [i.lawyer._id, i.lawyer];
          return [BLANK_LAWYER._id, BLANK_LAWYER];
        })
      ).values(),
    ];
    if (!availableLawyers.some((l) => l._id === BLANK_LAWYER._id)) availableLawyers.push(BLANK_LAWYER);

    const availableMethods = [...new Set(dynamicData.map((i) => normalizeMethod(i.payment?.paymentMethod || 'blank')))];
    if (!availableMethods.includes('blank')) availableMethods.push('blank');

    const availableClient = [
      ...new Set(dynamicData.map((i) => normalizeClient(i.payment?.name || i.link?.name || 'blank'))),
    ];
    if (!availableClient.includes('blank')) availableClient.push('blank');

    const availablePhone = [
      ...new Set(dynamicData.map((i) => normalizePhone(i.payment?.phone || i.link?.phone || 'blank'))),
    ];
    if (!availablePhone.includes('blank')) availablePhone.push('blank');

    const availableAmount = [...new Set(dynamicData.map((i) => normalizeAmount(i.payment?.amount || 'blank')))];
    if (!availableAmount.includes('blank')) availableAmount.push('blank');

    // Build all* from full data (normalized) for "show all" lists in UI
    const allServices = [...new Set(data.map((i) => i.lawyer?.Expertise || 'blank'))];
    const allConsultations = [...new Set(data.map((i) => i.payment?.consultationType || 'blank'))];
    const allStatuses = [...new Set(data.map((i) => i.payment?.status || 'not-booked'))];
    const allLawyers = [
      ...new Map(
        data.map((i) => {
          if (i.lawyer && i.lawyer._id) return [i.lawyer._id, i.lawyer];
          return [BLANK_LAWYER._id, BLANK_LAWYER];
        })
      ).values(),
    ];
    const allMethods = [...new Set(data.map((i) => normalizeMethod(i.payment?.paymentMethod || 'blank')))];
    const allClient = [...new Set(data.map((i) => normalizeClient(i.payment?.name || i.link?.name || 'blank')))];
    const allPhone = [...new Set(data.map((i) => normalizePhone(i.payment?.phone || i.link?.phone || 'blank')))];
    const allAmount = [...new Set(data.map((i) => normalizeAmount(i.payment?.amount || 'blank')))];

    // builders (return { value, available, selected })
    const buildServiceOptions = () => {
      const base = currentFilterType === 'service' ? allServices : availableServices;
      return base.map((v) => ({
        value: v,
        available: availableServices.includes(v),
        selected: serviceFilter.includes(v),
      }));
    };

    const buildConsultationOptions = () => {
      const base = currentFilterType === 'consultation' ? allConsultations : availableConsultations;
      return base.map((v) => ({
        value: v,
        available: availableConsultations.includes(v),
        selected: consultationTypeFilter.includes(v),
      }));
    };

    const buildStatusOptions = () => {
      const base = currentFilterType === 'status' ? allStatuses : availableStatuses;
      return base.map((v) => ({
        value: v,
        available: availableStatuses.includes(v),
        selected: statusFilter.includes(v),
      }));
    };

    const buildLawyerOptions = () => {
      const base = currentFilterType === 'lawyer' ? allLawyers : availableLawyers;
      return base.map((l) => ({
        value: l,
        available: availableLawyers.some((x) => x._id === l._id),
        selected: lawyerFilter.includes(l._id),
      }));
    };

    const buildMethodOptions = () => {
      const base = currentFilterType === 'method' ? allMethods : availableMethods;
      return base.map((m) => ({
        value: m,
        available: availableMethods.includes(m),
        selected: methodFilter.includes(m),
      }));
    };

    const buildClientOptions = () => {
      const base = currentFilterType === 'client' ? allClient : availableClient;
      return base.map((c) => ({
        value: c,
        available: availableClient.includes(c),
        selected: clientFilter.includes(c),
      }));
    };

    const buildPhoneOptions = () => {
      const base = currentFilterType === 'phone' ? allPhone : availablePhone;
      return base.map((p) => ({
        value: p,
        available: availablePhone.includes(p),
        selected: phoneFilter.includes(p),
      }));
    };

    const buildAmountOptions = () => {
      const base = currentFilterType === 'amount' ? allAmount : availableAmount;
      return base.map((a) => ({
        value: a,
        available: availableAmount.includes(a),
        selected: amountFilter.includes(normalizeAmount(a)), // important: normalize here too
      }));
    };

    return {
      services: buildServiceOptions(),
      consultations: buildConsultationOptions(),
      statuses: buildStatusOptions(),
      lawyers: buildLawyerOptions(),
      methods: buildMethodOptions(),
      clients: buildClientOptions(),
      phones: buildPhoneOptions(),
      amounts: buildAmountOptions(),
    };
  };
  // Get dynamic options for each filter
  const statusOptions = getDynamicFilterOptions('status');
  const serviceOptions = getDynamicFilterOptions('service');
  const consultationOptions = getDynamicFilterOptions('consultation');
  const lawyerOptions = getDynamicFilterOptions('lawyer');
  const methodOptions = getDynamicFilterOptions('method');
  const clientOptions = getDynamicFilterOptions('client');
  const phoneOptions = getDynamicFilterOptions('phone');
  const amountOptions = getDynamicFilterOptions('amount');
  //  console.log('Services Options:', serviceOptions);
  const handleToggleMethod = (value) => {
    const norm = normalizeMethod(value);
    setMethodFilter((prev) => (prev.includes(norm) ? prev.filter((i) => i !== norm) : [...prev, norm]));
  };
  const handleSelectAllMethod = (availableValues) => setMethodFilter(availableValues.map(normalizeMethod));
  const handleClearAllMethod = () => setMethodFilter([]);
  const handleToggleAmount = (value) => {
    const norm = normalizeAmount(value);
    setAmountFilter((prev) => (prev.includes(norm) ? prev.filter((i) => i !== norm) : [...prev, norm]));
  };

  const handleSelectAllAmount = (availableValues) => setAmountFilter(availableValues.map(normalizeAmount));
  const handleToggleClient = (value) => {
    const norm = normalizeClient(value);
    setClientFilter((prev) => (prev.includes(norm) ? prev.filter((i) => i !== norm) : [...prev, norm]));
  };
  const handleSelectAllClient = (availableValues) => setClientFilter(availableValues.map(normalizeClient));
  const handleClearAllClient = () => setClientFilter([]);
  const handleClearAllAmount = () => setAmountFilter([]);
  const handleTogglePhone = (value) => {
    const norm = normalizePhone(value);
    setPhoneFilter((prev) => (prev.includes(norm) ? prev.filter((i) => i !== norm) : [...prev, norm]));
  };
  const handleSelectAllPhone = (availableValues) => setPhoneFilter(availableValues.map(normalizePhone));
  const handleClearAllPhone = () => setPhoneFilter([]);

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

  const handleDateFilterChange = (field, value) => {
    setDateFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearAllStatus = () => setStatusFilter([]);
  const handleClearAllService = () => setServiceFilter([]);
  const handleClearAllConsultation = () => setConsultationTypeFilter([]);
  const handleClearAllLawyer = () => setLawyerFilter([]);

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
                                  <FilterableHeaderCell
                                    label="Client Name"
                                    minWidth={150}
                                    isActive={clientFilter.length > 0}
                                    onClick={(e) => handleOpenFilter('client', e)}
                                  />

                                  {/* <StyledTableCell
                                    sx={{
                                      minWidth: 150,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Client Name
                                  </StyledTableCell> */}

                                  <FilterableHeaderCell
                                    label="Phone"
                                    minWidth={120}
                                    isActive={phoneFilter.length > 0}
                                    onClick={(e) => handleOpenFilter('phone', e)}
                                  />

                                  {/* <StyledTableCell
                                    sx={{
                                      minWidth: 120,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Phone
                                  </StyledTableCell> */}
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
                                  <FilterableHeaderCell
                                    label="Invoice Amount"
                                    minWidth={150}
                                    isActive={amountFilter.length > 0}
                                    onClick={(e) => handleOpenFilter('amount', e)}
                                  />
                                  {/* <StyledTableCell
                                    sx={{
                                      minWidth: 150,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Invoice Amount
                                  </StyledTableCell> */}
                                  <StyledTableCell
                                    sx={{
                                      minWidth: 120,
                                      backgroundColor: lightTheme.textPrimary,
                                      color: lightTheme.background,
                                    }}
                                  >
                                    Invoice
                                  </StyledTableCell>

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
                                    <StyledTableCell>
                                      {item.payment ? (
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          sx={{ textTransform: 'none', borderRadius: 2 }}
                                          onClick={() => generateInvoice(item)}
                                        >
                                          View Invoice
                                        </Button>
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
                                      {item.payment?.paymentMethod || '—'}
                                    </StyledTableCell>
                                    <StyledTableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                      {getStatusChip(item.payment?.status)}
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
                  {openFilter === 'client' && (
                    <FilterSection
                      title="Client"
                      filterKey="client"
                      filterData={clientOptions.clients}
                      searchTerm={filterSearchTerms.client}
                      onSearchChange={handleSearchChange}
                      onSelectAll={handleSelectAllClient}
                      onClearAll={handleClearAllClient}
                      onToggle={handleToggleClient}
                      selectedValues={clientFilter}
                      isCurrentFilter={activeFilter === 'client'}
                      getLabel={(v) => (v === 'blank' ? 'Blank' : `${v}`)}
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
                      isCurrentFilter={activeFilter === 'phone'}
                      getLabel={(v) => (v === 'blank' ? 'Blank' : `${v}`)}
                    />
                  )}

                  {openFilter === 'amount' && (
                    <FilterSection
                      title="Amount"
                      filterKey="amount"
                      filterData={amountOptions.amounts}
                      searchTerm={filterSearchTerms.amount}
                      onSearchChange={handleSearchChange}
                      onSelectAll={handleSelectAllAmount}
                      onClearAll={handleClearAllAmount}
                      onToggle={handleToggleAmount}
                      selectedValues={amountFilter}
                      isCurrentFilter={activeFilter === 'amount'}
                      getLabel={(v) => (v === 'blank' ? 'Blank' : `${v}`)}
                    />
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
