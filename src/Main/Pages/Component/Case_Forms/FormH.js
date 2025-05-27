import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { screenChange } from "../../../../REDUX/sliece";
import SignatureCanvas from "react-signature-canvas";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { ApiEndPoint } from "../utils/utlis";
import { useAlert } from "../../../../Component/AlertContext";


const FormHandover = ({ token }) => {
    const dispatch = useDispatch();
    const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);

    const [FormhOrFormCDetails, setFormhOrFormCDetails] = useState([]);
    const [isFilled, setIsFilled] = useState(false);
    // const [loading, setLoading] = useState(true);

    const [successMessage, setSuccessMessage] = useState("");
    const { showLoading, showSuccess, showError } = useAlert();
    const [formData, setFormData] = useState({
        clientName: "",
        caseNumber: reduxCaseInfo?.CaseNumber,
        handoverDateTime: "",
        checklist: {
            cForm: "",
            lForm: "",
            lfa: "",
            poa: "",
        },
        legalOpinion: "",
        caseStrategy: "",
        relatedDocs: [],
        // providerName: token.UserName,
        providerSignature: token.email,
        // receiverName: "",
        receiverSignature: "",
    });



    const fetchFormHData = async (caseId) => {
        try {
            const response = await axios.get(`${ApiEndPoint}/getFormHByCaseIdorFormC/${caseId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching Form H data:", error);
            throw error;
        }
    };
    useEffect(() => {

        const getData = async () => {

            try {
                const result = await fetchFormHData(reduxCaseInfo?._id);
                setFormhOrFormCDetails(result);

                // If Form H exists
                if (result?.form) {
                    const form = result.form;
                    setIsFilled(true)
                    setFormData({
                        clientName: form.clientName || "",
                        caseNumber: form.caseNumber || reduxCaseInfo?.CaseNumber || "",
                        handoverDateTime: form.handoverDateTime || "",
                        checklist: {
                            cForm: form.checklist?.cForm || "",
                            lForm: form.checklist?.lForm || "",
                            lfa: form.checklist?.lfa || "",
                            poa: form.checklist?.poa || "",
                        },
                        legalOpinion: form.legalOpinionText || "",
                        caseStrategy: form.caseStrategyText || "",
                        relatedDocs: form.relatedDocsFiles || [],
                        providerSignature: form.providerSignature,
                        receiverSignature: form.receiverSignature,
                    });
                }
                // If Form H does not exist, fallback to initial blank data
                else if (result?.case && result?.client) {
                    setFormData({
                        clientName: result.client?.UserName || "",
                        caseNumber: result.case?.CaseNumber || reduxCaseInfo?.CaseNumber || "",
                        handoverDateTime: "",
                        checklist: {
                            cForm: "",
                            lForm: "",
                            lfa: "",
                            poa: "",
                        },
                        legalOpinion: "",
                        caseStrategy: "",
                        relatedDocs: [],
                        providerSignature: token.email,
                        receiverSignature: "",
                    });
                }

                console.log("Form H API Response: ", result);
            } catch (err) {
                console.error("Error loading Form H or related data:", err);
            } finally {
                // setLoading(false);
            }
        };

        if (reduxCaseInfo) {
            getData();
        }
    }, [reduxCaseInfo]);



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


    const handleMultipleFilesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            relatedDocs: [...prev.relatedDocs, ...newFiles].slice(0, 5), // max 5
        }));
    };

    const handleDropFiles = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFormData((prev) => ({
            ...prev,
            relatedDocs: [...prev.relatedDocs, ...droppedFiles].slice(0, 5),
        }));
    };

    const handleRemoveFile = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            relatedDocs: prev.relatedDocs.filter((_, idx) => idx !== indexToRemove),
        }));
    };




    const handleSubmit = async (e) => {
        showLoading();
        e.preventDefault();
        try {
            const form = new FormData();
            console.log("form data", formData)
            // Append text fields
            form.append("clientName", formData.clientName);
            form.append("caseNumber", reduxCaseInfo?._id);
            form.append("handoverDateTime", formData.handoverDateTime);
            form.append("providerName", formData.providerName);
            form.append("receiverName", formData.receiverName);
            form.append("legalOpinionText", formData.legalOpinion || '');
            form.append("caseStrategyText", formData.caseStrategy || '');
            form.append("checklist[cForm]", formData.checklist.cForm);
            form.append("checklist[lForm]", formData.checklist.lForm);
            form.append("checklist[lfa]", formData.checklist.lfa);
            form.append("checklist[poa]", formData.checklist.poa);
            // Related document files
            (formData.relatedDocs || []).forEach(file => {
                form.append("relatedDocsFiles", file);
            });
            console.log("check list form c", formData.checklist.cForm)
            form.append("providerSignature", formData.providerSignature);
            form.append("receiverSignature", formData.receiverSignature);


            console.log("providerSignature", formData.providerSignature)

            // Send form data
            const res = await axios.post(`${ApiEndPoint}createFormH`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });


            showSuccess("Form submitted successfully!");
            fetchFormHData()
            console.log(res.data);
        } catch (error) {
            if (error.response) {
                showError("Error submitting the form.", error.response);
            } else {
                showError("Network or server error:", error.message);
            }
        }
    };




    const fetchSignedUrl = async (filePath) => {
        try {
            console.log(filePath)
            const response = await fetch(`${ApiEndPoint}/downloadFileByUrl/${encodeURIComponent(filePath)}`);
            const data = await response.json();

            console.log("data=", data)
            if (response.ok) {
                window.open(data.url, '_blank'); // <-- Open in new tab
                // return data.signedUrl;
                return data.url;
            } else {
                throw new Error(data.error || "Unknown error");
            }
        } catch (err) {
            console.error("Error fetching signed URL:", err);
            return null;
        }
    };



    const isReadOnly = !!formData?.checklist;

    function getCaseNumberById(id) {
        const match = (FormhOrFormCDetails?.formC || []).find(form => form._id === id);
        return match?.caseNumber || "N/A";
    }


    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>


                {!isFilled ? (
                    <div className="card shadow-sm mt-1" style={{ maxHeight: '86vh', overflowY: 'auto' }}>
                        <div className="card-body">
                            <div className="mb-4 text-center">
                                <img src="/logo.png" alt="Legal Group Logo" className="mb-3" style={{ height: '40px' }} />
                                <h5 className="card-title text-danger">
                                    <u>Form H (Handover)</u>
                                </h5>
                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label className="form-label">Client Name:</label>
                                    <input type="text" name="clientName" className="form-control" value={formData.clientName} disabled={true} onChange={handleChange} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Case #:</label>
                                    <input type="text" name="caseNumber" className="form-control" value={formData.caseNumber} disabled={true} onChange={handleChange} />
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
                                            <div className="form-check d-flex align-items-center flex-wrap gap-2" key={item.name}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                    name={item.name}
                                                    checked={!!formData.checklist[item.name]} // ✅ Check if value (e.g., _id for cForm) exists
                                                    onChange={(e) => {
                                                        if (item.name !== "cForm") {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                checklist: {
                                                                    ...prev.checklist,
                                                                    [item.name]: e.target.checked,
                                                                },
                                                            }));
                                                        }
                                                    }}
                                                    id={item.name}
                                                    disabled={item.name === "cForm"} // ✅ Disable manual toggle for Form C
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

                                                {/* ✅ Form C caseNumber dropdown that sets _id */}
                                                {item.name === "cForm" && (
                                                    <select
                                                        className="form-select form-select-sm w-auto"
                                                        value={formData.checklist.cForm || ""}
                                                        onChange={(e) => {
                                                            const selectedId = e.target.value;
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                checklist: {
                                                                    ...prev.checklist,
                                                                    cForm: selectedId, // ✅ Store _id in checklist.cForm
                                                                },
                                                            }));
                                                        }}
                                                    >
                                                        <option value="">Select Case Number</option>
                                                        {(FormhOrFormCDetails?.formC || [])
                                                            .filter((form) => form?.caseNumber?.trim())
                                                            .map((form) => (
                                                                <option key={form._id} value={form._id}>
                                                                    {form.caseNumber}
                                                                </option>
                                                            ))}
                                                    </select>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
                                                            name={item.name} // 👈 changed from `${item.name}Text`
                                                            maxLength={maxLength}
                                                            value={formData[item.name]} // 👈 updated
                                                            onChange={handleChange}
                                                            rows={4}
                                                            placeholder="Enter details"
                                                            style={{ maxWidth: "100%" }}
                                                        />
                                                        <div className="text-muted mt-1" style={{ fontSize: "0.85rem" }}>
                                                            {formData[item.name]?.length || 0}/{maxLength} characters
                                                        </div>

                                                    </>
                                                ) : (
                                                    <>
                                                        <div
                                                            className="border border-dashed p-4 text-center w-100"
                                                            style={{ borderRadius: "6px" }}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onDrop={(e) => handleDropFiles(e)}
                                                        >
                                                            <div
                                                                className="card border-0 p-4 text-center"
                                                                style={{
                                                                    cursor: "pointer",
                                                                    borderRadius: "6px",
                                                                    border: "2px dashed #ccc",
                                                                }}
                                                                onClick={() => document.getElementById(`relatedDocsInput`).click()}
                                                            >
                                                                <input
                                                                    type="file"
                                                                    className="form-control d-none"
                                                                    id="relatedDocsInput"
                                                                    onChange={handleMultipleFilesChange}
                                                                    multiple
                                                                    accept=".pdf,.doc,.docx,.png,.jpg"
                                                                    disabled={formData.relatedDocs.length >= 5}
                                                                />
                                                                <label className={`d-block ${formData.relatedDocs.length >= 5 ? 'text-muted' : ''}`}>
                                                                    <i className="bi bi-upload fs-2"></i><br />
                                                                    <span className="text-primary text-decoration-underline">
                                                                        {formData.relatedDocs.length >= 5
                                                                            ? 'Maximum files selected'
                                                                            : 'Choose files to upload'}
                                                                    </span>{" "}
                                                                    {formData.relatedDocs.length >= 5 ? '' : 'or drag and drop here'}
                                                                </label>
                                                            </div>

                                                            {/* Display uploaded files */}
                                                            {formData.relatedDocs.length > 0 && (
                                                                <div className="mt-3">
                                                                    <strong>Selected Files:</strong>
                                                                    <ul className="list-group mt-2">
                                                                        {formData.relatedDocs.map((file, index) => (
                                                                            <li
                                                                                key={index}
                                                                                className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
                                                                            >
                                                                                <span className="text-break w-100">{file.name}</span>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                                                                    onClick={() => handleRemoveFile(index)}
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <div className="text-muted mt-1">
                                                                        {formData.relatedDocs.length} file
                                                                        {formData.relatedDocs.length !== 1 && 's'} selected
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

                                    <label className="form-label">Signature :</label>

                                    <input
                                        type="text"
                                        name="providerSignature"
                                        className="form-control"
                                        value={formData.providerSignature}
                                        onChange={handleChange}
                                        placeholder="Enter signature image URL"
                                        disabled={true}
                                    />
                                </div>


                                {/* Signature - Lawyer Receiving */}
                                <div className="mb-4">
                                    <h6 className="text-danger fw-bold">The Lawyer Receiving the CD File:</h6>
                                    <label className="form-label">Signature :</label>
                                    <select
                                        className="form-select"
                                        name="receiverSignature"
                                        value={formData.receiverSignature}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a lawyer</option>
                                        {FormhOrFormCDetails?.lawyers?.map((lawyer) => (
                                            <option key={lawyer._id} value={lawyer.Email}>
                                                {lawyer.UserName} ({lawyer.Role})
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {/* Note */}
                                <p className="text-danger small fw-bold">
                                    Please make sure all the mentioned documents are included in the file before signing the Handover Form.
                                </p>

                                <button type="submit" className="btn btn-primary w-100 mt-3 mb-2">Submit</button>
                            </form>
                        </div>
                    </div>
                )

                    :
                    (
                        <div className="card shadow-sm mt-1" style={{ maxHeight: '86vh', overflowY: 'auto' }}>
                            <div className="card-body">
                                <div className="mb-4 text-center">
                                    <img src="/logo.png" alt="Legal Group Logo" className="mb-3" style={{ height: '40px' }} />
                                    <h5 className="card-title text-danger">
                                        <u>Form H (Handover)</u>
                                    </h5>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Client Name:</label>
                                        <input type="text" name="clientName" className="form-control" value={formData.clientName} disabled />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Case #:</label>
                                        <input type="text" name="caseNumber" className="form-control" value={formData.caseNumber} disabled />
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
                                            disabled={isReadOnly}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <h6 className="text-danger fw-bold">Check List</h6>
                                        <div className="d-flex flex-column gap-2">
                                            {[
                                                { label: "The Filled-out C Form", name: "cForm", formName: "Form C" },
                                                { label: "The Filled-out L Form – MOM Form", name: "lForm", formName: "Form L" },
                                                { label: "The signed and stamped LFA", name: "lfa", formName: "LFA" },
                                                { label: "The POA", name: "poa", formName: "POA" },
                                            ].map((item) => (
                                                <div className="form-check d-flex align-items-center flex-wrap gap-2" key={item.name}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input me-2"
                                                        name={item.name}
                                                        checked={!!formData.checklist[item.name]}
                                                        disabled
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

                                                    {item.name === "cForm" && (
                                                        isReadOnly ? (
                                                            <div className="text-muted">{getCaseNumberById(formData.checklist.cForm)}</div>
                                                        ) : (
                                                            <select
                                                                className="form-select form-select-sm w-auto"
                                                                value={formData.checklist.cForm || ""}
                                                                onChange={(e) => {
                                                                    const selectedId = e.target.value;
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        checklist: {
                                                                            ...prev.checklist,
                                                                            cForm: selectedId,
                                                                        },
                                                                    }));
                                                                }}
                                                            >
                                                                <option value="">Select Case Number</option>
                                                                {(FormhOrFormCDetails?.formC || [])
                                                                    .filter((form) => form?.caseNumber?.trim())
                                                                    .map((form) => (
                                                                        <option key={form._id} value={form._id}>
                                                                            {form.caseNumber}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                        )
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {[
                                            { label: "Written Legal Opinion", name: "legalOpinion" },
                                            { label: "The Case Strategy", name: "caseStrategy" },
                                            { label: "The Related documents", name: "relatedDocs" },
                                        ].map((item) => {
                                            const isTextArea = ["legalOpinion", "caseStrategy"].includes(item.name);
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
                                                                name={item.name}
                                                                maxLength={maxLength}
                                                                value={formData[item.name]}
                                                                onChange={handleChange}
                                                                rows={4}
                                                                placeholder="Enter details"
                                                                style={{ maxWidth: "100%" }}
                                                                disabled={isReadOnly}
                                                            />
                                                            <div className="text-muted mt-1" style={{ fontSize: "0.85rem" }}>
                                                                {formData[item.name]?.length || 0}/{maxLength} characters
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {isReadOnly ? (
                                                                <div className="mt-2">
                                                                    <strong>Uploaded Files:</strong>
                                                                    <ul className="list-group mt-2">
                                                                        {formData.relatedDocs.map((file, index) => {
                                                                            const extension = file.fileName?.split('.').pop()?.toLowerCase();
                                                                            let icon = "bi-file-earmark";

                                                                            if (["pdf"].includes(extension)) icon = "bi-file-earmark-pdf text-danger";
                                                                            else if (["doc", "docx"].includes(extension)) icon = "bi-file-earmark-word text-primary";
                                                                            else if (["jpg", "jpeg", "png"].includes(extension)) icon = "bi-file-earmark-image text-success";
                                                                            else if (["xls", "xlsx"].includes(extension)) icon = "bi-file-earmark-excel text-success";

                                                                            return (
                                                                                <li key={index} className="list-group-item d-flex align-items-center gap-2">
                                                                                    <i className={`bi ${icon} fs-5`}></i>
                                                                                    <a href={{}} target="_blank" rel="noopener noreferrer" className="text-break">
                                                                                        {file.fileName}
                                                                                    </a>

                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                                                                        onClick={() => fetchSignedUrl(file.filePath)}
                                                                                    >
                                                                                        download
                                                                                    </button>
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </div>

                                                            ) : (
                                                                <div
                                                                    className="border border-dashed p-4 text-center w-100"
                                                                    style={{ borderRadius: "6px" }}
                                                                    onDragOver={(e) => e.preventDefault()}
                                                                    onDrop={(e) => handleDropFiles(e)}
                                                                >
                                                                    <div
                                                                        className="card border-0 p-4 text-center"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            borderRadius: "6px",
                                                                            border: "2px dashed #ccc",
                                                                        }}
                                                                        onClick={() => document.getElementById(`relatedDocsInput`).click()}
                                                                    >
                                                                        <input
                                                                            type="file"
                                                                            className="form-control d-none"
                                                                            id="relatedDocsInput"
                                                                            onChange={handleMultipleFilesChange}
                                                                            multiple
                                                                            accept=".pdf,.doc,.docx,.png,.jpg"
                                                                            disabled={formData.relatedDocs.length >= 5}
                                                                        />
                                                                        <label className={`d-block ${formData.relatedDocs.length >= 5 ? 'text-muted' : ''}`}>
                                                                            <i className="bi bi-upload fs-2"></i><br />
                                                                            <span className="text-primary text-decoration-underline">
                                                                                {formData.relatedDocs.length >= 5
                                                                                    ? 'Maximum files selected'
                                                                                    : 'Choose files to upload'}
                                                                            </span>{" "}
                                                                            {formData.relatedDocs.length >= 5 ? '' : 'or drag and drop here'}
                                                                        </label>
                                                                    </div>

                                                                    {formData.relatedDocs.length > 0 && (
                                                                        <div className="mt-3">
                                                                            <strong>Selected Files:</strong>
                                                                            <ul className="list-group mt-2">
                                                                                {formData.relatedDocs.map((file, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
                                                                                    >
                                                                                        <span className="text-break w-100">{file.name}</span>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                                                                            onClick={() => handleRemoveFile(index)}
                                                                                        >
                                                                                            Remove
                                                                                        </button>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                            <div className="text-muted mt-1">
                                                                                {formData.relatedDocs.length} file
                                                                                {formData.relatedDocs.length !== 1 && 's'} selected
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="mb-4">
                                        <h6 className="text-danger fw-bold">The Lawyer Providing the CD File:</h6>
                                        <label className="form-label">Signature :</label>
                                        <input
                                            type="text"
                                            name="providerSignature"
                                            className="form-control"
                                            value={formData.providerSignature}
                                            onChange={handleChange}
                                            placeholder="Enter signature image URL"
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <h6 className="text-danger fw-bold">The Lawyer Providing the CD File:</h6>
                                        <label className="form-label">Signature :</label>
                                        <input
                                            type="text"
                                            name="providerSignature"
                                            className="form-control"
                                            value={formData.receiverSignature}
                                            onChange={handleChange}
                                            placeholder="Enter signature image URL"
                                            disabled
                                        />
                                    </div>
                                    <p className="text-danger small fw-bold">
                                        Please make sure all the mentioned documents are included in the file before signing the Handover Form.
                                    </p>

                                    {!isReadOnly && (
                                        <button type="submit" className="btn btn-primary w-100 mt-3 mb-2">Submit</button>
                                    )}
                                </form>
                            </div>
                        </div>

                    )
                }
            </LocalizationProvider>
        </div>
    );
};

export default FormHandover;
