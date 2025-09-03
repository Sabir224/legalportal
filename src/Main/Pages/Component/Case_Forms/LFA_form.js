// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { ApiEndPoint } from '../utils/utlis';
// import { useSelector } from 'react-redux';
// import ConfirmModal from '../../AlertModels/ConfirmModal';
// import { useAlert } from '../../../../Component/AlertContext';
// import Form_SignaturePad from './Form_Componets/SignaturePad';
// import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
// import { Dropdown, Form, InputGroup } from "react-bootstrap";
// import CEEditable from './CEEditable';
// import { v4 as uuidv4 } from "uuid";

// const LEA_Form = ({ token }) => {
//     const caseInfo = useSelector((state) => state.screen.Caseinfo);
//     const { showDataLoading } = useAlert();

//     const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
//     const [getDrafts, setGetDrafts] = useState(null);

//     // NEW: force remount key for contentEditable sections
//     const [draftKey, setDraftKey] = useState(0);

//     useEffect(() => {
//         FetchLFA();
//     }, []);

//     const [agreement, setAgreement] = useState({
//         fixedParts: [
//             'This Agreement ("Agreement") is entered into and shall become effective as of ',
//             ', by and between:\n\n',
//             ', with its principal place of business located at ',
//             ', represented herein by ',
//             ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
//             ' a national of ',
//             ', with their principal place of residence located ',
//             ' issued on: ',
//             ', having email ID: ',
//             ' and Contact Number: ',
//             ' (Hereinafter referred to as the "Client")'
//         ],
//         editableValues: [
//             new Date().toLocaleDateString('en-GB'),
//             'M/s AWS Legal Consultancy FZ-LLC',
//             '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
//             'Mr Aws M. Younis, Chairman',
//             'Dr. Ali Moustafa Mohamed Elba',
//             'Egypt',
//             'Dubai, United Arab Emirates',
//             'holding Emirates ID Number: ',
//             '784-1952-3620694-4',
//             new Date().toLocaleDateString('en-GB'),
//             'alyelba@yahoo.com',
//             '+971521356931'
//         ]
//     });

//     const [fixedHeadings, setFixedHeadings] = useState([
//         { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
//         { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
//     ]);

//     const [headings, setHeadings] = useState([]);

//     const [savedSignature, setSavedSignature] = useState(null);
//     const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
//     const [isFormFilled, setisFormFilled] = useState(false);
//     const [savedClientSignature, setSavedClientSignature] = useState(null);
//     const [isLocalSign, setIsLocalSign] = useState(false);
//     const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
//     const [dataList, setDataList] = useState([]);
//     const isclient = token?.Role === "client";

//     const FetchLFA = async () => {
//         showDataLoading(true);
//         try {
//             const response = await fetch(`${ApiEndPoint}getLFAForm/${caseInfo?._id}`);
//             if (!response.ok) {
//                 showDataLoading(false);
//                 throw new Error('Error fetching LFA');
//             }
//             const data = await response.json();
//             showDataLoading(false);

//             setAgreement(data.data.agreement);
//             setDataList(data.data);
//             setFixedHeadings(data.data.fixedHeadings);
//             setHeadings(data.data.headings);
//             setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
//             setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
//             setEditMode(false);
//             setisFormFilled(true);
//             setIsLocalSign(!!data.data?.ClientSignatureImage);
//             setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
//             setSavedLawyerSignature();

//             // ensure UI refreshes on initial fetch too
//             setDraftKey((k) => k + 1);
//         } catch (err) {
//             showDataLoading(false);
//         }

//         try {
//             const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
//             if (!response.ok) {
//                 showDataLoading(false);
//                 throw new Error('Error fetching LFA');
//             }
//             const data = await response.json();
//             setGetDrafts(data);
//         } catch (err) {
//             showDataLoading(false);
//         }
//     };

//     const handleSignatureSave = (dataUrl) => {
//         setSavedSignature(dataUrl);
//         setSavedLawyerSignature(dataUrl);
//         setIsLocalLawyerSign(true);
//     };

//     const handleClientSignatureSave = (dataUrl) => {
//         setSavedClientSignature(dataUrl);
//     };

//     const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

//     const handleEditableChange = (index, newValue) => {
//         const updated = [...agreement.editableValues];
//         updated[index] = newValue;
//         setAgreement({ ...agreement, editableValues: updated });
//     };

//     function base64ToFile(base64String, filename) {
//         const arr = base64String.split(",");
//         const mime = arr[0].match(/:(.*?);/)[1];
//         const bstr = atob(arr[1]);
//         let n = bstr.length;
//         const u8arr = new Uint8Array(n);
//         while (n--) {
//             u8arr[n] = bstr.charCodeAt(n);
//         }
//         return new File([u8arr], filename, { type: mime });
//     }

//     const handleClientSubmit = async () => {
//         try {
//             const formData = new FormData();
//             formData.append("caseId", caseInfo?._id || "");
//             formData.append("Islawyer", false);

//             formData.append(
//                 "agreement",
//                 JSON.stringify({
//                     fixedParts: agreement?.fixedParts,
//                     editableValues: agreement?.editableValues
//                 })
//             );

//             const formattedHeadings = fixedHeadings?.map(h => ({
//                 title: h.title,
//                 points: h.points?.map(p => ({
//                     text: p.text || "",
//                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
//                 }))
//             }));

//             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
//             formData.append("headings", JSON.stringify(headings));

//             if (savedClientSignature) {
//                 const file = base64ToFile(savedClientSignature, "client-signature.png");
//                 formData.append("file", file);
//             }

//             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
//                 method: "POST",
//                 body: formData
//             });

//             const data = await res.json();
//             if (data.success) {
//                 setEditMode(false);
//                 setIsLocalSign(true);
//             } else {
//                 console.error("❌ Failed:", data.message);
//             }
//         } catch (err) {
//             console.error("Error submitting form:", err);
//         }
//     };

//     const handleLawyerSubmit = async () => {


//         console.log(fixedHeadings)
//         try {
//             const formData = new FormData();
//             formData.append("caseId", caseInfo?._id || "");
//             formData.append("Islawyer", true);

//             formData.append(
//                 "agreement",
//                 JSON.stringify({
//                     fixedParts: agreement.fixedParts,
//                     editableValues: agreement.editableValues
//                 })
//             );

//             const formattedHeadings = fixedHeadings?.map(h => ({
//                 title: h.title,
//                 points: h.points?.map(p => ({
//                     text: p.text || "",
//                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
//                 }))
//             }));

//             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
//             formData.append("headings", JSON.stringify(headings));

//             // FIXED: use lawyer signature (savedSignature), not savedClientSignature
//             if (savedSignature) {
//                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
//                 formData.append("file", file);
//             }

//             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
//                 method: "POST",
//                 body: formData
//             });

//             const data = await res.json();
//             if (data.success) {
//                 setEditMode(false);
//             } else {
//                 console.error("❌ Failed:", data.message);
//             }
//         } catch (err) {
//             console.error("Error submitting form:", err);
//         }
//     };

//     const handleUpdateClientSubmit = async () => {
//         try {
//             const formData = new FormData();
//             formData.append("caseId", caseInfo?._id || "");
//             formData.append("Islawyer", false);

//             formData.append(
//                 "agreement",
//                 JSON.stringify({
//                     fixedParts: agreement?.fixedParts,
//                     editableValues: agreement?.editableValues
//                 })
//             );

//             const formattedHeadings = fixedHeadings?.map(h => ({
//                 title: h.title,
//                 points: h.points?.map(p => ({
//                     text: p.text || "",
//                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
//                 }))
//             }));

//             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
//             formData.append("headings", JSON.stringify(headings));

//             if (savedClientSignature) {
//                 const file = base64ToFile(savedClientSignature, "client-signature.png");
//                 formData.append("file", file);
//             }

//             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
//                 method: "POST",
//                 body: formData
//             });

//             const data = await res.json();
//             if (data.success) {
//                 setEditMode(false);
//             } else {
//                 console.error("❌ Failed:", data.message);
//             }
//         } catch (err) {
//             console.error("Error submitting form:", err);
//         }
//     };

//     const handleUpdateLawyerSubmit = async () => {
//         try {
//             const formData = new FormData();
//             formData.append("caseId", caseInfo?._id || "");
//             formData.append("Islawyer", !isclient);

//             formData.append(
//                 "agreement",
//                 JSON.stringify({
//                     fixedParts: agreement?.fixedParts || [],
//                     editableValues: agreement?.editableValues || {}
//                 })
//             );

//             const formattedHeadings = fixedHeadings?.map(h => ({
//                 title: h.title,
//                 points: h.points?.map(p => ({
//                     text: p.text || "",
//                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
//                 }))
//             })) || [];

//             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
//             formData.append("headings", JSON.stringify(headings || []));

//             if (!isclient && savedSignature) {
//                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
//                 formData.append("file", file);
//             }

//             if (isclient && savedClientSignature) {
//                 const file = base64ToFile(savedClientSignature, "client-signature.png");
//                 formData.append("file", file);
//             }

//             const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
//                 method: "PUT",
//                 body: formData
//             });

//             const data = await res.json();

//             if (data.success) {
//                 setEditMode(false);
//                 FetchLFA();
//             } else {
//                 console.error("❌ Failed:", data.message);
//             }
//         } catch (err) {
//             console.error("Error submitting form:", err);
//         }
//     };

//     const addHeading = () =>
//         setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

//     const updateHeadingTitle = (hIndex, value) => {
//         const updated = [...headings];
//         updated[hIndex].title = value;
//         setHeadings(updated);
//     };

//     const updatePoint = (setFn, list, hIndex, pIndex, value) => {
//         const updated = [...list];
//         updated[hIndex].points[pIndex].text = value;
//         setFn(updated);
//     };

//     const updateSubpoint = (setFn, list, hIndex, pIndex, sIndex, value) => {
//         const updated = [...list];
//         updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
//         setFn(updated);
//     };

//     const updateSubSubpoint = (setFn, list, hIndex, pIndex, sIndex, ssIndex, value) => {
//         const updated = [...list];
//         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
//         setFn(updated);
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

//     const [editHeadingIndex, setEditHeadingIndex] = useState(null);

//     const pdfRef = useRef(null);

//     const handleDownload = async () => {
//         if (!pdfRef.current) return;
//         try {
//             pdfRef.current.classList.add("pdf-mode");
//             const { default: html2pdf } = await import("html2pdf.js");
//             const opt = {
//                 margin: [12, 15, 12, 15],
//                 filename: "Legal_Fee_Agreement.pdf",
//                 image: { type: "jpeg", quality: 0.98 },
//                 html2canvas: { scale: 2.2, useCORS: true, scrollY: 0 },
//                 jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//                 pagebreak: { mode: ["css", "legacy"] },
//             };
//             await html2pdf().set(opt).from(pdfRef.current).save();
//         } catch (e) {
//             console.error("PDF generation failed:", e);
//             alert("Sorry, unable to generate PDF. Check console for details.");
//         } finally {
//             pdfRef.current.classList.remove("pdf-mode");
//         }
//     };

//     // UPDATED: selecting a draft now forces a clean remount & syncs signatures
//     const handlePickDraft = (data) => {
//         setAgreement(data.agreement);
//         setFixedHeadings(data.fixedHeadings);
//         setHeadings(data.headings);
//         setSelectedDrafts(data);
//         // setSavedClientSignature(data?.ClientSignatureImage || "");
//         // setSavedSignature(data?.LawyerSignatureImage || "");
//         //  setEditMode(true);
//         setDraftKey((k) => k + 1); // force remount
//     };



//     // const renderHeadings = (list, setFn, isFixed = false) => {
//     //     // === helpers: insert/delete right AFTER current index ===

//     //     const deleteHeading = (index) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = Array.isArray(prev) ? [...prev] : [];
//     //             if (index < 0 || index >= updated.length) return prev;
//     //             updated.splice(index, 1);
//     //             return updated;
//     //         });
//     //     };

//     //     const addHeadingAfter = (hIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = Array.isArray(prev) ? [...prev] : [];
//     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
//     //             updated.splice(hIndex + 1, 0, newHeading);
//     //             return updated;
//     //         });
//     //     };

//     //     const addPointAfter = (hIndex, pIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = [...prev];
//     //             const heading = updated[hIndex];
//     //             if (!heading) return prev;

//     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
//     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
//     //             updated[hIndex] = { ...heading, points: pts };
//     //             return updated;
//     //         });
//     //     };

//     //     const deletePoint = (hIndex, pIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = [...prev];
//     //             const heading = updated[hIndex];
//     //             if (!heading) return prev;

//     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
//     //             if (pIndex < 0 || pIndex >= pts.length) return prev;

//     //             pts.splice(pIndex, 1);
//     //             updated[hIndex] = { ...heading, points: pts };
//     //             return updated;
//     //         });
//     //     };

//     //     const addPointAtEnd = (hIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = [...prev];
//     //             const heading = updated[hIndex];
//     //             if (!heading) return prev;

//     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
//     //             pts.push({ text: "", subpoints: [] });
//     //             updated[hIndex] = { ...heading, points: pts };
//     //             return updated;
//     //         });
//     //     };

//     //     return list?.map((heading, hIndex) => (
//     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
//     //             <div
//     //                 className="heading-row"
//     //                 style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}
//     //             >
//     //                 <div
//     //                     className="idx"
//     //                     style={{ width: "20px", minWidth: "10px", textAlign: "right", fontWeight: 600 }}
//     //                 >
//     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
//     //                 </div>

//     //                 <div className="form-control bg-white p-1 fw-bold" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
//     //                     {editMode && !savedClientSignature ? (
//     //                         <p
//     //                             ref={(el) => {
//     //                                 if (el && !el.innerHTML.trim()) el.innerHTML = heading.title || "\u00A0";
//     //                             }}
//     //                             contentEditable
//     //                             suppressContentEditableWarning
//     //                             onInput={(e) => {
//     //                                 const html = e.currentTarget.innerHTML;
//     //                                 const updated = [...list];
//     //                                 updated[hIndex].title = html;
//     //                                 setFn(updated);
//     //                             }}
//     //                             onKeyDown={(e) => {
//     //                                 if (e.ctrlKey && e.key.toLowerCase() === "b") {
//     //                                     e.preventDefault();
//     //                                     document.execCommand("bold");
//     //                                 }
//     //                                 if (e.key === "Tab") {
//     //                                     e.preventDefault();
//     //                                     const selection = window.getSelection();
//     //                                     if (!selection.rangeCount) return;
//     //                                     const range = selection.getRangeAt(0);
//     //                                     const tabSpaces = "\u00A0".repeat(8);
//     //                                     const spaceNode = document.createTextNode(tabSpaces);
//     //                                     range.insertNode(spaceNode);
//     //                                     range.setStartAfter(spaceNode);
//     //                                     selection.removeAllRanges();
//     //                                     selection.addRange(range);
//     //                                 }
//     //                             }}
//     //                             onBlur={(e) => {
//     //                                 if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
//     //                             }}
//     //                             style={{
//     //                                 display: "inline-block",
//     //                                 minHeight: "40px",
//     //                                 width: "100%",
//     //                                 outline: "none",
//     //                                 background: "transparent",
//     //                                 whiteSpace: "pre-wrap",
//     //                                 wordBreak: "break-word",
//     //                                 fontFamily: "inherit",
//     //                                 fontSize: "inherit",
//     //                                 fontWeight: "bold",
//     //                                 padding: "4px 6px",
//     //                                 border: "1px solid #ccc",
//     //                                 borderRadius: "4px",
//     //                                 boxSizing: "border-box",
//     //                                 textAlign: "justify",
//     //                             }}
//     //                         />
//     //                     ) : (
//     //                         <div>
//     //                             <React.Fragment key={hIndex}>
//     //                                 <span>{heading.label || ""}</span>
//     //                                 <span dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
//     //                             </React.Fragment>
//     //                         </div>
//     //                     )}
//     //                 </div>

//     //                 {/* ACTIONS: now insert AFTER current heading */}
//     //                 <div
//     //                     style={{ display: editMode && !savedClientSignature ? "flex" : "none", gap: "6px" }}
//     //                     data-html2canvas-ignore="true"
//     //                 >
//     //                     <div
//     //                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(4, 2, 2, 0.2)", cursor: "pointer" }}
//     //                         onClick={() => addHeadingAfter(hIndex)}
//     //                     >
//     //                         <BsPlus />
//     //                     </div>
//     //                     <div
//     //                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
//     //                         onClick={() => deleteHeading(hIndex)}
//     //                     >
//     //                         <BsDash />
//     //                     </div>
//     //                 </div>
//     //             </div>

//     //             <ul className="list-unstyled ps-2 ps-md-3">
//     //                 {heading.points?.map((point, pIndex) => (
//     //                     <li key={pIndex}>
//     //                         <div className="d-flex flex-wrap align-items-center mb-2">
//     //                             {editMode && !savedClientSignature ? (
//     //                                 <p
//     //                                     ref={(el) => {
//     //                                         if (el && !el.innerHTML.trim()) el.innerHTML = point.text || "\u00A0";
//     //                                     }}
//     //                                     contentEditable
//     //                                     suppressContentEditableWarning
//     //                                     onInput={(e) => {
//     //                                         const html = e.currentTarget.innerHTML;
//     //                                         const updated = [...list];
//     //                                         updated[hIndex].points[pIndex].text = html;
//     //                                         setFn(updated);
//     //                                     }}
//     //                                     onKeyDown={(e) => {
//     //                                         if (e.ctrlKey && e.key.toLowerCase() === "b") {
//     //                                             e.preventDefault();
//     //                                             document.execCommand("bold");
//     //                                         }
//     //                                         if (e.key === "Tab") {
//     //                                             e.preventDefault();
//     //                                             const selection = window.getSelection();
//     //                                             if (!selection.rangeCount) return;
//     //                                             const range = selection.getRangeAt(0);
//     //                                             const tabSpaces = "\u00A0".repeat(8);
//     //                                             const spaceNode = document.createTextNode(tabSpaces);
//     //                                             range.insertNode(spaceNode);
//     //                                             range.setStartAfter(spaceNode);
//     //                                             selection.removeAllRanges();
//     //                                             selection.addRange(range);
//     //                                         }
//     //                                     }}
//     //                                     onBlur={(e) => {
//     //                                         if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
//     //                                     }}
//     //                                     style={{
//     //                                         display: "inline-block",
//     //                                         minHeight: "40px",
//     //                                         width: "100%",
//     //                                         outline: "none",
//     //                                         background: "transparent",
//     //                                         whiteSpace: "pre-wrap",
//     //                                         wordBreak: "break-word",
//     //                                         fontFamily: "inherit",
//     //                                         fontSize: "inherit",
//     //                                         padding: "4px 6px",
//     //                                         border: "1px solid #ddd",
//     //                                         borderRadius: "4px",
//     //                                         boxSizing: "border-box",
//     //                                         textAlign: "justify",
//     //                                     }}
//     //                                 />
//     //                             ) : (
//     //                                 <div className="" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
//     //                                     <React.Fragment key={pIndex}>
//     //                                         <span>{point.label || ""}</span>
//     //                                         <span dangerouslySetInnerHTML={{ __html: point.text || "" }} />
//     //                                     </React.Fragment>
//     //                                 </div>
//     //                             )}

//     //                             {editMode && !savedClientSignature && (
//     //                                 <>
//     //                                     {/* INSERT new point AFTER current pIndex */}
//     //                                     <div
//     //                                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
//     //                                         onClick={() => addPointAfter(hIndex, pIndex)}
//     //                                         data-html2canvas-ignore="true"
//     //                                     >
//     //                                         <BsPlus />
//     //                                     </div>
//     //                                     <div
//     //                                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
//     //                                         onClick={() => deletePoint(hIndex, pIndex)}
//     //                                         data-html2canvas-ignore="true"
//     //                                     >
//     //                                         <BsDash />
//     //                                     </div>
//     //                                 </>
//     //                             )}
//     //                         </div>

//     //                         {/* subpoints UI remains same */}
//     //                         {Array.isArray(point?.subpoints) && point.subpoints.length > 0 && (
//     //                             <div style={{ margin: "4px 0 8px 0", paddingLeft: "16px", paddingRight: "16px" }}>
//     //                                 {point.subpoints.map((sp, sIndex) => {
//     //                                     const html = typeof sp === "string" ? sp : sp?.text || "";
//     //                                     return (
//     //                                         <table
//     //                                             key={sIndex}
//     //                                             style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", margin: "2px 0" }}
//     //                                         >
//     //                                             <tbody>
//     //                                                 <tr>
//     //                                                     <td style={{ width: "14px", minWidth: "14px", textAlign: "center", verticalAlign: "top" }}>
//     //                                                         •
//     //                                                     </td>
//     //                                                     <td style={{ paddingLeft: "8px", textAlign: "justify", wordBreak: "break-word" }}>
//     //                                                         <div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
//     //                                                     </td>
//     //                                                 </tr>
//     //                                             </tbody>
//     //                                         </table>
//     //                                     );
//     //                                 })}
//     //                             </div>
//     //                         )}
//     //                     </li>
//     //                 ))}

//     //                 {editMode && !savedClientSignature && (
//     //                     <li>
//     //                         <button
//     //                             type="button"
//     //                             className="btn btn-outline-primary btn-sm"
//     //                             onClick={() => addPointAtEnd(hIndex)}
//     //                             data-html2canvas-ignore="true"
//     //                         >
//     //                             + Add Point
//     //                         </button>
//     //                     </li>
//     //                 )}
//     //             </ul>
//     //         </div>
//     //     ));
//     // };




//     // const renderHeadings = (list, setFn, isFixed = false) => {
//     //     // === helpers ===
//     //     const deleteHeading = (hIndex) => {
//     //         if (!editMode) return;

//     //         setFn((prev) => {
//     //             if (!Array.isArray(prev)) return prev;

//     //             const updated = [...prev];
//     //             updated.splice(hIndex, 1); // sirf targeted heading delete
//     //             return updated;
//     //         });

//     //         // focus shifting (optional)
//     //         setTimeout(() => {
//     //             const targetIdx = Math.max(0, hIndex - 1);
//     //             const editors = document.querySelectorAll('[data-head-editor="1"]');
//     //             if (editors && editors[targetIdx]) {
//     //                 editors[targetIdx].focus();
//     //             }
//     //         }, 0);
//     //     };

//     //     const addHeadingAfter = (hIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = Array.isArray(prev) ? [...prev] : [];
//     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
//     //             updated.splice(hIndex + 1, 0, newHeading);
//     //             return updated;
//     //         });
//     //     };

//     //     const addPointAfter = (hIndex, pIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = [...prev];
//     //             const heading = updated[hIndex];
//     //             if (!heading) return prev;

//     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
//     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
//     //             updated[hIndex] = { ...heading, points: pts };
//     //             return updated;
//     //         });
//     //     };

//     //     const deletePoint = (hIndex, pIndex) => {
//     //         if (!editMode) return;

//     //         setFn((prev) => {
//     //             if (!Array.isArray(prev)) return prev;

//     //             const updated = [...prev];
//     //             const heading = updated[hIndex];
//     //             if (!heading || !Array.isArray(heading.points)) return prev;

//     //             const newPoints = [...heading.points];
//     //             newPoints.splice(pIndex, 1); // sirf targeted point delete

//     //             updated[hIndex] = { ...heading, points: newPoints };
//     //             return updated;
//     //         });
//     //     };

//     //     const addPointAtEnd = (hIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = [...prev];
//     //             const heading = updated[hIndex];
//     //             if (!heading) return prev;

//     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
//     //             pts.push({ text: "", subpoints: [] });
//     //             updated[hIndex] = { ...heading, points: pts };
//     //             return updated;
//     //         });
//     //     };

//     //     // === UI ===
//     //     return list?.map((heading, hIndex) => (
//     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
//     //             {/* Heading Title */}
//     //             <div className="heading-row" style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}>
//     //                 <div className="idx" style={{ width: "20px", textAlign: "right", fontWeight: 600 }}>
//     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
//     //                 </div>

//     //                 {editMode && !savedClientSignature ? (

//     //                     <CEEditable
//     //                         tag="h4"
//     //                         html={heading.title}
//     //                         placeholder={"\\u00A0"}
//     //                         className="form-control bg-white p-1 fw-bold"
//     //                         style={{
//     //                             whiteSpace: "pre-wrap",
//     //                             textAlign: "justify",
//     //                             display: "inline-block",
//     //                             minHeight: "40px",
//     //                             width: "100%",
//     //                             outline: "none",
//     //                             background: "transparent",
//     //                             wordBreak: "break-word",
//     //                             fontFamily: "inherit",
//     //                             fontSize: "inherit",
//     //                             fontWeight: "bold",
//     //                             padding: "4px 6px",
//     //                             border: "1px solid #ccc",
//     //                             borderRadius: "4px",
//     //                             boxSizing: "border-box",
//     //                         }}
//     //                         onChange={(newHtml) => {
//     //                             const updated = [...list];
//     //                             updated[hIndex].title = newHtml;
//     //                             setFn(updated);
//     //                         }}
//     //                         onEmpty={() => {
//     //                             // If you also want "empty = delete":
//     //                             // setFn(prev => {
//     //                             //   const next = Array.isArray(prev) ? [...prev] : [];
//     //                             //   next.splice(hIndex, 1);
//     //                             //   return next;
//     //                             // });
//     //                         }}
//     //                         data-head-editor="1"   // <— add this so we can focus after delete
//     //                     />


//     //                 ) : (
//     //                     <div className="fw-bold" style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
//     //                 )}

//     //                 {editMode && !savedClientSignature && (
//     //                     <div style={{ display: "flex", gap: "6px" }} data-html2canvas-ignore="true">
//     //                         <div style={{ color: "green", cursor: "pointer" }} onClick={() => addHeadingAfter(hIndex)}>
//     //                             <BsPlus />
//     //                         </div>
//     //                         <div style={{ color: "red", cursor: "pointer" }} onClick={() => deleteHeading(hIndex)}>
//     //                             <BsDash />
//     //                         </div>
//     //                     </div>
//     //                 )}
//     //             </div>

//     //             {/* Points */}
//     //             <ul className="list-unstyled ps-2 ps-md-3">
//     //                 {heading.points?.map((point, pIndex) => (
//     //                     <li key={pIndex}>
//     //                         <div className="d-flex align-items-center mb-2">
//     //                             {editMode && !savedClientSignature ? (
//     //                                 <p
//     //                                     contentEditable
//     //                                     suppressContentEditableWarning
//     //                                     onInput={(e) => {
//     //                                         const updated = [...list];
//     //                                         updated[hIndex].points[pIndex].text = e.currentTarget.innerHTML;
//     //                                         setFn(updated);
//     //                                     }}
//     //                                     style={{
//     //                                         minHeight: "30px",
//     //                                         width: "100%",
//     //                                         outline: "none",
//     //                                         border: "1px solid #ddd",
//     //                                         borderRadius: "4px",
//     //                                         padding: "4px 6px",
//     //                                         textAlign: "justify"
//     //                                     }}
//     //                                     dangerouslySetInnerHTML={{ __html: point.text || "" }}
//     //                                 />
//     //                             ) : (
//     //                                 <div style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: point.text || "" }} />
//     //                             )}

//     //                             {editMode && !savedClientSignature && (
//     //                                 <>
//     //                                     <div style={{ color: "green", cursor: "pointer" }} onClick={() => addPointAfter(hIndex, pIndex)}>
//     //                                         <BsPlus />
//     //                                     </div>
//     //                                     <div style={{ color: "red", cursor: "pointer" }} onClick={() => deletePoint(hIndex, pIndex)}>
//     //                                         <BsDash />
//     //                                     </div>
//     //                                 </>
//     //                             )}
//     //                         </div>
//     //                     </li>
//     //                 ))}

//     //                 {editMode && !savedClientSignature && (
//     //                     <li>
//     //                         <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => addPointAtEnd(hIndex)} data-html2canvas-ignore="true">
//     //                             + Add Point
//     //                         </button>
//     //                     </li>
//     //                 )}
//     //             </ul>
//     //         </div>
//     //     ));
//     // };




//     // const renderHeadings = (list, setFn, isFixed = false) => {
//     //     // Add Heading
//     //     const addHeadingAfter = (hIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = Array.isArray(prev) ? [...prev] : [];
//     //             const newHeading = { id: uuidv4(), title: "New Section", points: [{ id: uuidv4(), text: "", subpoints: [] }] };
//     //             updated.splice(hIndex + 1, 0, newHeading);
//     //             return updated;
//     //         });
//     //     };

//     //     // Add Point
//     //     const addPointAfter = (hIndex, pIndex) => {
//     //         if (!editMode) return;
//     //         setFn((prev) => {
//     //             const updated = [...prev];
//     //             const heading = updated[hIndex];
//     //             if (!heading) return prev;

//     //             const pts = [...(heading.points || [])];
//     //             pts.splice(pIndex + 1, 0, { id: uuidv4(), text: "", subpoints: [] });
//     //             updated[hIndex] = { ...heading, points: pts };
//     //             return updated;
//     //         });
//     //     };

//     //     // === UI ===
//     //     return list?.map((heading, hIndex) => (
//     //         <div key={heading.id} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
//     //             {/* Heading Title */}
//     //             <div className="heading-row d-flex align-items-center mb-2">
//     //                 <div className="idx fw-bold me-2">{isFixed ? hIndex + 1 : hIndex + 11}.</div>

//     //                 {editMode && !savedClientSignature ? (
//     //                     <CEEditable
//     //                         key={heading.id}   // force re-init editor
//     //                         html={heading.title}
//     //                         onChange={(newHtml) => {
//     //                             setFn((prev) => {
//     //                                 const updated = [...prev];
//     //                                 updated[hIndex].title = newHtml;
//     //                                 return updated;
//     //                             });
//     //                         }}
//     //                     />
//     //                 ) : (
//     //                     <div className="fw-bold" dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
//     //                 )}
//     //             </div>

//     //             {/* Points */}
//     //             <ul className="list-unstyled ps-3">
//     //                 {heading.points?.map((point, pIndex) => (
//     //                     <li key={point.id}>
//     //                         {editMode && !savedClientSignature ? (
//     //                             <CEEditable
//     //                                 key={point.id}   // force re-init editor
//     //                                 html={point.text}
//     //                                 onChange={(newHtml) => {
//     //                                     setFn((prev) => {
//     //                                         const updated = [...prev];
//     //                                         updated[hIndex].points[pIndex].text = newHtml;
//     //                                         return updated;
//     //                                     });
//     //                                 }}
//     //                             />
//     //                         ) : (
//     //                             <div dangerouslySetInnerHTML={{ __html: point.text || "" }} />
//     //                         )}
//     //                     </li>
//     //                 ))}
//     //             </ul>
//     //         </div>
//     //     ));
//     // };



//     // ---- renderHeadings.jsx ----


//     const renderHeadings = (list, setFn, isFixed = false) => {
//         if (!Array.isArray(list)) return null;

//         // Step 1: Array -> HTML
//         const combinedHtml = list
//             .map(
//                 (heading, hIndex) => `
//                 <p><strong><ul>${heading.title || ""}</ul></strong></p>
//                 <ul>
//                     ${(heading.points || [])
//                         .map((p) => `<li>${p.text || ""}</li>`)
//                         .join("")}
//                 </ul>
//             `
//             )
//             .join("");

//         // Step 2: HTML -> Array
//         const parseHtmlToArray = (html) => {
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(html, "text/html");
//             const sections = [];

//             let currentHeading = null;

//             doc.body.childNodes.forEach((node) => {
//                 if (node.nodeName === "P") {
//                     // extract heading text (remove numbering if any)
//                     const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
//                     currentHeading = { title: headingText, points: [] };
//                     sections.push(currentHeading);
//                 } else if (node.nodeName === "UL" && currentHeading) {
//                     const points = Array.from(node.querySelectorAll("li")).map((li) => ({
//                         text: li.innerHTML,
//                         subpoints: [],
//                     }));
//                     currentHeading.points = points;
//                 }
//             });

//             return sections;
//         };

//         return (
//             <div className="section border p-2 rounded bg-light">
//                 {editMode ? (
//                     <CEEditable
//                         list={list} // 👈 ab array directly de sakte ho
//                         onChange={(updatedList) => setFixedHeadings(updatedList)}
//                         disable={(isFormFilled && !editMode)}
//                     />
//                 ) : (
//                     <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
//                 )}
//             </div>
//         );
//     };


//     return (
//         <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
//             <style>{`
//         .word-paper { color: #000; line-height: 1.4; }
//         .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
//         .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
//         .word-paper .form-control,
//         .word-paper [contenteditable="true"],
//         .word-paper ul.sub-bullets,
//         .word-paper ul.sub-bullets li { text-align: justify; }
//         .word-paper.pdf-mode * { box-shadow: none !important; }
//         .word-paper.pdf-mode .card,
//         .word-paper.pdf-mode .form-control,
//         .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
//         .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }
//         .word-paper.pdf-mode ul,
//         .word-paper.pdf-mode ol { list-style: revert !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
//         .word-paper ul.sub-bullets { list-style-type: disc !important; list-style-position: outside !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
//         .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
//         .word-paper .list-unstyled ul.sub-bullets,
//         .word-paper .form-control ul.sub-bullets { list-style-type: disc !important; padding-left: 24px !important; }
//         @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
//       `}</style>

//             {/* toolbar */}
//             <div className="d-flex justify-content-end mb-3" data-html2canvas-ignore="true">
//                 <button
//                     className="btn btn-primary d-flex align-items-center"
//                     onClick={handleDownload}
//                     style={{ padding: "8px 16px" }}
//                     data-html2canvas-ignore="true"
//                 >
//                     <BsDownload className="me-2" />
//                     Download PDF
//                 </button>
//             </div>

//             {(!isclient || isFormFilled) ? (
//                 // IMPORTANT: key={draftKey} forces remount so new draft values appear
//                 <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey}>
//                     {/* Header */}
//                     <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
//                         <img
//                             src="logo.png"
//                             alt="Logo"
//                             className="me-2 me-md-3 mb-2 mb-md-0"
//                             style={{ height: "50px" }}
//                         />
//                         <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
//                     </div>

//                     {token?.Role !== "client" && (
//                         // <Form.Group className="mb-3">
//                         //     <Form.Label>Drafts <span className="text-danger"></span></Form.Label>
//                         //     <InputGroup>
//                         //         <Dropdown className="w-100">
//                         //             <Dropdown.Toggle
//                         //                 variant="outline-secondary"
//                         //                 id="dropdown-practice-area"
//                         //                 // ENABLED now: allow switching drafts anytime
//                         //                 className="w-100 text-start d-flex justify-content-between align-items-center"
//                         //             >
//                         //                 {selectedDrafts === "Select Draft" ? "Select Draft" : `${selectedDrafts?.CaseNumber}`}
//                         //             </Dropdown.Toggle>

//                         //             <Dropdown.Menu className="w-100">
//                         //                 {getDrafts?.map((data, index) => (
//                         //                     <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
//                         //                         {data?.CaseNumber}
//                         //                     </Dropdown.Item>
//                         //                 ))}
//                         //             </Dropdown.Menu>
//                         //         </Dropdown>
//                         //     </InputGroup>
//                         // </Form.Group>


//                         <Form.Group className="mb-3">
//                             <Form.Label>Drafts</Form.Label>

//                             <Dropdown className="w-100">
//                                 <Dropdown.Toggle
//                                     variant="outline-secondary"
//                                     disabled={isFormFilled}
//                                     id="dropdown-practice-area"
//                                     className="w-100 text-start d-flex justify-content-between align-items-center"
//                                 >
//                                     {selectedDrafts === "Select Draft"
//                                         ? "Select Draft"
//                                         : `${selectedDrafts?.CaseNumber}`}
//                                 </Dropdown.Toggle>

//                                 <Dropdown.Menu className="w-100" disabled={isFormFilled}>


//                                     {getDrafts?.map((data, index) => (
//                                         <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
//                                             {data?.CaseNumber}
//                                         </Dropdown.Item>
//                                     ))}
//                                 </Dropdown.Menu>
//                             </Dropdown>
//                         </Form.Group>

//                     )}

//                     <div className="card p-2 p-md-4 shadow-sm mb-4">
//                         <label className="form-label fw-bold fs-5 text-break">Agreement</label>
//                         {editMode && !isclient && !savedClientSignature ? (
//                             <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
//                                 {agreement?.fixedParts?.map((part, index) => (
//                                     <React.Fragment key={index}>
//                                         <span>{part}</span>
//                                         {index < agreement.editableValues.length && (
//                                             <p
//                                                 ref={(el) => {
//                                                     if (el && !el.innerHTML.trim()) {
//                                                         el.innerHTML = agreement.editableValues[index] || "\u00A0";
//                                                     }
//                                                 }}
//                                                 contentEditable
//                                                 suppressContentEditableWarning
//                                                 onInput={(e) => {
//                                                     const html = e.currentTarget.innerHTML;
//                                                     handleEditableChange(index, html);
//                                                 }}
//                                                 onKeyDown={(e) => {
//                                                     if (e.ctrlKey && e.key.toLowerCase() === "b") {
//                                                         e.preventDefault();
//                                                         document.execCommand("bold");
//                                                     }
//                                                     if (e.key === "Tab") {
//                                                         e.preventDefault();
//                                                         const selection = window.getSelection();
//                                                         if (!selection.rangeCount) return;
//                                                         const range = selection.getRangeAt(0);
//                                                         const tabSpaces = "\u00A0".repeat(8);
//                                                         const spaceNode = document.createTextNode(tabSpaces);
//                                                         range.insertNode(spaceNode);
//                                                         range.setStartAfter(spaceNode);
//                                                         selection.removeAllRanges();
//                                                         selection.addRange(range);
//                                                     }
//                                                 }}
//                                                 onBlur={(e) => {
//                                                     if (!e.currentTarget.textContent.trim()) {
//                                                         e.currentTarget.innerHTML = "\u00A0";
//                                                     }
//                                                 }}
//                                                 style={{
//                                                     display: "inline",
//                                                     minWidth: "2ch",
//                                                     maxWidth: "100%",
//                                                     outline: "none",
//                                                     background: "transparent",
//                                                     verticalAlign: "middle",
//                                                     whiteSpace: "pre-wrap",
//                                                     wordBreak: "break-word",
//                                                     fontFamily: "inherit",
//                                                     fontSize: "inherit",
//                                                     padding: "0 2px",
//                                                     boxSizing: "border-box",
//                                                     textDecoration: "underline",
//                                                     textDecorationSkipInk: "none",
//                                                     textAlign: "justify",
//                                                 }}
//                                             />
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
//                                 {agreement?.fixedParts?.map((part, index) => (
//                                     <React.Fragment key={index}>
//                                         <span>{part}</span>
//                                         {index < agreement.editableValues.length && (
//                                             <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Fixed Headings */}
//                     {renderHeadings(fixedHeadings, setFixedHeadings, true)}

//                     {/* Custom Headings */}
//                     {/* {renderHeadings(headings, setHeadings, false)} */}

//                     {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
//                         <div style={{ padding: 20 }} data-html2canvas-ignore="true">
//                             <h2>Lawyer Signature</h2>
//                             <Form_SignaturePad height={250} onSave={handleSignatureSave} />
//                         </div>
//                     )}

//                     <div style={{ padding: 20 }} data-html2canvas-ignore="true">
//                         {(isclient && !isLocalSign) && (
//                             <div>
//                                 <h2>Client Signature</h2>
//                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
//                             </div>
//                         )}
//                     </div>

//                     <div
//                         style={{
//                             display: "flex",
//                             flexDirection: "row",
//                             justifyContent: "space-between",
//                             alignItems: "flex-start",
//                             gap: "20px",
//                             width: "100%",
//                         }}
//                     >
//                         {savedSignature && (
//                             <div>
//                                 <h4>Lawyer Signature:</h4>
//                                 <img
//                                     src={savedSignature}
//                                     alt="Lawyer Signature"
//                                     style={{
//                                         maxWidth: "220px",
//                                         maxHeight: "300px",
//                                         border: "1px solid #ccc",
//                                         borderRadius: "4px",
//                                     }}
//                                 />
//                             </div>
//                         )}

//                         {savedClientSignature && (
//                             <div>
//                                 <h4>Client Signature:</h4>
//                                 <img
//                                     src={savedClientSignature}
//                                     alt="Client Signature"
//                                     style={{
//                                         maxWidth: "220px",
//                                         border: "1px solid #ccc",
//                                         borderRadius: "4px",
//                                     }}
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
//                         {(!isclient && savedClientSignature && savedLawyerSignature) && (
//                             <button
//                                 className="btn btn-sm btn-primary fw-bold"
//                                 onClick={handleUpdateLawyerSubmit}
//                                 style={{ width: "150px" }}
//                                 data-html2canvas-ignore="true"
//                             >
//                                 Save & Update Agreement
//                             </button>
//                         )}

//                         {editMode ? (
//                             <>
//                                 {(!isFormFilled && !savedClientSignature) ? (
//                                     <button
//                                         className="btn btn-sm btn-primary fw-bold"
//                                         onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
//                                         style={{ width: "150px" }}
//                                         data-html2canvas-ignore="true"
//                                     >
//                                         Save & Submit Agreement
//                                     </button>
//                                 ) : (
//                                     <button
//                                         className="btn btn-sm btn-primary fw-bold"
//                                         onClick={handleUpdateLawyerSubmit}
//                                         style={{ width: "150px" }}
//                                         data-html2canvas-ignore="true"
//                                     >
//                                         Save & Update Agreement
//                                     </button>
//                                 )}
//                             </>
//                         ) : (
//                             <>
//                                 {(isclient && !isLocalSign) && (
//                                     <button
//                                         className="btn btn-sm btn-primary fw-bold"
//                                         onClick={handleUpdateLawyerSubmit}
//                                         style={{ width: "150px" }}
//                                         data-html2canvas-ignore="true"
//                                     >
//                                         Save & Submit Signature
//                                     </button>
//                                 )}

//                                 {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
//                                     <button
//                                         className="btn btn-sm btn-primary fw-bold"
//                                         onClick={() => setEditMode(true)}
//                                         style={{ width: "150px" }}
//                                         data-html2canvas-ignore="true"
//                                     >
//                                         Edit Agreement
//                                     </button>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 </div>
//             ) : (
//                 <div className="text-center text-black py-5">No LFA Form Available.</div>
//             )}
//         </div>
//     );
// };

// export default LEA_Form;




//LFA_form 
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ApiEndPoint } from '../utils/utlis';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../AlertModels/ConfirmModal';
import { useAlert } from '../../../../Component/AlertContext';
import Form_SignaturePad from './Form_Componets/SignaturePad';
import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
import { Dropdown, Form, InputGroup } from "react-bootstrap";
import CEEditable from './CEEditable';
import { v4 as uuidv4 } from "uuid";
import {jsPDF} from "jspdf";
import logo from '../../../Pages/Images/logo.png';

const LEA_Form = ({ token }) => {   


 const [isHovered, setIsHovered] = useState(false);

const handleDownload = () => {
  const doc = new jsPDF("p", "pt", "a4");
const pageWidth = doc.internal.pageSize.getWidth(); 
const pageHeight = doc.internal.pageSize.getHeight(); 
const marginX = 80; 
const maxWidth = pageWidth - marginX * 2; 
const marginTop = 140; 
const lineHeight = 18; 

let y = marginTop;

// --- Header ---
const addHeader = () => {
  // Background
  doc.setFillColor("#1a2b42");
  doc.rect(0, 0, pageWidth, 80, "F");

  // Logo + Text (Left aligned)
  const logoWidth = 50;
  const logoHeight = 60;
  const gap = 15;

  // Text content
  const mainText = "SUHAD ALJUBOORI";
  const subText = "Advocates & Legal Consultants";

  // Start X for left side
  const startX = 70; // margin from left

  // Draw Logo
  doc.addImage(logo, "PNG", startX, 15, logoWidth, logoHeight);

  // Draw Text (to the right of logo)
  let textX = startX + logoWidth + gap;

  doc.setTextColor("#fff");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(mainText, textX, 43); // vertically aligned with logo

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(subText, textX, 57);
};


  // --- Footer ---
  const footerText =
    "P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nAbu Dhabi: 2403, Tomouh Tower, Marina Square Jazeerat Al Reem\nTel: +971 (04) 332 5928, web: aws-legalgroup.com, email: info@awsadvocates.com";

  const addFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer background
      doc.setFillColor(245, 245, 245);
      doc.rect(0, pageHeight - 70, pageWidth, 70, "F");

      // Footer text
      doc.setTextColor("#333333");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      const footerLines = doc.splitTextToSize(footerText, pageWidth - 80);
      doc.text(footerLines, pageWidth / 2, pageHeight - 50, {
        align: "center",
      });

      // Page number
      doc.setFontSize(8);
      const pageText = `Page ${i} of ${pageCount}`;
      doc.text(pageText, pageWidth - 60, pageHeight - 20);
    }
  };

  // --- Page break handler ---
  const checkPageBreak = (nextY) => {
    if (nextY > pageHeight - 100) {
      doc.addPage();
      addHeader();
      y = marginTop;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor("#333333");
    }
  };

  // --- Justified text writer ---
 // --- Justified text writer (fixed spaces) ---
const justifyText = (text) => {
  const lines = doc.splitTextToSize(text, maxWidth);

  lines.forEach((line, idx) => {
    checkPageBreak(y + lineHeight);

    if (idx === lines.length - 1 || !line.includes(" ")) {
      // Last line ya single word line -> left aligned
      doc.text(line, marginX, y);
    } else {
      // Justify line
      const words = line.split(" ");
      const spaceCount = words.length - 1;

      // Current text width without extra spacing
      const lineWidth = words.reduce(
        (sum, w) => sum + doc.getTextWidth(w),
        0
      );

      // Har space ke liye base ek space + extra adjustment
      const totalExtraSpace = maxWidth - lineWidth;
      const spaceWidth = totalExtraSpace / spaceCount;

      let cursorX = marginX;
      words.forEach((w, i) => {
        doc.text(w, cursorX, y);
        if (i < spaceCount) {
          cursorX += doc.getTextWidth(w) + spaceWidth;
        }
      });
    }
    y += lineHeight;
  });

  y += 10;
};


  // --- Draw first header ---
  addHeader();

  // --- Title ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor("#000");
  doc.text("Legal Fee Agreement", pageWidth / 2, 120, { align: "center" });


// --- Agreement heading (left aligned) ---
doc.setFont("helvetica", "bold");
doc.setFontSize(13);
doc.setTextColor("#333333");
doc.text("Agreement", marginX, 160, { align: "left" });

// ✅ Update y so that text starts below "Agreement"
y = 190;

// --- Agreement body ---
doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor("#333333");

const agreementText = agreement.fixedParts
  .map((part, i) => part + (agreement.editableValues[i] || ""))
  .join(" ");
const paragraphs = agreementText.split("\n");

paragraphs.forEach((p) => {
  if (p.trim()) justifyText(p.trim());
});

y += 30;

  // --- Section Details ---
  fixedHeadings.forEach((section) => {
    checkPageBreak(y + lineHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor("#1a2b42");
    doc.text(section.title, marginX, y);
    y += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor("#333333");

    section.points.forEach((p) => {
      justifyText("- " + (p.text || ""));
    });

    y += 10;
  });

  // --- Signatures ---
  checkPageBreak(y + 80);
  y += 30;

  doc.setFont("helvetica", "bold");
  doc.text(" ___________________", marginX, y);
  doc.text(" ___________________", pageWidth - 250, y);

  // ↓ Lawyer details
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("The Attorney", marginX + 60, y, { align: "center" });
  doc.text("SUHAD ALJUBOORI", marginX + 60, y + 15, { align: "center" });

  // ↓ Client details
  doc.text("The Client", pageWidth - 190, y, { align: "center" });
  doc.text(
     "Client Name Here",
    pageWidth - 190,
    y + 15,
    { align: "center" }
  );

  // --- Headers + Footers on all pages ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addHeader();
  }
  addFooter();

  // --- Save ---
  doc.save("Legal_Fee_Agreement.pdf");
};


    const caseInfo = useSelector((state) => state.screen.Caseinfo);
    const { showDataLoading } = useAlert();

    const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
    const [getDrafts, setGetDrafts] = useState(null);

    // NEW: force remount key for contentEditable sections
    const [draftKey, setDraftKey] = useState(0);

    useEffect(() => {
        FetchLFA();
    }, []);

    const [agreement, setAgreement] = useState({
        fixedParts: [
            'This Agreement ("Agreement") is entered into and shall become effective as of ',
            ', by and between:\n\n',
            ', with its principal place of business located at ',
            ', represented herein by ',
            ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
            ' a national of ',
            ', with their principal place of residence located ',
            ' issued on: ',
            ', having email ID: ',
            ' and Contact Number: ',
            ' (Hereinafter referred to as the "Client")'
        ],
        editableValues: [
            new Date().toLocaleDateString('en-GB'),
            'M/s AWS Legal Consultancy FZ-LLC',
            '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
            'Mr Aws M. Younis, Chairman',
            'Dr. Ali Moustafa Mohamed Elba',
            'Egypt',
            'Dubai, United Arab Emirates',
            'holding Emirates ID Number: ',
            '784-1952-3620694-4',
            new Date().toLocaleDateString('en-GB'),
            'alyelba@yahoo.com',
            '+971521356931'
        ]
    });

    const [fixedHeadings, setFixedHeadings] = useState([
        { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
    ]);

    const [headings, setHeadings] = useState([]);

    const [savedSignature, setSavedSignature] = useState(null);
    const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
    const [isFormFilled, setisFormFilled] = useState(false);
    const [savedClientSignature, setSavedClientSignature] = useState(null);
    const [isLocalSign, setIsLocalSign] = useState(false);
    const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
    const [dataList, setDataList] = useState([]);
    const isclient = token?.Role === "client";

    const FetchLFA = async () => {
        showDataLoading(true);
        try {
            const response = await fetch(`${ApiEndPoint}getLFAForm/${caseInfo?._id}`);
            if (!response.ok) {
                showDataLoading(false);
                throw new Error('Error fetching LFA');
            }
            const data = await response.json();
            showDataLoading(false);

            setAgreement(data.data.agreement);
            setDataList(data.data);
            setFixedHeadings(data.data.fixedHeadings);
            setHeadings(data.data.headings);
            setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
            setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
            setEditMode(false);
            setisFormFilled(true);
            setIsLocalSign(!!data.data?.ClientSignatureImage);
            setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
            setSavedLawyerSignature();

            // ensure UI refreshes on initial fetch too
            setDraftKey((k) => k + 1);
        } catch (err) {
            showDataLoading(false);
        }

        try {
            const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
            if (!response.ok) {
                showDataLoading(false);
                throw new Error('Error fetching LFA');
            }
            const data = await response.json();
            setGetDrafts(data);
        } catch (err) {
            showDataLoading(false);
        }
    };

    const handleSignatureSave = (dataUrl) => {
        setSavedSignature(dataUrl);
        setSavedLawyerSignature(dataUrl);
        setIsLocalLawyerSign(true);
    };

    const handleClientSignatureSave = (dataUrl) => {
        setSavedClientSignature(dataUrl);
    };

    const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

    const handleEditableChange = (index, newValue) => {
        const updated = [...agreement.editableValues];
        updated[index] = newValue;
        setAgreement({ ...agreement, editableValues: updated });
    };

    function base64ToFile(base64String, filename) {
        const arr = base64String.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const handleClientSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", false);

            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement?.fixedParts,
                    editableValues: agreement?.editableValues
                })
            );

            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
            formData.append("headings", JSON.stringify(headings));

            if (savedClientSignature) {
                const file = base64ToFile(savedClientSignature, "client-signature.png");
                formData.append("file", file);
            }

            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
                setIsLocalSign(true);
            } else {
                console.error("❌ Failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleLawyerSubmit = async () => {


        console.log(fixedHeadings)
        try {
            const formData = new FormData();
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", true);

            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement.fixedParts,
                    editableValues: agreement.editableValues
                })
            );

            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
            formData.append("headings", JSON.stringify(headings));

            // FIXED: use lawyer signature (savedSignature), not savedClientSignature
            if (savedSignature) {
                const file = base64ToFile(savedSignature, "lawyer-signature.png");
                formData.append("file", file);
            }

            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
            } else {
                console.error("❌ Failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleUpdateClientSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", false);

            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement?.fixedParts,
                    editableValues: agreement?.editableValues
                })
            );

            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
            formData.append("headings", JSON.stringify(headings));

            if (savedClientSignature) {
                const file = base64ToFile(savedClientSignature, "client-signature.png");
                formData.append("file", file);
            }

            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
            } else {
                console.error("❌ Failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleUpdateLawyerSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", !isclient);

            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement?.fixedParts || [],
                    editableValues: agreement?.editableValues || {}
                })
            );

            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                }))
            })) || [];

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
            formData.append("headings", JSON.stringify(headings || []));

            if (!isclient && savedSignature) {
                const file = base64ToFile(savedSignature, "lawyer-signature.png");
                formData.append("file", file);
            }

            if (isclient && savedClientSignature) {
                const file = base64ToFile(savedClientSignature, "client-signature.png");
                formData.append("file", file);
            }

            const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
                method: "PUT",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                setEditMode(false);
                FetchLFA();
            } else {
                console.error("❌ Failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

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

    const [editHeadingIndex, setEditHeadingIndex] = useState(null);

    const pdfRef = useRef(null);

    // REMOVED: handleDownload function completely

    // UPDATED: selecting a draft now forces a clean remount & syncs signatures
    const handlePickDraft = (data) => {
        setAgreement(data.agreement);
        setFixedHeadings(data.fixedHeadings);
        setHeadings(data.headings);
        setSelectedDrafts(data);
        // setSavedClientSignature(data?.ClientSignatureImage || "");
        // setSavedSignature(data?.LawyerSignatureImage || "");
        //  setEditMode(true);
        setDraftKey((k) => k + 1); // force remount
    };

    // ---- renderHeadings.jsx ----


    const renderHeadings = (list, setFn, isFixed = false) => {
        if (!Array.isArray(list)) return null;

        // Step 1: Array -> HTML
        const combinedHtml = list
            .map(
                (heading, hIndex) => `
                <p><strong><ul>${heading.title || ""}</ul></strong></p>
                <ul>
                    ${(heading.points || [])
                        .map((p) => `<li>${p.text || ""}</li>`)
                        .join("")}
                </ul>
            `
            )
            .join("");

        // Step 2: HTML -> Array
        const parseHtmlToArray = (html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const sections = [];

            let currentHeading = null;

            doc.body.childNodes.forEach((node) => {
                if (node.nodeName === "P") {
                    // extract heading text (remove numbering if any)
                    const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
                    currentHeading = { title: headingText, points: [] };
                    sections.push(currentHeading);
                } else if (node.nodeName === "UL" && currentHeading) {
                    const points = Array.from(node.querySelectorAll("li")).map((li) => ({
                        text: li.innerHTML,
                        subpoints: [],
                    }));
                    currentHeading.points = points;
                }
            });

            return sections;
        };

        return (
            <div className="section border p-2 rounded bg-light">
                {editMode ? (
                    <CEEditable
                        list={list} // 👈 ab array directly de sakte ho
                        onChange={(updatedList) => setFixedHeadings(updatedList)}
                        disable={(isFormFilled && !editMode)}
                    />
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
                )}
            </div>
        );
    };


    return (
        <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
            <style>{`
        .word-paper { color: #000; line-height: 1.4; }
        .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
        .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
        .word-paper .form-control,
        .word-paper [contenteditable="true"],
        .word-paper ul.sub-bullets,
        .word-paper ul.sub-bullets li { text-align: justify; }
        .word-paper.pdf-mode * { box-shadow: none !important; }
        .word-paper.pdf-mode .card,
        .word-paper.pdf-mode .form-control,
        .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
        .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }
        .word-paper.pdf-mode ul,
        .word-paper.pdf-mode ol { list-style: revert !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
        .word-paper ul.sub-bullets { list-style-type: disc !important; list-style-position: outside !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
        .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
        .word-paper .list-unstyled ul.sub-bullets,
        .word-paper .form-control ul.sub-bullets { list-style-type: disc !important; padding-left: 24px !important; }
        @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
      `}</style>

            {/* toolbar - REMOVED: Download PDF functionality */}
          <div className="d-flex justify-content-end mb-3" data-html2canvas-ignore="true">
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={handleDownload}
                    style={{ padding: "8px 16px" }}
                    data-html2canvas-ignore="true"
                >
                    <BsDownload className="me-2" />
                    Download PDF
                </button>
            </div>

            {(!isclient || isFormFilled) ? (
                // IMPORTANT: key={draftKey} forces remount so new draft values appear
                <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey}>
                    {/* Header */}
                    <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
                        <img
                            src="logo.png"
                            alt="Logo"
                            className="me-2 me-md-3 mb-2 mb-md-0"
                            style={{ height: "50px" }}
                        />
                        <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
                    </div>

                    {token?.Role !== "client" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Drafts</Form.Label>

                            <Dropdown className="w-100">
                                <Dropdown.Toggle
                                    variant="outline-secondary"
                                    disabled={isFormFilled}
                                    id="dropdown-practice-area"
                                    className="w-100 text-start d-flex justify-content-between align-items-center"
                                >
                                    {selectedDrafts === "Select Draft"
                                        ? "Select Draft"
                                        : `${selectedDrafts?.CaseNumber}`}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="w-100" disabled={isFormFilled}>


                                    {getDrafts?.map((data, index) => (
                                        <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
                                            {data?.CaseNumber}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                    )}

                    <div className="card p-2 p-md-4 shadow-sm mb-4">
                        <label className="form-label fw-bold fs-5 text-break">Agreement</label>
                        {editMode && !isclient && !savedClientSignature ? (
                            <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
                                {agreement?.fixedParts?.map((part, index) => (
                                    <React.Fragment key={index}>
                                        <span>{part}</span>
                                        {index < agreement.editableValues.length && (
                                            <p
                                                ref={(el) => {
                                                    if (el && !el.innerHTML.trim()) {
                                                        el.innerHTML = agreement.editableValues[index] || "\u00A0";
                                                    }
                                                }}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={(e) => {
                                                    const html = e.currentTarget.innerHTML;
                                                    handleEditableChange(index, html);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.ctrlKey && e.key.toLowerCase() === "b") {
                                                        e.preventDefault();
                                                        document.execCommand("bold");
                                                    }
                                                    if (e.key === "Tab") {
                                                        e.preventDefault();
                                                        const selection = window.getSelection();
                                                        if (!selection.rangeCount) return;
                                                        const range = selection.getRangeAt(0);
                                                        const tabSpaces = "\u00A0".repeat(8);
                                                        const spaceNode = document.createTextNode(tabSpaces);
                                                        range.insertNode(spaceNode);
                                                        range.setStartAfter(spaceNode);
                                                        selection.removeAllRanges();
                                                        selection.addRange(range);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (!e.currentTarget.textContent.trim()) {
                                                        e.currentTarget.innerHTML = "\u00A0";
                                                    }
                                                }}
                                                style={{
                                                    display: "inline",
                                                    minWidth: "2ch",
                                                    maxWidth: "100%",
                                                    outline: "none",
                                                    background: "transparent",
                                                    verticalAlign: "middle",
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                    fontFamily: "inherit",
                                                    fontSize: "inherit",
                                                    padding: "0 2px",
                                                    boxSizing: "border-box",
                                                    textDecoration: "underline",
                                                    textDecorationSkipInk: "none",
                                                    textAlign: "justify",
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
                                {agreement?.fixedParts?.map((part, index) => (
                                    <React.Fragment key={index}>
                                        <span>{part}</span>
                                        {index < agreement.editableValues.length && (
                                            <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Fixed Headings */}
                    {renderHeadings(fixedHeadings, setFixedHeadings, true)}

                    {/* Custom Headings */}
                    {/* {renderHeadings(headings, setHeadings, false)} */}

                    {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
                        <div style={{ padding: 20 }} data-html2canvas-ignore="true">
                            <h2>Lawyer Signature</h2>
                            <Form_SignaturePad height={250} onSave={handleSignatureSave} />
                        </div>
                    )}

                    <div style={{ padding: 20 }} data-html2canvas-ignore="true">
                        {(isclient && !isLocalSign) && (
                            <div>
                                <h2>Client Signature</h2>
                                <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "20px",
                            width: "100%",
                        }}
                    >
                        {savedSignature && (
                            <div>
                                <h4>Lawyer Signature:</h4>
                                <img
                                    src={savedSignature}
                                    alt="Lawyer Signature"
                                    style={{
                                        maxWidth: "220px",
                                        maxHeight: "300px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                        )}

                        {savedClientSignature && (
                            <div>
                                <h4>Client Signature:</h4>
                                <img
                                    src={savedClientSignature}
                                    alt="Client Signature"
                                    style={{
                                        maxWidth: "220px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
                        {(!isclient && savedClientSignature && savedLawyerSignature) && (
                            <button
                                className="btn btn-sm btn-primary fw-bold"
                                onClick={handleUpdateLawyerSubmit}
                                style={{ width: "150px" }}
                                data-html2canvas-ignore="true"
                            >
                                Save & Update Agreement
                            </button>
                        )}

                        {editMode ? (
                            <>
                                {(!isFormFilled && !savedClientSignature) ? (
                                    <button
                                        className="btn btn-sm btn-primary fw-bold"
                                        onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
                                        style={{ width: "150px" }}
                                        data-html2canvas-ignore="true"
                                    >
                                        Save & Submit Agreement
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-sm btn-primary fw-bold"
                                        onClick={handleUpdateLawyerSubmit}
                                        style={{ width: "150px" }}
                                        data-html2canvas-ignore="true"
                                    >
                                        Save & Update Agreement
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                {(isclient && !isLocalSign) && (
                                    <button
                                        className="btn btn-sm btn-primary fw-bold"
                                        onClick={handleUpdateLawyerSubmit}
                                        style={{ width: "150px" }}
                                        data-html2canvas-ignore="true"
                                    >
                                        Save & Submit Signature
                                    </button>
                                )}

                                {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
                                    <button
                                        className="btn btn-sm btn-primary fw-bold"
                                        onClick={() => setEditMode(true)}
                                        style={{ width: "150px" }}
                                        data-html2canvas-ignore="true"
                                    >
                                        Edit Agreement
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center text-black py-5">No LFA Form Available.</div>
            )}
        </div>
    );
};

export default LEA_Form;