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
const LEA_Form = ({ token }) => {
    // Agreement content
    // const [agreement, setAgreement] = useState({
    //     fixedParts: [
    //         `This Agreement ("Agreement") is entered into and shall become effective as of ${new Date().toLocaleDateString('en-GB')} by and between:\n\n**`,
    //         '**, with its principal place of business located at ',
    //         ', represented herein by **',
    //         '**, duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n**',
    //         '** a national of ',
    //         ', with their principal place of residence located ',
    //         ', holding Emirates ID Number: ',
    //         ` issued on: ${new Date().toLocaleDateString('en-GB')}, having email ID: `,
    //         ' and Contact Number: ',
    //         ' (Hereinafter referred to as the "Client")'
    //     ],
    //     editableValues: [
    //         'M/s AWS Legal Consultancy FZ-LLC',
    //         '1 Sheikh Zayed Road, The H Dubai, Office 1602, P.O. Box 96070, Dubai, the United Arab Emirates',
    //         'Mr Aws M. Younis, Chairman',
    //         'Dr. Ali Moustafa Mohamed Elba',
    //         'Egypt',
    //         'Dubai, United Arab Emirates',
    //         '784-1952-3620694-4',
    //         'alyelba@yahoo.com',
    //         '+971521356931'
    //     ]
    // });
    const caseInfo = useSelector((state) => state.screen.Caseinfo);

    const { showDataLoading } = useAlert();


    useEffect(() => {
        FetchLFA()
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
        // {
        //     title: '',
        //     points: [{ text: '', subpoints: [] }]
        // }
    ]);

    const [savedSignature, setSavedSignature] = useState(null);
    const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
    const [isFormFilled, setisFormFilled] = useState(false);
    const [savedClientSignature, setSavedClientSignature] = useState(null);
    const [isLocalSign, setIsLocalSign] = useState(false);
    const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
    const [dataList, setDataList] = useState([]);
    const isclient = token?.Role === "client"

    const FetchLFA = async () => {
        showDataLoading(true)
        console.log('caseInfo=', caseInfo);
        try {
            const response = await fetch(
                `${ApiEndPoint}getLFAForm/${caseInfo?._id}`
                //  caseInfo === null ? (token?.Role === "admin" ? `${ApiEndPoint}getAllTasksWithDetails` : `${ApiEndPoint}getTasksByUser/${token?._id}`) : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}`
            );

            if (!response.ok) {
                showDataLoading(false)
                throw new Error('Error fetching LFA');
            }

            const data = await response.json();
            showDataLoading(false)
            console.log('fetch LFA', data.data.agreement);
            setAgreement(data.data.agreement);
            setDataList(data.data);
            setFixedHeadings(data.data.fixedHeadings);
            setHeadings(data.data.headings);
            setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
            setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
            setEditMode(false)
            setisFormFilled(true)
            setIsLocalSign(data.data?.ClientSignatureImage ? true : false)
            setIsLocalLawyerSign(!data.data?.LawyerSignatureImage ? true : false)

            setSavedLawyerSignature()
        } catch (err) {
            showDataLoading(false)
            // setMessage(err.response?.data?.message || "Error deleting task.");
            //  setShowError(true);
        }

    }
    // This will be called when user clicks "Pass to Parent" button inside SignaturePad
    const handleSignatureSave = (dataUrl) => {
        console.log("Lawyar Signature Base64:", dataUrl);
        setSavedSignature(dataUrl); // store it locally
        setSavedLawyerSignature(dataUrl)
         setIsLocalLawyerSign(true)

        // You could also send it to your backend here
    };
    const handleClientSignatureSave = (dataUrl) => {
        console.log("Client Signature Base64:", dataUrl);
        setSavedClientSignature(dataUrl); // store it locally
        // setIsLocalSign(true)
        // You could also send it to your backend here
    };

    const [editMode, setEditMode] = useState(true);

    const handleEditableChange = (index, newValue) => {
        const updated = [...agreement.editableValues];
        updated[index] = newValue;
        setAgreement({ ...agreement, editableValues: updated });
    };

    // const handleSubmit = () => ;


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

            // Required fields
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", false); // Client submit karega

            // Agreement ko JSON me convert karke append karna
            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement?.fixedParts,
                    editableValues: agreement?.editableValues
                })
            );

            // Fixed Headings JSON
            // formData.append("fixedHeadings", JSON.stringify(fixedHeadings));
            // Transform karna before append
            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({
                        text: sp.text || ""
                    })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));

            // Custom Headings JSON
            formData.append("headings", JSON.stringify(headings));

            // Client signature file agar available ho
            if (savedClientSignature) {
                const file = base64ToFile(savedClientSignature, "client-signature.png");
                formData.append("file", file);
            }

            // POST request
            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData, // multipart/form-data
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
                setIsLocalSign(true)
                console.log("✅ Client form saved:", data);
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

            // Required fields
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", true); // Client submit karega

            // Agreement ko JSON me convert karke append karna
            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement.fixedParts,
                    editableValues: agreement.editableValues
                })
            );

            // Fixed Headings JSON
            // formData.append("fixedHeadings", JSON.stringify(fixedHeadings));
            // Transform karna before append
            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({
                        text: sp.text || ""
                    })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));

            // Custom Headings JSON
            formData.append("headings", JSON.stringify(headings));

            // Client signature file agar available ho
            if (savedClientSignature) {
                const file = base64ToFile(savedSignature, "lawyer-signature.png");
                formData.append("file", file);
            }

            // POST request
            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData, // multipart/form-data
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
                console.log("✅ Client form saved:", data);
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

            // Required fields
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", false); // Client submit karega

            // Agreement ko JSON me convert karke append karna
            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement?.fixedParts,
                    editableValues: agreement?.editableValues
                })
            );

            // Fixed Headings JSON
            // formData.append("fixedHeadings", JSON.stringify(fixedHeadings));
            // Transform karna before append
            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({
                        text: sp.text || ""
                    })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));

            // Custom Headings JSON
            formData.append("headings", JSON.stringify(headings));

            // Client signature file agar available ho
            if (savedClientSignature) {
                const file = base64ToFile(savedClientSignature, "client-signature.png");
                formData.append("file", file);
            }

            // POST request
            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData, // multipart/form-data
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
                console.log("✅ Client form saved:", data);
            } else {
                console.error("❌ Failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };




    // const handleUpdateLawyerSubmit = async () => {
    //     try {
    //         const formData = new FormData();
    //         // Required fields
    //         formData.append("caseId", caseInfo?._id || "");
    //         formData.append("Islawyer", !isclient); // Client submit karega

    //         // Agreement ko JSON me convert karke append karna
    //         formData.append(
    //             "agreement",
    //             JSON.stringify({
    //                 fixedParts: agreement.fixedParts,
    //                 editableValues: agreement.editableValues
    //             })
    //         );

    //         // Fixed Headings JSON
    //         // formData.append("fixedHeadings", JSON.stringify(fixedHeadings));
    //         // Transform karna before append
    //         const formattedHeadings = fixedHeadings?.map(h => ({
    //             title: h.title,
    //             points: h.points?.map(p => ({
    //                 text: p.text || "",
    //                 subpoints: p.subpoints?.map(sp => ({
    //                     text: sp.text || ""
    //                 })) || []
    //             }))
    //         }));

    //         formData.append("fixedHeadings", JSON.stringify(formattedHeadings));

    //         // Custom Headings JSON
    //         formData.append("headings", JSON.stringify(headings));

    //         // Client signature file agar available ho
    //         if (savedSignature && !isclient) {
    //             const file = base64ToFile(savedSignature, "lawyer-signature.png");
    //             formData.append("file", file);
    //         }

    //         if (savedClientSignature && isclient) {
    //             const file = base64ToFile(savedClientSignature, "client-signature.png");
    //             formData.append("file", file);
    //         }
    //         // POST request

    //         console.log("lawyers=", formData)

    //         const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
    //             method: "PUT",
    //             body: formData, // multipart/form-data
    //         });

    //         const data = await res.json();

    //         if (data.success) {
    //             setEditMode(false);
    //             FetchLFA()
    //             console.log("✅ Client form saved:", data);
    //         } else {
    //             console.error("❌ Failed:", data.message);
    //         }
    //     } catch (err) {
    //         console.error("Error submitting form:", err);
    //     }
    // };



    const handleUpdateLawyerSubmit = async () => {
        try {
            const formData = new FormData();

            // Required fields
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", !isclient);

            // Agreement
            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement?.fixedParts || [],
                    editableValues: agreement?.editableValues || {}
                })
            );

            // Fixed Headings format
            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({
                        text: sp.text || ""
                    })) || []
                }))
            })) || [];

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));

            // Custom Headings
            formData.append("headings", JSON.stringify(headings || []));

            // Signatures
            if (!isclient && savedSignature) {
                const file = base64ToFile(savedSignature, "lawyer-signature.png");
                formData.append("file", file);
            }

            if (isclient && savedClientSignature) {
                const file = base64ToFile(savedClientSignature, "client-signature.png");
                formData.append("file", file);
            }

            // Debug print all FormData
            console.log("=== FormData being sent ===");
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // API Call
            const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
                method: "PUT",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                setEditMode(false);
                FetchLFA();
                console.log("✅ Form updated:", data);
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

    // ---------- Download handler (html2pdf) + clean PDF mode ----------
    const handleDownload = async () => {
        if (!pdfRef.current) return;
        try {
            // Clean print look ON (textfield borders/bg off)
            pdfRef.current.classList.add("pdf-mode");

            const { default: html2pdf } = await import("html2pdf.js");
            const opt = {
                margin: [12, 15, 12, 15], // [top, left, bottom, right] in mm
                filename: "Legal_Fee_Agreement.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2.2, useCORS: true, scrollY: 0 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                pagebreak: { mode: ["css", "legacy"] },
            };

            await html2pdf().set(opt).from(pdfRef.current).save();
        } catch (e) {
            console.error("PDF generation failed:", e);
            alert("Sorry, unable to generate PDF. Check console for details.");
        } finally {
            // Clean print look OFF (UI normal)
            pdfRef.current.classList.remove("pdf-mode");
        }
    };

    // ---------- Helper: renderHeadings (alignment + bullets + ignore UI in PDF) ----------
    const renderHeadings = (list, setFn, isFixed = false) => {
        const addHeading = (index) => {
            if (!editMode) return;
            const updated = [...list];
            updated.splice(index + 1, 0, { title: "", points: [] });
            setFn(updated);
        };

        const deleteHeading = (index) => {
            if (!editMode) return;
            const updated = [...list];
            updated.splice(index, 1);
            setFn(updated);
        };

        const addPoint = (hIndex) => {
            if (!editMode) return;
            const updated = [...list];
            updated[hIndex].points.push({ text: "", subpoints: [] });
            setFn(updated);
        };

        const deletePoint = (hIndex, pIndex) => {
            if (!editMode) return;
            const updated = [...list];
            updated[hIndex].points.splice(pIndex, 1);
            setFn(updated);
        };

        return list?.map((heading, hIndex) => (
            <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
                {/* === HEADING ROW: index + title + actions in ONE row === */}
                <div
                    className="heading-row"
                    style={{
                        display: "grid",
                        // gridTemplateColumns: "36px 1fr auto",
                        columnGap: "1px",
                        alignItems: "center",
                        marginBottom: "8px",
                    }}
                >
                    {/* Index number (fixed width) */}
                    <div
                        className="idx"
                        style={{ width: "20px", minWidth: "10px", textAlign: "right", fontWeight: 600 }}
                    >
                        {isFixed ? hIndex + 1 : hIndex + 11}.
                    </div>

                    {/* Heading content (fills the row) */}
                    <div className="form-control bg-white p-1 fw-bold" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
                        {editMode && !savedClientSignature ? (
                            <p
                                ref={(el) => {
                                    if (el && !el.innerHTML.trim()) el.innerHTML = heading.title || "\u00A0";
                                }}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(e) => {
                                    const html = e.currentTarget.innerHTML;
                                    const updated = [...list];
                                    updated[hIndex].title = html;
                                    setFn(updated);
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
                                        range.setEndAfter(spaceNode);
                                        selection.removeAllRanges();
                                        selection.addRange(range);
                                    }
                                }}
                                onBlur={(e) => {
                                    if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
                                }}
                                style={{
                                    display: "inline-block",
                                    minHeight: "40px",
                                    width: "100%",
                                    outline: "none",
                                    background: "transparent",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    fontFamily: "inherit",
                                    fontSize: "inherit",
                                    fontWeight: "bold",
                                    padding: "4px 6px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    boxSizing: "border-box",
                                    textAlign: "justify",
                                }}
                            />
                        ) : (
                            <div>
                                <React.Fragment key={hIndex}>
                                    <span>{heading.label || ""}</span>
                                    <span dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
                                </React.Fragment>
                            </div>
                        )}
                    </div>

                    {/* Actions (only edit mode) */}
                    <div
                        style={{ display: editMode && !savedClientSignature ? "flex" : "none", gap: "6px" }}
                        data-html2canvas-ignore="true"
                    >
                        <div
                            style={{
                                color: "green",
                                fontSize: 16,
                                borderRadius: "5px",
                                boxShadow: "0px 4px 4px rgba(4, 2, 2, 0.2)",
                                cursor: "pointer",
                            }}
                            onClick={() => addHeading(hIndex)}
                        >
                            <BsPlus />
                        </div>
                        <div
                            style={{
                                color: "red",
                                fontSize: 16,
                                borderRadius: "5px",
                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
                                cursor: "pointer",
                            }}
                            onClick={() => deleteHeading(hIndex)}
                        >
                            <BsDash />
                        </div>
                    </div>
                </div>

                {/* === POINTS === */}
                <ul className="list-unstyled ps-2 ps-md-3">
                    {heading.points?.map((point, pIndex) => (
                        <li key={pIndex}>
                            <div className="d-flex flex-wrap align-items-center mb-2">
                                {editMode && !savedClientSignature ? (
                                    <p
                                        ref={(el) => {
                                            if (el && !el.innerHTML.trim()) el.innerHTML = point.text || "\u00A0";
                                        }}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => {
                                            const html = e.currentTarget.innerHTML;
                                            const updated = [...list];
                                            updated[hIndex].points[pIndex].text = html;
                                            setFn(updated);
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
                                                range.setEndAfter(spaceNode);
                                                selection.removeAllRanges();
                                                selection.addRange(range);
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (!e.currentTarget.textContent.trim()) e.currentTarget.innerHTML = "\u00A0";
                                        }}
                                        style={{
                                            display: "inline-block",
                                            minHeight: "40px",
                                            width: "100%",
                                            outline: "none",
                                            background: "transparent",
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                            fontFamily: "inherit",
                                            fontSize: "inherit",
                                            padding: "4px 6px",
                                            border: "1px solid #ddd",
                                            borderRadius: "4px",
                                            boxSizing: "border-box",
                                            textAlign: "justify",
                                        }}
                                    />
                                ) : (
                                    <div className="" style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}>
                                        {/* {list[hIndex]?.points?.map((point, pIdx) => ( */}
                                            <React.Fragment key={pIndex}>
                                                <span>{point.label || ""}</span>
                                                <span dangerouslySetInnerHTML={{ __html: point.text || "" }} />
                                            </React.Fragment>
                                        {/* ))} */}
                                    </div>
                                )}

                                {editMode && !savedClientSignature && (
                                    <>
                                        <div
                                            style={{
                                                color: "green",
                                                fontSize: 16,
                                                borderRadius: "5px",
                                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => addPoint(hIndex)}
                                            data-html2canvas-ignore="true"
                                        >
                                            <BsPlus />
                                        </div>
                                        <div
                                            style={{
                                                color: "red",
                                                fontSize: 16,
                                                borderRadius: "5px",
                                                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => deletePoint(hIndex, pIndex)}
                                            data-html2canvas-ignore="true"
                                        >
                                            <BsDash />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* --- SUBPOINTS (table-based bullets for perfect alignment) --- */}
                            {Array.isArray(point?.subpoints) && point.subpoints.length > 0 && (
                                <div style={{ margin: "4px 0 8px 0", paddingLeft: "16px", paddingRight: "16px" }}>
                                    {point.subpoints.map((sp, sIndex) => {
                                        const html = typeof sp === "string" ? sp : sp?.text || "";
                                        return (
                                            <table
                                                key={sIndex}
                                                style={{
                                                    borderCollapse: "collapse",
                                                    width: "100%",
                                                    tableLayout: "fixed",
                                                    margin: "2px 0",
                                                }}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                width: "14px",
                                                                minWidth: "14px",
                                                                textAlign: "center",
                                                                verticalAlign: "top",
                                                            }}
                                                        >
                                                            •
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingLeft: "8px",
                                                                textAlign: "justify",
                                                                wordBreak: "break-word",
                                                            }}
                                                        >
                                                            <div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                </div>
                            )}
                        </li>
                    ))}

                    {editMode && !savedClientSignature && (
                        <li>
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => addPoint(hIndex)}
                                data-html2canvas-ignore="true"
                            >
                                + Add Point
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        ));
    };



    return (
        <div className="card w-100" style={{ maxHeight: "87vh", overflowY: "auto" }}>
            {/* Inline CSS: alignment + clean PDF look + forced bullets */}
            <style>{`
        /* ===== Alignment & Typography ===== */
        .word-paper { color: #000; line-height: 1.4; }
        /* Heading row = fixed index column + fluid title column */
        .word-paper .heading-row {
          display: grid;
          grid-template-columns: 32px 1fr;   /* fixed index width */
          column-gap: 8px;
          align-items: start;
        }
        .word-paper .idx {
          width: 32px;
          min-width: 32px;
          text-align: right; /* numbers right-aligned like Word lists */
        }

        /* Justify main text everywhere it makes sense */
        .word-paper .form-control,
        .word-paper [contenteditable="true"],
        .word-paper ul.sub-bullets,
        .word-paper ul.sub-bullets li {
          text-align: justify;
        }

        /* ===== Clean PDF mode (toggled at export) ===== */
        .word-paper.pdf-mode * { box-shadow: none !important; }
        .word-paper.pdf-mode .card,
        .word-paper.pdf-mode .form-control,
        .word-paper.pdf-mode .section {
          border: none !important;
          background: transparent !important;
        }
        .word-paper.pdf-mode [contenteditable="true"] {
          border: none !important;
          outline: none !important;
          background: transparent !important;
          padding: 0 !important;
        }

        /* ===== Ensure list markers render in PDF (override Bootstrap resets) ===== */
        .word-paper.pdf-mode ul,
        .word-paper.pdf-mode ol {
          list-style: revert !important;
          padding-left: 24px !important;
          margin: 4px 0 6px 0 !important;
        }
        /* Subpoints bullets */
        .word-paper ul.sub-bullets {
          list-style-type: disc !important;
          list-style-position: outside !important;
          padding-left: 24px !important;
          margin: 4px 0 6px 0 !important;
        }
        .word-paper ul.sub-bullets li {
          display: list-item !important;
          margin: 2px 0 !important;
        }
        /* If wrapped by .list-unstyled/form-control, still show bullets */
        .word-paper .list-unstyled ul.sub-bullets,
        .word-paper .form-control ul.sub-bullets {
          list-style-type: disc !important;
          padding-left: 24px !important;
        }

        /* Hide ignored elements in print fallback */
        @media print {
          [data-html2canvas-ignore="true"] { display: none !important; }
        }
      `}</style>

            {/* -------- toolbar (ignored in PDF) -------- */}
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
                // --------- ONLY THIS CONTAINER will be exported to PDF ---------
                <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef}>
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
                                                        range.setEndAfter(spaceNode);
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
                    {renderHeadings(headings, setHeadings, false)}

                    {(isFormFilled && savedClientSignature &&  !isclient && IsLocalLawyerSign) && (
                        <div style={{ padding: 20 }} data-html2canvas-ignore="true">
                            <h2>Lawyer Signature</h2>
                            {/* Reusable Signature Pad */}
                            <Form_SignaturePad height={250} onSave={handleSignatureSave} />
                        </div>
                    )}

                    <div style={{ padding: 20 }} data-html2canvas-ignore="true">
                        {(isclient && !isLocalSign) && (
                            <div>
                                <h2>Client Signature</h2>
                                {/* Reusable Signature Pad */}
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
                        {/* Lawyer Signature - Left */}
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

                        {/* Client Signature - Right */}
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

                    {/* Buttons (ALL ignored in PDF) */}
                    <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
                        {(!isclient && savedClientSignature && savedLawyerSignature) && (
                            <button
                                className="btn btn-sm btn-primary fw-bold"
                                onClick={handleUpdateLawyerSubmit}
                                style={{ width: "150px" }}
                                data-html2canvas-ignore="true"
                            >
                                Update Agreement
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
                                        Save Agreement
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-sm btn-primary fw-bold"
                                        onClick={handleUpdateLawyerSubmit}
                                        style={{ width: "150px" }}
                                        data-html2canvas-ignore="true"
                                    >
                                        Update Agreement
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
                                        Save Signature
                                    </button>
                                )}

                                {(!isclient && !savedClientSignature) && (
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












    // const renderHeadings = (list, setFn, isFixed = false) => {

    //     const addHeading = (index) => {
    //         if (!editMode) return;
    //         const updated = [...list];
    //         updated.splice(index + 1, 0, { title: "", points: [] });
    //         setFn(updated);
    //     };

    //     const deleteHeading = (index) => {
    //         if (!editMode) return;
    //         const updated = [...list];
    //         updated.splice(index, 1);
    //         setFn(updated);
    //     };

    //     const addPoint = (hIndex) => {
    //         if (!editMode) return;
    //         const updated = [...list];
    //         updated[hIndex].points.push({ text: "", subpoints: [] });
    //         setFn(updated);
    //     };

    //     const deletePoint = (hIndex, pIndex) => {
    //         if (!editMode) return;
    //         const updated = [...list];
    //         updated[hIndex].points.splice(pIndex, 1);
    //         setFn(updated);
    //     };

    //     return list?.map((heading, hIndex) => (
    //         <div key={hIndex} className="section border p-2 p-md-3 my-2 my-md-3 rounded bg-light">
    //             <div className="d-flex flex-wrap align-items-start mb-2">
    //                 <div className="d-flex me-2 mt-1 fw-bold">
    //                     {editMode && !savedClientSignature && (
    //                         <div className="ms-2 d-flex gap-1" style={{
    //                         }}>

    //                             <div
    //                                 type=""
    //                                 style={{
    //                                     color: 'green', fontSize: 16, borderRadius: '5px',
    //                                     boxShadow: '0px 4px 4px rgba(4, 2, 2, 0.2)'
    //                                 }}
    //                                 onClick={() => addHeading(hIndex)}
    //                             >
    //                                 <BsPlus />
    //                             </div>
    //                             <div
    //                                 type=""
    //                                 style={{
    //                                     color: 'red', fontSize: 16, borderRadius: '5px',
    //                                     boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)'
    //                                 }}
    //                                 onClick={() => deleteHeading(hIndex)}
    //                             >
    //                                 <BsDash />
    //                             </div>

    //                         </div>
    //                     )}
    //                     {isFixed ? hIndex + 1 : hIndex + 11}
    //                 </div>

    //                 <div className="flex-grow-1">
    //                     {editMode && !savedClientSignature ? (
    //                         <p
    //                             ref={(el) => {
    //                                 if (el && !el.innerHTML.trim()) {
    //                                     el.innerHTML = heading.title || '\u00A0';
    //                                 }
    //                             }}
    //                             contentEditable
    //                             suppressContentEditableWarning
    //                             onInput={(e) => {
    //                                 const html = e.currentTarget.innerHTML;
    //                                 const updated = [...list];
    //                                 updated[hIndex].title = html;
    //                                 setFn(updated);
    //                             }}
    //                             onKeyDown={(e) => {
    //                                 // Ctrl+B for bold
    //                                 if (e.ctrlKey && e.key.toLowerCase() === 'b') {
    //                                     e.preventDefault();
    //                                     document.execCommand('bold');
    //                                 }

    //                                 // Tab key for 8 spaces
    //                                 if (e.key === 'Tab') {
    //                                     e.preventDefault();
    //                                     const selection = window.getSelection();
    //                                     if (!selection.rangeCount) return;

    //                                     const range = selection.getRangeAt(0);
    //                                     const tabSpaces = '\u00A0'.repeat(8); // 8 non-breaking spaces
    //                                     const spaceNode = document.createTextNode(tabSpaces);

    //                                     range.insertNode(spaceNode);
    //                                     // Move cursor after inserted spaces
    //                                     range.setStartAfter(spaceNode);
    //                                     range.setEndAfter(spaceNode);
    //                                     selection.removeAllRanges();
    //                                     selection.addRange(range);
    //                                 }
    //                             }}
    //                             onBlur={(e) => {
    //                                 if (!e.currentTarget.textContent.trim()) {
    //                                     e.currentTarget.innerHTML = '\u00A0';
    //                                 }
    //                             }}
    //                             style={{
    //                                 display: "inline-block",
    //                                 minHeight: "40px",
    //                                 width: "100%",
    //                                 outline: "none",
    //                                 background: "transparent",
    //                                 whiteSpace: "pre-wrap",
    //                                 wordBreak: "break-word",
    //                                 fontFamily: "inherit",
    //                                 fontSize: "inherit",
    //                                 fontWeight: "bold",
    //                                 padding: "4px 6px",
    //                                 border: "1px solid #ccc",
    //                                 borderRadius: "4px",
    //                                 boxSizing: "border-box",
    //                             }}
    //                         />

    //                     ) : (
    //                         <div
    //                             className="form-control bg-white p-3 fw-bold"
    //                             style={{ whiteSpace: 'pre-wrap' }}
    //                         >

    //                             <React.Fragment key={hIndex}>
    //                                 <span>{heading.label || ""}</span>
    //                                 <span dangerouslySetInnerHTML={{ __html: heading.title || "" }} />
    //                             </React.Fragment>

    //                         </div>

    //                     )}
    //                 </div>


    //             </div>

    //             {/* POINTS */}
    //             <ul className="list-unstyled ps-2 ps-md-3">
    //                 {heading.points?.map((point, pIndex) => (
    //                     <li key={pIndex}>
    //                         <div className="d-flex flex-wrap align-items-center mb-2">
    //                             {editMode && !savedClientSignature ? (
    //                                 <p
    //                                     ref={(el) => {
    //                                         if (el && !el.innerHTML.trim()) {
    //                                             el.innerHTML = point.text || '\u00A0';
    //                                         }
    //                                     }}
    //                                     contentEditable
    //                                     suppressContentEditableWarning
    //                                     onInput={(e) => {
    //                                         const html = e.currentTarget.innerHTML;
    //                                         const updated = [...list];
    //                                         updated[hIndex].points[pIndex].text = html;
    //                                         setFn(updated);
    //                                     }}
    //                                     onKeyDown={(e) => {
    //                                         // Ctrl+B for bold
    //                                         if (e.ctrlKey && e.key.toLowerCase() === 'b') {
    //                                             e.preventDefault();
    //                                             document.execCommand('bold');
    //                                         }

    //                                         // Tab key for 8 spaces
    //                                         if (e.key === 'Tab') {
    //                                             e.preventDefault();
    //                                             const selection = window.getSelection();
    //                                             if (!selection.rangeCount) return;

    //                                             const range = selection.getRangeAt(0);
    //                                             const tabSpaces = '\u00A0'.repeat(8); // 8 non-breaking spaces
    //                                             const spaceNode = document.createTextNode(tabSpaces);

    //                                             range.insertNode(spaceNode);
    //                                             // Move cursor after inserted spaces
    //                                             range.setStartAfter(spaceNode);
    //                                             range.setEndAfter(spaceNode);
    //                                             selection.removeAllRanges();
    //                                             selection.addRange(range);
    //                                         }
    //                                     }}
    //                                     onBlur={(e) => {
    //                                         if (!e.currentTarget.textContent.trim()) {
    //                                             e.currentTarget.innerHTML = '\u00A0';
    //                                         }
    //                                     }}
    //                                     style={{
    //                                         display: "inline-block",
    //                                         minHeight: "40px",
    //                                         width: "100%",
    //                                         outline: "none",
    //                                         background: "transparent",
    //                                         whiteSpace: "pre-wrap",
    //                                         wordBreak: "break-word",
    //                                         fontFamily: "inherit",
    //                                         fontSize: "inherit",
    //                                         padding: "4px 6px",
    //                                         border: "1px solid #ddd",
    //                                         borderRadius: "4px",
    //                                         boxSizing: "border-box",
    //                                     }}
    //                                 />

    //                             ) : (
    //                                 <div
    //                                     className="form-control bg-white p-3"
    //                                     style={{ whiteSpace: 'pre-wrap' }}
    //                                 >
    //                                     {list[hIndex]?.points?.map((point, pIndex) => (
    //                                         <React.Fragment key={pIndex}>
    //                                             <span>{point.label || ""}</span>
    //                                             <span dangerouslySetInnerHTML={{ __html: point.text || "" }} />
    //                                         </React.Fragment>
    //                                     ))}
    //                                 </div>

    //                             )}

    //                             {editMode && !savedClientSignature && (
    //                                 <>
    //                                     <div
    //                                         type=""
    //                                         style={{
    //                                             color: 'green', fontSize: 16, borderRadius: '5px',
    //                                             boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)'
    //                                         }}
    //                                         onClick={() => addPoint(hIndex)}
    //                                     >
    //                                         <BsPlus />
    //                                     </div>
    //                                     <div
    //                                         type=""
    //                                         style={{
    //                                             color: 'red', fontSize: 16, borderRadius: '5px',
    //                                             boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)'
    //                                         }}
    //                                         onClick={() => deletePoint(hIndex, pIndex)}
    //                                     >
    //                                         <BsDash />
    //                                     </div>
    //                                 </>
    //                             )}
    //                         </div>
    //                     </li>
    //                 ))}

    //                 {editMode && !savedClientSignature && (
    //                     <li>
    //                         <button
    //                             type="button"
    //                             className="btn btn-outline-primary btn-sm"
    //                             onClick={() => addPoint(hIndex)}
    //                         >
    //                             + Add Point
    //                         </button>
    //                     </li>
    //                 )}
    //             </ul>
    //         </div>
    //     ));
    // };

    // return (
    //     <div className="card w-100" style={{ maxHeight: '87vh', overflowY: 'auto' }}>
    //         <div className="d-flex justify-content-end mb-3">
    //             <button
    //                 className="btn btn-primary d-flex align-items-center"
    //                 onClick={() => { }}
    //                 style={{ padding: '8px 16px' }}
    //             >
    //                 <BsDownload className="me-2" />
    //                 Download PDF
    //             </button>
    //         </div>

    //         {(!isclient || isFormFilled) ?
    //             (
    //                 <div className="container mt-2 mt-md-4">
    //                     {/* Header */}
    //                     <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
    //                         <img src="logo.png" alt="Logo" className="me-2 me-md-3 mb-2 mb-md-0" style={{ height: '50px' }} />
    //                         <h1 className="mb-0 h4 h3-md fw-bold text-break">Legal Fee Agreement</h1>
    //                     </div>


    //                     <div className="card p-2 p-md-4 shadow-sm mb-4">
    //                         <label className="form-label fw-bold fs-5 text-break">Agreement</label>
    //                         {editMode && !isclient && !savedClientSignature ? (
    //                             <div
    //                                 className="form-control p-3"
    //                                 style={{ minHeight: '300px', whiteSpace: 'pre-wrap' }}
    //                             >
    //                                 {agreement?.fixedParts?.map((part, index) => (
    //                                     <React.Fragment key={index}>
    //                                         <span>{part}</span>
    //                                         {index < agreement.editableValues.length && (

    //                                             <p
    //                                                 ref={(el) => {
    //                                                     if (el && !el.innerHTML.trim()) {
    //                                                         el.innerHTML = agreement.editableValues[index] || '\u00A0';
    //                                                     }
    //                                                 }}
    //                                                 contentEditable
    //                                                 suppressContentEditableWarning
    //                                                 onInput={(e) => {
    //                                                     const html = e.currentTarget.innerHTML;
    //                                                     handleEditableChange(index, html);
    //                                                 }}
    //                                                 onKeyDown={(e) => {
    //                                                     // Ctrl+B for bold
    //                                                     if (e.ctrlKey && e.key.toLowerCase() === 'b') {
    //                                                         e.preventDefault();
    //                                                         document.execCommand('bold');
    //                                                     }

    //                                                     // Tab key for 8 spaces
    //                                                     if (e.key === 'Tab') {
    //                                                         e.preventDefault();
    //                                                         const selection = window.getSelection();
    //                                                         if (!selection.rangeCount) return;

    //                                                         const range = selection.getRangeAt(0);
    //                                                         const tabSpaces = '\u00A0'.repeat(8); // 8 non-breaking spaces
    //                                                         const spaceNode = document.createTextNode(tabSpaces);

    //                                                         range.insertNode(spaceNode);
    //                                                         // Move cursor after inserted spaces
    //                                                         range.setStartAfter(spaceNode);
    //                                                         range.setEndAfter(spaceNode);
    //                                                         selection.removeAllRanges();
    //                                                         selection.addRange(range);
    //                                                     }
    //                                                 }}
    //                                                 onBlur={(e) => {
    //                                                     if (!e.currentTarget.textContent.trim()) {
    //                                                         e.currentTarget.innerHTML = '\u00A0';
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
    //                                                     textDecoration: "underline", // underline continues on wrap
    //                                                     textDecorationSkipInk: "none" // keeps underline from skipping descenders
    //                                                 }}
    //                                             />

    //                                         )}
    //                                     </React.Fragment>
    //                                 ))}
    //                             </div>
    //                         ) : (
    //                             <div
    //                                 className="form-control bg-white p-3"
    //                                 style={{ whiteSpace: 'pre-wrap', minHeight: '300px' }}
    //                             >
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
    //                     {renderHeadings(headings, setHeadings, false)}

    //                     {(isFormFilled && savedClientSignature && !savedSignature && !isclient) &&

    //                         <div style={{ padding: 20 }}>
    //                             <h2>Lawyer Signature</h2>

    //                             {/* Reusable Signature Pad */}
    //                             <Form_SignaturePad height={250} onSave={handleSignatureSave} />

    //                             {/* Preview the saved signature */}

    //                         </div>
    //                     }
    //                     {/* {(isFormFilled && !savedClientSignature ) && */}

    //                     <div style={{ padding: 20 }}>
    //                         {(isclient && !isLocalSign) &&
    //                             <div>
    //                                 <h2>Client Signature</h2>
    //                                 {/* Reusable Signature Pad */}
    //                                 <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
    //                             </div>
    //                         }
    //                     </div>
    //                     {/* } */}
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
    //                         {/* Lawyer Signature - Left */}
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

    //                         {/* Client Signature - Right */}
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
    //                     {/* Buttons */}

    //                     <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap">
    //                         {(!isclient && savedClientSignature && savedLawyerSignature) && (
    //                             <button className="btn btn-sm btn-primary fw-bold" onClick={handleUpdateLawyerSubmit} style={{ width: '150px' }}>
    //                                 Update Agreement
    //                             </button>
    //                         )
    //                         }
    //                         {editMode ? (
    //                             <>
    //                                 {(!isFormFilled && !savedClientSignature) ? (

    //                                     <button className="btn btn-sm btn-primary fw-bold" onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit} style={{ width: '150px' }}>
    //                                         Save Agreement
    //                                     </button>
    //                                 ) : (<button className="btn btn-sm btn-primary fw-bold" onClick={handleUpdateLawyerSubmit} style={{ width: '150px' }}>
    //                                     Update Agreement
    //                                 </button>)
    //                                 }

    //                             </>
    //                         ) :
    //                             <>
    //                                 {
    //                                     (isclient && !isLocalSign) &&
    //                                     <button className="btn btn-sm btn-primary fw-bold" onClick={handleUpdateLawyerSubmit} style={{ width: '150px' }}>
    //                                         Save Signature
    //                                     </button>
    //                                 }

    //                                 {(!isclient && !savedClientSignature) && (
    //                                     <button className="btn btn-sm btn-primary fw-bold" onClick={() => setEditMode(true)} style={{ width: '150px' }}>
    //                                         Edit Agreement
    //                                     </button>
    //                                 )
    //                                 }

    //                             </>
    //                         }
    //                     </div>

    //                 </div>
    //             )
    //             : (
    //                 <div className="text-center text-black py-5">
    //                     No LFA Form Available.
    //                 </div>
    //             )}
    //     </div >
    // );
};

export default LEA_Form;











