import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ApiEndPoint } from '../utils/utlis';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../AlertModels/ConfirmModal';
import { useAlert } from '../../../../Component/AlertContext';
import Form_SignaturePad from './Form_Componets/SignaturePad';

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



     useEffect(() => {
       
      }, []);

    const [agreement, setAgreement] = useState({
        fixedParts: [
            'This Agreement ("Agreement") is entered into and shall become effective as of ',
            ', by and between:\n\n**',
            '**, with its principal place of business located at ',
            ', represented herein by **',
            '**, duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n**',
            '** a national of ',
            ', with their principal place of residence located ',
            ', holding Emirates ID Number: ',
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
        {
            title: '',
            points: [{ text: '', subpoints: [] }]
        }
    ]);

    const [savedSignature, setSavedSignature] = useState(null);
    const [savedClientSignature, setSavedClientSignature] = useState(null);

    // This will be called when user clicks "Pass to Parent" button inside SignaturePad
    const handleSignatureSave = (dataUrl) => {
        console.log("Lawyar Signature Base64:", dataUrl);
        setSavedSignature(dataUrl); // store it locally
        // You could also send it to your backend here
    };
    const handleClientSignatureSave = (dataUrl) => {
        console.log("Client Signature Base64:", dataUrl);
        setSavedClientSignature(dataUrl); // store it locally
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
                    fixedParts: agreement.fixedParts,
                    editableValues: agreement.editableValues
                })
            );

            // Fixed Headings JSON
            // formData.append("fixedHeadings", JSON.stringify(fixedHeadings));
            // Transform karna before append
            const formattedHeadings = fixedHeadings.map(h => ({
                title: h.title,
                points: h.points.map(p => ({
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
            const formattedHeadings = fixedHeadings.map(h => ({
                title: h.title,
                points: h.points.map(p => ({
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


                <div style={{ padding: 20 }}>
                    <h2>Lawyer Signature</h2>

                    {/* Reusable Signature Pad */}
                    <Form_SignaturePad height={250} onSave={handleSignatureSave} />

                    {/* Preview the saved signature */}
                    {savedSignature && (
                        <div style={{ marginTop: 20 }}>
                            <h4>Preview:</h4>
                            <img
                                src={savedSignature}
                                alt="Saved Signature"
                                style={{
                                    maxWidth: "120px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                    )}
                </div>


                <div style={{ padding: 20 }}>
                    <h2>Client Signature</h2>

                    {/* Reusable Signature Pad */}
                    <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />

                    {/* Preview the saved signature */}
                    {savedClientSignature && (
                        <div style={{ marginTop: 20 }}>
                            <h4>Preview:</h4>
                            <img
                                src={savedClientSignature}
                                alt="Saved Signature"
                                style={{
                                    maxWidth: "120px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                            />
                        </div>
                    )}
                </div>




                {/* Buttons */}
                <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap">
                    {editMode ? (
                        <>
                            <button className="btn btn-sm btn-primary fw-bold" onClick={token.Role !== "client" ? handleLawyerSubmit : handleClientSubmit} style={{ width: '150px' }}>
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











