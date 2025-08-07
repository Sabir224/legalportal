import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert, Row, Col, Card, Form, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import {
  faCalendarAlt,
  faMoneyBillWave,
  faFileAlt,
  faBalanceScale,
  faInfoCircle,
  faChartBar,
  faChartPie,
  faChartLine,
  faGavel,
  faScaleBalanced,
  faHourglassHalf,
  faLandmark,
  faBookOpen,
  faFolderOpen,
  faFolderClosed,
  faCheckCircle,
  faTimesCircle,
  faThLarge,
  faChartSimple,
  faFilter,
  faChevronDown,
  faCalendar,
  faSyncAlt,
  faDownload,
  faFileExcel,
  faFileImage,
  faHashtag,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import html2canvas from 'html2canvas';
import { ApiEndPoint } from '../Component/utils/utlis';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// Utility functions
const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const formatCurrency = (amount) => {
  return amount
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    : 'N/A';
};

// Color scheme
const COLORS = {
  primary: '#3B82F6', // Blue
  secondary: '#10B981', // Green
  accent: '#F59E0B', // Amber
  neutral: '#6B7280', // Gray
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Red
};

// Custom Bar Chart Component for Status
const StatusBarChart = ({ data, totalCases }) => {
  return (
    <>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.raw || 0;
                  const percentage = Math.round((value / totalCases) * 1000) / 10;
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
          scales: {
            y: {
              display: true,
              min: 0,
              ticks: {
                color: 'white',
                stepSize: 1,
                precision: 0,
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false,
              },
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false,
              },
              ticks: {
                color: 'white',
                font: {
                  weight: 'bold',
                },
              },
            },
          },
          animation: {
            duration: 1500,
            easing: 'easeOutQuart',
          },
        }}
      />
      <div className="d-flex justify-content-around mt-2">
        {data.labels.map((label, index) => (
          <div key={index} className="text-center">
            <div className="text-white small">{label}</div>
            <div className="text-white fw-bold">{data.datasets[0].data[index]}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// Custom Line Chart Component for Status
const StatusLineChart = ({ data, totalCases }) => {
  return (
    <>
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.raw || 0;
                  const percentage = Math.round((value / totalCases) * 1000) / 10;
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
          scales: {
            y: {
              display: true,
              min: 0,
              ticks: {
                color: 'white',
                stepSize: 1,
                precision: 0,
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false,
              },
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false,
              },
              ticks: {
                color: 'white',
                font: {
                  weight: 'bold',
                },
              },
            },
          },
          animation: {
            duration: 1500,
            easing: 'easeOutQuart',
          },
        }}
      />
      <div className="d-flex justify-content-around mt-2">
        {data.labels.map((label, index) => (
          <div key={index} className="text-center">
            <div className="text-white small">{label}</div>
            <div className="text-white fw-bold">{data.datasets[0].data[index]}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// Main Component
const CaseSummary = () => {
  const [casesData, setCasesData] = useState({
    totalCases: 0,
    openCases: 0,
    closedCases: 0,
    inactiveCases: 0,
    cases: [],
    assignedUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [filters, setFilters] = useState({
    priority: '',
    caseType: '',
    startDate: null,
    endDate: null,
    assignedUser: '',
  });
  const [lastUpdated, setLastUpdated] = useState('');
  const dashboardRef = useRef(null);

  useEffect(() => {
    const fetchCaseSummaries = async () => {
      try {
        const response = await axios.get(`${ApiEndPoint}/casesummary`);
        setCasesData(response.data);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        setError('Unable to fetch case details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseSummaries();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/casesummary');
      setCasesData(response.data);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError('Unable to refresh data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      priority: '',
      caseType: '',
      startDate: null,
      endDate: null,
      assignedUser: '',
    });
  };

  const handleExportExcel = () => {
    // Prepare CSV content
    const headers = [
      'Case Number',
      'Status',
      'Priority',
      'Case Type',
      'Request Date',
      'E-Submit Date',
      'First Session Date',
      'Next Session Date',
      'Verdict Date',
      'Claimed Amount',
      'Case Balance',
    ];

    const rows = filteredCases.map((caseItem) => [
      caseItem.CaseNumber,
      caseItem.Status,
      caseItem.Priority,
      caseItem.CaseType,
      caseItem.RequestDate ? formatDate(caseItem.RequestDate) : '',
      caseItem.ESubmitDate ? formatDate(caseItem.ESubmitDate) : '',
      caseItem.FirstSessionDate ? formatDate(caseItem.FirstSessionDate) : '',
      caseItem.NextSessionDate ? formatDate(caseItem.NextSessionDate) : '',
      caseItem.VerdictDate ? formatDate(caseItem.VerdictDate) : '',
      caseItem.ClaimedAmount ? formatCurrency(caseItem.ClaimedAmount) : '',
      caseItem.CaseBalance ? formatCurrency(caseItem.CaseBalance) : '',
    ]);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `case_summary_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportImage = async () => {
    if (!dashboardRef.current) return;

    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `case_dashboard_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
    }
  };

  // Filter cases based on selected filters
  const filteredCases = casesData.cases.filter((caseItem) => {
    const caseDate = caseItem.RequestDate ? new Date(caseItem.RequestDate) : null;
    const startDateFilter = filters.startDate ? new Date(filters.startDate) : null;
    const endDateFilter = filters.endDate ? new Date(filters.endDate) : null;

    const dateInRange =
      (!startDateFilter || (caseDate && caseDate >= startDateFilter)) &&
      (!endDateFilter || (caseDate && caseDate <= endDateFilter));

    const assignedUserFilter =
      filters.assignedUser === '' || caseItem.AssignedStaff.some((staff) => staff.userId === filters.assignedUser);

    return (
      (filters.priority === '' || caseItem.Priority === filters.priority) &&
      (filters.caseType === '' || caseItem.CaseType === filters.caseType) &&
      dateInRange &&
      assignedUserFilter
    );
  });

  // Calculate case status counts from filtered cases
  const caseStatusData = {
    open: filteredCases.filter((c) => c.Status === 'Open').length,
    closedPositive: filteredCases.filter((c) => c.Status === 'Close Positive').length,
    closedNegative: filteredCases.filter((c) => c.Status === 'Close Negative').length,
  };

  // Calculate filtered counts
  const filteredCounts = {
    total: filteredCases.length,
    open: caseStatusData.open,
    closed: caseStatusData.closedPositive + caseStatusData.closedNegative,
    inactive: filteredCases.filter((c) => !c.IsActive).length,
    closedPositive: caseStatusData.closedPositive,
    closedNegative: caseStatusData.closedNegative,
  };

  // Get unique values for filter dropdowns
  const priorityOptions = [...new Set(casesData.cases.map((c) => c.Priority))];
  const caseTypeOptions = [...new Set(casesData.cases.map((c) => c.CaseType))];

  // Case Status Bar Chart Data - Now using actual filtered data
  const caseStatusBarData = {
    labels: ['Open', 'Closed +ve', 'Closed -ve'],
    datasets: [
      {
        label: 'Cases',
        data: [caseStatusData.open, caseStatusData.closedPositive, caseStatusData.closedNegative],
        backgroundColor: [COLORS.primary, COLORS.success, COLORS.danger],
        borderColor: [COLORS.primary, COLORS.success, COLORS.danger],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Case Status Line Chart Data - Now using actual filtered data
  const caseStatusLineData = {
    labels: ['Open', 'Closed +ve', 'Closed -ve'],
    datasets: [
      {
        label: 'Cases',
        data: [caseStatusData.open, caseStatusData.closedPositive, caseStatusData.closedNegative],
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS.primary,
      },
    ],
  };

  // Total Cases Bar Chart Data (for cards view)
  const totalCasesBarData = {
    labels: ['Total Cases'],
    datasets: [
      {
        label: 'Total Cases',
        data: [filteredCounts.total],
        backgroundColor: [COLORS.neutral],
        borderColor: [COLORS.neutral],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Total Cases Line Chart Data (for graphs view)
  const totalCasesLineData = {
    labels: ['Total Cases'],
    datasets: [
      {
        label: 'Total Cases',
        data: [filteredCounts.total],
        borderColor: COLORS.neutral,
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.neutral,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS.neutral,
      },
    ],
  };

  const casePriorityBarData = {
    labels: priorityOptions,
    datasets: [
      {
        label: 'Cases',
        data: priorityOptions.map((priority) => filteredCases.filter((c) => c.Priority === priority).length),
        backgroundColor: priorityOptions.map(() => COLORS.primary),
        borderColor: priorityOptions.map(() => COLORS.primary),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const financialOverviewBarData = {
    labels: ['Avg Claimed', 'Avg Balance'],
    datasets: [
      {
        label: 'Amount',
        data: [
          Math.round(
            filteredCases.reduce((sum, c) => sum + (c.ClaimedAmount || 0), 0) / Math.max(1, filteredCases.length)
          ),
          Math.round(
            filteredCases.reduce((sum, c) => sum + (c.CaseBalance || 0), 0) / Math.max(1, filteredCases.length)
          ),
        ],
        backgroundColor: [COLORS.success, COLORS.primary],
        borderColor: [COLORS.success, COLORS.primary],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const keyDatesBarData = {
    labels: ['Request Date', 'Verdict Date'],
    datasets: [
      {
        label: 'Cases',
        data: [filteredCases.filter((c) => c.RequestDate).length, filteredCases.filter((c) => c.VerdictDate).length],
        backgroundColor: [COLORS.accent, COLORS.primary],
        borderColor: [COLORS.accent, COLORS.primary],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const casePriorityLineData = {
    labels: priorityOptions,
    datasets: [
      {
        label: 'Cases',
        data: priorityOptions.map((priority) => filteredCases.filter((c) => c.Priority === priority).length),
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS.primary,
      },
    ],
  };

  const financialOverviewLineData = {
    labels: ['Avg Claimed', 'Avg Balance'],
    datasets: [
      {
        label: 'Amount',
        data: [
          Math.round(
            filteredCases.reduce((sum, c) => sum + (c.ClaimedAmount || 0), 0) / Math.max(1, filteredCases.length)
          ),
          Math.round(
            filteredCases.reduce((sum, c) => sum + (c.CaseBalance || 0), 0) / Math.max(1, filteredCases.length)
          ),
        ],
        borderColor: COLORS.success,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.success,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS.success,
      },
    ],
  };

  const keyDatesLineData = {
    labels: ['Request Date', 'Verdict Date'],
    datasets: [
      {
        label: 'Cases',
        data: [filteredCases.filter((c) => c.RequestDate).length, filteredCases.filter((c) => c.VerdictDate).length],
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.accent,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: COLORS.accent,
      },
    ],
  };

  // Get all lawyers cases data
  const getAllLawyersCasesData = () => {
    const lawyersData = casesData.assignedUsers.map((user) => {
      const userCases = filteredCases.filter((caseItem) =>
        caseItem.AssignedStaff.some((staff) => staff.userId === user.userId)
      );

      return {
        userId: user.userId,
        name: user.name,
        role: user.role,
        open: userCases.filter((c) => c.Status === 'Open').length,
        closedPositive: userCases.filter((c) => c.Status === 'Close Positive').length,
        closedNegative: userCases.filter((c) => c.Status === 'Close Negative').length,
        total: userCases.length,
      };
    });

    return lawyersData;
  };

  // Get data for lawyer status breakdown (for card view)
  const getLawyerStatusBreakdownBarData = () => {
    const lawyersData = getAllLawyersCasesData();

    return {
      labels: lawyersData.map((l) => l.name),
      datasets: [
        {
          label: 'Open',
          data: lawyersData.map((l) => l.open),
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: 'Close Positive',
          data: lawyersData.map((l) => l.closedPositive),
          backgroundColor: COLORS.success,
          borderColor: COLORS.success,
          borderWidth: 1,
          borderRadius: 6,
        },
        {
          label: 'Close Negative',
          data: lawyersData.map((l) => l.closedNegative),
          backgroundColor: COLORS.danger,
          borderColor: COLORS.danger,
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  };

  // Get data for lawyer status breakdown (for graph view)
  const getLawyerStatusBreakdownLineData = () => {
    const lawyersData = getAllLawyersCasesData();

    return {
      labels: lawyersData.map((l) => l.name),
      datasets: [
        {
          label: 'Open',
          data: lawyersData.map((l) => l.open),
          borderColor: COLORS.primary,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.primary,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: COLORS.primary,
        },
        {
          label: 'Close Positive',
          data: lawyersData.map((l) => l.closedPositive),
          borderColor: COLORS.success,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.success,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: COLORS.success,
        },
        {
          label: 'Close Negative',
          data: lawyersData.map((l) => l.closedNegative),
          borderColor: COLORS.danger,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.danger,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: COLORS.danger,
        },
      ],
    };
  };

  // Simplified version of lawyer cases line chart data
  const getAssignedUserCasesLineData = (userId) => {
    if (!userId) {
      return getLawyerStatusBreakdownLineData();
    }

    // Show status breakdown for specific lawyer
    const lawyer = casesData.assignedUsers.find((u) => u.userId === userId);
    if (!lawyer) return null;

    const userCases = filteredCases.filter((caseItem) =>
      caseItem.AssignedStaff.some((staff) => staff.userId === userId)
    );

    return {
      labels: ['Open', 'Close Positive', 'Close Negative'],
      datasets: [
        {
          label: 'Cases',
          data: [
            userCases.filter((c) => c.Status === 'Open').length,
            userCases.filter((c) => c.Status === 'Close Positive').length,
            userCases.filter((c) => c.Status === 'Close Negative').length,
          ],
          borderColor: COLORS.primary,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.primary,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: COLORS.primary,
        },
      ],
    };
  };

  // Simplified version of lawyer cases bar chart data
  const getAssignedUserCasesBarData = (userId) => {
    if (!userId) {
      return getLawyerStatusBreakdownBarData();
    }

    // Show status breakdown for specific lawyer
    const lawyer = casesData.assignedUsers.find((u) => u.userId === userId);
    if (!lawyer) return null;

    const userCases = filteredCases.filter((caseItem) =>
      caseItem.AssignedStaff.some((staff) => staff.userId === userId)
    );

    return {
      labels: ['Open', 'Close Positive', 'Close Negative'],
      datasets: [
        {
          label: 'Cases',
          data: [
            userCases.filter((c) => c.Status === 'Open').length,
            userCases.filter((c) => c.Status === 'Close Positive').length,
            userCases.filter((c) => c.Status === 'Close Negative').length,
          ],
          backgroundColor: [COLORS.primary, COLORS.success, COLORS.danger],
          borderColor: [COLORS.primary, COLORS.success, COLORS.danger],
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  };

  // Assigned User Cases Chart Data
  const assignedUserBarData = getAssignedUserCasesBarData(filters.assignedUser);
  const assignedUserLineData = getAssignedUserCasesLineData(filters.assignedUser);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: '84vh',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container
        className="mt-5"
        style={{
          backgroundColor: '#f8f9fa',
          minHeight: '84vh',
        }}
      >
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!casesData || casesData.cases.length === 0) {
    return (
      <Container
        className="mt-5"
        style={{
          backgroundColor: '#f8f9fa',
          minHeight: '84vh',
        }}
      >
        <Alert variant="warning">No case data available.</Alert>
      </Container>
    );
  }

  return (
    // <div className="container-fluid p-0" style={{
    //     backgroundColor: "#f0f2f5",
    //     minHeight: "84vh",
    //     overflow: "hidden"
    // }} ref={dashboardRef}>
    <div className="container-fluid p-0 mb-1 d-flex justify-content-center">
      <div
        className="card shadow p-2"
        style={{
          scrollbarColor: '#c0a262 #f1f1f1',
          paddingBottom: '30px',
          // padding: '10px 10px',
          height: '86vh',
          // overflowY: "auto",
          overflowY: 'auto',
          // msOverflowStyle: "none",
          scrollbarWidth: 'thin',
          maxWidth: '86vw',
          // minWidth:"50px",
          width: '86vw',
        }}
      >
        {/* Header Section */}
        <div
          className="px-3 px-md-4 py-2 mb-3"
          style={{
            backgroundColor: '#001f3f',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            margin: '16px 16px 0 16px',
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="d-flex align-items-center mb-2 mb-md-0">
              <FontAwesomeIcon
                icon={faGavel}
                className="text-white me-2"
                style={{
                  fontSize: '1.2rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '8px',
                  borderRadius: '6px',
                }}
              />
              <div>
                <h2
                  className="text-white mb-0"
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 600,
                  }}
                >
                  Case Summary Dashboard
                </h2>
                <p className="text-white-50 mb-0" style={{ fontSize: '0.75rem' }}>
                  Showing {filteredCounts.total} of {casesData.totalCases} cases | Last updated: {lastUpdated}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex-grow-1 flex-md-grow-0"
              >
                <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'fa-spin' : ''} />
                <span className="ms-1 d-none d-md-inline">Refresh</span>
              </Button>

              {/* Export Dropdown */}
              <Dropdown className="flex-grow-1 flex-md-grow-0">
                <Dropdown.Toggle variant="outline-light" size="sm" id="dropdown-export">
                  <FontAwesomeIcon icon={faDownload} />
                  <span className="ms-1 d-none d-md-inline">Export</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleExportExcel}>
                    <FontAwesomeIcon icon={faFileExcel} className="me-2 text-success" />
                    Export as Excel
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleExportImage}>
                    <FontAwesomeIcon icon={faFileImage} className="me-2 text-primary" />
                    Export as Image
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* View Mode Toggle */}
              <div className="d-flex align-items-center ms-md-2" style={{ gap: '10px' }}>
                <Button
                  variant={viewMode === 'cards' ? 'light' : 'outline-light'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  title="Cards View"
                  className="flex-grow-1 flex-md-grow-0"
                >
                  <FontAwesomeIcon icon={faThLarge} />
                  <span className="ms-1 d-none d-md-inline">Cards</span>
                </Button>
                <Button
                  variant={viewMode === 'graphs' ? 'light' : 'outline-light'}
                  size="sm"
                  onClick={() => setViewMode('graphs')}
                  title="Graphs View"
                  className="flex-grow-1 flex-md-grow-0"
                >
                  <FontAwesomeIcon icon={faChartLine} />
                  <span className="ms-1 d-none d-md-inline">Graphs</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div
          className="px-3 px-md-4 py-3 mb-3"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            margin: '0 16px',
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3">
            <div className="d-flex align-items-center mb-2 mb-md-0">
              <FontAwesomeIcon icon={faFilter} className="text-primary me-2" />
              <h5 className="mb-0">Filters</h5>
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleResetFilters}
              className="align-self-stretch align-self-md-center"
            >
              Reset Filters
            </Button>
          </div>

          <div className="row g-2 g-md-3">
            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Priority</Form.Label>
                <Form.Select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                >
                  <option value="">All Priorities</option>
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Case Type</Form.Label>
                <Form.Select
                  value={filters.caseType}
                  onChange={(e) => setFilters({ ...filters, caseType: e.target.value })}
                >
                  <option value="">All Case Types</option>
                  {caseTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            {/* Assigned User Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Assigned User</Form.Label>
                <Form.Select
                  value={filters.assignedUser}
                  onChange={(e) => setFilters({ ...filters, assignedUser: e.target.value })}
                >
                  <option value="">All Lawyers</option>
                  {casesData.assignedUsers.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            {/* Date Range Filter */}
            <div className="col-12 col-sm-6 col-md-3">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Date Range</Form.Label>
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <div style={{ flex: '1 1 120px' }}>
                    <DatePicker
                      selected={filters.startDate}
                      onChange={(date) => setFilters({ ...filters, startDate: date })}
                      selectsStart
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Start Date"
                    />
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <DatePicker
                      selected={filters.endDate}
                      onChange={(date) => setFilters({ ...filters, endDate: date })}
                      selectsEnd
                      startDate={filters.startDate}
                      endDate={filters.endDate}
                      minDate={filters.startDate}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="End Date"
                    />
                  </div>
                </div>
              </Form.Group>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            padding: '0 16px 16px 16px',
            height: 'calc(84vh - 180px)',
            // overflowY: "auto",
            // msOverflowStyle: "none",
            // scrollbarWidth: "none"
          }}
        >
          {/* Hide scrollbar for Chrome, Safari and Opera */}
          <style>
            {`::-webkit-scrollbar {
              display: none;
            }`}
          </style>

          {/* Main Content Card */}
          <div
            className="card shadow-sm border-0"
            style={{
              borderRadius: '8px',
              backgroundColor: 'white',
              minHeight: 'calc(84vh - 212px)',
              overflow: 'hidden',
            }}
          >
            <div
              className="card-body p-3 p-md-4"
              style={{
                // overflowY: "auto",
                height: '84%',
                // msOverflowStyle: "none",
                // scrollbarWidth: "none"
              }}
            >
              {/* Hide scrollbar for Chrome, Safari and Opera */}
              {/* <style>
                            {`::-webkit-scrollbar {
                  display: none;
                }`}
                        </style> */}

              {viewMode === 'cards' ? (
                <div className="row g-3">
                  {/* Total Cases Card - Now with Bar Chart */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
                        borderRadius: '12px',
                      }}
                    >
                      <div className="card-header bg-transparent border-0 p-3">
                        <h5 className="mb-0 text-white">
                          <FontAwesomeIcon icon={faHashtag} className="me-2" />
                          Total Cases
                        </h5>
                      </div>
                      <div className="card-body p-3 d-flex flex-column">
                        <div style={{ height: '120px', marginBottom: '10px' }}>
                          <Bar
                            data={totalCasesBarData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function (context) {
                                      return `${context.raw} cases`;
                                    },
                                  },
                                },
                              },
                              scales: {
                                y: {
                                  display: true,
                                  min: 0,
                                  ticks: {
                                    color: 'white',
                                    stepSize: Math.max(1, Math.ceil(filteredCounts.total / 5)),
                                    precision: 0,
                                  },
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.2)',
                                    drawBorder: false,
                                  },
                                },
                                x: {
                                  grid: {
                                    display: false,
                                    drawBorder: false,
                                  },
                                  ticks: {
                                    color: 'white',
                                    font: {
                                      weight: 'bold',
                                    },
                                  },
                                },
                              },
                              animation: {
                                duration: 1500,
                                easing: 'easeOutQuart',
                              },
                            }}
                          />
                        </div>
                        <div className="text-center mt-auto">
                          <h1 className="display-4 text-white mb-0">{filteredCounts.total}</h1>
                          <p className="text-white-50 mb-0">Filtered Cases</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case Status Card - Now with dynamic data */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                        borderRadius: '12px',
                      }}
                    >
                      <div className="card-header bg-transparent border-0 p-3">
                        <h5 className="mb-0 text-white">
                          <FontAwesomeIcon icon={faChartBar} className="me-2" />
                          Case Status
                        </h5>
                      </div>
                      <div className="card-body p-3" style={{ height: '250px' }}>
                        <StatusBarChart data={caseStatusBarData} totalCases={filteredCounts.total} />
                      </div>
                    </div>
                  </div>

                  {/* Financial Overview Card */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        background: 'linear-gradient(135deg, #047857, #10b981)',
                        borderRadius: '12px',
                      }}
                    >
                      <div className="card-header bg-transparent border-0 p-3">
                        <h5 className="mb-0 text-white">
                          <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                          Financial Overview
                        </h5>
                      </div>
                      <div className="card-body p-3" style={{ height: '250px' }}>
                        <Bar
                          data={financialOverviewBarData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    return formatCurrency(context.raw);
                                  },
                                },
                              },
                            },
                            scales: {
                              y: {
                                display: true,
                                min: 0,
                                ticks: {
                                  color: 'white',
                                  callback: function (value) {
                                    return formatCurrency(value);
                                  },
                                  font: {
                                    weight: 'bold',
                                  },
                                },
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.2)',
                                  drawBorder: false,
                                },
                              },
                              x: {
                                grid: {
                                  display: false,
                                  drawBorder: false,
                                },
                                ticks: {
                                  color: 'white',
                                  font: {
                                    weight: 'bold',
                                  },
                                },
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart',
                            },
                          }}
                        />
                        <div className="d-flex justify-content-around mt-2">
                          {financialOverviewBarData.labels.map((label, index) => (
                            <div key={index} className="text-center">
                              <div className="text-white small">{label}</div>
                              <div className="text-white fw-bold">
                                {formatCurrency(financialOverviewBarData.datasets[0].data[index])}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Case Priority Card */}
                  <div className="col-12 col-md-6">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                        borderRadius: '12px',
                      }}
                    >
                      <div className="card-header bg-transparent border-0 p-3">
                        <h5 className="mb-0 text-white">
                          <FontAwesomeIcon icon={faHourglassHalf} className="me-2" />
                          Case Priority
                        </h5>
                      </div>
                      <div className="card-body p-3" style={{ height: '250px' }}>
                        <Bar
                          data={casePriorityBarData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const percentage = Math.round((value / filteredCounts.total) * 1000) / 10;
                                    return `${label}: ${value} (${percentage}%)`;
                                  },
                                },
                              },
                            },
                            scales: {
                              y: {
                                display: true,
                                min: 0,
                                ticks: {
                                  color: 'white',
                                  stepSize: 1,
                                  precision: 0,
                                },
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.2)',
                                  drawBorder: false,
                                },
                              },
                              x: {
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.2)',
                                  drawBorder: false,
                                },
                                ticks: {
                                  color: 'white',
                                  font: {
                                    weight: 'bold',
                                  },
                                },
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart',
                            },
                          }}
                        />
                        <div className="d-flex justify-content-around mt-2">
                          {casePriorityBarData.labels.map((label, index) => (
                            <div key={index} className="text-center">
                              <div className="text-white small">{label}</div>
                              <div className="text-white fw-bold">{casePriorityBarData.datasets[0].data[index]}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Dates Card */}
                  <div className="col-12 col-md-6">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        background: 'linear-gradient(135deg, #b45309, #f59e0b)',
                        borderRadius: '12px',
                      }}
                    >
                      <div className="card-header bg-transparent border-0 p-3">
                        <h5 className="mb-0 text-white">
                          <FontAwesomeIcon icon={faLandmark} className="me-2" />
                          Key Dates Timeline
                        </h5>
                      </div>
                      <div className="card-body p-3" style={{ height: '250px' }}>
                        <Bar
                          data={keyDatesBarData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value}`;
                                  },
                                },
                              },
                            },
                            scales: {
                              y: {
                                display: true,
                                min: 0,
                                ticks: {
                                  color: 'white',
                                  stepSize: 1,
                                  precision: 0,
                                },
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.2)',
                                  drawBorder: false,
                                },
                              },
                              x: {
                                grid: {
                                  display: false,
                                  drawBorder: false,
                                },
                                ticks: {
                                  color: 'white',
                                  font: {
                                    weight: 'bold',
                                  },
                                },
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart',
                            },
                          }}
                        />
                        <div className="d-flex justify-content-around mt-2">
                          {keyDatesBarData.labels.map((label, index) => (
                            <div key={index} className="text-center">
                              <div className="text-white small">{label}</div>
                              <div className="text-white fw-bold">{keyDatesBarData.datasets[0].data[index]}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lawyers Cases Card - Always shown */}
                  <div className="col-12">
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                        borderRadius: '12px',
                      }}
                    >
                      <div className="card-header bg-transparent border-0 p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0 text-white">
                            <FontAwesomeIcon icon={faUserTie} className="me-2" />
                            {filters.assignedUser
                              ? `${
                                  casesData.assignedUsers.find((u) => u.userId === filters.assignedUser)?.name ||
                                  'Selected Lawyer'
                                } Cases`
                              : 'All Lawyers Cases'}
                          </h5>
                          {filters.assignedUser && (
                            <span className="badge bg-light text-dark">
                              {casesData.assignedUsers.find((u) => u.userId === filters.assignedUser)?.role || 'Role'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="card-body p-3" style={{ height: '300px' }}>
                        <Bar
                          data={assignedUserBarData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top',
                                labels: {
                                  color: 'white',
                                  boxWidth: 12,
                                  padding: 20,
                                },
                              },
                              tooltip: {
                                callbacks: {
                                  label: function (context) {
                                    const label = context.dataset.label || '';
                                    const value = context.raw || 0;
                                    let percentage = 0;

                                    if (filters.assignedUser) {
                                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                      percentage = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
                                      return `${label}: ${value} (${percentage}%)`;
                                    } else {
                                      return `${label}: ${value} cases`;
                                    }
                                  },
                                },
                              },
                            },
                            scales: {
                              y: {
                                display: true,
                                min: 0,
                                ticks: {
                                  color: 'white',
                                  stepSize: 1,
                                  precision: 0,
                                },
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.2)',
                                  drawBorder: false,
                                },
                              },
                              x: {
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.2)',
                                  drawBorder: false,
                                },
                                ticks: {
                                  color: 'white',
                                  font: {
                                    weight: 'bold',
                                  },
                                },
                              },
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeOutQuart',
                            },
                          }}
                        />
                        {/* Status labels for All Lawyers Cases */}
                        {!filters.assignedUser && (
                          <div className="d-flex justify-content-around mt-2">
                            <div className="text-center">
                              <div className="text-white small">Open</div>
                              <div className="text-white fw-bold">
                                {filteredCases.filter((c) => c.Status === 'Open').length}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-white small">Closed +ve</div>
                              <div className="text-white fw-bold">
                                {filteredCases.filter((c) => c.Status === 'Close Positive').length}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-white small">Closed -ve</div>
                              <div className="text-white fw-bold">
                                {filteredCases.filter((c) => c.Status === 'Close Negative').length}
                              </div>
                            </div>
                          </div>
                        )}
                        {/* Status labels for Specific Lawyer */}
                        {filters.assignedUser && (
                          <div className="d-flex justify-content-around mt-2">
                            {assignedUserBarData.labels.map((label, index) => (
                              <div key={index} className="text-center">
                                <div className="text-white small">{label}</div>
                                <div className="text-white fw-bold">{assignedUserBarData.datasets[0].data[index]}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Graphs View - Line Charts */}
                  <div className="row g-3 mb-4">
                    {/* Total Cases Card - Now with Line Chart */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          background: 'linear-gradient(135deg, #6b7280, #9ca3af)',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="card-header bg-transparent border-0 p-2 p-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faHashtag} className="text-white" />
                            <h5 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>
                              Total Cases
                            </h5>
                          </div>
                        </div>
                        <div className="card-body p-2 p-md-3 d-flex flex-column">
                          <div style={{ height: '120px', marginBottom: '10px' }}>
                            <Line
                              data={totalCasesLineData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    display: false,
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function (context) {
                                        return `${context.raw} cases`;
                                      },
                                    },
                                  },
                                },
                                scales: {
                                  y: {
                                    display: true,
                                    min: 0,
                                    ticks: {
                                      color: 'white',
                                      stepSize: Math.max(1, Math.ceil(filteredCounts.total / 5)),
                                      precision: 0,
                                    },
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.2)',
                                      drawBorder: false,
                                    },
                                  },
                                  x: {
                                    grid: {
                                      display: false,
                                      drawBorder: false,
                                    },
                                    ticks: {
                                      color: 'white',
                                      font: {
                                        weight: 'bold',
                                      },
                                    },
                                  },
                                },
                                animation: {
                                  duration: 1500,
                                  easing: 'easeOutQuart',
                                },
                              }}
                            />
                          </div>
                          <div className="text-center mt-auto">
                            <h1 className="display-4 text-white mb-0">{filteredCounts.total}</h1>
                            <p className="text-white-50 mb-0">Filtered Cases</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Case Status Line Chart - Now with dynamic data */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="card-header bg-transparent border-0 p-2 p-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faChartLine} className="text-warning" />
                            <h5 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>
                              Case Status
                            </h5>
                          </div>
                        </div>
                        <div className="card-body p-2 p-md-3">
                          <div style={{ height: '250px', minHeight: '250px' }}>
                            <StatusLineChart data={caseStatusLineData} totalCases={filteredCounts.total} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Overview Line Chart */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          background: 'linear-gradient(135deg, #047857, #10b981)',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="card-header bg-transparent border-0 p-2 p-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-warning" />
                            <h5 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>
                              Financial Overview
                            </h5>
                          </div>
                        </div>
                        <div className="card-body p-2 p-md-3">
                          <div style={{ height: '250px', minHeight: '250px' }}>
                            <Line
                              data={financialOverviewLineData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    display: false,
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function (context) {
                                        return formatCurrency(context.raw);
                                      },
                                    },
                                  },
                                },
                                scales: {
                                  y: {
                                    display: true,
                                    min: 0,
                                    ticks: {
                                      color: 'white',
                                      callback: function (value) {
                                        return formatCurrency(value);
                                      },
                                      font: {
                                        weight: 'bold',
                                      },
                                    },
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.2)',
                                      drawBorder: false,
                                    },
                                  },
                                  x: {
                                    grid: {
                                      display: false,
                                      drawBorder: false,
                                    },
                                    ticks: {
                                      color: 'white',
                                      font: {
                                        weight: 'bold',
                                      },
                                    },
                                  },
                                },
                                animation: {
                                  duration: 1500,
                                  easing: 'easeOutQuart',
                                },
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-around mt-2">
                            {financialOverviewLineData.labels.map((label, index) => (
                              <div key={index} className="text-center">
                                <div className="text-white small">{label}</div>
                                <div className="text-white fw-bold">
                                  {formatCurrency(financialOverviewLineData.datasets[0].data[index])}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    {/* Case Priority Line Chart */}
                    <div className="col-12 col-md-6">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="card-header bg-transparent border-0 p-2 p-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faHourglassHalf} className="text-warning" />
                            <h5 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>
                              Case Priority
                            </h5>
                          </div>
                        </div>
                        <div className="card-body p-2 p-md-3">
                          <div style={{ height: '250px', minHeight: '250px' }}>
                            <Line
                              data={casePriorityLineData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    display: false,
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function (context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        const percentage = Math.round((value / filteredCounts.total) * 1000) / 10;
                                        return `${label}: ${value} (${percentage}%)`;
                                      },
                                    },
                                  },
                                },
                                scales: {
                                  y: {
                                    display: true,
                                    min: 0,
                                    ticks: {
                                      color: 'white',
                                      stepSize: 1,
                                      precision: 0,
                                    },
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.2)',
                                      drawBorder: false,
                                    },
                                  },
                                  x: {
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.2)',
                                      drawBorder: false,
                                    },
                                    ticks: {
                                      color: 'white',
                                      font: {
                                        weight: 'bold',
                                      },
                                    },
                                  },
                                },
                                animation: {
                                  duration: 1500,
                                  easing: 'easeOutQuart',
                                },
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-around mt-2">
                            {casePriorityLineData.labels.map((label, index) => (
                              <div key={index} className="text-center">
                                <div className="text-white small">{label}</div>
                                <div className="text-white fw-bold">{casePriorityLineData.datasets[0].data[index]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Dates Line Chart */}
                    <div className="col-12 col-md-6">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          background: 'linear-gradient(135deg, #b45309, #f59e0b)',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="card-header bg-transparent border-0 p-2 p-md-3">
                          <div className="d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faLandmark} className="text-white" />
                            <h5 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>
                              Key Dates Timeline
                            </h5>
                          </div>
                        </div>
                        <div className="card-body p-2 p-md-3">
                          <div style={{ height: '250px', minHeight: '250px' }}>
                            <Line
                              data={keyDatesLineData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    display: false,
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function (context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        return `${label}: ${value}`;
                                      },
                                    },
                                  },
                                },
                                scales: {
                                  y: {
                                    display: true,
                                    min: 0,
                                    ticks: {
                                      color: 'white',
                                      stepSize: 1,
                                      precision: 0,
                                    },
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.2)',
                                      drawBorder: false,
                                    },
                                  },
                                  x: {
                                    grid: {
                                      display: false,
                                      drawBorder: false,
                                    },
                                    ticks: {
                                      color: 'white',
                                      font: {
                                        weight: 'bold',
                                      },
                                    },
                                  },
                                },
                                animation: {
                                  duration: 1500,
                                  easing: 'easeOutQuart',
                                },
                              }}
                            />
                          </div>
                          <div className="d-flex justify-content-around mt-2">
                            {keyDatesLineData.labels.map((label, index) => (
                              <div key={index} className="text-center">
                                <div className="text-white small">{label}</div>
                                <div className="text-white fw-bold">{keyDatesLineData.datasets[0].data[index]}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lawyers Cases Line Chart - Simplified */}
                    <div className="col-12">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
                          borderRadius: '12px',
                        }}
                      >
                        <div className="card-header bg-transparent border-0 p-2 p-md-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>
                              <FontAwesomeIcon icon={faUserTie} className="me-2" />
                              {filters.assignedUser
                                ? `${
                                    casesData.assignedUsers.find((u) => u.userId === filters.assignedUser)?.name ||
                                    'Selected Lawyer'
                                  } Cases`
                                : 'All Lawyers Cases'}
                            </h5>
                            {filters.assignedUser && (
                              <span className="badge bg-light text-dark">
                                {casesData.assignedUsers.find((u) => u.userId === filters.assignedUser)?.role || 'Role'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="card-body p-2 p-md-3">
                          <div style={{ height: '300px', minHeight: '300px' }}>
                            <Line
                              data={assignedUserLineData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    labels: {
                                      color: 'white',
                                      boxWidth: 12,
                                      padding: 20,
                                    },
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function (context) {
                                        const label = context.dataset.label || '';
                                        const value = context.raw || 0;

                                        if (filters.assignedUser) {
                                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                          const percentage = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
                                          return `${label}: ${value} (${percentage}%)`;
                                        } else {
                                          return `${label}: ${value} cases`;
                                        }
                                      },
                                    },
                                  },
                                },
                                scales: {
                                  y: {
                                    display: true,
                                    min: 0,
                                    ticks: {
                                      color: 'white',
                                      stepSize: 1,
                                      precision: 0,
                                    },
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.2)',
                                      drawBorder: false,
                                    },
                                  },
                                  x: {
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.2)',
                                      drawBorder: false,
                                    },
                                    ticks: {
                                      color: 'white',
                                      font: {
                                        weight: 'bold',
                                      },
                                    },
                                  },
                                },
                                animation: {
                                  duration: 1500,
                                  easing: 'easeOutQuart',
                                },
                              }}
                            />
                          </div>
                          {/* Status labels for All Lawyers Cases */}
                          {!filters.assignedUser && (
                            <div className="d-flex justify-content-around mt-2">
                              <div className="text-center">
                                <div className="text-white small">Open</div>
                                <div className="text-white fw-bold">
                                  {filteredCases.filter((c) => c.Status === 'Open').length}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-white small">Closed +ve</div>
                                <div className="text-white fw-bold">
                                  {filteredCases.filter((c) => c.Status === 'Close Positive').length}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-white small">Closed -ve</div>
                                <div className="text-white fw-bold">
                                  {filteredCases.filter((c) => c.Status === 'Close Negative').length}
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Status labels for Specific Lawyer */}
                          {filters.assignedUser && (
                            <div className="d-flex justify-content-around mt-2">
                              {assignedUserLineData.labels.map((label, index) => (
                                <div key={index} className="text-center">
                                  <div className="text-white small">{label}</div>
                                  <div className="text-white fw-bold">
                                    {assignedUserLineData.datasets[0].data[index]}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseSummary;
