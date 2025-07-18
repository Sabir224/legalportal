import React, { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ApiEndPoint } from "../utils/utlis";
import { useSelector } from "react-redux";
import ConfirmModal from "../../AlertModels/ConfirmModal";
import { useAlert } from "../../../../Component/AlertContext";
import {
    Form,
    Button,
    Card,
    Container,
    Row,
    Col,
    Dropdown,
    InputGroup,
} from "react-bootstrap";

const MOMEditor = ({ token }) => {
    const [headings, setHeadings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [clientName, setClientName] = useState("");
    const [lawyerName, setLawyerName] = useState("");
    const [associateName, setAssociateName] = useState("");
    const [caseType, setCaseType] = useState("");
    const [caseId, setCaseId] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formId, setFormId] = useState(null)
    const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);

    const [showComfirmModel, setShowComfirmModel] = useState(false);
    const [deleteItem, setDeleteItem] = useState(false);
    const [deleteItemIndex, setDeleteItemIndex] = useState(null)
    const { showLoading, showSuccess, showError } = useAlert();
    const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
    const [FormMOMDetails, setFormMOMDetails] = useState([]);

    // Function to handle confirmation
    // const handleConfirm = () => {
    //     console.log("User confirmed!");
    //     setShowComfirmModel(false);
    //     // Call your delete or confirm logic here
    // };

    // Function to handle cancel
    const handleCancel = () => {
        console.log("User cancelled.");
        setShowComfirmModel(false);
    };


    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`${ApiEndPoint}getFormMOMByCaseId/${caseId}`);
                console.log("MOM form drafts=", response.data)
                if (response.data.form && response.data.form.length > 0 && response.data.form[0].headings) {
                    const formData = response.data.form[0];
                    setHeadings(formData.headings);
                    setClientName(formData.clientName || "");
                    setLawyerName(formData.lawyerName || "");
                    setAssociateName(formData.associateName || "");
                    setCaseType(formData.caseType || "");
                    setFormId(formData?._id)
                    if (formData.date) {
                        setSelectedDate(new Date(formData.date));
                    }
                    setHasData(true);
                } else {
                    setFormMOMDetails(response.data?.formMOM)
                    setHasData(false);
                }
            } catch (err) {
                console.error("Failed to fetch form", err);
                setHasData(false);
            } finally {
                setIsLoading(false);
            }
        };

        setCaseId(reduxCaseInfo?._id)
        if (caseId) {
            fetchForm();
        }
    }, [caseId]);

    const addHeading = () => {
        setHeadings([...headings, { title: "", points: [{ text: "", subpoints: [] }] }]);
    };

    const updateHeadingTitle = (index, value) => {
        const updated = [...headings];
        updated[index].title = value;
        setHeadings(updated);
    };

    const addPoint = (hIndex) => {
        const updated = [...headings];
        updated[hIndex].points.push({ text: "", subpoints: [] });
        setHeadings(updated);
    };

    const updatePoint = (hIndex, pIndex, value) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].text = value;
        setHeadings(updated);
    };

    const addSubpoint = (hIndex, pIndex) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints.push({ text: "", subsubpoints: [] });
        setHeadings(updated);
    };

    const updateSubpoint = (hIndex, pIndex, sIndex, value) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
        setHeadings(updated);
    };

    const addSubSubpoint = (hIndex, pIndex, sIndex) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.push({ text: "" });
        setHeadings(updated);
    };

    const updateSubSubpoint = (hIndex, pIndex, sIndex, ssIndex, value) => {
        const updated = [...headings];
        updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
        setHeadings(updated);
    };

    const removeHeading = async () => {
        console.log(deleteItem?._id)
        let itemId = deleteItem?._id
        try {
            showLoading()
            const response = await axios.delete(`${ApiEndPoint}deleteFormMOMHeadings/${caseId}/${itemId}`);
            console.log('Heading deleted:', response.data.message);
            const updated = [...headings];
            updated.splice(deleteItemIndex, 1);
            setHeadings(updated);
            showSuccess("Heading Deleted Successfully")
            setShowComfirmModel(false)
            // Optionally update state or refresh form data
        } catch (error) {
            if (!editMode) {
                const updated = [...headings];
                updated.splice(deleteItemIndex, 1);
                setHeadings(updated);
                setShowComfirmModel(false)

            }
            showError('Error deleting heading:', error.message);
        }


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

    const handleSubmit = async () => {
        let formData = {}
        if (token?.Role === "paralegal") {
            formData = {
                caseId,
                clientName,
                lawyerName,
                associateName,
                date: selectedDate,
                caseType,
                headings,
                isDraft: true,
                isAccept: false
            };
        } else {
            formData = {
                caseId,
                clientName,
                lawyerName,
                associateName,
                date: selectedDate,
                caseType,
                headings,
                isDraft: false,
                isAccept: true
            };
        }
        showLoading()
        try {
            const res = await axios.post(editMode ? `${ApiEndPoint}UpdateFormMOM/${formId}` : `${ApiEndPoint}createFormMOM`, formData);
            showSuccess(`Form ${editMode ? "updated" : "add"} successfully!`);
            console.log("Submitted:", res.data);
            if (token?.Role !== "paralegal") {
                setHasData(true);
            }
            setEditMode(false);
        } catch (err) {
            console.error("Error submitting form:", err);
            showError("Error submitting form.");
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    if (isLoading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        // <div className="card" style={{ maxHeight: "87vh", overflowY: "auto", minWidth: "20vw" }}>
        //     <div className="container mt-4">
        //         <div className="d-flex align-items-center mb-4">
        //             <img src="logo.png" alt="Logo" className="me-3" style={{ height: '60px' }} />
        //             <h1 className="mb-0">Form L / MOM</h1>
        //         </div>

        //         <div className="card p-4 shadow-sm">
        //             <div className="row g-3">
        //                 <div className="col-md-6">
        //                     <label className="form-label fw-bold">Client</label>
        //                     {editMode || !hasData ? (
        //                         <input type="text" className="form-control" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        //                     ) : (
        //                         <div className="form-control-plaintext">{clientName}</div>
        //                     )}
        //                 </div>
        //                 <div className="col-md-6">
        //                     <label className="form-label fw-bold">Lawyer</label>
        //                     {editMode || !hasData ? (
        //                         <input type="text" className="form-control" placeholder="Lawyer Name" value={lawyerName} onChange={(e) => setLawyerName(e.target.value)} />
        //                     ) : (
        //                         <div className="form-control-plaintext">{lawyerName}</div>
        //                     )}
        //                 </div>
        //                 <div className="col-md-6">
        //                     <label className="form-label fw-bold">Associate</label>
        //                     {editMode || !hasData ? (
        //                         <input type="text" className="form-control" placeholder="Associate Name" value={associateName} onChange={(e) => setAssociateName(e.target.value)} />
        //                     ) : (
        //                         <div className="form-control-plaintext">{associateName}</div>
        //                     )}
        //                 </div>
        //                 <div className="col-md-6">
        //                     <label className="form-label fw-bold">Date</label>
        //                     <LocalizationProvider dateAdapter={AdapterDateFns}>
        //                         {editMode || !hasData ? (
        //                             <DatePicker
        //                                 value={selectedDate}
        //                                 onChange={(date) => setSelectedDate(date)}
        //                                 format="dd/MM/yyyy"
        //                                 slotProps={{
        //                                     textField: {
        //                                         fullWidth: true,
        //                                         size: "small",
        //                                     },
        //                                 }}
        //                             />
        //                         ) : (
        //                             <div className="form-control-plaintext">
        //                                 {selectedDate.toLocaleDateString('en-GB')}
        //                             </div>
        //                         )}
        //                     </LocalizationProvider>
        //                 </div>
        //                 <div className="col-12">
        //                     <label className="form-label fw-bold">Case Type</label>
        //                     {editMode || !hasData ? (
        //                         <input type="text" className="form-control" placeholder="Family / Civil / ..." value={caseType} onChange={(e) => setCaseType(e.target.value)} />
        //                     ) : (
        //                         <div className="form-control-plaintext">{caseType}</div>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>

        //         {hasData && !editMode && (
        //             <button className="btn mt-4" style={{ backgroundColor: '#18273e', color: 'white' }} onClick={handleEdit}>
        //                 Edit Form
        //             </button>
        //         )}

        //         {(editMode || !hasData) && (
        //             <button className="btn mt-4" style={{ backgroundColor: '#18273e', color: 'white' }} onClick={addHeading}>
        //                 Add Heading
        //             </button>
        //         )}

        //         {/* {headings.map((heading, hIndex) => (
        //             <div key={hIndex} className="section border p-3 my-3 rounded bg-light">
        //                 {editMode || !hasData ? (
        //                     <div className="d-flex align-items-center mb-2">
        //                         <span className="me-2">➤</span>
        //                         <textarea
        //                             className="form-control me-2"
        //                             placeholder="Enter heading"
        //                             value={heading.title}
        //                             onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
        //                             rows={1}
        //                             onInput={(e) => {
        //                                 e.target.style.height = 'auto';
        //                                 e.target.style.height = e.target.scrollHeight + 'px';
        //                             }}
        //                         />
        //                         <button
        //                             onClick={() => removeHeading(hIndex)}
        //                             className="btn btn-danger btn-sm"
        //                         >
        //                             🗑️
        //                         </button>
        //                     </div>
        //                 ) : (
        //                     <h4 className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
        //                         <span className="me-2">➤</span> {heading.title}
        //                     </h4>
        //                 )}

        //                 {(editMode || !hasData) && (
        //                     <button
        //                         onClick={() => addPoint(hIndex)}
        //                         className="btn btn-outline-primary btn-sm mb-2"
        //                     >
        //                         ➕ Add Point
        //                     </button>
        //                 )}

        //                 <ul className="list-unstyled ps-3">
        //                     {heading.points.map((point, pIndex) => (
        //                         <li key={pIndex}>
        //                             {editMode || !hasData ? (
        //                                 <div className="d-flex align-items-center mb-2">
        //                                     <span className="me-2">{pIndex + 1}.</span>
        //                                     <textarea
        //                                         className="form-control me-2"
        //                                         placeholder="Point"
        //                                         value={point.text}
        //                                         onChange={(e) => updatePoint(hIndex, pIndex, e.target.value)}
        //                                         rows={1}
        //                                         onInput={(e) => {
        //                                             e.target.style.height = 'auto';
        //                                             e.target.style.height = e.target.scrollHeight + 'px';
        //                                         }}
        //                                     />
        //                                     <button
        //                                         onClick={() => removePoint(hIndex, pIndex)}
        //                                         className="btn btn-danger btn-sm"
        //                                     >
        //                                         🗑️
        //                                     </button>
        //                                 </div>
        //                             ) : (
        //                                 <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>
        //                                     <strong>
        //                                         {pIndex + 1}. {point.text}
        //                                     </strong>
        //                                 </p>
        //                             )}

        //                             {(editMode || !hasData) && (
        //                                 <button
        //                                     onClick={() => addSubpoint(hIndex, pIndex)}
        //                                     className="btn btn-outline-secondary btn-sm mb-2 ms-4"
        //                                 >
        //                                     + Subpoint
        //                                 </button>
        //                             )}

        //                             <ol type="i" className="ps-4">
        //                                 {point.subpoints.map((sub, sIndex) => (
        //                                     <li key={sIndex}>
        //                                         {editMode || !hasData ? (
        //                                             <div className="d-flex align-items-center mb-2">
        //                                                 <textarea
        //                                                     className="form-control me-2"
        //                                                     placeholder="Subpoint"
        //                                                     value={sub.text}
        //                                                     onChange={(e) =>
        //                                                         updateSubpoint(hIndex, pIndex, sIndex, e.target.value)
        //                                                     }
        //                                                     rows={1}
        //                                                     onInput={(e) => {
        //                                                         e.target.style.height = 'auto';
        //                                                         e.target.style.height = e.target.scrollHeight + 'px';
        //                                                     }}
        //                                                 />
        //                                                 <button
        //                                                     onClick={() => removeSubpoint(hIndex, pIndex, sIndex)}
        //                                                     className="btn btn-danger btn-sm"
        //                                                 >
        //                                                     🗑️
        //                                                 </button>
        //                                             </div>
        //                                         ) : (
        //                                             <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{sub.text}</p>
        //                                         )}

        //                                         {(editMode || !hasData) && (
        //                                             <button
        //                                                 onClick={() => addSubSubpoint(hIndex, pIndex, sIndex)}
        //                                                 className="btn btn-outline-secondary btn-sm mb-2 ms-5"
        //                                             >
        //                                                 + Sub-subpoint
        //                                             </button>
        //                                         )}

        //                                         <ul className="ps-4">
        //                                             {sub.subsubpoints.map((ss, ssIndex) => (
        //                                                 <li key={ssIndex}>
        //                                                     {editMode || !hasData ? (
        //                                                         <div className="d-flex align-items-center mb-2">
        //                                                             <textarea
        //                                                                 className="form-control me-2"
        //                                                                 placeholder="Sub-subpoint"
        //                                                                 value={ss.text}
        //                                                                 onChange={(e) =>
        //                                                                     updateSubSubpoint(
        //                                                                         hIndex,
        //                                                                         pIndex,
        //                                                                         sIndex,
        //                                                                         ssIndex,
        //                                                                         e.target.value
        //                                                                     )
        //                                                                 }
        //                                                                 rows={1}
        //                                                                 onInput={(e) => {
        //                                                                     e.target.style.height = 'auto';
        //                                                                     e.target.style.height = e.target.scrollHeight + 'px';
        //                                                                 }}
        //                                                             />
        //                                                             <button
        //                                                                 onClick={() =>
        //                                                                     removeSubSubpoint(
        //                                                                         hIndex,
        //                                                                         pIndex,
        //                                                                         sIndex,
        //                                                                         ssIndex
        //                                                                     )
        //                                                                 }
        //                                                                 className="btn btn-danger btn-sm"
        //                                                             >
        //                                                                 🗑️
        //                                                             </button>
        //                                                         </div>
        //                                                     ) : (
        //                                                         <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{ss.text}</p>
        //                                                     )}
        //                                                 </li>
        //                                             ))}
        //                                         </ul>
        //                                     </li>
        //                                 ))}
        //                             </ol>
        //                         </li>
        //                     ))}
        //                 </ul>
        //             </div>
        //         ))} */}




        //         {headings.map((heading, hIndex) => (
        //             <div key={hIndex} className="section border p-3 my-3 rounded bg-light">
        //                 {editMode || !hasData ? (
        //                     <div className="d-flex align-items-center mb-2">
        //                         <span className="me-2">➤</span>
        //                         <textarea
        //                             className="form-control me-2"
        //                             placeholder="Enter heading"
        //                             value={heading.title}
        //                             onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
        //                             rows={1}
        //                             onInput={(e) => {
        //                                 e.target.style.height = 'auto';
        //                                 e.target.style.height = e.target.scrollHeight + 'px';
        //                             }}
        //                             onKeyDown={(e) => {
        //                                 if (e.key === 'Tab') {
        //                                     e.preventDefault();
        //                                     const start = e.target.selectionStart;
        //                                     const end = e.target.selectionEnd;
        //                                     const value = e.target.value;
        //                                     const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
        //                                     updateHeadingTitle(hIndex, updatedValue);
        //                                     setTimeout(() => {
        //                                         e.target.selectionStart = e.target.selectionEnd = start + 1;
        //                                     }, 0);
        //                                 }
        //                             }}
        //                         />
        //                         <button
        //                             onClick={() => {
        //                                 setDeleteItem(heading)
        //                                 setDeleteItemIndex(hIndex)
        //                                 setShowComfirmModel(true)
        //                             }
        //                             }
        //                             className="btn btn-danger btn-sm"
        //                         >
        //                             🗑️
        //                         </button>
        //                     </div>
        //                 ) : (
        //                     <h4 className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
        //                         <span className="me-2">➤</span> {heading.title}
        //                     </h4>
        //                 )}

        //                 <ul className="list-unstyled ps-3">
        //                     {heading.points.map((point, pIndex) => (
        //                         <li key={pIndex}>
        //                             {editMode || !hasData ? (
        //                                 <div className="d-flex align-items-center mb-2">
        //                                     {/* <span className="me-2">{pIndex + 1}.</span> */}
        //                                     <textarea
        //                                         className="form-control me-2"
        //                                         placeholder="Point"
        //                                         value={point.text}
        //                                         onChange={(e) => updatePoint(hIndex, pIndex, e.target.value)}
        //                                         rows={1}
        //                                         onInput={(e) => {
        //                                             e.target.style.height = 'auto';
        //                                             e.target.style.height = e.target.scrollHeight + 'px';
        //                                         }}
        //                                         onKeyDown={(e) => {
        //                                             if (e.key === 'Tab') {
        //                                                 e.preventDefault();
        //                                                 const start = e.target.selectionStart;
        //                                                 const end = e.target.selectionEnd;
        //                                                 const value = e.target.value;
        //                                                 const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
        //                                                 updatePoint(hIndex, pIndex, updatedValue);
        //                                                 setTimeout(() => {
        //                                                     e.target.selectionStart = e.target.selectionEnd = start + 1;
        //                                                 }, 0);
        //                                             }
        //                                         }}
        //                                     />

        //                                 </div>
        //                             ) : (
        //                                 <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>
        //                                     {point.text}
        //                                 </p>
        //                             )}

        //                             <ol type="i" className="ps-4">
        //                                 {point.subpoints.map((sub, sIndex) => (
        //                                     <li key={sIndex}>
        //                                         {editMode || !hasData ? (
        //                                             <div className="d-flex align-items-center mb-2">
        //                                                 <textarea
        //                                                     className="form-control me-2"
        //                                                     placeholder="Subpoint"
        //                                                     value={sub.text}
        //                                                     onChange={(e) =>
        //                                                         updateSubpoint(hIndex, pIndex, sIndex, e.target.value)
        //                                                     }
        //                                                     rows={1}
        //                                                     onInput={(e) => {
        //                                                         e.target.style.height = 'auto';
        //                                                         e.target.style.height = e.target.scrollHeight + 'px';
        //                                                     }}
        //                                                     onKeyDown={(e) => {
        //                                                         if (e.key === 'Tab') {
        //                                                             e.preventDefault();
        //                                                             const start = e.target.selectionStart;
        //                                                             const end = e.target.selectionEnd;
        //                                                             const value = e.target.value;
        //                                                             const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
        //                                                             updateSubpoint(hIndex, pIndex, sIndex, updatedValue);
        //                                                             setTimeout(() => {
        //                                                                 e.target.selectionStart = e.target.selectionEnd = start + 1;
        //                                                             }, 0);
        //                                                         }
        //                                                     }}
        //                                                 />

        //                                             </div>
        //                                         ) : (
        //                                             <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{sub.text}</p>
        //                                         )}

        //                                         <ul className="ps-4">
        //                                             {sub.subsubpoints.map((ss, ssIndex) => (
        //                                                 <li key={ssIndex}>
        //                                                     {editMode || !hasData ? (
        //                                                         <div className="d-flex align-items-center mb-2">
        //                                                             <textarea
        //                                                                 className="form-control me-2"
        //                                                                 placeholder="Sub-subpoint"
        //                                                                 value={ss.text}
        //                                                                 onChange={(e) =>
        //                                                                     updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, e.target.value)
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
        //                                                                         updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, updatedValue);
        //                                                                         setTimeout(() => {
        //                                                                             e.target.selectionStart = e.target.selectionEnd = start + 1;
        //                                                                         }, 0);
        //                                                                     }
        //                                                                 }}
        //                                                             />

        //                                                         </div>
        //                                                     ) : (
        //                                                         <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{ss.text}</p>
        //                                                     )}
        //                                                 </li>
        //                                             ))}
        //                                         </ul>
        //                                     </li>
        //                                 ))}
        //                             </ol>
        //                         </li>
        //                     ))}
        //                 </ul>
        //             </div>
        //         ))}





        //         {(editMode || !hasData) && (
        //             <div className="d-flex justify-content-center gap-3 mt-3 mb-5">
        //                 <button className="btn btn-success" onClick={handleSubmit}>
        //                     {hasData ? "Update Form" : "Submit Form"}
        //                 </button>
        //                 {editMode && (
        //                     <button className="btn btn-secondary" onClick={() => setEditMode(!editMode)}>
        //                         Cancel
        //                     </button>
        //                 )}
        //             </div>
        //         )}

        //         <ConfirmModal
        //             show={showComfirmModel}
        //             title="Delete Heading"
        //             message="Are you sure you want to delete this heading?"
        //             onConfirm={removeHeading}
        //             onCancel={handleCancel}
        //         />

        //     </div>
        // </div>


        <div className="card" style={{ maxHeight: "87vh", overflowY: "auto", minWidth: "100%" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="container mt-2 mt-md-4">
                    <div className="d-flex align-items-center mb-3 mb-md-4">
                        <img src="logo.png" alt="Logo" className="me-2 me-md-3" style={{ height: '40px', height: '50px' }} />
                        <h1 className="mb-0 h4 h3-md">Form L / MOM</h1>
                    </div>

                    <div className="card p-2 p-md-4 shadow-sm">
                        <div className="row g-2 g-md-3">
                            {(token?.Role !== "paralegal") &&
                                (
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Drafts <span className="text-danger"></span>
                                        </Form.Label>
                                        <InputGroup>
                                            <Dropdown className="w-100">
                                                <Dropdown.Toggle
                                                    variant="outline-secondary"
                                                    id="dropdown-practice-area"
                                                    disabled={hasData}
                                                    className="w-100 text-start d-flex justify-content-between align-items-center"
                                                >
                                                    {selectedDrafts === "Select Draft" ? "Select Draft" : `Draft ${selectedDrafts + 1}`}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu className="w-100">
                                                    {FormMOMDetails?.map((area, index) => (
                                                        <Dropdown.Item key={index} onClick={() => {

                                                            const formData = area
                                                            setHeadings(formData.headings);
                                                            setClientName(formData.clientName || "");
                                                            setLawyerName(formData.lawyerName || "");
                                                            setAssociateName(formData.associateName || "");
                                                            setCaseType(formData.caseType || "");
                                                            setFormId(formData?._id)
                                                            if (formData.date) {
                                                                setSelectedDate(new Date(formData.date));
                                                            }
                                                            setSelectedDrafts(index)
                                                        }
                                                        }>
                                                            Draft {index + 1}
                                                        </Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>

                                        </InputGroup>
                                    </Form.Group>
                                )
                            }
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold">Client</label>
                                {editMode || !hasData ? (
                                    <input type="text" className="form-control form-control-sm" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                                ) : (
                                    <div className="form-control-plaintext">{clientName}</div>
                                )}
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold">Lawyer</label>
                                {editMode || !hasData ? (
                                    <input type="text" className="form-control form-control-sm" placeholder="Lawyer Name" value={lawyerName} onChange={(e) => setLawyerName(e.target.value)} />
                                ) : (
                                    <div className="form-control-plaintext">{lawyerName}</div>
                                )}
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold">Associate</label>
                                {editMode || !hasData ? (
                                    <input type="text" className="form-control form-control-sm" placeholder="Associate Name" value={associateName} onChange={(e) => setAssociateName(e.target.value)} />
                                ) : (
                                    <div className="form-control-plaintext">{associateName}</div>
                                )}
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                <label className="form-label fw-bold">Date</label>
                                {editMode || !hasData ? (
                                    <DatePicker
                                        value={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                        format="dd/MM/yyyy"
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                fullWidth: true,
                                                sx: {
                                                    width: '100%',
                                                    minWidth: 0,
                                                    '& input': {
                                                        fontSize: '0.75rem',
                                                        padding: '6px 8px',
                                                    },
                                                    '& .MuiInputBase-root': {
                                                        width: '100%',
                                                    }
                                                },
                                            },
                                        }}
                                    />
                                ) : (
                                    <div className="form-control-plaintext">
                                        {selectedDate?.toLocaleDateString('en-GB')}
                                    </div>
                                )}
                            </div>


                            <div className="col-12">
                                <label className="form-label fw-bold">Case Type</label>
                                {editMode || !hasData ? (
                                    <input type="text" className="form-control form-control-sm " placeholder="Family / Civil / ..." value={caseType} onChange={(e) => setCaseType(e.target.value)} />
                                ) : (
                                    <div className="form-control-plaintext">{caseType}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {hasData && !editMode && (
                        <button className="btn btn-sm mt-3" style={{ backgroundColor: '#18273e', color: 'white' }} onClick={handleEdit}>
                            Edit Form
                        </button>
                    )}

                    {(editMode || !hasData) && (
                        <button className="btn btn-sm mt-3" style={{ backgroundColor: '#18273e', color: 'white' }} onClick={addHeading}>
                            Add Heading
                        </button>
                    )}

                    {headings.map((heading, hIndex) => (
                        <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
                            {editMode || !hasData ? (
                                <div className="d-flex align-items-center mb-2">
                                    <span className="me-2">➤</span>
                                    <textarea
                                        className="form-control form-control-sm me-2"
                                        placeholder="Enter heading"
                                        value={heading.title}
                                        onChange={(e) => updateHeadingTitle(hIndex, e.target.value)}
                                        rows={1}
                                        style={{
                                            overflow: 'hidden',
                                            resize: 'none',
                                            minHeight: '38px',
                                        }}
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        onKeyDown={(e) => {
                                            // Block Enter key to prevent new line
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }

                                            // Allow Tab for tab character
                                            if (e.key === 'Tab') {
                                                e.preventDefault();
                                                const start = e.target.selectionStart;
                                                const end = e.target.selectionEnd;
                                                const value = e.target.value;
                                                const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
                                                updateHeadingTitle(hIndex, updatedValue);
                                                setTimeout(() => {
                                                    e.target.selectionStart = e.target.selectionEnd = start + 1;
                                                }, 0);
                                            }
                                        }}
                                    />

                                    <button
                                        onClick={() => {
                                            setDeleteItem(heading)
                                            setDeleteItemIndex(hIndex)
                                            setShowComfirmModel(true)
                                        }
                                        }
                                        className="btn btn-danger btn-sm"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ) : (
                                <h4 className="h5 mb-2 mb-md-3" style={{ whiteSpace: 'pre-wrap' }}>
                                    <span className="me-2">➤</span> {heading.title}
                                </h4>
                            )}

                            <ul className="list-unstyled ps-2 ps-md-3">
                                {heading.points.map((point, pIndex) => (
                                    <li key={pIndex}>
                                        {editMode || !hasData ? (
                                            <div className="d-flex align-items-center mb-2">
                                                <textarea
                                                    className="form-control form-control-sm me-2"
                                                    placeholder="Point"
                                                    value={point.text}
                                                    onChange={(e) => updatePoint(hIndex, pIndex, e.target.value)}
                                                    rows={1}
                                                    style={{
                                                        overflow: 'hidden',         // ⛔ disables scrollbars
                                                        resize: 'none',             // ⛔ disables manual resizing
                                                        minHeight: '38px',          // ✅ base height (same as Bootstrap form-control-sm)
                                                    }}
                                                    onInput={(e) => {
                                                        e.target.style.height = 'auto'; // reset height
                                                        e.target.style.height = e.target.scrollHeight + 'px'; // set height to scroll height
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Tab') {
                                                            e.preventDefault();
                                                            const start = e.target.selectionStart;
                                                            const end = e.target.selectionEnd;
                                                            const value = e.target.value;
                                                            const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
                                                            updatePoint(hIndex, pIndex, updatedValue);
                                                            setTimeout(() => {
                                                                e.target.selectionStart = e.target.selectionEnd = start + 1;
                                                            }, 0);
                                                        }
                                                    }}
                                                />
                                            </div>

                                        ) : (
                                            <p className="mb-1 mb-md-2 small" style={{ whiteSpace: 'pre-wrap' }}>
                                                {point.text}
                                            </p>
                                        )}

                                        <ol type="i" className="ps-3 ps-md-4 small">
                                            {point.subpoints.map((sub, sIndex) => (
                                                <li key={sIndex}>
                                                    {editMode || !hasData ? (
                                                        <div className="d-flex align-items-center mb-2">
                                                            <textarea
                                                                className="form-control form-control-sm me-2"
                                                                placeholder="Subpoint"
                                                                value={sub.text}
                                                                onChange={(e) =>
                                                                    updateSubpoint(hIndex, pIndex, sIndex, e.target.value)
                                                                }
                                                                rows={1}
                                                                onInput={(e) => {
                                                                    e.target.style.height = 'auto';
                                                                    e.target.style.height = e.target.scrollHeight + 'px';
                                                                }}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Tab') {
                                                                        e.preventDefault();
                                                                        const start = e.target.selectionStart;
                                                                        const end = e.target.selectionEnd;
                                                                        const value = e.target.value;
                                                                        const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
                                                                        updateSubpoint(hIndex, pIndex, sIndex, updatedValue);
                                                                        setTimeout(() => {
                                                                            e.target.selectionStart = e.target.selectionEnd = start + 1;
                                                                        }, 0);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p className="mb-1 mb-md-2 small" style={{ whiteSpace: 'pre-wrap' }}>{sub.text}</p>
                                                    )}

                                                    <ul className="ps-3 ps-md-4 small">
                                                        {sub.subsubpoints.map((ss, ssIndex) => (
                                                            <li key={ssIndex}>
                                                                {editMode || !hasData ? (
                                                                    <div className="d-flex align-items-center mb-2">
                                                                        <textarea
                                                                            className="form-control form-control-sm me-2"
                                                                            placeholder="Sub-subpoint"
                                                                            value={ss.text}
                                                                            onChange={(e) =>
                                                                                updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, e.target.value)
                                                                            }
                                                                            rows={1}
                                                                            onInput={(e) => {
                                                                                e.target.style.height = 'auto';
                                                                                e.target.style.height = e.target.scrollHeight + 'px';
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Tab') {
                                                                                    e.preventDefault();
                                                                                    const start = e.target.selectionStart;
                                                                                    const end = e.target.selectionEnd;
                                                                                    const value = e.target.value;
                                                                                    const updatedValue = value.substring(0, start) + '\t' + value.substring(end);
                                                                                    updateSubSubpoint(hIndex, pIndex, sIndex, ssIndex, updatedValue);
                                                                                    setTimeout(() => {
                                                                                        e.target.selectionStart = e.target.selectionEnd = start + 1;
                                                                                    }, 0);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <p className="mb-1 mb-md-2 small" style={{ whiteSpace: 'pre-wrap' }}>{ss.text}</p>
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
                    ))}

                    {(editMode || !hasData) && (
                        <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 mb-md-5">
                            <button className="btn btn-sm btn-success" onClick={handleSubmit}>
                                {token?.Role !== "paralegal" ? (hasData ? "Update Form" : "Submit Form") : "Submit Draft"}
                            </button>
                            {editMode && (
                                <button className="btn btn-sm btn-secondary" onClick={() => setEditMode(!editMode)}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    )}

                    <ConfirmModal
                        show={showComfirmModel}
                        title="Delete Heading"
                        message="Are you sure you want to delete this heading?"
                        onConfirm={removeHeading}
                        onCancel={handleCancel}
                    />
                </div>
            </LocalizationProvider>
        </div>

    );
};

export default MOMEditor;