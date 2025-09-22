// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Container, Spinner, Alert, Row, Col, Card, Button, ButtonGroup } from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCalendarAlt,
//   faMoneyBillWave,
//   faFileAlt,
//   faBalanceScale,
//   faInfoCircle,
//   faChartBar,
//   faChartPie,
//   faChartLine,
//   faGavel,
//   faScaleBalanced,
//   faHourglassHalf,
//   faLandmark,
//   faBookOpen,
//   faFolderOpen,
//   faFolderClosed,
//   faCheckCircle,
//   faTimesCircle,
//   faThLarge,
//   faChartSimple
// } from "@fortawesome/free-solid-svg-icons";
// import { Bar, Pie, Line, Doughnut, Radar, PolarArea } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
//   RadialLinearScale,
//   Filler
// } from "chart.js";

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PointElement,
//   LineElement,
//   RadialLinearScale,
//   Filler
// );

// const CaseSummary = () => {
//   const hardcodedId = "682c5ecd89afffc1088312db";
//   const [caseData, setCaseData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'graphs'

//   useEffect(() => {
//     const fetchCaseSummary = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5001/api/casesummary/${hardcodedId}`
//         );
//         setCaseData(response.data);
//       } catch (err) {
//         setError("Unable to fetch case details. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCaseSummary();
//   }, [hardcodedId]);

//   const formatDate = (date) => {
//     return date ? new Date(date).toLocaleDateString() : null;
//   };

//   const formatCurrency = (amount) => {
//     return amount ? new Intl.NumberFormat("en-US", {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount) : "N/A";
//   };

//   // Dynamic case types for the chart
//   const allCaseTypes = ["Civil", "Commercial", "Criminal", "Family", "Military"];

//   // Case Status Data
//   const caseStatusData = {
//     labels: ["Open", "In Progress", "Closed"],
//     datasets: [
//       {
//         data: [
//           caseData?.Status === "Open" ? 1 : 0,
//           caseData?.Status === "In Progress" ? 1 : 0,
//           caseData?.Status === "Closed" ? 1 : 0,
//         ],
//         backgroundColor: [
//           "rgba(54, 162, 235, 0.8)",
//           "rgba(255, 206, 86, 0.8)",
//           "rgba(255, 99, 132, 0.8)",
//         ],
//         borderColor: [
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(255, 99, 132, 1)",
//         ],
//         borderWidth: 1,
//         cutout: '70%',
//         borderRadius: 10,
//         spacing: 5,
//       },
//     ],
//   };

//   // Calculate percentages for Cases Overview
//   const totalCases = caseData?.TotalCases || 1;
//   const openPercentage = Math.round((caseData?.OpenCases || 0) / totalCases * 1000) / 10;
//   const closedPercentage = Math.round((caseData?.ClosedCases || 0) / totalCases * 1000) / 10;
//   const activePercentage = Math.round((caseData?.ActiveCases || 0) / totalCases * 1000) / 10;
//   const inactivePercentage = Math.round((caseData?.InactiveCases || 0) / totalCases * 1000) / 10;

//   // Cases Overview Data
//   const casesOverviewData = {
//     labels: ["Open", "Closed", "Active", "Inactive"],
//     datasets: [
//       {
//         data: [
//           caseData?.OpenCases || 0,
//           caseData?.ClosedCases || 0,
//           caseData?.ActiveCases || 0,
//           caseData?.InactiveCases || 0,
//         ],
//         backgroundColor: [
//           "rgba(16, 185, 129, 0.8)",
//           "rgba(239, 68, 68, 0.8)",
//           "rgba(234, 179, 8, 0.8)",
//           "rgba(107, 114, 128, 0.8)",
//         ],
//         borderColor: [
//           "rgba(16, 185, 129, 1)",
//           "rgba(239, 68, 68, 1)",
//           "rgba(234, 179, 8, 1)",
//           "rgba(107, 114, 128, 1)",
//         ],
//         borderWidth: 1,
//         cutout: '70%',
//         borderRadius: 10,
//         spacing: 5,
//       },
//     ],
//   };

//   // Case Priority Data
//   const casePriorityData = {
//     labels: ["High", "Medium", "Low"],
//     datasets: [
//       {
//         data: [
//           caseData?.Priority === "High" ? 100 : 0,
//           caseData?.Priority === "Medium" ? 75 : 0,
//           caseData?.Priority === "Low" ? 50 : 0,
//         ],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.8)",
//           "rgba(54, 162, 235, 0.8)",
//           "rgba(255, 206, 86, 0.8)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Case Type Data
//   const caseTypeData = {
//     labels: allCaseTypes,
//     datasets: [
//       {
//         label: "Case Type",
//         data: allCaseTypes.map(type => caseData?.CaseType === type ? 100 : 0),
//         backgroundColor: "rgba(75, 192, 192, 0.4)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         pointBackgroundColor: "rgba(75, 192, 192, 1)",
//         pointBorderColor: "#fff",
//         pointHoverBackgroundColor: "#fff",
//         pointHoverBorderColor: "rgba(75, 192, 192, 1)",
//       },
//     ],
//   };

//   // Amount Data
//   const amountData = {
//     labels: ["Claimed Amount", "Case Balance"],
//     datasets: [
//       {
//         label: "Amount in USD",
//         data: [
//           caseData?.ClaimedAmount || 0,
//           caseData?.CaseBalance || 0,
//         ],
//         backgroundColor: [
//           "rgba(54, 162, 235, 0.8)",
//           "rgba(75, 192, 192, 0.8)",
//         ],
//         borderColor: [
//           "rgba(54, 162, 235, 1)",
//           "rgba(75, 192, 192, 1)",
//         ],
//         borderWidth: 1,
//         borderRadius: 5,
//       },
//     ],
//   };

//   // Key Dates Data for Line Chart
//   const keyDatesLineData = {
//     labels: ["Request", "E-Submit", "First Session", "Next Session", "Verdict"],
//     datasets: [
//       {
//         label: "Key Dates Timeline",
//         data: [
//           caseData?.RequestDate ? 1 : 0,
//           caseData?.ESubmitDate ? 2 : 0,
//           caseData?.FirstSessionDate ? 3 : 0,
//           caseData?.NextSessionDate ? 4 : 0,
//           caseData?.VerdictDate ? 5 : 0,
//         ],
//         borderColor: "rgba(255, 159, 64, 1)",
//         backgroundColor: "rgba(255, 159, 64, 0.2)",
//         borderWidth: 2,
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   // Case Status Line Data
//   const caseStatusLineData = {
//     labels: ["Open", "In Progress", "Closed"],
//     datasets: [
//       {
//         label: "Case Status",
//         data: [
//           caseData?.Status === "Open" ? 1 : 0,
//           caseData?.Status === "In Progress" ? 1 : 0,
//           caseData?.Status === "Closed" ? 1 : 0,
//         ],
//         borderColor: "rgba(54, 162, 235, 1)",
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderWidth: 2,
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   // Case Priority Line Data
//   const casePriorityLineData = {
//     labels: ["High", "Medium", "Low"],
//     datasets: [
//       {
//         label: "Case Priority",
//         data: [
//           caseData?.Priority === "High" ? 1 : 0,
//           caseData?.Priority === "Medium" ? 1 : 0,
//           caseData?.Priority === "Low" ? 1 : 0,
//         ],
//         borderColor: "rgba(255, 99, 132, 1)",
//         backgroundColor: "rgba(255, 99, 132, 0.2)",
//         borderWidth: 2,
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   // Cases Overview Line Data
//   const casesOverviewLineData = {
//     labels: ["Open", "Closed", "Active", "Inactive"],
//     datasets: [
//       {
//         label: "Cases Overview",
//         data: [
//           caseData?.OpenCases || 0,
//           caseData?.ClosedCases || 0,
//           caseData?.ActiveCases || 0,
//           caseData?.InactiveCases || 0,
//         ],
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderWidth: 2,
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   // Financial Overview Line Data
//   const financialOverviewLineData = {
//     labels: ["Claimed Amount", "Case Balance"],
//     datasets: [
//       {
//         label: "Amount in USD",
//         data: [
//           caseData?.ClaimedAmount || 0,
//           caseData?.CaseBalance || 0,
//         ],
//         borderColor: "rgba(153, 102, 255, 1)",
//         backgroundColor: "rgba(153, 102, 255, 0.2)",
//         borderWidth: 2,
//         tension: 0.4,
//         fill: true,
//       },
//     ],
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ 
//         height: "100vh", 
//         background: "linear-gradient(135deg, #0f172a, #1e293b)" 
//       }}>
//         <Spinner animation="border" variant="light" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Container className="mt-5" style={{ 
//         background: "linear-gradient(135deg, #0f172a, #1e293b)",
//         minHeight: "100vh",
//         color: "white"
//       }}>
//         <Alert variant="danger">{error}</Alert>
//       </Container>
//     );
//   }

//   if (!caseData) {
//     return (
//       <Container className="mt-5" style={{ 
//         background: "linear-gradient(135deg, #0f172a, #1e293b)",
//         minHeight: "100vh",
//         color: "white"
//       }}>
//         <Alert variant="warning">No case data available.</Alert>
//       </Container>
//     );
//   }

//   return (
//     <div className="container-fluid p-3 p-md-4" style={{ 
//       background: "linear-gradient(135deg, #0f172a, #1e293b)",
//       minHeight: "100vh",
//       color: "white"
//     }}>
//       {/* Header */}
//       <div className="row mb-3 mb-md-4">
//         <div className="col-12">
//           <div className="card border-0 shadow-lg" style={{ 
//             background: "linear-gradient(135deg, #1e40af, #1e3a8a)",
//             borderLeft: "5px solid #f59e0b"
//           }}>
//             <div className="card-body p-3 p-md-4">
//               <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
//                 <h2 className="mb-0 text-white d-flex align-items-center">
//                   <FontAwesomeIcon icon={faGavel} className="me-2 me-md-3" />
//                   <span style={{ fontWeight: 700 }}>Case Summary Dashboard</span>
//                 </h2>
//                 <div className="d-flex align-items-center mt-3 mt-md-0">
//                   <span className="badge bg-warning text-dark me-3">
//                     {caseData.CaseNumber || "N/A"}
//                   </span>
//                   <ButtonGroup>
//                     <Button 
//                       variant={viewMode === "cards" ? "warning" : "outline-warning"}
//                       onClick={() => setViewMode("cards")}
//                       size="sm"
//                     >
//                       <FontAwesomeIcon icon={faThLarge} className="me-1" />
//                       Cards
//                     </Button>
//                     <Button 
//                       variant={viewMode === "graphs" ? "warning" : "outline-warning"}
//                       onClick={() => setViewMode("graphs")}
//                       size="sm"
//                     >
//                       <FontAwesomeIcon icon={faChartSimple} className="me-1" />
//                       Graphs
//                     </Button>
//                   </ButtonGroup>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {viewMode === "cards" ? (
//         <>
//           {/* Overview Section - Cards View */}
//           <div className="row mb-3 mb-md-4">
//             <div className="col-12 col-md-3 mb-3 mb-md-0">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faChartPie} className="text-warning" />
//                     <h5 className="mb-0 text-white">Case Status</h5>
//                   </div>
//                 </div>
//                 <div className="card-body d-flex flex-column p-3">
//                   <div style={{ height: "200px", minHeight: "200px" }}>
//                     <Doughnut
//                       data={caseStatusData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             position: 'bottom',
//                             labels: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 return context.raw === 1 ? caseData.Status : '';
//                               }
//                             }
//                           }
//                         },
//                         cutout: '70%',
//                       }}
//                     />
//                   </div>
//                   <div className="mt-auto text-center">
//                     <h4 className="text-warning">{caseData.Status || "N/A"}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-md-3 mb-3 mb-md-0">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #4338ca, #4f46e5)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faHourglassHalf} className="text-warning" />
//                     <h5 className="mb-0 text-white">Case Priority</h5>
//                   </div>
//                 </div>

//                 <div className="card-body d-flex flex-column p-3">
//                   <div style={{ height: "200px", minHeight: "200px" }}>
//                     <PolarArea
//                       data={casePriorityData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             position: 'bottom',
//                             labels: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 return context.raw > 0 ? caseData.Priority : '';
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           r: {
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             angleLines: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             pointLabels: {
//                               color: 'white'
//                             },
//                             ticks: {
//                               display: false,
//                               backdropColor: 'transparent'
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                   <div className="mt-auto text-center">
//                     <h4 className="text-warning">{caseData.Priority || "N/A"}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-md-3 mb-3 mb-md-0">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faScaleBalanced} className="text-warning" />
//                     <h5 className="mb-0 text-white">Case Type</h5>
//                   </div>
//                 </div>

//                 <div className="card-body d-flex flex-column p-3">
//                   <div style={{ height: "200px", minHeight: "200px" }}>
//                     <Radar
//                       data={caseTypeData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             display: false
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 return context.raw > 0 ? caseData.CaseType : '';
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           r: {
//                             angleLines: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             pointLabels: {
//                               color: 'white'
//                             },
//                             ticks: {
//                               display: false,
//                               backdropColor: 'transparent'
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                   <div className="mt-auto text-center">
//                     <h4 className="text-warning">{caseData.CaseType || "N/A"}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-md-3">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #0e7490, #06b6d4)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faFolderOpen} className="text-warning" />
//                     <h5 className="mb-0 text-white">Cases Overview</h5>
//                   </div>
//                 </div>

//                 <div className="card-body d-flex flex-column p-3">
//                   <div style={{ 
//                     height: "200px", 
//                     minHeight: "200px", 
//                     position: 'relative',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center'
//                   }}>
//                     <div style={{ 
//                       width: '180px', 
//                       height: '180px',
//                       position: 'relative'
//                     }}>
//                       <div style={{
//                         position: 'absolute',
//                         top: '39%',
//                         left: '82%',
//                         transform: 'translateX(-50%)',
//                         textAlign: 'center',
//                         color: 'rgba(16, 185, 129, 1)',
//                         fontWeight: 'bold',
//                         fontSize: '11px',
//                         textShadow: '0 1px 3px rgba(0,0,0,0.5)',
//                         backgroundColor: 'rgba(0,0,0,0.3)',
//                         padding: '2px 8px',
//                         borderRadius: '12px'
//                       }}>
//                         {openPercentage}%
//                       </div>
//                       <div style={{
//                         position: 'absolute',
//                         right: '36%',
//                         top: '80%',
//                         transform: 'translateY(-50%)',
//                         color: 'rgba(239, 68, 68, 1)',
//                         fontWeight: 'bold',
//                         fontSize: '11px',
//                         textShadow: '0 1px 3px rgba(0,0,0,0.5)',
//                         backgroundColor: 'rgba(0,0,0,0.3)',
//                         padding: '2px 8px',
//                         borderRadius: '12px'
//                       }}>
//                         {closedPercentage}%
//                       </div>
//                       <div style={{
//                         position: 'absolute',
//                         bottom: '28%',
//                         left: '25%',
//                         transform: 'translateX(-50%)',
//                         textAlign: 'center',
//                         color: 'rgba(234, 179, 8, 1)',
//                         fontWeight: 'bold',
//                         fontSize: '11px',
//                         textShadow: '0 1px 3px rgba(0,0,0,0.5)',
//                         backgroundColor: 'rgba(0,0,0,0.3)',
//                         padding: '2px 8px',
//                         borderRadius: '12px'
//                       }}>
//                         {activePercentage}%
//                       </div>
//                       <div style={{
//                         position: 'absolute',
//                         left: '12%',
//                         top: '30%',
//                         transform: 'translateY(-50%)',
//                         color: 'rgba(107, 114, 128, 1)',
//                         fontWeight: 'bold',
//                         fontSize: '11px',
//                         textShadow: '0 1px 3px rgba(0,0,0,0.5)',
//                         backgroundColor: 'rgba(0,0,0,0.3)',
//                         padding: '2px 8px',
//                         borderRadius: '12px'
//                       }}>
//                         {inactivePercentage}%
//                       </div>

//                       <Doughnut
//                         data={casesOverviewData}
//                         options={{
//                           responsive: true,
//                           maintainAspectRatio: false,
//                           plugins: {
//                             legend: {
//                               display: false
//                             },
//                             tooltip: {
//                               callbacks: {
//                                 label: function(context) {
//                                   const label = context.label || '';
//                                   const value = context.raw || 0;
//                                   const percentage = Math.round((value / totalCases) * 1000) / 10;
//                                   return `${label}: ${percentage}%`;
//                                 }
//                               }
//                             }
//                           },
//                           cutout: '70%',
//                         }}
//                       />
                      
//                       <div style={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         textAlign: 'center',
//                         width: '100%'
//                       }}>
//                         <h4 className="text-white mb-0" style={{ fontSize: '20px' }}>{caseData.TotalCases || 0}</h4>
//                         <p className="text-light mb-0" style={{ fontSize: '10px' }}>Total Cases</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="d-flex flex-wrap justify-content-center mt-3" style={{ 
//                     gap: '0.75rem'
//                   }}>
//                     <div className="d-flex align-items-center">
//                       <div style={{
//                         width: '14px',
//                         height: '14px',
//                         backgroundColor: 'rgba(16, 185, 129, 0.8)',
//                         borderRadius: '3px',
//                         marginRight: '6px'
//                       }}></div>
//                       <span className="text-light" style={{ fontSize: '12px' }}>Open</span>
//                     </div>
//                     <div className="d-flex align-items-center">
//                       <div style={{
//                         width: '14px',
//                         height: '14px',
//                         backgroundColor: 'rgba(239, 68, 68, 0.8)',
//                         borderRadius: '3px',
//                         marginRight: '6px'
//                       }}></div>
//                       <span className="text-light" style={{ fontSize: '12px' }}>Closed</span>
//                     </div>
//                     <div className="d-flex align-items-center">
//                       <div style={{
//                         width: '14px',
//                         height: '14px',
//                         backgroundColor: 'rgba(234, 179, 8, 0.8)',
//                         borderRadius: '3px',
//                         marginRight: '6px'
//                       }}></div>
//                       <span className="text-light" style={{ fontSize: '12px' }}>Active</span>
//                     </div>
//                     <div className="d-flex align-items-center">
//                       <div style={{
//                         width: '14px',
//                         height: '14px',
//                         backgroundColor: 'rgba(107, 114, 128, 0.8)',
//                         borderRadius: '3px',
//                         marginRight: '6px'
//                       }}></div>
//                       <span className="text-light" style={{ fontSize: '12px' }}>Inactive</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Financials and Key Dates - Cards View */}
//           <div className="row mb-3 mb-md-4">
//             <div className="col-12 col-md-6 mb-3 mb-md-0">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #047857, #10b981)",
//                 borderRadius: "15px"
//               }}>
//                <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faMoneyBillWave} className="text-warning" />
//                     <h5 className="mb-0 text-white">Financial Overview</h5>
//                   </div>
//                 </div>

//                 <div className="card-body p-3">
//                   <div style={{ height: "200px", minHeight: "200px" }}>
//                     <Bar
//                       data={amountData}
//                       options={{
//                         indexAxis: 'y',
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             display: false
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 if (context.parsed.x > 0) {
//                                   return context.label === "Claimed Amount" 
//                                     ? formatCurrency(caseData.ClaimedAmount)
//                                     : formatCurrency(caseData.CaseBalance);
//                                 }
//                                 return '';
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           x: {
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             ticks: {
//                               color: 'white',
//                               callback: function(value) {
//                                 return value > 0 ? formatCurrency(value) : '';
//                               }
//                             }
//                           },
//                           y: {
//                             grid: {
//                               display: false
//                             },
//                             ticks: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                   <div className="row mt-3 text-center">
//                     <div className="col-6">
//                       <h6 className="text-light">Litigation Stage</h6>
//                       <p className="text-white fw-bold">{caseData.LitigationStage || "N/A"}</p>
//                     </div>
//                     <div className="col-6">
//                       <h6 className="text-light">Last Updated</h6>
//                       <p className="text-white fw-bold">{formatDate(new Date())}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-md-6">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #b45309, #f59e0b)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faLandmark} className="text-white" />
//                     <h5 className="mb-0 text-white">Key Dates</h5>
//                   </div>
//                 </div>

//                 <div className="card-body p-3">
//                   <div style={{ height: "200px", minHeight: "200px" }}>
//                     <Bar
//                       data={{
//                         labels: ["Request", "E-Submit", "First Session", "Next Session", "Verdict"],
//                         datasets: [{
//                           label: 'Key Dates',
//                           data: [
//                             caseData?.RequestDate ? 1 : 0,
//                             caseData?.ESubmitDate ? 1 : 0,
//                             caseData?.FirstSessionDate ? 1 : 0,
//                             caseData?.NextSessionDate ? 1 : 0,
//                             caseData?.VerdictDate ? 1 : 0,
//                           ],
//                           backgroundColor: [
//                             "rgba(255, 99, 132, 0.8)",
//                             "rgba(54, 162, 235, 0.8)",
//                             "rgba(255, 206, 86, 0.8)",
//                             "rgba(75, 192, 192, 0.8)",
//                             "rgba(153, 102, 255, 0.8)",
//                           ],
//                           borderColor: [
//                             "rgba(255, 99, 132, 1)",
//                             "rgba(54, 162, 235, 1)",
//                             "rgba(255, 206, 86, 1)",
//                             "rgba(75, 192, 192, 1)",
//                             "rgba(153, 102, 255, 1)",
//                           ],
//                           borderWidth: 1,
//                           borderRadius: 5
//                         }]
//                       }}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             display: false
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 const dates = {
//                                   0: caseData.RequestDate ? formatDate(caseData.RequestDate) : 'Not set',
//                                   1: caseData.ESubmitDate ? formatDate(caseData.ESubmitDate) : 'Not set',
//                                   2: caseData.FirstSessionDate ? formatDate(caseData.FirstSessionDate) : 'Not set',
//                                   3: caseData.NextSessionDate ? formatDate(caseData.NextSessionDate) : 'Not set',
//                                   4: caseData.VerdictDate ? formatDate(caseData.VerdictDate) : 'Not set'
//                                 };
//                                 return dates[context.dataIndex] || '';
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           y: {
//                             display: false,
//                             max: 1
//                           },
//                           x: {
//                             grid: {
//                               display: false
//                             },
//                             ticks: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                   <div className="row mt-3">
//                     <div className="col-6 text-center">
//                       <h6 className="text-light">Last Session</h6>
//                       <p className="text-white fw-bold">
//                         {caseData.LastSessionDate ? formatDate(caseData.LastSessionDate) : "N/A"}
//                       </p>
//                     </div>
//                     <div className="col-6 text-center">
//                       <h6 className="text-light">Days Active</h6>
//                       <p className="text-white fw-bold">
//                         {caseData.RequestDate 
//                           ? Math.floor((new Date() - new Date(caseData.RequestDate)) / (1000 * 60 * 60 * 24)) 
//                           : "N/A"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <>
//           {/* Graphs View */}
//           <div className="row mb-3 mb-md-4">
//             {/* Case Status Line Chart */}
//             <div className="col-12 col-md-6 mb-3 mb-md-0">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #1e3a8a, #1e40af)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faChartPie} className="text-warning" />
//                     <h5 className="mb-0 text-white">Case Status</h5>
//                   </div>
//                 </div>
//                 <div className="card-body p-3">
//                   <div style={{ height: "300px", minHeight: "300px" }}>
//                     <Line
//                       data={caseStatusLineData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             display: false
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 return context.raw === 1 ? caseData.Status : '';
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           y: {
//                             display: false,
//                             min: 0,
//                             max: 1.5
//                           },
//                           x: {
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             ticks: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Case Priority Line Chart */}
//             <div className="col-12 col-md-6 mb-3 mb-md-0">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #4338ca, #4f46e5)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faHourglassHalf} className="text-warning" />
//                     <h5 className="mb-0 text-white">Case Priority</h5>
//                   </div>
//                 </div>
//                 <div className="card-body p-3">
//                   <div style={{ height: "300px", minHeight: "300px" }}>
//                     <Line
//                       data={casePriorityLineData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             display: false
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 return context.raw === 1 ? caseData.Priority : '';
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           y: {
//                             display: false,
//                             min: 0,
//                             max: 1.5
//                           },
//                           x: {
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             ticks: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="row mb-3 mb-md-4">
//             {/* Cases Overview Line Chart */}
//             <div className="col-12 col-md-6 mb-3 mb-md-0">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #0e7490, #06b6d4)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faFolderOpen} className="text-warning" />
//                     <h5 className="mb-0 text-white">Cases Overview</h5>
//                   </div>
//                 </div>
//                 <div className="card-body p-3">
//                   <div style={{ height: "300px", minHeight: "300px" }}>
//                     <Line
//                       data={casesOverviewLineData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             display: false
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 const label = context.label || '';
//                                 const value = context.raw || 0;
//                                 const percentage = Math.round((value / totalCases) * 1000) / 10;
//                                 return `${label}: ${value} (${percentage}%)`;
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           y: {
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             ticks: {
//                               color: 'white'
//                             }
//                           },
//                           x: {
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             ticks: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Financial Overview Line Chart */}
//             <div className="col-12 col-md-6 mb-3 mb-md-0">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #047857, #10b981)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faMoneyBillWave} className="text-warning" />
//                     <h5 className="mb-0 text-white">Financial Overview</h5>
//                   </div>
//                 </div>
//                 <div className="card-body p-3">
//                   <div style={{ height: "300px", minHeight: "300px" }}>
//                     <Line
//                       data={financialOverviewLineData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             display: false
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 return formatCurrency(context.raw);
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           y: {
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             ticks: {
//                               color: 'white',
//                               callback: function(value) {
//                                 return formatCurrency(value);
//                               }
//                             }
//                           },
//                           x: {
//                             grid: {
//                               display: false
//                             },
//                             ticks: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="row">
//             {/* Key Dates Line Chart */}
//             <div className="col-12">
//               <div className="card border-0 shadow-lg h-100" style={{ 
//                 background: "linear-gradient(135deg, #b45309, #f59e0b)",
//                 borderRadius: "15px"
//               }}>
//                 <div className="card-header bg-transparent border-0 p-3">
//                   <div className="d-flex align-items-center gap-2">
//                     <FontAwesomeIcon icon={faLandmark} className="text-white" />
//                     <h5 className="mb-0 text-white">Key Dates Timeline</h5>
//                   </div>
//                 </div>
//                 <div className="card-body p-3">
//                   <div style={{ height: "300px", minHeight: "300px" }}>
//                     <Line
//                       data={keyDatesLineData}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         plugins: {
//                           legend: {
//                             display: false
//                           },
//                           tooltip: {
//                             callbacks: {
//                               label: function(context) {
//                                 const dates = {
//                                   0: caseData.RequestDate ? formatDate(caseData.RequestDate) : 'Not set',
//                                   1: caseData.ESubmitDate ? formatDate(caseData.ESubmitDate) : 'Not set',
//                                   2: caseData.FirstSessionDate ? formatDate(caseData.FirstSessionDate) : 'Not set',
//                                   3: caseData.NextSessionDate ? formatDate(caseData.NextSessionDate) : 'Not set',
//                                   4: caseData.VerdictDate ? formatDate(caseData.VerdictDate) : 'Not set'
//                                 };
//                                 return dates[context.dataIndex] || '';
//                               }
//                             }
//                           }
//                         },
//                         scales: {
//                           y: {
//                             display: false,
//                             min: 0,
//                             max: 6
//                           },
//                           x: {
//                             grid: {
//                               color: 'rgba(255, 255, 255, 0.2)'
//                             },
//                             ticks: {
//                               color: 'white',
//                               font: {
//                                 weight: 'bold'
//                               }
//                             }
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CaseSummary;