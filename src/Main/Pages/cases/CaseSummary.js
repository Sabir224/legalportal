import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Container, Spinner, Alert, Row, Col, Card, Form, Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
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
  faUserTie
} from "@fortawesome/free-solid-svg-icons";
import { Bar, Line } from "react-chartjs-2";
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
  ArcElement
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAlert } from "../../../Component/AlertContext";
import { ApiEndPoint } from "../Component/utils/utlis";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Utility functions
const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const formatDateForDisplay = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const formatCurrency = (amount) => {
  return amount ? new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) : "N/A";
};

// Color scheme
const COLORS = {
  primary: '#3B82F6', // Blue
  secondary: '#10B981', // Green
  accent: '#F59E0B', // Amber
  neutral: '#6B7280', // Gray
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
  danger: '#EF4444' // Red
};

// Utility function to get all unique dates from cases
// Utility function to get all unique dates from cases
// Utility function to get all unique dates from cases
// Utility function to get all unique dates from cases
const getAllKeyDates = (cases) => {
  const dateMap = new Map();

  cases.forEach(caseItem => {
    const addDate = (date, type) => {
      if (!date) return;
      const dateStr = new Date(date).toISOString().split('T')[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, []);
      }
      dateMap.get(dateStr).push({
        type,
        caseId: caseItem.FkCaseId || caseItem._id
      });
    };

    addDate(caseItem.RequestDate, 'Request');
    addDate(caseItem.ESubmitDate, 'E-Submit');
    addDate(caseItem.FirstSessionDate, 'First Session');
    addDate(caseItem.NextSessionDate, 'Next Session');
    addDate(caseItem.LastSessionDate, 'Last Session');
    addDate(caseItem.VerdictDate, 'Verdict');
  });

  // Convert to array of dates and sort
  return Array.from(dateMap.keys())
    .sort((a, b) => new Date(a) - new Date(b))
    .map(dateStr => new Date(dateStr));
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
              display: false
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.raw || 0;
                  const percentage = Math.round((value / totalCases) * 1000) / 10;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          scales: {
            y: {
              display: true,
              min: 0,
              ticks: {
                color: 'white',
                stepSize: 1,
                precision: 0
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false
              },
              ticks: {
                color: 'white',
                font: {
                  weight: 'bold'
                }
              }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeOutQuart'
          }
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
              display: false
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const value = context.raw || 0;
                  const percentage = Math.round((value / totalCases) * 1000) / 10;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          scales: {
            y: {
              display: true,
              min: 0,
              ticks: {
                color: 'white',
                stepSize: 1,
                precision: 0
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.2)',
                drawBorder: false
              },
              ticks: {
                color: 'white',
                font: {
                  weight: 'bold'
                }
              }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeOutQuart'
          }
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
    assignedUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [filters, setFilters] = useState({
    caseSubType: "",
    assignedUser: "",
    role: "",
    startDate: null,
    endDate: null,
    priority: ""
  });
  const [lastUpdated, setLastUpdated] = useState("");
  const dashboardRef = useRef(null);
  const [caseDatesData, setCaseDatesData] = useState([]);

  const { showLoading, showSuccess, showError, showDataLoading } = useAlert();


  useEffect(() => {
    const fetchCaseSummaries = async () => {
      try {
        const response = await axios.get(`${ApiEndPoint}casesummary`);
        setCasesData(response.data);
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        setError("Unable to fetch case details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseSummaries();
  }, []); 

  useEffect(() => {
    const fetchCaseDates = async () => {
      try {
        const response = await axios.get(`${ApiEndPoint}getAllCasesDates`);
        setCaseDatesData(response.data.casesDates || []);
      } catch (err) {
        console.error("Error fetching case dates:", err);
        setCaseDatesData([]);
      }
    };

    fetchCaseDates();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiEndPoint}casesummary`);
      setCasesData(response.data);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError("Unable to refresh data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      caseSubType: "",
      assignedUser: "",
      role: "",
      startDate: null,
      endDate: null,
      priority: ""
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
      'Case Balance'
    ];
    showDataLoading(true)
    const rows = filteredCases.map(caseItem => [
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
      caseItem.CaseBalance ? formatCurrency(caseItem.CaseBalance) : ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

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

    showDataLoading(false)

  };

  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;

    showDataLoading(true)
    try {
      // Create PDF with higher quality settings
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Higher DPI settings
      const dpi = 300;
      const scaleFactor = dpi / 96; // 96 is default DPI

      // Load logo with higher resolution
      const logoUrl = `${window.location.origin}/logo.png`;
      const logoData = await fetch(logoUrl)
        .then(res => res.blob())
        .then(blob => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }));

      // ===== FRONT PAGE (UNCHANGED) =====
      pdf.setFontSize(24);
      pdf.setTextColor(0, 31, 63);
      pdf.text('Case Summary Report', pageWidth / 2, 40, { align: 'center' });

      pdf.setFontSize(16);
      pdf.text('AWS Legal Group', pageWidth / 2, 55, { align: 'center' });

      const logoWidth = 38;
      const logoHeight = 40;
      pdf.addImage(logoData, 'PNG', (pageWidth - logoWidth) / 2, 70, logoWidth, logoHeight);

      // ===== DATE RANGE (UNCHANGED) =====
      let dateRangeText = '';
      if (filters.startDate || filters.endDate) {
        const startDate = filters.startDate ? formatDateForDisplay(filters.startDate) : 'Start';
        const endDate = filters.endDate ? formatDateForDisplay(filters.endDate) : 'End';
        dateRangeText = `from ${startDate} to ${endDate}`;
      } else {
        const allDates = casesData.cases
          .map(c => new Date(c.CreatedAt))
          .filter(d => !isNaN(d.getTime()));
        if (allDates.length > 0) {
          const minDate = new Date(Math.min(...allDates));
          const maxDate = new Date(Math.max(...allDates));
          dateRangeText = `from ${formatDateForDisplay(minDate)} to ${formatDateForDisplay(maxDate)}`;
        }
      }

      // ===== ROLE TEXT (UNCHANGED) =====
      let roleText = '';
      if (filters.assignedUser === "all-lawyers" || filters.role === "Lawyer") {
        roleText = 'for Lawyers';
      } else if (filters.assignedUser === "all-ops" || filters.role === "Ops") {
        roleText = 'for Operations Team';
      } else if (filters.assignedUser) {
        const user = casesData.assignedUsers.find(u => u.userId === filters.assignedUser);
        roleText = user ? `for ${user.name} (${user.role})` : '';
      }

      pdf.setFontSize(14);
      pdf.text(`Summary of Cases ${dateRangeText} ${roleText}`, pageWidth / 2, 120, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Total Cases: ${filteredCounts.total} (Filtered from ${casesData.totalCases} total cases)`,
        pageWidth / 2,
        135,
        { align: 'center' }
      );

      // ===== CONTENT PAGES WITH SMALLER CARD WIDTHS =====
      if (viewMode === 'cards') {
        const cards = dashboardRef.current.querySelectorAll('.card');

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          if (card.textContent.includes('Filters')) continue;

          const cardTitle = card.querySelector('.card-header h5')?.textContent || `Chart ${i + 1}`;

          pdf.addPage();

          // Page 2 heading rename (UNCHANGED)
          if (i === 0) {
            pdf.setFontSize(18);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Case Summary`, 20, 15);
          } else {
            pdf.setFontSize(18);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`${cardTitle}`, 20, 15);
          }

          if (dateRangeText) {
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(dateRangeText, pageWidth - 20, 15, { align: 'right' });
          }

          // Higher quality canvas rendering with smaller width
          const canvas = await html2canvas(card, {
            scale: scaleFactor, // Increased scale for better quality
            logging: false,
            useCORS: true,
            backgroundColor: '#f0f2f5',
            allowTaint: true,
            letterRendering: true,
            quality: 1 // Highest quality
          });

          // Reduced width for smaller cards (80% of page width instead of full width)
          const imgWidth = (pageWidth - 40) * 0.8;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Adjust for page height
          if (imgHeight > pageHeight - 40) {
            const scaleFactor = (pageHeight - 40) / imgHeight;
            imgHeight *= scaleFactor;
          }

          const yPos = (pageHeight - imgHeight) / 2;
          const xPos = (pageWidth - imgWidth) / 2; // Center the smaller card

          // Add image with smaller width and centered
          pdf.addImage(canvas, 'PNG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
        }
      } else {
        // Chart groups with smaller width
        const chartGroups = [
          dashboardRef.current.querySelectorAll('.row.g-3.mb-4')[0],
          dashboardRef.current.querySelectorAll('.row.g-3')[0]
        ];

        for (let i = 0; i < chartGroups.length; i++) {
          pdf.addPage();

          if (i === 0) {
            pdf.setFontSize(18);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Case Summary`, 20, 15);
          } else {
            pdf.setFontSize(18);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Case Analytics Charts`, 20, 15);
          }

          if (dateRangeText) {
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(dateRangeText, pageWidth - 20, 15, { align: 'right' });
          }

          const group = chartGroups[i];
          const canvas = await html2canvas(group, {
            scale: scaleFactor, // Increased scale for better quality
            logging: false,
            useCORS: true,
            backgroundColor: '#f0f2f5',
            allowTaint: true,
            letterRendering: true,
            quality: 1 // Highest quality
          });

          // Reduced width for smaller chart groups (80% of page width)
          const imgWidth = (pageWidth - 40) * 0.8;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;
          if (imgHeight > pageHeight - 40) {
            const scaleFactor = (pageHeight - 40) / imgHeight;
            imgHeight *= scaleFactor;
          }

          const yPos = (pageHeight - imgHeight) / 2;
          const xPos = (pageWidth - imgWidth) / 2; // Center the smaller chart group

          pdf.addImage(canvas, 'PNG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
        }
      }

      // ===== SAVE PDF =====
      pdf.save(`Case_Summary_Report_${new Date().toISOString().slice(0, 10)}.pdf`);

      showDataLoading(false)


    } catch (err) {
      console.error('Error exporting PDF:', err);
      showDataLoading(false)

      alert('Failed to export PDF. Please try again.');
    }
  };
  // Filter cases based on selected filters
  const filteredCases = casesData.cases.filter(caseItem => {
    const caseDate = caseItem.CreatedAt ? new Date(caseItem.CreatedAt) : null;
    const startDateFilter = filters.startDate ? new Date(filters.startDate) : null;
    const endDateFilter = filters.endDate ? new Date(filters.endDate) : null;

    const dateInRange =
      (!startDateFilter || (caseDate && caseDate >= startDateFilter)) &&
      (!endDateFilter || (caseDate && caseDate <= endDateFilter));

    // Handle assigned user filtering
    let assignedUserMatch = true;
    if (filters.assignedUser === "all-lawyers") {
      // Only show cases assigned to lawyers
      assignedUserMatch = caseItem.AssignedStaff.some(staff => {
        const user = casesData.assignedUsers.find(u => u.userId === staff.userId);
        return user && user.role.toLowerCase().includes('lawyer');
      });
    } else if (filters.assignedUser === "all-ops") {
      // Only show cases assigned to non-lawyers (ops)
      assignedUserMatch = caseItem.AssignedStaff.some(staff => {
        const user = casesData.assignedUsers.find(u => u.userId === staff.userId);
        return user && !user.role.toLowerCase().includes('lawyer');
      });
    } else if (filters.assignedUser) {
      // Show cases assigned to specific user
      assignedUserMatch = caseItem.AssignedStaff.some(staff => staff.userId === filters.assignedUser);
    } else if (filters.role === "Lawyer") {
      // Show all lawyer cases (when role filter is set to Lawyer)
      assignedUserMatch = caseItem.AssignedStaff.some(staff => {
        const user = casesData.assignedUsers.find(u => u.userId === staff.userId);
        return user && user.role.toLowerCase().includes('lawyer');
      });
    } else if (filters.role === "Ops") {
      // Show all ops cases (when role filter is set to Ops)
      assignedUserMatch = caseItem.AssignedStaff.some(staff => {
        const user = casesData.assignedUsers.find(u => u.userId === staff.userId);
        return user && !user.role.toLowerCase().includes('lawyer');
      });
    }

    return (
      (filters.priority === "" || caseItem.Priority === filters.priority) &&
      (filters.caseSubType === "" || caseItem.CaseSubType === filters.caseSubType) &&
      dateInRange &&
      assignedUserMatch
    );
  });

  // Calculate case status counts from filtered cases
  const caseStatusData = {
    open: filteredCases.filter(c => c.Status === "Open").length,
    closedPositive: filteredCases.filter(c => c.Status === "Close Positive").length,
    closedNegative: filteredCases.filter(c => c.Status === "Close Negative").length
  };

  // Calculate filtered counts
  const filteredCounts = {
    total: filteredCases.length,
    open: caseStatusData.open,
    closed: caseStatusData.closedPositive + caseStatusData.closedNegative,
    inactive: filteredCases.filter(c => !c.IsActive).length,
    closedPositive: caseStatusData.closedPositive,
    closedNegative: caseStatusData.closedNegative
  };

  // Get unique values for filter dropdowns
  const priorityOptions = [...new Set(casesData.cases.map(c => c.Priority))];
  const caseSubTypeOptions = [...new Set(casesData.cases?.map(c => c.CaseSubType) || [])].filter(Boolean);

  // Get unique roles without duplicates
  const roleOptions = [...new Set(casesData.assignedUsers.map(u => u.role))].filter(role =>
    role && role.trim() !== ""
  );

  // Categorize users into Lawyers and Ops
  const lawyers = casesData.assignedUsers.filter(user =>
    user.role && user.role.toLowerCase().includes('lawyer')
  );
  const ops = casesData.assignedUsers.filter(user =>
    user.role && !user.role.toLowerCase().includes('lawyer')
  );

  // Get all key dates from filtered cases
  // Get all key dates from filtered cases
  // Get all key dates from filtered cases
  const keyDates = caseDatesData.length > 0
    ? getAllKeyDates(caseDatesData)
    : getAllKeyDates(filteredCases);

  // Case Status Bar Chart Data
  const caseStatusBarData = {
    labels: ["Open", "Close +ve", "Close -ve"],
    datasets: [
      {
        label: "Cases",
        data: [
          caseStatusData.open,
          caseStatusData.closedPositive,
          caseStatusData.closedNegative
        ],
        backgroundColor: [COLORS.primary, COLORS.success, COLORS.danger],
        borderColor: [COLORS.primary, COLORS.success, COLORS.danger],
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  // Case Status Line Chart Data
  const caseStatusLineData = {
    labels: ["Open", "Close +ve", "Close -ve"],
    datasets: [
      {
        label: "Cases",
        data: [
          caseStatusData.open,
          caseStatusData.closedPositive,
          caseStatusData.closedNegative
        ],
        borderColor: COLORS.primary,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.primary
      }
    ]
  };

  // Total Cases Bar Chart Data (for cards view)
  const totalCasesBarData = {
    labels: ["Total Cases"],
    datasets: [
      {
        label: "Total Cases",
        data: [filteredCounts.total],
        backgroundColor: [COLORS.neutral],
        borderColor: [COLORS.neutral],
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  // Total Cases Line Chart Data (for graphs view)
  const totalCasesLineData = {
    labels: ["Total Cases"],
    datasets: [
      {
        label: "Total Cases",
        data: [filteredCounts.total],
        borderColor: COLORS.neutral,
        backgroundColor: "rgba(107, 114, 128, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.neutral,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.neutral
      }
    ]
  };

  const casePriorityBarData = {
    labels: priorityOptions,
    datasets: [
      {
        label: "Cases",
        data: priorityOptions.map(priority =>
          filteredCases.filter(c => c.Priority === priority).length
        ),
        backgroundColor: priorityOptions.map(() => COLORS.primary),
        borderColor: priorityOptions.map(() => COLORS.primary),
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  // Calculate financial data with proper scaling
  const avgClaimed = Math.round(
    filteredCases.reduce((sum, c) => sum + (c.ClaimedAmount || 0), 0) /
    Math.max(1, filteredCases.length)
  );
  const avgBalance = Math.round(
    filteredCases.reduce((sum, c) => sum + (c.CaseBalance || 0), 0) /
    Math.max(1, filteredCases.length)
  );
  const maxFinancialValue = Math.max(avgClaimed, avgBalance);

  const financialOverviewBarData = {
    labels: ["Avg Claimed", "Avg Balance"],
    datasets: [
      {
        label: "Amount",
        data: [avgClaimed, avgBalance],
        backgroundColor: [COLORS.success, COLORS.primary],
        borderColor: [COLORS.success, COLORS.primary],
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  // Key Dates Bar Chart Data - Fixed to properly count dates
  // Key Dates Bar Chart Data - Fixed to properly count dates
  // Key Dates Bar Chart Data
  const keyDatesBarData = {
    labels: keyDates.map(date => formatDateForDisplay(date)),
    datasets: [
      {
        label: "Request Date",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return (caseDatesData.length > 0 ? caseDatesData : filteredCases).filter(c =>
            c.RequestDate && new Date(c.RequestDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: "E-Submit Date",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.ESubmitDate && new Date(c.ESubmitDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: "First Session",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.FirstSessionDate && new Date(c.FirstSessionDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: "Next Session",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.NextSessionDate && new Date(c.NextSessionDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        backgroundColor: COLORS.warning,
        borderColor: COLORS.warning,
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: "Last Session",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.LastSessionDate && new Date(c.LastSessionDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        backgroundColor: COLORS.danger,
        borderColor: COLORS.danger,
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: "Verdict Date",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.VerdictDate && new Date(c.VerdictDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };
  const casePriorityLineData = {
    labels: priorityOptions,
    datasets: [
      {
        label: "Cases",
        data: priorityOptions.map(priority =>
          filteredCases.filter(c => c.Priority === priority).length
        ),
        borderColor: COLORS.primary,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.primary
      }
    ]
  };

  const financialOverviewLineData = {
    labels: ["Avg Claimed", "Avg Balance"],
    datasets: [
      {
        label: "Amount",
        data: [avgClaimed, avgBalance],
        borderColor: COLORS.success,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.success,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.success
      }
    ]
  };

  // Key Dates Line Chart Data - Fixed to properly count dates
  // Key Dates Line Chart Data - Fixed version
  const keyDatesLineData = {
    labels: keyDates.map(date => formatDateForDisplay(date)),
    datasets: [
      {
        label: "Request Date",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return (caseDatesData.length > 0 ? caseDatesData : filteredCases).filter(c =>
            c.RequestDate && new Date(c.RequestDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        borderColor: COLORS.accent,
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.3,
        fill: false,
        pointBackgroundColor: COLORS.accent,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.accent
      },
      {
        label: "E-Submit Date",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.ESubmitDate && new Date(c.ESubmitDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        borderColor: COLORS.primary,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: false,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.primary
      },
      {
        label: "First Session",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.FirstSessionDate && new Date(c.FirstSessionDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        borderColor: COLORS.secondary,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
        fill: false,
        pointBackgroundColor: COLORS.secondary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.secondary
      },
      {
        label: "Next Session",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.NextSessionDate && new Date(c.NextSessionDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        borderColor: COLORS.warning,
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.3,
        fill: false,
        pointBackgroundColor: COLORS.warning,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.warning
      },
      {
        label: "Last Session",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.LastSessionDate && new Date(c.LastSessionDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        borderColor: COLORS.danger,
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
        fill: false,
        pointBackgroundColor: COLORS.danger,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.danger
      },
      {
        label: "Verdict Date",
        data: keyDates.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          return caseDatesData.filter(c =>
            c.VerdictDate && new Date(c.VerdictDate).toISOString().split('T')[0] === dateStr
          ).length;
        }),
        borderColor: COLORS.success,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.3,
        fill: false,
        pointBackgroundColor: COLORS.success,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.success
      }
    ]
  };
  // Get all lawyers cases data
  const getAllLawyersCasesData = () => {
    const lawyersData = lawyers.map(user => {
      const userCases = filteredCases.filter(caseItem =>
        caseItem.AssignedStaff.some(staff => staff.userId === user.userId)
      );

      return {
        userId: user.userId,
        name: user.name,
        role: user.role,
        open: userCases.filter(c => c.Status === "Open").length,
        closedPositive: userCases.filter(c => c.Status === "Close Positive").length,
        closedNegative: userCases.filter(c => c.Status === "Close Negative").length,
        total: userCases.length
      };
    });

    return lawyersData;
  };

  // Get all ops cases data
  const getAllOpsCasesData = () => {
    const opsData = ops.map(user => {
      const userCases = filteredCases.filter(caseItem =>
        caseItem.AssignedStaff.some(staff => staff.userId === user.userId)
      );

      return {
        userId: user.userId,
        name: user.name,
        role: user.role,
        open: userCases.filter(c => c.Status === "Open").length,
        closedPositive: userCases.filter(c => c.Status === "Close Positive").length,
        closedNegative: userCases.filter(c => c.Status === "Close Negative").length,
        total: userCases.length
      };
    });

    return opsData;
  };

  // Get data for lawyer status breakdown (for card view)
  const getLawyerStatusBreakdownBarData = () => {
    const lawyersData = getAllLawyersCasesData();

    return {
      labels: lawyersData.map(l => l.name),
      datasets: [
        {
          label: "Open",
          data: lawyersData.map(l => l.open),
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: "Close Positive",
          data: lawyersData.map(l => l.closedPositive),
          backgroundColor: COLORS.success,
          borderColor: COLORS.success,
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: "Close Negative",
          data: lawyersData.map(l => l.closedNegative),
          backgroundColor: COLORS.danger,
          borderColor: COLORS.danger,
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };
  };

  // Get data for ops status breakdown (for card view)
  const getOpsStatusBreakdownBarData = () => {
    const opsData = getAllOpsCasesData();

    return {
      labels: opsData.map(l => l.name),
      datasets: [
        {
          label: "Open",
          data: opsData.map(l => l.open),
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: "Close Positive",
          data: opsData.map(l => l.closedPositive),
          backgroundColor: COLORS.success,
          borderColor: COLORS.success,
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: "Close Negative",
          data: opsData.map(l => l.closedNegative),
          backgroundColor: COLORS.danger,
          borderColor: COLORS.danger,
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };
  };

  // Get data for lawyer status breakdown (for graph view)
  const getLawyerStatusBreakdownLineData = () => {
    const lawyersData = getAllLawyersCasesData();

    return {
      labels: lawyersData.map(l => l.name),
      datasets: [
        {
          label: "Open",
          data: lawyersData.map(l => l.open),
          borderColor: COLORS.primary,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.primary,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: COLORS.primary
        },
        {
          label: "Close Positive",
          data: lawyersData.map(l => l.closedPositive),
          borderColor: COLORS.success,
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.success,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: COLORS.success
        },
        {
          label: "Close Negative",
          data: lawyersData.map(l => l.closedNegative),
          borderColor: COLORS.danger,
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.danger,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: COLORS.danger
        }
      ]
    };
  };

  // Get data for ops status breakdown (for graph view)
  const getOpsStatusBreakdownLineData = () => {
    const opsData = getAllOpsCasesData();

    return {
      labels: opsData.map(l => l.name),
      datasets: [
        {
          label: "Open",
          data: opsData.map(l => l.open),
          borderColor: COLORS.primary,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.primary,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: COLORS.primary
        },
        {
          label: "Close Positive",
          data: opsData.map(l => l.closedPositive),
          borderColor: COLORS.success,
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.success,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: COLORS.success
        },
        {
          label: "Close Negative",
          data: opsData.map(l => l.closedNegative),
          borderColor: COLORS.danger,
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.danger,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: COLORS.danger
        }
      ]
    };
  };

  // Simplified version of lawyer cases line chart data
  const getAssignedUserCasesBarData = (userId) => {
    // Show combined data for all users when no filters are selected
    if (!userId && !filters.role) {
      return {
        labels: ["Open", "Close Positive", "Close Negative"],
        datasets: [
          {
            label: "All Users Cases",
            data: [
              filteredCases.filter(c => c.Status === "Open").length,
              filteredCases.filter(c => c.Status === "Close Positive").length,
              filteredCases.filter(c => c.Status === "Close Negative").length
            ],
            backgroundColor: [COLORS.primary, COLORS.success, COLORS.danger],
            borderColor: [COLORS.primary, COLORS.success, COLORS.danger],
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      };
    }

    if (filters.assignedUser === "all-lawyers") {
      return getLawyerStatusBreakdownBarData();
    } else if (filters.assignedUser === "all-ops") {
      return getOpsStatusBreakdownBarData();
    } else if (!userId && filters.role === "Lawyer") {
      return getLawyerStatusBreakdownBarData();
    } else if (!userId && filters.role === "Ops") {
      return getOpsStatusBreakdownBarData();
    } else if (!userId) {
      return null;
    }

    // Show status breakdown for specific user
    const user = casesData.assignedUsers.find(u => u.userId === userId);
    if (!user) return null;

    const userCases = filteredCases.filter(caseItem =>
      caseItem.AssignedStaff.some(staff => staff.userId === userId)
    );

    return {
      labels: ["Open", "Close Positive", "Close Negative"],
      datasets: [
        {
          label: "Cases",
          data: [
            userCases.filter(c => c.Status === "Open").length,
            userCases.filter(c => c.Status === "Close Positive").length,
            userCases.filter(c => c.Status === "Close Negative").length
          ],
          backgroundColor: [COLORS.primary, COLORS.success, COLORS.danger],
          borderColor: [COLORS.primary, COLORS.success, COLORS.danger],
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    };
  };

  // Simplified version of lawyer cases bar chart data
  const getAssignedUserCasesLineData = (userId) => {
    // Show combined data for all users when no filters are selected
    if (!userId && !filters.role) {
      return {
        labels: ["Open", "Close Positive", "Close Negative"],
        datasets: [
          {
            label: "All Users Cases",
            data: [
              filteredCases.filter(c => c.Status === "Open").length,
              filteredCases.filter(c => c.Status === "Close Positive").length,
              filteredCases.filter(c => c.Status === "Close Negative").length
            ],
            borderColor: COLORS.primary,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.3,
            fill: true,
            pointBackgroundColor: COLORS.primary,
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: COLORS.primary
          }
        ]
      };
    }

    if (filters.assignedUser === "all-lawyers") {
      return getLawyerStatusBreakdownLineData();
    } else if (filters.assignedUser === "all-ops") {
      return getOpsStatusBreakdownLineData();
    } else if (!userId && filters.role === "Lawyer") {
      return getLawyerStatusBreakdownLineData();
    } else if (!userId && filters.role === "Ops") {
      return getOpsStatusBreakdownLineData();
    } else if (!userId) {
      return null;
    }

    // Show status breakdown for specific user
    const user = casesData.assignedUsers.find(u => u.userId === userId);
    if (!user) return null;

    const userCases = filteredCases.filter(caseItem =>
      caseItem.AssignedStaff.some(staff => staff.userId === userId)
    );

    return {
      labels: ["Open", "Close Positive", "Close Negative"],
      datasets: [
        {
          label: "Cases",
          data: [
            userCases.filter(c => c.Status === "Open").length,
            userCases.filter(c => c.Status === "Close Positive").length,
            userCases.filter(c => c.Status === "Close Negative").length
          ],
          borderColor: COLORS.primary,
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COLORS.primary,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: COLORS.primary
        }
      ]
    };
  };

  // Assigned User Cases Chart Data
  const assignedUserBarData = getAssignedUserCasesBarData(filters.assignedUser);
  const assignedUserLineData = getAssignedUserCasesLineData(filters.assignedUser);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{
        height: "100vh",
        backgroundColor: "#f8f9fa"
      }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5" style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!casesData || casesData.cases.length === 0) {
    return (
      <Container className="mt-5" style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}>
        <Alert variant="warning">No case data available.</Alert>
      </Container>
    );
  }

  return (
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
        <div className="container-fluid p-0" style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
        }} ref={dashboardRef}>

          {/* Header Section */}
          <div className="px-3 px-md-4 py-2 mb-3" style={{
            backgroundColor: "#001f3f",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            margin: "16px 16px 0 16px",
          }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <FontAwesomeIcon
                  icon={faGavel}
                  className="text-white me-2"
                  style={{
                    fontSize: "1.2rem",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    padding: "8px",
                    borderRadius: "6px"
                  }}
                />
                <div>
                  <h2 className="text-white mb-0" style={{
                    fontSize: "1.3rem",
                    fontWeight: 600
                  }}>
                    Case Summary Dashboard
                  </h2>
                  <p className="text-white-50 mb-0" style={{ fontSize: "0.75rem" }}>
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
                  <FontAwesomeIcon icon={faSyncAlt} className={loading ? "fa-spin" : ""} />
                  <span className="ms-1 d-none d-md-inline">Refresh</span>
                </Button>

                {/* Export Dropdown */}
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
                    <Dropdown.Item onClick={handleExportPDF}>
                      <FontAwesomeIcon icon={faFileImage} className="me-2 text-primary" />
                      Export as PDF
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* View Mode Toggle */}
                <div className="d-flex align-items-center ms-md-2" style={{ gap: "10px" }}>
                  <Button
                    variant={viewMode === "cards" ? "light" : "outline-light"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    title="Cards View"
                    className="flex-grow-1 flex-md-grow-0"
                  >
                    <FontAwesomeIcon icon={faThLarge} />
                    <span className="ms-1 d-none d-md-inline">Cards</span>
                  </Button>
                  <Button
                    variant={viewMode === "graphs" ? "light" : "outline-light"}
                    size="sm"
                    onClick={() => setViewMode("graphs")}
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
          <div className="px-3 px-md-4 py-3 mb-3" style={{
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            margin: "0 16px"
          }}>
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-3">
              <div className="d-flex align-items-center mb-2 mb-md-0">
                <FontAwesomeIcon
                  icon={faFilter}
                  className="text-primary me-2"
                />
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
              {/* Case Subtype Filter */}
              <div className="col-12 col-sm-6 col-md-3">
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">Case Subtype</Form.Label>
                  <Form.Select
                    value={filters.caseSubType}
                    onChange={(e) => setFilters({ ...filters, caseSubType: e.target.value })}
                  >
                    <option value="">All Case Subtypes</option>
                    {caseSubTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Combined Assigned User/Role Filter */}
              {/* Combined Assigned User/Role Filter */}
              <div className="col-12 col-sm-6 col-md-3">
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">Assigned User</Form.Label>
                  <Form.Select
                    value={filters.assignedUser}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === "all-lawyers") {
                        setFilters({
                          ...filters,
                          assignedUser: "all-lawyers",
                          role: "Lawyer"
                        });
                      } else if (selectedValue === "all-ops") {
                        setFilters({
                          ...filters,
                          assignedUser: "all-ops",
                          role: "Ops"
                        });
                      } else {
                        setFilters({
                          ...filters,
                          assignedUser: selectedValue,
                          role: selectedValue ?
                            casesData.assignedUsers.find(u => u.userId === selectedValue)?.role || ""
                            : ""
                        });
                      }
                    }}
                  >
                    <option value="">All Users</option>

                    {/* Lawyers Section */}
                    <optgroup label="Lawyers">
                      <option value="all-lawyers">All Lawyers</option>
                      {lawyers.map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Operations Section */}
                    <optgroup label="Operations">
                      <option value="all-ops">All Ops</option>
                      {/* Regular Ops */}
                      {ops.filter(user =>
                        !['admin', 'receptionist', 'paralegal'].includes(user.role.toLowerCase())
                      ).map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </optgroup>

                    {/* Admin Section */}
                    <optgroup label="Admin">
                      {ops.filter(user =>
                        user.role.toLowerCase() === 'admin'
                      ).map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </optgroup>

                    {/* Receptionist Section */}
                    <optgroup label="Receptionist">
                      {ops.filter(user =>
                        user.role.toLowerCase() === 'receptionist'
                      ).map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </optgroup>

                    {/* Paralegal Section */}
                    <optgroup label="Paralegal">
                      {ops.filter(user =>
                        user.role.toLowerCase() === 'paralegal'
                      ).map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </optgroup>
                  </Form.Select>
                </Form.Group>
              </div>
              {/* Priority Filter */}
              <div className="col-12 col-sm-6 col-md-3">
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">Priority</Form.Label>
                  <Form.Select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  >
                    <option value="">All Priorities</option>
                    {priorityOptions.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Date Range Filter */}
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted mb-1">Date Range</Form.Label>
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <div style={{ flex: '1 1 120px' }}>
                      <DatePicker
                        selected={filters.startDate}
                        onChange={(date) => {
                          // If end date exists and is before the new start date, reset end date
                          if (filters.endDate && date && new Date(date) > new Date(filters.endDate)) {
                            setFilters({ ...filters, startDate: date, endDate: null });
                          } else {
                            setFilters({ ...filters, startDate: date });
                          }
                        }}
                        selectsStart
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        maxDate={new Date()} // Prevent selecting future dates
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="Start Date"
                        isClearable
                      />
                    </div>
                    <div style={{ flex: '1 1 120px' }}>
                      <DatePicker
                        selected={filters.endDate}
                        onChange={(date) => {
                          // Ensure end date is not in the future
                          const today = new Date();
                          const selectedDate = date ? new Date(date) : null;
                          const finalDate = selectedDate && selectedDate > today ? today : selectedDate;
                          setFilters({ ...filters, endDate: finalDate });
                        }}
                        selectsEnd
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        minDate={filters.startDate}
                        maxDate={new Date()} // Prevent selecting future dates
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        placeholderText="End Date"
                        isClearable
                        disabled={!filters.startDate}
                      />
                    </div>
                  </div>
                </Form.Group>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{
            padding: "0 16px 16px 16px",
            height: "calc(100vh - 180px)",
            // overflowY: "auto",
            msOverflowStyle: "none",
            scrollbarWidth: "none"
          }}>
            {/* Hide scrollbar for Chrome, Safari and Opera */}
            <style>
              {`::-webkit-scrollbar {
              display: none;
            }`}
            </style>

            {/* Main Content Card */}
            <div className="card shadow-sm border-0" style={{
              borderRadius: "8px",
              backgroundColor: "white",
              minHeight: "calc(100vh - 212px)",
              overflow: "hidden"
            }}>
              <div className="card-body p-3 p-md-4" style={{
                overflowY: "auto",
                height: "100%",
                msOverflowStyle: "none",
                scrollbarWidth: "none"
              }}>
                {/* Hide scrollbar for Chrome, Safari and Opera */}
                <style>
                  {`::-webkit-scrollbar {
                  display: none;
                }`}
                </style>

                {viewMode === "cards" ? (
                  <div className="row g-3">
                    {/* Total Cases Card - Now with Bar Chart */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="card border-0 shadow-sm h-100" style={{
                        background: "linear-gradient(135deg, #6b7280, #9ca3af)",
                        borderRadius: "12px"
                      }}>
                        <div className="card-header bg-transparent border-0 p-3">
                          <h5 className="mb-0 text-white">
                            <FontAwesomeIcon icon={faHashtag} className="me-2" />
                            Total Cases
                          </h5>
                        </div>
                        <div className="card-body p-3 d-flex flex-column">
                          <div style={{ height: "120px", marginBottom: "10px" }}>
                            <Bar
                              data={totalCasesBarData}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    display: false
                                  },
                                  tooltip: {
                                    callbacks: {
                                      label: function (context) {
                                        return `${context.raw} cases`;
                                      }
                                    }
                                  }
                                },
                                scales: {
                                  y: {
                                    display: true,
                                    min: 0,
                                    ticks: {
                                      color: 'white',
                                      stepSize: Math.max(1, Math.ceil(filteredCounts.total / 5)),
                                      precision: 0
                                    },
                                    grid: {
                                      color: 'rgba(255, 255, 255, 0.2)',
                                      drawBorder: false
                                    }
                                  },
                                  x: {
                                    grid: {
                                      display: false,
                                      drawBorder: false
                                    },
                                    ticks: {
                                      color: 'white',
                                      font: {
                                        weight: 'bold'
                                      }
                                    }
                                  }
                                },
                                animation: {
                                  duration: 1500,
                                  easing: 'easeOutQuart'
                                }
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
                      <div className="card border-0 shadow-sm h-100" style={{
                        background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
                        borderRadius: "12px"
                      }}>
                        <div className="card-header bg-transparent border-0 p-3">
                          <h5 className="mb-0 text-white">
                            <FontAwesomeIcon icon={faChartBar} className="me-2" />
                            Case Status
                          </h5>
                        </div>
                        <div className="card-body p-3" style={{ height: "250px" }}>
                          <StatusBarChart
                            data={caseStatusBarData}
                            totalCases={filteredCounts.total}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Financial Overview Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="card border-0 shadow-sm h-100" style={{
                        background: "linear-gradient(135deg, #047857, #10b981)",
                        borderRadius: "12px"
                      }}>
                        <div className="card-header bg-transparent border-0 p-3">
                          <h5 className="mb-0 text-white">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                            Financial Overview
                          </h5>
                        </div>
                        <div className="card-body p-3" style={{ height: "250px" }}>
                          <Bar
                            data={financialOverviewBarData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function (context) {
                                      return formatCurrency(context.raw);
                                    }
                                  }
                                }
                              },
                              scales: {
                                y: {
                                  display: true,
                                  min: 0,
                                  max: maxFinancialValue * 1.2, // Add 20% padding to ensure visibility
                                  ticks: {
                                    color: 'white',
                                    callback: function (value) {
                                      return formatCurrency(value);
                                    },
                                    font: {
                                      weight: 'bold'
                                    }
                                  },
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.2)',
                                    drawBorder: false
                                  }
                                },
                                x: {
                                  grid: {
                                    display: false,
                                    drawBorder: false
                                  },
                                  ticks: {
                                    color: 'white',
                                    font: {
                                      weight: 'bold'
                                    }
                                  }
                                }
                              },
                              animation: {
                                duration: 1500,
                                easing: 'easeOutQuart'
                              }
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
                      <div className="card border-0 shadow-sm h-100" style={{
                        background: "linear-gradient(135deg, #4338ca, #4f46e5)",
                        borderRadius: "12px"
                      }}>
                        <div className="card-header bg-transparent border-0 p-3">
                          <h5 className="mb-0 text-white">
                            <FontAwesomeIcon icon={faHourglassHalf} className="me-2" />
                            Case Priority
                          </h5>
                        </div>
                        <div className="card-body p-3" style={{ height: "250px" }}>
                          <Bar
                            data={casePriorityBarData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: false
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function (context) {
                                      const label = context.label || '';
                                      const value = context.raw || 0;
                                      const percentage = Math.round((value / filteredCounts.total) * 1000) / 10;
                                      return `${label}: ${value} (${percentage}%)`;
                                    }
                                  }
                                }
                              },
                              scales: {
                                y: {
                                  display: true,
                                  min: 0,
                                  ticks: {
                                    color: 'white',
                                    stepSize: 1,
                                    precision: 0
                                  },
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.2)',
                                    drawBorder: false
                                  }
                                },
                                x: {
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.2)',
                                    drawBorder: false
                                  },
                                  ticks: {
                                    color: 'white',
                                    font: {
                                      weight: 'bold'
                                    }
                                  }
                                }
                              },
                              animation: {
                                duration: 1500,
                                easing: 'easeOutQuart'
                              }
                            }}
                          />
                          <div className="d-flex justify-content-around mt-2">
                            {casePriorityBarData.labels.map((label, index) => (
                              <div key={index} className="text-center">
                                <div className="text-white small">{label}</div>
                                <div className="text-white fw-bold">
                                  {casePriorityBarData.datasets[0].data[index]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Key Dates Card */}
                    <div className="col-12 col-md-6">
                      <div className="card border-0 shadow-sm h-100" style={{
                        background: "linear-gradient(135deg, #b45309, #f59e0b)",
                        borderRadius: "12px"
                      }}>
                        <div className="card-header bg-transparent border-0 p-3">
                          <h5 className="mb-0 text-white">
                            <FontAwesomeIcon icon={faLandmark} className="me-2" />
                            Key Dates Timeline
                          </h5>
                        </div>
                        <div className="card-body p-3" style={{ height: "300px" }}>
                          <Bar
                            data={keyDatesBarData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'top',
                                  labels: {
                                    color: 'white',
                                    boxWidth: 12,
                                    padding: 20
                                  }
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function (context) {
                                      const label = context.dataset.label || '';
                                      const value = context.raw || 0;
                                      const dateStr = keyDates[context.dataIndex].toISOString().split('T')[0];

                                      // Get all cases for this date and type
                                      const casesForDate = caseDatesData.filter(c => {
                                        const dateField = {
                                          'Request Date': c.RequestDate,
                                          'E-Submit Date': c.ESubmitDate,
                                          'First Session': c.FirstSessionDate,
                                          'Next Session': c.NextSessionDate,
                                          'Last Session': c.LastSessionDate,
                                          'Verdict Date': c.VerdictDate
                                        }[label];

                                        return dateField && new Date(dateField).toISOString().split('T')[0] === dateStr;
                                      });

                                      const caseNumbers = casesForDate.map(c => c.CaseNumber || `Case ${c.FkCaseId || c._id}`).join(', ');

                                      return `${label}: ${value} case(s) - ${caseNumbers || 'No case numbers available'}`;
                                    }
                                  }
                                }
                              },
                              scales: {
                                y: {
                                  display: true,
                                  min: 0,
                                  ticks: {
                                    color: 'white',
                                    stepSize: 1,
                                    precision: 0
                                  },
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.2)',
                                    drawBorder: false
                                  }
                                },
                                x: {
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.2)',
                                    drawBorder: false
                                  },
                                  ticks: {
                                    color: 'white',
                                    font: {
                                      weight: 'bold'
                                    }
                                  }
                                }
                              },
                              animation: {
                                duration: 1500,
                                easing: 'easeOutQuart'
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lawyers/Ops Cases Card - Always shown */}
                    <div className="col-12">
                      <div className="card border-0 shadow-sm h-100" style={{
                        background: "linear-gradient(135deg, #1e40af, #1e3a8a)",
                        borderRadius: "12px"
                      }}>
                        <div className="card-header bg-transparent border-0 p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-white">
                              <FontAwesomeIcon icon={faUserTie} className="me-2" />
                              {filters.assignedUser === "all-lawyers" ? 'All Lawyers Cases' :
                                filters.assignedUser === "all-ops" ? 'All Ops Cases' :
                                  filters.assignedUser ?
                                    `${casesData.assignedUsers.find(u => u.userId === filters.assignedUser)?.name || 'Selected User'} Cases` :
                                    filters.role === "Lawyer" ? 'All Lawyers Cases' :
                                      filters.role === "Ops" ? 'All Ops Cases' : 'All Users Cases'}
                            </h5>
                            {filters.assignedUser && (
                              <span className="badge bg-light text-dark">
                                {casesData.assignedUsers.find(u => u.userId === filters.assignedUser)?.role || 'Role'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="card-body p-3" style={{ height: "300px" }}>
                          {assignedUserBarData && (
                            <>
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
                                        padding: 20
                                      }
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function (context) {
                                          const label = context.dataset.label || '';
                                          const value = context.raw || 0;

                                          if (filters.assignedUser && !["all-lawyers", "all-ops"].includes(filters.assignedUser)) {
                                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                            const percentage = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
                                            return `${label}: ${value} (${percentage}%)`;
                                          } else {
                                            return `${label}: ${value} cases`;
                                          }
                                        }
                                      }
                                    }
                                  },
                                  scales: {
                                    y: {
                                      display: true,
                                      min: 0,
                                      ticks: {
                                        color: 'white',
                                        stepSize: 1,
                                        precision: 0
                                      },
                                      grid: {
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        drawBorder: false
                                      }
                                    },
                                    x: {
                                      grid: {
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        drawBorder: false
                                      },
                                      ticks: {
                                        color: 'white',
                                        font: {
                                          weight: 'bold'
                                        }
                                      }
                                    }
                                  },
                                  animation: {
                                    duration: 1500,
                                    easing: 'easeOutQuart'
                                  }
                                }}
                              />
                              {/* Status labels for specific user */}
                              {filters.assignedUser && !["all-lawyers", "all-ops"].includes(filters.assignedUser) && (
                                <div className="d-flex justify-content-around mt-2">
                                  {assignedUserBarData.labels.map((label, index) => (
                                    <div key={index} className="text-center">
                                      <div className="text-white small">{label}</div>
                                      <div className="text-white fw-bold">
                                        {assignedUserBarData.datasets[0].data[index]}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
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
                        <div className="card border-0 shadow-sm h-100" style={{
                          background: "linear-gradient(135deg, #6b7280, #9ca3af)",
                          borderRadius: "12px"
                        }}>
                          <div className="card-header bg-transparent border-0 p-2 p-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faHashtag} className="text-white" />
                              <h5 className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>Total Cases</h5>
                            </div>
                          </div>
                          <div className="card-body p-2 p-md-3 d-flex flex-column">
                            <div style={{ height: "120px", marginBottom: "10px" }}>
                              <Line
                                data={totalCasesLineData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function (context) {
                                          return `${context.raw} cases`;
                                        }
                                      }
                                    }
                                  },
                                  scales: {
                                    y: {
                                      display: true,
                                      min: 0,
                                      ticks: {
                                        color: 'white',
                                        stepSize: Math.max(1, Math.ceil(filteredCounts.total / 5)),
                                        precision: 0
                                      },
                                      grid: {
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        drawBorder: false
                                      }
                                    },
                                    x: {
                                      grid: {
                                        display: false,
                                        drawBorder: false
                                      },
                                      ticks: {
                                        color: 'white',
                                        font: {
                                          weight: 'bold'
                                        }
                                      }
                                    }
                                  },
                                  animation: {
                                    duration: 1500,
                                    easing: 'easeOutQuart'
                                  }
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
                        <div className="card border-0 shadow-sm h-100" style={{
                          background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
                          borderRadius: "12px"
                        }}>
                          <div className="card-header bg-transparent border-0 p-2 p-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faChartLine} className="text-warning" />
                              <h5 className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>Case Status</h5>
                            </div>
                          </div>
                          <div className="card-body p-2 p-md-3">
                            <div style={{ height: "250px", minHeight: "250px" }}>
                              <StatusLineChart
                                data={caseStatusLineData}
                                totalCases={filteredCounts.total}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Financial Overview Line Chart */}
                      <div className="col-12 col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm h-100" style={{
                          background: "linear-gradient(135deg, #047857, #10b981)",
                          borderRadius: "12px"
                        }}>
                          <div className="card-header bg-transparent border-0 p-2 p-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faMoneyBillWave} className="text-warning" />
                              <h5 className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>Financial Overview</h5>
                            </div>
                          </div>
                          <div className="card-body p-2 p-md-3">
                            <div style={{ height: "250px", minHeight: "250px" }}>
                              <Line
                                data={financialOverviewLineData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function (context) {
                                          return formatCurrency(context.raw);
                                        }
                                      }
                                    }
                                  },
                                  scales: {
                                    y: {
                                      display: true,
                                      min: 0,
                                      max: maxFinancialValue * 1.2, // Add 20% padding to ensure visibility
                                      ticks: {
                                        color: 'white',
                                        callback: function (value) {
                                          return formatCurrency(value);
                                        },
                                        font: {
                                          weight: 'bold'
                                        }
                                      },
                                      grid: {
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        drawBorder: false
                                      }
                                    },
                                    x: {
                                      grid: {
                                        display: false,
                                        drawBorder: false
                                      },
                                      ticks: {
                                        color: 'white',
                                        font: {
                                          weight: 'bold'
                                        }
                                      }
                                    }
                                  },
                                  animation: {
                                    duration: 1500,
                                    easing: 'easeOutQuart'
                                  }
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
                        <div className="card border-0 shadow-sm h-100" style={{
                          background: "linear-gradient(135deg, #4338ca, #4f46e5)",
                          borderRadius: "12px"
                        }}>
                          <div className="card-header bg-transparent border-0 p-2 p-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faHourglassHalf} className="text-warning" />
                              <h5 className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>Case Priority</h5>
                            </div>
                          </div>
                          <div className="card-body p-2 p-md-3">
                            <div style={{ height: "250px", minHeight: "250px" }}>
                              <Line
                                data={casePriorityLineData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function (context) {
                                          const label = context.label || '';
                                          const value = context.raw || 0;
                                          const percentage = Math.round((value / filteredCounts.total) * 1000) / 10;
                                          return `${label}: ${value} (${percentage}%)`;
                                        }
                                      }
                                    }
                                  },
                                  scales: {
                                    y: {
                                      display: true,
                                      min: 0,
                                      ticks: {
                                        color: 'white',
                                        stepSize: 1,
                                        precision: 0
                                      },
                                      grid: {
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        drawBorder: false
                                      }
                                    },
                                    x: {
                                      grid: {
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        drawBorder: false
                                      },
                                      ticks: {
                                        color: 'white',
                                        font: {
                                          weight: 'bold'
                                        }
                                      }
                                    }
                                  },
                                  animation: {
                                    duration: 1500,
                                    easing: 'easeOutQuart'
                                  }
                                }}
                              />
                            </div>
                            <div className="d-flex justify-content-around mt-2">
                              {casePriorityLineData.labels.map((label, index) => (
                                <div key={index} className="text-center">
                                  <div className="text-white small">{label}</div>
                                  <div className="text-white fw-bold">
                                    {casePriorityLineData.datasets[0].data[index]}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Key Dates Line Chart */}
                      <div className="col-12 col-md-6">
                        <div className="card border-0 shadow-sm h-100" style={{
                          background: "linear-gradient(135deg, #b45309, #f59e0b)",
                          borderRadius: "12px"
                        }}>
                          <div className="card-header bg-transparent border-0 p-2 p-md-3">
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faLandmark} className="text-white" />
                              <h5 className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>Key Dates Timeline</h5>
                            </div>
                          </div>
                          <div className="card-body p-2 p-md-3">
                            <div style={{ height: "300px", minHeight: "300px" }}>
                              <Line
                                data={keyDatesLineData}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      position: 'top',
                                      labels: {
                                        color: 'white',
                                        boxWidth: 12,
                                        padding: 20
                                      }
                                    },
                                    tooltip: {
                                      callbacks: {
                                        label: function (context) {
                                          const label = context.dataset.label || '';
                                          const value = context.raw || 0;
                                          const dateStr = keyDates[context.dataIndex].toISOString().split('T')[0];

                                          // Get all cases for this date and type
                                          const casesForDate = caseDatesData.filter(c => {
                                            const dateField = {
                                              'Request Date': c.RequestDate,
                                              'E-Submit Date': c.ESubmitDate,
                                              'First Session': c.FirstSessionDate,
                                              'Next Session': c.NextSessionDate,
                                              'Last Session': c.LastSessionDate,
                                              'Verdict Date': c.VerdictDate
                                            }[label];

                                            return dateField && new Date(dateField).toISOString().split('T')[0] === dateStr;
                                          });

                                          const caseNumbers = casesForDate.map(c => c.CaseNumber || `Case ${c.FkCaseId || c._id}`).join(', ');

                                          return `${label}: ${value} case(s) - ${caseNumbers || 'No case numbers available'}`;
                                        }
                                      }
                                    }
                                  },
                                  scales: {
                                    y: {
                                      display: true,
                                      min: 0,
                                      ticks: {
                                        color: 'white',
                                        stepSize: 1,
                                        precision: 0
                                      },
                                      grid: {
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        drawBorder: false
                                      }
                                    },
                                    x: {
                                      grid: {
                                        color: 'rgba(255, 255, 255, 0.2)',
                                        drawBorder: false
                                      },
                                      ticks: {
                                        color: 'white',
                                        font: {
                                          weight: 'bold'
                                        }
                                      }
                                    }
                                  },
                                  animation: {
                                    duration: 1500,
                                    easing: 'easeOutQuart'
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lawyers/Ops Cases Line Chart - Simplified */}
                      <div className="col-12">
                        <div className="card border-0 shadow-sm h-100" style={{
                          background: "linear-gradient(135deg, #1e40af, #1e3a8a)",
                          borderRadius: "12px"
                        }}>
                          <div className="card-header bg-transparent border-0 p-2 p-md-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0 text-white" style={{ fontSize: "0.9rem" }}>
                                <FontAwesomeIcon icon={faUserTie} className="me-2" />
                                {filters.assignedUser === "all-lawyers" ? 'All Lawyers Cases' :
                                  filters.assignedUser === "all-ops" ? 'All Ops Cases' :
                                    filters.assignedUser ?
                                      `${casesData.assignedUsers.find(u => u.userId === filters.assignedUser)?.name || 'Selected User'} Cases` :
                                      filters.role === "Lawyer" ? 'All Lawyers Cases' :
                                        filters.role === "Ops" ? 'All Ops Cases' : 'All Users Cases'}
                              </h5>
                              {filters.assignedUser && (
                                <span className="badge bg-light text-dark">
                                  {casesData.assignedUsers.find(u => u.userId === filters.assignedUser)?.role || 'Role'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="card-body p-2 p-md-3">
                            {assignedUserLineData && (
                              <>
                                <div style={{ height: "300px", minHeight: "300px" }}>
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
                                            padding: 20
                                          }
                                        },
                                        tooltip: {
                                          callbacks: {
                                            label: function (context) {
                                              const label = context.dataset.label || '';
                                              const value = context.raw || 0;

                                              if (filters.assignedUser && !["all-lawyers", "all-ops"].includes(filters.assignedUser)) {
                                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                const percentage = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
                                                return `${label}: ${value} (${percentage}%)`;
                                              } else {
                                                return `${label}: ${value} cases`;
                                              }
                                            }
                                          }
                                        }
                                      },
                                      scales: {
                                        y: {
                                          display: true,
                                          min: 0,
                                          ticks: {
                                            color: 'white',
                                            stepSize: 1,
                                            precision: 0
                                          },
                                          grid: {
                                            color: 'rgba(255, 255, 255, 0.2)',
                                            drawBorder: false
                                          }
                                        },
                                        x: {
                                          grid: {
                                            color: 'rgba(255, 255, 255, 0.2)',
                                            drawBorder: false
                                          },
                                          ticks: {
                                            color: 'white',
                                            font: {
                                              weight: 'bold'
                                            }
                                          }
                                        }
                                      },
                                      animation: {
                                        duration: 1500,
                                        easing: 'easeOutQuart'
                                      }
                                    }}
                                  />
                                </div>
                                {/* Status labels for specific user */}
                                {filters.assignedUser && !["all-lawyers", "all-ops"].includes(filters.assignedUser) && (
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
                              </>
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
    </div>
  );
};

export default CaseSummary;