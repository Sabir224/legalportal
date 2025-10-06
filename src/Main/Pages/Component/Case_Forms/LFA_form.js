// // // // import React, { useEffect, useState, useRef } from 'react';
// // // // import axios from 'axios';
// // // // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // // // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // // // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // // // import { ApiEndPoint } from '../utils/utlis';
// // // // import { useSelector } from 'react-redux';
// // // // import ConfirmModal from '../../AlertModels/ConfirmModal';
// // // // import { useAlert } from '../../../../Component/AlertContext';
// // // // import Form_SignaturePad from './Form_Componets/SignaturePad';
// // // // import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
// // // // import { Dropdown, Form, InputGroup } from "react-bootstrap";
// // // // import CEEditable from './CEEditable';
// // // // import { v4 as uuidv4 } from "uuid";

// // // // const LEA_Form = ({ token }) => {
// // // //     const caseInfo = useSelector((state) => state.screen.Caseinfo);
// // // //     const { showDataLoading } = useAlert();

// // // //     const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
// // // //     const [getDrafts, setGetDrafts] = useState(null);

// // // //     // NEW: force remount key for contentEditable sections
// // // //     const [draftKey, setDraftKey] = useState(0);

// // // //     useEffect(() => {
// // // //         FetchLFA();
// // // //     }, []);

// // // //     const [agreement, setAgreement] = useState({
// // // //         fixedParts: [
// // // //             'This Agreement ("Agreement") is entered into and shall become effective as of ',
// // // //             ', by and between:\n\n',
// // // //             ', with its principal place of business located at ',
// // // //             ', represented herein by ',
// // // //             ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
// // // //             ' a national of ',
// // // //             ', with their principal place of residence located ',
// // // //             ' issued on: ',
// // // //             ', having email ID: ',
// // // //             ' and Contact Number: ',
// // // //             ' (Hereinafter referred to as the "Client")'
// // // //         ],
// // // //         editableValues: [
// // // //             new Date().toLocaleDateString('en-GB'),
// // // //             'M/s AWS Legal Consultancy FZ-LLC',
// // // //             '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
// // // //             'Mr Aws M. Younis, Chairman',
// // // //             'Dr. Ali Moustafa Mohamed Elba',
// // // //             'Egypt',
// // // //             'Dubai, United Arab Emirates',
// // // //             'holding Emirates ID Number: ',
// // // //             '784-1952-3620694-4',
// // // //             new Date().toLocaleDateString('en-GB'),
// // // //             'alyelba@yahoo.com',
// // // //             '+971521356931'
// // // //         ]
// // // //     });

// // // //     const [fixedHeadings, setFixedHeadings] = useState([
// // // //         { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
// // // //         { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
// // // //     ]);

// // // //     const [headings, setHeadings] = useState([]);

// // // //     const [savedSignature, setSavedSignature] = useState(null);
// // // //     const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
// // // //     const [isFormFilled, setisFormFilled] = useState(false);
// // // //     const [savedClientSignature, setSavedClientSignature] = useState(null);
// // // //     const [isLocalSign, setIsLocalSign] = useState(false);
// // // //     const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
// // // //     const [dataList, setDataList] = useState([]);
// // // //     const isclient = token?.Role === "client";

// // // //     const FetchLFA = async () => {
// // // //         showDataLoading(true);
// // // //         try {
// // // //             const response = await fetch(`${ApiEndPoint}getLFAForm/${caseInfo?._id}`);
// // // //             if (!response.ok) {
// // // //                 showDataLoading(false);
// // // //                 throw new Error('Error fetching LFA');
// // // //             }
// // // //             const data = await response.json();
// // // //             showDataLoading(false);

// // // //             setAgreement(data.data.agreement);
// // // //             setDataList(data.data);
// // // //             setFixedHeadings(data.data.fixedHeadings);
// // // //             setHeadings(data.data.headings);
// // // //             setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
// // // //             setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
// // // //             setEditMode(false);
// // // //             setisFormFilled(true);
// // // //             setIsLocalSign(!!data.data?.ClientSignatureImage);
// // // //             setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
// // // //             setSavedLawyerSignature();

// // // //             // ensure UI refreshes on initial fetch too
// // // //             setDraftKey((k) => k + 1);
// // // //         } catch (err) {
// // // //             showDataLoading(false);
// // // //         }

// // // //         try {
// // // //             const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
// // // //             if (!response.ok) {
// // // //                 showDataLoading(false);
// // // //                 throw new Error('Error fetching LFA');
// // // //             }
// // // //             const data = await response.json();
// // // //             setGetDrafts(data);
// // // //         } catch (err) {
// // // //             showDataLoading(false);
// // // //         }
// // // //     };

// // // //     const handleSignatureSave = (dataUrl) => {
// // // //         setSavedSignature(dataUrl);
// // // //         setSavedLawyerSignature(dataUrl);
// // // //         setIsLocalLawyerSign(true);
// // // //     };

// // // //     const handleClientSignatureSave = (dataUrl) => {
// // // //         setSavedClientSignature(dataUrl);
// // // //     };

// // // //     const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

// // // //     const handleEditableChange = (index, newValue) => {
// // // //         const updated = [...agreement.editableValues];
// // // //         updated[index] = newValue;
// // // //         setAgreement({ ...agreement, editableValues: updated });
// // // //     };

// // // //     function base64ToFile(base64String, filename) {
// // // //         const arr = base64String.split(",");
// // // //         const mime = arr[0].match(/:(.*?);/)[1];
// // // //         const bstr = atob(arr[1]);
// // // //         let n = bstr.length;
// // // //         const u8arr = new Uint8Array(n);
// // // //         while (n--) {
// // // //             u8arr[n] = bstr.charCodeAt(n);
// // // //         }
// // // //         return new File([u8arr], filename, { type: mime });
// // // //     }

// // // //     const handleClientSubmit = async () => {
// // // //         try {
// // // //             const formData = new FormData();
// // // //             formData.append("caseId", caseInfo?._id || "");
// // // //             formData.append("Islawyer", false);

// // // //             formData.append(
// // // //                 "agreement",
// // // //                 JSON.stringify({
// // // //                     fixedParts: agreement?.fixedParts,
// // // //                     editableValues: agreement?.editableValues
// // // //                 })
// // // //             );

// // // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // // //                 title: h.title,
// // // //                 points: h.points?.map(p => ({
// // // //                     text: p.text || "",
// // // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // // //                 }))
// // // //             }));

// // // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // // //             formData.append("headings", JSON.stringify(headings));

// // // //             if (savedClientSignature) {
// // // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // // //                 formData.append("file", file);
// // // //             }

// // // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // // //                 method: "POST",
// // // //                 body: formData
// // // //             });

// // // //             const data = await res.json();
// // // //             if (data.success) {
// // // //                 setEditMode(false);
// // // //                 setIsLocalSign(true);
// // // //             } else {
// // // //                 console.error("❌ Failed:", data.message);
// // // //             }
// // // //         } catch (err) {
// // // //             console.error("Error submitting form:", err);
// // // //         }
// // // //     };

// // // //     const handleLawyerSubmit = async () => {


// // // //         console.log(fixedHeadings)
// // // //         try {
// // // //             const formData = new FormData();
// // // //             formData.append("caseId", caseInfo?._id || "");
// // // //             formData.append("Islawyer", true);

// // // //             formData.append(
// // // //                 "agreement",
// // // //                 JSON.stringify({
// // // //                     fixedParts: agreement.fixedParts,
// // // //                     editableValues: agreement.editableValues
// // // //                 })
// // // //             );

// // // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // // //                 title: h.title,
// // // //                 points: h.points?.map(p => ({
// // // //                     text: p.text || "",
// // // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // // //                 }))
// // // //             }));

// // // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // // //             formData.append("headings", JSON.stringify(headings));

// // // //             // FIXED: use lawyer signature (savedSignature), not savedClientSignature
// // // //             if (savedSignature) {
// // // //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// // // //                 formData.append("file", file);
// // // //             }

// // // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // // //                 method: "POST",
// // // //                 body: formData
// // // //             });

// // // //             const data = await res.json();
// // // //             if (data.success) {
// // // //                 setEditMode(false);
// // // //             } else {
// // // //                 console.error("❌ Failed:", data.message);
// // // //             }
// // // //         } catch (err) {
// // // //             console.error("Error submitting form:", err);
// // // //         }
// // // //     };

// // // //     const handleUpdateClientSubmit = async () => {
// // // //         try {
// // // //             const formData = new FormData();
// // // //             formData.append("caseId", caseInfo?._id || "");
// // // //             formData.append("Islawyer", false);

// // // //             formData.append(
// // // //                 "agreement",
// // // //                 JSON.stringify({
// // // //                     fixedParts: agreement?.fixedParts,
// // // //                     editableValues: agreement?.editableValues
// // // //                 })
// // // //             );

// // // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // // //                 title: h.title,
// // // //                 points: h.points?.map(p => ({
// // // //                     text: p.text || "",
// // // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // // //                 }))
// // // //             }));

// // // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // // //             formData.append("headings", JSON.stringify(headings));

// // // //             if (savedClientSignature) {
// // // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // // //                 formData.append("file", file);
// // // //             }

// // // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // // //                 method: "POST",
// // // //                 body: formData
// // // //             });

// // // //             const data = await res.json();
// // // //             if (data.success) {
// // // //                 setEditMode(false);
// // // //             } else {
// // // //                 console.error("❌ Failed:", data.message);
// // // //             }
// // // //         } catch (err) {
// // // //             console.error("Error submitting form:", err);
// // // //         }
// // // //     };

// // // //     const handleUpdateLawyerSubmit = async () => {
// // // //         try {
// // // //             const formData = new FormData();
// // // //             formData.append("caseId", caseInfo?._id || "");
// // // //             formData.append("Islawyer", !isclient);

// // // //             formData.append(
// // // //                 "agreement",
// // // //                 JSON.stringify({
// // // //                     fixedParts: agreement?.fixedParts || [],
// // // //                     editableValues: agreement?.editableValues || {}
// // // //                 })
// // // //             );

// // // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // // //                 title: h.title,
// // // //                 points: h.points?.map(p => ({
// // // //                     text: p.text || "",
// // // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // // //                 }))
// // // //             })) || [];

// // // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // // //             formData.append("headings", JSON.stringify(headings || []));

// // // //             if (!isclient && savedSignature) {
// // // //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// // // //                 formData.append("file", file);
// // // //             }

// // // //             if (isclient && savedClientSignature) {
// // // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // // //                 formData.append("file", file);
// // // //             }

// // // //             const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
// // // //                 method: "PUT",
// // // //                 body: formData
// // // //             });

// // // //             const data = await res.json();

// // // //             if (data.success) {
// // // //                 setEditMode(false);
// // // //                 FetchLFA();
// // // //             } else {
// // // //                 console.error("❌ Failed:", data.message);
// // // //             }
// // // //         } catch (err) {
// // // //             console.error("Error submitting form:", err);
// // // //         }
// // // //     };

// // // //     const addHeading = () =>
// // // //         setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

// // // //     const updateHeadingTitle = (hIndex, value) => {
// // // //         const updated = [...headings];
// // // //         updated[hIndex].title = value;
// // // //         setHeadings(updated);
// // // //     };

// // // //     const updatePoint = (setFn, list, hIndex, pIndex, value) => {
// // // //         const updated = [...list];
// // // //         updated[hIndex].points[pIndex].text = value;
// // // //         setFn(updated);
// // // //     };

// // // //     const updateSubpoint = (setFn, list, hIndex, pIndex, sIndex, value) => {
// // // //         const updated = [...list];
// // // //         updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
// // // //         setFn(updated);
// // // //     };

// // // //     const updateSubSubpoint = (setFn, list, hIndex, pIndex, sIndex, ssIndex, value) => {
// // // //         const updated = [...list];
// // // //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
// // // //         setFn(updated);
// // // //     };

// // // //     const removePoint = (hIndex, pIndex) => {
// // // //         const updated = [...headings];
// // // //         updated[hIndex].points.splice(pIndex, 1);
// // // //         setHeadings(updated);
// // // //     };

// // // //     const removeSubpoint = (hIndex, pIndex, sIndex) => {
// // // //         const updated = [...headings];
// // // //         updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
// // // //         setHeadings(updated);
// // // //     };

// // // //     const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
// // // //         const updated = [...headings];
// // // //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
// // // //         setHeadings(updated);
// // // //     };

// // // //     const [editHeadingIndex, setEditHeadingIndex] = useState(null);

// // // //     const pdfRef = useRef(null);

// // // //     const handleDownload = async () => {
// // // //         if (!pdfRef.current) return;
// // // //         try {
// // // //             pdfRef.current.classList.add("pdf-mode");
// // // //             const { default: html2pdf } = await import("html2pdf.js");
// // // //             const opt = {
// // // //                 margin: [12, 15, 12, 15],
// // // //                 filename: "Legal_Fee_Agreement.pdf",
// // // //                 image: { type: "jpeg", quality: 0.98 },
// // // //                 html2canvas: { scale: 2.2, useCORS: true, scrollY: 0 },
// // // //                 jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
// // // //                 pagebreak: { mode: ["css", "legacy"] },
// // // //             };
// // // //             await html2pdf().set(opt).from(pdfRef.current).save();
// // // //         } catch (e) {
// // // //             console.error("PDF generation failed:", e);
// // // //             alert("Sorry, unable to generate PDF. Check console for details.");
// // // //         } finally {
// // // //             pdfRef.current.classList.remove("pdf-mode");
// // // //         }
// // // //     };

// // // //     // UPDATED: selecting a draft now forces a clean remount & syncs signatures
// // // //     const handlePickDraft = (data) => {
// // // //         setAgreement(data.agreement);
// // // //         setFixedHeadings(data.fixedHeadings);
// // // //         setHeadings(data.headings);
// // // //         setSelectedDrafts(data);
// // // //         // setSavedClientSignature(data?.ClientSignatureImage || "");
// // // //         // setSavedSignature(data?.LawyerSignatureImage || "");
// // // //         //  setEditMode(true);
// // // //         setDraftKey((k) => k + 1); // force remount
// // // //     };



// // // //     // const renderHeadings = (list, setFn, isFixed = false) => {
// // // //     //     // === helpers: insert/delete right AFTER current index ===

// // // //     //     const deleteHeading = (index) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// // // //     //             if (index < 0 || index >= updated.length) return prev;
// // // //     //             updated.splice(index, 1);
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     const addHeadingAfter = (hIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// // // //     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
// // // //     //             updated.splice(hIndex + 1, 0, newHeading);
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     const addPointAfter = (hIndex, pIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = [...prev];
// // // //     //             const heading = updated[hIndex];
// // // //     //             if (!heading) return prev;

// // // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // // //     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
// // // //     //             updated[hIndex] = { ...heading, points: pts };
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     const deletePoint = (hIndex, pIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = [...prev];
// // // //     //             const heading = updated[hIndex];
// // // //     //             if (!heading) return prev;

// // // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // // //     //             if (pIndex < 0 || pIndex >= pts.length) return prev;

// // // //     //             pts.splice(pIndex, 1);
// // // //     //             updated[hIndex] = { ...heading, points: pts };
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     const addPointAtEnd = (hIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = [...prev];
// // // //     //             const heading = updated[hIndex];
// // // //     //             if (!heading) return prev;

// // // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // // //     //             pts.push({ text: "", subpoints: [] });
// // // //     //             updated[hIndex] = { ...heading, points: pts };
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     return list?.map((heading, hIndex) => (
// // // //     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// // // //     //             <div
// // // //     //                 className="heading-row"
// // // //     //                 style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}
// // // //     //             >
// // // //     //                 <div
// // // //     //                     className="idx"
// // // //     //                     style={{ width: "20px", minWidth: "10px", textAlign: "right", fontWeight: 600 }}
// // // //     //                 >
// // // //     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
// // // //     //                 </div>

// // // //     //                 <div className="form-control bg-white p-1 fw-bold" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
// // // //     //                     {editMode && !savedClientSignature ? (
// // // //     //                         <p
// // // //     //                             ref={(el) => {
// // // //     //                                 if (el && !el.innerHTML.trim()) el.innerHTML = heading.title || "\u00A0";
// // // //     //                             }}
// // // //     //                             contentEditable
// // // //     //                             suppressContentEditableWarning
// // // //     //                             onInput={(e) => {
// // // //     //                                 const html = e.currentTarget.innerHTML;
// // // //     //                                 const updated = [...list];
// // // //     //                                 updated[hIndex].title = html;
// // // //     //                                 setFn(updated);
// // // //     //                             }}
// // // //     //                             onKeyDown={(e) => {
// // // //     //                                 if (e.ctrlKey && e.key.toLowerCase() === "b") {
// // // //     //                                     e.preventDefault();
// // // //     //                                     document.execCommand("bold");
// // // //     //                                 }
// // // //     //                                 if (e.key === "Tab") {
// // // //     //                                     e.preventDefault();
// // // //     //                                     const selection = window.getSelection();
// // // //     //                                     if (!selection.rangeCount) return;
// // // //     //                                     const range = selection.getRangeAt(0);
// // // //     //                                     const tabSpaces = "\u00A0".repeat(8);
// // // //     //                                     const spaceNode = document.createTextNode(tabSpaces);
// // // //     //                                     range.insertNode(spaceNode);
// // // //     //                                     range.setStartAfter(spaceNode);
// // // //     //                                     selection.removeAllRanges();
// // // //     //                                     selection.addRange(range);
// // // //     //                                 }
// // // //     //                             }}
// // // //     //                             onBlur={(e) => {
// // // //     //                                 if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
// // // //     //                             }}
// // // //     //                             style={{
// // // //     //                                 display: "inline-block",
// // // //     //                                 minHeight: "40px",
// // // //     //                                 width: "100%",
// // // //     //                                 outline: "none",
// // // //     //                                 background: "transparent",
// // // //     //                                 whiteSpace: "pre-wrap",
// // // //     //                                 wordBreak: "break-word",
// // // //     //                                 fontFamily: "inherit",
// // // //     //                                 fontSize: "inherit",
// // // //     //                                 fontWeight: "bold",
// // // //     //                                 padding: "4px 6px",
// // // //     //                                 border: "1px solid #ccc",
// // // //     //                                 borderRadius: "4px",
// // // //     //                                 boxSizing: "border-box",
// // // //     //                                 textAlign: "justify",
// // // //     //                             }}
// // // //     //                         />
// // // //     //                     ) : (
// // // //     //                         <div>
// // // //     //                             <React.Fragment key={hIndex}>
// // // //     //                                 <span>{heading.label || ""}</span>
// // // //     //                                 <span dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// // // //     //                             </React.Fragment>
// // // //     //                         </div>
// // // //     //                     )}
// // // //     //                 </div>

// // // //     //                 {/* ACTIONS: now insert AFTER current heading */}
// // // //     //                 <div
// // // //     //                     style={{ display: editMode && !savedClientSignature ? "flex" : "none", gap: "6px" }}
// // // //     //                     data-html2canvas-ignore="true"
// // // //     //                 >
// // // //     //                     <div
// // // //     //                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(4, 2, 2, 0.2)", cursor: "pointer" }}
// // // //     //                         onClick={() => addHeadingAfter(hIndex)}
// // // //     //                     >
// // // //     //                         <BsPlus />
// // // //     //                     </div>
// // // //     //                     <div
// // // //     //                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// // // //     //                         onClick={() => deleteHeading(hIndex)}
// // // //     //                     >
// // // //     //                         <BsDash />
// // // //     //                     </div>
// // // //     //                 </div>
// // // //     //             </div>

// // // //     //             <ul className="list-unstyled ps-2 ps-md-3">
// // // //     //                 {heading.points?.map((point, pIndex) => (
// // // //     //                     <li key={pIndex}>
// // // //     //                         <div className="d-flex flex-wrap align-items-center mb-2">
// // // //     //                             {editMode && !savedClientSignature ? (
// // // //     //                                 <p
// // // //     //                                     ref={(el) => {
// // // //     //                                         if (el && !el.innerHTML.trim()) el.innerHTML = point.text || "\u00A0";
// // // //     //                                     }}
// // // //     //                                     contentEditable
// // // //     //                                     suppressContentEditableWarning
// // // //     //                                     onInput={(e) => {
// // // //     //                                         const html = e.currentTarget.innerHTML;
// // // //     //                                         const updated = [...list];
// // // //     //                                         updated[hIndex].points[pIndex].text = html;
// // // //     //                                         setFn(updated);
// // // //     //                                     }}
// // // //     //                                     onKeyDown={(e) => {
// // // //     //                                         if (e.ctrlKey && e.key.toLowerCase() === "b") {
// // // //     //                                             e.preventDefault();
// // // //     //                                             document.execCommand("bold");
// // // //     //                                         }
// // // //     //                                         if (e.key === "Tab") {
// // // //     //                                             e.preventDefault();
// // // //     //                                             const selection = window.getSelection();
// // // //     //                                             if (!selection.rangeCount) return;
// // // //     //                                             const range = selection.getRangeAt(0);
// // // //     //                                             const tabSpaces = "\u00A0".repeat(8);
// // // //     //                                             const spaceNode = document.createTextNode(tabSpaces);
// // // //     //                                             range.insertNode(spaceNode);
// // // //     //                                             range.setStartAfter(spaceNode);
// // // //     //                                             selection.removeAllRanges();
// // // //     //                                             selection.addRange(range);
// // // //     //                                         }
// // // //     //                                     }}
// // // //     //                                     onBlur={(e) => {
// // // //     //                                         if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
// // // //     //                                     }}
// // // //     //                                     style={{
// // // //     //                                         display: "inline-block",
// // // //     //                                         minHeight: "40px",
// // // //     //                                         width: "100%",
// // // //     //                                         outline: "none",
// // // //     //                                         background: "transparent",
// // // //     //                                         whiteSpace: "pre-wrap",
// // // //     //                                         wordBreak: "break-word",
// // // //     //                                         fontFamily: "inherit",
// // // //     //                                         fontSize: "inherit",
// // // //     //                                         padding: "4px 6px",
// // // //     //                                         border: "1px solid #ddd",
// // // //     //                                         borderRadius: "4px",
// // // //     //                                         boxSizing: "border-box",
// // // //     //                                         textAlign: "justify",
// // // //     //                                     }}
// // // //     //                                 />
// // // //     //                             ) : (
// // // //     //                                 <div className="" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
// // // //     //                                     <React.Fragment key={pIndex}>
// // // //     //                                         <span>{point.label || ""}</span>
// // // //     //                                         <span dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// // // //     //                                     </React.Fragment>
// // // //     //                                 </div>
// // // //     //                             )}

// // // //     //                             {editMode && !savedClientSignature && (
// // // //     //                                 <>
// // // //     //                                     {/* INSERT new point AFTER current pIndex */}
// // // //     //                                     <div
// // // //     //                                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// // // //     //                                         onClick={() => addPointAfter(hIndex, pIndex)}
// // // //     //                                         data-html2canvas-ignore="true"
// // // //     //                                     >
// // // //     //                                         <BsPlus />
// // // //     //                                     </div>
// // // //     //                                     <div
// // // //     //                                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// // // //     //                                         onClick={() => deletePoint(hIndex, pIndex)}
// // // //     //                                         data-html2canvas-ignore="true"
// // // //     //                                     >
// // // //     //                                         <BsDash />
// // // //     //                                     </div>
// // // //     //                                 </>
// // // //     //                             )}
// // // //     //                         </div>

// // // //     //                         {/* subpoints UI remains same */}
// // // //     //                         {Array.isArray(point?.subpoints) && point.subpoints.length > 0 && (
// // // //     //                             <div style={{ margin: "4px 0 8px 0", paddingLeft: "16px", paddingRight: "16px" }}>
// // // //     //                                 {point.subpoints.map((sp, sIndex) => {
// // // //     //                                     const html = typeof sp === "string" ? sp : sp?.text || "";
// // // //     //                                     return (
// // // //     //                                         <table
// // // //     //                                             key={sIndex}
// // // //     //                                             style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", margin: "2px 0" }}
// // // //     //                                         >
// // // //     //                                             <tbody>
// // // //     //                                                 <tr>
// // // //     //                                                     <td style={{ width: "14px", minWidth: "14px", textAlign: "center", verticalAlign: "top" }}>
// // // //     //                                                         •
// // // //     //                                                     </td>
// // // //     //                                                     <td style={{ paddingLeft: "8px", textAlign: "justify", wordBreak: "break-word" }}>
// // // //     //                                                         <div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
// // // //     //                                                     </td>
// // // //     //                                                 </tr>
// // // //     //                                             </tbody>
// // // //     //                                         </table>
// // // //     //                                     );
// // // //     //                                 })}
// // // //     //                             </div>
// // // //     //                         )}
// // // //     //                     </li>
// // // //     //                 ))}

// // // //     //                 {editMode && !savedClientSignature && (
// // // //     //                     <li>
// // // //     //                         <button
// // // //     //                             type="button"
// // // //     //                             className="btn btn-outline-primary btn-sm"
// // // //     //                             onClick={() => addPointAtEnd(hIndex)}
// // // //     //                             data-html2canvas-ignore="true"
// // // //     //                         >
// // // //     //                             + Add Point
// // // //     //                         </button>
// // // //     //                     </li>
// // // //     //                 )}
// // // //     //             </ul>
// // // //     //         </div>
// // // //     //     ));
// // // //     // };




// // // //     // const renderHeadings = (list, setFn, isFixed = false) => {
// // // //     //     // === helpers ===
// // // //     //     const deleteHeading = (hIndex) => {
// // // //     //         if (!editMode) return;

// // // //     //         setFn((prev) => {
// // // //     //             if (!Array.isArray(prev)) return prev;

// // // //     //             const updated = [...prev];
// // // //     //             updated.splice(hIndex, 1); // sirf targeted heading delete
// // // //     //             return updated;
// // // //     //         });

// // // //     //         // focus shifting (optional)
// // // //     //         setTimeout(() => {
// // // //     //             const targetIdx = Math.max(0, hIndex - 1);
// // // //     //             const editors = document.querySelectorAll('[data-head-editor="1"]');
// // // //     //             if (editors && editors[targetIdx]) {
// // // //     //                 editors[targetIdx].focus();
// // // //     //             }
// // // //     //         }, 0);
// // // //     //     };

// // // //     //     const addHeadingAfter = (hIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// // // //     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
// // // //     //             updated.splice(hIndex + 1, 0, newHeading);
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     const addPointAfter = (hIndex, pIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = [...prev];
// // // //     //             const heading = updated[hIndex];
// // // //     //             if (!heading) return prev;

// // // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // // //     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
// // // //     //             updated[hIndex] = { ...heading, points: pts };
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     const deletePoint = (hIndex, pIndex) => {
// // // //     //         if (!editMode) return;

// // // //     //         setFn((prev) => {
// // // //     //             if (!Array.isArray(prev)) return prev;

// // // //     //             const updated = [...prev];
// // // //     //             const heading = updated[hIndex];
// // // //     //             if (!heading || !Array.isArray(heading.points)) return prev;

// // // //     //             const newPoints = [...heading.points];
// // // //     //             newPoints.splice(pIndex, 1); // sirf targeted point delete

// // // //     //             updated[hIndex] = { ...heading, points: newPoints };
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     const addPointAtEnd = (hIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = [...prev];
// // // //     //             const heading = updated[hIndex];
// // // //     //             if (!heading) return prev;

// // // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // // //     //             pts.push({ text: "", subpoints: [] });
// // // //     //             updated[hIndex] = { ...heading, points: pts };
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     // === UI ===
// // // //     //     return list?.map((heading, hIndex) => (
// // // //     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// // // //     //             {/* Heading Title */}
// // // //     //             <div className="heading-row" style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}>
// // // //     //                 <div className="idx" style={{ width: "20px", textAlign: "right", fontWeight: 600 }}>
// // // //     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
// // // //     //                 </div>

// // // //     //                 {editMode && !savedClientSignature ? (

// // // //     //                     <CEEditable
// // // //     //                         tag="h4"
// // // //     //                         html={heading.title}
// // // //     //                         placeholder={"\\u00A0"}
// // // //     //                         className="form-control bg-white p-1 fw-bold"
// // // //     //                         style={{
// // // //     //                             whiteSpace: "pre-wrap",
// // // //     //                             textAlign: "justify",
// // // //     //                             display: "inline-block",
// // // //     //                             minHeight: "40px",
// // // //     //                             width: "100%",
// // // //     //                             outline: "none",
// // // //     //                             background: "transparent",
// // // //     //                             wordBreak: "break-word",
// // // //     //                             fontFamily: "inherit",
// // // //     //                             fontSize: "inherit",
// // // //     //                             fontWeight: "bold",
// // // //     //                             padding: "4px 6px",
// // // //     //                             border: "1px solid #ccc",
// // // //     //                             borderRadius: "4px",
// // // //     //                             boxSizing: "border-box",
// // // //     //                         }}
// // // //     //                         onChange={(newHtml) => {
// // // //     //                             const updated = [...list];
// // // //     //                             updated[hIndex].title = newHtml;
// // // //     //                             setFn(updated);
// // // //     //                         }}
// // // //     //                         onEmpty={() => {
// // // //     //                             // If you also want "empty = delete":
// // // //     //                             // setFn(prev => {
// // // //     //                             //   const next = Array.isArray(prev) ? [...prev] : [];
// // // //     //                             //   next.splice(hIndex, 1);
// // // //     //                             //   return next;
// // // //     //                             // });
// // // //     //                         }}
// // // //     //                         data-head-editor="1"   // <— add this so we can focus after delete
// // // //     //                     />


// // // //     //                 ) : (
// // // //     //                     <div className="fw-bold" style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// // // //     //                 )}

// // // //     //                 {editMode && !savedClientSignature && (
// // // //     //                     <div style={{ display: "flex", gap: "6px" }} data-html2canvas-ignore="true">
// // // //     //                         <div style={{ color: "green", cursor: "pointer" }} onClick={() => addHeadingAfter(hIndex)}>
// // // //     //                             <BsPlus />
// // // //     //                         </div>
// // // //     //                         <div style={{ color: "red", cursor: "pointer" }} onClick={() => deleteHeading(hIndex)}>
// // // //     //                             <BsDash />
// // // //     //                         </div>
// // // //     //                     </div>
// // // //     //                 )}
// // // //     //             </div>

// // // //     //             {/* Points */}
// // // //     //             <ul className="list-unstyled ps-2 ps-md-3">
// // // //     //                 {heading.points?.map((point, pIndex) => (
// // // //     //                     <li key={pIndex}>
// // // //     //                         <div className="d-flex align-items-center mb-2">
// // // //     //                             {editMode && !savedClientSignature ? (
// // // //     //                                 <p
// // // //     //                                     contentEditable
// // // //     //                                     suppressContentEditableWarning
// // // //     //                                     onInput={(e) => {
// // // //     //                                         const updated = [...list];
// // // //     //                                         updated[hIndex].points[pIndex].text = e.currentTarget.innerHTML;
// // // //     //                                         setFn(updated);
// // // //     //                                     }}
// // // //     //                                     style={{
// // // //     //                                         minHeight: "30px",
// // // //     //                                         width: "100%",
// // // //     //                                         outline: "none",
// // // //     //                                         border: "1px solid #ddd",
// // // //     //                                         borderRadius: "4px",
// // // //     //                                         padding: "4px 6px",
// // // //     //                                         textAlign: "justify"
// // // //     //                                     }}
// // // //     //                                     dangerouslySetInnerHTML={{ __html: point.text || "" }}
// // // //     //                                 />
// // // //     //                             ) : (
// // // //     //                                 <div style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// // // //     //                             )}

// // // //     //                             {editMode && !savedClientSignature && (
// // // //     //                                 <>
// // // //     //                                     <div style={{ color: "green", cursor: "pointer" }} onClick={() => addPointAfter(hIndex, pIndex)}>
// // // //     //                                         <BsPlus />
// // // //     //                                     </div>
// // // //     //                                     <div style={{ color: "red", cursor: "pointer" }} onClick={() => deletePoint(hIndex, pIndex)}>
// // // //     //                                         <BsDash />
// // // //     //                                     </div>
// // // //     //                                 </>
// // // //     //                             )}
// // // //     //                         </div>
// // // //     //                     </li>
// // // //     //                 ))}

// // // //     //                 {editMode && !savedClientSignature && (
// // // //     //                     <li>
// // // //     //                         <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => addPointAtEnd(hIndex)} data-html2canvas-ignore="true">
// // // //     //                             + Add Point
// // // //     //                         </button>
// // // //     //                     </li>
// // // //     //                 )}
// // // //     //             </ul>
// // // //     //         </div>
// // // //     //     ));
// // // //     // };




// // // //     // const renderHeadings = (list, setFn, isFixed = false) => {
// // // //     //     // Add Heading
// // // //     //     const addHeadingAfter = (hIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// // // //     //             const newHeading = { id: uuidv4(), title: "New Section", points: [{ id: uuidv4(), text: "", subpoints: [] }] };
// // // //     //             updated.splice(hIndex + 1, 0, newHeading);
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     // Add Point
// // // //     //     const addPointAfter = (hIndex, pIndex) => {
// // // //     //         if (!editMode) return;
// // // //     //         setFn((prev) => {
// // // //     //             const updated = [...prev];
// // // //     //             const heading = updated[hIndex];
// // // //     //             if (!heading) return prev;

// // // //     //             const pts = [...(heading.points || [])];
// // // //     //             pts.splice(pIndex + 1, 0, { id: uuidv4(), text: "", subpoints: [] });
// // // //     //             updated[hIndex] = { ...heading, points: pts };
// // // //     //             return updated;
// // // //     //         });
// // // //     //     };

// // // //     //     // === UI ===
// // // //     //     return list?.map((heading, hIndex) => (
// // // //     //         <div key={heading.id} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// // // //     //             {/* Heading Title */}
// // // //     //             <div className="heading-row d-flex align-items-center mb-2">
// // // //     //                 <div className="idx fw-bold me-2">{isFixed ? hIndex + 1 : hIndex + 11}.</div>

// // // //     //                 {editMode && !savedClientSignature ? (
// // // //     //                     <CEEditable
// // // //     //                         key={heading.id}   // force re-init editor
// // // //     //                         html={heading.title}
// // // //     //                         onChange={(newHtml) => {
// // // //     //                             setFn((prev) => {
// // // //     //                                 const updated = [...prev];
// // // //     //                                 updated[hIndex].title = newHtml;
// // // //     //                                 return updated;
// // // //     //                             });
// // // //     //                         }}
// // // //     //                     />
// // // //     //                 ) : (
// // // //     //                     <div className="fw-bold" dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// // // //     //                 )}
// // // //     //             </div>

// // // //     //             {/* Points */}
// // // //     //             <ul className="list-unstyled ps-3">
// // // //     //                 {heading.points?.map((point, pIndex) => (
// // // //     //                     <li key={point.id}>
// // // //     //                         {editMode && !savedClientSignature ? (
// // // //     //                             <CEEditable
// // // //     //                                 key={point.id}   // force re-init editor
// // // //     //                                 html={point.text}
// // // //     //                                 onChange={(newHtml) => {
// // // //     //                                     setFn((prev) => {
// // // //     //                                         const updated = [...prev];
// // // //     //                                         updated[hIndex].points[pIndex].text = newHtml;
// // // //     //                                         return updated;
// // // //     //                                     });
// // // //     //                                 }}
// // // //     //                             />
// // // //     //                         ) : (
// // // //     //                             <div dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// // // //     //                         )}
// // // //     //                     </li>
// // // //     //                 ))}
// // // //     //             </ul>
// // // //     //         </div>
// // // //     //     ));
// // // //     // };



// // // //     // ---- renderHeadings.jsx ----


// // // //     const renderHeadings = (list, setFn, isFixed = false) => {
// // // //         if (!Array.isArray(list)) return null;

// // // //         // Step 1: Array -> HTML
// // // //         const combinedHtml = list
// // // //             .map(
// // // //                 (heading, hIndex) => `
// // // //                 <p><strong><ul>${heading.title || ""}</ul></strong></p>
// // // //                 <ul>
// // // //                     ${(heading.points || [])
// // // //                         .map((p) => `<li>${p.text || ""}</li>`)
// // // //                         .join("")}
// // // //                 </ul>
// // // //             `
// // // //             )
// // // //             .join("");

// // // //         // Step 2: HTML -> Array
// // // //         const parseHtmlToArray = (html) => {
// // // //             const parser = new DOMParser();
// // // //             const doc = parser.parseFromString(html, "text/html");
// // // //             const sections = [];

// // // //             let currentHeading = null;

// // // //             doc.body.childNodes.forEach((node) => {
// // // //                 if (node.nodeName === "P") {
// // // //                     // extract heading text (remove numbering if any)
// // // //                     const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
// // // //                     currentHeading = { title: headingText, points: [] };
// // // //                     sections.push(currentHeading);
// // // //                 } else if (node.nodeName === "UL" && currentHeading) {
// // // //                     const points = Array.from(node.querySelectorAll("li")).map((li) => ({
// // // //                         text: li.innerHTML,
// // // //                         subpoints: [],
// // // //                     }));
// // // //                     currentHeading.points = points;
// // // //                 }
// // // //             });

// // // //             return sections;
// // // //         };

// // // //         return (
// // // //             <div className="section border p-2 rounded bg-light">
// // // //                 {editMode ? (
// // // //                     <CEEditable
// // // //                         list={list} // 👈 ab array directly de sakte ho
// // // //                         onChange={(updatedList) => setFixedHeadings(updatedList)}
// // // //                         disable={(isFormFilled && !editMode)}
// // // //                     />
// // // //                 ) : (
// // // //                     <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
// // // //                 )}
// // // //             </div>
// // // //         );
// // // //     };


// // // //     return (
// // // //         <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
// // // //             <style>{`
// // // //         .word-paper { color: #000; line-height: 1.4; }
// // // //         .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
// // // //         .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
// // // //         .word-paper .form-control,
// // // //         .word-paper [contenteditable="true"],
// // // //         .word-paper ul.sub-bullets,
// // // //         .word-paper ul.sub-bullets li { text-align: justify; }
// // // //         .word-paper.pdf-mode * { box-shadow: none !important; }
// // // //         .word-paper.pdf-mode .card,
// // // //         .word-paper.pdf-mode .form-control,
// // // //         .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
// // // //         .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }
// // // //         .word-paper.pdf-mode ul,
// // // //         .word-paper.pdf-mode ol { list-style: revert !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// // // //         .word-paper ul.sub-bullets { list-style-type: disc !important; list-style-position: outside !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// // // //         .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
// // // //         .word-paper .list-unstyled ul.sub-bullets,
// // // //         .word-paper .form-control ul.sub-bullets { list-style-type: disc !important; padding-left: 24px !important; }
// // // //         @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
// // // //       `}</style>

// // // //             {/* toolbar */}
// // // //             <div className="d-flex justify-content-end mb-3" data-html2canvas-ignore="true">
// // // //                 <button
// // // //                     className="btn btn-primary d-flex align-items-center"
// // // //                     onClick={handleDownload}
// // // //                     style={{ padding: "8px 16px" }}
// // // //                     data-html2canvas-ignore="true"
// // // //                 >
// // // //                     <BsDownload className="me-2" />
// // // //                     Download PDF
// // // //                 </button>
// // // //             </div>

// // // //             {(!isclient || isFormFilled) ? (
// // // //                 // IMPORTANT: key={draftKey} forces remount so new draft values appear
// // // //                 <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey}>
// // // //                     {/* Header */}
// // // //                     <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
// // // //                         <img
// // // //                             src="logo.png"
// // // //                             alt="Logo"
// // // //                             className="me-2 me-md-3 mb-2 mb-md-0"
// // // //                             style={{ height: "50px" }}
// // // //                         />
// // // //                         <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
// // // //                     </div>

// // // //                     {token?.Role !== "client" && (
// // // //                         // <Form.Group className="mb-3">
// // // //                         //     <Form.Label>Drafts <span className="text-danger"></span></Form.Label>
// // // //                         //     <InputGroup>
// // // //                         //         <Dropdown className="w-100">
// // // //                         //             <Dropdown.Toggle
// // // //                         //                 variant="outline-secondary"
// // // //                         //                 id="dropdown-practice-area"
// // // //                         //                 // ENABLED now: allow switching drafts anytime
// // // //                         //                 className="w-100 text-start d-flex justify-content-between align-items-center"
// // // //                         //             >
// // // //                         //                 {selectedDrafts === "Select Draft" ? "Select Draft" : `${selectedDrafts?.CaseNumber}`}
// // // //                         //             </Dropdown.Toggle>

// // // //                         //             <Dropdown.Menu className="w-100">
// // // //                         //                 {getDrafts?.map((data, index) => (
// // // //                         //                     <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// // // //                         //                         {data?.CaseNumber}
// // // //                         //                     </Dropdown.Item>
// // // //                         //                 ))}
// // // //                         //             </Dropdown.Menu>
// // // //                         //         </Dropdown>
// // // //                         //     </InputGroup>
// // // //                         // </Form.Group>


// // // //                         <Form.Group className="mb-3">
// // // //                             <Form.Label>Drafts</Form.Label>

// // // //                             <Dropdown className="w-100">
// // // //                                 <Dropdown.Toggle
// // // //                                     variant="outline-secondary"
// // // //                                     disabled={isFormFilled}
// // // //                                     id="dropdown-practice-area"
// // // //                                     className="w-100 text-start d-flex justify-content-between align-items-center"
// // // //                                 >
// // // //                                     {selectedDrafts === "Select Draft"
// // // //                                         ? "Select Draft"
// // // //                                         : `${selectedDrafts?.CaseNumber}`}
// // // //                                 </Dropdown.Toggle>

// // // //                                 <Dropdown.Menu className="w-100" disabled={isFormFilled}>


// // // //                                     {getDrafts?.map((data, index) => (
// // // //                                         <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// // // //                                             {data?.CaseNumber}
// // // //                                         </Dropdown.Item>
// // // //                                     ))}
// // // //                                 </Dropdown.Menu>
// // // //                             </Dropdown>
// // // //                         </Form.Group>

// // // //                     )}

// // // //                     <div className="card p-2 p-md-4 shadow-sm mb-4">
// // // //                         <label className="form-label fw-bold fs-5 text-break">Agreement</label>
// // // //                         {editMode && !isclient && !savedClientSignature ? (
// // // //                             <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
// // // //                                 {agreement?.fixedParts?.map((part, index) => (
// // // //                                     <React.Fragment key={index}>
// // // //                                         <span>{part}</span>
// // // //                                         {index < agreement.editableValues.length && (
// // // //                                             <p
// // // //                                                 ref={(el) => {
// // // //                                                     if (el && !el.innerHTML.trim()) {
// // // //                                                         el.innerHTML = agreement.editableValues[index] || "\u00A0";
// // // //                                                     }
// // // //                                                 }}
// // // //                                                 contentEditable
// // // //                                                 suppressContentEditableWarning
// // // //                                                 onInput={(e) => {
// // // //                                                     const html = e.currentTarget.innerHTML;
// // // //                                                     handleEditableChange(index, html);
// // // //                                                 }}
// // // //                                                 onKeyDown={(e) => {
// // // //                                                     if (e.ctrlKey && e.key.toLowerCase() === "b") {
// // // //                                                         e.preventDefault();
// // // //                                                         document.execCommand("bold");
// // // //                                                     }
// // // //                                                     if (e.key === "Tab") {
// // // //                                                         e.preventDefault();
// // // //                                                         const selection = window.getSelection();
// // // //                                                         if (!selection.rangeCount) return;
// // // //                                                         const range = selection.getRangeAt(0);
// // // //                                                         const tabSpaces = "\u00A0".repeat(8);
// // // //                                                         const spaceNode = document.createTextNode(tabSpaces);
// // // //                                                         range.insertNode(spaceNode);
// // // //                                                         range.setStartAfter(spaceNode);
// // // //                                                         selection.removeAllRanges();
// // // //                                                         selection.addRange(range);
// // // //                                                     }
// // // //                                                 }}
// // // //                                                 onBlur={(e) => {
// // // //                                                     if (!e.currentTarget.textContent.trim()) {
// // // //                                                         e.currentTarget.innerHTML = "\u00A0";
// // // //                                                     }
// // // //                                                 }}
// // // //                                                 style={{
// // // //                                                     display: "inline",
// // // //                                                     minWidth: "2ch",
// // // //                                                     maxWidth: "100%",
// // // //                                                     outline: "none",
// // // //                                                     background: "transparent",
// // // //                                                     verticalAlign: "middle",
// // // //                                                     whiteSpace: "pre-wrap",
// // // //                                                     wordBreak: "break-word",
// // // //                                                     fontFamily: "inherit",
// // // //                                                     fontSize: "inherit",
// // // //                                                     padding: "0 2px",
// // // //                                                     boxSizing: "border-box",
// // // //                                                     textDecoration: "underline",
// // // //                                                     textDecorationSkipInk: "none",
// // // //                                                     textAlign: "justify",
// // // //                                                 }}
// // // //                                             />
// // // //                                         )}
// // // //                                     </React.Fragment>
// // // //                                 ))}
// // // //                             </div>
// // // //                         ) : (
// // // //                             <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
// // // //                                 {agreement?.fixedParts?.map((part, index) => (
// // // //                                     <React.Fragment key={index}>
// // // //                                         <span>{part}</span>
// // // //                                         {index < agreement.editableValues.length && (
// // // //                                             <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
// // // //                                         )}
// // // //                                     </React.Fragment>
// // // //                                 ))}
// // // //                             </div>
// // // //                         )}
// // // //                     </div>

// // // //                     {/* Fixed Headings */}
// // // //                     {renderHeadings(fixedHeadings, setFixedHeadings, true)}

// // // //                     {/* Custom Headings */}
// // // //                     {/* {renderHeadings(headings, setHeadings, false)} */}

// // // //                     {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
// // // //                         <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// // // //                             <h2>Lawyer Signature</h2>
// // // //                             <Form_SignaturePad height={250} onSave={handleSignatureSave} />
// // // //                         </div>
// // // //                     )}

// // // //                     <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// // // //                         {(isclient && !isLocalSign) && (
// // // //                             <div>
// // // //                                 <h2>Client Signature</h2>
// // // //                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
// // // //                             </div>
// // // //                         )}
// // // //                     </div>

// // // //                     <div
// // // //                         style={{
// // // //                             display: "flex",
// // // //                             flexDirection: "row",
// // // //                             justifyContent: "space-between",
// // // //                             alignItems: "flex-start",
// // // //                             gap: "20px",
// // // //                             width: "100%",
// // // //                         }}
// // // //                     >
// // // //                         {savedSignature && (
// // // //                             <div>
// // // //                                 <h4>Lawyer Signature:</h4>
// // // //                                 <img
// // // //                                     src={savedSignature}
// // // //                                     alt="Lawyer Signature"
// // // //                                     style={{
// // // //                                         maxWidth: "220px",
// // // //                                         maxHeight: "300px",
// // // //                                         border: "1px solid #ccc",
// // // //                                         borderRadius: "4px",
// // // //                                     }}
// // // //                                 />
// // // //                             </div>
// // // //                         )}

// // // //                         {savedClientSignature && (
// // // //                             <div>
// // // //                                 <h4>Client Signature:</h4>
// // // //                                 <img
// // // //                                     src={savedClientSignature}
// // // //                                     alt="Client Signature"
// // // //                                     style={{
// // // //                                         maxWidth: "220px",
// // // //                                         border: "1px solid #ccc",
// // // //                                         borderRadius: "4px",
// // // //                                     }}
// // // //                                 />
// // // //                             </div>
// // // //                         )}
// // // //                     </div>

// // // //                     <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
// // // //                         {(!isclient && savedClientSignature && savedLawyerSignature) && (
// // // //                             <button
// // // //                                 className="btn btn-sm btn-primary fw-bold"
// // // //                                 onClick={handleUpdateLawyerSubmit}
// // // //                                 style={{ width: "150px" }}
// // // //                                 data-html2canvas-ignore="true"
// // // //                             >
// // // //                                 Save & Update Agreement
// // // //                             </button>
// // // //                         )}

// // // //                         {editMode ? (
// // // //                             <>
// // // //                                 {(!isFormFilled && !savedClientSignature) ? (
// // // //                                     <button
// // // //                                         className="btn btn-sm btn-primary fw-bold"
// // // //                                         onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
// // // //                                         style={{ width: "150px" }}
// // // //                                         data-html2canvas-ignore="true"
// // // //                                     >
// // // //                                         Save & Submit Agreement
// // // //                                     </button>
// // // //                                 ) : (
// // // //                                     <button
// // // //                                         className="btn btn-sm btn-primary fw-bold"
// // // //                                         onClick={handleUpdateLawyerSubmit}
// // // //                                         style={{ width: "150px" }}
// // // //                                         data-html2canvas-ignore="true"
// // // //                                     >
// // // //                                         Save & Update Agreement
// // // //                                     </button>
// // // //                                 )}
// // // //                             </>
// // // //                         ) : (
// // // //                             <>
// // // //                                 {(isclient && !isLocalSign) && (
// // // //                                     <button
// // // //                                         className="btn btn-sm btn-primary fw-bold"
// // // //                                         onClick={handleUpdateLawyerSubmit}
// // // //                                         style={{ width: "150px" }}
// // // //                                         data-html2canvas-ignore="true"
// // // //                                     >
// // // //                                         Save & Submit Signature
// // // //                                     </button>
// // // //                                 )}

// // // //                                 {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
// // // //                                     <button
// // // //                                         className="btn btn-sm btn-primary fw-bold"
// // // //                                         onClick={() => setEditMode(true)}
// // // //                                         style={{ width: "150px" }}
// // // //                                         data-html2canvas-ignore="true"
// // // //                                     >
// // // //                                         Edit Agreement
// // // //                                     </button>
// // // //                                 )}
// // // //                             </>
// // // //                         )}
// // // //                     </div>
// // // //                 </div>
// // // //             ) : (
// // // //                 <div className="text-center text-black py-5">No LFA Form Available.</div>
// // // //             )}
// // // //         </div>
// // // //     );
// // // // };

// // // // export default LEA_Form;




// // // //LFA_form 
// // // import React, { useEffect, useState, useRef } from 'react';
// // // import axios from 'axios';
// // // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // // import { ApiEndPoint } from '../utils/utlis';
// // // import { useSelector } from 'react-redux';
// // // import ConfirmModal from '../../AlertModels/ConfirmModal';
// // // import { useAlert } from '../../../../Component/AlertContext';
// // // import Form_SignaturePad from './Form_Componets/SignaturePad';
// // // import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
// // // import { Dropdown, Form, InputGroup } from "react-bootstrap";
// // // import CEEditable from './CEEditable';
// // // import { v4 as uuidv4 } from "uuid";
// // // import {jsPDF} from "jspdf";
// // // import logo from '../../../Pages/Images/logo.png';

// // // const LEA_Form = ({ token }) => {   


// // //  const [isHovered, setIsHovered] = useState(false);

// // // const handleDownload = () => {
// // //   const doc = new jsPDF("p", "pt", "a4");
// // // const pageWidth = doc.internal.pageSize.getWidth(); 
// // // const pageHeight = doc.internal.pageSize.getHeight(); 
// // // const marginX = 80; 
// // // const maxWidth = pageWidth - marginX * 2; 
// // // const marginTop = 140; 
// // // const lineHeight = 18; 

// // // let y = marginTop;

// // // // --- Header ---
// // // const addHeader = () => {
// // //   // Background
// // //   doc.setFillColor("#1a2b42");
// // //   doc.rect(0, 0, pageWidth, 80, "F");

// // //   // Logo + Text (Left aligned)
// // //   const logoWidth = 50;
// // //   const logoHeight = 60;
// // //   const gap = 15;

// // //   // Text content
// // //   const mainText = "SUHAD ALJUBOORI";
// // //   const subText = "Advocates & Legal Consultants";

// // //   // Start X for left side
// // //   const startX = 70; // margin from left

// // //   // Draw Logo
// // //   doc.addImage(logo, "PNG", startX, 15, logoWidth, logoHeight);

// // //   // Draw Text (to the right of logo)
// // //   let textX = startX + logoWidth + gap;

// // //   doc.setTextColor("#fff");

// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(14);
// // //   doc.text(mainText, textX, 43); // vertically aligned with logo

// // //   doc.setFont("helvetica", "normal");
// // //   doc.setFontSize(12);
// // //   doc.text(subText, textX, 57);
// // // };


// // //   // --- Footer ---
// // //   const footerText =
// // //     "P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nAbu Dhabi: 2403, Tomouh Tower, Marina Square Jazeerat Al Reem\nTel: +971 (04) 332 5928, web: aws-legalgroup.com, email: info@awsadvocates.com";

// // //   const addFooter = () => {
// // //     const pageCount = doc.internal.getNumberOfPages();
// // //     for (let i = 1; i <= pageCount; i++) {
// // //       doc.setPage(i);

// // //       // Footer background
// // //       doc.setFillColor(245, 245, 245);
// // //       doc.rect(0, pageHeight - 70, pageWidth, 70, "F");

// // //       // Footer text
// // //       doc.setTextColor("#333333");
// // //       doc.setFont("helvetica", "normal");
// // //       doc.setFontSize(7);
// // //       const footerLines = doc.splitTextToSize(footerText, pageWidth - 80);
// // //       doc.text(footerLines, pageWidth / 2, pageHeight - 50, {
// // //         align: "center",
// // //       });

// // //       // Page number
// // //       doc.setFontSize(8);
// // //       const pageText = `Page ${i} of ${pageCount}`;
// // //       doc.text(pageText, pageWidth - 60, pageHeight - 20);
// // //     }
// // //   };

// // //   // --- Page break handler ---
// // //   const checkPageBreak = (nextY) => {
// // //     if (nextY > pageHeight - 100) {
// // //       doc.addPage();
// // //       addHeader();
// // //       y = marginTop;
// // //       doc.setFont("helvetica", "normal");
// // //       doc.setFontSize(11);
// // //       doc.setTextColor("#333333");
// // //     }
// // //   };

// // //   // --- Justified text writer ---
// // //  // --- Justified text writer (fixed spaces) ---
// // // const justifyText = (text) => {
// // //   const lines = doc.splitTextToSize(text, maxWidth);

// // //   lines.forEach((line, idx) => {
// // //     checkPageBreak(y + lineHeight);

// // //     if (idx === lines.length - 1 || !line.includes(" ")) {
// // //       // Last line ya single word line -> left aligned
// // //       doc.text(line, marginX, y);
// // //     } else {
// // //       // Justify line
// // //       const words = line.split(" ");
// // //       const spaceCount = words.length - 1;

// // //       // Current text width without extra spacing
// // //       const lineWidth = words.reduce(
// // //         (sum, w) => sum + doc.getTextWidth(w),
// // //         0
// // //       );

// // //       // Har space ke liye base ek space + extra adjustment
// // //       const totalExtraSpace = maxWidth - lineWidth;
// // //       const spaceWidth = totalExtraSpace / spaceCount;

// // //       let cursorX = marginX;
// // //       words.forEach((w, i) => {
// // //         doc.text(w, cursorX, y);
// // //         if (i < spaceCount) {
// // //           cursorX += doc.getTextWidth(w) + spaceWidth;
// // //         }
// // //       });
// // //     }
// // //     y += lineHeight;
// // //   });

// // //   y += 10;
// // // };


// // //   // --- Draw first header ---
// // //   addHeader();

// // //   // --- Title ---
// // //   doc.setFont("helvetica", "bold");
// // //   doc.setFontSize(18);
// // //   doc.setTextColor("#000");
// // //   doc.text("Legal Fee Agreement", pageWidth / 2, 120, { align: "center" });


// // // // --- Agreement heading (left aligned) ---
// // // doc.setFont("helvetica", "bold");
// // // doc.setFontSize(13);
// // // doc.setTextColor("#333333");
// // // doc.text("Agreement", marginX, 160, { align: "left" });

// // // // ✅ Update y so that text starts below "Agreement"
// // // y = 190;

// // // // --- Agreement body ---
// // // doc.setFont("helvetica", "normal");
// // // doc.setFontSize(11);
// // // doc.setTextColor("#333333");

// // // const agreementText = agreement.fixedParts
// // //   .map((part, i) => part + (agreement.editableValues[i] || ""))
// // //   .join(" ");
// // // const paragraphs = agreementText.split("\n");

// // // paragraphs.forEach((p) => {
// // //   if (p.trim()) justifyText(p.trim());
// // // });

// // // y += 30;

// // //   // --- Section Details ---
// // //   fixedHeadings.forEach((section) => {
// // //     checkPageBreak(y + lineHeight);

// // //     doc.setFont("helvetica", "bold");
// // //     doc.setFontSize(13);
// // //     doc.setTextColor("#1a2b42");
// // //     doc.text(section.title, marginX, y);
// // //     y += lineHeight;

// // //     doc.setFont("helvetica", "normal");
// // //     doc.setFontSize(11);
// // //     doc.setTextColor("#333333");

// // //     section.points.forEach((p) => {
// // //       justifyText("- " + (p.text || ""));
// // //     });

// // //     y += 10;
// // //   });

// // //   // --- Signatures ---
// // //   checkPageBreak(y + 80);
// // //   y += 30;

// // //   doc.setFont("helvetica", "bold");
// // //   doc.text(" ___________________", marginX, y);
// // //   doc.text(" ___________________", pageWidth - 250, y);

// // //   // ↓ Lawyer details
// // //   y += 20;
// // //   doc.setFont("helvetica", "normal");
// // //   doc.setFontSize(9);
// // //   doc.text("The Attorney", marginX + 60, y, { align: "center" });
// // //   doc.text("SUHAD ALJUBOORI", marginX + 60, y + 15, { align: "center" });

// // //   // ↓ Client details
// // //   doc.text("The Client", pageWidth - 190, y, { align: "center" });
// // //   doc.text(
// // //      "Client Name Here",
// // //     pageWidth - 190,
// // //     y + 15,
// // //     { align: "center" }
// // //   );

// // //   // --- Headers + Footers on all pages ---
// // //   const pageCount = doc.internal.getNumberOfPages();
// // //   for (let i = 1; i <= pageCount; i++) {
// // //     doc.setPage(i);
// // //     addHeader();
// // //   }
// // //   addFooter();

// // //   // --- Save ---
// // //   doc.save("Legal_Fee_Agreement.pdf");
// // // };


// // //     const caseInfo = useSelector((state) => state.screen.Caseinfo);
// // //     const { showDataLoading } = useAlert();

// // //     const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
// // //     const [getDrafts, setGetDrafts] = useState(null);

// // //     // NEW: force remount key for contentEditable sections
// // //     const [draftKey, setDraftKey] = useState(0);

// // //     useEffect(() => {
// // //         FetchLFA();
// // //     }, []);

// // //     const [agreement, setAgreement] = useState({
// // //         fixedParts: [
// // //             'This Agreement ("Agreement") is entered into and shall become effective as of ',
// // //             ', by and between:\n\n',
// // //             ', with its principal place of business located at ',
// // //             ', represented herein by ',
// // //             ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
// // //             ' a national of ',
// // //             ', with their principal place of residence located ',
// // //             ' issued on: ',
// // //             ', having email ID: ',
// // //             ' and Contact Number: ',
// // //             ' (Hereinafter referred to as the "Client")'
// // //         ],
// // //         editableValues: [
// // //             new Date().toLocaleDateString('en-GB'),
// // //             'M/s AWS Legal Consultancy FZ-LLC',
// // //             '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
// // //             'Mr Aws M. Younis, Chairman',
// // //             'Dr. Ali Moustafa Mohamed Elba',
// // //             'Egypt',
// // //             'Dubai, United Arab Emirates',
// // //             'holding Emirates ID Number: ',
// // //             '784-1952-3620694-4',
// // //             new Date().toLocaleDateString('en-GB'),
// // //             'alyelba@yahoo.com',
// // //             '+971521356931'
// // //         ]
// // //     });

// // //     const [fixedHeadings, setFixedHeadings] = useState([
// // //         { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
// // //     ]);

// // //     const [headings, setHeadings] = useState([]);

// // //     const [savedSignature, setSavedSignature] = useState(null);
// // //     const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
// // //     const [isFormFilled, setisFormFilled] = useState(false);
// // //     const [savedClientSignature, setSavedClientSignature] = useState(null);
// // //     const [isLocalSign, setIsLocalSign] = useState(false);
// // //     const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
// // //     const [dataList, setDataList] = useState([]);
// // //     const isclient = token?.Role === "client";

// // //     const FetchLFA = async () => {
// // //         showDataLoading(true);
// // //         try {
// // //             const response = await fetch(`${ApiEndPoint}getLFAForm/${caseInfo?._id}`);
// // //             if (!response.ok) {
// // //                 showDataLoading(false);
// // //                 throw new Error('Error fetching LFA');
// // //             }
// // //             const data = await response.json();
// // //             showDataLoading(false);

// // //             setAgreement(data.data.agreement);
// // //             setDataList(data.data);
// // //             setFixedHeadings(data.data.fixedHeadings);
// // //             setHeadings(data.data.headings);
// // //             setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
// // //             setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
// // //             setEditMode(false);
// // //             setisFormFilled(true);
// // //             setIsLocalSign(!!data.data?.ClientSignatureImage);
// // //             setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
// // //             setSavedLawyerSignature();

// // //             // ensure UI refreshes on initial fetch too
// // //             setDraftKey((k) => k + 1);
// // //         } catch (err) {
// // //             showDataLoading(false);
// // //         }

// // //         try {
// // //             const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
// // //             if (!response.ok) {
// // //                 showDataLoading(false);
// // //                 throw new Error('Error fetching LFA');
// // //             }
// // //             const data = await response.json();
// // //             setGetDrafts(data);
// // //         } catch (err) {
// // //             showDataLoading(false);
// // //         }
// // //     };

// // //     const handleSignatureSave = (dataUrl) => {
// // //         setSavedSignature(dataUrl);
// // //         setSavedLawyerSignature(dataUrl);
// // //         setIsLocalLawyerSign(true);
// // //     };

// // //     const handleClientSignatureSave = (dataUrl) => {
// // //         setSavedClientSignature(dataUrl);
// // //     };

// // //     const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

// // //     const handleEditableChange = (index, newValue) => {
// // //         const updated = [...agreement.editableValues];
// // //         updated[index] = newValue;
// // //         setAgreement({ ...agreement, editableValues: updated });
// // //     };

// // //     function base64ToFile(base64String, filename) {
// // //         const arr = base64String.split(",");
// // //         const mime = arr[0].match(/:(.*?);/)[1];
// // //         const bstr = atob(arr[1]);
// // //         let n = bstr.length;
// // //         const u8arr = new Uint8Array(n);
// // //         while (n--) {
// // //             u8arr[n] = bstr.charCodeAt(n);
// // //         }
// // //         return new File([u8arr], filename, { type: mime });
// // //     }

// // //     const handleClientSubmit = async () => {
// // //         try {
// // //             const formData = new FormData();
// // //             formData.append("caseId", caseInfo?._id || "");
// // //             formData.append("Islawyer", false);

// // //             formData.append(
// // //                 "agreement",
// // //                 JSON.stringify({
// // //                     fixedParts: agreement?.fixedParts,
// // //                     editableValues: agreement?.editableValues
// // //                 })
// // //             );

// // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // //                 title: h.title,
// // //                 points: h.points?.map(p => ({
// // //                     text: p.text || "",
// // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // //                 }))
// // //             }));

// // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // //             formData.append("headings", JSON.stringify(headings));

// // //             if (savedClientSignature) {
// // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // //                 method: "POST",
// // //                 body: formData
// // //             });

// // //             const data = await res.json();
// // //             if (data.success) {
// // //                 setEditMode(false);
// // //                 setIsLocalSign(true);
// // //             } else {
// // //                 console.error("❌ Failed:", data.message);
// // //             }
// // //         } catch (err) {
// // //             console.error("Error submitting form:", err);
// // //         }
// // //     };

// // //     const handleLawyerSubmit = async () => {


// // //         console.log(fixedHeadings)
// // //         try {
// // //             const formData = new FormData();
// // //             formData.append("caseId", caseInfo?._id || "");
// // //             formData.append("Islawyer", true);

// // //             formData.append(
// // //                 "agreement",
// // //                 JSON.stringify({
// // //                     fixedParts: agreement.fixedParts,
// // //                     editableValues: agreement.editableValues
// // //                 })
// // //             );

// // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // //                 title: h.title,
// // //                 points: h.points?.map(p => ({
// // //                     text: p.text || "",
// // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // //                 }))
// // //             }));

// // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // //             formData.append("headings", JSON.stringify(headings));

// // //             // FIXED: use lawyer signature (savedSignature), not savedClientSignature
// // //             if (savedSignature) {
// // //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // //                 method: "POST",
// // //                 body: formData
// // //             });

// // //             const data = await res.json();
// // //             if (data.success) {
// // //                 setEditMode(false);
// // //             } else {
// // //                 console.error("❌ Failed:", data.message);
// // //             }
// // //         } catch (err) {
// // //             console.error("Error submitting form:", err);
// // //         }
// // //     };

// // //     const handleUpdateClientSubmit = async () => {
// // //         try {
// // //             const formData = new FormData();
// // //             formData.append("caseId", caseInfo?._id || "");
// // //             formData.append("Islawyer", false);

// // //             formData.append(
// // //                 "agreement",
// // //                 JSON.stringify({
// // //                     fixedParts: agreement?.fixedParts,
// // //                     editableValues: agreement?.editableValues
// // //                 })
// // //             );

// // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // //                 title: h.title,
// // //                 points: h.points?.map(p => ({
// // //                     text: p.text || "",
// // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // //                 }))
// // //             }));

// // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // //             formData.append("headings", JSON.stringify(headings));

// // //             if (savedClientSignature) {
// // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // //                 method: "POST",
// // //                 body: formData
// // //             });

// // //             const data = await res.json();
// // //             if (data.success) {
// // //                 setEditMode(false);
// // //             } else {
// // //                 console.error("❌ Failed:", data.message);
// // //             }
// // //         } catch (err) {
// // //             console.error("Error submitting form:", err);
// // //         }
// // //     };

// // //     const handleUpdateLawyerSubmit = async () => {
// // //         try {
// // //             const formData = new FormData();
// // //             formData.append("caseId", caseInfo?._id || "");
// // //             formData.append("Islawyer", !isclient);

// // //             formData.append(
// // //                 "agreement",
// // //                 JSON.stringify({
// // //                     fixedParts: agreement?.fixedParts || [],
// // //                     editableValues: agreement?.editableValues || {}
// // //                 })
// // //             );

// // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // //                 title: h.title,
// // //                 points: h.points?.map(p => ({
// // //                     text: p.text || "",
// // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // //                 }))
// // //             })) || [];

// // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // //             formData.append("headings", JSON.stringify(headings || []));

// // //             if (!isclient && savedSignature) {
// // //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             if (isclient && savedClientSignature) {
// // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
// // //                 method: "PUT",
// // //                 body: formData
// // //             });

// // //             const data = await res.json();

// // //             if (data.success) {
// // //                 setEditMode(false);
// // //                 FetchLFA();
// // //             } else {
// // //                 console.error("❌ Failed:", data.message);
// // //             }
// // //         } catch (err) {
// // //             console.error("Error submitting form:", err);
// // //         }
// // //     };

// // //     const addHeading = () =>
// // //         setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

// // //     const updateHeadingTitle = (hIndex, value) => {
// // //         const updated = [...headings];
// // //         updated[hIndex].title = value;
// // //         setHeadings(updated);
// // //     };

// // //     const updatePoint = (setFn, list, hIndex, pIndex, value) => {
// // //         const updated = [...list];
// // //         updated[hIndex].points[pIndex].text = value;
// // //         setFn(updated);
// // //     };

// // //     const updateSubpoint = (setFn, list, hIndex, pIndex, sIndex, value) => {
// // //         const updated = [...list];
// // //         updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
// // //         setFn(updated);
// // //     };

// // //     const updateSubSubpoint = (setFn, list, hIndex, pIndex, sIndex, ssIndex, value) => {
// // //         const updated = [...list];
// // //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
// // //         setFn(updated);
// // //     };

// // //     const removePoint = (hIndex, pIndex) => {
// // //         const updated = [...headings];
// // //         updated[hIndex].points.splice(pIndex, 1);
// // //         setHeadings(updated);
// // //     };

// // //     const removeSubpoint = (hIndex, pIndex, sIndex) => {
// // //         const updated = [...headings];
// // //         updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
// // //         setHeadings(updated);
// // //     };

// // //     const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
// // //         const updated = [...headings];
// // //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
// // //         setHeadings(updated);
// // //     };

// // //     const [editHeadingIndex, setEditHeadingIndex] = useState(null);

// // //     const pdfRef = useRef(null);

// // //     // REMOVED: handleDownload function completely

// // //     // UPDATED: selecting a draft now forces a clean remount & syncs signatures
// // //     const handlePickDraft = (data) => {
// // //         setAgreement(data.agreement);
// // //         setFixedHeadings(data.fixedHeadings);
// // //         setHeadings(data.headings);
// // //         setSelectedDrafts(data);
// // //         // setSavedClientSignature(data?.ClientSignatureImage || "");
// // //         // setSavedSignature(data?.LawyerSignatureImage || "");
// // //         //  setEditMode(true);
// // //         setDraftKey((k) => k + 1); // force remount
// // //     };

// // //     // ---- renderHeadings.jsx ----


// // //     const renderHeadings = (list, setFn, isFixed = false) => {
// // //         if (!Array.isArray(list)) return null;

// // //         // Step 1: Array -> HTML
// // //         const combinedHtml = list
// // //             .map(
// // //                 (heading, hIndex) => `
// // //                 <p><strong><ul>${heading.title || ""}</ul></strong></p>
// // //                 <ul>
// // //                     ${(heading.points || [])
// // //                         .map((p) => `<li>${p.text || ""}</li>`)
// // //                         .join("")}
// // //                 </ul>
// // //             `
// // //             )
// // //             .join("");

// // //         // Step 2: HTML -> Array
// // //         const parseHtmlToArray = (html) => {
// // //             const parser = new DOMParser();
// // //             const doc = parser.parseFromString(html, "text/html");
// // //             const sections = [];

// // //             let currentHeading = null;

// // //             doc.body.childNodes.forEach((node) => {
// // //                 if (node.nodeName === "P") {
// // //                     // extract heading text (remove numbering if any)
// // //                     const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
// // //                     currentHeading = { title: headingText, points: [] };
// // //                     sections.push(currentHeading);
// // //                 } else if (node.nodeName === "UL" && currentHeading) {
// // //                     const points = Array.from(node.querySelectorAll("li")).map((li) => ({
// // //                         text: li.innerHTML,
// // //                         subpoints: [],
// // //                     }));
// // //                     currentHeading.points = points;
// // //                 }
// // //             });

// // //             return sections;
// // //         };

// // //         return (
// // //             <div className="section border p-2 rounded bg-light">
// // //                 {editMode ? (
// // //                     <CEEditable
// // //                         list={list} // 👈 ab array directly de sakte ho
// // //                         onChange={(updatedList) => setFixedHeadings(updatedList)}
// // //                         disable={(isFormFilled && !editMode)}
// // //                     />
// // //                 ) : (
// // //                     <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
// // //                 )}
// // //             </div>
// // //         );
// // //     };


// // //     return (
// // //         <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
// // //             <style>{`
// // //         .word-paper { color: #000; line-height: 1.4; }
// // //         .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
// // //         .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
// // //         .word-paper .form-control,
// // //         .word-paper [contenteditable="true"],
// // //         .word-paper ul.sub-bullets,
// // //         .word-paper ul.sub-bullets li { text-align: justify; }
// // //         .word-paper.pdf-mode * { box-shadow: none !important; }
// // //         .word-paper.pdf-mode .card,
// // //         .word-paper.pdf-mode .form-control,
// // //         .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
// // //         .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }
// // //         .word-paper.pdf-mode ul,
// // //         .word-paper.pdf-mode ol { list-style: revert !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// // //         .word-paper ul.sub-bullets { list-style-type: disc !important; list-style-position: outside !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// // //         .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
// // //         .word-paper .list-unstyled ul.sub-bullets,
// // //         .word-paper .form-control ul.sub-bullets { list-style-type: disc !important; padding-left: 24px !important; }
// // //         @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
// // //       `}</style>

// // //             {/* toolbar - REMOVED: Download PDF functionality */}
// // //           <div className="d-flex justify-content-end mb-3" data-html2canvas-ignore="true">
// // //                 <button
// // //                     className="btn btn-primary d-flex align-items-center"
// // //                     onClick={handleDownload}
// // //                     style={{ padding: "8px 16px" }}
// // //                     data-html2canvas-ignore="true"
// // //                 >
// // //                     <BsDownload className="me-2" />
// // //                     Download PDF
// // //                 </button>
// // //             </div>

// // //             {(!isclient || isFormFilled) ? (
// // //                 // IMPORTANT: key={draftKey} forces remount so new draft values appear
// // //                 <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey}>
// // //                     {/* Header */}
// // //                     <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
// // //                         <img
// // //                             src="logo.png"
// // //                             alt="Logo"
// // //                             className="me-2 me-md-3 mb-2 mb-md-0"
// // //                             style={{ height: "50px" }}
// // //                         />
// // //                         <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
// // //                     </div>

// // //                     {token?.Role !== "client" && (
// // //                         <Form.Group className="mb-3">
// // //                             <Form.Label>Drafts</Form.Label>

// // //                             <Dropdown className="w-100">
// // //                                 <Dropdown.Toggle
// // //                                     variant="outline-secondary"
// // //                                     disabled={isFormFilled}
// // //                                     id="dropdown-practice-area"
// // //                                     className="w-100 text-start d-flex justify-content-between align-items-center"
// // //                                 >
// // //                                     {selectedDrafts === "Select Draft"
// // //                                         ? "Select Draft"
// // //                                         : `${selectedDrafts?.CaseNumber}`}
// // //                                 </Dropdown.Toggle>

// // //                                 <Dropdown.Menu className="w-100" disabled={isFormFilled}>


// // //                                     {getDrafts?.map((data, index) => (
// // //                                         <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// // //                                             {data?.CaseNumber}
// // //                                         </Dropdown.Item>
// // //                                     ))}
// // //                                 </Dropdown.Menu>
// // //                             </Dropdown>
// // //                         </Form.Group>

// // //                     )}

// // //                     <div className="card p-2 p-md-4 shadow-sm mb-4">
// // //                         <label className="form-label fw-bold fs-5 text-break">Agreement</label>
// // //                         {editMode && !isclient && !savedClientSignature ? (
// // //                             <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
// // //                                 {agreement?.fixedParts?.map((part, index) => (
// // //                                     <React.Fragment key={index}>
// // //                                         <span>{part}</span>
// // //                                         {index < agreement.editableValues.length && (
// // //                                             <p
// // //                                                 ref={(el) => {
// // //                                                     if (el && !el.innerHTML.trim()) {
// // //                                                         el.innerHTML = agreement.editableValues[index] || "\u00A0";
// // //                                                     }
// // //                                                 }}
// // //                                                 contentEditable
// // //                                                 suppressContentEditableWarning
// // //                                                 onInput={(e) => {
// // //                                                     const html = e.currentTarget.innerHTML;
// // //                                                     handleEditableChange(index, html);
// // //                                                 }}
// // //                                                 onKeyDown={(e) => {
// // //                                                     if (e.ctrlKey && e.key.toLowerCase() === "b") {
// // //                                                         e.preventDefault();
// // //                                                         document.execCommand("bold");
// // //                                                     }
// // //                                                     if (e.key === "Tab") {
// // //                                                         e.preventDefault();
// // //                                                         const selection = window.getSelection();
// // //                                                         if (!selection.rangeCount) return;
// // //                                                         const range = selection.getRangeAt(0);
// // //                                                         const tabSpaces = "\u00A0".repeat(8);
// // //                                                         const spaceNode = document.createTextNode(tabSpaces);
// // //                                                         range.insertNode(spaceNode);
// // //                                                         range.setStartAfter(spaceNode);
// // //                                                         selection.removeAllRanges();
// // //                                                         selection.addRange(range);
// // //                                                     }
// // //                                                 }}
// // //                                                 onBlur={(e) => {
// // //                                                     if (!e.currentTarget.textContent.trim()) {
// // //                                                         e.currentTarget.innerHTML = "\u00A0";
// // //                                                     }
// // //                                                 }}
// // //                                                 style={{
// // //                                                     display: "inline",
// // //                                                     minWidth: "2ch",
// // //                                                     maxWidth: "100%",
// // //                                                     outline: "none",
// // //                                                     background: "transparent",
// // //                                                     verticalAlign: "middle",
// // //                                                     whiteSpace: "pre-wrap",
// // //                                                     wordBreak: "break-word",
// // //                                                     fontFamily: "inherit",
// // //                                                     fontSize: "inherit",
// // //                                                     padding: "0 2px",
// // //                                                     boxSizing: "border-box",
// // //                                                     textDecoration: "underline",
// // //                                                     textDecorationSkipInk: "none",
// // //                                                     textAlign: "justify",
// // //                                                 }}
// // //                                             />
// // //                                         )}
// // //                                     </React.Fragment>
// // //                                 ))}
// // //                             </div>
// // //                         ) : (
// // //                             <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
// // //                                 {agreement?.fixedParts?.map((part, index) => (
// // //                                     <React.Fragment key={index}>
// // //                                         <span>{part}</span>
// // //                                         {index < agreement.editableValues.length && (
// // //                                             <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
// // //                                         )}
// // //                                     </React.Fragment>
// // //                                 ))}
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     {/* Fixed Headings */}
// // //                     {renderHeadings(fixedHeadings, setFixedHeadings, true)}

// // //                     {/* Custom Headings */}
// // //                     {/* {renderHeadings(headings, setHeadings, false)} */}

// // //                     {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
// // //                         <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// // //                             <h2>Lawyer Signature</h2>
// // //                             <Form_SignaturePad height={250} onSave={handleSignatureSave} />
// // //                         </div>
// // //                     )}

// // //                     <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// // //                         {(isclient && !isLocalSign) && (
// // //                             <div>
// // //                                 <h2>Client Signature</h2>
// // //                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     <div
// // //                         style={{
// // //                             display: "flex",
// // //                             flexDirection: "row",
// // //                             justifyContent: "space-between",
// // //                             alignItems: "flex-start",
// // //                             gap: "20px",
// // //                             width: "100%",
// // //                         }}
// // //                     >
// // //                         {savedSignature && (
// // //                             <div>
// // //                                 <h4>Lawyer Signature:</h4>
// // //                                 <img
// // //                                     src={savedSignature}
// // //                                     alt="Lawyer Signature"
// // //                                     style={{
// // //                                         maxWidth: "220px",
// // //                                         maxHeight: "300px",
// // //                                         border: "1px solid #ccc",
// // //                                         borderRadius: "4px",
// // //                                     }}
// // //                                 />
// // //                             </div>
// // //                         )}

// // //                         {savedClientSignature && (
// // //                             <div>
// // //                                 <h4>Client Signature:</h4>
// // //                                 <img
// // //                                     src={savedClientSignature}
// // //                                     alt="Client Signature"
// // //                                     style={{
// // //                                         maxWidth: "220px",
// // //                                         border: "1px solid #ccc",
// // //                                         borderRadius: "4px",
// // //                                     }}
// // //                                 />
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
// // //                         {(!isclient && savedClientSignature && savedLawyerSignature) && (
// // //                             <button
// // //                                 className="btn btn-sm btn-primary fw-bold"
// // //                                 onClick={handleUpdateLawyerSubmit}
// // //                                 style={{ width: "150px" }}
// // //                                 data-html2canvas-ignore="true"
// // //                             >
// // //                                 Save & Update Agreement
// // //                             </button>
// // //                         )}

// // //                         {editMode ? (
// // //                             <>
// // //                                 {(!isFormFilled && !savedClientSignature) ? (
// // //                                     <button
// // //                                         className="btn btn-sm btn-primary fw-bold"
// // //                                         onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
// // //                                         style={{ width: "150px" }}
// // //                                         data-html2canvas-ignore="true"
// // //                                     >
// // //                                         Save & Submit Agreement
// // //                                     </button>
// // //                                 ) : (
// // //                                     <button
// // //                                         className="btn btn-sm btn-primary fw-bold"
// // //                                         onClick={handleUpdateLawyerSubmit}
// // //                                         style={{ width: "150px" }}
// // //                                         data-html2canvas-ignore="true"
// // //                                     >
// // //                                         Save & Update Agreement
// // //                                     </button>
// // //                                 )}
// // //                             </>
// // //                         ) : (
// // //                             <>
// // //                                 {(isclient && !isLocalSign) && (
// // //                                     <button
// // //                                         className="btn btn-sm btn-primary fw-bold"
// // //                                         onClick={handleUpdateLawyerSubmit}
// // //                                         style={{ width: "150px" }}
// // //                                         data-html2canvas-ignore="true"
// // //                                     >
// // //                                         Save & Submit Signature
// // //                                     </button>
// // //                                 )}

// // //                                 {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
// // //                                     <button
// // //                                         className="btn btn-sm btn-primary fw-bold"
// // //                                         onClick={() => setEditMode(true)}
// // //                                         style={{ width: "150px" }}
// // //                                         data-html2canvas-ignore="true"
// // //                                     >
// // //                                         Edit Agreement
// // //                                     </button>
// // //                                 )}
// // //                             </>
// // //                         )}
// // //                     </div>
// // //                 </div>
// // //             ) : (
// // //                 <div className="text-center text-black py-5">No LFA Form Available.</div>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // export default LEA_Form;




























// // // import React, { useEffect, useState, useRef } from 'react';
// // // import axios from 'axios';
// // // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // // import { ApiEndPoint } from '../utils/utlis';
// // // import { useSelector } from 'react-redux';
// // // import ConfirmModal from '../../AlertModels/ConfirmModal';
// // // import { useAlert } from '../../../../Component/AlertContext';
// // // import Form_SignaturePad from './Form_Componets/SignaturePad';
// // // import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
// // // import { Dropdown, Form, InputGroup } from "react-bootstrap";
// // // import CEEditable from './CEEditable';
// // // import { v4 as uuidv4 } from "uuid";

// // // const LEA_Form = ({ token }) => {
// // //     const caseInfo = useSelector((state) => state.screen.Caseinfo);
// // //     const { showDataLoading } = useAlert();

// // //     const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
// // //     const [getDrafts, setGetDrafts] = useState(null);

// // //     // NEW: force remount key for contentEditable sections
// // //     const [draftKey, setDraftKey] = useState(0);

// // //     useEffect(() => {
// // //         FetchLFA();
// // //     }, []);

// // //     const [agreement, setAgreement] = useState({
// // //         fixedParts: [
// // //             'This Agreement ("Agreement") is entered into and shall become effective as of ',
// // //             ', by and between:\n\n',
// // //             ', with its principal place of business located at ',
// // //             ', represented herein by ',
// // //             ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
// // //             ' a national of ',
// // //             ', with their principal place of residence located ',
// // //             ' issued on: ',
// // //             ', having email ID: ',
// // //             ' and Contact Number: ',
// // //             ' (Hereinafter referred to as the "Client")'
// // //         ],
// // //         editableValues: [
// // //             new Date().toLocaleDateString('en-GB'),
// // //             'M/s AWS Legal Consultancy FZ-LLC',
// // //             '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
// // //             'Mr Aws M. Younis, Chairman',
// // //             'Dr. Ali Moustafa Mohamed Elba',
// // //             'Egypt',
// // //             'Dubai, United Arab Emirates',
// // //             'holding Emirates ID Number: ',
// // //             '784-1952-3620694-4',
// // //             new Date().toLocaleDateString('en-GB'),
// // //             'alyelba@yahoo.com',
// // //             '+971521356931'
// // //         ]
// // //     });

// // //     const [fixedHeadings, setFixedHeadings] = useState([
// // //         { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
// // //         { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
// // //     ]);

// // //     const [headings, setHeadings] = useState([]);

// // //     const [savedSignature, setSavedSignature] = useState(null);
// // //     const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
// // //     const [isFormFilled, setisFormFilled] = useState(false);
// // //     const [savedClientSignature, setSavedClientSignature] = useState(null);
// // //     const [isLocalSign, setIsLocalSign] = useState(false);
// // //     const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
// // //     const [dataList, setDataList] = useState([]);
// // //     const isclient = token?.Role === "client";

// // //     const FetchLFA = async () => {
// // //         showDataLoading(true);
// // //         try {
// // //             const response = await fetch(`${ApiEndPoint}getLFAForm/${caseInfo?._id}`);
// // //             if (!response.ok) {
// // //                 showDataLoading(false);
// // //                 throw new Error('Error fetching LFA');
// // //             }
// // //             const data = await response.json();
// // //             showDataLoading(false);

// // //             setAgreement(data.data.agreement);
// // //             setDataList(data.data);
// // //             setFixedHeadings(data.data.fixedHeadings);
// // //             setHeadings(data.data.headings);
// // //             setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
// // //             setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
// // //             setEditMode(false);
// // //             setisFormFilled(true);
// // //             setIsLocalSign(!!data.data?.ClientSignatureImage);
// // //             setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
// // //             setSavedLawyerSignature();

// // //             // ensure UI refreshes on initial fetch too
// // //             setDraftKey((k) => k + 1);
// // //         } catch (err) {
// // //             showDataLoading(false);
// // //         }

// // //         try {
// // //             const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
// // //             if (!response.ok) {
// // //                 showDataLoading(false);
// // //                 throw new Error('Error fetching LFA');
// // //             }
// // //             const data = await response.json();
// // //             setGetDrafts(data);
// // //         } catch (err) {
// // //             showDataLoading(false);
// // //         }
// // //     };

// // //     const handleSignatureSave = (dataUrl) => {
// // //         setSavedSignature(dataUrl);
// // //         setSavedLawyerSignature(dataUrl);
// // //         setIsLocalLawyerSign(true);
// // //     };

// // //     const handleClientSignatureSave = (dataUrl) => {
// // //         setSavedClientSignature(dataUrl);
// // //     };

// // //     const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

// // //     const handleEditableChange = (index, newValue) => {
// // //         const updated = [...agreement.editableValues];
// // //         updated[index] = newValue;
// // //         setAgreement({ ...agreement, editableValues: updated });
// // //     };

// // //     function base64ToFile(base64String, filename) {
// // //         const arr = base64String.split(",");
// // //         const mime = arr[0].match(/:(.*?);/)[1];
// // //         const bstr = atob(arr[1]);
// // //         let n = bstr.length;
// // //         const u8arr = new Uint8Array(n);
// // //         while (n--) {
// // //             u8arr[n] = bstr.charCodeAt(n);
// // //         }
// // //         return new File([u8arr], filename, { type: mime });
// // //     }

// // //     const handleClientSubmit = async () => {
// // //         try {
// // //             const formData = new FormData();
// // //             formData.append("caseId", caseInfo?._id || "");
// // //             formData.append("Islawyer", false);

// // //             formData.append(
// // //                 "agreement",
// // //                 JSON.stringify({
// // //                     fixedParts: agreement?.fixedParts,
// // //                     editableValues: agreement?.editableValues
// // //                 })
// // //             );

// // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // //                 title: h.title,
// // //                 points: h.points?.map(p => ({
// // //                     text: p.text || "",
// // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // //                 }))
// // //             }));

// // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // //             formData.append("headings", JSON.stringify(headings));

// // //             if (savedClientSignature) {
// // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // //                 method: "POST",
// // //                 body: formData
// // //             });

// // //             const data = await res.json();
// // //             if (data.success) {
// // //                 setEditMode(false);
// // //                 setIsLocalSign(true);
// // //             } else {
// // //                 console.error("❌ Failed:", data.message);
// // //             }
// // //         } catch (err) {
// // //             console.error("Error submitting form:", err);
// // //         }
// // //     };

// // //     const handleLawyerSubmit = async () => {


// // //         console.log(fixedHeadings)
// // //         try {
// // //             const formData = new FormData();
// // //             formData.append("caseId", caseInfo?._id || "");
// // //             formData.append("Islawyer", true);

// // //             formData.append(
// // //                 "agreement",
// // //                 JSON.stringify({
// // //                     fixedParts: agreement.fixedParts,
// // //                     editableValues: agreement.editableValues
// // //                 })
// // //             );

// // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // //                 title: h.title,
// // //                 points: h.points?.map(p => ({
// // //                     text: p.text || "",
// // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // //                 }))
// // //             }));

// // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // //             formData.append("headings", JSON.stringify(headings));

// // //             // FIXED: use lawyer signature (savedSignature), not savedClientSignature
// // //             if (savedSignature) {
// // //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // //                 method: "POST",
// // //                 body: formData
// // //             });

// // //             const data = await res.json();
// // //             if (data.success) {
// // //                 setEditMode(false);
// // //             } else {
// // //                 console.error("❌ Failed:", data.message);
// // //             }
// // //         } catch (err) {
// // //             console.error("Error submitting form:", err);
// // //         }
// // //     };

// // //     const handleUpdateClientSubmit = async () => {
// // //         try {
// // //             const formData = new FormData();
// // //             formData.append("caseId", caseInfo?._id || "");
// // //             formData.append("Islawyer", false);

// // //             formData.append(
// // //                 "agreement",
// // //                 JSON.stringify({
// // //                     fixedParts: agreement?.fixedParts,
// // //                     editableValues: agreement?.editableValues
// // //                 })
// // //             );

// // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // //                 title: h.title,
// // //                 points: h.points?.map(p => ({
// // //                     text: p.text || "",
// // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // //                 }))
// // //             }));

// // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // //             formData.append("headings", JSON.stringify(headings));

// // //             if (savedClientSignature) {
// // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// // //                 method: "POST",
// // //                 body: formData
// // //             });

// // //             const data = await res.json();
// // //             if (data.success) {
// // //                 setEditMode(false);
// // //             } else {
// // //                 console.error("❌ Failed:", data.message);
// // //             }
// // //         } catch (err) {
// // //             console.error("Error submitting form:", err);
// // //         }
// // //     };

// // //     const handleUpdateLawyerSubmit = async () => {
// // //         try {
// // //             const formData = new FormData();
// // //             formData.append("caseId", caseInfo?._id || "");
// // //             formData.append("Islawyer", !isclient);

// // //             formData.append(
// // //                 "agreement",
// // //                 JSON.stringify({
// // //                     fixedParts: agreement?.fixedParts || [],
// // //                     editableValues: agreement?.editableValues || {}
// // //                 })
// // //             );

// // //             const formattedHeadings = fixedHeadings?.map(h => ({
// // //                 title: h.title,
// // //                 points: h.points?.map(p => ({
// // //                     text: p.text || "",
// // //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// // //                 }))
// // //             })) || [];

// // //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// // //             formData.append("headings", JSON.stringify(headings || []));

// // //             if (!isclient && savedSignature) {
// // //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             if (isclient && savedClientSignature) {
// // //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// // //                 formData.append("file", file);
// // //             }

// // //             const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
// // //                 method: "PUT",
// // //                 body: formData
// // //             });

// // //             const data = await res.json();

// // //             if (data.success) {
// // //                 setEditMode(false);
// // //                 FetchLFA();
// // //             } else {
// // //                 console.error("❌ Failed:", data.message);
// // //             }
// // //         } catch (err) {
// // //             console.error("Error submitting form:", err);
// // //         }
// // //     };

// // //     const addHeading = () =>
// // //         setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

// // //     const updateHeadingTitle = (hIndex, value) => {
// // //         const updated = [...headings];
// // //         updated[hIndex].title = value;
// // //         setHeadings(updated);
// // //     };

// // //     const updatePoint = (setFn, list, hIndex, pIndex, value) => {
// // //         const updated = [...list];
// // //         updated[hIndex].points[pIndex].text = value;
// // //         setFn(updated);
// // //     };

// // //     const updateSubpoint = (setFn, list, hIndex, pIndex, sIndex, value) => {
// // //         const updated = [...list];
// // //         updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
// // //         setFn(updated);
// // //     };

// // //     const updateSubSubpoint = (setFn, list, hIndex, pIndex, sIndex, ssIndex, value) => {
// // //         const updated = [...list];
// // //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
// // //         setFn(updated);
// // //     };

// // //     const removePoint = (hIndex, pIndex) => {
// // //         const updated = [...headings];
// // //         updated[hIndex].points.splice(pIndex, 1);
// // //         setHeadings(updated);
// // //     };

// // //     const removeSubpoint = (hIndex, pIndex, sIndex) => {
// // //         const updated = [...headings];
// // //         updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
// // //         setHeadings(updated);
// // //     };

// // //     const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
// // //         const updated = [...headings];
// // //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
// // //         setHeadings(updated);
// // //     };

// // //     const [editHeadingIndex, setEditHeadingIndex] = useState(null);

// // //     const pdfRef = useRef(null);

// // //     const handleDownload = async () => {
// // //         if (!pdfRef.current) return;
// // //         try {
// // //             pdfRef.current.classList.add("pdf-mode");
// // //             const { default: html2pdf } = await import("html2pdf.js");
// // //             const opt = {
// // //                 margin: [12, 15, 12, 15],
// // //                 filename: "Legal_Fee_Agreement.pdf",
// // //                 image: { type: "jpeg", quality: 0.98 },
// // //                 html2canvas: { scale: 2.2, useCORS: true, scrollY: 0 },
// // //                 jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
// // //                 pagebreak: { mode: ["css", "legacy"] },
// // //             };
// // //             await html2pdf().set(opt).from(pdfRef.current).save();
// // //         } catch (e) {
// // //             console.error("PDF generation failed:", e);
// // //             alert("Sorry, unable to generate PDF. Check console for details.");
// // //         } finally {
// // //             pdfRef.current.classList.remove("pdf-mode");
// // //         }
// // //     };

// // //     // UPDATED: selecting a draft now forces a clean remount & syncs signatures
// // //     const handlePickDraft = (data) => {
// // //         setAgreement(data.agreement);
// // //         setFixedHeadings(data.fixedHeadings);
// // //         setHeadings(data.headings);
// // //         setSelectedDrafts(data);
// // //         // setSavedClientSignature(data?.ClientSignatureImage || "");
// // //         // setSavedSignature(data?.LawyerSignatureImage || "");
// // //         //  setEditMode(true);
// // //         setDraftKey((k) => k + 1); // force remount
// // //     };



// // //     // const renderHeadings = (list, setFn, isFixed = false) => {
// // //     //     // === helpers: insert/delete right AFTER current index ===

// // //     //     const deleteHeading = (index) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// // //     //             if (index < 0 || index >= updated.length) return prev;
// // //     //             updated.splice(index, 1);
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     const addHeadingAfter = (hIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// // //     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
// // //     //             updated.splice(hIndex + 1, 0, newHeading);
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     const addPointAfter = (hIndex, pIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = [...prev];
// // //     //             const heading = updated[hIndex];
// // //     //             if (!heading) return prev;

// // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // //     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
// // //     //             updated[hIndex] = { ...heading, points: pts };
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     const deletePoint = (hIndex, pIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = [...prev];
// // //     //             const heading = updated[hIndex];
// // //     //             if (!heading) return prev;

// // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // //     //             if (pIndex < 0 || pIndex >= pts.length) return prev;

// // //     //             pts.splice(pIndex, 1);
// // //     //             updated[hIndex] = { ...heading, points: pts };
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     const addPointAtEnd = (hIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = [...prev];
// // //     //             const heading = updated[hIndex];
// // //     //             if (!heading) return prev;

// // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // //     //             pts.push({ text: "", subpoints: [] });
// // //     //             updated[hIndex] = { ...heading, points: pts };
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     return list?.map((heading, hIndex) => (
// // //     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// // //     //             <div
// // //     //                 className="heading-row"
// // //     //                 style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}
// // //     //             >
// // //     //                 <div
// // //     //                     className="idx"
// // //     //                     style={{ width: "20px", minWidth: "10px", textAlign: "right", fontWeight: 600 }}
// // //     //                 >
// // //     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
// // //     //                 </div>

// // //     //                 <div className="form-control bg-white p-1 fw-bold" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
// // //     //                     {editMode && !savedClientSignature ? (
// // //     //                         <p
// // //     //                             ref={(el) => {
// // //     //                                 if (el && !el.innerHTML.trim()) el.innerHTML = heading.title || "\u00A0";
// // //     //                             }}
// // //     //                             contentEditable
// // //     //                             suppressContentEditableWarning
// // //     //                             onInput={(e) => {
// // //     //                                 const html = e.currentTarget.innerHTML;
// // //     //                                 const updated = [...list];
// // //     //                                 updated[hIndex].title = html;
// // //     //                                 setFn(updated);
// // //     //                             }}
// // //     //                             onKeyDown={(e) => {
// // //     //                                 if (e.ctrlKey && e.key.toLowerCase() === "b") {
// // //     //                                     e.preventDefault();
// // //     //                                     document.execCommand("bold");
// // //     //                                 }
// // //     //                                 if (e.key === "Tab") {
// // //     //                                     e.preventDefault();
// // //     //                                     const selection = window.getSelection();
// // //     //                                     if (!selection.rangeCount) return;
// // //     //                                     const range = selection.getRangeAt(0);
// // //     //                                     const tabSpaces = "\u00A0".repeat(8);
// // //     //                                     const spaceNode = document.createTextNode(tabSpaces);
// // //     //                                     range.insertNode(spaceNode);
// // //     //                                     range.setStartAfter(spaceNode);
// // //     //                                     selection.removeAllRanges();
// // //     //                                     selection.addRange(range);
// // //     //                                 }
// // //     //                             }}
// // //     //                             onBlur={(e) => {
// // //     //                                 if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
// // //     //                             }}
// // //     //                             style={{
// // //     //                                 display: "inline-block",
// // //     //                                 minHeight: "40px",
// // //     //                                 width: "100%",
// // //     //                                 outline: "none",
// // //     //                                 background: "transparent",
// // //     //                                 whiteSpace: "pre-wrap",
// // //     //                                 wordBreak: "break-word",
// // //     //                                 fontFamily: "inherit",
// // //     //                                 fontSize: "inherit",
// // //     //                                 fontWeight: "bold",
// // //     //                                 padding: "4px 6px",
// // //     //                                 border: "1px solid #ccc",
// // //     //                                 borderRadius: "4px",
// // //     //                                 boxSizing: "border-box",
// // //     //                                 textAlign: "justify",
// // //     //                             }}
// // //     //                         />
// // //     //                     ) : (
// // //     //                         <div>
// // //     //                             <React.Fragment key={hIndex}>
// // //     //                                 <span>{heading.label || ""}</span>
// // //     //                                 <span dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// // //     //                             </React.Fragment>
// // //     //                         </div>
// // //     //                     )}
// // //     //                 </div>

// // //     //                 {/* ACTIONS: now insert AFTER current heading */}
// // //     //                 <div
// // //     //                     style={{ display: editMode && !savedClientSignature ? "flex" : "none", gap: "6px" }}
// // //     //                     data-html2canvas-ignore="true"
// // //     //                 >
// // //     //                     <div
// // //     //                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(4, 2, 2, 0.2)", cursor: "pointer" }}
// // //     //                         onClick={() => addHeadingAfter(hIndex)}
// // //     //                     >
// // //     //                         <BsPlus />
// // //     //                     </div>
// // //     //                     <div
// // //     //                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// // //     //                         onClick={() => deleteHeading(hIndex)}
// // //     //                     >
// // //     //                         <BsDash />
// // //     //                     </div>
// // //     //                 </div>
// // //     //             </div>

// // //     //             <ul className="list-unstyled ps-2 ps-md-3">
// // //     //                 {heading.points?.map((point, pIndex) => (
// // //     //                     <li key={pIndex}>
// // //     //                         <div className="d-flex flex-wrap align-items-center mb-2">
// // //     //                             {editMode && !savedClientSignature ? (
// // //     //                                 <p
// // //     //                                     ref={(el) => {
// // //     //                                         if (el && !el.innerHTML.trim()) el.innerHTML = point.text || "\u00A0";
// // //     //                                     }}
// // //     //                                     contentEditable
// // //     //                                     suppressContentEditableWarning
// // //     //                                     onInput={(e) => {
// // //     //                                         const html = e.currentTarget.innerHTML;
// // //     //                                         const updated = [...list];
// // //     //                                         updated[hIndex].points[pIndex].text = html;
// // //     //                                         setFn(updated);
// // //     //                                     }}
// // //     //                                     onKeyDown={(e) => {
// // //     //                                         if (e.ctrlKey && e.key.toLowerCase() === "b") {
// // //     //                                             e.preventDefault();
// // //     //                                             document.execCommand("bold");
// // //     //                                         }
// // //     //                                         if (e.key === "Tab") {
// // //     //                                             e.preventDefault();
// // //     //                                             const selection = window.getSelection();
// // //     //                                             if (!selection.rangeCount) return;
// // //     //                                             const range = selection.getRangeAt(0);
// // //     //                                             const tabSpaces = "\u00A0".repeat(8);
// // //     //                                             const spaceNode = document.createTextNode(tabSpaces);
// // //     //                                             range.insertNode(spaceNode);
// // //     //                                             range.setStartAfter(spaceNode);
// // //     //                                             selection.removeAllRanges();
// // //     //                                             selection.addRange(range);
// // //     //                                         }
// // //     //                                     }}
// // //     //                                     onBlur={(e) => {
// // //     //                                         if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
// // //     //                                     }}
// // //     //                                     style={{
// // //     //                                         display: "inline-block",
// // //     //                                         minHeight: "40px",
// // //     //                                         width: "100%",
// // //     //                                         outline: "none",
// // //     //                                         background: "transparent",
// // //     //                                         whiteSpace: "pre-wrap",
// // //     //                                         wordBreak: "break-word",
// // //     //                                         fontFamily: "inherit",
// // //     //                                         fontSize: "inherit",
// // //     //                                         padding: "4px 6px",
// // //     //                                         border: "1px solid #ddd",
// // //     //                                         borderRadius: "4px",
// // //     //                                         boxSizing: "border-box",
// // //     //                                         textAlign: "justify",
// // //     //                                     }}
// // //     //                                 />
// // //     //                             ) : (
// // //     //                                 <div className="" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
// // //     //                                     <React.Fragment key={pIndex}>
// // //     //                                         <span>{point.label || ""}</span>
// // //     //                                         <span dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// // //     //                                     </React.Fragment>
// // //     //                                 </div>
// // //     //                             )}

// // //     //                             {editMode && !savedClientSignature && (
// // //     //                                 <>
// // //     //                                     {/* INSERT new point AFTER current pIndex */}
// // //     //                                     <div
// // //     //                                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// // //     //                                         onClick={() => addPointAfter(hIndex, pIndex)}
// // //     //                                         data-html2canvas-ignore="true"
// // //     //                                     >
// // //     //                                         <BsPlus />
// // //     //                                     </div>
// // //     //                                     <div
// // //     //                                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// // //     //                                         onClick={() => deletePoint(hIndex, pIndex)}
// // //     //                                         data-html2canvas-ignore="true"
// // //     //                                     >
// // //     //                                         <BsDash />
// // //     //                                     </div>
// // //     //                                 </>
// // //     //                             )}
// // //     //                         </div>

// // //     //                         {/* subpoints UI remains same */}
// // //     //                         {Array.isArray(point?.subpoints) && point.subpoints.length > 0 && (
// // //     //                             <div style={{ margin: "4px 0 8px 0", paddingLeft: "16px", paddingRight: "16px" }}>
// // //     //                                 {point.subpoints.map((sp, sIndex) => {
// // //     //                                     const html = typeof sp === "string" ? sp : sp?.text || "";
// // //     //                                     return (
// // //     //                                         <table
// // //     //                                             key={sIndex}
// // //     //                                             style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", margin: "2px 0" }}
// // //     //                                         >
// // //     //                                             <tbody>
// // //     //                                                 <tr>
// // //     //                                                     <td style={{ width: "14px", minWidth: "14px", textAlign: "center", verticalAlign: "top" }}>
// // //     //                                                         •
// // //     //                                                     </td>
// // //     //                                                     <td style={{ paddingLeft: "8px", textAlign: "justify", wordBreak: "break-word" }}>
// // //     //                                                         <div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
// // //     //                                                     </td>
// // //     //                                                 </tr>
// // //     //                                             </tbody>
// // //     //                                         </table>
// // //     //                                     );
// // //     //                                 })}
// // //     //                             </div>
// // //     //                         )}
// // //     //                     </li>
// // //     //                 ))}

// // //     //                 {editMode && !savedClientSignature && (
// // //     //                     <li>
// // //     //                         <button
// // //     //                             type="button"
// // //     //                             className="btn btn-outline-primary btn-sm"
// // //     //                             onClick={() => addPointAtEnd(hIndex)}
// // //     //                             data-html2canvas-ignore="true"
// // //     //                         >
// // //     //                             + Add Point
// // //     //                         </button>
// // //     //                     </li>
// // //     //                 )}
// // //     //             </ul>
// // //     //         </div>
// // //     //     ));
// // //     // };




// // //     // const renderHeadings = (list, setFn, isFixed = false) => {
// // //     //     // === helpers ===
// // //     //     const deleteHeading = (hIndex) => {
// // //     //         if (!editMode) return;

// // //     //         setFn((prev) => {
// // //     //             if (!Array.isArray(prev)) return prev;

// // //     //             const updated = [...prev];
// // //     //             updated.splice(hIndex, 1); // sirf targeted heading delete
// // //     //             return updated;
// // //     //         });

// // //     //         // focus shifting (optional)
// // //     //         setTimeout(() => {
// // //     //             const targetIdx = Math.max(0, hIndex - 1);
// // //     //             const editors = document.querySelectorAll('[data-head-editor="1"]');
// // //     //             if (editors && editors[targetIdx]) {
// // //     //                 editors[targetIdx].focus();
// // //     //             }
// // //     //         }, 0);
// // //     //     };

// // //     //     const addHeadingAfter = (hIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// // //     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
// // //     //             updated.splice(hIndex + 1, 0, newHeading);
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     const addPointAfter = (hIndex, pIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = [...prev];
// // //     //             const heading = updated[hIndex];
// // //     //             if (!heading) return prev;

// // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // //     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
// // //     //             updated[hIndex] = { ...heading, points: pts };
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     const deletePoint = (hIndex, pIndex) => {
// // //     //         if (!editMode) return;

// // //     //         setFn((prev) => {
// // //     //             if (!Array.isArray(prev)) return prev;

// // //     //             const updated = [...prev];
// // //     //             const heading = updated[hIndex];
// // //     //             if (!heading || !Array.isArray(heading.points)) return prev;

// // //     //             const newPoints = [...heading.points];
// // //     //             newPoints.splice(pIndex, 1); // sirf targeted point delete

// // //     //             updated[hIndex] = { ...heading, points: newPoints };
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     const addPointAtEnd = (hIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = [...prev];
// // //     //             const heading = updated[hIndex];
// // //     //             if (!heading) return prev;

// // //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// // //     //             pts.push({ text: "", subpoints: [] });
// // //     //             updated[hIndex] = { ...heading, points: pts };
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     // === UI ===
// // //     //     return list?.map((heading, hIndex) => (
// // //     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// // //     //             {/* Heading Title */}
// // //     //             <div className="heading-row" style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}>
// // //     //                 <div className="idx" style={{ width: "20px", textAlign: "right", fontWeight: 600 }}>
// // //     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
// // //     //                 </div>

// // //     //                 {editMode && !savedClientSignature ? (

// // //     //                     <CEEditable
// // //     //                         tag="h4"
// // //     //                         html={heading.title}
// // //     //                         placeholder={"\\u00A0"}
// // //     //                         className="form-control bg-white p-1 fw-bold"
// // //     //                         style={{
// // //     //                             whiteSpace: "pre-wrap",
// // //     //                             textAlign: "justify",
// // //     //                             display: "inline-block",
// // //     //                             minHeight: "40px",
// // //     //                             width: "100%",
// // //     //                             outline: "none",
// // //     //                             background: "transparent",
// // //     //                             wordBreak: "break-word",
// // //     //                             fontFamily: "inherit",
// // //     //                             fontSize: "inherit",
// // //     //                             fontWeight: "bold",
// // //     //                             padding: "4px 6px",
// // //     //                             border: "1px solid #ccc",
// // //     //                             borderRadius: "4px",
// // //     //                             boxSizing: "border-box",
// // //     //                         }}
// // //     //                         onChange={(newHtml) => {
// // //     //                             const updated = [...list];
// // //     //                             updated[hIndex].title = newHtml;
// // //     //                             setFn(updated);
// // //     //                         }}
// // //     //                         onEmpty={() => {
// // //     //                             // If you also want "empty = delete":
// // //     //                             // setFn(prev => {
// // //     //                             //   const next = Array.isArray(prev) ? [...prev] : [];
// // //     //                             //   next.splice(hIndex, 1);
// // //     //                             //   return next;
// // //     //                             // });
// // //     //                         }}
// // //     //                         data-head-editor="1"   // <— add this so we can focus after delete
// // //     //                     />


// // //     //                 ) : (
// // //     //                     <div className="fw-bold" style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// // //     //                 )}

// // //     //                 {editMode && !savedClientSignature && (
// // //     //                     <div style={{ display: "flex", gap: "6px" }} data-html2canvas-ignore="true">
// // //     //                         <div style={{ color: "green", cursor: "pointer" }} onClick={() => addHeadingAfter(hIndex)}>
// // //     //                             <BsPlus />
// // //     //                         </div>
// // //     //                         <div style={{ color: "red", cursor: "pointer" }} onClick={() => deleteHeading(hIndex)}>
// // //     //                             <BsDash />
// // //     //                         </div>
// // //     //                     </div>
// // //     //                 )}
// // //     //             </div>

// // //     //             {/* Points */}
// // //     //             <ul className="list-unstyled ps-2 ps-md-3">
// // //     //                 {heading.points?.map((point, pIndex) => (
// // //     //                     <li key={pIndex}>
// // //     //                         <div className="d-flex align-items-center mb-2">
// // //     //                             {editMode && !savedClientSignature ? (
// // //     //                                 <p
// // //     //                                     contentEditable
// // //     //                                     suppressContentEditableWarning
// // //     //                                     onInput={(e) => {
// // //     //                                         const updated = [...list];
// // //     //                                         updated[hIndex].points[pIndex].text = e.currentTarget.innerHTML;
// // //     //                                         setFn(updated);
// // //     //                                     }}
// // //     //                                     style={{
// // //     //                                         minHeight: "30px",
// // //     //                                         width: "100%",
// // //     //                                         outline: "none",
// // //     //                                         border: "1px solid #ddd",
// // //     //                                         borderRadius: "4px",
// // //     //                                         padding: "4px 6px",
// // //     //                                         textAlign: "justify"
// // //     //                                     }}
// // //     //                                     dangerouslySetInnerHTML={{ __html: point.text || "" }}
// // //     //                                 />
// // //     //                             ) : (
// // //     //                                 <div style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// // //     //                             )}

// // //     //                             {editMode && !savedClientSignature && (
// // //     //                                 <>
// // //     //                                     <div style={{ color: "green", cursor: "pointer" }} onClick={() => addPointAfter(hIndex, pIndex)}>
// // //     //                                         <BsPlus />
// // //     //                                     </div>
// // //     //                                     <div style={{ color: "red", cursor: "pointer" }} onClick={() => deletePoint(hIndex, pIndex)}>
// // //     //                                         <BsDash />
// // //     //                                     </div>
// // //     //                                 </>
// // //     //                             )}
// // //     //                         </div>
// // //     //                     </li>
// // //     //                 ))}

// // //     //                 {editMode && !savedClientSignature && (
// // //     //                     <li>
// // //     //                         <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => addPointAtEnd(hIndex)} data-html2canvas-ignore="true">
// // //     //                             + Add Point
// // //     //                         </button>
// // //     //                     </li>
// // //     //                 )}
// // //     //             </ul>
// // //     //         </div>
// // //     //     ));
// // //     // };




// // //     // const renderHeadings = (list, setFn, isFixed = false) => {
// // //     //     // Add Heading
// // //     //     const addHeadingAfter = (hIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// // //     //             const newHeading = { id: uuidv4(), title: "New Section", points: [{ id: uuidv4(), text: "", subpoints: [] }] };
// // //     //             updated.splice(hIndex + 1, 0, newHeading);
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     // Add Point
// // //     //     const addPointAfter = (hIndex, pIndex) => {
// // //     //         if (!editMode) return;
// // //     //         setFn((prev) => {
// // //     //             const updated = [...prev];
// // //     //             const heading = updated[hIndex];
// // //     //             if (!heading) return prev;

// // //     //             const pts = [...(heading.points || [])];
// // //     //             pts.splice(pIndex + 1, 0, { id: uuidv4(), text: "", subpoints: [] });
// // //     //             updated[hIndex] = { ...heading, points: pts };
// // //     //             return updated;
// // //     //         });
// // //     //     };

// // //     //     // === UI ===
// // //     //     return list?.map((heading, hIndex) => (
// // //     //         <div key={heading.id} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// // //     //             {/* Heading Title */}
// // //     //             <div className="heading-row d-flex align-items-center mb-2">
// // //     //                 <div className="idx fw-bold me-2">{isFixed ? hIndex + 1 : hIndex + 11}.</div>

// // //     //                 {editMode && !savedClientSignature ? (
// // //     //                     <CEEditable
// // //     //                         key={heading.id}   // force re-init editor
// // //     //                         html={heading.title}
// // //     //                         onChange={(newHtml) => {
// // //     //                             setFn((prev) => {
// // //     //                                 const updated = [...prev];
// // //     //                                 updated[hIndex].title = newHtml;
// // //     //                                 return updated;
// // //     //                             });
// // //     //                         }}
// // //     //                     />
// // //     //                 ) : (
// // //     //                     <div className="fw-bold" dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// // //     //                 )}
// // //     //             </div>

// // //     //             {/* Points */}
// // //     //             <ul className="list-unstyled ps-3">
// // //     //                 {heading.points?.map((point, pIndex) => (
// // //     //                     <li key={point.id}>
// // //     //                         {editMode && !savedClientSignature ? (
// // //     //                             <CEEditable
// // //     //                                 key={point.id}   // force re-init editor
// // //     //                                 html={point.text}
// // //     //                                 onChange={(newHtml) => {
// // //     //                                     setFn((prev) => {
// // //     //                                         const updated = [...prev];
// // //     //                                         updated[hIndex].points[pIndex].text = newHtml;
// // //     //                                         return updated;
// // //     //                                     });
// // //     //                                 }}
// // //     //                             />
// // //     //                         ) : (
// // //     //                             <div dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// // //     //                         )}
// // //     //                     </li>
// // //     //                 ))}
// // //     //             </ul>
// // //     //         </div>
// // //     //     ));
// // //     // };



// // //     // ---- renderHeadings.jsx ----


// // //     const renderHeadings = (list, setFn, isFixed = false) => {
// // //         if (!Array.isArray(list)) return null;

// // //         // Step 1: Array -> HTML
// // //         const combinedHtml = list
// // //             .map(
// // //                 (heading, hIndex) => `
// // //                 <p><strong><ul>${heading.title || ""}</ul></strong></p>
// // //                 <ul>
// // //                     ${(heading.points || [])
// // //                         .map((p) => `<li>${p.text || ""}</li>`)
// // //                         .join("")}
// // //                 </ul>
// // //             `
// // //             )
// // //             .join("");

// // //         // Step 2: HTML -> Array
// // //         const parseHtmlToArray = (html) => {
// // //             const parser = new DOMParser();
// // //             const doc = parser.parseFromString(html, "text/html");
// // //             const sections = [];

// // //             let currentHeading = null;

// // //             doc.body.childNodes.forEach((node) => {
// // //                 if (node.nodeName === "P") {
// // //                     // extract heading text (remove numbering if any)
// // //                     const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
// // //                     currentHeading = { title: headingText, points: [] };
// // //                     sections.push(currentHeading);
// // //                 } else if (node.nodeName === "UL" && currentHeading) {
// // //                     const points = Array.from(node.querySelectorAll("li")).map((li) => ({
// // //                         text: li.innerHTML,
// // //                         subpoints: [],
// // //                     }));
// // //                     currentHeading.points = points;
// // //                 }
// // //             });

// // //             return sections;
// // //         };

// // //         return (
// // //             <div className="section border p-2 rounded bg-light">
// // //                 {editMode ? (
// // //                     <CEEditable
// // //                         list={list} // 👈 ab array directly de sakte ho
// // //                         onChange={(updatedList) => setFixedHeadings(updatedList)}
// // //                         disable={(isFormFilled && !editMode)}
// // //                     />
// // //                 ) : (
// // //                     <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
// // //                 )}
// // //             </div>
// // //         );
// // //     };


// // //     return (
// // //         <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
// // //             <style>{`
// // //         .word-paper { color: #000; line-height: 1.4; }
// // //         .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
// // //         .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
// // //         .word-paper .form-control,
// // //         .word-paper [contenteditable="true"],
// // //         .word-paper ul.sub-bullets,
// // //         .word-paper ul.sub-bullets li { text-align: justify; }
// // //         .word-paper.pdf-mode * { box-shadow: none !important; }
// // //         .word-paper.pdf-mode .card,
// // //         .word-paper.pdf-mode .form-control,
// // //         .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
// // //         .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }
// // //         .word-paper.pdf-mode ul,
// // //         .word-paper.pdf-mode ol { list-style: revert !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// // //         .word-paper ul.sub-bullets { list-style-type: disc !important; list-style-position: outside !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// // //         .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
// // //         .word-paper .list-unstyled ul.sub-bullets,
// // //         .word-paper .form-control ul.sub-bullets { list-style-type: disc !important; padding-left: 24px !important; }
// // //         @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
// // //       `}</style>

// // //             {/* toolbar */}
// // //             <div className="d-flex justify-content-end mb-3" data-html2canvas-ignore="true">
// // //                 <button
// // //                     className="btn btn-primary d-flex align-items-center"
// // //                     onClick={handleDownload}
// // //                     style={{ padding: "8px 16px" }}
// // //                     data-html2canvas-ignore="true"
// // //                 >
// // //                     <BsDownload className="me-2" />
// // //                     Download PDF
// // //                 </button>
// // //             </div>

// // //             {(!isclient || isFormFilled) ? (
// // //                 // IMPORTANT: key={draftKey} forces remount so new draft values appear
// // //                 <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey}>
// // //                     {/* Header */}
// // //                     <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
// // //                         <img
// // //                             src="logo.png"
// // //                             alt="Logo"
// // //                             className="me-2 me-md-3 mb-2 mb-md-0"
// // //                             style={{ height: "50px" }}
// // //                         />
// // //                         <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
// // //                     </div>

// // //                     {token?.Role !== "client" && (
// // //                         // <Form.Group className="mb-3">
// // //                         //     <Form.Label>Drafts <span className="text-danger"></span></Form.Label>
// // //                         //     <InputGroup>
// // //                         //         <Dropdown className="w-100">
// // //                         //             <Dropdown.Toggle
// // //                         //                 variant="outline-secondary"
// // //                         //                 id="dropdown-practice-area"
// // //                         //                 // ENABLED now: allow switching drafts anytime
// // //                         //                 className="w-100 text-start d-flex justify-content-between align-items-center"
// // //                         //             >
// // //                         //                 {selectedDrafts === "Select Draft" ? "Select Draft" : `${selectedDrafts?.CaseNumber}`}
// // //                         //             </Dropdown.Toggle>

// // //                         //             <Dropdown.Menu className="w-100">
// // //                         //                 {getDrafts?.map((data, index) => (
// // //                         //                     <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// // //                         //                         {data?.CaseNumber}
// // //                         //                     </Dropdown.Item>
// // //                         //                 ))}
// // //                         //             </Dropdown.Menu>
// // //                         //         </Dropdown>
// // //                         //     </InputGroup>
// // //                         // </Form.Group>


// // //                         <Form.Group className="mb-3">
// // //                             <Form.Label>Drafts</Form.Label>

// // //                             <Dropdown className="w-100">
// // //                                 <Dropdown.Toggle
// // //                                     variant="outline-secondary"
// // //                                     disabled={isFormFilled}
// // //                                     id="dropdown-practice-area"
// // //                                     className="w-100 text-start d-flex justify-content-between align-items-center"
// // //                                 >
// // //                                     {selectedDrafts === "Select Draft"
// // //                                         ? "Select Draft"
// // //                                         : `${selectedDrafts?.CaseNumber}`}
// // //                                 </Dropdown.Toggle>

// // //                                 <Dropdown.Menu className="w-100" disabled={isFormFilled}>


// // //                                     {getDrafts?.map((data, index) => (
// // //                                         <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// // //                                             {data?.CaseNumber}
// // //                                         </Dropdown.Item>
// // //                                     ))}
// // //                                 </Dropdown.Menu>
// // //                             </Dropdown>
// // //                         </Form.Group>

// // //                     )}

// // //                     <div className="card p-2 p-md-4 shadow-sm mb-4">
// // //                         <label className="form-label fw-bold fs-5 text-break">Agreement</label>
// // //                         {editMode && !isclient && !savedClientSignature ? (
// // //                             <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
// // //                                 {agreement?.fixedParts?.map((part, index) => (
// // //                                     <React.Fragment key={index}>
// // //                                         <span>{part}</span>
// // //                                         {index < agreement.editableValues.length && (
// // //                                             <p
// // //                                                 ref={(el) => {
// // //                                                     if (el && !el.innerHTML.trim()) {
// // //                                                         el.innerHTML = agreement.editableValues[index] || "\u00A0";
// // //                                                     }
// // //                                                 }}
// // //                                                 contentEditable
// // //                                                 suppressContentEditableWarning
// // //                                                 onInput={(e) => {
// // //                                                     const html = e.currentTarget.innerHTML;
// // //                                                     handleEditableChange(index, html);
// // //                                                 }}
// // //                                                 onKeyDown={(e) => {
// // //                                                     if (e.ctrlKey && e.key.toLowerCase() === "b") {
// // //                                                         e.preventDefault();
// // //                                                         document.execCommand("bold");
// // //                                                     }
// // //                                                     if (e.key === "Tab") {
// // //                                                         e.preventDefault();
// // //                                                         const selection = window.getSelection();
// // //                                                         if (!selection.rangeCount) return;
// // //                                                         const range = selection.getRangeAt(0);
// // //                                                         const tabSpaces = "\u00A0".repeat(8);
// // //                                                         const spaceNode = document.createTextNode(tabSpaces);
// // //                                                         range.insertNode(spaceNode);
// // //                                                         range.setStartAfter(spaceNode);
// // //                                                         selection.removeAllRanges();
// // //                                                         selection.addRange(range);
// // //                                                     }
// // //                                                 }}
// // //                                                 onBlur={(e) => {
// // //                                                     if (!e.currentTarget.textContent.trim()) {
// // //                                                         e.currentTarget.innerHTML = "\u00A0";
// // //                                                     }
// // //                                                 }}
// // //                                                 style={{
// // //                                                     display: "inline",
// // //                                                     minWidth: "2ch",
// // //                                                     maxWidth: "100%",
// // //                                                     outline: "none",
// // //                                                     background: "transparent",
// // //                                                     verticalAlign: "middle",
// // //                                                     whiteSpace: "pre-wrap",
// // //                                                     wordBreak: "break-word",
// // //                                                     fontFamily: "inherit",
// // //                                                     fontSize: "inherit",
// // //                                                     padding: "0 2px",
// // //                                                     boxSizing: "border-box",
// // //                                                     textDecoration: "underline",
// // //                                                     textDecorationSkipInk: "none",
// // //                                                     textAlign: "justify",
// // //                                                 }}
// // //                                             />
// // //                                         )}
// // //                                     </React.Fragment>
// // //                                 ))}
// // //                             </div>
// // //                         ) : (
// // //                             <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
// // //                                 {agreement?.fixedParts?.map((part, index) => (
// // //                                     <React.Fragment key={index}>
// // //                                         <span>{part}</span>
// // //                                         {index < agreement.editableValues.length && (
// // //                                             <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
// // //                                         )}
// // //                                     </React.Fragment>
// // //                                 ))}
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     {/* Fixed Headings */}
// // //                     {renderHeadings(fixedHeadings, setFixedHeadings, true)}

// // //                     {/* Custom Headings */}
// // //                     {/* {renderHeadings(headings, setHeadings, false)} */}

// // //                     {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
// // //                         <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// // //                             <h2>Lawyer Signature</h2>
// // //                             <Form_SignaturePad height={250} onSave={handleSignatureSave} />
// // //                         </div>
// // //                     )}

// // //                     <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// // //                         {(isclient && !isLocalSign) && (
// // //                             <div>
// // //                                 <h2>Client Signature</h2>
// // //                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     <div
// // //                         style={{
// // //                             display: "flex",
// // //                             flexDirection: "row",
// // //                             justifyContent: "space-between",
// // //                             alignItems: "flex-start",
// // //                             gap: "20px",
// // //                             width: "100%",
// // //                         }}
// // //                     >
// // //                         {savedSignature && (
// // //                             <div>
// // //                                 <h4>Lawyer Signature:</h4>
// // //                                 <img
// // //                                     src={savedSignature}
// // //                                     alt="Lawyer Signature"
// // //                                     style={{
// // //                                         maxWidth: "220px",
// // //                                         maxHeight: "300px",
// // //                                         border: "1px solid #ccc",
// // //                                         borderRadius: "4px",
// // //                                     }}
// // //                                 />
// // //                             </div>
// // //                         )}

// // //                         {savedClientSignature && (
// // //                             <div>
// // //                                 <h4>Client Signature:</h4>
// // //                                 <img
// // //                                     src={savedClientSignature}
// // //                                     alt="Client Signature"
// // //                                     style={{
// // //                                         maxWidth: "220px",
// // //                                         border: "1px solid #ccc",
// // //                                         borderRadius: "4px",
// // //                                     }}
// // //                                 />
// // //                             </div>
// // //                         )}
// // //                     </div>

// // //                     <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
// // //                         {(!isclient && savedClientSignature && savedLawyerSignature) && (
// // //                             <button
// // //                                 className="btn btn-sm btn-primary fw-bold"
// // //                                 onClick={handleUpdateLawyerSubmit}
// // //                                 style={{ width: "150px" }}
// // //                                 data-html2canvas-ignore="true"
// // //                             >
// // //                                 Save & Update Agreement
// // //                             </button>
// // //                         )}

// // //                         {editMode ? (
// // //                             <>
// // //                                 {(!isFormFilled && !savedClientSignature) ? (
// // //                                     <button
// // //                                         className="btn btn-sm btn-primary fw-bold"
// // //                                         onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
// // //                                         style={{ width: "150px" }}
// // //                                         data-html2canvas-ignore="true"
// // //                                     >
// // //                                         Save & Submit Agreement
// // //                                     </button>
// // //                                 ) : (
// // //                                     <button
// // //                                         className="btn btn-sm btn-primary fw-bold"
// // //                                         onClick={handleUpdateLawyerSubmit}
// // //                                         style={{ width: "150px" }}
// // //                                         data-html2canvas-ignore="true"
// // //                                     >
// // //                                         Save & Update Agreement
// // //                                     </button>
// // //                                 )}
// // //                             </>
// // //                         ) : (
// // //                             <>
// // //                                 {(isclient && !isLocalSign) && (
// // //                                     <button
// // //                                         className="btn btn-sm btn-primary fw-bold"
// // //                                         onClick={handleUpdateLawyerSubmit}
// // //                                         style={{ width: "150px" }}
// // //                                         data-html2canvas-ignore="true"
// // //                                     >
// // //                                         Save & Submit Signature
// // //                                     </button>
// // //                                 )}

// // //                                 {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
// // //                                     <button
// // //                                         className="btn btn-sm btn-primary fw-bold"
// // //                                         onClick={() => setEditMode(true)}
// // //                                         style={{ width: "150px" }}
// // //                                         data-html2canvas-ignore="true"
// // //                                     >
// // //                                         Edit Agreement
// // //                                     </button>
// // //                                 )}
// // //                             </>
// // //                         )}
// // //                     </div>
// // //                 </div>
// // //             ) : (
// // //                 <div className="text-center text-black py-5">No LFA Form Available.</div>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // export default LEA_Form;




// // //LFA_form 
// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import { ApiEndPoint } from '../utils/utlis';
// // import { useSelector } from 'react-redux';
// // import ConfirmModal from '../../AlertModels/ConfirmModal';
// // import { useAlert } from '../../../../Component/AlertContext';
// // import Form_SignaturePad from './Form_Componets/SignaturePad';
// // import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
// // import { Dropdown, Form, InputGroup } from "react-bootstrap";
// // import CEEditable from './CEEditable';
// // import { v4 as uuidv4 } from "uuid";
// // import { jsPDF } from "jspdf";
// // import logo from '../../../Pages/Images/logo.png';

// // const LEA_Form = ({ token }) => {
// //     const [isHovered, setIsHovered] = useState(false);
// //     const caseInfo = useSelector((state) => state.screen.Caseinfo);
// //     const { showDataLoading } = useAlert();

// //     const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
// //     const [getDrafts, setGetDrafts] = useState(null);

// //     // NEW: force remount key for contentEditable sections
// //     const [draftKey, setDraftKey] = useState(0);

// //     useEffect(() => {
// //         FetchLFA();
// //     }, []);

// //     const [agreement, setAgreement] = useState({
// //         fixedParts: [
// //             'This Agreement ("Agreement") is entered into and shall become effective as of ',
// //             ', by and between:\n\n',
// //             ', with its principal place of business located at ',
// //             ', represented herein by ',
// //             ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
// //             ' a national of ',
// //             ', with their principal place of residence located ',
// //             ' issued on: ',
// //             ', having email ID: ',
// //             ' and Contact Number: ',
// //             ' (Hereinafter referred to as the "Client")'
// //         ],
// //         editableValues: [
// //             new Date().toLocaleDateString('en-GB'),
// //             'M/s AWS Legal Consultancy FZ-LLC',
// //             '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
// //             'Mr Aws M. Younis, Chairman',
// //             'Dr. Ali Moustafa Mohamed Elba',
// //             'Egypt',
// //             'Dubai, United Arab Emirates',
// //             'holding Emirates ID Number: ',
// //             '784-1952-3620694-4',
// //             new Date().toLocaleDateString('en-GB'),
// //             'alyelba@yahoo.com',
// //             '+971521356931'
// //         ]
// //     });

// //     const [fixedHeadings, setFixedHeadings] = useState([
// //         { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
// //     ]);

// //     const [headings, setHeadings] = useState([]);

// //     const [savedSignature, setSavedSignature] = useState(null);
// //     const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
// //     const [isFormFilled, setisFormFilled] = useState(false);
// //     const [savedClientSignature, setSavedClientSignature] = useState(null);
// //     const [isLocalSign, setIsLocalSign] = useState(false);
// //     const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
// //     const [dataList, setDataList] = useState([]);
// //     const isclient = token?.Role === "client";

// //     // Function to convert base64 to image data for jsPDF
// //     const getImageDataFromBase64 = (base64String) => {
// //         const base64Data = base64String.split(',')[1];
// //         return atob(base64Data);
// //     };

// //     // Function to get base64 from server for S3 URLs
// //     const getSignBase64FromServer = async (imageUrl) => {
// //         try {
// //             const response = await fetch(
// //                 `${ApiEndPoint}get-image-base64?url=${encodeURIComponent(imageUrl)}`
// //             );
// //             if (!response.ok) {
// //                 throw new Error("Failed to get Base64 from server");
// //             }
// //             const base64 = await response.text();
// //             return base64;
// //         } catch (error) {
// //             console.error("Error fetching Base64:", error);
// //             return null;
// //         }
// //     };
// //     // Add this function to fetch assigned users
// // const fetchAssignedUsers = async (caseId) => {
// //   try {
// //     const response = await fetch(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${caseId}`);
// //     if (!response.ok) {
// //       throw new Error('Error fetching assigned users');
// //     }
// //     const data = await response.json();
// //     return data;
// //   } catch (error) {
// //     console.error("Error fetching assigned users:", error);
// //     return null;
// //   }
// // };

// //     const handleDownload = async () => {
// //   try {
// //     // Fetch assigned users data
// //     const assignedUsersData = await fetchAssignedUsers(caseInfo?._id);

// //     // Extract lawyer and client information
// //     let lawyerName = "Lawyer Name";
// //     let clientName = "Client Name";

// //     if (assignedUsersData) {
// //       // Find lawyer from assigned users
// //       const lawyer = assignedUsersData.AssignedUsers?.find(user => user.Role === "lawyer");
// //       if (lawyer) {
// //         lawyerName = lawyer.UserName;
// //       }

// //       // Get client name
// //       if (assignedUsersData.Client && assignedUsersData.Client.length > 0) {
// //         clientName = assignedUsersData.Client[0].UserName;
// //       }
// //     }

// //     const doc = new jsPDF("p", "pt", "a4");
// //     const pageWidth = doc.internal.pageSize.getWidth();
// //     const pageHeight = doc.internal.pageSize.getHeight();
// //     const marginX = 80;
// //     const maxWidth = pageWidth - marginX * 2;
// //     const marginTop = 140;
// //     const lineHeight = 18;

// //     let y = marginTop;

// //     // Get signature images as base64
// //     let lawyerSignatureBase64 = null;
// //     let clientSignatureBase64 = null;

// //     if (dataList?.LawyerSignatureImage) {
// //       lawyerSignatureBase64 = await getSignBase64FromServer(dataList.LawyerSignatureImage);
// //     }

// //     if (dataList?.ClientSignatureImage) {
// //       clientSignatureBase64 = await getSignBase64FromServer(dataList.ClientSignatureImage);
// //     }

// //     // --- Header ---
// //     const addHeader = () => {
// //     // Background
// //     doc.setFillColor("#1a2b42");
// //     doc.rect(0, 0, pageWidth, 80, "F");

// //     // Logo + Text (Left aligned)
// //     const logoWidth = 50;
// //     const logoHeight = 60;
// //     const gap = 15;

// //     // Text content
// //     const mainText = "SUHAD ALJUBOORI";
// //     const subText = "Advocates & Legal Consultants";

// //     // Start X for left side
// //     const startX = 70; // margin from left

// //     // Draw Logo
// //     doc.addImage(logo, "PNG", startX, 15, logoWidth, logoHeight);

// //     // Draw Text (to the right of logo)
// //     let textX = startX + logoWidth + gap;

// //     doc.setTextColor("#fff");

// //     doc.setFont("helvetica", "bold");
// //     doc.setFontSize(14);
// //     doc.text(mainText, textX, 43); // vertically aligned with logo

// //     doc.setFont("helvetica", "normal");
// //     doc.setFontSize(12);
// //     doc.text(subText, textX, 57);
// //   };


// //     // --- Footer ---
// //     const footerText =
// //       "P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nAbu Dhabi: 2403, Tomouh Tower, Marina Square Jazeerat Al Reem\nTel: +971 (04) 332 5928, web: aws-legalgroup.com, email: info@awsadvocates.com";

// //     const addFooter = () => {
// //       const pageCount = doc.internal.getNumberOfPages();
// //       for (let i = 1; i <= pageCount; i++) {
// //         doc.setPage(i);

// //         // Footer background
// //         doc.setFillColor(245, 245, 245);
// //         doc.rect(0, pageHeight - 70, pageWidth, 70, "F");

// //         // Footer text
// //         doc.setTextColor("#333333");
// //         doc.setFont("helvetica", "normal");
// //         doc.setFontSize(7);
// //         const footerLines = doc.splitTextToSize(footerText, pageWidth - 80);
// //         doc.text(footerLines, pageWidth / 2, pageHeight - 50, {
// //           align: "center",
// //         });

// //         // Page number
// //         doc.setFontSize(8);
// //         const pageText = `Page ${i} of ${pageCount}`;
// //         doc.text(pageText, pageWidth - 60, pageHeight - 20);
// //       }
// //     };

// //     // --- Page break handler ---
// //     const checkPageBreak = (nextY) => {
// //       if (nextY > pageHeight - 100) {
// //         doc.addPage();
// //         addHeader();
// //         y = marginTop;
// //         doc.setFont("helvetica", "normal");
// //         doc.setFontSize(11);
// //         doc.setTextColor("#333333");
// //       }
// //     };

// //     // --- Justified text writer ---
// //   const justifyText = (text) => {
// //     const lines = doc.splitTextToSize(text, maxWidth);

// //     lines.forEach((line, idx) => {
// //       checkPageBreak(y + lineHeight);

// //       if (idx === lines.length - 1 || !line.includes(" ")) {
// //         // Last line ya single word line -> left aligned
// //         doc.text(line, marginX, y);
// //       } else {
// //         // Justify line
// //         const words = line.split(" ");
// //         const spaceCount = words.length - 1;

// //         // Current text width without extra spacing
// //         const lineWidth = words.reduce(
// //           (sum, w) => sum + doc.getTextWidth(w),
// //           0
// //         );

// //         // Har space ke liye base ek space + extra adjustment
// //         const totalExtraSpace = maxWidth - lineWidth;
// //         const spaceWidth = totalExtraSpace / spaceCount;

// //         let cursorX = marginX;
// //         words.forEach((w, i) => {
// //           doc.text(w, cursorX, y);
// //           if (i < spaceCount) {
// //             cursorX += doc.getTextWidth(w) + spaceWidth;
// //           }
// //         });
// //       }
// //       y += lineHeight;
// //     });

// //     y += 10;
// //   };

// //   // --- Alphabetical list writer ---
// //   const writeAlphabeticalList = (points) => {
// //     const alphabet = 'abcdefghijklmnopqrstuvwxyz';

// //     points.forEach((point, index) => {
// //       if (index < alphabet.length) {
// //         const listItem = `${alphabet[index]}) ${point.text || ""}`;
// //         checkPageBreak(y + lineHeight);
// //         justifyText(listItem);
// //       }
// //     });
// //   };

// //     // --- Draw first header ---
// //     addHeader();

// //     // --- Title ---
// //     doc.setFont("helvetica", "bold");
// //     doc.setFontSize(18);
// //     doc.setTextColor("#000");
// //     doc.text("Legal Fee Agreement", pageWidth / 2, 120, { align: "center" });

// //     // --- Agreement heading ---
// //     doc.setFont("helvetica", "bold");
// //     doc.setFontSize(13);
// //     doc.setTextColor("#333333");
// //     doc.text("Agreement", marginX, 160, { align: "left" });

// //     y = 190;

// //     // --- Agreement body ---
// //     doc.setFont("helvetica", "normal");
// //     doc.setFontSize(11);
// //     doc.setTextColor("#333333");

// //     const agreementText = agreement.fixedParts
// //       .map((part, i) => part + (agreement.editableValues[i] || ""))
// //       .join(" ");
// //     const paragraphs = agreementText.split("\n");

// //     paragraphs.forEach((p) => {
// //       if (p.trim()) justifyText(p.trim());
// //     });

// //     y += 30;

// //     // --- Section Details ---
// //     // --- Section Details ---
// // fixedHeadings.forEach((section, sectionIndex) => {
// //   checkPageBreak(y + lineHeight);

// //   doc.setFont("helvetica", "bold");
// //   doc.setFontSize(13);
// //   doc.setTextColor("#1a2b42");
// //   doc.text(section.title, marginX, y);
// //   y += lineHeight;

// //   doc.setFont("helvetica", "normal");
// //   doc.setFontSize(11);
// //   doc.setTextColor("#333333");

// //   // Add section points with alphabetical numbering
// //   section.points.forEach((point, pointIndex) => {
// //     checkPageBreak(y + lineHeight);

// //     // Convert index to alphabetical character (a, b, c, etc.)
// //     const alphabetChar = String.fromCharCode(97 + pointIndex); // 97 is 'a' in ASCII

// //     // Add alphabetical numbering before the point text
// //     justifyText(`${alphabetChar}) ${point.text || ""}`);
// //   });

// //   y += 10;
// // });

// //     // --- Signatures ---
// //     checkPageBreak(y + 80);
// //     y += 30;

// //     // Add signature images if they exist
// //     if (lawyerSignatureBase64) {
// //       try {
// //         const signatureWidth = 100;
// //         const signatureHeight = 40;

// //         // Convert base64 to image data
// //         const signatureData = getImageDataFromBase64(lawyerSignatureBase64);
// //         doc.addImage(signatureData, "PNG", marginX, y - 40, signatureWidth, signatureHeight);
// //       } catch (e) {
// //         console.error("Error adding lawyer signature:", e);
// //       }
// //     }

// //     if (clientSignatureBase64) {
// //       try {
// //         const signatureWidth = 100;
// //         const signatureHeight = 40;

// //         // Convert base64 to image data
// //         const signatureData = getImageDataFromBase64(clientSignatureBase64);
// //         doc.addImage(signatureData, "PNG", pageWidth - 250, y - 40, signatureWidth, signatureHeight);
// //       } catch (e) {
// //         console.error("Error adding client signature:", e);
// //       }
// //     }

// //     // Draw signature lines
// //     doc.setFont("helvetica", "bold");
// //     doc.text(" ___________________", marginX, y);
// //     doc.text(" ___________________", pageWidth - 250, y);

// //     // Lawyer details
// //     y += 20;
// //     doc.setFont("helvetica", "normal");
// //     doc.setFontSize(9);
// //     doc.text("The Lawyer", marginX + 60, y, { align: "center" });
// //     doc.text(lawyerName, marginX + 60, y + 15, { align: "center" });

// //     // Client details
// //     doc.text("The Client", pageWidth - 190, y, { align: "center" });
// //     doc.text(clientName, pageWidth - 190, y + 15, { align: "center" });

// //     // --- Headers + Footers on all pages ---
// //     const pageCount = doc.internal.getNumberOfPages();
// //     for (let i = 1; i <= pageCount; i++) {
// //       doc.setPage(i);
// //       addHeader();
// //     }
// //     addFooter();

// //     // --- Save ---
// //     doc.save("Legal_Fee_Agreement.pdf");
// //   } catch (e) {
// //     console.error("PDF generation failed:", e);
// //     alert("Sorry, unable to generate PDF. Check console for details.");
// //   }
// // };

// //     const FetchLFA = async () => {
// //         showDataLoading(true);
// //         try {
// //             const response = await fetch(`${ApiEndPoint}getLFAForm/${caseInfo?._id}`);
// //             if (!response.ok) {
// //                 showDataLoading(false);
// //                 throw new Error('Error fetching LFA');
// //             }
// //             const data = await response.json();
// //             showDataLoading(false);

// //             setAgreement(data.data.agreement);
// //             setDataList(data.data);
// //             setFixedHeadings(data.data.fixedHeadings);
// //             setHeadings(data.data.headings);
// //             setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
// //             setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
// //             setEditMode(false);
// //             setisFormFilled(true);
// //             setIsLocalSign(!!data.data?.ClientSignatureImage);
// //             setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
// //             setSavedLawyerSignature();

// //             // ensure UI refreshes on initial fetch too
// //             setDraftKey((k) => k + 1);
// //         } catch (err) {
// //             showDataLoading(false);
// //         }

// //         try {
// //             const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
// //             if (!response.ok) {
// //                 showDataLoading(false);
// //                 throw new Error('Error fetching LFA');
// //             }
// //             const data = await response.json();
// //             setGetDrafts(data);
// //         } catch (err) {
// //             showDataLoading(false);
// //         }
// //     };

// //     const handleSignatureSave = (dataUrl) => {
// //         setSavedSignature(dataUrl);
// //         setSavedLawyerSignature(dataUrl);
// //         setIsLocalLawyerSign(true);
// //     };

// //     const handleClientSignatureSave = (dataUrl) => {
// //         setSavedClientSignature(dataUrl);
// //     };

// //     const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

// //     const handleEditableChange = (index, newValue) => {
// //         const updated = [...agreement.editableValues];
// //         updated[index] = newValue;
// //         setAgreement({ ...agreement, editableValues: updated });
// //     };

// //     function base64ToFile(base64String, filename) {
// //         const arr = base64String.split(",");
// //         const mime = arr[0].match(/:(.*?);/)[1];
// //         const bstr = atob(arr[1]);
// //         let n = bstr.length;
// //         const u8arr = new Uint8Array(n);
// //         while (n--) {
// //             u8arr[n] = bstr.charCodeAt(n);
// //         }
// //         return new File([u8arr], filename, { type: mime });
// //     }

// //     const handleClientSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", false);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts,
// //                     editableValues: agreement?.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             if (savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //                 setIsLocalSign(true);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleLawyerSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", true);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement.fixedParts,
// //                     editableValues: agreement.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             if (savedSignature) {
// //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleUpdateClientSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", false);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts,
// //                     editableValues: agreement?.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             if (savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleUpdateLawyerSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", !isclient);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts || [],
// //                     editableValues: agreement?.editableValues || {}
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             })) || [];

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings || []));

// //             if (!isclient && savedSignature) {
// //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// //                 formData.append("file", file);
// //             }

// //             if (isclient && savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
// //                 method: "PUT",
// //                 body: formData
// //             });

// //             const data = await res.json();

// //             if (data.success) {
// //                 setEditMode(false);
// //                 FetchLFA();
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const addHeading = () =>
// //         setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

// //     const updateHeadingTitle = (hIndex, value) => {
// //         const updated = [...headings];
// //         updated[hIndex].title = value;
// //         setHeadings(updated);
// //     };

// //     const updatePoint = (setFn, list, hIndex, pIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].text = value;
// //         setFn(updated);
// //     };

// //     const updateSubpoint = (setFn, list, hIndex, pIndex, sIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
// //         setFn(updated);
// //     };

// //     const updateSubSubpoint = (setFn, list, hIndex, pIndex, sIndex, ssIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
// //         setFn(updated);
// //     };

// //     const removePoint = (hIndex, pIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points.splice(pIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const removeSubpoint = (hIndex, pIndex, sIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const [editHeadingIndex, setEditHeadingIndex] = useState(null);

// //     const pdfRef = useRef(null);

// //     // UPDATED: selecting a draft now forces a clean remount & syncs signatures
// //     const handlePickDraft = (data) => {
// //         setAgreement(data.agreement);
// //         setFixedHeadings(data.fixedHeadings);
// //         setHeadings(data.headings);
// //         setSelectedDrafts(data);
// //         setDraftKey((k) => k + 1); // force remount
// //     };

// //     const renderHeadings = (list, setFn, isFixed = false) => {
// //         if (!Array.isArray(list)) return null;

// //         // Step 1: Array -> HTML
// //         const combinedHtml = list
// //             .map(
// //                 (heading, hIndex) => `
// //                 <p><strong><ul>${heading.title || ""}</ul></strong></p>
// //                 <ul>
// //                     ${(heading.points || [])
// //                         .map((p) => `<li>${p.text || ""}</li>`)
// //                         .join("")}
// //                 </ul>
// //             `
// //             )
// //             .join("");

// //         // Step 2: HTML -> Array
// //         const parseHtmlToArray = (html) => {
// //             const parser = new DOMParser();
// //             const doc = parser.parseFromString(html, "text/html");
// //             const sections = [];

// //             let currentHeading = null;

// //             doc.body.childNodes.forEach((node) => {
// //                 if (node.nodeName === "P") {
// //                     // extract heading text (remove numbering if any)
// //                     const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
// //                     currentHeading = { title: headingText, points: [] };
// //                     sections.push(currentHeading);
// //                 } else if (node.nodeName === "UL" && currentHeading) {
// //                     const points = Array.from(node.querySelectorAll("li")).map((li) => ({
// //                         text: li.innerHTML,
// //                         subpoints: [],
// //                     }));
// //                     currentHeading.points = points;
// //                 }
// //             });

// //             return sections;
// //         };

// //         return (
// //             <div className="section border p-2 rounded bg-light">
// //                 {editMode ? (
// //                     <CEEditable
// //                         list={list} // 👈 ab array directly de sakte ho
// //                         onChange={(updatedList) => setFixedHeadings(updatedList)}
// //                         disable={(isFormFilled && !editMode)}
// //                     />
// //                 ) : (
// //                     <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
// //                 )}
// //             </div>
// //         );
// //     };


// //     return (
// //         <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
// // <style>{`
// //   .word-paper { color: #000; line-height: 1.4; }
// //   .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
// //   .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
// //   .word-paper .form-control,
// //   .word-paper [contenteditable="true"],
// //   .word-paper ul.sub-bullets,
// //   .word-paper ul.sub-bullets li { text-align: justify; }
// //   .word-paper.pdf-mode * { box-shadow: none !important; }
// //   .word-paper.pdf-mode .card,
// //   .word-paper.pdf-mode .form-control,
// //   .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
// //   .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }

// //   /* CHANGED: Replace bullet lists with alphabetical lists */
// //   .word-paper ul,
// //   .word-paper ol { padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// //   .word-paper ul { list-style-type: lower-alpha !important; }
// //   .word-paper ul.sub-bullets { list-style-type: lower-alpha !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// //   .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
// //   .word-paper .list-unstyled ul.sub-bullets,
// //   .word-paper .form-control ul.sub-bullets { list-style-type: lower-alpha !important; padding-left: 24px !important; }

// //   @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
// // `}</style>
// //             {/* toolbar - REMOVED: Download PDF functionality */}
// //           <div className="d-flex justify-content-end mb-3" data-html2canvas-ignore="true">
// //                 <button
// //                     className="btn btn-primary d-flex align-items-center"
// //                     onClick={handleDownload}
// //                     style={{ padding: "8px 16px" }}
// //                     data-html2canvas-ignore="true"
// //                 >
// //                     <BsDownload className="me-2" />
// //                     Download PDF
// //                 </button>
// //             </div>

// //             {(!isclient || isFormFilled) ? (
// //                 // IMPORTANT: key={draftKey} forces remount so new draft values appear
// //                 <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey}>
// //                     {/* Header */}
// //                     <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
// //                         <img
// //                             src="logo.png"
// //                             alt="Logo"
// //                             className="me-2 me-md-3 mb-2 mb-md-0"
// //                             style={{ height: "50px" }}
// //                         />
// //                         <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
// //                     </div>

// //                     {token?.Role !== "client" && (
// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Drafts</Form.Label>

// //                             <Dropdown className="w-100">
// //                                 <Dropdown.Toggle
// //                                     variant="outline-secondary"
// //                                     disabled={isFormFilled}
// //                                     id="dropdown-practice-area"
// //                                     className="w-100 text-start d-flex justify-content-between align-items-center"
// //                                 >
// //                                     {selectedDrafts === "Select Draft"
// //                                         ? "Select Draft"
// //                                         : `${selectedDrafts?.CaseNumber}`}
// //                                 </Dropdown.Toggle>

// //                                 <Dropdown.Menu className="w-100" disabled={isFormFilled}>


// //                                     {getDrafts?.map((data, index) => (
// //                                         <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// //                                             {data?.CaseNumber}
// //                                         </Dropdown.Item>
// //                                     ))}
// //                                 </Dropdown.Menu>
// //                             </Dropdown>
// //                         </Form.Group>

// //                     )}

// //                     <div className="card p-2 p-md-4 shadow-sm mb-4">
// //                         <label className="form-label fw-bold fs-5 text-break">Agreement</label>
// //                         {editMode && !isclient && !savedClientSignature ? (
// //                             <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
// //                                 {agreement?.fixedParts?.map((part, index) => (
// //                                     <React.Fragment key={index}>
// //                                         <span>{part}</span>
// //                                         {index < agreement.editableValues.length && (
// //                                             <p
// //                                                 ref={(el) => {
// //                                                     if (el && !el.innerHTML.trim()) {
// //                                                         el.innerHTML = agreement.editableValues[index] || "\u00A0";
// //                                                     }
// //                                                 }}
// //                                                 contentEditable
// //                                                 suppressContentEditableWarning
// //                                                 onInput={(e) => {
// //                                                     const html = e.currentTarget.innerHTML;
// //                                                     handleEditableChange(index, html);
// //                                                 }}
// //                                                 onKeyDown={(e) => {
// //                                                     if (e.ctrlKey && e.key.toLowerCase() === "b") {
// //                                                         e.preventDefault();
// //                                                         document.execCommand("bold");
// //                                                     }
// //                                                     if (e.key === "Tab") {
// //                                                         e.preventDefault();
// //                                                         const selection = window.getSelection();
// //                                                         if (!selection.rangeCount) return;
// //                                                         const range = selection.getRangeAt(0);
// //                                                         const tabSpaces = "\u00A0".repeat(8);
// //                                                         const spaceNode = document.createTextNode(tabSpaces);
// //                                                         range.insertNode(spaceNode);
// //                                                         range.setStartAfter(spaceNode);
// //                                                         selection.removeAllRanges();
// //                                                         selection.addRange(range);
// //                                                     }
// //                                                 }}
// //                                                 onBlur={(e) => {
// //                                                     if (!e.currentTarget.textContent.trim()) {
// //                                                         e.currentTarget.innerHTML = "\u00A0";
// //                                                     }
// //                                                 }}
// //                                                 style={{
// //                                                     display: "inline",
// //                                                     minWidth: "2ch",
// //                                                     maxWidth: "100%",
// //                                                     outline: "none",
// //                                                     background: "transparent",
// //                                                     verticalAlign: "middle",
// //                                                     whiteSpace: "pre-wrap",
// //                                                     wordBreak: "break-word",
// //                                                     fontFamily: "inherit",
// //                                                     fontSize: "inherit",
// //                                                     padding: "0 2px",
// //                                                     boxSizing: "border-box",
// //                                                     textDecoration: "underline",
// //                                                     textDecorationSkipInk: "none",
// //                                                     textAlign: "justify",
// //                                                 }}
// //                                             />
// //                                         )}
// //                                     </React.Fragment>
// //                                 ))}
// //                             </div>
// //                         ) : (
// //                             <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
// //                                 {agreement?.fixedParts?.map((part, index) => (
// //                                     <React.Fragment key={index}>
// //                                         <span>{part}</span>
// //                                         {index < agreement.editableValues.length && (
// //                                             <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
// //                                         )}
// //                                     </React.Fragment>
// //                                 ))}
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* Fixed Headings */}
// //                     {renderHeadings(fixedHeadings, setFixedHeadings, true)}

// //                     {/* Custom Headings */}
// //                     {/* {renderHeadings(headings, setHeadings, false)} */}

// //                     {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
// //                         <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// //                             <h2>Lawyer Signature</h2>
// //                             <Form_SignaturePad height={250} onSave={handleSignatureSave} />
// //                         </div>
// //                     )}

// //                     <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// //                         {(isclient && !isLocalSign) && (
// //                             <div>
// //                                 <h2>Client Signature</h2>
// //                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div
// //                         style={{
// //                             display: "flex",
// //                             flexDirection: "row",
// //                             justifyContent: "space-between",
// //                             alignItems: "flex-start",
// //                             gap: "20px",
// //                             width: "100%",
// //                         }}
// //                     >
// //                         {savedSignature && (
// //                             <div>
// //                                 <h4>Lawyer Signature:</h4>
// //                                 <img
// //                                     src={savedSignature}
// //                                     alt="Lawyer Signature"
// //                                     style={{
// //                                         maxWidth: "220px",
// //                                         maxHeight: "300px",
// //                                         border: "1px solid #ccc",
// //                                         borderRadius: "4px",
// //                                     }}
// //                                 />
// //                             </div>
// //                         )}

// //                         {savedClientSignature && (
// //                             <div>
// //                                 <h4>Client Signature:</h4>
// //                                 <img
// //                                     src={savedClientSignature}
// //                                     alt="Client Signature"
// //                                     style={{
// //                                         maxWidth: "220px",
// //                                         border: "1px solid #ccc",
// //                                         borderRadius: "4px",
// //                                     }}
// //                                 />
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
// //                         {(!isclient && savedClientSignature && savedLawyerSignature) && (
// //                             <button
// //                                 className="btn btn-sm btn-primary fw-bold"
// //                                 onClick={handleUpdateLawyerSubmit}
// //                                 style={{ width: "150px" }}
// //                                 data-html2canvas-ignore="true"
// //                             >
// //                                 Save & Update Agreement
// //                             </button>
// //                         )}

// //                         {editMode ? (
// //                             <>
// //                                 {(!isFormFilled && !savedClientSignature) ? (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Submit Agreement
// //                                     </button>
// //                                 ) : (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={handleUpdateLawyerSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Update Agreement
// //                                     </button>
// //                                 )}
// //                             </>
// //                         ) : (
// //                             <>
// //                                 {(isclient && !isLocalSign) && (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={handleUpdateLawyerSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Submit Signature
// //                                     </button>
// //                                 )}

// //                                 {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={() => setEditMode(true)}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Edit Agreement
// //                                     </button>
// //                                 )}
// //                             </>
// //                         )}
// //                     </div>
// //                 </div>
// //             ) : (
// //                 <div className="text-center text-black py-5">No LFA Form Available.</div>
// //             )}
// //         </div>
// //     );
// // };

// // export default LEA_Form;




// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import { ApiEndPoint } from '../utils/utlis';
// // import { useSelector } from 'react-redux';
// // import ConfirmModal from '../../AlertModels/ConfirmModal';
// // import { useAlert } from '../../../../Component/AlertContext';
// // import Form_SignaturePad from './Form_Componets/SignaturePad';
// // import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
// // import { Dropdown, Form, InputGroup } from "react-bootstrap";
// // import CEEditable from './CEEditable';
// // import { v4 as uuidv4 } from "uuid";

// // const LEA_Form = ({ token }) => {
// //     const caseInfo = useSelector((state) => state.screen.Caseinfo);
// //     const { showDataLoading } = useAlert();

// //     const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
// //     const [getDrafts, setGetDrafts] = useState(null);

// //     // NEW: force remount key for contentEditable sections
// //     const [draftKey, setDraftKey] = useState(0);

// //     useEffect(() => {
// //         FetchLFA();
// //     }, []);

// //     const [agreement, setAgreement] = useState({
// //         fixedParts: [
// //             'This Agreement ("Agreement") is entered into and shall become effective as of ',
// //             ', by and between:\n\n',
// //             ', with its principal place of business located at ',
// //             ', represented herein by ',
// //             ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
// //             ' a national of ',
// //             ', with their principal place of residence located ',
// //             ' issued on: ',
// //             ', having email ID: ',
// //             ' and Contact Number: ',
// //             ' (Hereinafter referred to as the "Client")'
// //         ],
// //         editableValues: [
// //             new Date().toLocaleDateString('en-GB'),
// //             'M/s AWS Legal Consultancy FZ-LLC',
// //             '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
// //             'Mr Aws M. Younis, Chairman',
// //             'Dr. Ali Moustafa Mohamed Elba',
// //             'Egypt',
// //             'Dubai, United Arab Emirates',
// //             'holding Emirates ID Number: ',
// //             '784-1952-3620694-4',
// //             new Date().toLocaleDateString('en-GB'),
// //             'alyelba@yahoo.com',
// //             '+971521356931'
// //         ]
// //     });

// //     const [fixedHeadings, setFixedHeadings] = useState([
// //         { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
// //     ]);

// //     const [headings, setHeadings] = useState([]);

// //     const [savedSignature, setSavedSignature] = useState(null);
// //     const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
// //     const [isFormFilled, setisFormFilled] = useState(false);
// //     const [savedClientSignature, setSavedClientSignature] = useState(null);
// //     const [isLocalSign, setIsLocalSign] = useState(false);
// //     const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
// //     const [dataList, setDataList] = useState([]);
// //     const isclient = token?.Role === "client";

// //     const FetchLFA = async () => {
// //         showDataLoading(true);
// //         try {
// //             const response = await fetch(`${ApiEndPoint}getLFAForm/${caseInfo?._id}`);
// //             if (!response.ok) {
// //                 showDataLoading(false);
// //                 throw new Error('Error fetching LFA');
// //             }
// //             const data = await response.json();
// //             showDataLoading(false);

// //             setAgreement(data.data.agreement);
// //             setDataList(data.data);
// //             setFixedHeadings(data.data.fixedHeadings);
// //             setHeadings(data.data.headings);
// //             setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
// //             setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
// //             setEditMode(false);
// //             setisFormFilled(true);
// //             setIsLocalSign(!!data.data?.ClientSignatureImage);
// //             setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
// //             setSavedLawyerSignature();

// //             // ensure UI refreshes on initial fetch too
// //             setDraftKey((k) => k + 1);
// //         } catch (err) {
// //             showDataLoading(false);
// //         }

// //         try {
// //             const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
// //             if (!response.ok) {
// //                 showDataLoading(false);
// //                 throw new Error('Error fetching LFA');
// //             }
// //             const data = await response.json();
// //             setGetDrafts(data);
// //         } catch (err) {
// //             showDataLoading(false);
// //         }
// //     };

// //     const handleSignatureSave = (dataUrl) => {
// //         setSavedSignature(dataUrl);
// //         setSavedLawyerSignature(dataUrl);
// //         setIsLocalLawyerSign(true);
// //     };

// //     const handleClientSignatureSave = (dataUrl) => {
// //         setSavedClientSignature(dataUrl);
// //     };

// //     const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

// //     const handleEditableChange = (index, newValue) => {
// //         const updated = [...agreement.editableValues];
// //         updated[index] = newValue;
// //         setAgreement({ ...agreement, editableValues: updated });
// //     };

// //     function base64ToFile(base64String, filename) {
// //         const arr = base64String.split(",");
// //         const mime = arr[0].match(/:(.*?);/)[1];
// //         const bstr = atob(arr[1]);
// //         let n = bstr.length;
// //         const u8arr = new Uint8Array(n);
// //         while (n--) {
// //             u8arr[n] = bstr.charCodeAt(n);
// //         }
// //         return new File([u8arr], filename, { type: mime });
// //     }

// //     const handleClientSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", false);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts,
// //                     editableValues: agreement?.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             if (savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //                 setIsLocalSign(true);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleLawyerSubmit = async () => {


// //         console.log(fixedHeadings)
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", true);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement.fixedParts,
// //                     editableValues: agreement.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             // FIXED: use lawyer signature (savedSignature), not savedClientSignature
// //             if (savedSignature) {
// //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleUpdateClientSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", false);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts,
// //                     editableValues: agreement?.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             if (savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleUpdateLawyerSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", !isclient);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts || [],
// //                     editableValues: agreement?.editableValues || {}
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             })) || [];

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings || []));

// //             if (!isclient && savedSignature) {
// //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// //                 formData.append("file", file);
// //             }

// //             if (isclient && savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
// //                 method: "PUT",
// //                 body: formData
// //             });

// //             const data = await res.json();

// //             if (data.success) {
// //                 setEditMode(false);
// //                 FetchLFA();
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const addHeading = () =>
// //         setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

// //     const updateHeadingTitle = (hIndex, value) => {
// //         const updated = [...headings];
// //         updated[hIndex].title = value;
// //         setHeadings(updated);
// //     };

// //     const updatePoint = (setFn, list, hIndex, pIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].text = value;
// //         setFn(updated);
// //     };

// //     const updateSubpoint = (setFn, list, hIndex, pIndex, sIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
// //         setFn(updated);
// //     };

// //     const updateSubSubpoint = (setFn, list, hIndex, pIndex, sIndex, ssIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
// //         setFn(updated);
// //     };

// //     const removePoint = (hIndex, pIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points.splice(pIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const removeSubpoint = (hIndex, pIndex, sIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const [editHeadingIndex, setEditHeadingIndex] = useState(null);

// //     const pdfRef = useRef(null);

// //     const handleDownload = async () => {
// //         if (!pdfRef.current) return;
// //         try {
// //             pdfRef.current.classList.add("pdf-mode");
// //             const { default: html2pdf } = await import("html2pdf.js");
// //             const opt = {
// //                 margin: [12, 15, 12, 15],
// //                 filename: "Legal_Fee_Agreement.pdf",
// //                 image: { type: "jpeg", quality: 0.98 },
// //                 html2canvas: { scale: 2.2, useCORS: true, scrollY: 0 },
// //                 jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
// //                 pagebreak: { mode: ["css", "legacy"] },
// //             };
// //             await html2pdf().set(opt).from(pdfRef.current).save();
// //         } catch (e) {
// //             console.error("PDF generation failed:", e);
// //             alert("Sorry, unable to generate PDF. Check console for details.");
// //         } finally {
// //             pdfRef.current.classList.remove("pdf-mode");
// //         }
// //     };

// //     // UPDATED: selecting a draft now forces a clean remount & syncs signatures
// //     const handlePickDraft = (data) => {
// //         setAgreement(data.agreement);
// //         setFixedHeadings(data.fixedHeadings);
// //         setHeadings(data.headings);
// //         setSelectedDrafts(data);
// //         // setSavedClientSignature(data?.ClientSignatureImage || "");
// //         // setSavedSignature(data?.LawyerSignatureImage || "");
// //         //  setEditMode(true);
// //         setDraftKey((k) => k + 1); // force remount
// //     };



// //     // const renderHeadings = (list, setFn, isFixed = false) => {
// //     //     // === helpers: insert/delete right AFTER current index ===

// //     //     const deleteHeading = (index) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// //     //             if (index < 0 || index >= updated.length) return prev;
// //     //             updated.splice(index, 1);
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addHeadingAfter = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// //     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
// //     //             updated.splice(hIndex + 1, 0, newHeading);
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addPointAfter = (hIndex, pIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const deletePoint = (hIndex, pIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             if (pIndex < 0 || pIndex >= pts.length) return prev;

// //     //             pts.splice(pIndex, 1);
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addPointAtEnd = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             pts.push({ text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     return list?.map((heading, hIndex) => (
// //     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// //     //             <div
// //     //                 className="heading-row"
// //     //                 style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}
// //     //             >
// //     //                 <div
// //     //                     className="idx"
// //     //                     style={{ width: "20px", minWidth: "10px", textAlign: "right", fontWeight: 600 }}
// //     //                 >
// //     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
// //     //                 </div>

// //     //                 <div className="form-control bg-white p-1 fw-bold" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
// //     //                     {editMode && !savedClientSignature ? (
// //     //                         <p
// //     //                             ref={(el) => {
// //     //                                 if (el && !el.innerHTML.trim()) el.innerHTML = heading.title || "\u00A0";
// //     //                             }}
// //     //                             contentEditable
// //     //                             suppressContentEditableWarning
// //     //                             onInput={(e) => {
// //     //                                 const html = e.currentTarget.innerHTML;
// //     //                                 const updated = [...list];
// //     //                                 updated[hIndex].title = html;
// //     //                                 setFn(updated);
// //     //                             }}
// //     //                             onKeyDown={(e) => {
// //     //                                 if (e.ctrlKey && e.key.toLowerCase() === "b") {
// //     //                                     e.preventDefault();
// //     //                                     document.execCommand("bold");
// //     //                                 }
// //     //                                 if (e.key === "Tab") {
// //     //                                     e.preventDefault();
// //     //                                     const selection = window.getSelection();
// //     //                                     if (!selection.rangeCount) return;
// //     //                                     const range = selection.getRangeAt(0);
// //     //                                     const tabSpaces = "\u00A0".repeat(8);
// //     //                                     const spaceNode = document.createTextNode(tabSpaces);
// //     //                                     range.insertNode(spaceNode);
// //     //                                     range.setStartAfter(spaceNode);
// //     //                                     selection.removeAllRanges();
// //     //                                     selection.addRange(range);
// //     //                                 }
// //     //                             }}
// //     //                             onBlur={(e) => {
// //     //                                 if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
// //     //                             }}
// //     //                             style={{
// //     //                                 display: "inline-block",
// //     //                                 minHeight: "40px",
// //     //                                 width: "100%",
// //     //                                 outline: "none",
// //     //                                 background: "transparent",
// //     //                                 whiteSpace: "pre-wrap",
// //     //                                 wordBreak: "break-word",
// //     //                                 fontFamily: "inherit",
// //     //                                 fontSize: "inherit",
// //     //                                 fontWeight: "bold",
// //     //                                 padding: "4px 6px",
// //     //                                 border: "1px solid #ccc",
// //     //                                 borderRadius: "4px",
// //     //                                 boxSizing: "border-box",
// //     //                                 textAlign: "justify",
// //     //                             }}
// //     //                         />
// //     //                     ) : (
// //     //                         <div>
// //     //                             <React.Fragment key={hIndex}>
// //     //                                 <span>{heading.label || ""}</span>
// //     //                                 <span dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// //     //                             </React.Fragment>
// //     //                         </div>
// //     //                     )}
// //     //                 </div>

// //     //                 {/* ACTIONS: now insert AFTER current heading */}
// //     //                 <div
// //     //                     style={{ display: editMode && !savedClientSignature ? "flex" : "none", gap: "6px" }}
// //     //                     data-html2canvas-ignore="true"
// //     //                 >
// //     //                     <div
// //     //                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(4, 2, 2, 0.2)", cursor: "pointer" }}
// //     //                         onClick={() => addHeadingAfter(hIndex)}
// //     //                     >
// //     //                         <BsPlus />
// //     //                     </div>
// //     //                     <div
// //     //                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// //     //                         onClick={() => deleteHeading(hIndex)}
// //     //                     >
// //     //                         <BsDash />
// //     //                     </div>
// //     //                 </div>
// //     //             </div>

// //     //             <ul className="list-unstyled ps-2 ps-md-3">
// //     //                 {heading.points?.map((point, pIndex) => (
// //     //                     <li key={pIndex}>
// //     //                         <div className="d-flex flex-wrap align-items-center mb-2">
// //     //                             {editMode && !savedClientSignature ? (
// //     //                                 <p
// //     //                                     ref={(el) => {
// //     //                                         if (el && !el.innerHTML.trim()) el.innerHTML = point.text || "\u00A0";
// //     //                                     }}
// //     //                                     contentEditable
// //     //                                     suppressContentEditableWarning
// //     //                                     onInput={(e) => {
// //     //                                         const html = e.currentTarget.innerHTML;
// //     //                                         const updated = [...list];
// //     //                                         updated[hIndex].points[pIndex].text = html;
// //     //                                         setFn(updated);
// //     //                                     }}
// //     //                                     onKeyDown={(e) => {
// //     //                                         if (e.ctrlKey && e.key.toLowerCase() === "b") {
// //     //                                             e.preventDefault();
// //     //                                             document.execCommand("bold");
// //     //                                         }
// //     //                                         if (e.key === "Tab") {
// //     //                                             e.preventDefault();
// //     //                                             const selection = window.getSelection();
// //     //                                             if (!selection.rangeCount) return;
// //     //                                             const range = selection.getRangeAt(0);
// //     //                                             const tabSpaces = "\u00A0".repeat(8);
// //     //                                             const spaceNode = document.createTextNode(tabSpaces);
// //     //                                             range.insertNode(spaceNode);
// //     //                                             range.setStartAfter(spaceNode);
// //     //                                             selection.removeAllRanges();
// //     //                                             selection.addRange(range);
// //     //                                         }
// //     //                                     }}
// //     //                                     onBlur={(e) => {
// //     //                                         if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
// //     //                                     }}
// //     //                                     style={{
// //     //                                         display: "inline-block",
// //     //                                         minHeight: "40px",
// //     //                                         width: "100%",
// //     //                                         outline: "none",
// //     //                                         background: "transparent",
// //     //                                         whiteSpace: "pre-wrap",
// //     //                                         wordBreak: "break-word",
// //     //                                         fontFamily: "inherit",
// //     //                                         fontSize: "inherit",
// //     //                                         padding: "4px 6px",
// //     //                                         border: "1px solid #ddd",
// //     //                                         borderRadius: "4px",
// //     //                                         boxSizing: "border-box",
// //     //                                         textAlign: "justify",
// //     //                                     }}
// //     //                                 />
// //     //                             ) : (
// //     //                                 <div className="" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
// //     //                                     <React.Fragment key={pIndex}>
// //     //                                         <span>{point.label || ""}</span>
// //     //                                         <span dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// //     //                                     </React.Fragment>
// //     //                                 </div>
// //     //                             )}

// //     //                             {editMode && !savedClientSignature && (
// //     //                                 <>
// //     //                                     {/* INSERT new point AFTER current pIndex */}
// //     //                                     <div
// //     //                                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// //     //                                         onClick={() => addPointAfter(hIndex, pIndex)}
// //     //                                         data-html2canvas-ignore="true"
// //     //                                     >
// //     //                                         <BsPlus />
// //     //                                     </div>
// //     //                                     <div
// //     //                                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// //     //                                         onClick={() => deletePoint(hIndex, pIndex)}
// //     //                                         data-html2canvas-ignore="true"
// //     //                                     >
// //     //                                         <BsDash />
// //     //                                     </div>
// //     //                                 </>
// //     //                             )}
// //     //                         </div>

// //     //                         {/* subpoints UI remains same */}
// //     //                         {Array.isArray(point?.subpoints) && point.subpoints.length > 0 && (
// //     //                             <div style={{ margin: "4px 0 8px 0", paddingLeft: "16px", paddingRight: "16px" }}>
// //     //                                 {point.subpoints.map((sp, sIndex) => {
// //     //                                     const html = typeof sp === "string" ? sp : sp?.text || "";
// //     //                                     return (
// //     //                                         <table
// //     //                                             key={sIndex}
// //     //                                             style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", margin: "2px 0" }}
// //     //                                         >
// //     //                                             <tbody>
// //     //                                                 <tr>
// //     //                                                     <td style={{ width: "14px", minWidth: "14px", textAlign: "center", verticalAlign: "top" }}>
// //     //                                                         •
// //     //                                                     </td>
// //     //                                                     <td style={{ paddingLeft: "8px", textAlign: "justify", wordBreak: "break-word" }}>
// //     //                                                         <div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
// //     //                                                     </td>
// //     //                                                 </tr>
// //     //                                             </tbody>
// //     //                                         </table>
// //     //                                     );
// //     //                                 })}
// //     //                             </div>
// //     //                         )}
// //     //                     </li>
// //     //                 ))}

// //     //                 {editMode && !savedClientSignature && (
// //     //                     <li>
// //     //                         <button
// //     //                             type="button"
// //     //                             className="btn btn-outline-primary btn-sm"
// //     //                             onClick={() => addPointAtEnd(hIndex)}
// //     //                             data-html2canvas-ignore="true"
// //     //                         >
// //     //                             + Add Point
// //     //                         </button>
// //     //                     </li>
// //     //                 )}
// //     //             </ul>
// //     //         </div>
// //     //     ));
// //     // };




// //     // const renderHeadings = (list, setFn, isFixed = false) => {
// //     //     // === helpers ===
// //     //     const deleteHeading = (hIndex) => {
// //     //         if (!editMode) return;

// //     //         setFn((prev) => {
// //     //             if (!Array.isArray(prev)) return prev;

// //     //             const updated = [...prev];
// //     //             updated.splice(hIndex, 1); // sirf targeted heading delete
// //     //             return updated;
// //     //         });

// //     //         // focus shifting (optional)
// //     //         setTimeout(() => {
// //     //             const targetIdx = Math.max(0, hIndex - 1);
// //     //             const editors = document.querySelectorAll('[data-head-editor="1"]');
// //     //             if (editors && editors[targetIdx]) {
// //     //                 editors[targetIdx].focus();
// //     //             }
// //     //         }, 0);
// //     //     };

// //     //     const addHeadingAfter = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// //     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
// //     //             updated.splice(hIndex + 1, 0, newHeading);
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addPointAfter = (hIndex, pIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const deletePoint = (hIndex, pIndex) => {
// //     //         if (!editMode) return;

// //     //         setFn((prev) => {
// //     //             if (!Array.isArray(prev)) return prev;

// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading || !Array.isArray(heading.points)) return prev;

// //     //             const newPoints = [...heading.points];
// //     //             newPoints.splice(pIndex, 1); // sirf targeted point delete

// //     //             updated[hIndex] = { ...heading, points: newPoints };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addPointAtEnd = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             pts.push({ text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     // === UI ===
// //     //     return list?.map((heading, hIndex) => (
// //     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// //     //             {/* Heading Title */}
// //     //             <div className="heading-row" style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}>
// //     //                 <div className="idx" style={{ width: "20px", textAlign: "right", fontWeight: 600 }}>
// //     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
// //     //                 </div>

// //     //                 {editMode && !savedClientSignature ? (

// //     //                     <CEEditable
// //     //                         tag="h4"
// //     //                         html={heading.title}
// //     //                         placeholder={"\\u00A0"}
// //     //                         className="form-control bg-white p-1 fw-bold"
// //     //                         style={{
// //     //                             whiteSpace: "pre-wrap",
// //     //                             textAlign: "justify",
// //     //                             display: "inline-block",
// //     //                             minHeight: "40px",
// //     //                             width: "100%",
// //     //                             outline: "none",
// //     //                             background: "transparent",
// //     //                             wordBreak: "break-word",
// //     //                             fontFamily: "inherit",
// //     //                             fontSize: "inherit",
// //     //                             fontWeight: "bold",
// //     //                             padding: "4px 6px",
// //     //                             border: "1px solid #ccc",
// //     //                             borderRadius: "4px",
// //     //                             boxSizing: "border-box",
// //     //                         }}
// //     //                         onChange={(newHtml) => {
// //     //                             const updated = [...list];
// //     //                             updated[hIndex].title = newHtml;
// //     //                             setFn(updated);
// //     //                         }}
// //     //                         onEmpty={() => {
// //     //                             // If you also want "empty = delete":
// //     //                             // setFn(prev => {
// //     //                             //   const next = Array.isArray(prev) ? [...prev] : [];
// //     //                             //   next.splice(hIndex, 1);
// //     //                             //   return next;
// //     //                             // });
// //     //                         }}
// //     //                         data-head-editor="1"   // <— add this so we can focus after delete
// //     //                     />


// //     //                 ) : (
// //     //                     <div className="fw-bold" style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// //     //                 )}

// //     //                 {editMode && !savedClientSignature && (
// //     //                     <div style={{ display: "flex", gap: "6px" }} data-html2canvas-ignore="true">
// //     //                         <div style={{ color: "green", cursor: "pointer" }} onClick={() => addHeadingAfter(hIndex)}>
// //     //                             <BsPlus />
// //     //                         </div>
// //     //                         <div style={{ color: "red", cursor: "pointer" }} onClick={() => deleteHeading(hIndex)}>
// //     //                             <BsDash />
// //     //                         </div>
// //     //                     </div>
// //     //                 )}
// //     //             </div>

// //     //             {/* Points */}
// //     //             <ul className="list-unstyled ps-2 ps-md-3">
// //     //                 {heading.points?.map((point, pIndex) => (
// //     //                     <li key={pIndex}>
// //     //                         <div className="d-flex align-items-center mb-2">
// //     //                             {editMode && !savedClientSignature ? (
// //     //                                 <p
// //     //                                     contentEditable
// //     //                                     suppressContentEditableWarning
// //     //                                     onInput={(e) => {
// //     //                                         const updated = [...list];
// //     //                                         updated[hIndex].points[pIndex].text = e.currentTarget.innerHTML;
// //     //                                         setFn(updated);
// //     //                                     }}
// //     //                                     style={{
// //     //                                         minHeight: "30px",
// //     //                                         width: "100%",
// //     //                                         outline: "none",
// //     //                                         border: "1px solid #ddd",
// //     //                                         borderRadius: "4px",
// //     //                                         padding: "4px 6px",
// //     //                                         textAlign: "justify"
// //     //                                     }}
// //     //                                     dangerouslySetInnerHTML={{ __html: point.text || "" }}
// //     //                                 />
// //     //                             ) : (
// //     //                                 <div style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// //     //                             )}

// //     //                             {editMode && !savedClientSignature && (
// //     //                                 <>
// //     //                                     <div style={{ color: "green", cursor: "pointer" }} onClick={() => addPointAfter(hIndex, pIndex)}>
// //     //                                         <BsPlus />
// //     //                                     </div>
// //     //                                     <div style={{ color: "red", cursor: "pointer" }} onClick={() => deletePoint(hIndex, pIndex)}>
// //     //                                         <BsDash />
// //     //                                     </div>
// //     //                                 </>
// //     //                             )}
// //     //                         </div>
// //     //                     </li>
// //     //                 ))}

// //     //                 {editMode && !savedClientSignature && (
// //     //                     <li>
// //     //                         <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => addPointAtEnd(hIndex)} data-html2canvas-ignore="true">
// //     //                             + Add Point
// //     //                         </button>
// //     //                     </li>
// //     //                 )}
// //     //             </ul>
// //     //         </div>
// //     //     ));
// //     // };




// //     // const renderHeadings = (list, setFn, isFixed = false) => {
// //     //     // Add Heading
// //     //     const addHeadingAfter = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// //     //             const newHeading = { id: uuidv4(), title: "New Section", points: [{ id: uuidv4(), text: "", subpoints: [] }] };
// //     //             updated.splice(hIndex + 1, 0, newHeading);
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     // Add Point
// //     //     const addPointAfter = (hIndex, pIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = [...(heading.points || [])];
// //     //             pts.splice(pIndex + 1, 0, { id: uuidv4(), text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     // === UI ===
// //     //     return list?.map((heading, hIndex) => (
// //     //         <div key={heading.id} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// //     //             {/* Heading Title */}
// //     //             <div className="heading-row d-flex align-items-center mb-2">
// //     //                 <div className="idx fw-bold me-2">{isFixed ? hIndex + 1 : hIndex + 11}.</div>

// //     //                 {editMode && !savedClientSignature ? (
// //     //                     <CEEditable
// //     //                         key={heading.id}   // force re-init editor
// //     //                         html={heading.title}
// //     //                         onChange={(newHtml) => {
// //     //                             setFn((prev) => {
// //     //                                 const updated = [...prev];
// //     //                                 updated[hIndex].title = newHtml;
// //     //                                 return updated;
// //     //                             });
// //     //                         }}
// //     //                     />
// //     //                 ) : (
// //     //                     <div className="fw-bold" dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// //     //                 )}
// //     //             </div>

// //     //             {/* Points */}
// //     //             <ul className="list-unstyled ps-3">
// //     //                 {heading.points?.map((point, pIndex) => (
// //     //                     <li key={point.id}>
// //     //                         {editMode && !savedClientSignature ? (
// //     //                             <CEEditable
// //     //                                 key={point.id}   // force re-init editor
// //     //                                 html={point.text}
// //     //                                 onChange={(newHtml) => {
// //     //                                     setFn((prev) => {
// //     //                                         const updated = [...prev];
// //     //                                         updated[hIndex].points[pIndex].text = newHtml;
// //     //                                         return updated;
// //     //                                     });
// //     //                                 }}
// //     //                             />
// //     //                         ) : (
// //     //                             <div dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// //     //                         )}
// //     //                     </li>
// //     //                 ))}
// //     //             </ul>
// //     //         </div>
// //     //     ));
// //     // };



// //     // ---- renderHeadings.jsx ----


// //     const renderHeadings = (list, setFn, isFixed = false) => {
// //         if (!Array.isArray(list)) return null;

// //         // Step 1: Array -> HTML
// //         const combinedHtml = list
// //             .map(
// //                 (heading, hIndex) => `
// //                 <p><strong><ul>${heading.title || ""}</ul></strong></p>
// //                 <ul>
// //                     ${(heading.points || [])
// //                         .map((p) => `<li>${p.text || ""}</li>`)
// //                         .join("")}
// //                 </ul>
// //             `
// //             )
// //             .join("");

// //         // Step 2: HTML -> Array
// //         const parseHtmlToArray = (html) => {
// //             const parser = new DOMParser();
// //             const doc = parser.parseFromString(html, "text/html");
// //             const sections = [];

// //             let currentHeading = null;

// //             doc.body.childNodes.forEach((node) => {
// //                 if (node.nodeName === "P") {
// //                     // extract heading text (remove numbering if any)
// //                     const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
// //                     currentHeading = { title: headingText, points: [] };
// //                     sections.push(currentHeading);
// //                 } else if (node.nodeName === "UL" && currentHeading) {
// //                     const points = Array.from(node.querySelectorAll("li")).map((li) => ({
// //                         text: li.innerHTML,
// //                         subpoints: [],
// //                     }));
// //                     currentHeading.points = points;
// //                 }
// //             });

// //             return sections;
// //         };

// //         return (
// //             <div className="section border p-2 rounded bg-light">
// //                 {editMode ? (
// //                     <CEEditable
// //                         list={list} // 👈 ab array directly de sakte ho
// //                         onChange={(updatedList) => setFixedHeadings(updatedList)}
// //                         disable={(isFormFilled && !editMode)}
// //                     />
// //                 ) : (
// //                     <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
// //                 )}
// //             </div>
// //         );
// //     };


// //     return (
// //         <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
// //             <style>{`
// //         .word-paper { color: #000; line-height: 1.4; }
// //         .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
// //         .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
// //         .word-paper .form-control,
// //         .word-paper [contenteditable="true"],
// //         .word-paper ul.sub-bullets,
// //         .word-paper ul.sub-bullets li { text-align: justify; }
// //         .word-paper.pdf-mode * { box-shadow: none !important; }
// //         .word-paper.pdf-mode .card,
// //         .word-paper.pdf-mode .form-control,
// //         .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
// //         .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }
// //         .word-paper.pdf-mode ul,
// //         .word-paper.pdf-mode ol { list-style: revert !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// //         .word-paper ul.sub-bullets { list-style-type: disc !important; list-style-position: outside !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// //         .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
// //         .word-paper .list-unstyled ul.sub-bullets,
// //         .word-paper .form-control ul.sub-bullets { list-style-type: disc !important; padding-left: 24px !important; }
// //         @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
// //       `}</style>

// //             {/* toolbar */}
// //             <div className="d-flex justify-content-end mb-3" data-html2canvas-ignore="true">
// //                 <button
// //                     className="btn btn-primary d-flex align-items-center"
// //                     onClick={handleDownload}
// //                     style={{ padding: "8px 16px" }}
// //                     data-html2canvas-ignore="true"
// //                 >
// //                     <BsDownload className="me-2" />
// //                     Download PDF
// //                 </button>
// //             </div>

// //             {(!isclient || isFormFilled) ? (
// //                 // IMPORTANT: key={draftKey} forces remount so new draft values appear
// //                 <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey}>
// //                     {/* Header */}
// //                     <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
// //                         <img
// //                             src="logo.png"
// //                             alt="Logo"
// //                             className="me-2 me-md-3 mb-2 mb-md-0"
// //                             style={{ height: "50px" }}
// //                         />
// //                         <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
// //                     </div>

// //                     {token?.Role !== "client" && (
// //                         // <Form.Group className="mb-3">
// //                         //     <Form.Label>Drafts <span className="text-danger"></span></Form.Label>
// //                         //     <InputGroup>
// //                         //         <Dropdown className="w-100">
// //                         //             <Dropdown.Toggle
// //                         //                 variant="outline-secondary"
// //                         //                 id="dropdown-practice-area"
// //                         //                 // ENABLED now: allow switching drafts anytime
// //                         //                 className="w-100 text-start d-flex justify-content-between align-items-center"
// //                         //             >
// //                         //                 {selectedDrafts === "Select Draft" ? "Select Draft" : `${selectedDrafts?.CaseNumber}`}
// //                         //             </Dropdown.Toggle>

// //                         //             <Dropdown.Menu className="w-100">
// //                         //                 {getDrafts?.map((data, index) => (
// //                         //                     <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// //                         //                         {data?.CaseNumber}
// //                         //                     </Dropdown.Item>
// //                         //                 ))}
// //                         //             </Dropdown.Menu>
// //                         //         </Dropdown>
// //                         //     </InputGroup>
// //                         // </Form.Group>


// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Drafts</Form.Label>

// //                             <Dropdown className="w-100">
// //                                 <Dropdown.Toggle
// //                                     variant="outline-secondary"
// //                                     disabled={isFormFilled}
// //                                     id="dropdown-practice-area"
// //                                     className="w-100 text-start d-flex justify-content-between align-items-center"
// //                                 >
// //                                     {selectedDrafts === "Select Draft"
// //                                         ? "Select Draft"
// //                                         : `${selectedDrafts?.CaseNumber}`}
// //                                 </Dropdown.Toggle>

// //                                 <Dropdown.Menu className="w-100" disabled={isFormFilled}>


// //                                     {getDrafts?.map((data, index) => (
// //                                         <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// //                                             {data?.CaseNumber}
// //                                         </Dropdown.Item>
// //                                     ))}
// //                                 </Dropdown.Menu>
// //                             </Dropdown>
// //                         </Form.Group>

// //                     )}

// //                     <div className="card p-2 p-md-4 shadow-sm mb-4">
// //                         <label className="form-label fw-bold fs-5 text-break">Agreement</label>
// //                         {editMode && !isclient && !savedClientSignature ? (
// //                             <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
// //                                 {agreement?.fixedParts?.map((part, index) => (
// //                                     <React.Fragment key={index}>
// //                                         <span>{part}</span>
// //                                         {index < agreement.editableValues.length && (
// //                                             <p
// //                                                 ref={(el) => {
// //                                                     if (el && !el.innerHTML.trim()) {
// //                                                         el.innerHTML = agreement.editableValues[index] || "\u00A0";
// //                                                     }
// //                                                 }}
// //                                                 contentEditable
// //                                                 suppressContentEditableWarning
// //                                                 onInput={(e) => {
// //                                                     const html = e.currentTarget.innerHTML;
// //                                                     handleEditableChange(index, html);
// //                                                 }}
// //                                                 onKeyDown={(e) => {
// //                                                     if (e.ctrlKey && e.key.toLowerCase() === "b") {
// //                                                         e.preventDefault();
// //                                                         document.execCommand("bold");
// //                                                     }
// //                                                     if (e.key === "Tab") {
// //                                                         e.preventDefault();
// //                                                         const selection = window.getSelection();
// //                                                         if (!selection.rangeCount) return;
// //                                                         const range = selection.getRangeAt(0);
// //                                                         const tabSpaces = "\u00A0".repeat(8);
// //                                                         const spaceNode = document.createTextNode(tabSpaces);
// //                                                         range.insertNode(spaceNode);
// //                                                         range.setStartAfter(spaceNode);
// //                                                         selection.removeAllRanges();
// //                                                         selection.addRange(range);
// //                                                     }
// //                                                 }}
// //                                                 onBlur={(e) => {
// //                                                     if (!e.currentTarget.textContent.trim()) {
// //                                                         e.currentTarget.innerHTML = "\u00A0";
// //                                                     }
// //                                                 }}
// //                                                 style={{
// //                                                     display: "inline",
// //                                                     minWidth: "2ch",
// //                                                     maxWidth: "100%",
// //                                                     outline: "none",
// //                                                     background: "transparent",
// //                                                     verticalAlign: "middle",
// //                                                     whiteSpace: "pre-wrap",
// //                                                     wordBreak: "break-word",
// //                                                     fontFamily: "inherit",
// //                                                     fontSize: "inherit",
// //                                                     padding: "0 2px",
// //                                                     boxSizing: "border-box",
// //                                                     textDecoration: "underline",
// //                                                     textDecorationSkipInk: "none",
// //                                                     textAlign: "justify",
// //                                                 }}
// //                                             />
// //                                         )}
// //                                     </React.Fragment>
// //                                 ))}
// //                             </div>
// //                         ) : (
// //                             <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
// //                                 {agreement?.fixedParts?.map((part, index) => (
// //                                     <React.Fragment key={index}>
// //                                         <span>{part}</span>
// //                                         {index < agreement.editableValues.length && (
// //                                             <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
// //                                         )}
// //                                     </React.Fragment>
// //                                 ))}
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* Fixed Headings */}
// //                     {renderHeadings(fixedHeadings, setFixedHeadings, true)}

// //                     {/* Custom Headings */}
// //                     {/* {renderHeadings(headings, setHeadings, false)} */}

// //                     {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
// //                         <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// //                             <h2>Lawyer Signature</h2>
// //                             <Form_SignaturePad height={250} onSave={handleSignatureSave} />
// //                         </div>
// //                     )}

// //                     <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// //                         {(isclient && !isLocalSign) && (
// //                             <div>
// //                                 <h2>Client Signature</h2>
// //                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div
// //                         style={{
// //                             display: "flex",
// //                             flexDirection: "row",
// //                             justifyContent: "space-between",
// //                             alignItems: "flex-start",
// //                             gap: "20px",
// //                             width: "100%",
// //                         }}
// //                     >
// //                         {savedSignature && (
// //                             <div>
// //                                 <h4>Lawyer Signature:</h4>
// //                                 <img
// //                                     src={savedSignature}
// //                                     alt="Lawyer Signature"
// //                                     style={{
// //                                         maxWidth: "220px",
// //                                         maxHeight: "300px",
// //                                         border: "1px solid #ccc",
// //                                         borderRadius: "4px",
// //                                     }}
// //                                 />
// //                             </div>
// //                         )}

// //                         {savedClientSignature && (
// //                             <div>
// //                                 <h4>Client Signature:</h4>
// //                                 <img
// //                                     src={savedClientSignature}
// //                                     alt="Client Signature"
// //                                     style={{
// //                                         maxWidth: "220px",
// //                                         border: "1px solid #ccc",
// //                                         borderRadius: "4px",
// //                                     }}
// //                                 />
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
// //                         {(!isclient && savedClientSignature && savedLawyerSignature) && (
// //                             <button
// //                                 className="btn btn-sm btn-primary fw-bold"
// //                                 onClick={handleUpdateLawyerSubmit}
// //                                 style={{ width: "150px" }}
// //                                 data-html2canvas-ignore="true"
// //                             >
// //                                 Save & Update Agreement
// //                             </button>
// //                         )}

// //                         {editMode ? (
// //                             <>
// //                                 {(!isFormFilled && !savedClientSignature) ? (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Submit Agreement
// //                                     </button>
// //                                 ) : (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={handleUpdateLawyerSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Update Agreement
// //                                     </button>
// //                                 )}
// //                             </>
// //                         ) : (
// //                             <>
// //                                 {(isclient && !isLocalSign) && (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={handleUpdateLawyerSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Submit Signature
// //                                     </button>
// //                                 )}

// //                                 {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={() => setEditMode(true)}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Edit Agreement
// //                                     </button>
// //                                 )}
// //                             </>
// //                         )}
// //                     </div>
// //                 </div>
// //             ) : (
// //                 <div className="text-center text-black py-5">No LFA Form Available.</div>
// //             )}
// //         </div>
// //     );
// // };

// // export default LEA_Form;




// //LFA_form 
// // import React, { useEffect, useState, useRef } from 'react';
// // import axios from 'axios';
// // import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// // import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// // import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import { ApiEndPoint } from '../utils/utlis';
// // import { useSelector } from 'react-redux';
// // import ConfirmModal from '../../AlertModels/ConfirmModal';
// // import { useAlert } from '../../../../Component/AlertContext';
// // import Form_SignaturePad from './Form_Componets/SignaturePad';
// // import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
// // import { Dropdown, Form, InputGroup } from "react-bootstrap";
// // import CEEditable from './CEEditable';
// // import { v4 as uuidv4 } from "uuid";

// // const LEA_Form = ({ token }) => {
// //     const caseInfo = useSelector((state) => state.screen.Caseinfo);
// //     const { showDataLoading } = useAlert();

// //     const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
// //     const [getDrafts, setGetDrafts] = useState(null);

// //     // NEW: force remount key for contentEditable sections
// //     const [draftKey, setDraftKey] = useState(0);

// //     useEffect(() => {
// //         FetchLFA();
// //     }, []);

// //     const [agreement, setAgreement] = useState({
// //         fixedParts: [
// //             'This Agreement ("Agreement") is entered into and shall become effective as of ',
// //             ', by and between:\n\n',
// //             ', with its principal place of business located at ',
// //             ', represented herein by ',
// //             ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
// //             ' a national of ',
// //             ', with their principal place of residence located ',
// //             ' issued on: ',
// //             ', having email ID: ',
// //             ' and Contact Number: ',
// //             ' (Hereinafter referred to as the "Client")'
// //         ],
// //         editableValues: [
// //             new Date().toLocaleDateString('en-GB'),
// //             'M/s AWS Legal Consultancy FZ-LLC',
// //             '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
// //             'Mr Aws M. Younis, Chairman',
// //             'Dr. Ali Moustafa Mohamed Elba',
// //             'Egypt',
// //             'Dubai, United Arab Emirates',
// //             'holding Emirates ID Number: ',
// //             '784-1952-3620694-4',
// //             new Date().toLocaleDateString('en-GB'),
// //             'alyelba@yahoo.com',
// //             '+971521356931'
// //         ]
// //     });

// //     const [fixedHeadings, setFixedHeadings] = useState([
// //         { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
// //         { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
// //     ]);

// //     const [headings, setHeadings] = useState([]);

// //     const [savedSignature, setSavedSignature] = useState(null);
// //     const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
// //     const [isFormFilled, setisFormFilled] = useState(false);
// //     const [savedClientSignature, setSavedClientSignature] = useState(null);
// //     const [isLocalSign, setIsLocalSign] = useState(false);
// //     const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
// //     const [dataList, setDataList] = useState([]);
// //     const isclient = token?.Role === "client";

// //     const FetchLFA = async () => {
// //         showDataLoading(true);
// //         try {
// //             const response = await fetch(`${ApiEndPoint}getLFAForm/${caseInfo?._id}`);
// //             if (!response.ok) {
// //                 showDataLoading(false);
// //                 throw new Error('Error fetching LFA');
// //             }
// //             const data = await response.json();
// //             showDataLoading(false);

// //             setAgreement(data.data.agreement);
// //             setDataList(data.data);
// //             setFixedHeadings(data.data.fixedHeadings);
// //             setHeadings(data.data.headings);
// //             setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
// //             setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
// //             setEditMode(false);
// //             setisFormFilled(true);
// //             setIsLocalSign(!!data.data?.ClientSignatureImage);
// //             setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
// //             setSavedLawyerSignature();

// //             // ensure UI refreshes on initial fetch too
// //             setDraftKey((k) => k + 1);
// //         } catch (err) {
// //             showDataLoading(false);
// //         }

// //         try {
// //             const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
// //             if (!response.ok) {
// //                 showDataLoading(false);
// //                 throw new Error('Error fetching LFA');
// //             }
// //             const data = await response.json();
// //             setGetDrafts(data);
// //         } catch (err) {
// //             showDataLoading(false);
// //         }
// //     };

// //     const handleSignatureSave = (dataUrl) => {
// //         setSavedSignature(dataUrl);
// //         setSavedLawyerSignature(dataUrl);
// //         setIsLocalLawyerSign(true);
// //     };

// //     const handleClientSignatureSave = (dataUrl) => {
// //         setSavedClientSignature(dataUrl);
// //     };

// //     const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

// //     const handleEditableChange = (index, newValue) => {
// //         const updated = [...agreement.editableValues];
// //         updated[index] = newValue;
// //         setAgreement({ ...agreement, editableValues: updated });
// //     };

// //     function base64ToFile(base64String, filename) {
// //         const arr = base64String.split(",");
// //         const mime = arr[0].match(/:(.*?);/)[1];
// //         const bstr = atob(arr[1]);
// //         let n = bstr.length;
// //         const u8arr = new Uint8Array(n);
// //         while (n--) {
// //             u8arr[n] = bstr.charCodeAt(n);
// //         }
// //         return new File([u8arr], filename, { type: mime });
// //     }

// //     const handleClientSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", false);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts,
// //                     editableValues: agreement?.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             if (savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //                 setIsLocalSign(true);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleLawyerSubmit = async () => {


// //         console.log(fixedHeadings)
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", true);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement.fixedParts,
// //                     editableValues: agreement.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             // FIXED: use lawyer signature (savedSignature), not savedClientSignature
// //             if (savedSignature) {
// //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleUpdateClientSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", false);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts,
// //                     editableValues: agreement?.editableValues
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             }));

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings));

// //             if (savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}createLFAForm`, {
// //                 method: "POST",
// //                 body: formData
// //             });

// //             const data = await res.json();
// //             if (data.success) {
// //                 setEditMode(false);
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const handleUpdateLawyerSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("caseId", caseInfo?._id || "");
// //             formData.append("Islawyer", !isclient);

// //             formData.append(
// //                 "agreement",
// //                 JSON.stringify({
// //                     fixedParts: agreement?.fixedParts || [],
// //                     editableValues: agreement?.editableValues || {}
// //                 })
// //             );

// //             const formattedHeadings = fixedHeadings?.map(h => ({
// //                 title: h.title,
// //                 points: h.points?.map(p => ({
// //                     text: p.text || "",
// //                     subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
// //                 }))
// //             })) || [];

// //             formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
// //             formData.append("headings", JSON.stringify(headings || []));

// //             if (!isclient && savedSignature) {
// //                 const file = base64ToFile(savedSignature, "lawyer-signature.png");
// //                 formData.append("file", file);
// //             }

// //             if (isclient && savedClientSignature) {
// //                 const file = base64ToFile(savedClientSignature, "client-signature.png");
// //                 formData.append("file", file);
// //             }

// //             const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
// //                 method: "PUT",
// //                 body: formData
// //             });

// //             const data = await res.json();

// //             if (data.success) {
// //                 setEditMode(false);
// //                 FetchLFA();
// //             } else {
// //                 console.error("❌ Failed:", data.message);
// //             }
// //         } catch (err) {
// //             console.error("Error submitting form:", err);
// //         }
// //     };

// //     const addHeading = () =>
// //         setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

// //     const updateHeadingTitle = (hIndex, value) => {
// //         const updated = [...headings];
// //         updated[hIndex].title = value;
// //         setHeadings(updated);
// //     };

// //     const updatePoint = (setFn, list, hIndex, pIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].text = value;
// //         setFn(updated);
// //     };

// //     const updateSubpoint = (setFn, list, hIndex, pIndex, sIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].text = value;
// //         setFn(updated);
// //     };

// //     const updateSubSubpoint = (setFn, list, hIndex, pIndex, sIndex, ssIndex, value) => {
// //         const updated = [...list];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints[ssIndex].text = value;
// //         setFn(updated);
// //     };

// //     const removePoint = (hIndex, pIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points.splice(pIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const removeSubpoint = (hIndex, pIndex, sIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points[pIndex].subpoints.splice(sIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const removeSubSubpoint = (hIndex, pIndex, sIndex, ssIndex) => {
// //         const updated = [...headings];
// //         updated[hIndex].points[pIndex].subpoints[sIndex].subsubpoints.splice(ssIndex, 1);
// //         setHeadings(updated);
// //     };

// //     const [editHeadingIndex, setEditHeadingIndex] = useState(null);

// //     const pdfRef = useRef(null);

// //     const handleDownload = async () => {
// //         if (!pdfRef.current) return;
// //         try {
// //             pdfRef.current.classList.add("pdf-mode");
// //             const { default: html2pdf } = await import("html2pdf.js");
// //             const opt = {
// //                 margin: [12, 15, 12, 15],
// //                 filename: "Legal_Fee_Agreement.pdf",
// //                 image: { type: "jpeg", quality: 0.98 },
// //                 html2canvas: { scale: 2.2, useCORS: true, scrollY: 0 },
// //                 jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
// //                 pagebreak: { mode: ["css", "legacy"] },
// //             };
// //             await html2pdf().set(opt).from(pdfRef.current).save();
// //         } catch (e) {
// //             console.error("PDF generation failed:", e);
// //             alert("Sorry, unable to generate PDF. Check console for details.");
// //         } finally {
// //             pdfRef.current.classList.remove("pdf-mode");
// //         }
// //     };

// //     // UPDATED: selecting a draft now forces a clean remount & syncs signatures
// //     const handlePickDraft = (data) => {
// //         setAgreement(data.agreement);
// //         setFixedHeadings(data.fixedHeadings);
// //         setHeadings(data.headings);
// //         setSelectedDrafts(data);
// //         // setSavedClientSignature(data?.ClientSignatureImage || "");
// //         // setSavedSignature(data?.LawyerSignatureImage || "");
// //         //  setEditMode(true);
// //         setDraftKey((k) => k + 1); // force remount
// //     };



// //     // const renderHeadings = (list, setFn, isFixed = false) => {
// //     //     // === helpers: insert/delete right AFTER current index ===

// //     //     const deleteHeading = (index) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// //     //             if (index < 0 || index >= updated.length) return prev;
// //     //             updated.splice(index, 1);
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addHeadingAfter = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// //     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
// //     //             updated.splice(hIndex + 1, 0, newHeading);
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addPointAfter = (hIndex, pIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const deletePoint = (hIndex, pIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             if (pIndex < 0 || pIndex >= pts.length) return prev;

// //     //             pts.splice(pIndex, 1);
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addPointAtEnd = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             pts.push({ text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     return list?.map((heading, hIndex) => (
// //     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// //     //             <div
// //     //                 className="heading-row"
// //     //                 style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}
// //     //             >
// //     //                 <div
// //     //                     className="idx"
// //     //                     style={{ width: "20px", minWidth: "10px", textAlign: "right", fontWeight: 600 }}
// //     //                 >
// //     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
// //     //                 </div>

// //     //                 <div className="form-control bg-white p-1 fw-bold" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
// //     //                     {editMode && !savedClientSignature ? (
// //     //                         <p
// //     //                             ref={(el) => {
// //     //                                 if (el && !el.innerHTML.trim()) el.innerHTML = heading.title || "\u00A0";
// //     //                             }}
// //     //                             contentEditable
// //     //                             suppressContentEditableWarning
// //     //                             onInput={(e) => {
// //     //                                 const html = e.currentTarget.innerHTML;
// //     //                                 const updated = [...list];
// //     //                                 updated[hIndex].title = html;
// //     //                                 setFn(updated);
// //     //                             }}
// //     //                             onKeyDown={(e) => {
// //     //                                 if (e.ctrlKey && e.key.toLowerCase() === "b") {
// //     //                                     e.preventDefault();
// //     //                                     document.execCommand("bold");
// //     //                                 }
// //     //                                 if (e.key === "Tab") {
// //     //                                     e.preventDefault();
// //     //                                     const selection = window.getSelection();
// //     //                                     if (!selection.rangeCount) return;
// //     //                                     const range = selection.getRangeAt(0);
// //     //                                     const tabSpaces = "\u00A0".repeat(8);
// //     //                                     const spaceNode = document.createTextNode(tabSpaces);
// //     //                                     range.insertNode(spaceNode);
// //     //                                     range.setStartAfter(spaceNode);
// //     //                                     selection.removeAllRanges();
// //     //                                     selection.addRange(range);
// //     //                                 }
// //     //                             }}
// //     //                             onBlur={(e) => {
// //     //                                 if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
// //     //                             }}
// //     //                             style={{
// //     //                                 display: "inline-block",
// //     //                                 minHeight: "40px",
// //     //                                 width: "100%",
// //     //                                 outline: "none",
// //     //                                 background: "transparent",
// //     //                                 whiteSpace: "pre-wrap",
// //     //                                 wordBreak: "break-word",
// //     //                                 fontFamily: "inherit",
// //     //                                 fontSize: "inherit",
// //     //                                 fontWeight: "bold",
// //     //                                 padding: "4px 6px",
// //     //                                 border: "1px solid #ccc",
// //     //                                 borderRadius: "4px",
// //     //                                 boxSizing: "border-box",
// //     //                                 textAlign: "justify",
// //     //                             }}
// //     //                         />
// //     //                     ) : (
// //     //                         <div>
// //     //                             <React.Fragment key={hIndex}>
// //     //                                 <span>{heading.label || ""}</span>
// //     //                                 <span dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// //     //                             </React.Fragment>
// //     //                         </div>
// //     //                     )}
// //     //                 </div>

// //     //                 {/* ACTIONS: now insert AFTER current heading */}
// //     //                 <div
// //     //                     style={{ display: editMode && !savedClientSignature ? "flex" : "none", gap: "6px" }}
// //     //                     data-html2canvas-ignore="true"
// //     //                 >
// //     //                     <div
// //     //                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(4, 2, 2, 0.2)", cursor: "pointer" }}
// //     //                         onClick={() => addHeadingAfter(hIndex)}
// //     //                     >
// //     //                         <BsPlus />
// //     //                     </div>
// //     //                     <div
// //     //                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// //     //                         onClick={() => deleteHeading(hIndex)}
// //     //                     >
// //     //                         <BsDash />
// //     //                     </div>
// //     //                 </div>
// //     //             </div>

// //     //             <ul className="list-unstyled ps-2 ps-md-3">
// //     //                 {heading.points?.map((point, pIndex) => (
// //     //                     <li key={pIndex}>
// //     //                         <div className="d-flex flex-wrap align-items-center mb-2">
// //     //                             {editMode && !savedClientSignature ? (
// //     //                                 <p
// //     //                                     ref={(el) => {
// //     //                                         if (el && !el.innerHTML.trim()) el.innerHTML = point.text || "\u00A0";
// //     //                                     }}
// //     //                                     contentEditable
// //     //                                     suppressContentEditableWarning
// //     //                                     onInput={(e) => {
// //     //                                         const html = e.currentTarget.innerHTML;
// //     //                                         const updated = [...list];
// //     //                                         updated[hIndex].points[pIndex].text = html;
// //     //                                         setFn(updated);
// //     //                                     }}
// //     //                                     onKeyDown={(e) => {
// //     //                                         if (e.ctrlKey && e.key.toLowerCase() === "b") {
// //     //                                             e.preventDefault();
// //     //                                             document.execCommand("bold");
// //     //                                         }
// //     //                                         if (e.key === "Tab") {
// //     //                                             e.preventDefault();
// //     //                                             const selection = window.getSelection();
// //     //                                             if (!selection.rangeCount) return;
// //     //                                             const range = selection.getRangeAt(0);
// //     //                                             const tabSpaces = "\u00A0".repeat(8);
// //     //                                             const spaceNode = document.createTextNode(tabSpaces);
// //     //                                             range.insertNode(spaceNode);
// //     //                                             range.setStartAfter(spaceNode);
// //     //                                             selection.removeAllRanges();
// //     //                                             selection.addRange(range);
// //     //                                         }
// //     //                                     }}
// //     //                                     onBlur={(e) => {
// //     //                                         if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
// //     //                                     }}
// //     //                                     style={{
// //     //                                         display: "inline-block",
// //     //                                         minHeight: "40px",
// //     //                                         width: "100%",
// //     //                                         outline: "none",
// //     //                                         background: "transparent",
// //     //                                         whiteSpace: "pre-wrap",
// //     //                                         wordBreak: "break-word",
// //     //                                         fontFamily: "inherit",
// //     //                                         fontSize: "inherit",
// //     //                                         padding: "4px 6px",
// //     //                                         border: "1px solid #ddd",
// //     //                                         borderRadius: "4px",
// //     //                                         boxSizing: "border-box",
// //     //                                         textAlign: "justify",
// //     //                                     }}
// //     //                                 />
// //     //                             ) : (
// //     //                                 <div className="" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
// //     //                                     <React.Fragment key={pIndex}>
// //     //                                         <span>{point.label || ""}</span>
// //     //                                         <span dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// //     //                                     </React.Fragment>
// //     //                                 </div>
// //     //                             )}

// //     //                             {editMode && !savedClientSignature && (
// //     //                                 <>
// //     //                                     {/* INSERT new point AFTER current pIndex */}
// //     //                                     <div
// //     //                                         style={{ color: "green", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// //     //                                         onClick={() => addPointAfter(hIndex, pIndex)}
// //     //                                         data-html2canvas-ignore="true"
// //     //                                     >
// //     //                                         <BsPlus />
// //     //                                     </div>
// //     //                                     <div
// //     //                                         style={{ color: "red", fontSize: 16, borderRadius: "5px", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
// //     //                                         onClick={() => deletePoint(hIndex, pIndex)}
// //     //                                         data-html2canvas-ignore="true"
// //     //                                     >
// //     //                                         <BsDash />
// //     //                                     </div>
// //     //                                 </>
// //     //                             )}
// //     //                         </div>

// //     //                         {/* subpoints UI remains same */}
// //     //                         {Array.isArray(point?.subpoints) && point.subpoints.length > 0 && (
// //     //                             <div style={{ margin: "4px 0 8px 0", paddingLeft: "16px", paddingRight: "16px" }}>
// //     //                                 {point.subpoints.map((sp, sIndex) => {
// //     //                                     const html = typeof sp === "string" ? sp : sp?.text || "";
// //     //                                     return (
// //     //                                         <table
// //     //                                             key={sIndex}
// //     //                                             style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", margin: "2px 0" }}
// //     //                                         >
// //     //                                             <tbody>
// //     //                                                 <tr>
// //     //                                                     <td style={{ width: "14px", minWidth: "14px", textAlign: "center", verticalAlign: "top" }}>
// //     //                                                         •
// //     //                                                     </td>
// //     //                                                     <td style={{ paddingLeft: "8px", textAlign: "justify", wordBreak: "break-word" }}>
// //     //                                                         <div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
// //     //                                                     </td>
// //     //                                                 </tr>
// //     //                                             </tbody>
// //     //                                         </table>
// //     //                                     );
// //     //                                 })}
// //     //                             </div>
// //     //                         )}
// //     //                     </li>
// //     //                 ))}

// //     //                 {editMode && !savedClientSignature && (
// //     //                     <li>
// //     //                         <button
// //     //                             type="button"
// //     //                             className="btn btn-outline-primary btn-sm"
// //     //                             onClick={() => addPointAtEnd(hIndex)}
// //     //                             data-html2canvas-ignore="true"
// //     //                         >
// //     //                             + Add Point
// //     //                         </button>
// //     //                     </li>
// //     //                 )}
// //     //             </ul>
// //     //         </div>
// //     //     ));
// //     // };




// //     // const renderHeadings = (list, setFn, isFixed = false) => {
// //     //     // === helpers ===
// //     //     const deleteHeading = (hIndex) => {
// //     //         if (!editMode) return;

// //     //         setFn((prev) => {
// //     //             if (!Array.isArray(prev)) return prev;

// //     //             const updated = [...prev];
// //     //             updated.splice(hIndex, 1); // sirf targeted heading delete
// //     //             return updated;
// //     //         });

// //     //         // focus shifting (optional)
// //     //         setTimeout(() => {
// //     //             const targetIdx = Math.max(0, hIndex - 1);
// //     //             const editors = document.querySelectorAll('[data-head-editor="1"]');
// //     //             if (editors && editors[targetIdx]) {
// //     //                 editors[targetIdx].focus();
// //     //             }
// //     //         }, 0);
// //     //     };

// //     //     const addHeadingAfter = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// //     //             const newHeading = { title: "New Section", points: [{ text: "", subpoints: [] }] };
// //     //             updated.splice(hIndex + 1, 0, newHeading);
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addPointAfter = (hIndex, pIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             pts.splice(pIndex + 1, 0, { text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const deletePoint = (hIndex, pIndex) => {
// //     //         if (!editMode) return;

// //     //         setFn((prev) => {
// //     //             if (!Array.isArray(prev)) return prev;

// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading || !Array.isArray(heading.points)) return prev;

// //     //             const newPoints = [...heading.points];
// //     //             newPoints.splice(pIndex, 1); // sirf targeted point delete

// //     //             updated[hIndex] = { ...heading, points: newPoints };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     const addPointAtEnd = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = Array.isArray(heading.points) ? [...heading.points] : [];
// //     //             pts.push({ text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     // === UI ===
// //     //     return list?.map((heading, hIndex) => (
// //     //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// //     //             {/* Heading Title */}
// //     //             <div className="heading-row" style={{ display: "grid", columnGap: "1px", alignItems: "center", marginBottom: "8px" }}>
// //     //                 <div className="idx" style={{ width: "20px", textAlign: "right", fontWeight: 600 }}>
// //     //                     {isFixed ? hIndex + 1 : hIndex + 11}.
// //     //                 </div>

// //     //                 {editMode && !savedClientSignature ? (

// //     //                     <CEEditable
// //     //                         tag="h4"
// //     //                         html={heading.title}
// //     //                         placeholder={"\\u00A0"}
// //     //                         className="form-control bg-white p-1 fw-bold"
// //     //                         style={{
// //     //                             whiteSpace: "pre-wrap",
// //     //                             textAlign: "justify",
// //     //                             display: "inline-block",
// //     //                             minHeight: "40px",
// //     //                             width: "100%",
// //     //                             outline: "none",
// //     //                             background: "transparent",
// //     //                             wordBreak: "break-word",
// //     //                             fontFamily: "inherit",
// //     //                             fontSize: "inherit",
// //     //                             fontWeight: "bold",
// //     //                             padding: "4px 6px",
// //     //                             border: "1px solid #ccc",
// //     //                             borderRadius: "4px",
// //     //                             boxSizing: "border-box",
// //     //                         }}
// //     //                         onChange={(newHtml) => {
// //     //                             const updated = [...list];
// //     //                             updated[hIndex].title = newHtml;
// //     //                             setFn(updated);
// //     //                         }}
// //     //                         onEmpty={() => {
// //     //                             // If you also want "empty = delete":
// //     //                             // setFn(prev => {
// //     //                             //   const next = Array.isArray(prev) ? [...prev] : [];
// //     //                             //   next.splice(hIndex, 1);
// //     //                             //   return next;
// //     //                             // });
// //     //                         }}
// //     //                         data-head-editor="1"   // <— add this so we can focus after delete
// //     //                     />


// //     //                 ) : (
// //     //                     <div className="fw-bold" style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// //     //                 )}

// //     //                 {editMode && !savedClientSignature && (
// //     //                     <div style={{ display: "flex", gap: "6px" }} data-html2canvas-ignore="true">
// //     //                         <div style={{ color: "green", cursor: "pointer" }} onClick={() => addHeadingAfter(hIndex)}>
// //     //                             <BsPlus />
// //     //                         </div>
// //     //                         <div style={{ color: "red", cursor: "pointer" }} onClick={() => deleteHeading(hIndex)}>
// //     //                             <BsDash />
// //     //                         </div>
// //     //                     </div>
// //     //                 )}
// //     //             </div>

// //     //             {/* Points */}
// //     //             <ul className="list-unstyled ps-2 ps-md-3">
// //     //                 {heading.points?.map((point, pIndex) => (
// //     //                     <li key={pIndex}>
// //     //                         <div className="d-flex align-items-center mb-2">
// //     //                             {editMode && !savedClientSignature ? (
// //     //                                 <p
// //     //                                     contentEditable
// //     //                                     suppressContentEditableWarning
// //     //                                     onInput={(e) => {
// //     //                                         const updated = [...list];
// //     //                                         updated[hIndex].points[pIndex].text = e.currentTarget.innerHTML;
// //     //                                         setFn(updated);
// //     //                                     }}
// //     //                                     style={{
// //     //                                         minHeight: "30px",
// //     //                                         width: "100%",
// //     //                                         outline: "none",
// //     //                                         border: "1px solid #ddd",
// //     //                                         borderRadius: "4px",
// //     //                                         padding: "4px 6px",
// //     //                                         textAlign: "justify"
// //     //                                     }}
// //     //                                     dangerouslySetInnerHTML={{ __html: point.text || "" }}
// //     //                                 />
// //     //                             ) : (
// //     //                                 <div style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// //     //                             )}

// //     //                             {editMode && !savedClientSignature && (
// //     //                                 <>
// //     //                                     <div style={{ color: "green", cursor: "pointer" }} onClick={() => addPointAfter(hIndex, pIndex)}>
// //     //                                         <BsPlus />
// //     //                                     </div>
// //     //                                     <div style={{ color: "red", cursor: "pointer" }} onClick={() => deletePoint(hIndex, pIndex)}>
// //     //                                         <BsDash />
// //     //                                     </div>
// //     //                                 </>
// //     //                             )}
// //     //                         </div>
// //     //                     </li>
// //     //                 ))}

// //     //                 {editMode && !savedClientSignature && (
// //     //                     <li>
// //     //                         <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => addPointAtEnd(hIndex)} data-html2canvas-ignore="true">
// //     //                             + Add Point
// //     //                         </button>
// //     //                     </li>
// //     //                 )}
// //     //             </ul>
// //     //         </div>
// //     //     ));
// //     // };




// //     // const renderHeadings = (list, setFn, isFixed = false) => {
// //     //     // Add Heading
// //     //     const addHeadingAfter = (hIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = Array.isArray(prev) ? [...prev] : [];
// //     //             const newHeading = { id: uuidv4(), title: "New Section", points: [{ id: uuidv4(), text: "", subpoints: [] }] };
// //     //             updated.splice(hIndex + 1, 0, newHeading);
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     // Add Point
// //     //     const addPointAfter = (hIndex, pIndex) => {
// //     //         if (!editMode) return;
// //     //         setFn((prev) => {
// //     //             const updated = [...prev];
// //     //             const heading = updated[hIndex];
// //     //             if (!heading) return prev;

// //     //             const pts = [...(heading.points || [])];
// //     //             pts.splice(pIndex + 1, 0, { id: uuidv4(), text: "", subpoints: [] });
// //     //             updated[hIndex] = { ...heading, points: pts };
// //     //             return updated;
// //     //         });
// //     //     };

// //     //     // === UI ===
// //     //     return list?.map((heading, hIndex) => (
// //     //         <div key={heading.id} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
// //     //             {/* Heading Title */}
// //     //             <div className="heading-row d-flex align-items-center mb-2">
// //     //                 <div className="idx fw-bold me-2">{isFixed ? hIndex + 1 : hIndex + 11}.</div>

// //     //                 {editMode && !savedClientSignature ? (
// //     //                     <CEEditable
// //     //                         key={heading.id}   // force re-init editor
// //     //                         html={heading.title}
// //     //                         onChange={(newHtml) => {
// //     //                             setFn((prev) => {
// //     //                                 const updated = [...prev];
// //     //                                 updated[hIndex].title = newHtml;
// //     //                                 return updated;
// //     //                             });
// //     //                         }}
// //     //                     />
// //     //                 ) : (
// //     //                     <div className="fw-bold" dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
// //     //                 )}
// //     //             </div>

// //     //             {/* Points */}
// //     //             <ul className="list-unstyled ps-3">
// //     //                 {heading.points?.map((point, pIndex) => (
// //     //                     <li key={point.id}>
// //     //                         {editMode && !savedClientSignature ? (
// //     //                             <CEEditable
// //     //                                 key={point.id}   // force re-init editor
// //     //                                 html={point.text}
// //     //                                 onChange={(newHtml) => {
// //     //                                     setFn((prev) => {
// //     //                                         const updated = [...prev];
// //     //                                         updated[hIndex].points[pIndex].text = newHtml;
// //     //                                         return updated;
// //     //                                     });
// //     //                                 }}
// //     //                             />
// //     //                         ) : (
// //     //                             <div dangerouslySetInnerHTML={{ __html: point.text || "" }} />
// //     //                         )}
// //     //                     </li>
// //     //                 ))}
// //     //             </ul>
// //     //         </div>
// //     //     ));
// //     // };



// //     // ---- renderHeadings.jsx ----


// //     const renderHeadings = (list, setFn, isFixed = false) => {
// //         if (!Array.isArray(list)) return null;

// //         // Step 1: Array -> HTML
// //         const combinedHtml = list
// //             .map(
// //                 (heading, hIndex) => `
// //                 <p><strong><ul>${heading.title || ""}</ul></strong></p>
// //                 <ul>
// //                     ${(heading.points || [])
// //                         .map((p) => `<li>${p.text || ""}</li>`)
// //                         .join("")}
// //                 </ul>
// //             `
// //             )
// //             .join("");

// //         // Step 2: HTML -> Array
// //         const parseHtmlToArray = (html) => {
// //             const parser = new DOMParser();
// //             const doc = parser.parseFromString(html, "text/html");
// //             const sections = [];

// //             let currentHeading = null;

// //             doc.body.childNodes.forEach((node) => {
// //                 if (node.nodeName === "P") {
// //                     // extract heading text (remove numbering if any)
// //                     const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
// //                     currentHeading = { title: headingText, points: [] };
// //                     sections.push(currentHeading);
// //                 } else if (node.nodeName === "UL" && currentHeading) {
// //                     const points = Array.from(node.querySelectorAll("li")).map((li) => ({
// //                         text: li.innerHTML,
// //                         subpoints: [],
// //                     }));
// //                     currentHeading.points = points;
// //                 }
// //             });

// //             return sections;
// //         };

// //         return (
// //             <div className="section border p-2 rounded bg-light">
// //                 {editMode ? (
// //                     <CEEditable
// //                         list={list} // 👈 ab array directly de sakte ho
// //                         onChange={(updatedList) => setFixedHeadings(updatedList)}
// //                         disable={(isFormFilled && !editMode)}
// //                     />
// //                 ) : (
// //                     <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
// //                 )}
// //             </div>
// //         );
// //     };


// //     return (
// //         <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
// //             <style>{`
// //         .word-paper { color: #000; line-height: 1.4; }
// //         .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
// //         .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
// //         .word-paper .form-control,
// //         .word-paper [contenteditable="true"],
// //         .word-paper ul.sub-bullets,
// //         .word-paper ul.sub-bullets li { text-align: justify; }
// //         .word-paper.pdf-mode * { box-shadow: none !important; }
// //         .word-paper.pdf-mode .card,
// //         .word-paper.pdf-mode .form-control,
// //         .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
// //         .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }
// //         .word-paper.pdf-mode ul,
// //         .word-paper.pdf-mode ol { list-style: revert !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// //         .word-paper ul.sub-bullets { list-style-type: disc !important; list-style-position: outside !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
// //         .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
// //         .word-paper .list-unstyled ul.sub-bullets,
// //         .word-paper .form-control ul.sub-bullets { list-style-type: disc !important; padding-left: 24px !important; }
// //         @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
// //       `}</style>

// //             {/* toolbar */}
// //             <div className="d-flex justify-content-end mb-3" data-html2canvas-ignore="true">
// //                 <button
// //                     className="btn btn-primary d-flex align-items-center"
// //                     onClick={handleDownload}
// //                     style={{ padding: "8px 16px" }}
// //                     data-html2canvas-ignore="true"
// //                 >
// //                     <BsDownload className="me-2" />
// //                     Download PDF
// //                 </button>
// //             </div>

// //             {(!isclient || isFormFilled) ? (
// //                 // IMPORTANT: key={draftKey} forces remount so new draft values appear
// //                 <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey}>
// //                     {/* Header */}
// //                     <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
// //                         <img
// //                             src="logo.png"
// //                             alt="Logo"
// //                             className="me-2 me-md-3 mb-2 mb-md-0"
// //                             style={{ height: "50px" }}
// //                         />
// //                         <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
// //                     </div>

// //                     {token?.Role !== "client" && (
// //                         // <Form.Group className="mb-3">
// //                         //     <Form.Label>Drafts <span className="text-danger"></span></Form.Label>
// //                         //     <InputGroup>
// //                         //         <Dropdown className="w-100">
// //                         //             <Dropdown.Toggle
// //                         //                 variant="outline-secondary"
// //                         //                 id="dropdown-practice-area"
// //                         //                 // ENABLED now: allow switching drafts anytime
// //                         //                 className="w-100 text-start d-flex justify-content-between align-items-center"
// //                         //             >
// //                         //                 {selectedDrafts === "Select Draft" ? "Select Draft" : `${selectedDrafts?.CaseNumber}`}
// //                         //             </Dropdown.Toggle>

// //                         //             <Dropdown.Menu className="w-100">
// //                         //                 {getDrafts?.map((data, index) => (
// //                         //                     <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// //                         //                         {data?.CaseNumber}
// //                         //                     </Dropdown.Item>
// //                         //                 ))}
// //                         //             </Dropdown.Menu>
// //                         //         </Dropdown>
// //                         //     </InputGroup>
// //                         // </Form.Group>


// //                         <Form.Group className="mb-3">
// //                             <Form.Label>Drafts</Form.Label>

// //                             <Dropdown className="w-100">
// //                                 <Dropdown.Toggle
// //                                     variant="outline-secondary"
// //                                     disabled={isFormFilled}
// //                                     id="dropdown-practice-area"
// //                                     className="w-100 text-start d-flex justify-content-between align-items-center"
// //                                 >
// //                                     {selectedDrafts === "Select Draft"
// //                                         ? "Select Draft"
// //                                         : `${selectedDrafts?.CaseNumber}`}
// //                                 </Dropdown.Toggle>

// //                                 <Dropdown.Menu className="w-100" disabled={isFormFilled}>


// //                                     {getDrafts?.map((data, index) => (
// //                                         <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
// //                                             {data?.CaseNumber}
// //                                         </Dropdown.Item>
// //                                     ))}
// //                                 </Dropdown.Menu>
// //                             </Dropdown>
// //                         </Form.Group>

// //                     )}

// //                     <div className="card p-2 p-md-4 shadow-sm mb-4">
// //                         <label className="form-label fw-bold fs-5 text-break">Agreement</label>
// //                         {editMode && !isclient && !savedClientSignature ? (
// //                             <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
// //                                 {agreement?.fixedParts?.map((part, index) => (
// //                                     <React.Fragment key={index}>
// //                                         <span>{part}</span>
// //                                         {index < agreement.editableValues.length && (
// //                                             <p
// //                                                 ref={(el) => {
// //                                                     if (el && !el.innerHTML.trim()) {
// //                                                         el.innerHTML = agreement.editableValues[index] || "\u00A0";
// //                                                     }
// //                                                 }}
// //                                                 contentEditable
// //                                                 suppressContentEditableWarning
// //                                                 onInput={(e) => {
// //                                                     const html = e.currentTarget.innerHTML;
// //                                                     handleEditableChange(index, html);
// //                                                 }}
// //                                                 onKeyDown={(e) => {
// //                                                     if (e.ctrlKey && e.key.toLowerCase() === "b") {
// //                                                         e.preventDefault();
// //                                                         document.execCommand("bold");
// //                                                     }
// //                                                     if (e.key === "Tab") {
// //                                                         e.preventDefault();
// //                                                         const selection = window.getSelection();
// //                                                         if (!selection.rangeCount) return;
// //                                                         const range = selection.getRangeAt(0);
// //                                                         const tabSpaces = "\u00A0".repeat(8);
// //                                                         const spaceNode = document.createTextNode(tabSpaces);
// //                                                         range.insertNode(spaceNode);
// //                                                         range.setStartAfter(spaceNode);
// //                                                         selection.removeAllRanges();
// //                                                         selection.addRange(range);
// //                                                     }
// //                                                 }}
// //                                                 onBlur={(e) => {
// //                                                     if (!e.currentTarget.textContent.trim()) {
// //                                                         e.currentTarget.innerHTML = "\u00A0";
// //                                                     }
// //                                                 }}
// //                                                 style={{
// //                                                     display: "inline",
// //                                                     minWidth: "2ch",
// //                                                     maxWidth: "100%",
// //                                                     outline: "none",
// //                                                     background: "transparent",
// //                                                     verticalAlign: "middle",
// //                                                     whiteSpace: "pre-wrap",
// //                                                     wordBreak: "break-word",
// //                                                     fontFamily: "inherit",
// //                                                     fontSize: "inherit",
// //                                                     padding: "0 2px",
// //                                                     boxSizing: "border-box",
// //                                                     textDecoration: "underline",
// //                                                     textDecorationSkipInk: "none",
// //                                                     textAlign: "justify",
// //                                                 }}
// //                                             />
// //                                         )}
// //                                     </React.Fragment>
// //                                 ))}
// //                             </div>
// //                         ) : (
// //                             <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
// //                                 {agreement?.fixedParts?.map((part, index) => (
// //                                     <React.Fragment key={index}>
// //                                         <span>{part}</span>
// //                                         {index < agreement.editableValues.length && (
// //                                             <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
// //                                         )}
// //                                     </React.Fragment>
// //                                 ))}
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* Fixed Headings */}
// //                     {renderHeadings(fixedHeadings, setFixedHeadings, true)}

// //                     {/* Custom Headings */}
// //                     {/* {renderHeadings(headings, setHeadings, false)} */}

// //                     {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
// //                         <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// //                             <h2>Lawyer Signature</h2>
// //                             <Form_SignaturePad height={250} onSave={handleSignatureSave} />
// //                         </div>
// //                     )}

// //                     <div style={{ padding: 20 }} data-html2canvas-ignore="true">
// //                         {(isclient && !isLocalSign) && (
// //                             <div>
// //                                 <h2>Client Signature</h2>
// //                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div
// //                         style={{
// //                             display: "flex",
// //                             flexDirection: "row",
// //                             justifyContent: "space-between",
// //                             alignItems: "flex-start",
// //                             gap: "20px",
// //                             width: "100%",
// //                         }}
// //                     >
// //                         {savedSignature && (
// //                             <div>
// //                                 <h4>Lawyer Signature:</h4>
// //                                 <img
// //                                     src={savedSignature}
// //                                     alt="Lawyer Signature"
// //                                     style={{
// //                                         maxWidth: "220px",
// //                                         maxHeight: "300px",
// //                                         border: "1px solid #ccc",
// //                                         borderRadius: "4px",
// //                                     }}
// //                                 />
// //                             </div>
// //                         )}

// //                         {savedClientSignature && (
// //                             <div>
// //                                 <h4>Client Signature:</h4>
// //                                 <img
// //                                     src={savedClientSignature}
// //                                     alt="Client Signature"
// //                                     style={{
// //                                         maxWidth: "220px",
// //                                         border: "1px solid #ccc",
// //                                         borderRadius: "4px",
// //                                     }}
// //                                 />
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
// //                         {(!isclient && savedClientSignature && savedLawyerSignature) && (
// //                             <button
// //                                 className="btn btn-sm btn-primary fw-bold"
// //                                 onClick={handleUpdateLawyerSubmit}
// //                                 style={{ width: "150px" }}
// //                                 data-html2canvas-ignore="true"
// //                             >
// //                                 Save & Update Agreement
// //                             </button>
// //                         )}

// //                         {editMode ? (
// //                             <>
// //                                 {(!isFormFilled && !savedClientSignature) ? (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Submit Agreement
// //                                     </button>
// //                                 ) : (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={handleUpdateLawyerSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Update Agreement
// //                                     </button>
// //                                 )}
// //                             </>
// //                         ) : (
// //                             <>
// //                                 {(isclient && !isLocalSign) && (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={handleUpdateLawyerSubmit}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Save & Submit Signature
// //                                     </button>
// //                                 )}

// //                                 {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
// //                                     <button
// //                                         className="btn btn-sm btn-primary fw-bold"
// //                                         onClick={() => setEditMode(true)}
// //                                         style={{ width: "150px" }}
// //                                         data-html2canvas-ignore="true"
// //                                     >
// //                                         Edit Agreement
// //                                     </button>
// //                                 )}
// //                             </>
// //                         )}
// //                     </div>
// //                 </div>
// //             ) : (
// //                 <div className="text-center text-black py-5">No LFA Form Available.</div>
// //             )}
// //         </div>
// //     );
// // };

// // export default LEA_Form;




// //LFA_form 
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
// import { Dropdown, Form, InputGroup, Modal, Button } from "react-bootstrap";
// import CEEditable from './CEEditable';
// import { v4 as uuidv4 } from "uuid";
// import { jsPDF } from "jspdf";
// import logo from '../../../Pages/Images/logo.png';
// import pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
// import backgroundImage from "../../../Pages/Images/bg.jpg";
// import logoiA from "../../../Pages/Component/assets/Stamp.png";// Add your stamp image
// import AWSlogo from "../../../Pages/Component/assets/AWSSideLogo.png"; // Add this import at the top of your file
// import AWSlogo5 from "../../../Pages/Component/assets/AWSSideLogo2.png";

// // Properly set up the vfs
// pdfMake.vfs = pdfFonts.vfs;

// // Also set the fonts
// pdfMake.fonts = {
//     Roboto: {
//         normal: 'Roboto-Regular.ttf',
//         bold: 'Roboto-Medium.ttf',
//         italics: 'Roboto-Italic.ttf',
//         bolditalics: 'Roboto-MediumItalic.ttf'
//     }
// };

// const LEA_Form = ({ token }) => {
//     const [isHovered, setIsHovered] = useState(false);
//     const caseInfo = useSelector((state) => state.screen.Caseinfo);
//     const { showDataLoading } = useAlert();

//     const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
//     const [getDrafts, setGetDrafts] = useState(null);

//     // NEW: force remount key for contentEditable sections
//     const [draftKey, setDraftKey] = useState(0);

//     // NEW: State for client rejection
//     const [showRejectModal, setShowRejectModal] = useState(false);
//     const [rejectionReason, setRejectionReason] = useState("");
//     const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);
//     // Add these state variables and functions to your component
//     const [caseId, setCaseId] = useState(null);
//     const [LinkcaseId, setLinkcaseId] = useState("");
//     const [showLinkGenerator, setShowLinkGenerator] = useState(true);
//     const [generatedLink, setGeneratedLink] = useState("");
//     const [isEmailLinkAccess, setIsEmailLinkAccess] = useState(false);
//     const [signatureSubmitted, setSignatureSubmitted] = useState(false); // NEW: Track if signature was submitted

//     const handleGenerateLink = () => {
//         const originalLink = `${window.location.origin}/LFA_Form?caseId=${caseInfo?._id}&timestamp=${Date.now()}`
//         const encrypted = btoa(originalLink);
//         const finalLink = `${window.location.origin}/LFA_Form?data=${encodeURIComponent(encrypted)}`
//         setGeneratedLink(finalLink);

//         navigator.clipboard.writeText(finalLink)
//             .then(() => {
//                 alert("Encrypted link copied to clipboard!");
//             })
//             .catch((err) => {
//                 console.error("Failed to copy: ", err);
//             });
//     };

//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const encoded = params.get("data");
//         const caseIdParam = params.get("caseId");

//         if (encoded) {
//             try {
//                 const decodedLink = atob(decodeURIComponent(encoded));
//                 console.log("Decoded full link:", decodedLink);

//                 const url = new URL(decodedLink);
//                 const caseId = url.searchParams.get("caseId");

//                 if (caseId) {
//                     setShowLinkGenerator(false);
//                     setLinkcaseId(caseId);
//                     FetchLFA(caseId);

//                     // Store in localStorage for dashboard redirection
//                     localStorage.setItem("pendingCaseId", caseId);
//                     localStorage.setItem("pendingUserId", "client");
//                     localStorage.setItem("pendingScreenIndex", "27");
//                     localStorage.setItem("pendingFormType", "lfa");

//                     // Set that this is an email link access
//                     setIsEmailLinkAccess(true);
//                 }
//             } catch (err) {
//                 console.error("Decryption failed:", err);
//             }
//         } else if (caseIdParam) {
//             // Direct caseId parameter
//             setShowLinkGenerator(false);
//             setLinkcaseId(caseIdParam);
//             FetchLFA(caseIdParam);

//             localStorage.setItem("pendingCaseId", caseIdParam);
//             localStorage.setItem("pendingUserId", "client");
//             localStorage.setItem("pendingScreenIndex", "27");
//             localStorage.setItem("pendingFormType", "lfa");

//             // Set that this is an email link access
//             setIsEmailLinkAccess(true);
//         } else {
//             // If no URL parameters, fetch using Redux caseInfo
//             FetchLFA();
//         }
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
//     const [lfaStatus, setLfaStatus] = useState(""); // NEW: Track LFA status
//     const [showSignaturePad, setShowSignaturePad] = useState(false); // NEW: Control signature pad visibility
//     const isclient = token?.Role === "client";

//     const FetchLFA = async (caseIdToFetch = null) => {
//         showDataLoading(true);
//         try {
//             // Use the caseId from parameters if provided, otherwise use Redux caseInfo
//             const targetCaseId = caseIdToFetch || (isEmailLinkAccess ? LinkcaseId : caseInfo?._id);

//             if (!targetCaseId) {
//                 showDataLoading(false);
//                 console.error('No case ID available');
//                 return;
//             }

//             const response = await fetch(`${ApiEndPoint}getLFAForm/${targetCaseId}`);
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
//             setLfaStatus(data.data?.status || "");
//             setEditMode(false);
//             setisFormFilled(true);
//             setIsLocalSign(!!data.data?.ClientSignatureImage);
//             setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
//             setSavedLawyerSignature();

//             // If this is email link access and form is already accepted, show signature pad
//             if (isEmailLinkAccess && data.data?.status === "accepted" && !data.data?.ClientSignatureImage) {
//                 setShowSignaturePad(true);
//             }

//             // Reset signature submitted state if needed
//             if (data.data?.ClientSignatureImage) {
//                 setSignatureSubmitted(true);
//             }

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

//     // Function to convert base64 to image data for jsPDF
//     const getImageDataFromBase64 = (base64String) => {
//         const base64Data = base64String.split(',')[1];
//         return atob(base64Data);
//     };

//     // Function to get base64 from server for S3 URLs
//     const getSignBase64FromServer = async (imageUrl) => {
//         try {
//             const response = await fetch(
//                 `${ApiEndPoint}get-image-base64?url=${encodeURIComponent(imageUrl)}`
//             );
//             if (!response.ok) {
//                 throw new Error("Failed to get Base64 from server");
//             }
//             const base64 = await response.text();
//             return base64;
//         } catch (error) {
//             console.error("Error fetching Base64:", error);
//             return null;
//         }
//     };

//     // Add this function to fetch assigned users
//     const fetchAssignedUsers = async (caseId) => {
//         try {
//             const response = await fetch(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${caseId}`);
//             if (!response.ok) {
//                 throw new Error('Error fetching assigned users');
//             }
//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error("Error fetching assigned users:", error);
//             return null;
//         }
//     };



//     const handleDownload = async () => {
//         try {
//             // Fetch assigned users data
//             const assignedUsersData = await fetchAssignedUsers(caseInfo?._id);

//             // Extract lawyer and client information
//             let lawyerName = "Lawyer Name";
//             let clientName = "Client Name";

//             if (assignedUsersData) {
//                 // Find lawyer from assigned users
//                 const lawyer = assignedUsersData.AssignedUsers?.find(user => user.Role === "lawyer");
//                 if (lawyer) {
//                     lawyerName = lawyer.UserName;
//                 }

//                 // Get client name
//                 if (assignedUsersData.Client && assignedUsersData.Client.length > 0) {
//                     clientName = assignedUsersData.Client[0].UserName;
//                 }
//             }

//             // Get logo as base64
//             const getBase64ImageFromUrl = async (url) => {
//                 const response = await fetch(url);
//                 const blob = await response.blob();
//                 return new Promise((resolve, reject) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => resolve(reader.result);
//                     reader.onerror = reject;
//                     reader.readAsDataURL(blob);
//                 });
//             };

//             const logoBase64 = await getBase64ImageFromUrl(logo);
//             const logoiA64 = await getBase64ImageFromUrl(logoiA);

//             // Get signature images as base64
//             let lawyerSignatureBase64 = null;
//             let clientSignatureBase64 = null;

//             if (dataList?.LawyerSignatureImage) {
//                 lawyerSignatureBase64 = await getSignBase64FromServer(dataList.LawyerSignatureImage);
//             }

//             if (dataList?.ClientSignatureImage) {
//                 clientSignatureBase64 = await getSignBase64FromServer(dataList.ClientSignatureImage);
//             }

//             // === BRAND LOOK CONTROLS ===
//             const sidebarWidth = 45;
//             const BAR_COLOR = "#0A1C45";   // Deep navy blue (same as DOCX)
//             const LOGO_SIZE = 42;          // Size for the sidebar logo
//             const LOGO_SPACING = 28;       // Spacing between logos
//             const HEADER_HEIGHT = 90;

//             // Convert imported image to base64
//             const convertImageToBase64 = (img) => {
//                 const canvas = document.createElement('canvas');
//                 const ctx = canvas.getContext('2d');
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 ctx.drawImage(img, 0, 0);
//                 return canvas.toDataURL('image/png');
//             };

//             // Load the AWS logo image
//             const loadImage = (src) => {
//                 return new Promise((resolve, reject) => {
//                     const img = new Image();
//                     img.onload = () => resolve(img);
//                     img.onerror = reject;
//                     img.src = src;
//                 });
//             };

//             let awsLogoBase64;
//             let awsLogo5Base64;
//             try {
//                 const awsLogoImg = await loadImage(AWSlogo);
//                 awsLogoBase64 = convertImageToBase64(awsLogoImg);

//                 // Load the AWSlogo5 image for the bottom
//                 const awsLogo5Img = await loadImage(AWSlogo5);
//                 awsLogo5Base64 = convertImageToBase64(awsLogo5Img);
//             } catch (error) {
//                 console.error("Failed to load AWS logos:", error);
//                 // Fallback to using the main logo if AWS logos fail to load
//                 awsLogoBase64 = logoBase64;
//                 awsLogo5Base64 = logoBase64;
//             }

//             // Fonts
//             pdfMake.fonts = {
//                 Roboto: {
//                     normal: 'Roboto-Regular.ttf',
//                     bold: 'Roboto-Medium.ttf',
//                     italics: 'Roboto-Italic.ttf',
//                     bolditalics: 'Roboto-MediumItalic.ttf'
//                 },
//                 Helvetica: {
//                     normal: 'Helvetica',
//                     bold: 'Helvetica-Bold',
//                     italics: 'Helvetica-Oblique',
//                     bolditalics: 'Helvetica-BoldOblique'
//                 }
//             };

//             const docDefinition = {
//                 background: (currentPage, pageSize) => {
//                     const elems = [
//                         {
//                             canvas: [{
//                                 type: "rect",
//                                 x: 0,
//                                 y: 0,
//                                 w: sidebarWidth,
//                                 h: pageSize.height,
//                                 color: BAR_COLOR
//                             }]
//                         }
//                     ];

//                     // TOP logo (left strip) - AWS logo at the top
//                     const topStartY = 50;
//                     elems.push({
//                         image: awsLogoBase64,
//                         width: LOGO_SIZE,
//                         height: LOGO_SIZE,
//                         absolutePosition: {
//                             x: (sidebarWidth - LOGO_SIZE) / 2,
//                             y: topStartY
//                         }
//                     });

//                     // BOTTOM logo (left strip) - AWSlogo5 at the bottom
//                     const bottomStartY = pageSize.height - 140;
//                     elems.push({
//                         image: awsLogo5Base64,
//                         width: LOGO_SIZE,
//                         height: LOGO_SIZE,
//                         absolutePosition: {
//                             x: (sidebarWidth - LOGO_SIZE) / 2,
//                             y: bottomStartY
//                         }
//                     });

//                     // Center watermark
//                     if (logoBase64) {
//                         const wmWidth = Math.min(360, pageSize.width * 0.45);
//                         const wmX = (pageSize.width - wmWidth) / 2;
//                         const wmY = (pageSize.height - wmWidth) / 2;

//                         elems.push({
//                             image: logoBase64,
//                             width: wmWidth,
//                             opacity: 0.05,
//                             absolutePosition: { x: wmX, y: wmY }
//                         });
//                     }

//                     return elems;
//                 },

//                 pageMargins: [sidebarWidth + 30, HEADER_HEIGHT + 20, 40, 60],

//                 header: (currentPage, pageCount, pageSize) => {
//                     return {
//                         margin: [sidebarWidth + 20, 15, 20, 0],
//                         columns: [
//                             {
//                                 columns: [
//                                     logoBase64
//                                         ? { image: logoBase64, width: 70, height: 70, margin: [0, 0, 10, 0] }
//                                         : { text: "" },
//                                     {
//                                         stack: [
//                                             { text: "LEGAL", fontSize: 22, bold: true, color: "#0A1C45", margin: [0, 6, 0, 0] },
//                                             { text: "SUHAD ALJUBOORI", fontSize: 12, bold: true, color: "#0A1C45", margin: [0, 2, 0, 0] },
//                                             {
//                                                 text: "ADVOCATES & LEGAL CONSULTANTS",
//                                                 fontSize: 9,
//                                                 color: "#8a96b2",
//                                                 margin: [0, 2, 0, 0],
//                                                 characterSpacing: 1
//                                             }
//                                         ]
//                                     }
//                                 ],
//                                 width: "*"
//                             }
//                         ]
//                     };
//                 },

//                 footer: (currentPage, pageCount, pageSize) => {
//                     const footerText = "P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nTel: +971 (04) 332 5928, web: aws-legalgroup.com,\n email: info@awsadvocates.com";

//                     return {
//                         stack: [
//                             {
//                                 canvas: [
//                                     {
//                                         type: "rect",
//                                         x: 0,
//                                         y: 0,
//                                         w: pageSize.width,
//                                         h: 70,
//                                         color: "#f5f5f5"
//                                     },
//                                 ],
//                             },
//                             {
//                                 columns: [
//                                     { width: "*", text: "" },
//                                     {
//                                         stack: [
//                                             {
//                                                 text: footerText,
//                                                 alignment: "center",
//                                                 fontSize: 7,
//                                                 color: "#333333",
//                                                 margin: [0, -60, 0, 0],
//                                             },
//                                         ],
//                                     },
//                                     {
//                                         text: `Page ${currentPage} of ${pageCount}`,
//                                         alignment: "right",
//                                         margin: [0, -60, 40, 0],
//                                         fontSize: 8,
//                                         color: "#333333",
//                                     },
//                                 ],
//                             },
//                         ],
//                         margin: [sidebarWidth, -10, 0, 0],
//                     };
//                 },

//                 content: [
//                     { text: "Legal Fee Agreement", style: "header", margin: [0, 10, 0, 10] },

//                     { text: "Agreement", style: "subHeader", margin: [0, 20, 0, 10] },
//                     {
//                         text: agreement.fixedParts
//                             .map((part, i) => part + (agreement.editableValues[i] || ""))
//                             .join(" "),
//                         style: "agreementText",
//                         margin: [0, 0, 0, 20]
//                     },

//                     ...fixedHeadings.flatMap((section, sectionIndex) => [
//                         { text: section.title, style: "subHeader", margin: [0, 20, 0, 10] },
//                         {
//                             ul: section.points.map(point => point.text || ""),
//                             style: "pointsList",
//                             margin: [0, 0, 0, 20]
//                         }
//                     ]),

//                     { text: "Signatures", style: "subHeader", margin: [0, 40, 0, 20] },
//                     {
//                         columns: [
//                             {
//                                 width: '40%',
//                                 stack: [
//                                     lawyerSignatureBase64
//                                         ? { image: lawyerSignatureBase64, width: 120, height: 60, margin: [0, 0, 0, 5] }
//                                         : { canvas: [{ type: "line", x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 5] },
//                                     { text: "___________________", margin: [0, 0, 0, 5] },
//                                     { text: "The Lawyer", style: "signatureLabel" },
//                                     { text: lawyerName, style: "signatureName" }
//                                 ],
//                                 alignment: 'center'
//                             },
//                             {
//                                 width: '20%',
//                                 stack: [
//                                     // Stamp in the middle
//                                     logoiA64
//                                         ? { image: logoiA64, width: 80, height: 80, margin: [0, 10, 0, 5], alignment: 'center' }
//                                         : { text: "" },
//                                     { text: "Verified and Authenticated", style: "stampText", alignment: 'center' }
//                                 ],
//                                 alignment: 'center'
//                             },
//                             {
//                                 width: '40%',
//                                 stack: [
//                                     clientSignatureBase64
//                                         ? { image: clientSignatureBase64, width: 120, height: 60, margin: [0, 0, 0, 5] }
//                                         : { canvas: [{ type: "line", x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 5] },
//                                     { text: "___________________", margin: [0, 0, 0, 5] },
//                                     { text: "The Client", style: "signatureLabel" },
//                                     { text: clientName, style: "signatureName" }
//                                 ],
//                                 alignment: 'center'
//                             }
//                         ],
//                         margin: [0, 0, 0, 40]
//                     }
//                 ],

//                 styles: {
//                     header: { fontSize: 18, bold: true, color: "#0A1C45" },
//                     subHeader: { fontSize: 14, bold: true, color: "#0A1C45" },
//                     agreementText: { fontSize: 11, lineHeight: 1.4, alignment: "justify" },
//                     pointsList: { fontSize: 11, lineHeight: 1.4 },
//                     signatureLabel: { fontSize: 10, bold: true, alignment: "center" },
//                     signatureName: { fontSize: 10, alignment: "center" },
//                     stampText: { fontSize: 8, italics: true, alignment: "center", color: "#666666" }
//                 },
//                 defaultStyle: { font: "Roboto" }
//             };

//             pdfMake.createPdf(docDefinition).download("Legal_Fee_Agreement.pdf");
//         } catch (e) {
//             console.error("PDF generation failed:", e);
//             alert("Sorry, unable to generate PDF. Check console for details.");
//         }
//     };
//     // In LEA_Form component
//     const handleAcceptLFA = async () => {
//         try {
//             showDataLoading(true);

//             // Determine the case ID based on access method
//             const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

//             if (!targetCaseId) {
//                 showDataLoading(false);
//                 alert("Case ID not found");
//                 return;
//             }

//             const response = await fetch(`${ApiEndPoint}acceptLFAForm/${targetCaseId}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Error accepting LFA');
//             }

//             const data = await response.json();
//             showDataLoading(false);

//             if (data.success) {
//                 setLfaStatus("accepted");
//                 setShowSignaturePad(true);

//                 // If this is email link access, show success message
//                 //  if (isEmailLinkAccess) {
//                 //  alert("LFA accepted successfully! Please provide your signature.");
//                 // } else {
//                 // For portal access, show message that notification was sent to lawyer
//                 //alert("LFA accepted successfully! A notification has been sent to your lawyer.");
//                 // }
//             } else {
//                 alert("Failed to accept LFA: " + data.message);
//             }
//         } catch (error) {
//             showDataLoading(false);
//             console.error("Error accepting LFA:", error);
//             alert("Failed to accept LFA. Please try again.");
//         }
//     };

//     // Similarly update handleRejectLFA
//     const handleRejectLFA = async () => {
//         if (!rejectionReason.trim()) {
//             alert("Please provide a reason for rejection.");
//             return;
//         }

//         try {
//             setIsSubmittingRejection(true);

//             // Determine the case ID based on access method
//             const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

//             if (!targetCaseId) {
//                 setIsSubmittingRejection(false);
//                 alert("Case ID not found");
//                 return;
//             }

//             const response = await fetch(`${ApiEndPoint}rejectLFAForm/${targetCaseId}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ rejectionReason }),
//             });

//             if (!response.ok) {
//                 throw new Error('Error rejecting LFA');
//             }

//             const data = await response.json();
//             setIsSubmittingRejection(false);
//             setShowRejectModal(false);
//             setRejectionReason("");

//             if (data.success) {
//                 setLfaStatus("rejected");

//                 // If this is email link access, show success message
//                 // if (isEmailLinkAccess) {
//                 //   alert("LFA rejected successfully. Your feedback has been sent to the lawyer.");
//                 //} else {
//                 //  alert("LFA rejected successfully. Your feedback has been sent to the lawyer.");
//                 //}
//             } else {
//                 alert("Failed to reject LFA: " + data.message);
//             }
//         } catch (error) {
//             setIsSubmittingRejection(false);
//             console.error("Error rejecting LFA:", error);
//             alert("Failed to reject LFA. Please try again.");
//         }
//     };

//     const handleSignatureSave = (dataUrl) => {
//         setSavedSignature(dataUrl);
//         setSavedLawyerSignature(dataUrl);
//         setIsLocalLawyerSign(true);
//     };

//     const handleClientSignatureSave = (dataUrl) => {
//         setSavedClientSignature(dataUrl);
//         setShowSignaturePad(false);

//         // Automatically submit the signature for email link access
//         if (isEmailLinkAccess) {
//             handleUpdateLawyerSubmit();
//         }
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
//                 setShowSignaturePad(false);
//             } else {
//                 console.error("❌ Failed:", data.message);
//             }
//         } catch (err) {
//             console.error("Error submitting form:", err);
//         }
//     };

//     const handleLawyerSubmit = async () => {
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

//             // Determine the case ID based on access method
//             const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

//             if (!targetCaseId) {
//                 alert("Case ID not found");
//                 return;
//             }

//             formData.append("caseId", targetCaseId);
//             formData.append("Islawyer", !isclient && !isEmailLinkAccess);

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

//             if ((isclient || isEmailLinkAccess) && savedClientSignature) {
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
//                 setSignatureSubmitted(true); // NEW: Mark signature as submitted

//                 // Refresh the form data to ensure synchronization
//                 FetchLFA(targetCaseId);

//                 // If this is email link access, show success message
//                 // if (isEmailLinkAccess) {
//                 //   alert("Signature submitted successfully! The LFA process is now complete.");
//                 //}
//             } else {
//                 console.error("❌ Failed:", data.message);
//                 alert("Failed to submit signature. Please try again.");
//             }
//         } catch (err) {
//             console.error("Error submitting form:", err);
//             alert("Error submitting form. Please try again.");
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

//     // UPDATED: selecting a draft now forces a clean remount & syncs signatures
//     const handlePickDraft = (data) => {
//         setAgreement(data.agreement);
//         setFixedHeadings(data.fixedHeadings);
//         setHeadings(data.headings);
//         setSelectedDrafts(data);
//         setDraftKey((k) => k + 1); // force remount
//     };

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

//     // NEW: Render Accept/Reject buttons for client - UPDATED to check signatureSubmitted state
//     const renderClientDecisionButtons = () => {
//         // Show buttons for email link access OR regular client access
//         const shouldShowButtons = (isEmailLinkAccess || isclient) &&
//             isFormFilled &&
//             lfaStatus !== "accepted" &&
//             lfaStatus !== "rejected" &&
//             !savedClientSignature &&
//             !signatureSubmitted; // NEW: Also check signatureSubmitted state

//         if (!shouldShowButtons) {
//             return null;
//         }

//         return (
//             <div
//                 className="d-flex justify-content-center align-items-center mt-4 gap-2 mb-4 px-3"
//                 data-html2canvas-ignore="true"
//             >
//                 {/* Reject button */}
//                 <div
//                     // className="btn btn-danger fw-bold me-3"
//                     onClick={() => setShowRejectModal(true)}
//                     style={{

//                         backgroundColor: "#16213e",
//                         color: "white",
//                         width: "150px",
//                         minWidth: "100px",
//                         maxWidth: "200px",
//                         padding: "8px 20px",
//                         borderRadius: "4px",
//                         fontSize: "14px",
//                         cursor: "pointer",
//                         textAlign: "center",
//                         border: "2px solid #16213e",
//                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                         transition: "all 0.3s ease",
//                         fontWeight: "500",
//                     }}
//                 >
//                     Reject LFA
//                 </div>

//                 {/* Accept button */}
//                 <div
//                     // className="btn fw-bold"
//                     style={{
//                         backgroundColor: "#16213e",
//                         color: "white",
//                         width: "150px",
//                         minWidth: "100px",
//                         maxWidth: "200px",
//                         padding: "8px 20px",
//                         borderRadius: "4px",
//                         fontSize: "14px",
//                         cursor: "pointer",
//                         textAlign: "center",
//                         border: "2px solid #16213e",
//                         boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                         transition: "all 0.3s ease",
//                         fontWeight: "500",
//                     }}
//                     onMouseOver={(e) => {
//                         e.currentTarget.style.backgroundColor = "#c0a262";
//                         e.currentTarget.style.color = "black";
//                     }}
//                     onMouseOut={(e) => {
//                         e.currentTarget.style.backgroundColor = "#16213e";
//                         e.currentTarget.style.color = "white";
//                     }}
//                     onClick={handleAcceptLFA}
//                 >
//                     Accept LFA
//                 </div>
//             </div>
//         );
//     };

//     // NEW: Rejection Modal
//     const renderRejectionModal = () => {
//         return (
//             <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Reject LFA</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <p>Please provide the reason for rejecting this Legal Fee Agreement:</p>
//                     <Form.Group>
//                         <Form.Control
//                             as="textarea"
//                             rows={4}
//                             value={rejectionReason}
//                             onChange={(e) => setRejectionReason(e.target.value)}
//                             placeholder="Enter your reasons for rejection and any changes you would like to see"
//                         />
//                     </Form.Group>
//                 </Modal.Body>
//                 <Modal.Footer className="justify-content-center">
//                     <div className="d-flex gap-3">
//                         <div
//                             style={{
//                                 backgroundColor: "#16213e",
//                                 color: "white",
//                                 width: "150px",
//                                 minWidth: "100px",
//                                 maxWidth: "200px",
//                                 padding: "8px 20px",
//                                 borderRadius: "4px",
//                                 fontSize: "14px",
//                                 cursor: "pointer",
//                                 textAlign: "center",
//                                 border: "2px solid #16213e",
//                                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                                 transition: "all 0.3s ease",
//                                 fontWeight: "500",
//                             }}
//                             onMouseOver={(e) => {
//                                 e.currentTarget.style.backgroundColor = "#c0a262"; // Golden on hover
//                                 e.currentTarget.style.color = "black";
//                             }}
//                             onMouseOut={(e) => {
//                                 e.currentTarget.style.backgroundColor = "#16213e"; // Back to Dark Blue
//                                 e.currentTarget.style.color = "white";
//                             }}
//                             onClick={() => setShowRejectModal(false)}
//                         >
//                             Cancel
//                         </div>

//                         <div
//                             variant="danger"

//                             style={{
//                                 backgroundColor: "#16213e",
//                                 color: "white",
//                                 width: "150px",
//                                 minWidth: "100px",
//                                 maxWidth: "200px",
//                                 padding: "8px 20px",
//                                 borderRadius: "4px",
//                                 fontSize: "14px",
//                                 cursor: "pointer",
//                                 textAlign: "center",
//                                 border: "2px solid #16213e",
//                                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                                 transition: "all 0.3s ease",
//                                 fontWeight: "500",
//                             }}
//                             onMouseOver={(e) => {
//                                 e.currentTarget.style.backgroundColor = "#c0a262"; // Golden on hover
//                                 e.currentTarget.style.color = "black";
//                             }}
//                             onMouseOut={(e) => {
//                                 e.currentTarget.style.backgroundColor = "#16213e"; // Back to Dark Blue
//                                 e.currentTarget.style.color = "white";
//                             }}
//                             onClick={handleRejectLFA}
//                             disabled={isSubmittingRejection}
//                         >
//                             {isSubmittingRejection ? "Submitting..." : "Submit Rejection"}
//                         </div>
//                     </div>
//                 </Modal.Footer>
//             </Modal >
//         );
//     };

//     const ThankYouMessage = () => (
//         <div className="text-center py-5">
//             <h3>Thank You!</h3>
//             <p>Your signature has been successfully submitted.</p>


//         </div>
//     );

//     return (
//         <div
//             className="card w-100"
//             style={
//                 showLinkGenerator
//                     ? {
//                         maxHeight: "87vh",
//                         overflowX: "hidden",
//                         overflowY: "auto",
//                     }
//                     : {
//                         backgroundImage: `url(${backgroundImage})`,
//                         backgroundSize: "cover",
//                         backgroundPosition: "center",
//                         backgroundRepeat: "no-repeat",
//                         minHeight: "100vh",
//                         display: "flex",
//                         justifyContent: "center",
//                         color: "white",
//                         alignItems: "center",
//                         overflowX: "hidden",
//                         overflowY: "auto",
//                     }
//             }
//         >
//             <style>{`
//                 .word-paper { color: #000; line-height: 1.4; }
//                 .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
//                 .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
//                 .word-paper .form-control,
//                 .word-paper [contenteditable="true"],
//                 .word-paper ul.sub-bullets,
//                 .word-paper ul.sub-bullets li { text-align: justify; }
//                 .word-paper.pdf-mode * { box-shadow: none !important; }
//                 .word-paper.pdf-mode .card,
//                 .word-paper.pdf-mode .form-control,
//                 .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
//                 .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }

//                 /* CHANGED: Replace bullet lists with alphabetical lists */
//                 .word-paper ul,
//                 .word-paper ol { padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
//                 .word-paper ul { list-style-type: lower-alpha !important; }
//                 .word-paper ul.sub-bullets { list-style-type: lower-alpha !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
//                 .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
//                 .word-paper .list-unstyled ul.sub-bullets,
//                 .word-paper .form-control ul.sub-bullets { list-style-type: lower-alpha !important; padding-left: 24px !important; }

//                 @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
//             `}</style>

//             {/* toolbar */}

//             {(token?.Role === "lawyer" || isFormFilled) ? (
//                 <>
//                     <div
//                         className="d-flex justify-content-end mb-3 gap-2 px-3 py-2"
//                         data-html2canvas-ignore="true"
//                         style={{
//                             marginTop: '10px'
//                         }}
//                     >
//                         {/* Only show Generate Link button to lawyer and admin */}
//                         {(token?.Role === "lawyer" || token?.Role === "admin") && (
//                             <div
//                                 // className="btn btn-primary me-3 px-4 py-2 fw-medium"
//                                 onClick={handleGenerateLink}
//                                 style={{
//                                     backgroundColor: "#16213e",
//                                     color: "white",
//                                     width: "150px",
//                                     minWidth: "100px",
//                                     maxWidth: "200px",
//                                     padding: "8px 20px",
//                                     borderRadius: "4px",
//                                     fontSize: "14px",
//                                     cursor: "pointer",
//                                     textAlign: "center",
//                                     border: "2px solid #16213e",
//                                     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                                     transition: "all 0.3s ease",
//                                     fontWeight: "500",
//                                 }}
//                                 onMouseOver={(e) => {
//                                     e.currentTarget.style.backgroundColor = "#c0a262";
//                                     e.currentTarget.style.color = "black";
//                                 }}
//                                 onMouseOut={(e) => {
//                                     e.currentTarget.style.backgroundColor = "#16213e";
//                                     e.currentTarget.style.color = "white";
//                                 }}
//                             >
//                                 Generate Form Link
//                             </div>
//                         )}

//                         <div
//                             // className="btn fw-medium d-flex align-items-center"
//                             onClick={handleDownload}
//                             style={{
//                                 backgroundColor: "#16213e",
//                                 color: "white",
//                                 width: "150px",
//                                 minWidth: "100px",
//                                 maxWidth: "200px",
//                                 padding: "8px 20px",
//                                 borderRadius: "4px",
//                                 fontSize: "14px",
//                                 cursor: "pointer",
//                                 textAlign: "center",
//                                 border: "2px solid #16213e",
//                                 boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                                 transition: "all 0.3s ease",
//                                 fontWeight: "500",
//                             }}
//                             onMouseOver={(e) => {
//                                 e.currentTarget.style.backgroundColor = "#c0a262";
//                                 e.currentTarget.style.color = "black";
//                             }}
//                             onMouseOut={(e) => {
//                                 e.currentTarget.style.backgroundColor = "#16213e";
//                                 e.currentTarget.style.color = "white";
//                             }}
//                         >
//                             <BsDownload className="me-2" />
//                             Download PDF
//                         </div>
//                     </div>

//                     <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey} style={isEmailLinkAccess ? { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" } : {}}>
//                         {/* Header */}
//                         <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
//                             <img
//                                 src="logo.png"
//                                 alt="Logo"
//                                 className="me-2 me-md-3 mb-2 mb-md-0"
//                                 style={{ height: "50px" }}
//                             />
//                             <h1 className="mb-0 h4 h3-md fw-bold text-break" style={isEmailLinkAccess ? { color: "black" } : {}}>Legal Fee Agreement</h1>
//                         </div>

//                         {token?.Role !== "client" && (
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Drafts</Form.Label>

//                                 <Dropdown className="w-100">
//                                     <Dropdown.Toggle
//                                         variant="outline-secondary"
//                                         disabled={isFormFilled}
//                                         id="dropdown-practice-area"
//                                         className="w-100 text-start d-flex justify-content-between align-items-center"
//                                     >
//                                         {selectedDrafts === "Select Draft"
//                                             ? "Select Draft"
//                                             : `${selectedDrafts?.CaseNumber}`}
//                                     </Dropdown.Toggle>

//                                     <Dropdown.Menu className="w-100" disabled={isFormFilled}>
//                                         {getDrafts?.map((data, index) => (
//                                             <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
//                                                 {data?.CaseNumber}
//                                             </Dropdown.Item>
//                                         ))}
//                                     </Dropdown.Menu>
//                                 </Dropdown>
//                             </Form.Group>
//                         )}

//                         {/* NEW: Show status message */}
//                         {lfaStatus && (
//                             <div className={`alert ${lfaStatus === "accepted" ? "alert-success" : lfaStatus === "rejected" ? "alert-danger" : "alert-info"} mb-3`}>
//                                 {lfaStatus === "accepted" ? "You have accepted this LFA." :
//                                     lfaStatus === "rejected" ? "You have rejected this LFA. Your feedback has been sent to the lawyer." :
//                                         "LFA is pending your decision."}
//                             </div>
//                         )}

//                         <div className="card p-2 p-md-4 shadow-sm mb-4">
//                             <label className="form-label fw-bold fs-5 text-break">Agreement</label>
//                             {editMode && !isclient && !savedClientSignature ? (
//                                 <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
//                                     {agreement?.fixedParts?.map((part, index) => (
//                                         <React.Fragment key={index}>
//                                             <span>{part}</span>
//                                             {index < agreement.editableValues.length && (
//                                                 <p
//                                                     ref={(el) => {
//                                                         if (el && !el.innerHTML.trim()) {
//                                                             el.innerHTML = agreement.editableValues[index] || "\u00A0";
//                                                         }
//                                                     }}
//                                                     contentEditable
//                                                     suppressContentEditableWarning
//                                                     onInput={(e) => {
//                                                         const html = e.currentTarget.innerHTML;
//                                                         handleEditableChange(index, html);
//                                                     }}
//                                                     onKeyDown={(e) => {
//                                                         if (e.ctrlKey && e.key.toLowerCase() === "b") {
//                                                             e.preventDefault();
//                                                             document.execCommand("bold");
//                                                         }
//                                                         if (e.key === "Tab") {
//                                                             e.preventDefault();
//                                                             const selection = window.getSelection();
//                                                             if (!selection.rangeCount) return;
//                                                             const range = selection.getRangeAt(0);
//                                                             const tabSpaces = "\u00A0".repeat(8);
//                                                             const spaceNode = document.createTextNode(tabSpaces);
//                                                             range.insertNode(spaceNode);
//                                                             range.setStartAfter(spaceNode);
//                                                             selection.removeAllRanges();
//                                                             selection.addRange(range);
//                                                         }
//                                                     }}
//                                                     onBlur={(e) => {
//                                                         if (!e.currentTarget.textContent.trim()) {
//                                                             e.currentTarget.innerHTML = "\u00A0";
//                                                         }
//                                                     }}
//                                                     style={{
//                                                         display: "inline",
//                                                         minWidth: "2ch",
//                                                         maxWidth: "100%",
//                                                         outline: "none",
//                                                         background: "transparent",
//                                                         verticalAlign: "middle",
//                                                         whiteSpace: "pre-wrap",
//                                                         wordBreak: "break-word",
//                                                         fontFamily: "inherit",
//                                                         fontSize: "inherit",
//                                                         padding: "0 2px",
//                                                         boxSizing: "border-box",
//                                                         textDecoration: "underline",
//                                                         textDecorationSkipInk: "none",
//                                                         textAlign: "justify",
//                                                     }}
//                                                 />
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
//                                     {agreement?.fixedParts?.map((part, index) => (
//                                         <React.Fragment key={index}>
//                                             <span>{part}</span>
//                                             {index < agreement.editableValues.length && (
//                                                 <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
//                                             )}
//                                         </React.Fragment>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Fixed Headings */}
//                         {renderHeadings(fixedHeadings, setFixedHeadings, true)}

//                         {/* Custom Headings */}
//                         {/* {renderHeadings(headings, setHeadings, false)} */}

//                         {/* NEW: Client decision buttons */}
//                         {renderClientDecisionButtons()}

//                         {/* NEW: Signature pad for client after acceptance */}
//                         {showSignaturePad && (
//                             <div style={{ padding: 20 }} data-html2canvas-ignore="true">
//                                 <h2>Client Signature</h2>
//                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
//                             </div>
//                         )}

//                         {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
//                             <div style={{ padding: 20 }} data-html2canvas-ignore="true">
//                                 <h2>Lawyer Signature</h2>
//                                 <Form_SignaturePad height={250} onSave={handleSignatureSave} />
//                             </div>
//                         )}

//                         <div
//                             style={{
//                                 display: "flex",
//                                 flexDirection: "row",
//                                 justifyContent: "space-between",
//                                 alignItems: "flex-start",
//                                 gap: "20px",
//                                 width: "100%",
//                             }}
//                         >
//                             {savedSignature && (
//                                 <div>
//                                     <h4>Lawyer Signature:</h4>
//                                     <img
//                                         src={savedSignature}
//                                         alt="Lawyer Signature"
//                                         style={{
//                                             maxWidth: "220px",
//                                             maxHeight: "300px",
//                                             border: "1px solid #ccc",
//                                             borderRadius: "4px",
//                                         }}
//                                     />
//                                 </div>
//                             )}

//                             {/* ADDED: Stamp between signatures when both are present */}
//                             {savedSignature && savedClientSignature && (
//                                 <div style={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     flexDirection: "column"
//                                 }}>
//                                     <img
//                                         src={logoiA}
//                                         alt="Stamp"
//                                         style={{
//                                             width: "120px",
//                                             height: "120px",
//                                             opacity: 0.8,
//                                             margin: "0 20px"
//                                         }}
//                                     />
//                                     <span style={{ fontSize: "12px", marginTop: "5px", fontStyle: "italic" }}>
//                                         Verified and Authenticated
//                                     </span>
//                                 </div>
//                             )}

//                             {savedClientSignature && (
//                                 <div>
//                                     <h4>Client Signature:</h4>
//                                     <img
//                                         src={savedClientSignature}
//                                         alt="Client Signature"
//                                         style={{
//                                             maxWidth: "220px",
//                                             border: "1px solid #ccc",
//                                             borderRadius: "4px",
//                                         }}
//                                     />
//                                 </div>
//                             )}
//                         </div>

//                         <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
//                             {(!isclient && savedClientSignature && savedLawyerSignature) && (
//                                 <button
//                                     className="btn btn-sm btn-primary fw-bold"
//                                     onClick={handleUpdateLawyerSubmit}
//                                     style={{ width: "150px" }}
//                                     data-html2canvas-ignore="true"
//                                 >
//                                     Save & Update Agreement
//                                 </button>
//                             )}

//                             {editMode ? (
//                                 <>
//                                     {(!isFormFilled && !savedClientSignature) ? (
//                                         <button
//                                             className="btn btn-sm btn-primary fw-bold"
//                                             onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
//                                             style={{ width: "150px" }}
//                                             data-html2canvas-ignore="true"
//                                         >
//                                             Save & Submit Agreement
//                                         </button>
//                                     ) : (
//                                         <button
//                                             className="btn btn-sm btn-primary fw-bold"
//                                             onClick={handleUpdateLawyerSubmit}
//                                             style={{ width: "150px" }}
//                                             data-html2canvas-ignore="true"
//                                         >
//                                             Save & Update Agreement
//                                         </button>
//                                     )}
//                                 </>
//                             ) : (
//                                 <>
//                                     {(isclient && savedClientSignature && lfaStatus === "accepted" && !signatureSubmitted) && (
//                                         <button
//                                             className="btn btn-sm btn-primary fw-bold"
//                                             onClick={handleUpdateLawyerSubmit}
//                                             style={{ width: "150px" }}
//                                             data-html2canvas-ignore="true"
//                                         >
//                                             Save & Submit Signature
//                                         </button>
//                                     )}

//                                     {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
//                                         <button
//                                             className="btn btn-sm btn-primary fw-bold"
//                                             onClick={() => setEditMode(true)}
//                                             style={{ width: "150px" }}
//                                             data-html2canvas-ignore="true"
//                                         >
//                                             Edit Agreement
//                                         </button>
//                                     )}
//                                 </>
//                             )}
//                         </div>
//                         {/* Add this at the end of the form content */}
//                         {isEmailLinkAccess && (signatureSubmitted || savedClientSignature) && (
//                             <ThankYouMessage />
//                         )}
//                     </div>
//                 </>
//             ) : (
//                 <div className="text-center text-black py-5">No LFA Form Available.</div>
//             )}

//             {/* NEW: Rejection Modal */}
//             {renderRejectionModal()}
//         </div>
//     );
// };

// export default LEA_Form;









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
import { Dropdown, Form, InputGroup, Modal, Button, Table } from "react-bootstrap";
import CEEditable from './CEEditable';
import { v4 as uuidv4 } from "uuid";
import { jsPDF } from "jspdf";
import logo from '../../../Pages/Images/logo.png';
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import backgroundImage from "../../../Pages/Images/bg.jpg";
import logoiA from "../../../Pages/Component/assets/Stamp.png";// Add your stamp image
import AWSlogo from "../../../Pages/Component/assets/AWSSideLogo.png"; // Add this import at the top of your file
import AWSlogo5 from "../../../Pages/Component/assets/AWSSideLogo2.png";

// Properly set up the vfs
pdfMake.vfs = pdfFonts.vfs;

// Also set the fonts
pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
};

const LEA_Form = ({ token }) => {
    const [isHovered, setIsHovered] = useState(false);
    const caseInfo = useSelector((state) => state.screen.Caseinfo);
    const { showDataLoading } = useAlert();

    const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
    const [getDrafts, setGetDrafts] = useState(null);

    // NEW: force remount key for contentEditable sections
    const [draftKey, setDraftKey] = useState(0);

    // NEW: State for client rejection
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);
    // Add these state variables and functions to your component
    const [caseId, setCaseId] = useState(null);
    const [LinkcaseId, setLinkcaseId] = useState("");
    const [showLinkGenerator, setShowLinkGenerator] = useState(true);
    const [generatedLink, setGeneratedLink] = useState("");
    const [isEmailLinkAccess, setIsEmailLinkAccess] = useState(false);
    const [signatureSubmitted, setSignatureSubmitted] = useState(false); // NEW: Track if signature was submitted

    // NEW: State for Services and Fees Modal
    const [showServicesModal, setShowServicesModal] = useState(false);
    const [selectedService, setSelectedService] = useState("");
    const [serviceFees, setServiceFees] = useState("");
    const [currentSection, setCurrentSection] = useState(""); // To track which section the button was clicked from
    const [servicesList, setServicesList] = useState([
        "Criminal Law",
        "Commercial Law",
        "Corporate Services",
        "Family Law",
        "Intellectual Property",
        "Insurance Law",
        "Labor Law",
        "Mergers & Acquisitions",
        "Real Estate Law",
        "Rental & Tenancy",
        "Alternative Dispute Resolution / Arbitration / Dispute Resolution",
        "Debt Collection"
    ]);
    const [services, setServices] = useState([
        {
            id: uuidv4(),
            selectedService: "",
            serviceFees: "",
            // subItems: [
            //     {
            //         id: uuidv4(),
            //         dueDate: null,
            //         paymentDate: null,
            //         invoicedAmount: "",
            //         receivedAmount: "",
            //         pendingAmount: "",
            //         paymentStatus: "Pending"
            //     }
            // ]
        }
    ]);

    const handleGenerateLink = () => {
        const originalLink = `${window.location.origin}/LFA_Form?caseId=${caseInfo?._id}&timestamp=${Date.now()}`
        const encrypted = btoa(originalLink);
        const finalLink = `${window.location.origin}/LFA_Form?data=${encodeURIComponent(encrypted)}`
        setGeneratedLink(finalLink);

        navigator.clipboard.writeText(finalLink)
            .then(() => {
                alert("Encrypted link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
            });
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get("data");
        const caseIdParam = params.get("caseId");

        if (encoded) {
            try {
                const decodedLink = atob(decodeURIComponent(encoded));
                console.log("Decoded full link:", decodedLink);

                const url = new URL(decodedLink);
                const caseId = url.searchParams.get("caseId");

                if (caseId) {
                    setShowLinkGenerator(false);
                    setLinkcaseId(caseId);
                    FetchLFA(caseId);

                    // Store in localStorage for dashboard redirection
                    localStorage.setItem("pendingCaseId", caseId);
                    localStorage.setItem("pendingUserId", "client");
                    localStorage.setItem("pendingScreenIndex", "27");
                    localStorage.setItem("pendingFormType", "lfa");

                    // Set that this is an email link access
                    setIsEmailLinkAccess(true);
                }
            } catch (err) {
                console.error("Decryption failed:", err);
            }
        } else if (caseIdParam) {
            // Direct caseId parameter
            setShowLinkGenerator(false);
            setLinkcaseId(caseIdParam);
            FetchLFA(caseIdParam);

            localStorage.setItem("pendingCaseId", caseIdParam);
            localStorage.setItem("pendingUserId", "client");
            localStorage.setItem("pendingScreenIndex", "27");
            localStorage.setItem("pendingFormType", "lfa");

            // Set that this is an email link access
            setIsEmailLinkAccess(true);
        } else {
            // If no URL parameters, fetch using Redux caseInfo
            FetchLFA();
        }
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
        { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }], editable: true },
        { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }], editable: true },
        { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }], editable: false },
        { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }], editable: false },
        { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }], editable: true },
        { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }], editable: true },
        { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }], editable: true },
        { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }], editable: true },
        { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }], editable: true },
        { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }], editable: true }
    ]);

    const [headings, setHeadings] = useState([]);

    const [savedSignature, setSavedSignature] = useState(null);
    const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
    const [isFormFilled, setisFormFilled] = useState(false);
    const [savedClientSignature, setSavedClientSignature] = useState(null);
    const [isLocalSign, setIsLocalSign] = useState(false);
    const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [lfaStatus, setLfaStatus] = useState(""); // NEW: Track LFA status
    const [showSignaturePad, setShowSignaturePad] = useState(false); // NEW: Control signature pad visibility
    const isclient = token?.Role === "client";
    const [rejectionAcknowledged, setRejectionAcknowledged] = useState(false);

    // NEW: Functions for Services and Fees Modal
    const handleAddService = () => {
        setServices([...services, {
            id: uuidv4(),
            selectedService: "",
            serviceFees: "",
            // subItems: [
            //     {
            //         id: uuidv4(),
            //         dueDate: null,
            //         paymentDate: null,
            //         invoicedAmount: "",
            //         receivedAmount: "",
            //         pendingAmount: "",
            //         paymentStatus: "Pending"
            //     }
            // ]
        }]);
    };

    const handleRemoveService = (serviceId) => {
        if (services.length > 1) {
            setServices(services.filter(service => service.id !== serviceId));
        }
    };

    const handleServiceChange = (serviceId, field, value) => {
        setServices(services.map(service =>
            service.id === serviceId ? { ...service, [field]: value } : service
        ));
    };

    // const handleAddSubItem = (serviceId) => {
    //     setServices(services.map(service => 
    //         service.id === serviceId 
    //             ? { 
    //                 ...service, 
    //                 subItems: [...service.subItems, {
    //                     id: uuidv4(),
    //                     dueDate: null,
    //                     paymentDate: null,
    //                     invoicedAmount: "",
    //                     receivedAmount: "",
    //                     pendingAmount: "",
    //                     paymentStatus: "Pending"
    //                 }]
    //             } 
    //             : service
    //     ));
    // };

    // const handleRemoveSubItem = (serviceId, subItemId) => {
    //     setServices(services.map(service => 
    //         service.id === serviceId 
    //             ? { 
    //                 ...service, 
    //                 subItems: service.subItems.filter(item => item.id !== subItemId)
    //             } 
    //             : service
    //     ));
    // };

    // const handleSubItemChange = (serviceId, subItemId, field, value) => {
    //     setServices(services.map(service => 
    //         service.id === serviceId 
    //             ? { 
    //                 ...service, 
    //                 subItems: service.subItems.map(item => 
    //                     item.id === subItemId ? { ...item, [field]: value } : item
    //                 )
    //             } 
    //             : service
    //     ));
    // };

    // const handleSaveAllServices = async () => {
    //   // Validate all services
    //   const invalidServices = services.filter(service => 
    //     !service.selectedService || !service.serviceFees
    //   );

    //   if (invalidServices.length > 0) {
    //     alert("Please select a service and enter fees for all services");
    //     return;
    //   }

    //   try {
    //     const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;
    //     const lfaId = dataList?._id || targetCaseId; // Use existing LFA ID or case ID as fallback

    //     if (!targetCaseId) {
    //       alert("Case ID not found");
    //       return;
    //     }

    //     const response = await fetch(`${ApiEndPoint}saveServices`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         lfaId,
    //         caseId: targetCaseId,
    //         services: {
    //           section: currentSection,
    //           services: services
    //         }
    //       })
    //     });

    //     if (!response.ok) {
    //       throw new Error('Failed to save services');
    //     }

    //     const data = await response.json();

    //     if (data.success) {
    //       setShowServicesModal(false);
    //       alert(`${services.length} service(s) saved successfully!`);

    //       // Optionally clear services after saving if you want
    //       // setServices([{
    //       //   id: uuidv4(),
    //       //   selectedService: "",
    //       //   serviceFees: "",
    //       //   subItems: [{
    //       //     id: uuidv4(),
    //       //     dueDate: null,
    //       //     paymentDate: null,
    //       //     invoicedAmount: "",
    //       //     receivedAmount: "",
    //       //     pendingAmount: "",
    //       //     paymentStatus: "Pending"
    //       //   }]
    //       // }]);
    //     } else {
    //       alert("Failed to save services: " + data.message);
    //     }
    //   } catch (error) {
    //     console.error("Error saving services:", error);
    //     alert("Failed to save services. Please try again.");
    //   }
    // };
    const handleSaveAllServices = async () => {
        // Validate all services
        const invalidServices = services.filter(service =>
            !service.selectedService || !service.serviceFees
        );

        if (invalidServices.length > 0) {
            alert("Please select a service and enter fees for all services");
            return;
        }

        try {
            const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;
            const lfaId = dataList?._id || targetCaseId;

            if (!targetCaseId) {
                alert("Case ID not found");
                return;
            }

            const response = await fetch(`${ApiEndPoint}saveServices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lfaId,
                    caseId: targetCaseId,
                    services: {
                        section: currentSection,
                        services: services
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save services');
            }

            const data = await response.json();

            if (data.success) {
                setShowServicesModal(false);
                // alert(`${services.length} service(s) saved successfully!`);
            } else {
                alert("Failed to save services: " + data.message);
            }
        } catch (error) {
            console.error("Error saving services:", error);
            alert("Failed to save services. Please try again.");
        }
    };
    const handleAddServiceClick = (section) => {
        setCurrentSection(section);
        setServices([{
            id: uuidv4(),
            selectedService: "",
            serviceFees: "",
            // subItems: [
            //     {
            //         id: uuidv4(),
            //         dueDate: null,
            //         paymentDate: null,
            //         invoicedAmount: "",
            //         receivedAmount: "",
            //         pendingAmount: "",
            //         paymentStatus: "Pending"
            //     }
            // ]
        }]);
        setShowServicesModal(true);
    };

    const FetchLFA = async (caseIdToFetch = null) => {
        showDataLoading(true);
        try {
            // Use the caseId from parameters if provided, otherwise use Redux caseInfo
            const targetCaseId = caseIdToFetch || (isEmailLinkAccess ? LinkcaseId : caseInfo?._id);

            if (!targetCaseId) {
                showDataLoading(false);
                console.error('No case ID available');
                return;
            }

            const response = await fetch(`${ApiEndPoint}getLFAForm/${targetCaseId}`);
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
            setLfaStatus(data.data?.status || "");
            setEditMode(false);
            setisFormFilled(true);
            setIsLocalSign(!!data.data?.ClientSignatureImage);
            setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
            setSavedLawyerSignature();

            // If this is email link access and form is already accepted, show signature pad
            // Handle signature pad visibility for email link access
            if (isEmailLinkAccess) {
                if (data.data?.status === "accepted" && !data.data?.ClientSignatureImage) {
                    setShowSignaturePad(true);
                    setSignatureSubmitted(false); // Ensure submit button is visible
                } else if (data.data?.ClientSignatureImage) {
                    setShowSignaturePad(false);
                    setSignatureSubmitted(true); // Signature already submitted
                }
            }

            // Reset signature submitted state for portal access
            if (!isEmailLinkAccess && data.data?.ClientSignatureImage) {
                setSignatureSubmitted(true);
            }

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

    // Function to convert base64 to image data for jsPDF
    const getImageDataFromBase64 = (base64String) => {
        const base64Data = base64String.split(',')[1];
        return atob(base64Data);
    };

    // Function to get base64 from server for S3 URLs
    const getSignBase64FromServer = async (imageUrl) => {
        try {
            const response = await fetch(
                `${ApiEndPoint}get-image-base64?url=${encodeURIComponent(imageUrl)}`
            );
            if (!response.ok) {
                throw new Error("Failed to get Base64 from server");
            }
            const base64 = await response.text();
            return base64;
        } catch (error) {
            console.error("Error fetching Base64:", error);
            return null;
        }
    };

    // Add this function to fetch assigned users
    const fetchAssignedUsers = async (caseId) => {
        try {
            const response = await fetch(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${caseId}`);
            if (!response.ok) {
                throw new Error('Error fetching assigned users');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching assigned users:", error);
            return null;
        }
    };



    const handleDownload = async () => {
        try {
            // Fetch assigned users data
            const assignedUsersData = await fetchAssignedUsers(caseInfo?._id);

            // Extract lawyer and client information
            let lawyerName = "Lawyer Name";
            let clientName = "Client Name";

            if (assignedUsersData) {
                // Find lawyer from assigned users
                const lawyer = assignedUsersData.AssignedUsers?.find(user => user.Role === "lawyer");
                if (lawyer) {
                    lawyerName = lawyer.UserName;
                }

                // Get client name
                if (assignedUsersData.Client && assignedUsersData.Client.length > 0) {
                    clientName = assignedUsersData.Client[0].UserName;
                }
            }

            // Get logo as base64
            const getBase64ImageFromUrl = async (url) => {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            };

            const logoBase64 = await getBase64ImageFromUrl(logo);
            const logoiA64 = await getBase64ImageFromUrl(logoiA);

            // Get signature images as base64
            let lawyerSignatureBase64 = null;
            let clientSignatureBase64 = null;

            if (dataList?.LawyerSignatureImage) {
                lawyerSignatureBase64 = await getSignBase64FromServer(dataList.LawyerSignatureImage);
            }

            if (dataList?.ClientSignatureImage) {
                clientSignatureBase64 = await getSignBase64FromServer(dataList.ClientSignatureImage);
            }

            // === BRAND LOOK CONTROLS ===
            const sidebarWidth = 45;
            const BAR_COLOR = "#0A1C45";   // Deep navy blue (same as DOCX)
            const LOGO_SIZE = 42;          // Size for the sidebar logo
            const LOGO_SPACING = 28;       // Spacing between logos
            const HEADER_HEIGHT = 90;

            // Convert imported image to base64
            const convertImageToBase64 = (img) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                return canvas.toDataURL('image/png');
            };

            // Load the AWS logo image
            const loadImage = (src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
            };

            let awsLogoBase64;
            let awsLogo5Base64;
            try {
                const awsLogoImg = await loadImage(AWSlogo);
                awsLogoBase64 = convertImageToBase64(awsLogoImg);

                // Load the AWSlogo5 image for the bottom
                const awsLogo5Img = await loadImage(AWSlogo5);
                awsLogo5Base64 = convertImageToBase64(awsLogo5Img);
            } catch (error) {
                console.error("Failed to load AWS logos:", error);
                // Fallback to using the main logo if AWS logos fail to load
                awsLogoBase64 = logoBase64;
                awsLogo5Base64 = logoBase64;
            }

            // Fonts
            pdfMake.fonts = {
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                },
                Helvetica: {
                    normal: 'Helvetica',
                    bold: 'Helvetica-Bold',
                    italics: 'Helvetica-Oblique',
                    bolditalics: 'Helvetica-BoldOblique'
                }
            };

            const docDefinition = {
                background: (currentPage, pageSize) => {
                    const elems = [
                        {
                            canvas: [{
                                type: "rect",
                                x: 0,
                                y: 0,
                                w: sidebarWidth,
                                h: pageSize.height,
                                color: BAR_COLOR
                            }]
                        }
                    ];

                    // TOP logo (left strip) - AWS logo at the top
                    const topStartY = 50;
                    elems.push({
                        image: awsLogoBase64,
                        width: LOGO_SIZE,
                        height: LOGO_SIZE,
                        absolutePosition: {
                            x: (sidebarWidth - LOGO_SIZE) / 2,
                            y: topStartY
                        }
                    });

                    // BOTTOM logo (left strip) - AWSlogo5 at the bottom
                    const bottomStartY = pageSize.height - 140;
                    elems.push({
                        image: awsLogo5Base64,
                        width: LOGO_SIZE,
                        height: LOGO_SIZE,
                        absolutePosition: {
                            x: (sidebarWidth - LOGO_SIZE) / 2,
                            y: bottomStartY
                        }
                    });

                    // Center watermark
                    if (logoBase64) {
                        const wmWidth = Math.min(360, pageSize.width * 0.45);
                        const wmX = (pageSize.width - wmWidth) / 2;
                        const wmY = (pageSize.height - wmWidth) / 2;

                        elems.push({
                            image: logoBase64,
                            width: wmWidth,
                            opacity: 0.05,
                            absolutePosition: { x: wmX, y: wmY }
                        });
                    }

                    return elems;
                },

                pageMargins: [sidebarWidth + 30, HEADER_HEIGHT + 20, 40, 60],

                header: (currentPage, pageCount, pageSize) => {
                    return {
                        margin: [sidebarWidth + 20, 15, 20, 0],
                        columns: [
                            {
                                columns: [
                                    logoBase64
                                        ? { image: logoBase64, width: 70, height: 70, margin: [0, 0, 10, 0] }
                                        : { text: "" },
                                    {
                                        stack: [
                                            { text: "LEGAL", fontSize: 22, bold: true, color: "#0A1C45", margin: [0, 6, 0, 0] },
                                            { text: "SUHAD ALJUBOORI", fontSize: 12, bold: true, color: "#0A1C45", margin: [0, 2, 0, 0] },
                                            {
                                                text: "ADVOCATES & LEGAL CONSULTANTS",
                                                fontSize: 9,
                                                color: "#8a96b2",
                                                margin: [0, 2, 0, 0],
                                                characterSpacing: 1
                                            }
                                        ]
                                    }
                                ],
                                width: "*"
                            }
                        ]
                    };
                },

                footer: (currentPage, pageCount, pageSize) => {
                    const footerText = "P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nTel: +971 (04) 332 5928, web: aws-legalgroup.com,\n email: info@awsadvocates.com";

                    return {
                        stack: [
                            {
                                canvas: [
                                    {
                                        type: "rect",
                                        x: 0,
                                        y: 0,
                                        w: pageSize.width,
                                        h: 70,
                                        color: "#f5f5f5"
                                    },
                                ],
                            },
                            {
                                columns: [
                                    { width: "*", text: "" },
                                    {
                                        stack: [
                                            {
                                                text: footerText,
                                                alignment: "center",
                                                fontSize: 7,
                                                color: "#333333",
                                                margin: [0, -60, 0, 0],
                                            },
                                        ],
                                    },
                                    {
                                        text: `Page ${currentPage} of ${pageCount}`,
                                        alignment: "right",
                                        margin: [0, -60, 40, 0],
                                        fontSize: 8,
                                        color: "#333333",
                                    },
                                ],
                            },
                        ],
                        margin: [sidebarWidth, -10, 0, 0],
                    };
                },

                content: [
                    { text: "Legal Fee Agreement", style: "header", margin: [0, 10, 0, 10] },

                    { text: "Agreement", style: "subHeader", margin: [0, 20, 0, 10] },
                    {
                        text: agreement.fixedParts
                            .map((part, i) => part + (agreement.editableValues[i] || ""))
                            .join(" "),
                        style: "agreementText",
                        margin: [0, 0, 0, 20]
                    },

                    // In the content array, find the section points generation:
                    ...fixedHeadings.flatMap((section, sectionIndex) => [
                        { text: section.title, style: "subHeader", margin: [0, 20, 0, 10] },
                        {
                            ol: section.points.map(point => point.text || ""), // Changed from ul to ol
                            style: "pointsList",
                            margin: [0, 0, 0, 20],
                            type: 'lower-alpha' // Add this line
                        }
                    ]),

                    // In the content array, find the signatures section and replace it with this:

                    { text: "Signatures", style: "subHeader", margin: [0, 40, 0, 20] },
                    {
                        columns: [
                            {
                                width: '40%',
                                stack: [
                                    lawyerSignatureBase64
                                        ? {
                                            image: lawyerSignatureBase64,
                                            width: 120,
                                            height: 60,
                                            margin: [0, 0, 0, 5]
                                        }
                                        : { text: "", margin: [0, 0, 0, 5] }, // CHANGED: Empty text instead of line
                                    lawyerSignatureBase64
                                        ? {
                                            text: "___________________",
                                            margin: [0, 0, 0, 5]
                                        }
                                        : { text: "", margin: [0, 0, 0, 5] }, // CHANGED: Only show line if signature exists
                                    { text: "The Lawyer", style: "signatureLabel" },
                                    { text: lawyerName, style: "signatureName" }
                                ],
                                alignment: 'center'
                            },
                            {
                                width: '20%',
                                stack: lawyerSignatureBase64 && clientSignatureBase64 ? [ // CHANGED: Only show stamp if BOTH signatures exist
                                    logoiA64
                                        ? {
                                            image: logoiA64,
                                            width: 80,
                                            height: 80,
                                            margin: [0, 10, 0, 5],
                                            alignment: 'center'
                                        }
                                        : { text: "" },
                                    {
                                        text: "Verified and Authenticated",
                                        style: "stampText",
                                        alignment: 'center'
                                    }
                                ] : [
                                    { text: "" } // CHANGED: Empty stack if not both signatures
                                ],
                                alignment: 'center'
                            },
                            {
                                width: '40%',
                                stack: [
                                    clientSignatureBase64
                                        ? {
                                            image: clientSignatureBase64,
                                            width: 120,
                                            height: 60,
                                            margin: [0, 0, 0, 5]
                                        }
                                        : { text: "", margin: [0, 0, 0, 5] }, // CHANGED: Empty text instead of line
                                    clientSignatureBase64
                                        ? {
                                            text: "___________________",
                                            margin: [0, 0, 0, 5]
                                        }
                                        : { text: "", margin: [0, 0, 0, 5] }, // CHANGED: Only show line if signature exists
                                    { text: "The Client", style: "signatureLabel" },
                                    { text: clientName, style: "signatureName" }
                                ],
                                alignment: 'center'
                            }
                        ],
                        margin: [0, 0, 0, 40]
                    }],

                styles: {
                    header: { fontSize: 18, bold: true, color: "#0A1C45" },
                    subHeader: { fontSize: 14, bold: true, color: "#0A1C45" },
                    agreementText: { fontSize: 11, lineHeight: 1.4, alignment: "justify" },
                    pointsList: { fontSize: 11, lineHeight: 1.4 },
                    signatureLabel: { fontSize: 10, bold: true, alignment: "center" },
                    signatureName: { fontSize: 10, alignment: "center" },
                    stampText: { fontSize: 8, italics: true, alignment: "center", color: "#666666" }
                },
                defaultStyle: { font: "Roboto" }
            };

            pdfMake.createPdf(docDefinition).download("Legal_Fee_Agreement.pdf");
        } catch (e) {
            console.error("PDF generation failed:", e);
            alert("Sorry, unable to generate PDF. Check console for details.");
        }
    };
    // In LEA_Form component
    const handleAcceptLFA = async () => {

        try {
            showDataLoading(true);

            // Determine the case ID based on access method
            const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

            if (!targetCaseId) {
                showDataLoading(false);
                alert("Case ID not found");
                return;
            }

            const response = await fetch(`${ApiEndPoint}acceptLFAForm/${targetCaseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error accepting LFA');
            }

            const data = await response.json();
            showDataLoading(false);

            if (data.success) {
                setLfaStatus("accepted");
                //  setShowSignaturePad(true);

                // If this is email link access, show success message
                //  if (isEmailLinkAccess) {
                //  alert("LFA accepted successfully! Please provide your signature.");
                // } else {
                // For portal access, show message that notification was sent to lawyer
                //alert("LFA accepted successfully! A notification has been sent to your lawyer.");
                // }
            } else {
                alert("Failed to accept LFA: " + data.message);
            }
        } catch (error) {
            showDataLoading(false);
            console.error("Error accepting LFA:", error);
            alert("Failed to accept LFA. Please try again.");
        }
    };

    // Similarly update handleRejectLFA
    const handleRejectLFA = async () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }

        try {
            setIsSubmittingRejection(true);

            // Determine the case ID based on access method
            const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

            if (!targetCaseId) {
                setIsSubmittingRejection(false);
                alert("Case ID not found");
                return;
            }

            const response = await fetch(`${ApiEndPoint}rejectLFAForm/${targetCaseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectionReason }),
            });

            if (!response.ok) {
                throw new Error('Error rejecting LFA');
            }

            const data = await response.json();
            setIsSubmittingRejection(false);
            setShowRejectModal(false);
            setRejectionReason("");

            if (data.success) {
                setLfaStatus("rejected");

                // If this is email link access, show success message
                // if (isEmailLinkAccess) {
                //   alert("LFA rejected successfully. Your feedback has been sent to the lawyer.");
                //} else {
                //  alert("LFA rejected successfully. Your feedback has been sent to the lawyer.");
                //}
            } else {
                alert("Failed to reject LFA: " + data.message);
            }
        } catch (error) {
            setIsSubmittingRejection(false);
            console.error("Error rejecting LFA:", error);
            alert("Failed to reject LFA. Please try again.");
        }
    };

    const handleSignatureSave = (dataUrl) => {
        setSavedSignature(dataUrl);
        setSavedLawyerSignature(dataUrl);
        setIsLocalLawyerSign(true);
    };

    const handleClientSignatureSave = (dataUrl) => {
        setSavedClientSignature(dataUrl);
        // setShowSignaturePad(false);

        // For email link access, automatically show the submit button
        // Don't auto-submit, let the user click the submit button
        if (isEmailLinkAccess) {
            setSignatureSubmitted(false); // Ensure submit button is visible
        }
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
                setShowSignaturePad(false);
            } else {
                console.error("❌ Failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleLawyerSubmit = async () => {
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
                // After successfully creating LFA, save services if any exist
                const targetCaseId = caseInfo?._id;
                if (services.length > 0 && currentSection &&
                    services.some(service => service.selectedService && service.serviceFees)) {
                    try {
                        await saveServicesToDatabase(data.data._id || targetCaseId, targetCaseId, services);
                        console.log("Services saved successfully with initial LFA creation");
                    } catch (error) {
                        console.error("Failed to save services with LFA creation:", error);
                        // Continue even if services fail
                    }
                }

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
    // Keep the existing saveServicesToDatabase function for form submission
    // const saveServicesToDatabase = async (lfaId, caseId, servicesData) => {
    //   try {
    //     const response = await fetch(`${ApiEndPoint}saveServices`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         lfaId,
    //         caseId,
    //         services: {
    //           section: currentSection,
    //           services: servicesData
    //         }
    //       })
    //     });

    //     if (!response.ok) {
    //       throw new Error('Failed to save services');
    //     }

    //     const data = await response.json();
    //     return data;
    //   } catch (error) {
    //     console.error("Error saving services:", error);
    //     throw error;
    //   }
    // };
    const saveServicesToDatabase = async (lfaId, caseId, servicesData) => {
        try {
            const response = await fetch(`${ApiEndPoint}saveServices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lfaId,
                    caseId,
                    services: {
                        section: currentSection, // This will be different for Section 3 vs Section 4
                        services: servicesData
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save services');
            }

            const data = await response.json();

            // Add this check to handle both success cases
            if (!data.success) {
                throw new Error(data.message || 'Failed to save services');
            }

            return data;
        } catch (error) {
            console.error("Error saving services:", error);
            throw error;
        }
    };
    const handleUpdateLawyerSubmit = async () => {
        try {
            if (lfaStatus === "accepted") {
                handleAcceptLFA()
            }

            // Determine the case ID based on access method
            const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

            if (!targetCaseId) {
                alert("Case ID not found");
                return;
            }

            // Get the LFA form ID if it exists
            let lfaId = dataList?._id;

            // If services were added in the modal but not saved independently, save them now
            if (services.length > 0 && currentSection &&
                services.some(service => service.selectedService && service.serviceFees)) {
                try {
                    await saveServicesToDatabase(lfaId || targetCaseId, targetCaseId, services);
                    console.log("Services saved successfully with LFA submission");
                } catch (error) {
                    console.error("Failed to save services with LFA submission:", error);
                    // Continue with LFA submission even if services fail
                }
            }

            const isLawyerSubmission = token?.Role === "lawyer" && !isEmailLinkAccess;
            const isResubmission = lfaStatus === "rejected";

            if (isResubmission) {
                console.log("Resubmittion = 1")
                // Use resubmission endpoint for lawyer resubmitting after rejection
                const resubmitData = {
                    resubmittedBy: "lawyer",
                    agreement: JSON.stringify({
                        fixedParts: agreement?.fixedParts || [],
                        editableValues: agreement?.editableValues || []
                    }),
                    fixedHeadings: JSON.stringify(fixedHeadings?.map(h => ({
                        title: h.title,
                        points: h.points?.map(p => ({
                            text: p.text || "",
                            subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                        }))
                    })) || []),
                    headings: JSON.stringify(headings || [])
                };

                const res = await fetch(`${ApiEndPoint}resubmitLFAForm/${targetCaseId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(resubmitData)
                });

                const data = await res.json();

                if (data.success) {
                    setEditMode(false);
                    setLfaStatus("pending");
                    await FetchLFA(targetCaseId);
                } else {
                    console.error("❌ Failed:", data.message);
                    alert("Failed to resubmit LFA. Please try again.");
                }
            } else {
                // Normal update submission
                const formData = new FormData();
                formData.append("caseId", targetCaseId);
                formData.append("Islawyer", isLawyerSubmission);

                formData.append(
                    "agreement",
                    JSON.stringify({
                        fixedParts: agreement?.fixedParts || [],
                        editableValues: agreement?.editableValues || []
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

                if (isLawyerSubmission && savedSignature) {
                    const file = base64ToFile(savedSignature, "lawyer-signature.png");
                    formData.append("file", file);
                    console.log("Lawyer signature file appended");
                } else if ((isclient || isEmailLinkAccess) && savedClientSignature) {
                    const file = base64ToFile(savedClientSignature, "client-signature.png");
                    formData.append("file", file);
                    console.log("Client signature file appended");
                }

                const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
                    method: "PUT",
                    body: formData
                });

                const data = await res.json();

                if (data.success) {
                    setEditMode(false);

                    if (isLawyerSubmission) {
                        setSignatureSubmitted(true);
                    } else {
                        setSignatureSubmitted(true);
                        setShowSignaturePad(false);
                    }

                    await FetchLFA(targetCaseId);
                } else {
                    console.error("❌ Failed:", data.message);
                    alert("Failed to submit signature. Please try again.");
                }
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Error submitting form. Please try again.");
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

    // UPDATED: selecting a draft now forces a clean remount & syncs signatures
    const handlePickDraft = (data) => {
        setAgreement(data.agreement);
        setFixedHeadings(data.fixedHeadings);
        setHeadings(data.headings);
        setSelectedDrafts(data);
        setDraftKey((k) => k + 1); // force remount
    };

    const renderHeadings = (list, setFn, isFixed = false) => {
        if (!Array.isArray(list)) return null;

        // FIXED: Preserve the alphabetical list structure when displaying
        const combinedHtml = list
            .map(
                (heading, hIndex) => `
            <div style="margin-bottom: 20px;">
                <strong>${heading.title || ""}</strong>
                <ol type="a" style="margin: 8px 0; padding-left: 24px;">
                    ${(heading.points || [])
                        .map((p) => `<li style="margin: 4px 0; text-align: justify;">${p.text || ""}</li>`)
                        .join("")}
                </ol>
            </div>
        `
            )
            .join("");

        return (
            <div className="section border p-2 rounded bg-light">
                {editMode ? (
                    // Check if this is a fixed heading and if the specific section is editable
                    isFixed ? (
                        // For fixed headings, check editable property for each section
                        <CEEditable
                            list={list}
                            onChange={(updatedList) => setFixedHeadings(updatedList)}
                            disable={(isFormFilled && !editMode)}
                            // Pass editable information to CEEditable if needed
                            editableSections={list.map(item => item.editable !== false)}
                        />
                    ) : (
                        // For custom headings, always editable
                        <CEEditable
                            list={list}
                            onChange={(updatedList) => setFn(updatedList)}
                            disable={(isFormFilled && !editMode)}
                        />
                    )
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
                )}
            </div>
        );


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

    // NEW: Render Accept/Reject buttons for client - UPDATED to check signatureSubmitted state
    const renderClientDecisionButtons = () => {
        // Show buttons for email link access OR regular client access
        const shouldShowButtons = (isEmailLinkAccess || isclient) &&
            isFormFilled &&
            lfaStatus !== "accepted" &&
            lfaStatus !== "rejected" &&
            !savedClientSignature &&
            !signatureSubmitted; // NEW: Also check signatureSubmitted state

        if (!shouldShowButtons) {
            return null;
        }

        return (
            <div
                className="d-flex justify-content-center align-items-center mt-4 mb-4 px-3"
                data-html2canvas-ignore="true"
            >
                {/* Reject button */}
                <button
                    className="btn btn-danger fw-bold me-3"
                    onClick={() => setShowRejectModal(true)}
                    style={{ width: "150px" }}
                >
                    Reject LFA
                </button>

                {/* Accept button */}
                <button
                    className="btn fw-bold"
                    style={{
                        width: "150px",
                        backgroundColor: "#001f54",
                        color: "white",
                        border: "none",
                        transition: "all 0.3s ease-in-out"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#c0a262";
                        e.currentTarget.style.color = "black";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#001f54";
                        e.currentTarget.style.color = "white";
                    }}
                    onClick={() => {
                        setLfaStatus("accepted");
                        setShowSignaturePad(true);
                    }}
                >
                    Accept LFA
                </button>
            </div>
        );
    };

    // NEW: Rejection Modal
    const renderRejectionModal = () => {
        return (
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject LFA</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please provide the reason for rejecting this Legal Fee Agreement:</p>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter your reasons for rejection and any changes you would like to see"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <div className="d-flex gap-3">
                        <Button
                            style={{
                                backgroundColor: "#001f54", // Dark Blue
                                color: "white",
                                border: "none",
                                transition: "all 0.3s ease-in-out"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#c0a262"; // Golden on hover
                                e.currentTarget.style.color = "black";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#001f54"; // Back to Dark Blue
                                e.currentTarget.style.color = "white";
                            }}
                            onClick={() => setShowRejectModal(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="danger"
                            onClick={handleRejectLFA}
                            disabled={isSubmittingRejection}
                        >
                            {isSubmittingRejection ? "Submitting..." : "Submit Rejection"}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    };

    // NEW: Services and Fees Modal
    // NEW: Services and Fees Modal - Simplified Design
    // NEW: Services and Fees Modal - Multiple Services Design
    // Keep the renderServicesModal function as is, with both buttons
    const renderServicesModal = () => {
        return (
            <Modal show={showServicesModal} onHide={() => setShowServicesModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Services and Fees - {currentSection}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Services List */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">Services</h6>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleAddService}
                                className="d-flex align-items-center"
                            >
                                <BsPlus className="me-1" /> Add Another Service
                            </Button>
                        </div>

                        {/* Services List */}
                        {services.map((service, serviceIndex) => (
                            <div key={service.id} className="border rounded p-3 mb-3 position-relative">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">Service {serviceIndex + 1}</h6>
                                    {services.length > 1 && (
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleRemoveService(service.id)}
                                            className="position-absolute"
                                            style={{ top: '10px', right: '10px' }}
                                        >
                                            <BsDash />
                                        </Button>
                                    )}
                                </div>

                                {/* Service Selection */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Service</Form.Label>
                                    <Form.Select
                                        value={service.selectedService}
                                        onChange={(e) => handleServiceChange(service.id, 'selectedService', e.target.value)}
                                        className="form-control-lg"
                                    >
                                        <option value="">Choose a service...</option>
                                        {servicesList.map((serviceOption, index) => (
                                            <option key={index} value={serviceOption}>{serviceOption}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {/* Service Fees */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Service Fees</Form.Label>
                                    <InputGroup size="lg">
                                        <InputGroup.Text>AED</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter fee amount"
                                            value={service.serviceFees}
                                            onChange={(e) => handleServiceChange(service.id, 'serviceFees', e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <div className="d-flex gap-3">
                        <Button
                            style={{
                                backgroundColor: "#001f54",
                                color: "white",
                                border: "none",
                                transition: "all 0.3s ease-in-out",
                                minWidth: '120px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#c0a262";
                                e.currentTarget.style.color = "black";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#001f54";
                                e.currentTarget.style.color = "white";
                            }}
                            onClick={() => setShowServicesModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{
                                backgroundColor: "#001f54",
                                color: "white",
                                border: "none",
                                transition: "all 0.3s ease-in-out",
                                minWidth: '120px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#c0a262";
                                e.currentTarget.style.color = "black";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#001f54";
                                e.currentTarget.style.color = "white";
                            }}
                            onClick={handleSaveAllServices}
                        >
                            Save All Services
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    };
    const ThankYouMessage = () => (
        <div className="text-center py-5">
            <h3>Thank You!</h3>
        </div>
    );

    return (
        <div
            className="card w-100"
            style={
                showLinkGenerator
                    ? {
                        maxHeight: "87vh",
                        overflowX: "hidden",
                        overflowY: "auto",
                    }
                    : {
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        minHeight: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        color: "white",
                        alignItems: "center",
                        overflowX: "hidden",
                        overflowY: "auto",
                    }
            }
        >
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
                
                /* CHANGED: Replace bullet lists with alphabetical lists */
                .word-paper ul,
                .word-paper ol { padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
                .word-paper ul { list-style-type: lower-alpha !important; }
                .word-paper ul.sub-bullets { list-style-type: lower-alpha !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
                .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
                .word-paper .list-unstyled ul.sub-bullets,
                .word-paper .form-control ul.sub-bullets { list-style-type: lower-alpha !important; padding-left: 24px !important; }
                
                @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
            `}</style>

            {/* toolbar */}

            {(token?.Role === "lawyer" || isFormFilled) ? (
                <>
                    <div
                        className="d-flex justify-content-end mb-3 px-3 py-2"
                        data-html2canvas-ignore="true"
                        style={{
                            marginTop: '10px'
                        }}
                    >
                        {/* Only show Generate Link button to lawyer and admin */}
                        {(token?.Role === "lawyer" || token?.Role === "admin") && (
                            <button
                                className="btn btn-primary me-3 px-4 py-2 fw-medium"
                                onClick={handleGenerateLink}
                                style={{
                                    backgroundColor: "#001f54",
                                    color: "white",
                                    border: "none",
                                    transition: "all 0.3s ease-in-out"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#c0a262";
                                    e.currentTarget.style.color = "black";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#001f54";
                                    e.currentTarget.style.color = "white";
                                }}
                            >
                                Generate Form Link
                            </button>
                        )}

                        <button
                            className="btn fw-medium d-flex align-items-center"
                            onClick={handleDownload}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#001f54",
                                color: "white",
                                border: "none",
                                transition: "all 0.3s ease-in-out"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#c0a262";
                                e.currentTarget.style.color = "black";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#001f54";
                                e.currentTarget.style.color = "white";
                            }}
                        >
                            <BsDownload className="me-2" />
                            Download PDF
                        </button>
                    </div>
                    <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey} style={isEmailLinkAccess ? { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" } : {}}>
                        {/* Header */}
                        <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
                            <img
                                src="logo.png"
                                alt="Logo"
                                className="me-2 me-md-3 mb-2 mb-md-0"
                                style={{ height: "50px" }}
                            />
                            <h1 className="mb-0 h4 h3-md fw-bold text-break" style={isEmailLinkAccess ? { color: "black" } : {}}>Legal Fee Agreement</h1>
                        </div>

                        {token?.Role == "lawyer" && (
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
                                <div
                                    className="form-control p-3"
                                    style={{
                                        minHeight: "300px",
                                        whiteSpace: "pre-wrap",
                                        textAlign: "justify",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {agreement?.fixedParts?.map((part, index) => (
                                        <React.Fragment key={index}>
                                            <span>{part}</span>
                                            {index < agreement.editableValues.length && (
                                                <span
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    style={{
                                                        display: "inline",
                                                        minWidth: "100px",
                                                        outline: "none",
                                                        background: "transparent",
                                                        fontFamily: "inherit",
                                                        fontSize: "inherit",
                                                        padding: "2px 4px",
                                                        border: "1px dashed #ccc",
                                                        borderRadius: "3px",
                                                        margin: "0 2px",
                                                        textDecoration: "underline",
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                        textAlign: "justify",
                                                        lineHeight: "inherit"
                                                    }}
                                                    onBlur={(e) => {
                                                        const newValue = e.currentTarget.textContent || "";
                                                        handleEditableChange(index, newValue);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        // Prevent Enter key from creating new lines
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    {agreement.editableValues[index] || ""}
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    className="form-control bg-white p-3"
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        minHeight: "300px",
                                        textAlign: "justify",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {agreement?.fixedParts?.map((part, index) => (
                                        <React.Fragment key={index}>
                                            <span>{part}</span>
                                            {index < agreement.editableValues.length && (
                                                <span
                                                    style={{
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                        textAlign: "justify",
                                                        display: "inline",
                                                        textDecoration: "underline"
                                                    }}
                                                >
                                                    {agreement.editableValues[index] || ""}
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fixed Headings */}
                        {fixedHeadings.map((heading, index) => (
                            <div key={index} className="section border p-2 rounded bg-light mb-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <strong>{heading.title}</strong>
                                    {/* Add Service and Fees button for specific sections */}
                                    {(heading.title.includes('Professional Fees for Dispute Case') ||
                                        heading.title.includes('Other Fees')) && editMode && (
                                            <button
                                                className="btn btn-sm ms-2"
                                                onClick={() => handleAddServiceClick(heading.title)}
                                                style={{
                                                    backgroundColor: "#001f54",
                                                    color: "white",
                                                    border: "none",
                                                    transition: "all 0.3s ease-in-out",
                                                    whiteSpace: "nowrap"
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#c0a262";
                                                    e.currentTarget.style.color = "black";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.backgroundColor = "#001f54";
                                                    e.currentTarget.style.color = "white";
                                                }}
                                            >
                                                Add Service and Fees
                                            </button>
                                        )}
                                </div>
                                {editMode ? (
                                    <CEEditable
                                        list={[heading]}
                                        onChange={(updatedList) => {
                                            const updatedHeadings = [...fixedHeadings];
                                            updatedHeadings[index] = updatedList[0];
                                            setFixedHeadings(updatedHeadings);
                                        }}
                                        disable={(isFormFilled && !editMode)}
                                    />
                                ) : (
                                    <ol type="a" style={{ margin: "8px 0", paddingLeft: "24px" }}>
                                        {heading.points.map((point, pIndex) => (
                                            <li key={pIndex} style={{ margin: "4px 0", textAlign: "justify" }}>
                                                {point.text}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        ))}

                        {/* Custom Headings */}
                        {/* {renderHeadings(headings, setHeadings, false)} */}

                        {/* NEW: Client decision buttons */}
                        {renderClientDecisionButtons()}

                        {/* NEW: Signature pad for client after acceptance */}
                        {showSignaturePad && (
                            <div style={{ padding: 20 }} data-html2canvas-ignore="true">
                                <h2>Client Signature</h2>
                                <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
                            </div>
                        )}

                        {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
                            <div style={{ padding: 20 }} data-html2canvas-ignore="true">
                                <h2>Lawyer Signature</h2>
                                <Form_SignaturePad height={250} onSave={handleSignatureSave} />
                            </div>
                        )}

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

                            {/* ADDED: Stamp between signatures when both are present */}
                            {savedSignature && savedClientSignature && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column"
                                }}>
                                    <img
                                        src={logoiA}
                                        alt="Stamp"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            opacity: 0.8,
                                            margin: "0 20px"
                                        }}
                                    />
                                    <span style={{ fontSize: "12px", marginTop: "5px", fontStyle: "italic" }}>
                                        Verified and Authenticated
                                    </span>
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
                        {/* ⬇️⬇️⬇️ ADD REJECTION STATUS DISPLAY RIGHT HERE ⬇️⬇️⬇️ */}
                        {/* Rejection Status Display - FIXED */}
                        {/* Rejection Status Display - FIXED */}
                        {lfaStatus === "rejected" && dataList?.rejectionReason && (
                            <div className="alert alert-danger mt-4" role="alert">
                                <h5 className="alert-heading">
                                    {/* Show appropriate message based on user role */}
                                    {(isclient || isEmailLinkAccess)
                                        ? "You have rejected this LFA"
                                        : "Client has rejected this LFA"
                                    }
                                </h5>
                                <p className="mb-1"><strong>Reason for rejection:</strong></p>
                                <div
                                    className="mb-0 rejection-reason"
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {dataList.rejectionReason}
                                </div>
                                {dataList.rejectedAt && (
                                    <small className="text-muted d-block mt-2">
                                        Rejected on: {new Date(dataList.rejectedAt).toLocaleDateString('en-GB')}
                                        {/* Only show "by client" for lawyer view */}
                                        {!isclient && !isEmailLinkAccess && dataList.rejectedBy && ` by ${dataList.rejectedBy}`}
                                    </small>
                                )}
                            </div>
                        )}
                        {/* NEW: Rejection Popup Modal for Lawyer */}
                        {!isclient && !isEmailLinkAccess && token?.Role === "lawyer" && lfaStatus === "rejected" && dataList?.rejectionReason && !editMode && !rejectionAcknowledged && (
                            <Modal show={true} onHide={() => setRejectionAcknowledged(true)} backdrop="static" keyboard={false} size="lg">
                                <Modal.Header closeButton style={{ backgroundColor: "#f8d7da", borderColor: "#f5c6cb" }}>
                                    <Modal.Title className="text-danger">LFA Rejected by Client</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="mb-3">
                                        <h6 className="text-danger mb-3">Client has rejected this Legal Fee Agreement</h6>
                                        <p className="mb-2"><strong>Reason for rejection:</strong></p>

                                        {/* Scrollable container for rejection reason */}
                                        <div
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                textAlign: 'left',
                                                maxHeight: '200px',
                                                overflowY: 'auto',
                                                padding: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                backgroundColor: '#fafafa',
                                                fontSize: '14px',
                                                lineHeight: '1.5'
                                            }}
                                        >
                                            {dataList.rejectionReason}
                                        </div>

                                        <small className="text-muted mt-2 d-block">
                                            Rejected on: {new Date(dataList.rejectedAt || Date.now()).toLocaleDateString('en-GB')}
                                        </small>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className="justify-content-center">
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={() => setRejectionAcknowledged(true)}
                                        style={{
                                            backgroundColor: "#001f54",
                                            color: "white",
                                            border: "none",
                                            transition: "all 0.3s ease-in-out",
                                            minWidth: "100px"
                                        }}
                                    >
                                        OK
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setEditMode(true)}
                                        style={{
                                            backgroundColor: "#001f54",
                                            color: "white",
                                            border: "none",
                                            transition: "all 0.3s ease-in-out",
                                            minWidth: "120px"
                                        }}
                                    >
                                        Edit Agreement
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        )}
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
                                    {/* Show submit button for both portal access AND email link access */}
                                    {((isclient && savedClientSignature && lfaStatus === "accepted" && !signatureSubmitted) ||
                                        (isEmailLinkAccess && savedClientSignature && lfaStatus === "accepted" && !signatureSubmitted)) && (
                                            <button
                                                className="btn btn-sm btn-primary fw-bold"
                                                onClick={handleUpdateLawyerSubmit}
                                                style={{ width: "150px" }}
                                                data-html2canvas-ignore="true"
                                            >
                                                Submit Signature
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
                        {/* Add this at the end of the form content */}
                        {isEmailLinkAccess && signatureSubmitted && (
                            <ThankYouMessage />
                        )}
                    </div>
                </>
            ) : (
                <div className="text-center text-black py-5">No LFA Form Available.</div>
            )}

            {/* NEW: Rejection Modal */}
            {renderRejectionModal()}

            {/* NEW: Services and Fees Modal */}
            {renderServicesModal()}
        </div>
    );
};

export default LEA_Form;