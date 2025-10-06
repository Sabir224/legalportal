
import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import axios from "axios";
import { Container, Spinner, Alert, Row, Col, Card, Form, Button, Dropdown, Modal } from "react-bootstrap";
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
  faUserTie,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
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
// Virtual scroll container for large datasets
// Add this optimized virtual scroll hook
const useIsInViewport = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};

// Then use it in your chart components
const LazyChart = ({ children, height = 250 }) => {
  const ref = useRef(null);
  const isInViewport = useIsInViewport(ref);
  
  return (
    <div ref={ref} style={{ height: `${height}px`, minHeight: `${height}px` }}>
      {isInViewport ? children : (
        <div className="d-flex align-items-center justify-content-center h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </div>
  );
};
// Lazy load chart components
const Bar = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar })));
const Line = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line })));

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
  danger: '#EF4444', // Red
  primaryLight: '#60A5FA', // Lighter blue
};

// Skeleton Loader Components
const ChartSkeleton = ({ height = 250, width = '100%' }) => (
  <div
    className="d-flex align-items-center justify-content-center skeleton-animation"
    style={{
      height: `${height}px`,
      width: width,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}
  >
    <div className="skeleton-shimmer"></div>
  </div>
);

const CardSkeleton = ({ delay = 0 }) => (
  <div
    className="card border-0 shadow-sm h-100"
    style={{
      background: "linear-gradient(135deg, #6b7280, #9ca3af)",
      borderRadius: "12px",
      opacity: 0.8
    }}
  >
    <div className="card-header bg-transparent border-0 p-3">
      <div className="placeholder-glow">
        <span className="placeholder col-6 bg-light opacity-25"></span>
      </div>
    </div>
    <div className="card-body p-3 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-white mt-3 mb-0">Loading Chart Data...</p>
      </div>
    </div>
  </div>
);

// Utility function to get all unique dates from cases
// Optimized utility function to get all unique dates from cases
// Highly optimized utility function to get all unique dates from cases
// Optimized utility function to get key dates with limits
// Optimized utility function to get key dates with 15-day default limit
const getAllKeyDates = (cases) => {
  if (!cases || cases.length === 0) return [];
  
  const dateSet = new Set();
  const maxDates = 15; // Default to 15 days
  
  // Process only first 500 cases maximum for performance
  const casesToProcess = cases.length > 500 ? cases.slice(0, 500) : cases;
  
  // Get all valid dates from cases
  const allDates = casesToProcess
    .map(caseItem => {
      const dates = [];
      if (caseItem.RequestDate) dates.push(new Date(caseItem.RequestDate));
      if (caseItem.ESubmitDate) dates.push(new Date(caseItem.ESubmitDate));
      if (caseItem.VerdictDate) dates.push(new Date(caseItem.VerdictDate));
      return dates;
    })
    .flat()
    .filter(date => !isNaN(date.getTime()))
    .sort((a, b) => b - a); // Sort descending (most recent first)

  // Add only the most recent 15 dates by default
  for (const date of allDates) {
    if (dateSet.size >= maxDates) break;
    const dateStr = date.toISOString().split('T')[0];
    dateSet.add(dateStr);
  }
  
  // Convert to array and sort chronologically
  const dates = Array.from(dateSet)
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => a - b);
  
  return dates;
};
// Custom Bar Chart Component for Status
const StatusBarChart = ({ data, totalCases }) => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
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
      {/* <div className="d-flex justify-content-around mt-2">
        {data.labels.map((label, index) => (
          <div key={index} className="text-center">
            <div className="text-white small">{label}</div>
            <div className="text-white fw-bold">{data.datasets[0].data[index]}</div>
          </div>
        ))}
      </div> */}
    </Suspense>
  );
};

// Custom Line Chart Component for Status
const StatusLineChart = ({ data, totalCases }) => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
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
    </Suspense>
  );
};
const ExportPDFModal = ({ show, progress = 0 }) => {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Body className="text-center p-4">
        <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }} />
        <h5>Generating PDF Report</h5>
        <p className="text-muted">Please wait, this may take a few moments...</p>
        <div className="progress mt-3" style={{ height: '8px' }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
          </div>
        </div>
        <small className="text-muted mt-2 d-block">{Math.round(progress)}% complete</small>
      </Modal.Body>
    </Modal>
  );
};

// Debounce hook for performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
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
  const [loadedCharts, setLoadedCharts] = useState({
    totalCases: false,
    caseStatus: false,
    financialOverview: false,
    casePriority: false,
    keyDates: false,
    assignedUser: false,
    successRate: false
  });
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [visibleDatasets, setVisibleDatasets] = useState({
    requestDate: true,
    eSubmitDate: true,
    verdictDate: true
  });
    const debouncedFilters = useDebounce(filters, 300);
    const [keyDatesFilter, setKeyDatesFilter] = useState({
  startDate: null,
  endDate: null
});
const [showKeyDatesFilter, setShowKeyDatesFilter] = useState(false);

  // Function to mark a chart as loaded
  const markChartLoaded = (chartName) => {
    setLoadedCharts(prev => ({ ...prev, [chartName]: true }));
  };

  // Load data with progressive rendering
  // Replace the current useEffect with this progressive loading approach
 // Replace the current useEffect with this progressive loading approach
useEffect(() => {
  let mounted = true;
  
  const fetchDataProgressively = async () => {
    try {
      setLoading(true);
      setError("");

      // Don't reset all charts at once - let them load independently
      // Only reset the ones that need fresh data

      // 1. Load basic summary data first (fastest)
      const summaryResponse = await axios.get(`${ApiEndPoint}casesummary`);
      if (mounted) {
        setCasesData(prev => ({ ...prev, ...summaryResponse.data }));
        markChartLoaded('totalCases');
      }

      // 2. Load other data independently without waiting for each other
      const loaders = [
       { key: 'successRate', url: `${ApiEndPoint}closed-groups`, delay: 300 },
        { key: 'keyDates', url: `${ApiEndPoint}case-dates` },
      ];

      // Start all API calls simultaneously but mark them loaded independently
      loaders.forEach(loader => {
        axios.get(loader.url)
          .then(response => {
            if (!mounted) return;
            
            if (loader.key === 'successRate') {
              setCasesData(prev => ({
                ...prev,
                backendClosedPositive: response.data.closedPositive,
                backendClosedNegative: response.data.closedNegative
              }));
            } else if (loader.key === 'keyDates') {
              setCaseDatesData(response.data.casesDates || []);
            }
            markChartLoaded(loader.key);
          })
          .catch(err => {
            console.error(`Error loading ${loader.key}:`, err);
            if (mounted) markChartLoaded(loader.key);
          });
      });

      // 3. Mark static charts as loaded immediately (they use filteredCases data)
      if (mounted) {
        markChartLoaded('caseStatus');
        markChartLoaded('financialOverview'); 
        markChartLoaded('casePriority');
        markChartLoaded('assignedUser');
        
        setLastUpdated(new Date().toLocaleString());
        
        // Set loading to false once initial data is loaded
        // Individual charts will show their own loading states
        setTimeout(() => {
          if (mounted) setLoading(false);
        }, 500);
      }

    } catch (err) {
      if (mounted) {
        setError("Unable to fetch case details. Please try again later.");
        setLoading(false);
      }
    }
  };

  fetchDataProgressively();

  return () => {
    mounted = false;
  };
}, []);

// Also update the handleRefresh function similarly:
const handleRefresh = async () => {
  setLoading(true);
  try {
    // Don't reset all charts - only reset the ones that need fresh API data
    setLoadedCharts(prev => ({
      ...prev,
      totalCases: false,
      successRate: false,
      keyDates: false
      // Keep other charts as they are since they use filtered data
    }));

    // Fetch case summary data first
    const summaryResponse = await axios.get(`${ApiEndPoint}casesummary`);
    setCasesData(prev => ({ ...prev, ...summaryResponse.data }));
    markChartLoaded('totalCases');

    // Fetch closed cases data
    axios.get(`${ApiEndPoint}closed-groups`)
      .then(closedResponse => {
        setCasesData(prev => ({
          ...prev,
          backendClosedPositive: closedResponse.data.closedPositive,
          backendClosedNegative: closedResponse.data.closedNegative
        }));
        markChartLoaded('successRate');
      })
      .catch(err => {
        console.error('Error loading success rate:', err);
        markChartLoaded('successRate');
      });

    // Fetch case dates
    axios.get(`${ApiEndPoint}case-dates`)
      .then(datesResponse => {
        setCaseDatesData(datesResponse.data.casesDates || []);
        markChartLoaded('keyDates');
      })
      .catch(err => {
        console.error('Error loading key dates:', err);
        markChartLoaded('keyDates');
      });

    setLastUpdated(new Date().toLocaleString());

    // Static charts can be marked as loaded immediately
    markChartLoaded('caseStatus');
    markChartLoaded('financialOverview');
    markChartLoaded('casePriority');
    markChartLoaded('assignedUser');

    // End loading after initial data is loaded
    setTimeout(() => {
      setLoading(false);
    }, 500);

  } catch (err) {
    setError("Unable to refresh data. Please try again later.");
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
    // Create CSV content directly without intermediate arrays
    let csvContent = 'Case Number,Status,Priority,Case Type,Request Date,E-Submit Date,First Session Date,Next Session Date,Verdict Date,Claimed Amount,Case Balance\n';

    // Append rows directly to CSV string
    filteredCases.forEach(caseItem => {
      csvContent += [
        `"${caseItem.CaseNumber || ''}"`,
        `"${caseItem.Status || ''}"`,
        `"${caseItem.Priority || ''}"`,
        `"${caseItem.CaseType || ''}"`,
        `"${caseItem.RequestDate ? formatDate(caseItem.RequestDate) : ''}"`,
        `"${caseItem.ESubmitDate ? formatDate(caseItem.ESubmitDate) : ''}"`,
        `"${caseItem.FirstSessionDate ? formatDate(caseItem.FirstSessionDate) : ''}"`,
        `"${caseItem.NextSessionDate ? formatDate(caseItem.NextSessionDate) : ''}"`,
        `"${caseItem.VerdictDate ? formatDate(caseItem.VerdictDate) : ''}"`,
        `"${caseItem.ClaimedAmount ? formatCurrency(caseItem.ClaimedAmount) : ''}"`,
        `"${caseItem.CaseBalance ? formatCurrency(caseItem.CaseBalance) : ''}"`
      ].join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `case_summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };

  const handleExportPDF = async () => {
    setExportingPDF(true);
    setExportProgress(0); // Start at 0%

    try {
      if (!dashboardRef.current) return;

      // Create PDF with higher quality settings
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Higher DPI settings
      const dpi = 300;
      const scaleFactor = dpi / 96; // 96 is default DPI

      // Update progress (10%)
      setExportProgress(10);

      // Load logo with higher resolution
      const logoUrl = `${window.location.origin}/logo.png`;
      const logoData = await fetch(logoUrl)
        .then(res => res.blob())
        .then(blob => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }));

      // Update progress (20%)
      setExportProgress(20);

      // ===== FRONT PAGE =====
      pdf.setFontSize(24);
      pdf.setTextColor(0, 31, 63);
      pdf.text('Case Summary Report', pageWidth / 2, 40, { align: 'center' });

      pdf.setFontSize(16);
      pdf.text('AWS Legal Group', pageWidth / 2, 55, { align: 'center' });

      const logoWidth = 38;
      const logoHeight = 40;
      pdf.addImage(logoData, 'PNG', (pageWidth - logoWidth) / 2, 70, logoWidth, logoHeight);

      // Update progress (30%)
      setExportProgress(30);

      // ===== DATE RANGE =====
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

      // ===== ROLE TEXT =====
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

      // Update progress (40%)
      setExportProgress(40);

      // ===== CONTENT PAGES =====
      if (viewMode === 'cards') {
        // Cards view export
        const cards = dashboardRef.current.querySelectorAll('.card');
        const totalCards = cards.length;
        let processedCards = 0;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          if (card.textContent.includes('Filters')) continue;

          const cardTitle = card.querySelector('.card-header h5')?.textContent || `Chart ${i + 1}`;

          pdf.addPage();

          // Page heading
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

          // Higher quality canvas rendering
          const canvas = await html2canvas(card, {
            scale: scaleFactor,
            logging: false,
            useCORS: true,
            backgroundColor: '#f0f2f5',
            allowTaint: true,
            letterRendering: true,
            quality: 1
          });

          const imgWidth = (pageWidth - 40) * 0.8;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Adjust for page height
          if (imgHeight > pageHeight - 40) {
            const scaleFactor = (pageHeight - 40) / imgHeight;
            imgHeight *= scaleFactor;
          }

          const yPos = (pageHeight - imgHeight) / 2;
          const xPos = (pageWidth - imgWidth) / 2;

          // Add image with smaller width and centered
          pdf.addImage(canvas, 'PNG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');

          // Update progress based on cards processed
          processedCards++;
          setExportProgress(40 + Math.round((processedCards / totalCards) * 50));
        }
      } else {
        // Graphs view export - FIXED: Capture each chart container with proper styling
        const chartContainers = dashboardRef.current.querySelectorAll('.card');
        const totalContainers = chartContainers.length;
        let processedContainers = 0;

        for (let i = 0; i < chartContainers.length; i++) {
          const card = chartContainers[i];
          if (card.textContent.includes('Filters')) continue;

          const cardTitle = card.querySelector('.card-header h5')?.textContent || `Chart ${i + 1}`;

          pdf.addPage();

          // Page heading
          if (i === 0) {
            pdf.setFontSize(18);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Case Analytics Charts`, 20, 15);
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

          // Capture the entire card (not just the body) to preserve background gradients
          const canvas = await html2canvas(card, {
            scale: scaleFactor,
            logging: false,
            useCORS: true,
            backgroundColor: null, // Set to null to preserve transparency
            allowTaint: true,
            letterRendering: true,
            quality: 1
          });

          const imgWidth = (pageWidth - 40) * 0.8;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (imgHeight > pageHeight - 40) {
            const scaleFactor = (pageHeight - 40) / imgHeight;
            imgHeight *= scaleFactor;
          }

          const yPos = (pageHeight - imgHeight) / 2;
          const xPos = (pageWidth - imgWidth) / 2;

          pdf.addImage(canvas, 'PNG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');

          // Update progress based on containers processed
          processedContainers++;
          setExportProgress(40 + Math.round((processedContainers / totalContainers) * 50));
        }
      }

      // Update progress (90%)
      setExportProgress(90);

      // ===== SAVE PDF =====
      pdf.save(`Case_Summary_Report_${new Date().toISOString().slice(0, 10)}.pdf`);

      // Update progress (100%)
      setExportProgress(100);

      // Wait a moment to show 100% before closing
      setTimeout(() => {
        setExportingPDF(false);
      }, 500);

    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF. Please try again.');
      setExportingPDF(false);
    }
  };
const KeyDatesFilterModal = ({ show, onHide, keyDatesFilter, setKeyDatesFilter }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header 
        closeButton 
        className="text-white" 
        style={{ 
          backgroundColor: '#001f3f', 
          borderBottom: '1px solid #001f3f' 
        }}
      >
        <Modal.Title>
          <FontAwesomeIcon icon={faFilter} className="me-2" />
          Key Dates Range Filter
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-3">
          <p className="text-muted mb-3">
            <small>This filter applies to Key Dates Timeline only</small>
          </p>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">Start Date</Form.Label>
                <DatePicker
                  selected={keyDatesFilter.startDate}
                  onChange={(date) => {
                    if (keyDatesFilter.endDate && date && new Date(date) > new Date(keyDatesFilter.endDate)) {
                      setKeyDatesFilter({ startDate: date, endDate: null });
                    } else {
                      setKeyDatesFilter({ ...keyDatesFilter, startDate: date });
                    }
                  }}
                  selectsStart
                  startDate={keyDatesFilter.startDate}
                  endDate={keyDatesFilter.endDate}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Start Date"
                  isClearable
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="small text-muted mb-1">End Date</Form.Label>
                <DatePicker
                  selected={keyDatesFilter.endDate}
                  onChange={(date) => {
                    const today = new Date();
                    const selectedDate = date ? new Date(date) : null;
                    const finalDate = selectedDate && selectedDate > today ? today : selectedDate;
                    setKeyDatesFilter({ ...keyDatesFilter, endDate: finalDate });
                  }}
                  selectsEnd
                  startDate={keyDatesFilter.startDate}
                  endDate={keyDatesFilter.endDate}
                  minDate={keyDatesFilter.startDate}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="End Date"
                  isClearable
                  disabled={!keyDatesFilter.startDate}
                />
              </Form.Group>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => setKeyDatesFilter({ startDate: null, endDate: null })}
           style={{ backgroundColor: '#001f3f', borderColor: '#001f3f' }}
        >
          Clear Filter
        </Button>
        <Button 
          variant="primary" 
          onClick={onHide}
          style={{ backgroundColor: '#001f3f', borderColor: '#001f3f' }}
        >
          Apply Filter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
  // Filter cases based on selected filters
// Optimized filtered cases computation with memoization
const filteredCases = React.useMemo(() => {
  if (!casesData.cases || casesData.cases.length === 0) return [];
  
  const startDateFilter = filters.startDate ? new Date(filters.startDate) : null;
  const endDateFilter = filters.endDate ? new Date(filters.endDate) : null;
  
  // Precompute user roles map for faster lookups
  const userRolesMap = {};
  casesData.assignedUsers.forEach(user => {
    userRolesMap[user.userId] = user.role;
  });
  
  return casesData.cases.filter(caseItem => {
    // Date filtering
    const caseDate = caseItem.CreatedAt ? new Date(caseItem.CreatedAt) : null;
    const dateInRange =
      (!startDateFilter || (caseDate && caseDate >= startDateFilter)) &&
      (!endDateFilter || (caseDate && caseDate <= endDateFilter));
    
    if (!dateInRange) return false;
    
    // Priority and subtype filtering (cheap checks first)
    if (filters.priority && caseItem.Priority !== filters.priority) return false;
    if (filters.caseSubType && caseItem.CaseSubType !== filters.caseSubType) return false;
    
    // Assigned user filtering (expensive check last)
    if (filters.assignedUser === "all-lawyers") {
      return caseItem.AssignedStaff.some(staff => {
        const role = userRolesMap[staff.userId];
        return role && role.toLowerCase().includes('lawyer');
      });
    } else if (filters.assignedUser === "all-ops") {
      return caseItem.AssignedStaff.some(staff => {
        const role = userRolesMap[staff.userId];
        return role && !role.toLowerCase().includes('lawyer');
      });
    } else if (filters.assignedUser) {
      return caseItem.AssignedStaff.some(staff => staff.userId === filters.assignedUser);
    } else if (filters.role === "Lawyer") {
      return caseItem.AssignedStaff.some(staff => {
        const role = userRolesMap[staff.userId];
        return role && role.toLowerCase().includes('lawyer');
      });
    } else if (filters.role === "Ops") {
      return caseItem.AssignedStaff.some(staff => {
        const role = userRolesMap[staff.userId];
        return role && !role.toLowerCase().includes('lawyer');
      });
    }
    
    return true;
  });
}, [casesData.cases, casesData.assignedUsers, filters]);

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
    closedNegative: caseStatusData.closedNegative,
     successRate: casesData.backendClosedPositive + casesData.backendClosedNegative > 0
      ? Math.round((casesData.backendClosedPositive / (casesData.backendClosedPositive + casesData.backendClosedNegative)) * 100)
      : 0
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
 // Get all key dates from filtered cases with date range filter
// Get all key dates from filtered cases with date range filter
const getAllFilteredKeyDates = (cases) => {
  // If date filter is applied, show all dates in the range
  if (keyDatesFilter.startDate || keyDatesFilter.endDate) {
    const allDates = caseDatesData.length > 0
      ? getAllKeyDatesWithoutLimit(caseDatesData)
      : getAllKeyDatesWithoutLimit(cases);
    
    // Apply date range filter
    return allDates.filter(date => {
      const shouldInclude = 
        (!keyDatesFilter.startDate || date >= new Date(keyDatesFilter.startDate)) &&
        (!keyDatesFilter.endDate || date <= new Date(keyDatesFilter.endDate));
      return shouldInclude;
    });
  }

  // Default behavior: show only last 15 days
  const allDates = caseDatesData.length > 0
    ? getAllKeyDates(caseDatesData)
    : getAllKeyDates(cases);

  return allDates;
};
const keyDates = getAllFilteredKeyDates(filteredCases);

// Helper function to get ALL dates without limit (for when filter is applied)
const getAllKeyDatesWithoutLimit = (cases) => {
  if (!cases || cases.length === 0) return [];
  
  const dateSet = new Set();
  
  // Process only first 500 cases maximum for performance
  const casesToProcess = cases.length > 500 ? cases.slice(0, 500) : cases;
  
  // Get all valid dates from cases without limit
  const allDates = casesToProcess
    .map(caseItem => {
      const dates = [];
      if (caseItem.RequestDate) dates.push(new Date(caseItem.RequestDate));
      if (caseItem.ESubmitDate) dates.push(new Date(caseItem.ESubmitDate));
      if (caseItem.VerdictDate) dates.push(new Date(caseItem.VerdictDate));
      return dates;
    })
    .flat()
    .filter(date => !isNaN(date.getTime()));

  // Add all unique dates
  for (const date of allDates) {
    const dateStr = date.toISOString().split('T')[0];
    dateSet.add(dateStr);
  }
  
  // Convert to array and sort chronologically
  const dates = Array.from(dateSet)
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => a - b);
  
  return dates;
};

  // Case Status Bar Chart Data
// Case Status Bar Chart Data - Memoized
const caseStatusBarData = React.useMemo(() => ({
  labels: ["Open", "Closed +ve", "Closed -ve"],
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
}), [caseStatusData.open, caseStatusData.closedPositive, caseStatusData.closedNegative]);

  // Case Status Line Chart Data
  const caseStatusLineData = React.useMemo(() => ({
    labels: ["Open", "Closed +ve", "Closed -ve"],
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
  }), [caseStatusData.open, caseStatusData.closedPositive, caseStatusData.closedNegative]);

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
     const successRateBarData = {
    labels: ["Success Rate"],
    datasets: [
      {
        label: "Success Rate %",
        data: [filteredCounts.successRate],
        backgroundColor: [COLORS.primaryLight], // Use lighter blue
        borderColor: [COLORS.primaryLight], // Use lighter blue
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
    const successRateLineData = {
    labels: ["Success Rate"],
    datasets: [
      {
        label: "Success Rate %",
        data: [filteredCounts.successRate],
        borderColor: COLORS.primaryLight, // Lighter blue
        backgroundColor: "rgba(96, 165, 250, 0.3)", // Even lighter blue with more transparency
        tension: 0.3,
        fill: true,
        pointBackgroundColor: COLORS.primaryLight, // Lighter blue
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.primaryLight // Lighter blue
      }
    ]
  };
  // Key Dates Line Chart Data - Fixed to properly count dates
  // Key Dates Line Chart Data - Fixed version
  // Simplified Key Dates Line Chart Data
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
        tension: 0.4,
        fill: false,
        pointBackgroundColor: COLORS.accent,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.accent,
        pointRadius: 3,
        pointHoverRadius: 6
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
        tension: 0.4,
        fill: false,
        pointBackgroundColor: COLORS.primary,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.primary,
        pointRadius: 3,
        pointHoverRadius: 6
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
        tension: 0.4,
        fill: false,
        pointBackgroundColor: COLORS.success,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: COLORS.success,
        pointRadius: 3,
        pointHoverRadius: 6
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
          label: "Closed Positive",
          data: lawyersData.map(l => l.closedPositive),
          backgroundColor: COLORS.success,
          borderColor: COLORS.success,
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: "Closed Negative",
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
          label: "Closed Positive",
          data: opsData.map(l => l.closedPositive),
          backgroundColor: COLORS.success,
          borderColor: COLORS.success,
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: "Closed Negative",
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
          label: "Closed Positive",
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
          label: "Closed Negative",
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
          label: "Closed Positive",
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
          label: "Closed Negative",
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
        labels: ["Open", "Closed Positive", "Closed Negative"],
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
      labels: ["Open", "Closed Positive", "Closed Negative"],
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
        labels: ["Open", "Closed Positive", "Closed Negative"],
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
      labels: ["Open", "Closed Positive", "Closed Negative"],
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



  //if (loading) {
    //return (
     // <div className="d-flex justify-content-center align-items-center" style={{
       // height: "100vh",
        //backgroundColor: "#f8f9fa"
      //}}>
        //<Spinner animation="border" variant="primary" />
      //</div>
    //);
  //}

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

  //if (!casesData || casesData.cases.length === 0) {
    //return (
      //<Container className="mt-5" style={{
        //backgroundColor: "#f8f9fa",
        //minHeight: "100vh",
      //}}>
        //<Alert variant="warning">No case data available.</Alert>
      //</Container>
    //);
  //}
  return (
    <div className="container-fluid p-0 mb-1 d-flex justify-content-center">
      <div
        className="card shadow p-2"
        style={{
          scrollbarColor: '#c0a262 #f1f1f1',
          paddingBottom: '30px',
          // padding: '10px 10px',
          height: '87vh',
          // overflowY: "auto",
          overflowY: 'auto',
          // msOverflowStyle: "none",
          scrollbarWidth: 'thin',
          maxWidth: '90vw',
          // minWidth:"50px",
          width: '90vw',
        }}
        ref={dashboardRef}
      >
        {/* <div className="container-fluid p-0" style={{
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          overflow: "hidden"
        }} ref={dashboardRef}> */}

          {/* Header Section */}
          <ExportPDFModal show={exportingPDF} progress={exportProgress} />
          <KeyDatesFilterModal 
  show={showKeyDatesFilter}
  onHide={() => setShowKeyDatesFilter(false)}
  keyDatesFilter={keyDatesFilter}
  setKeyDatesFilter={setKeyDatesFilter}
/>
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
                    <Dropdown.Item onClick={handleExportPDF} disabled={exportingPDF}>
                      <FontAwesomeIcon
                        icon={exportingPDF ? faSpinner : faFileImage}
                        className={exportingPDF ? "fa-spin me-2 text-primary" : "me-2 text-primary"}
                      />
                      {exportingPDF ? "Exporting..." : "Export as PDF"}
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
                {/* Key Dates Filter Section - Only show when Key Dates card is visible */}
{/* {(viewMode === "cards" && loadedCharts.keyDates) || (viewMode === "graphs") ? (
  <div className="px-3 px-md-4 py-2 mb-3" style={{
    backgroundColor: "#fff8e1",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    margin: "0 16px",
    border: "1px solid #ffd54f"
  }}>
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
      <div className="d-flex align-items-center mb-2 mb-md-0">
        <FontAwesomeIcon
          icon={faCalendar}
          className="text-warning me-2"
        />
        <h6 className="mb-0 text-dark">Key Dates Range Filter</h6>
        <small className="text-muted ms-2">(Applies to Key Dates Timeline only)</small>
      </div>
      <div className="d-flex flex-column flex-sm-row gap-2">
        <div style={{ flex: '1 1 120px' }}>
          <DatePicker
            selected={keyDatesFilter.startDate}
            onChange={(date) => {
              // If end date exists and is before the new start date, reset end date
              if (keyDatesFilter.endDate && date && new Date(date) > new Date(keyDatesFilter.endDate)) {
                setKeyDatesFilter({ startDate: date, endDate: null });
              } else {
                setKeyDatesFilter({ ...keyDatesFilter, startDate: date });
              }
            }}
            selectsStart
            startDate={keyDatesFilter.startDate}
            endDate={keyDatesFilter.endDate}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="form-control form-control-sm"
            placeholderText="Start Date"
            isClearable
          />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <DatePicker
            selected={keyDatesFilter.endDate}
            onChange={(date) => {
              const today = new Date();
              const selectedDate = date ? new Date(date) : null;
              const finalDate = selectedDate && selectedDate > today ? today : selectedDate;
              setKeyDatesFilter({ ...keyDatesFilter, endDate: finalDate });
            }}
            selectsEnd
            startDate={keyDatesFilter.startDate}
            endDate={keyDatesFilter.endDate}
            minDate={keyDatesFilter.startDate}
            maxDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="form-control form-control-sm"
            placeholderText="End Date"
            isClearable
            disabled={!keyDatesFilter.startDate}
          />
        </div>
        <Button
          variant="outline-warning"
          size="sm"
          onClick={() => setKeyDatesFilter({ startDate: null, endDate: null })}
          className="flex-grow-1 flex-md-grow-0"
        >
          Clear
        </Button>
      </div>
    </div>
  </div>
) : null} */}
                {/* Hide scrollbar for Chrome, Safari and Opera */}
                <style>
                  {`::-webkit-scrollbar {
                  display: none;
                }`}
                </style>


                {viewMode === "cards" ? (
                  <div className="row g-3">
                    {/* Total Cases Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                      {loadedCharts.totalCases ? (

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
                              <Suspense fallback={<ChartSkeleton height={120} />}>
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
                              </Suspense>
                            </div>
                            <div className="text-center mt-auto">
                              <h1 className="display-4 text-white mb-0">{filteredCounts.total}</h1>
                              <p className="text-white-50 mb-0">Filtered Cases</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <CardSkeleton />
                      )}
                    </div>

                    {/* Case Status Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                      {loadedCharts.caseStatus ? (
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
                      ) : (
                        <CardSkeleton />
                      )}
                    </div>

                    {/* Financial Overview Card */}
                    <div className="col-12 col-md-6 col-lg-4">
                      {loadedCharts.financialOverview ? (
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
                            <Suspense fallback={<ChartSkeleton height={250} />}>
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
                                      max: maxFinancialValue * 1.2,
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
                            </Suspense>
                              {/* <div className="d-flex justify-content-around mt-2">
                                {financialOverviewBarData.labels.map((label, index) => (
                                  <div key={index} className="text-center">
                                    <div className="text-white small">{label}</div>
                                    <div className="text-white fw-bold">
                                      {formatCurrency(financialOverviewBarData.datasets[0].data[index])}
                                    </div>
                                  </div>
                                ))}
                              </div> */}
                          </div>
                        </div>
                      ) : (
                        <CardSkeleton />
                      )}
                    </div>

                    {/* Case Priority Card */}
                    <div className="col-12">
                      {loadedCharts.casePriority ? (
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
                            <Suspense fallback={<ChartSkeleton height={250} />}>
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
                            </Suspense>
                            {/* <div className="d-flex justify-content-around mt-2">
                              {casePriorityBarData.labels.map((label, index) => (
                                <div key={index} className="text-center">
                                  <div className="text-white small">{label}</div>
                                  <div className="text-white fw-bold">
                                    {casePriorityBarData.datasets[0].data[index]}
                                  </div>
                                </div>
                              ))}
                            </div> */}
                          </div>
                        </div>
                      ) : (
                        <CardSkeleton />
                      )}
                    </div>

                    {/* Key Dates Card */}
                    {/* Key Dates Card */}
{/* <div className="col-12 col-md-6">
  {loadedCharts.keyDates ? (
    <div className="card border-0 shadow-sm h-100" style={{
      background: "linear-gradient(135deg, #b45309, #f59e0b)",
      borderRadius: "12px"
    }}>
      <div className="card-header bg-transparent border-0 p-3 d-flex justify-content-between align-items-center">
  <h5 className="mb-0 text-white">
    <FontAwesomeIcon icon={faLandmark} className="me-2" />
    Key Dates Timeline
    {keyDatesFilter.startDate || keyDatesFilter.endDate ? (
      <span className="badge bg-light text-warning ms-2">Filtered Range</span>
    ) : (
      <span className="badge bg-light text-info ms-2"></span>
    )}
  </h5>
  <div className="d-flex align-items-center gap-2">
    <Button
      variant="outline-light"
      size="sm"
      onClick={() => setShowKeyDatesFilter(true)}
      title="Filter Key Dates"
    >
      <FontAwesomeIcon icon={faFilter} />
    </Button>
  </div>
</div>
      <div className="card-body p-3" style={{ height: "300px" }}>
        {keyDates.length > 0 ? (
          <Suspense fallback={<ChartSkeleton height={300} />}>
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
          </Suspense>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="text-center">
              <FontAwesomeIcon icon={faCalendar} className="text-white-50 mb-2" size="2x" />
              <p className="text-white mb-0">No dates found in selected range</p>
              <small className="text-white-50">Try adjusting the date filter above</small>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <CardSkeleton />
  )}
</div> */}

                    {/* Lawyers/Ops Cases Card */}
                    <div className="col-12">
                      {loadedCharts.assignedUser ? (
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
                                <Suspense fallback={<ChartSkeleton height={300} />}>
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
                                </Suspense>
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
                      ) : (
                        <CardSkeleton />
                      )}
                    </div>

                    {/* Success Rate Card */}

                    <div className="col-12">
                      {loadedCharts.successRate ? (
                        <div className="card border-0 shadow-sm h-100" style={{
                          background: "linear-gradient(135deg, #059669, #10b981)",
                          borderRadius: "12px",
                          height: "400px"
                        }}>
                          <div className="card-header bg-transparent border-0 p-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-white">
                              <FontAwesomeIcon icon={faChartPie} className="me-2" />
                              Success Rate
                            </h5>
                            <span className="badge bg-light text-primary" style={{ color: '#60A5FA !important' }}>
                              {filteredCounts.successRate}% Success
                            </span>
                          </div>
                          <div className="card-body p-3">
                            <div className="row align-items-center">
                              {/* Chart Section */}
                              <div className="col-md-8">
                                <div style={{ height: "280px" }}>
                                  <Suspense fallback={<ChartSkeleton height={280} />}>
                                    <Bar
                                      data={successRateBarData}
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
                                                return `${context.raw}% success rate`;
                                              }
                                            }
                                          }
                                        },
                                        scales: {
                                          y: {
                                            display: true,
                                            min: 0,
                                            max: 100,
                                            ticks: {
                                              color: 'white',
                                              stepSize: 20,
                                              precision: 0,
                                              callback: function (value) {
                                                return value + '%';
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
                                                weight: 'bold',
                                                size: 12
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
                                  </Suspense>
                                </div>
                              </div>

                              {/* Stats Section */}
                              <div className="col-md-4">
                                <div className="text-center">
                                  <h1 className="display-4 text-white mb-3">{filteredCounts.successRate}%</h1>
                                  <div className="d-flex justify-content-around mb-3">
                                    <div className="text-center">
                                      <div className="text-white fw-bold fs-3">{casesData.backendClosedPositive || 0}</div>
                                      <div className="text-white-50 small">Won</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-white fw-bold fs-3">{casesData.backendClosedNegative || 0}</div>
                                      <div className="text-white-50 small">Lost</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-white fw-bold fs-3">{(casesData.backendClosedPositive || 0) + (casesData.backendClosedNegative || 0)}</div>
                                      <div className="text-white-50 small">Total</div>
                                    </div>
                                  </div>
                                  <div className="border-top border-white border-opacity-25 pt-2">
                                    <p className="text-white mb-0 small">
                                      {casesData.backendClosedPositive || 0} won / {(casesData.backendClosedPositive || 0) + (casesData.backendClosedNegative || 0)} closed cases
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Show loader while data is loading
                        <div className="card border-0 shadow-sm h-100" style={{
                          background: "linear-gradient(135deg, #059669, #10b981)",
                          borderRadius: "12px",
                          height: "400px"
                        }}>
                          <div className="card-body p-3 d-flex align-items-center justify-content-center">
                            <div className="text-center">
                              <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
                              <p className="text-white mt-3 mb-0">Loading Success Rate Data...</p>
                            </div>
                          </div>
                        </div>

                      )}
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
                      <div className="col-12">
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
                      {/* <div className="col-12 col-md-6">
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
                      </div> */}

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
                    {/* Success Rate Line Chart */}
                    <div className="col-12 mt-3">
                      <div className="card border-0 shadow-sm h-100" style={{
                        background: "linear-gradient(135deg, #059669, #10b981)",
                        borderRadius: "12px",
                        height: "400px"
                      }}>
                        <div className="card-header bg-transparent border-0 p-3 d-flex justify-content-between align-items-center">
                          <h5 className="mb-0 text-white">
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                            Success Rate
                          </h5>
                          <span className="badge bg-light text-primary" style={{ color: '#60A5FA !important' }}>
                            {filteredCounts.successRate}% Success
                          </span>
                        </div>
                        <div className="card-body p-3">
                          <div className="row align-items-center">
                            {/* Chart Section */}
                            <div className="col-md-8">
                              <div style={{ height: "280px" }}>
                                <Line
                                  data={successRateLineData}
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
                                            return `${context.raw}%`;
                                          }
                                        }
                                      }
                                    },
                                    scales: {
                                      y: {
                                        display: true,
                                        min: 0,
                                        max: 100,
                                        ticks: {
                                          color: 'white',
                                          callback: function (value) {
                                            return `${value}%`;
                                          },
                                          stepSize: 20
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
                                            weight: 'bold',
                                            size: 12
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

                            {/* Stats Section */}
                            <div className="col-md-4">
                              <div className="text-center">
                                <h1 className="display-4 text-white mb-3">{filteredCounts.successRate}%</h1>
                                <div className="d-flex justify-content-around mb-3">
                                  <div className="text-center">
                                    <div className="text-white fw-bold fs-3">{casesData.backendClosedPositive || 0}</div>
                                    <div className="text-white-50 small">Won</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-white fw-bold fs-3">{casesData.backendClosedNegative || 0}</div>
                                    <div className="text-white-50 small">Lost</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-white fw-bold fs-3">{(casesData.backendClosedPositive || 0) + (casesData.backendClosedNegative || 0)}</div>
                                    <div className="text-white-50 small">Total</div>
                                  </div>
                                </div>
                                <div className="border-top border-white border-opacity-25 pt-2">
                                  <p className="text-white mb-0 small">
                                    {casesData.backendClosedPositive || 0} won / {(casesData.backendClosedPositive || 0) + (casesData.backendClosedNegative || 0)} closed cases
                                  </p>
                                </div>
                              </div>
                            </div>
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
    // </div>
  );
};

export default CaseSummary;