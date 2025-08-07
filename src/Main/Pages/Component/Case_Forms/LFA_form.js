import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ApiEndPoint } from '../utils/utlis';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../AlertModels/ConfirmModal';
import { useAlert } from '../../../../Component/AlertContext';
//original
// const MOMEditor = () => {
//     const [headings, setHeadings] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [clientName, setClientName] = useState("");
//     const [lawyerName, setLawyerName] = useState("");
//     const [associateName, setAssociateName] = useState("");
//     const [caseType, setCaseType] = useState("");
//     const [caseId, setCaseId] = useState();
//     const [isLoading, setIsLoading] = useState(true);
//     const [hasData, setHasData] = useState(false);
//     const [editMode, setEditMode] = useState(false);
//     const [formId, setFormId] = useState(null)
//     const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);

//     const [showComfirmModel, setShowComfirmModel] = useState(false);
//     const [deleteItem, setDeleteItem] = useState(false);
//     const [deleteItemIndex, setDeleteItemIndex] = useState(null)
//     const { showLoading, showSuccess, showError } = useAlert();

//     // Function to handle confirmation
//     // const handleConfirm = () => {
//     //     console.log("User confirmed!");
//     //     setShowComfirmModel(false);
//     //     // Call your delete or confirm logic here
//     // };

//     // Function to handle cancel
//     const handleCancel = () => {
//         console.log("User cancelled.");
//         setShowComfirmModel(false);
//     };

//     useEffect(() => {
//         const fetchForm = async () => {
//             try {
//                 const response = await axios.get(`${ApiEndPoint}getFormMOMByCaseId/${caseId}`);
//                 if (response.data && response.data.length > 0 && response.data[0].headings) {
//                     const formData = response.data[0];
//                     setHeadings(formData.headings);
//                     setClientName(formData.clientName || "");
//                     setLawyerName(formData.lawyerName || "");
//                     setAssociateName(formData.associateName || "");
//                     setCaseType(formData.caseType || "");
//                     setFormId(formData?._id)
//                     if (formData.date) {
//                         setSelectedDate(new Date(formData.date));
//                     }
//                     setHasData(true);
//                 } else {
//                     setHasData(false);
//                 }
//             } catch (err) {
//                 console.error("Failed to fetch form", err);
//                 setHasData(false);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         setCaseId(reduxCaseInfo?._id)
//         if (caseId) {
//             fetchForm();
//         }
//     }, [caseId]);

//     const addHeading = () => {
//         setHeadings([...headings, { title: "", points: [{ text: "", subpoints: [] }] }]);
//     };

//     const updateHeadingTitle = (index, value) => {
//         const updated = [...headings];
//         updated[index].title = value;
//         setHeadings(updated);
//     };

//     const addPoint = (hIndex) => {
//         const updated = [...headings];
//         updated[hIndex].points.push({ text: "", subpoints: [] });
//         setHeadings(updated);
//     };

//     const updatePoint = (hIndex, pIndex, value) => {
//         const updated = [...headings];
//         updated[hIndex].points[pIndex].text = value;
//         setHeadings(updated);
//     };

//     const addSubpoint = (hIndex, pIndex) => {
//         const updated = [...headings];
//         updated[hIndex].points[pIndex].subpoints.push({ text: "", subsubpoints: [] });
//         setHeadings(updated);
//     };

//     const updateSubpoint = (hIndex, pIndex, sIndex, value) => {
//         const updated = [...headings];
//         updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
//         setHeadings(updated);
//     };

//     const addSubSubpoint = (hIndex, pIndex, sIndex) => {
//         const updated = [...headings];
//         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.push({ text: "" });
//         setHeadings(updated);
//     };

//     const updateSubSubpoint = (hIndex, pIndex, sIndex, ssIndex, value) => {
//         const updated = [...headings];
//         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
//         setHeadings(updated);
//     };

//     const removeHeading = async () => {
//         console.log(deleteItem?._id)
//         let itemId = deleteItem?._id
//         try {
//             showLoading()
//             const response = await axios.delete(`${ApiEndPoint}deleteFormMOMHeadings/${caseId}/${itemId}`);
//             console.log('Heading deleted:', response.data.message);
//             const updated = [...headings];
//             updated.splice(deleteItemIndex, 1);
//             setHeadings(updated);
//             showSuccess("Heading Deleted Successfully")
//             setShowComfirmModel(false)
//             // Optionally update state or refresh form data
//         } catch (error) {
//             if (!editMode) {
//                 const updated = [...headings];
//                 updated.splice(deleteItemIndex, 1);
//                 setHeadings(updated);
//                 setShowComfirmModel(false)

//             }
//             showError('Error deleting heading:', error.message);
//         }

//     };

//     const removePoint = (hIndex, pIndex) => {
//         const updated = [...headings];
//         updated[hIndex].points.splice(pIndex, 1);
//         setHeadings(updated);
//     };

//     const removeSubpoint = (hIndex, pIndex, sIndex) => {
//         const updated = [...headings];
//         updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
//         setHeadings(updated);
//     };

//     const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
//         const updated = [...headings];
//         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
//         setHeadings(updated);
//     };

//     const handleSubmit = async () => {

//         const formData = {
//             caseId,
//             clientName,
//             lawyerName,
//             associateName,
//             date: selectedDate,
//             caseType,
//             headings,
//         };
//         showLoading()
//         try {
//             const res = await axios.post(editMode ? `${ApiEndPoint}UpdateFormMOM/${formId}` : `${ApiEndPoint}createFormMOM`, formData);
//             showSuccess(`Form ${editMode ? "updated" : "add"} successfully!`);
//             console.log("Submitted:", res.data);
//             setHasData(true);
//             setEditMode(false);
//         } catch (err) {
//             console.error("Error submitting form:", err);
//             showError("Error submitting form.");
//         }
//     };

//     const handleEdit = () => {
//         setEditMode(true);
//     };

//     if (isLoading) {
//         return <div className="text-center mt-5">Loading...</div>;
//     }

//     return (

//         <div className="card" style={{ maxHeight: "87vh", overflowY: "auto", minWidth: "100%" }}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//                 <div className="container mt-2 mt-md-4">
//                     <div className="d-flex align-items-center mb-3 mb-md-4">
//                         <img src="logo.png" alt="Logo" className="me-2 me-md-3" style={{ height: '40px', height: '50px' }} />
//                         <h1 className="mb-0 h4 h3-md">Form L / MOM</h1>
//                     </div>

//                     <div className="card p-2 p-md-4 shadow-sm">
//                         <div className="row g-2 g-md-3">
//                             <div className="col-12 col-md-6">
//                                 <label className="form-label fw-bold">Client</label>
//                                 {editMode || !hasData ? (
//                                     <input type="text" className="form-control form-control-sm" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
//                                 ) : (
//                                     <div className="form-control-plaintext">{clientName}</div>
//                                 )}
//                             </div>
//                             <div className="col-12 col-md-6">
//                                 <label className="form-label fw-bold">Lawyer</label>
//                                 {editMode || !hasData ? (
//                                     <input type="text" className="form-control form-control-sm" placeholder="Lawyer Name" value={lawyerName} onChange={(e) => setLawyerName(e.target.value)} />
//                                 ) : (
//                                     <div className="form-control-plaintext">{lawyerName}</div>
//                                 )}
//                             </div>
//                             <div className="col-12 col-md-6">
//                                 <label className="form-label fw-bold">Associate</label>
//                                 {editMode || !hasData ? (
//                                     <input type="text" className="form-control form-control-sm" placeholder="Associate Name" value={associateName} onChange={(e) => setAssociateName(e.target.value)} />
//                                 ) : (
//                                     <div className="form-control-plaintext">{associateName}</div>
//                                 )}
//                             </div>
//                             <div className="col-12 col-sm-12 col-md-6 col-lg-6">
//                                 <label className="form-label fw-bold">Date</label>
//                                 {editMode || !hasData ? (
//                                     <DatePicker
//                                         value={selectedDate}
//                                         onChange={(date) => setSelectedDate(date)}
//                                         format="dd/MM/yyyy"
//                                         slotProps={{
//                                             textField: {
//                                                 size: "small",
//                                                 fullWidth: true,
//                                                 sx: {
//                                                     width: '100%',
//                                                     minWidth: 0,
//                                                     '& input': {
//                                                         fontSize: '0.75rem',
//                                                         padding: '6px 8px',
//                                                     },
//                                                     '& .MuiInputBase-root': {
//                                                         width: '100%',
//                                                     }
//                                                 },
//                                             },
//                                         }}
//                                     />
//                                 ) : (
//                                     <div className="form-control-plaintext">
//                                         {selectedDate?.toLocaleDateString('en-GB')}
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="col-12">
//                                 <label className="form-label fw-bold">Case Type</label>
//                                 {editMode || !hasData ? (
//                                     <input type="text" className="form-control form-control-sm " placeholder="Family / Civil / ..." value={caseType} onChange={(e) => setCaseType(e.target.value)} />
//                                 ) : (
//                                     <div className="form-control-plaintext">{caseType}</div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {hasData && !editMode && (
//                         <button className="btn btn-sm mt-3" style={{ backgroundColor: '#18273e', color: 'white' }} onClick={handleEdit}>
//                             Edit Form
//                         </button>
//                     )}

//                     {(editMode || !hasData) && (
//                         <button className="btn btn-sm mt-3" style={{ backgroundColor: '#18273e', color: 'white' }} onClick={addHeading}>
//                             Add Heading
//                         </button>
//                     )}

//                     {headings.map((heading, hIndex) => (
//                         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
//                             {editMode || !hasData ? (
//                                 <div className="d-flex align-items-center mb-2">
//                                     <span className="me-2">➤</span>
//                                     <textarea
//                                         className="form-control form-control-sm me-2"
//                                         placeholder="Enter heading"
//                                         value={heading.title}
//                                         onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
//                                         rows={1}
//                                         style={{
//                                             overflow: 'hidden',
//                                             resize: 'none',
//                                             minHeight: '38px',
//                                         }}
//                                         onInput={(e) => {
//                                             e.target.style.height = 'auto';
//                                             e.target.style.height = e.target.scrollHeight + 'px';
//                                         }}
//                                         onKeyDown={(e) => {
//                                             // Block Enter key to prevent new line
//                                             if (e.key === 'Enter') {
//                                                 e.preventDefault();
//                                             }

//                                             // Allow Tab for tab character
//                                             if (e.key === 'Tab') {
//                                                 e.preventDefault();
//                                                 const start = e.target.selectionStart;
//                                                 const end = e.target.selectionEnd;
//                                                 const value = e.target.value;
//                                                 const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
//                                                 updateHeadingTitle(hIndex, updatedValue);
//                                                 setTimeout(() => {
//                                                     e.target.selectionStart = e.target.selectionEnd = start + 1;
//                                                 }, 0);
//                                             }
//                                         }}
//                                     />

//                                     <button
//                                         onClick={() => {
//                                             setDeleteItem(heading)
//                                             setDeleteItemIndex(hIndex)
//                                             setShowComfirmModel(true)
//                                         }
//                                         }
//                                         className="btn btn-danger btn-sm"
//                                     >
//                                         🗑️
//                                     </button>
//                                 </div>
//                             ) : (
//                                 <h4 className="h5 mb-2 mb-md-3" style={{ whiteSpace: 'pre-wrap' }}>
//                                     <span className="me-2">➤</span> {heading.title}
//                                 </h4>
//                             )}

//                             <ul className="list-unstyled ps-2 ps-md-3">
//                                 {heading.points.map((point, pIndex) => (
//                                     <li key={pIndex}>
//                                         {editMode || !hasData ? (
//                                             <div className="d-flex align-items-center mb-2">
//                                                 <textarea
//                                                     className="form-control form-control-sm me-2"
//                                                     placeholder="Point"
//                                                     value={point.text}
//                                                     onChange={(e) => updatePoint(hIndex, pIndex, e.target.value)}
//                                                     rows={1}
//                                                     style={{
//                                                         overflow: 'hidden',         // ⛔ disables scrollbars
//                                                         resize: 'none',             // ⛔ disables manual resizing
//                                                         minHeight: '38px',          // ✅ base height (same as Bootstrap form-control-sm)
//                                                     }}
//                                                     onInput={(e) => {
//                                                         e.target.style.height = 'auto'; // reset height
//                                                         e.target.style.height = e.target.scrollHeight + 'px'; // set height to scroll height
//                                                     }}
//                                                     onKeyDown={(e) => {
//                                                         if (e.key === 'Tab') {
//                                                             e.preventDefault();
//                                                             const start = e.target.selectionStart;
//                                                             const end = e.target.selectionEnd;
//                                                             const value = e.target.value;
//                                                             const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
//                                                             updatePoint(hIndex, pIndex, updatedValue);
//                                                             setTimeout(() => {
//                                                                 e.target.selectionStart = e.target.selectionEnd = start + 1;
//                                                             }, 0);
//                                                         }
//                                                     }}
//                                                 />
//                                             </div>

//                                         ) : (
//                                             <p className="mb-1 mb-md-2 small" style={{ whiteSpace: 'pre-wrap' }}>
//                                                 {point.text}
//                                             </p>
//                                         )}

//                                         <ol type="i" className="ps-3 ps-md-4 small">
//                                             {point.subpoints.map((sub, sIndex) => (
//                                                 <li key={sIndex}>
//                                                     {editMode || !hasData ? (
//                                                         <div className="d-flex align-items-center mb-2">
//                                                             <textarea
//                                                                 className="form-control form-control-sm me-2"
//                                                                 placeholder="Subpoint"
//                                                                 value={sub.text}
//                                                                 onChange={(e) =>
//                                                                     updateSubpoint(hIndex, pIndex, sIndex, e.target.value)
//                                                                 }
//                                                                 rows={1}
//                                                                 onInput={(e) => {
//                                                                     e.target.style.height = 'auto';
//                                                                     e.target.style.height = e.target.scrollHeight + 'px';
//                                                                 }}
//                                                                 onKeyDown={(e) => {
//                                                                     if (e.key === 'Tab') {
//                                                                         e.preventDefault();
//                                                                         const start = e.target.selectionStart;
//                                                                         const end = e.target.selectionEnd;
//                                                                         const value = e.target.value;
//                                                                         const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
//                                                                         updateSubpoint(hIndex, pIndex, sIndex, updatedValue);
//                                                                         setTimeout(() => {
//                                                                             e.target.selectionStart = e.target.selectionEnd = start + 1;
//                                                                         }, 0);
//                                                                     }
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                     ) : (
//                                                         <p className="mb-1 mb-md-2 small" style={{ whiteSpace: 'pre-wrap' }}>{sub.text}</p>
//                                                     )}

//                                                     <ul className="ps-3 ps-md-4 small">
//                                                         {sub.subsubpoints.map((ss, ssIndex) => (
//                                                             <li key={ssIndex}>
//                                                                 {editMode || !hasData ? (
//                                                                     <div className="d-flex align-items-center mb-2">
//                                                                         <textarea
//                                                                             className="form-control form-control-sm me-2"
//                                                                             placeholder="Sub-subpoint"
//                                                                             value={ss.text}
//                                                                             onChange={(e) =>
//                                                                                 updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, e.target.value)
//                                                                             }
//                                                                             rows={1}
//                                                                             onInput={(e) => {
//                                                                                 e.target.style.height = 'auto';
//                                                                                 e.target.style.height = e.target.scrollHeight + 'px';
//                                                                             }}
//                                                                             onKeyDown={(e) => {
//                                                                                 if (e.key === 'Tab') {
//                                                                                     e.preventDefault();
//                                                                                     const start = e.target.selectionStart;
//                                                                                     const end = e.target.selectionEnd;
//                                                                                     const value = e.target.value;
//                                                                                     const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
//                                                                                     updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, updatedValue);
//                                                                                     setTimeout(() => {
//                                                                                         e.target.selectionStart = e.target.selectionEnd = start + 1;
//                                                                                     }, 0);
//                                                                                 }
//                                                                             }}
//                                                                         />
//                                                                     </div>
//                                                                 ) : (
//                                                                     <p className="mb-1 mb-md-2 small" style={{ whiteSpace: 'pre-wrap' }}>{ss.text}</p>
//                                                                 )}
//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 </li>
//                                             ))}
//                                         </ol>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     ))}

//                     {(editMode || !hasData) && (
//                         <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 mb-md-5">
//                             <button className="btn btn-sm btn-success" onClick={handleSubmit}>
//                                 {hasData ? "Update Form" : "Submit Form"}
//                             </button>
//                             {editMode && (
//                                 <button className="btn btn-sm btn-secondary" onClick={() => setEditMode(!editMode)}>
//                                     Cancel
//                                 </button>
//                             )}
//                         </div>
//                     )}

//                     <ConfirmModal
//                         show={showComfirmModel}
//                         title="Delete Heading"
//                         message="Are you sure you want to delete this heading?"
//                         onConfirm={removeHeading}
//                         onCancel={handleCancel}
//                     />
//                 </div>
//             </LocalizationProvider>
//         </div>

//     );
// };


//draft agreement
// const MOMEditor = () => {
//   // State for the agreement template
//   const [agreement, setAgreement] = useState({
//     fixedParts: [
//       'This Agreement ("Agreement") is entered into and shall become effective as of ',
//       ', by and between:\n\n**',
//       '**, with its principal place of business located at ',
//       ', represented herein by **',
//       '**, duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n**',
//       '** a national of ',
//       ', with their principal place of residence located ',
//       ', holding Emirates ID Number: ',
//       ' issued on: ',
//       ', having email ID: ',
//       ' and Contact Number: ',
//       ' (Hereinafter referred to as the "Client")'
//     ],
//     editableValues: [
//       '7/7/2025',
//       'M/s AWS Legal Consultancy FZ-LLC',
//       '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
//       'Mr Aws M. Younis, Chairman',
//       'Dr. Ali Moustafa Mohamed Elba',
//       'Egypt',
//       'Dubai, United Arab Emirates',
//       '784-1952-3620694-4',
//       '16/03/2023',
//       'alyelba@yahoo.com',
//       '+971521356931'
//     ]
//   });

//   // State for headings structure
//   const [headings, setHeadings] = useState([
//     {
//       title: '',
//       points: [{ text: '', subpoints: [] }],
//     },
//   ]);

//   // Edit mode state
//   const [editMode, setEditMode] = useState(true);

//   // Handler for editable fields
//   const handleEditableChange = (index, newValue) => {
//     const updated = [...agreement.editableValues];
//     updated[index] = newValue;
//     setAgreement({...agreement, editableValues: updated});
//   };

//   // Heading management functions
//   const addHeading = () => {
//     setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);
//   };

//   const updateHeadingTitle = (index, value) => {
//     const updated = [...headings];
//     updated[index].title = value;
//     setHeadings(updated);
//   };

//   // Point management functions
//   const addPoint = (hIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points.push({ text: '', subpoints: [] });
//     setHeadings(updated);
//   };

//   const updatePoint = (hIndex, pIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].text = value;
//     setHeadings(updated);
//   };

//   // Subpoint management functions
//   const addSubpoint = (hIndex, pIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints.push({ text: '', subsubpoints: [] });
//     setHeadings(updated);
//   };

//   const updateSubpoint = (hIndex, pIndex, sIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
//     setHeadings(updated);
//   };

//   // Sub-subpoint management functions
//   const addSubSubpoint = (hIndex, pIndex, sIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.push({ text: '' });
//     setHeadings(updated);
//   };

//   const updateSubSubpoint = (hIndex, pIndex, sIndex, ssIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
//     setHeadings(updated);
//   };

//   // Removal functions
//   const removeHeading = (hIndex) => {
//     const updated = [...headings];
//     updated.splice(hIndex, 1);
//     setHeadings(updated);
//   };

//   const removePoint = (hIndex, pIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points.splice(pIndex, 1);
//     setHeadings(updated);
//   };

//   const removeSubpoint = (hIndex, pIndex, sIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
//     setHeadings(updated);
//   };

//   const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
//     setHeadings(updated);
//   };

//   // Form submission handler
//   const handleSubmit = () => {
//     setEditMode(false);
//   };

//   return (
//     <div className="card w-100" style={{ maxHeight: '87vh', overflowY: 'auto' }}>
//       <div className="container mt-2 mt-md-4">
//         {/* Main Header */}
//         <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
//           <img 
//             src="logo.png" 
//             alt="Logo" 
//             className="me-2 me-md-3 mb-2 mb-md-0" 
//             style={{ 
//               height: '50px',
//               maxWidth: '100%'
//             }} 
//           />
//           <h1 className="mb-0 h4 h3-md fw-bold text-break" style={{ wordBreak: 'break-word' }}>
//             Legal Fee Agreement
//           </h1>
//         </div>

//         {/* Agreement Text Section - Responsive */}
//         <div className="card p-2 p-md-4 shadow-sm mb-4">
//           <label className="form-label fw-bold fs-5 text-break">Agreement</label>

//           {editMode ? (
//             <div className="form-control p-3" style={{ 
//               minHeight: '300px', 
//               whiteSpace: 'pre-wrap',
//               overflowX: 'hidden'
//             }}>
//               {agreement.fixedParts.map((part, index) => (
//                 <React.Fragment key={`part-${index}`}>
//                   <span style={{ wordBreak: 'break-word' }}>{part}</span>
//                   {index < agreement.editableValues.length && (
//                     <input
//                       type="text"
//                       className="border-bottom mx-1 px-1"
//                       value={agreement.editableValues[index]}
//                       onChange={(e) => handleEditableChange(index, e.target.value)}
//                       style={{
//                         border: 'none',
//                         borderBottom: '1px solid #000',
//                         background: 'transparent',
//                         padding: '2px 5px',
//                         margin: '0 3px',
//                         minWidth: '100px',
//                         width: 'auto',
//                         maxWidth: '100%',
//                         wordBreak: 'break-word',
//                         display: 'inline-block'
//                       }}
//                     />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           ) : (
//             <div className="form-control bg-white p-3" style={{ 
//               whiteSpace: 'pre-wrap',
//               minHeight: '300px',
//               overflowY: 'auto',
//               wordBreak: 'break-word'
//             }}>
//               {agreement.fixedParts.map((part, index) => (
//                 <React.Fragment key={`display-${index}`}>
//                   <span style={{ wordBreak: 'break-word' }}>{part}</span>
//                   {index < agreement.editableValues.length && (
//                     <span style={{ wordBreak: 'break-word' }}>{agreement.editableValues[index]}</span>
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Headings Section - Now shows in both edit and preview modes */}
//         {headings.map((heading, hIndex) => (
//           <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">

//             {editMode ? (
//               <div className="d-flex flex-wrap align-items-center mb-2">
//                 <span className="me-2 fw-bold">➤</span>
//                 <textarea
//                   className="form-control form-control-sm me-2 text-break fw-bold"
//                   placeholder="Enter heading"
//                   value={heading.title}
//                   onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
//                   style={{
//                     overflowY: 'auto',
//                     resize: 'none',
//                     minHeight: '80px',
//                     maxHeight: '200px',
//                     flex: '1 1 100%',
//                     wordWrap: 'break-word',
//                     wordBreak: 'break-word'
//                   }}
//                 />
//                 <button
//                   onClick={() => removeHeading(hIndex)}
//                   className="btn btn-danger btn-sm mt-2 mt-md-0"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             ) : (
//               <div className="d-flex flex-wrap align-items-start mb-2">
//                 <span className="me-2 mt-1 fw-bold">➤</span>
//                 <div
//                   className="form-control form-control-sm bg-white text-break fw-bold"
//                   style={{
//                     whiteSpace: 'pre-wrap',
//                     minWidth: '0',
//                     flex: '1 1 100%',
//                     wordBreak: 'break-word'
//                   }}
//                 >
//                   {heading.title}
//                 </div>
//               </div>
//             )}

//             <ul className="list-unstyled ps-2 ps-md-3">
//               {heading.points.map((point, pIndex) => (
//                 <li key={pIndex}>
//                   {editMode ? (
//                     <div className="d-flex flex-wrap align-items-center mb-2">
//                       <textarea
//                         className="form-control form-control-sm me-2 text-break"
//                         placeholder="Point"
//                         value={point.text}
//                         onChange={(e) => updatePoint(hIndex, pIndex, e.target.value)}
//                         style={{
//                           overflowY: 'auto',
//                           resize: 'none',
//                           minHeight: '80px',
//                           maxHeight: '200px',
//                           flex: '1 1 100%',
//                           wordWrap: 'break-word',
//                         }}
//                       />
//                       <button
//                         onClick={() => removePoint(hIndex, pIndex)}
//                         className="btn btn-danger btn-sm mt-2 mt-md-0"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ) : (
//                     <div
//                       className="form-control form-control-sm bg-white mb-2 text-break"
//                       style={{
//                         whiteSpace: 'pre-wrap',
//                         width: '100%',
//                         wordBreak: 'break-word'
//                       }}
//                     >
//                       {point.text}
//                     </div>
//                   )}

//                   <ol type="i" className="ps-3 ps-md-4 small">
//                     {point.subpoints.map((sub, sIndex) => (
//                       <li key={sIndex}>
//                         {editMode ? (
//                           <div className="d-flex flex-wrap align-items-center mb-2">
//                             <textarea
//                               className="form-control form-control-sm me-2 text-break"
//                               placeholder="Subpoint"
//                               value={sub.text}
//                               onChange={(e) => updateSubpoint(hIndex, pIndex, sIndex, e.target.value)}
//                               style={{
//                                 overflowY: 'auto',
//                                 resize: 'none',
//                                 minHeight: '80px',
//                                 maxHeight: '200px',
//                                 flex: '1 1 100%',
//                                 wordWrap: 'break-word',
//                               }}
//                             />
//                             <button
//                               onClick={() => removeSubpoint(hIndex, pIndex, sIndex)}
//                               className="btn btn-danger btn-sm mt-2 mt-md-0"
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ) : (
//                           <div
//                             className="form-control form-control-sm bg-white mb-2 text-break"
//                             style={{
//                               whiteSpace: 'pre-wrap',
//                               width: '100%',
//                               wordBreak: 'break-word'
//                             }}
//                           >
//                             {sub.text}
//                           </div>
//                         )}

//                         <ul className="ps-3 ps-md-4 small">
//                           {sub.subsubpoints.map((ss, ssIndex) => (
//                             <li key={ssIndex}>
//                               {editMode ? (
//                                 <div className="d-flex flex-wrap align-items-center mb-2">
//                                   <textarea
//                                     className="form-control form-control-sm me-2 text-break"
//                                     placeholder="Sub-subpoint"
//                                     value={ss.text}
//                                     onChange={(e) => updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, e.target.value)}
//                                     style={{
//                                       overflowY: 'auto',
//                                       resize: 'none',
//                                       minHeight: '80px',
//                                       maxHeight: '200px',
//                                       flex: '1 1 100%',
//                                       wordWrap: 'break-word',
//                                     }}
//                                   />
//                                   <button
//                                     onClick={() => removeSubSubpoint(hIndex, pIndex, sIndex, ssIndex)}
//                                     className="btn btn-danger btn-sm mt-2 mt-md-0"
//                                   >
//                                     ×
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div
//                                   className="form-control form-control-sm bg-white mb-2 text-break"
//                                   style={{
//                                     whiteSpace: 'pre-wrap',
//                                     width: '100%',
//                                     wordBreak: 'break-word'
//                                   }}
//                                 >
//                                   {ss.text}
//                                 </div>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </li>
//                     ))}
//                   </ol>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {/* Action Buttons */}
//         <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 mb-md-5 flex-wrap">
//   {editMode ? (
//     <>
//       <button 
//         className="btn btn-sm btn-primary fw-bold text-nowrap" 
//         onClick={handleSubmit}
//         style={{ width: '150px' }}  // Fixed width instead of minWidth
//       >
//         Save Agreement
//       </button>
//       <button 
//         className="btn btn-sm btn-primary fw-bold text-nowrap" 
//         onClick={addHeading}
//         style={{ width: '150px' }}  // Same fixed width
//       >
//         Add Heading
//       </button>
//     </>
//   ) : (
//     <button 
//       className="btn btn-sm btn-primary fw-bold text-nowrap" 
//       onClick={() => setEditMode(true)}
//       style={{ width: '150px' }}  // Same fixed width
//     >
//       Edit Agreement
//     </button>
//   )}
// </div>
//       </div>
//     </div>
//   );
// };

// export default MOMEditor;




// const MOMEditor = () => {
//   // State for the agreement template
//   const [agreement, setAgreement] = useState({
//     fixedParts: [
//       'This Agreement ("Agreement") is entered into and shall become effective as of ',
//       ', by and between:\n\n**',
//       '**, with its principal place of business located at ',
//       ', represented herein by **',
//       '**, duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n**',
//       '** a national of ',
//       ', with their principal place of residence located ',
//       ', holding Emirates ID Number: ',
//       ' issued on: ',
//       ', having email ID: ',
//       ' and Contact Number: ',
//       ' (Hereinafter referred to as the "Client")'
//     ],
//     editableValues: [
//       '7/7/2025',
//       'M/s AWS Legal Consultancy FZ-LLC',
//       '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
//       'Mr Aws M. Younis, Chairman',
//       'Dr. Ali Moustafa Mohamed Elba',
//       'Egypt',
//       'Dubai, United Arab Emirates',
//       '784-1952-3620694-4',
//       '16/03/2023',
//       'alyelba@yahoo.com',
//       '+971521356931'
//     ]
//   });

//   // State for fixed heading content
//   const [fixedHeading, setFixedHeading] = useState({
//     title: "Terms and Conditions",
//     points: [
//       {
//         text: "The Attorney agrees to provide legal services to the Client as described below:",
//         subpoints: [
//           { text: "Legal consultation and advice", subsubpoints: [] },
//           { text: "Document preparation and review", subsubpoints: [] },
//           { text: "Representation in legal proceedings", subsubpoints: [] }
//         ]
//       }
//     ]
//   });

//   // State for headings structure
//   const [headings, setHeadings] = useState([
//     {
//       title: '',
//       points: [{ text: '', subpoints: [] }],
//     },
//   ]);

//   // Edit mode state
//   const [editMode, setEditMode] = useState(true);

//   // Handler for editable fields
//   const handleEditableChange = (index, newValue) => {
//     const updated = [...agreement.editableValues];
//     updated[index] = newValue;
//     setAgreement({...agreement, editableValues: updated});
//   };

//   // Fixed heading management functions
//   const updateFixedPoint = (pIndex, value) => {
//     const updated = {...fixedHeading};
//     updated.points[pIndex].text = value;
//     setFixedHeading(updated);
//   };

//   const updateFixedSubpoint = (pIndex, sIndex, value) => {
//     const updated = {...fixedHeading};
//     updated.points[pIndex].subpoints[sIndex].text = value;
//     setFixedHeading(updated);
//   };

//   const addFixedPoint = () => {
//     const updated = {...fixedHeading};
//     updated.points.push({ text: '', subpoints: [] });
//     setFixedHeading(updated);
//   };

//   const removeFixedPoint = (pIndex) => {
//     const updated = {...fixedHeading};
//     updated.points.splice(pIndex, 1);
//     setFixedHeading(updated);
//   };

//   const removeFixedSubpoint = (pIndex, sIndex) => {
//     const updated = {...fixedHeading};
//     updated.points[pIndex].subpoints.splice(sIndex, 1);
//     setFixedHeading(updated);
//   };

//   // Heading management functions
//  const addHeading = () => {
//   setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);
// };

//   const updateHeadingTitle = (index, value) => {
//     const updated = [...headings];
//     updated[index].title = value;
//     setHeadings(updated);
//   };

//   // Point management functions
//   const addPoint = (hIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points.push({ text: '', subpoints: [] });
//     setHeadings(updated);
//   };

//   const updatePoint = (hIndex, pIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].text = value;
//     setHeadings(updated);
//   };

//   // Subpoint management functions
//   const addSubpoint = (hIndex, pIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints.push({ text: '', subsubpoints: [] });
//     setHeadings(updated);
//   };

//   const updateSubpoint = (hIndex, pIndex, sIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
//     setHeadings(updated);
//   };

//   // Sub-subpoint management functions
//   const addSubSubpoint = (hIndex, pIndex, sIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.push({ text: '' });
//     setHeadings(updated);
//   };

//   const updateSubSubpoint = (hIndex, pIndex, sIndex, ssIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
//     setHeadings(updated);
//   };

//   // Removal functions
//   const removeHeading = (hIndex) => {
//     const updated = [...headings];
//     updated.splice(hIndex, 1);
//     setHeadings(updated);
//   };

//   const removePoint = (hIndex, pIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points.splice(pIndex, 1);
//     setHeadings(updated);
//   };

//   const removeSubpoint = (hIndex, pIndex, sIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
//     setHeadings(updated);
//   };

//   const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
//     setHeadings(updated);
//   };

//   // Form submission handler
//   const handleSubmit = () => {
//     setEditMode(false);
//   };

//   return (
//     <div className="card w-100" style={{ maxHeight: '87vh', overflowY: 'auto' }}>
//       <div className="container mt-2 mt-md-4">
//         {/* Main Header */}
//         <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
//           <img 
//             src="logo.png" 
//             alt="Logo" 
//             className="me-2 me-md-3 mb-2 mb-md-0" 
//             style={{ 
//               height: '50px',
//               maxWidth: '100%'
//             }} 
//           />
//           <h1 className="mb-0 h4 h3-md fw-bold text-break" style={{ wordBreak: 'break-word' }}>
//             Legal Fee Agreement
//           </h1>
//         </div>

//         {/* Agreement Text Section - Responsive */}
//         <div className="card p-2 p-md-4 shadow-sm mb-4">
//           <label className="form-label fw-bold fs-5 text-break">Agreement</label>

//           {editMode ? (
//             <div className="form-control p-3" style={{ 
//               minHeight: '300px', 
//               whiteSpace: 'pre-wrap',
//               overflowX: 'hidden'
//             }}>
//               {agreement.fixedParts.map((part, index) => (
//                 <React.Fragment key={`part-${index}`}>
//                   <span style={{ wordBreak: 'break-word' }}>{part}</span>
//                   {index < agreement.editableValues.length && (
//                     <input
//                       type="text"
//                       className="border-bottom mx-1 px-1"
//                       value={agreement.editableValues[index]}
//                       onChange={(e) => handleEditableChange(index, e.target.value)}
//                       style={{
//                         border: 'none',
//                         borderBottom: '1px solid #000',
//                         background: 'transparent',
//                         padding: '2px 5px',
//                         margin: '0 3px',
//                         minWidth: '100px',
//                         width: 'auto',
//                         maxWidth: '100%',
//                         wordBreak: 'break-word',
//                         display: 'inline-block'
//                       }}
//                     />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           ) : (
//             <div className="form-control bg-white p-3" style={{ 
//               whiteSpace: 'pre-wrap',
//               minHeight: '300px',
//               overflowY: 'auto',
//               wordBreak: 'break-word'
//             }}>
//               {agreement.fixedParts.map((part, index) => (
//                 <React.Fragment key={`display-${index}`}>
//                   <span style={{ wordBreak: 'break-word' }}>{part}</span>
//                   {index < agreement.editableValues.length && (
//                     <span style={{ wordBreak: 'break-word' }}>{agreement.editableValues[index]}</span>
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Fixed Heading Section */}
//         <div className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
//           {/* Fixed Heading Title (not editable) */}
//           <div className="d-flex flex-wrap align-items-start mb-2">
//             <span className="me-2 mt-1 fw-bold">➤</span>
//             <div className="form-control form-control-sm bg-white text-break fw-bold"
//               style={{
//                 whiteSpace: 'pre-wrap',
//                 minWidth: '0',
//                 flex: '1 1 100%',
//                 wordBreak: 'break-word'
//               }}>
//               {fixedHeading.title}
//             </div>
//           </div>

//           {/* Editable Points under Fixed Heading */}
//           <ul className="list-unstyled ps-2 ps-md-3">
//             {fixedHeading.points.map((point, pIndex) => (
//               <li key={`fixed-${pIndex}`}>
//                 {editMode ? (
//                   <div className="d-flex flex-wrap align-items-center mb-2">
//                     <textarea
//                       className="form-control form-control-sm me-2 text-break"
//                       placeholder="Point under fixed heading"
//                       value={point.text}
//                       onChange={(e) => updateFixedPoint(pIndex, e.target.value)}
//                       style={{
//                         overflowY: 'auto',
//                         resize: 'none',
//                         minHeight: '80px',
//                         maxHeight: '200px',
//                         flex: '1 1 100%',
//                         wordWrap: 'break-word',
//                       }}
//                     />
//                     <button
//                       onClick={() => removeFixedPoint(pIndex)}
//                       className="btn btn-danger btn-sm mt-2 mt-md-0"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ) : (
//                   <div
//                     className="form-control form-control-sm bg-white mb-2 text-break"
//                     style={{
//                       whiteSpace: 'pre-wrap',
//                       width: '100%',
//                       wordBreak: 'break-word'
//                     }}
//                   >
//                     {point.text}
//                   </div>
//                 )}

//                 {/* Subpoints (editable) */}
//                 <ol type="i" className="ps-3 ps-md-4 small">
//                   {point.subpoints.map((sub, sIndex) => (
//                     <li key={`fixed-sub-${sIndex}`}>
//                       {editMode ? (
//                         <div className="d-flex flex-wrap align-items-center mb-2">
//                           <textarea
//                             className="form-control form-control-sm me-2 text-break"
//                             placeholder="Subpoint"
//                             value={sub.text}
//                             onChange={(e) => updateFixedSubpoint(pIndex, sIndex, e.target.value)}
//                             style={{
//                               overflowY: 'auto',
//                               resize: 'none',
//                               minHeight: '80px',
//                               maxHeight: '200px',
//                               flex: '1 1 100%',
//                               wordWrap: 'break-word',
//                             }}
//                           />
//                           <button
//                             onClick={() => removeFixedSubpoint(pIndex, sIndex)}
//                             className="btn btn-danger btn-sm mt-2 mt-md-0"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ) : (
//                         <div
//                           className="form-control form-control-sm bg-white mb-2 text-break"
//                           style={{
//                             whiteSpace: 'pre-wrap',
//                             width: '100%',
//                             wordBreak: 'break-word'
//                           }}
//                         >
//                           {sub.text}
//                         </div>
//                       )}
//                     </li>
//                   ))}
//                 </ol>
//               </li>
//             ))}
//           </ul>

//           {/* Add new point button in edit mode */}
//           {editMode && (
//             <button 
//               onClick={addFixedPoint}
//               className="btn btn-sm btn-success mt-2"
//             >
//               + Add Point to Fixed Heading
//             </button>
//           )}
//         </div>

//         {/* Headings Section */}
//         {headings.map((heading, hIndex) => (
//           <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">

//             {editMode ? (
//               <div className="d-flex flex-wrap align-items-center mb-2">
//                 <span className="me-2 fw-bold">➤</span>
//                 <textarea
//                   className="form-control form-control-sm me-2 text-break fw-bold"
//                   placeholder="Enter heading"
//                   value={heading.title}
//                   onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
//                   style={{
//                     overflowY: 'auto',
//                     resize: 'none',
//                     minHeight: '80px',
//                     maxHeight: '200px',
//                     flex: '1 1 100%',
//                     wordWrap: 'break-word',
//                     wordBreak: 'break-word'
//                   }}
//                 />
//                 <button
//                   onClick={() => removeHeading(hIndex)}
//                   className="btn btn-danger btn-sm mt-2 mt-md-0"
//                 >
//                   🗑️
//                 </button>
//               </div>
//             ) : (
//               <div className="d-flex flex-wrap align-items-start mb-2">
//                 <span className="me-2 mt-1 fw-bold">➤</span>
//                 <div
//                   className="form-control form-control-sm bg-white text-break fw-bold"
//                   style={{
//                     whiteSpace: 'pre-wrap',
//                     minWidth: '0',
//                     flex: '1 1 100%',
//                     wordBreak: 'break-word'
//                   }}
//                 >
//                   {heading.title}
//                 </div>
//               </div>
//             )}

//             <ul className="list-unstyled ps-2 ps-md-3">
//               {heading.points.map((point, pIndex) => (
//                 <li key={pIndex}>
//                   {editMode ? (
//                     <div className="d-flex flex-wrap align-items-center mb-2">
//                       <textarea
//                         className="form-control form-control-sm me-2 text-break"
//                         placeholder="Point"
//                         value={point.text}
//                         onChange={(e) => updatePoint(hIndex, pIndex, e.target.value)}
//                         style={{
//                           overflowY: 'auto',
//                           resize: 'none',
//                           minHeight: '80px',
//                           maxHeight: '200px',
//                           flex: '1 1 100%',
//                           wordWrap: 'break-word',
//                         }}
//                       />
//                       <button
//                         onClick={() => removePoint(hIndex, pIndex)}
//                         className="btn btn-danger btn-sm mt-2 mt-md-0"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ) : (
//                     <div
//                       className="form-control form-control-sm bg-white mb-2 text-break"
//                       style={{
//                         whiteSpace: 'pre-wrap',
//                         width: '100%',
//                         wordBreak: 'break-word'
//                       }}
//                     >
//                       {point.text}
//                     </div>
//                   )}

//                   <ol type="i" className="ps-3 ps-md-4 small">
//                     {point.subpoints.map((sub, sIndex) => (
//                       <li key={sIndex}>
//                         {editMode ? (
//                           <div className="d-flex flex-wrap align-items-center mb-2">
//                             <textarea
//                               className="form-control form-control-sm me-2 text-break"
//                               placeholder="Subpoint"
//                               value={sub.text}
//                               onChange={(e) => updateSubpoint(hIndex, pIndex, sIndex, e.target.value)}
//                               style={{
//                                 overflowY: 'auto',
//                                 resize: 'none',
//                                 minHeight: '80px',
//                                 maxHeight: '200px',
//                                 flex: '1 1 100%',
//                                 wordWrap: 'break-word',
//                               }}
//                             />
//                             <button
//                               onClick={() => removeSubpoint(hIndex, pIndex, sIndex)}
//                               className="btn btn-danger btn-sm mt-2 mt-md-0"
//                             >
//                               ×
//                             </button>
//                           </div>
//                         ) : (
//                           <div
//                             className="form-control form-control-sm bg-white mb-2 text-break"
//                             style={{
//                               whiteSpace: 'pre-wrap',
//                               width: '100%',
//                               wordBreak: 'break-word'
//                             }}
//                           >
//                             {sub.text}
//                           </div>
//                         )}

//                         <ul className="ps-3 ps-md-4 small">
//                           {sub.subsubpoints.map((ss, ssIndex) => (
//                             <li key={ssIndex}>
//                               {editMode ? (
//                                 <div className="d-flex flex-wrap align-items-center mb-2">
//                                   <textarea
//                                     className="form-control form-control-sm me-2 text-break"
//                                     placeholder="Sub-subpoint"
//                                     value={ss.text}
//                                     onChange={(e) => updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, e.target.value)}
//                                     style={{
//                                       overflowY: 'auto',
//                                       resize: 'none',
//                                       minHeight: '80px',
//                                       maxHeight: '200px',
//                                       flex: '1 1 100%',
//                                       wordWrap: 'break-word',
//                                     }}
//                                   />
//                                   <button
//                                     onClick={() => removeSubSubpoint(hIndex, pIndex, sIndex, ssIndex)}
//                                     className="btn btn-danger btn-sm mt-2 mt-md-0"
//                                   >
//                                     ×
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div
//                                   className="form-control form-control-sm bg-white mb-2 text-break"
//                                   style={{
//                                     whiteSpace: 'pre-wrap',
//                                     width: '100%',
//                                     wordBreak: 'break-word'
//                                   }}
//                                 >
//                                   {ss.text}
//                                 </div>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </li>
//                     ))}
//                   </ol>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {/* Action Buttons */}
//         <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 mb-md-5 flex-wrap">
//           {editMode ? (
//             <>
//               <button 
//                 className="btn btn-sm btn-primary fw-bold text-nowrap" 
//                 onClick={handleSubmit}
//                 style={{ width: '150px' }}
//               >
//                 Save Agreement
//               </button>
//               <button 
//                 className="btn btn-sm btn-primary fw-bold text-nowrap" 
//                 onClick={addHeading}
//                 style={{ width: '150px' }}
//               >
//                 Add Heading
//               </button>
//             </>
//           ) : (
//             <button 
//               className="btn btn-sm btn-primary fw-bold text-nowrap" 
//               onClick={() => setEditMode(true)}
//               style={{ width: '150px' }}
//             >
//               Edit Agreement
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MOMEditor;




// const MOMEditor = () => {
//   // Fixed headings (non-removable, only subpoints editable)
//   const fixedHeadings = [
//     {
//       title: 'Scope of Legal Services',
//       points: [
//         { text: '', subpoints: [] }
//       ]
//     },
//     {
//       title: 'Payment Terms',
//       points: [
//         { text: '', subpoints: [] }
//       ]
//     },
//     {
//       title: 'Confidentiality',
//       points: [
//         { text: '', subpoints: [] }
//       ]
//     }
//   ];

//   // State for the agreement template
//   const [agreement, setAgreement] = useState({
//     fixedParts: [
//       'This Agreement ("Agreement") is entered into and shall become effective as of ',
//       ', by and between:\n\n**',
//       '**, with its principal place of business located at ',
//       ', represented herein by **',
//       '**, duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n**',
//       '** a national of ',
//       ', with their principal place of residence located ',
//       ', holding Emirates ID Number: ',
//       ' issued on: ',
//       ', having email ID: ',
//       ' and Contact Number: ',
//       ' (Hereinafter referred to as the "Client")'
//     ],
//     editableValues: [
//       '7/7/2025',
//       'M/s AWS Legal Consultancy FZ-LLC',
//       '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
//       'Mr Aws M. Younis, Chairman',
//       'Dr. Ali Moustafa Mohamed Elba',
//       'Egypt',
//       'Dubai, United Arab Emirates',
//       '784-1952-3620694-4',
//       '16/03/2023',
//       'alyelba@yahoo.com',
//       '+971521356931'
//     ]
//   });

//   const [headings, setHeadings] = useState([
//     {
//       title: '',
//       points: [{ text: '', subpoints: [] }],
//     },
//   ]);

//   const [editMode, setEditMode] = useState(true);

//   const handleEditableChange = (index, newValue) => {
//     const updated = [...agreement.editableValues];
//     updated[index] = newValue;
//     setAgreement({ ...agreement, editableValues: updated });
//   };

//   const addHeading = () => {
//     setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);
//   };

//   const updateHeadingTitle = (index, value) => {
//     const updated = [...headings];
//     updated[index].title = value;
//     setHeadings(updated);
//   };

//   const addPoint = (hIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points.push({ text: '', subpoints: [] });
//     setHeadings(updated);
//   };

//   const updatePoint = (hIndex, pIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].text = value;
//     setHeadings(updated);
//   };

//   const addSubpoint = (hIndex, pIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints.push({ text: '', subsubpoints: [] });
//     setHeadings(updated);
//   };

//   const updateSubpoint = (hIndex, pIndex, sIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
//     setHeadings(updated);
//   };

//   const addSubSubpoint = (hIndex, pIndex, sIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.push({ text: '' });
//     setHeadings(updated);
//   };

//   const updateSubSubpoint = (hIndex, pIndex, sIndex, ssIndex, value) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
//     setHeadings(updated);
//   };

//   const removeHeading = (hIndex) => {
//     const updated = [...headings];
//     updated.splice(hIndex, 1);
//     setHeadings(updated);
//   };

//   const removePoint = (hIndex, pIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points.splice(pIndex, 1);
//     setHeadings(updated);
//   };

//   const removeSubpoint = (hIndex, pIndex, sIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
//     setHeadings(updated);
//   };

//   const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
//     const updated = [...headings];
//     updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
//     setHeadings(updated);
//   };

//   const handleSubmit = () => {
//     setEditMode(false);
//   };

//   // Reusable rendering logic for headings
//   const renderHeadings = (headingList, editable = true, isFixed = false) =>
//     headingList.map((heading, hIndex) => (
//       <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
//         <div className="d-flex flex-wrap align-items-start mb-2">
//           <span className="me-2 mt-1 fw-bold">➤</span>
//           <div
//             className="form-control form-control-sm bg-white text-break fw-bold"
//             style={{
//               whiteSpace: 'pre-wrap',
//               minWidth: '0',
//               flex: '1 1 100%',
//               wordBreak: 'break-word'
//             }}
//           >
//             {heading.title}
//           </div>
//         </div>

//         <ul className="list-unstyled ps-2 ps-md-3">
//           {heading.points.map((point, pIndex) => (
//             <li key={pIndex}>
//               {editMode && editable ? (
//                 <div className="d-flex flex-wrap align-items-center mb-2">
//                   <textarea
//                     className="form-control form-control-sm me-2 text-break"
//                     placeholder="Point"
//                     value={point.text}
//                     onChange={(e) => {
//                       const updated = [...headingList];
//                       updated[hIndex].points[pIndex].text = e.target.value;
//                       isFixed ? (fixedHeadings[hIndex] = updated[hIndex]) : setHeadings(updated);
//                     }}
//                     style={{
//                       overflowY: 'auto',
//                       resize: 'none',
//                       minHeight: '80px',
//                       maxHeight: '200px',
//                       flex: '1 1 100%',
//                       wordWrap: 'break-word',
//                     }}
//                   />
//                   {!isFixed && (
//                     <button
//                       onClick={() => removePoint(hIndex, pIndex)}
//                       className="btn btn-danger btn-sm mt-2 mt-md-0"
//                     >
//                       ×
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div
//                   className="form-control form-control-sm bg-white mb-2 text-break"
//                   style={{
//                     whiteSpace: 'pre-wrap',
//                     width: '100%',
//                     wordBreak: 'break-word'
//                   }}
//                 >
//                   {point.text}
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     ));

//   return (
//     <div className="card w-100" style={{ maxHeight: '87vh', overflowY: 'auto' }}>
//       <div className="container mt-2 mt-md-4">
//         {/* Header */}
//         <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
//           <img 
//             src="logo.png" 
//             alt="Logo" 
//             className="me-2 me-md-3 mb-2 mb-md-0" 
//             style={{ height: '50px', maxWidth: '100%' }} 
//           />
//           <h1 className="mb-0 h4 h3-md fw-bold text-break" style={{ wordBreak: 'break-word' }}>
//             Legal Fee Agreement
//           </h1>
//         </div>

//         {/* Agreement Text Section */}
//         <div className="card p-2 p-md-4 shadow-sm mb-4">
//           <label className="form-label fw-bold fs-5 text-break">Agreement</label>
//           {editMode ? (
//             <div className="form-control p-3" style={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
//               {agreement.fixedParts.map((part, index) => (
//                 <React.Fragment key={`part-${index}`}>
//                   <span>{part}</span>
//                   {index < agreement.editableValues.length && (
//                     <input
//                       type="text"
//                       className="border-bottom mx-1 px-1"
//                       value={agreement.editableValues[index]}
//                       onChange={(e) => handleEditableChange(index, e.target.value)}
//                       style={{
//                         border: 'none',
//                         borderBottom: '1px solid #000',
//                         background: 'transparent',
//                         padding: '2px 5px',
//                         margin: '0 3px',
//                         minWidth: '100px',
//                         maxWidth: '100%',
//                         display: 'inline-block'
//                       }}
//                     />
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           ) : (
//             <div className="form-control bg-white p-3" style={{ whiteSpace: 'pre-wrap', minHeight: '300px' }}>
//               {agreement.fixedParts.map((part, index) => (
//                 <React.Fragment key={`display-${index}`}>
//                   <span>{part}</span>
//                   {index < agreement.editableValues.length && (
//                     <span>{agreement.editableValues[index]}</span>
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Fixed Headings */}
//         {renderHeadings(fixedHeadings, true, true)}

//         {/* Custom Headings */}
//         {renderHeadings(headings)}

//         {/* Action Buttons */}
//         <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 mb-md-5 flex-wrap">
//           {editMode ? (
//             <>
//               <button
//                 className="btn btn-sm btn-primary fw-bold text-nowrap"
//                 onClick={handleSubmit}
//                 style={{ width: '150px' }}
//               >
//                 Save Agreement
//               </button>
//               <button
//                 className="btn btn-sm btn-primary fw-bold text-nowrap"
//                 onClick={addHeading}
//                 style={{ width: '150px' }}
//               >
//                 Add Heading
//               </button>
//             </>
//           ) : (
//             <button
//               className="btn btn-sm btn-primary fw-bold text-nowrap"
//               onClick={() => setEditMode(true)}
//               style={{ width: '150px' }}
//             >
//               Edit Agreement
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MOMEditor;



const LEA_Form = () => {
    // Agreement content
    const [agreement, setAgreement] = useState({
        fixedParts: [
            `This Agreement ("Agreement") is entered into and shall become effective as of ${new Date().toLocaleDateString('en-GB')} by and between:\n\n**`,
            '**, with its principal place of business located at ',
            ', represented herein by **',
            '**, duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n**',
            '** a national of ',
            ', with their principal place of residence located ',
            ', holding Emirates ID Number: ',
            ` issued on: ${new Date().toLocaleDateString('en-GB')}, having email ID: `,
            ' and Contact Number: ',
            ' (Hereinafter referred to as the "Client")'
        ],
        editableValues: [
            'M/s AWS Legal Consultancy FZ-LLC',
            '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
            'Mr Aws M. Younis, Chairman',
            'Dr. Ali Moustafa Mohamed Elba',
            'Egypt',
            'Dubai, United Arab Emirates',
            '784-1952-3620694-4',
            'alyelba@yahoo.com',
            '+971521356931'
        ]
    });

    // Fixed Headings State
    const [fixedHeadings, setFixedHeadings] = useState([
        {
            title: 'Section 1: Fundamental Ethics and Professional Conducts Rules',
            points: [{ text: '', subpoints: [] }]
        },
        {
            title: 'Section 2: Purpose ',
            points: [{ text: '', subpoints: [] }]
        },
        {
            title: 'Section 3: Professional Fees for Dispute Case ',
            points: [{ text: '', subpoints: [] }]
        }, {
            title: 'Section 4: Other Fees ',
            points: [{ text: '', subpoints: [] }]
        }, {
            title: 'Section 5: Making Contact',
            points: [{ text: '', subpoints: [] }]
        }, {
            title: 'Section 6: Making appointments',
            points: [{ text: '', subpoints: [] }]
        }, {
            title: 'Section 7: Co-operation ',
            points: [{ text: '', subpoints: [] }]
        }, {
            title: 'Section 8: Contact by the other side',
            points: [{ text: '', subpoints: [] }]
        }, {
            title: 'Section 9: Bank Details',
            points: [{ text: '', subpoints: [] }]
        }, {
            title: 'Section 10: Miscellaneous ',
            points: [{ text: '', subpoints: [] }]
        }
    ]);

    // Dynamic headings
    const [headings, setHeadings] = useState([
        {
            title: '',
            points: [{ text: '', subpoints: [] }]
        }
    ]);

    const [editMode, setEditMode] = useState(true);

    const handleEditableChange = (index, newValue) => {
        const updated = [...agreement.editableValues];
        updated[index] = newValue;
        setAgreement({ ...agreement, editableValues: updated });
    };

    const handleSubmit = () => setEditMode(false);
    const addHeading = () =>
        setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

    const updateHeadingTitle = (hIndex, value) => {
        const updated = [...headings];
        updated[hIndex].title = value;
        setHeadings(updated);
    };

    const updatePoint = (setFn, list, hIndex, pIndex, value) => {
        const updated = [...list];
        updated[hIndex].points[pIndex].text = value;
        setFn(updated);
    };

    const updateSubpoint = (setFn, list, hIndex, pIndex, sIndex, value) => {
        const updated = [...list];
        updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
        setFn(updated);
    };

    const updateSubSubpoint = (setFn, list, hIndex, pIndex, sIndex, ssIndex, value) => {
        const updated = [...list];
        updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
        setFn(updated);
    };

    const removePoint = (hIndex, pIndex) => {
        const updated = [...headings];
        updated[hIndex].points.splice(pIndex, 1);
        setHeadings(updated);
    };

    const removeSubpoint = (hIndex, pIndex, sIndex) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
        setHeadings(updated);
    };

    const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
        setHeadings(updated);
    };

    const renderHeadings = (list, setFn, isFixed = false) =>
        list.map((heading, hIndex) => (
            <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
                <div className="d-flex flex-wrap align-items-start mb-2">
                    <span className="me-2 mt-1 fw-bold">➤</span>
                    {editMode && !isFixed ? (
                        <>
                            <textarea
                                className="form-control form-control-sm fw-bold text-break me-2"
                                placeholder="Enter heading"
                                value={heading.title}
                                onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
                                style={{
                                    overflowY: 'auto',
                                    resize: 'none',
                                    minHeight: '60px',
                                    flex: '1 1 auto',
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word'
                                }}
                            />
                            <button
                                className="btn btn-danger btn-sm mt-2 mt-md-0"
                                onClick={() => {
                                    const updated = [...list];
                                    updated.splice(hIndex, 1);
                                    setFn(updated);
                                }}
                            >
                                Delete Heading
                            </button>
                        </>
                    ) : (
                        <div
                            className="form-control form-control-sm bg-white text-break fw-bold"
                            style={{
                                whiteSpace: 'pre-wrap',
                                flex: '1 1 100%',
                                wordBreak: 'break-word'
                            }}
                        >
                            {heading.title}
                        </div>
                    )}
                </div>


                <ul className="list-unstyled ps-2 ps-md-3">
                    {heading.points.map((point, pIndex) => (
                        <li key={pIndex}>
                            {editMode ? (
                                <div className="d-flex flex-wrap align-items-center mb-2">
                                    <textarea
                                        className="form-control form-control-sm me-2 text-break"
                                        placeholder="Point"
                                        value={point.text}
                                        onChange={(e) =>
                                            updatePoint(setFn, list, hIndex, pIndex, e.target.value)
                                        }
                                        style={{
                                            overflowY: 'auto',
                                            resize: 'none',
                                            minHeight: '60px',
                                            flex: '1 1 100%',
                                            wordWrap: 'break-word'
                                        }}
                                    />
                                    {!isFixed && (
                                        <button
                                            onClick={() => removePoint(hIndex, pIndex)}
                                            className="btn btn-danger btn-sm mt-2 mt-md-0"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="form-control form-control-sm bg-white mb-2 text-break">
                                    {point.text}
                                </div>
                            )}

                            <ol type="i" className="ps-3 ps-md-4 small">
                                {point.subpoints.map((sub, sIndex) => (
                                    <li key={sIndex}>
                                        {editMode ? (
                                            <div className="d-flex flex-wrap align-items-center mb-2">
                                                <textarea
                                                    className="form-control form-control-sm me-2 text-break"
                                                    placeholder="Subpoint"
                                                    value={sub.text}
                                                    onChange={(e) =>
                                                        updateSubpoint(setFn, list, hIndex, pIndex, sIndex, e.target.value)
                                                    }
                                                    style={{
                                                        overflowY: 'auto',
                                                        resize: 'none',
                                                        minHeight: '60px',
                                                        flex: '1 1 100%',
                                                        wordWrap: 'break-word'
                                                    }}
                                                />
                                                {!isFixed && (
                                                    <button
                                                        onClick={() => removeSubpoint(hIndex, pIndex, sIndex)}
                                                        className="btn btn-danger btn-sm mt-2 mt-md-0"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="form-control form-control-sm bg-white mb-2 text-break">
                                                {sub.text}
                                            </div>
                                        )}
                                        <ul className="ps-3 ps-md-4 small">
                                            {sub.subsubpoints?.map((ss, ssIndex) => (
                                                <li key={ssIndex}>
                                                    {editMode ? (
                                                        <div className="d-flex flex-wrap align-items-center mb-2">
                                                            <textarea
                                                                className="form-control form-control-sm me-2 text-break"
                                                                placeholder="Sub-subpoint"
                                                                value={ss.text}
                                                                onChange={(e) =>
                                                                    updateSubSubpoint(setFn, list, hIndex, pIndex, sIndex, ssIndex, e.target.value)
                                                                }
                                                                style={{
                                                                    overflowY: 'auto',
                                                                    resize: 'none',
                                                                    minHeight: '60px',
                                                                    flex: '1 1 100%',
                                                                    wordWrap: 'break-word'
                                                                }}
                                                            />
                                                            {!isFixed && (
                                                                <button
                                                                    onClick={() =>
                                                                        removeSubSubpoint(hIndex, pIndex, sIndex, ssIndex)
                                                                    }
                                                                    className="btn btn-danger btn-sm mt-2 mt-md-0"
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="form-control form-control-sm bg-white mb-2 text-break">
                                                            {ss.text}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ol>
                        </li>
                    ))}
                </ul>
            </div>
        ));

    return (
        <div className="card w-100" style={{ maxHeight: '87vh', overflowY: 'auto' }}>
            <div className="container mt-2 mt-md-4">
                {/* Header */}
                <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
                    <img src="logo.png" alt="Logo" className="me-2 me-md-3 mb-2 mb-md-0" style={{ height: '50px' }} />
                    <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
                </div>

                {/* Agreement Text */}
                <div className="card p-2 p-md-4 shadow-sm mb-4">
                    <label className="form-label fw-bold fs-5 text-break">Agreement</label>
                    {editMode ? (
                        <div className="form-control p-3" style={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}>
                            {agreement.fixedParts.map((part, index) => (
                                <React.Fragment key={index}>
                                    <span>{part}</span>
                                    {index < agreement.editableValues.length && (
                                        <input
                                            type="text"
                                            value={agreement.editableValues[index]}
                                            onChange={(e) => handleEditableChange(index, e.target.value)}
                                            className="border-bottom mx-1 px-1"
                                            style={{
                                                border: 'none',
                                                borderBottom: '1px solid #000',
                                                background: 'transparent',
                                                minWidth: '100px'
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <div className="form-control bg-white p-3" style={{ whiteSpace: 'pre-wrap', minHeight: '300px' }}>
                            {agreement.fixedParts.map((part, index) => (
                                <React.Fragment key={index}>
                                    <span>{part}</span>
                                    {index < agreement.editableValues.length && (
                                        <span>{agreement.editableValues[index]}</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                {/* Fixed Headings */}
                {renderHeadings(fixedHeadings, setFixedHeadings, true)}

                {/* Custom Headings */}
                {renderHeadings(headings, setHeadings, false)}

                {/* Buttons */}
                <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap">
                    {editMode ? (
                        <>
                            <button className="btn btn-sm btn-primary fw-bold" onClick={handleSubmit} style={{ width: '150px' }}>
                                Save Agreement
                            </button>
                            <button className="btn btn-sm btn-primary fw-bold" onClick={addHeading} style={{ width: '150px' }}>
                                Add Heading
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-sm btn-primary fw-bold" onClick={() => setEditMode(true)} style={{ width: '150px' }}>
                            Edit Agreement
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LEA_Form;











