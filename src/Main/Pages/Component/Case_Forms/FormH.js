import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { screenChange } from "../../../../REDUX/sliece";
import SignatureCanvas from "react-signature-canvas";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { ApiEndPoint } from "../utils/utlis";


const FormHandover = ({ token }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        clientName: "",
        caseNumber: "",
        handoverDateTime: "",
        checklist: {
            cForm: false,
            lForm: false,
            lfa: false,
            poa: false,
        },
        legalOpinion: "",
        caseStrategy: "",
        relatedDocs: [],
        providerName: "",
        providerSignature: "",
        receiverName: "",
        receiverSignature: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name in formData.checklist) {
            setFormData((prev) => ({
                ...prev,
                checklist: {
                    ...prev.checklist,
                    [name]: checked,
                },
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };



    const providerSigRef = useRef();
    const receiverSigRef = useRef();



    const handleClearSignature = (type) => {
        if (type === "provider") {
            providerSigRef.current.clear();
            setFormData({ ...formData, providerSignature: "" });
        } else {
            receiverSigRef.current.clear();
            setFormData({ ...formData, receiverSignature: "" });
        }
    };

    const handleSaveSignature = (type) => {
        const sigData = type === "provider"
            ? providerSigRef.current.toDataURL()
            : receiverSigRef.current.toDataURL();

        if (type === "provider") {
            setFormData({ ...formData, providerSignature: sigData });
        } else {
            setFormData({ ...formData, receiverSignature: sigData });
        }
    };



    const handleSignatureImageUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    [`${type}Signature`]: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleMultipleFilesChange = (e, fieldName) => {
        const newFiles = Array.from(e.target.files);
        setFormData((prev) => {
            const existing = prev[`${fieldName}Files`] || [];
            const combined = [...existing, ...newFiles].slice(0, 5);
            return {
                ...prev,
                [`${fieldName}Files`]: combined,
            };
        });
        e.target.value = ""; // Reset input
    };

    const handleDropFiles = (e, fieldName) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFormData((prev) => {
            const existing = prev[`${fieldName}Files`] || [];
            const combined = [...existing, ...droppedFiles].slice(0, 5);
            return {
                ...prev,
                [`${fieldName}Files`]: combined,
            };
        });
    };

    const handleRemoveFile = (fieldName, indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            [`${fieldName}Files`]: prev[`${fieldName}Files`].filter((_, i) => i !== indexToRemove),
        }));
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            console.log("form data", formData)
            // Append text fields
            form.append("clientName", formData.clientName);
            form.append("caseNumber", formData.caseNumber);
            form.append("handoverDateTime", formData.handoverDateTime);
            form.append("providerName", formData.providerName);
            form.append("receiverName", formData.receiverName);
            form.append("legalOpinionText", formData.checklist.legalOpinionText || '');
            form.append("caseStrategyText", formData.checklist.caseStrategyText || '');

            // Checklist items
            form.append("checklist[cForm]", formData.checklist.cForm ? "Yes" : "No");
            form.append("checklist[lForm]", formData.checklist.lForm ? "Yes" : "No");
            form.append("checklist[lfa]", formData.checklist.lfa ? "Yes" : "No");
            form.append("checklist[poa]", formData.checklist.poa ? "Yes" : "No");

            // Related document files
            (formData.relatedDocsFiles || []).forEach(file => {
                form.append("relatedDocsFiles", file);
            });

            // Signature images
            if (formData.providerSignatureFile) {
                form.append("providerSignature", formData.providerSignatureFile);
            }
            if (formData.receiverSignatureFile) {
                form.append("receiverSignature", formData.receiverSignatureFile);
            }

            // Send form data
            const res = await axios.post(`${ApiEndPoint}createFormH`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Form submitted successfully!");
            console.log(res.data);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Submission failed. Check console for details.");
        }
    };


    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>

                <div className="card shadow-sm mt-1" style={{ maxHeight: '86vh', overflowY: 'auto' }}>
                    <div className="card-body">
                        {/* Header */}
                        <div className="mb-4 text-center">
                            <img src="/logo.png" alt="Legal Group Logo" className="mb-3" style={{ height: '40px' }} />
                            <h5 className="card-title text-danger">
                                <u>Form H (Handover)</u>
                            </h5>
                        </div>

                        {/* <form> */}
                        <form onSubmit={handleSubmit}>

                            {/* Client Info */}
                            <div className="mb-3">
                                <label className="form-label">Client Name:</label>
                                <input type="text" name="clientName" className="form-control" value={formData.clientName} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Case #:</label>
                                <input type="text" name="caseNumber" className="form-control" value={formData.caseNumber} onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Handover Date/ Time:</label>
                                <DatePicker
                                    value={formData.handoverDateTime ? new Date(formData.handoverDateTime) : null}
                                    onChange={(date) =>
                                        handleChange({
                                            target: {
                                                name: "handoverDateTime",
                                                value: date ? date.toISOString() : "",
                                            },
                                        })
                                    }
                                />
                            </div>


                            {/* Checklist */}
                            {/* Checklist */}
                            <div className="mb-4">
                                <h6 className="text-danger fw-bold">Check List</h6>

                                {/* Column layout for first 4 items */}
                                <div className="d-flex flex-column gap-2">
                                    {[
                                        { label: "The Filled-out C Form", name: "cForm", formName: "Form C" },
                                        { label: "The Filled-out L Form – MOM Form", name: "lForm", formName: "Form L" },
                                        { label: "The signed and stamped LFA", name: "lfa", formName: "LFA" },
                                        { label: "The POA", name: "poa", formName: "POA" },
                                    ].map((item) => (
                                        <div className="form-check d-flex align-items-center" key={item.name}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-2"
                                                name={item.name}
                                                checked={formData.checklist[item.name]}
                                                onChange={handleChange}
                                                id={item.name}
                                            />
                                            <label className="form-check-label me-2" htmlFor={item.name}>
                                                {item.label}
                                            </label>
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 text-decoration-underline text-primary"
                                                onClick={() => dispatch(screenChange(16))}
                                                style={{ fontSize: "0.9rem" }}
                                            >
                                                Go to {item.formName}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Last 3 items: with textarea/file and character counter */}
                                {[
                                    { label: "Written Legal Opinion", name: "legalOpinion" },
                                    { label: "The Case Strategy", name: "caseStrategy" },
                                    { label: "The Related documents", name: "relatedDocs" },
                                ].map((item) => {
                                    const isTextArea = ["legalOpinion", "caseStrategy"].includes(item.name);
                                    const textValue = formData.checklist[`${item.name}Text`] || '';
                                    const maxLength = 2000;

                                    return (
                                        <div className="form-check d-flex flex-column align-items-start mt-3" key={item.name}>
                                            <div className="d-flex align-items-center mb-2">
                                                <label className="form-check-label me-3 mb-0" htmlFor={item.name}>
                                                    {item.label}
                                                </label>
                                            </div>

                                            {isTextArea ? (
                                                <>
                                                    <textarea
                                                        className="form-control"
                                                        name={`${item.name}Text`}
                                                        maxLength={maxLength}
                                                        value={textValue}
                                                        onChange={handleChange}
                                                        rows={4}
                                                        placeholder="Enter details"
                                                        style={{ maxWidth: "100%" }}
                                                    />
                                                    <div className="text-muted mt-1" style={{ fontSize: "0.85rem" }}>
                                                        {textValue.length}/{maxLength} characters
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div
                                                        className="border border-dashed p-4 text-center w-100"
                                                        style={{ borderRadius: "6px" }}
                                                        onDragOver={(e) => e.preventDefault()}
                                                        onDrop={(e) => handleDropFiles(e, item.name)}
                                                    >
                                                        <div
                                                            className="card border-0 p-4 text-center"
                                                            style={{
                                                                cursor: "pointer",
                                                                borderRadius: "6px",
                                                                border: "2px dashed #ccc",
                                                            }}
                                                            onClick={() => document.getElementById(`${item.name}Input`).click()}
                                                        >
                                                            <input
                                                                type="file"
                                                                className="form-control d-none"
                                                                id={`${item.name}Input`}
                                                                onChange={(e) => handleMultipleFilesChange(e, item.name)}
                                                                multiple
                                                                accept=".pdf,.doc,.docx,.png,.jpg"
                                                                disabled={(formData[item.name + "Files"]?.length || 0) >= 5}
                                                            />
                                                            <label className={`d-block ${formData[item.name + "Files"]?.length >= 5 ? 'text-muted' : ''}`}>
                                                                <i className="bi bi-upload fs-2"></i><br />
                                                                <span className="text-primary text-decoration-underline">
                                                                    {formData[item.name + "Files"]?.length >= 5
                                                                        ? 'Maximum files selected'
                                                                        : 'Choose files to upload'}
                                                                </span>{" "}
                                                                {formData[item.name + "Files"]?.length >= 5 ? '' : 'or drag and drop here'}
                                                            </label>
                                                        </div>

                                                        {/* Display uploaded files */}
                                                        {formData[item.name + "Files"]?.length > 0 && (
                                                            <div className="mt-3">
                                                                <strong>Selected Files:</strong>
                                                                <ul className="list-group mt-2">
                                                                    {formData[item.name + "Files"].map((file, index) => (
                                                                        <li
                                                                            key={index}
                                                                            className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
                                                                        >
                                                                            <span className="text-break w-100">{file.name}</span>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                                                                onClick={() => handleRemoveFile(item.name, index)}
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                                <div className="text-muted mt-1">
                                                                    {formData[item.name + "Files"].length} file
                                                                    {formData[item.name + "Files"].length !== 1 && 's'} selected
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}

                            </div>



                            {/* Lawyers Info */}
                            <div className="mb-4">
                                <h6 className="text-danger fw-bold">The Lawyer Providing the CD File:</h6>

                                <label className="form-label">Name:</label>
                                <input
                                    type="text"
                                    name="providerName"
                                    className="form-control mb-2"
                                    value={formData.providerName}
                                    onChange={handleChange}
                                />

                                <label className="form-label">Signature Image:</label>



                                {/* <input
                                                                type="file"
                                                                className="form-control d-none"
                                                                id={`${item.name}Input`}
                                                                onChange={(e) => handleMultipleFilesChange(e, item.name)}
                                                                multiple
                                                                accept=".pdf,.doc,.docx,.png,.jpg"
                                                                disabled={(formData[item.name + "Files"]?.length || 0) >= 5}
                                                            /> */}

                                <input
                                    type="file"
                                    accept=".png,.jpg"
                                    className="form-control"
                                    onChange={(e) => handleSignatureImageUpload(e, "provider")}
                                />

                                {formData.providerSignature && (
                                    <div className="mt-2">
                                        <strong>Preview:</strong><br />
                                        <img
                                            src={formData.providerSignature}
                                            alt="Provider Signature"
                                            style={{ border: "1px solid #ccc", maxWidth: "300px" }}
                                        />
                                    </div>
                                )}
                            </div>


                            {/* Signature - Lawyer Receiving */}
                            <div className="mb-4">
                                <h6 className="text-danger fw-bold">The Lawyer Receiving the CD File:</h6>

                                <label className="form-label">Name:</label>
                                <input
                                    type="text"
                                    name="receiverName"
                                    className="form-control mb-2"
                                    value={formData.receiverName}
                                    onChange={handleChange}
                                />

                                <label className="form-label">Signature Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(e) => handleSignatureImageUpload(e, "receiver")}
                                />

                                {formData.receiverSignature && (
                                    <div className="mt-2">
                                        <strong>Preview:</strong><br />
                                        <img
                                            src={formData.receiverSignature}
                                            alt="Receiver Signature"
                                            style={{ border: "1px solid #ccc", maxWidth: "300px" }}
                                        />
                                    </div>
                                )}
                            </div>


                            {/* Note */}
                            <p className="text-danger small fw-bold">
                                Please make sure all the mentioned documents are included in the file before signing the Handover Form.
                            </p>

                            <button type="submit" className="btn btn-primary w-100 mt-3 mb-2">Submit</button>
                        </form>
                    </div>
                </div>
            </LocalizationProvider>
        </div>
    );
};

export default FormHandover;
