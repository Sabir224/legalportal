import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { screenChange } from "../../../../REDUX/sliece";
import SignatureCanvas from "react-signature-canvas";


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
            legalOpinion: false,
            caseStrategy: false,
            relatedDocs: false,
        },
        providerName: "",
        receiverName: "",
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


    return (
        <div>
            <div className="card shadow-sm mt-1" style={{ maxHeight: '86vh', overflowY: 'auto' }}>
                <div className="card-body">
                    {/* Header */}
                    <div className="mb-4 text-center">
                        <img src="/logo.png" alt="Legal Group Logo" className="mb-3" style={{ height: '40px' }} />
                        <h5 className="card-title text-danger">
                            <u>Form H (Handover)</u>
                        </h5>
                    </div>

                    <form>
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
                            <input type="datetime-local" name="handoverDateTime" className="form-control" value={formData.handoverDateTime} onChange={handleChange} />
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
                                            {/* <input
            type="checkbox"
            className="form-check-input me-2"
            name={item.name}
            checked={formData.checklist[item.name]}
            onChange={handleChange}
            id={item.name}
          /> */}
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
                                            <input
                                                type="file"
                                                className="form-control"
                                                name={`${item.name}File`}
                                                onChange={handleChange}
                                                style={{ maxWidth: "300px" }}
                                            />
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

                            <label className="form-label">E-Signature:</label>
                            <SignatureCanvas
                                penColor="black"
                                canvasProps={{ width: 300, height: 100, className: "signature-canvas border" }}
                                ref={providerSigRef}
                            />
                            <div className="mt-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleClearSignature("provider")}
                                >
                                    Clear Signature
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleSaveSignature("provider")}
                                >
                                    Save Signature
                                </button>
                            </div>

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

                            <label className="form-label">E-Signature:</label>
                            <SignatureCanvas
                                penColor="black"
                                canvasProps={{ width: 300, height: 100, className: "signature-canvas border" }}
                                ref={receiverSigRef}
                            />
                            <div className="mt-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => handleClearSignature("receiver")}
                                >
                                    Clear Signature
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleSaveSignature("receiver")}
                                >
                                    Save Signature
                                </button>
                            </div>

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
        </div>
    );
};

export default FormHandover;
