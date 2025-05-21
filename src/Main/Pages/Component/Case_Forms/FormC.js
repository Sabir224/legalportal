
import React, { useState, useEffect } from "react";

import backgroundImage from "../../../Pages/Images/bg.jpg";
import { ApiEndPoint } from "../utils/utlis";
import SuccessModal from "../../AlertModels/SuccessModal";


const ClientConsultationForm = ({ token }) => {
    const [fileName, setFileName] = useState(null);
    const [encryptedLink, setEncryptedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [showLinkGenerator, setShowLinkGenerator] = useState(true); // To control whether the link generator is shown or not

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");


    const handleGenerateLink = () => {
        const data = JSON.stringify({ token, timestamp: Date.now() });
        const encrypted = btoa(data);
        const link = `${window.location.origin}/client-consultation?data=${encodeURIComponent(encrypted)}`;
        setEncryptedLink(link);
        setCopied(false);
    };

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setShowSuccessModal(true);
    };



    const handleCopy = async () => {
        if (encryptedLink) {
            try {
                await navigator.clipboard.writeText(encryptedLink);
                setCopied(true);
            } catch (err) {
                console.error("Copy failed:", err);
            }
        }
    };

    // Check if URL contains the encrypted link (using query params)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('data')) {
            setShowLinkGenerator(false); // Hide link generator if opening from link
        }
    }, []);



    const [clientName, setClientName] = useState('');
    const [countryCode, setCountryCode] = useState('+92');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [contactAddress, setContactAddress] = useState('');
    const [individualOrCompany, setIndividualOrCompany] = useState('');

    // Extra Info
    const [companyName, setCompanyName] = useState('');
    const [occupation, setOccupation] = useState('');
    const [opponentDetails, setOpponentDetails] = useState('');
    const [legalService, setLegalService] = useState('Select');
    const [practiceArea, setPracticeArea] = useState('Select');
    const [serviceDetails, setServiceDetails] = useState('');
    const [desiredOutcome, setDesiredOutcome] = useState('');

    // File Upload - Multiple files
    const [files, setFiles] = useState([]);

    // Referred By
    const [referredBy, setReferredBy] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        }
    };

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const submitForm = async (formData) => {
        try {
            const response = await fetch(`${ApiEndPoint}createConsultation`, {
                method: 'POST',
                body: formData,
                // headers are automatically set by browser for FormData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Submission failed');
            }

            return data;
        } catch (error) {
            console.error('Submission error:', error);
            throw error;
        }
    };

    // Modify your handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Append all form fields
        formData.append('clientName', clientName);
        formData.append('phoneNumber', `${countryCode}${phoneNumber}`);
        formData.append('email', email);
        formData.append('contactAddress', contactAddress);
        formData.append('individualOrCompany', individualOrCompany);
        formData.append('companyName', companyName);
        formData.append('occupation', occupation);
        formData.append('opponentDetails', opponentDetails);
        formData.append('legalService', legalService);
        formData.append('practiceArea', practiceArea);
        formData.append('serviceDetails', serviceDetails);
        formData.append('desiredOutcome', desiredOutcome);
        formData.append('referredBy', referredBy);

        // Append each file
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const result = await submitForm(formData);
            console.log('Success:', result);
            // Show success message, redirect, etc.
            // alert('Form submitted successfully!');
            showSuccess("Form C is added ")
        } catch (error) {
            console.error('Error:', error);
            // Show error to user
            alert(`Error: ${error.message}`);
        }
    };


    return (
        <div
            style={{
                backgroundImage: showLinkGenerator ? "none" : `url(${backgroundImage})`, // Background image when link opens
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: showLinkGenerator ? "auto" : "100vh",
                display: showLinkGenerator ? "block" : "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="card shadow-sm mt-1" style={{
                maxHeight: '86vh', overflowY: 'auto',
                maxWidth: showLinkGenerator ? "auto" : "90vw",

            }}>
                <div className="card-body">
                    {/* Header */}
                    <div className="mb-4">
                        <img src="/logo.png" alt="Legal Group Logo" className="mb-3" style={{ height: '40px' }} />
                        <h4 className="card-title mb-2">Client Consultation Brief</h4>
                        <p className="text-muted small">
                            Greetings from AWS Legal Group!<br />
                            Thank you for consulting us regarding your legal matter. To ensure we provide the highest quality service, please complete this form with detailed information regarding the legal services you require and include all relevant documents. Your information will be treated with strict confidentiality and used solely to understand your needs and assist you accordingly.
                        </p>
                    </div>


                    {/* Encrypted Link Generator */}
                    {showLinkGenerator && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleGenerateLink}
                            >
                                Generate Form Link
                            </button>

                            {encryptedLink && (
                                <div className="d-flex align-items-center ms-3" style={{ flex: 1 }}>
                                    <div
                                        className="btn btn-primary mb-0 text-truncate"
                                        style={{
                                            cursor: 'pointer',
                                            maxWidth: '60ch',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                        onClick={handleCopy}
                                        title={encryptedLink}
                                    >
                                        {encryptedLink}
                                    </div>
                                    <button
                                        className="btn btn-primary ms-2 mb-0"
                                        onClick={handleCopy}
                                        title={copied ? "Copied!" : "Copy Link"}
                                        style={{
                                            display: "flex",
                                            maxWidth: '10ch',
                                            alignItems: "center",
                                            justifyContent: "center",
                                            // padding: "0.375rem 0.75rem", // Same padding as "Generate Form Link" button
                                        }}
                                    >
                                        <i
                                            className={`fas ${copied ? "fa-check-circle" : "fa-copy"}`}
                                            style={{ fontSize: "1.2rem" }}
                                        ></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Form Start */}
                    <form onSubmit={handleSubmit}>
                        {/* Personal Info */}
                        <div className="mb-3">
                            <label className="form-label">Client Name(s) <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                maxLength="255"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                required
                            />
                            <div className="form-text text-end">{clientName.length}/255</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select w-25"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                >
                                    <option>+92</option>
                                    <option>+1</option>
                                    <option>+44</option>
                                </select>
                                <input
                                    type="tel"
                                    className="form-control w-75"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email Address <span className="text-danger">*</span></label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contact Address</label>
                            <p className="text-muted small">
                                Please provide your complete correspondence address, including the country
                            </p>
                            <input
                                type="text"
                                className="form-control"
                                value={contactAddress}
                                onChange={(e) => setContactAddress(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Individual or Company</label>
                            <p className="text-muted small">
                                Please specify if the legal service will be provided to you in your personal capacity or on behalf of a company
                            </p>
                            <select
                                className="form-select"
                                value={individualOrCompany}
                                onChange={(e) => setIndividualOrCompany(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="individual">Individual</option>
                                <option value="company">Company</option>
                            </select>
                        </div>

                        {/* Extra Info */}
                        <div className="mb-3">
                            <label className="form-label">Company Name</label>
                            <p className="text-muted small">
                                Please provide us with the name of the company you are representing (if applicable)
                            </p>
                            <input
                                type="text"
                                className="form-control mt-1"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Client Occupation / Business Activity</label>
                            <input
                                type="text"
                                className="form-control"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Opponent Details</label>
                            <p className="text-muted small">
                                Please provide the name, contact details, contact address and nationality of the opposing party (if applicable)
                            </p>
                            <textarea
                                className="form-control mt-1"
                                rows="3"
                                maxLength="2000"
                                value={opponentDetails}
                                onChange={(e) => setOpponentDetails(e.target.value)}
                            ></textarea>
                            <div className="form-text text-end">{opponentDetails.length}/2000</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Legal Service Required</label>
                            <select
                                className="form-select"
                                value={legalService}
                                onChange={(e) => setLegalService(e.target.value)}
                            >
                                <option>Select</option>
                                <option>Consultation</option>
                                <option>Representation</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Practice Area</label>
                            <select
                                className="form-select"
                                value={practiceArea}
                                onChange={(e) => setPracticeArea(e.target.value)}
                            >
                                <option>Select</option>
                                <option>Civil Law</option>
                                <option>Corporate Law</option>
                                <option>Criminal Law</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Details on Service Required <span className="text-danger">*</span></label>
                            <p className="text-muted small">
                                Please provide as much information as possible on your situation, a history of relevant events, and the sort of legal service you require from us
                            </p>
                            <textarea
                                className="form-control mt-1"
                                rows="4"
                                maxLength="2000"
                                value={serviceDetails}
                                onChange={(e) => setServiceDetails(e.target.value)}
                                required
                            ></textarea>
                            <div className="form-text text-end">{serviceDetails.length}/2000</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Desired Outcome / Suggested Action <span className="text-danger">*</span></label>
                            <p className="text-muted small">
                                If there is a specific outcome or idea you have in mind, this will help steer our conversation
                            </p>
                            <textarea
                                className="form-control mt-1"
                                rows="4"
                                maxLength="2000"
                                value={desiredOutcome}
                                onChange={(e) => setDesiredOutcome(e.target.value)}
                                required
                            ></textarea>
                            <div className="form-text text-end">{desiredOutcome.length}/2000</div>
                        </div>

                        {/* Relevant Documents */}
                        <div className="mb-3">
                            <label className="form-label">Relevant Documents</label>
                            <p className="text-muted small">
                                Please provide us with copies of documents relevant to the presented legal matter.
                                You can upload multiple files (PDF, DOC, JPG, PNG).
                            </p>
                            <div className="border border-dashed p-4 text-center" style={{ borderRadius: '6px' }}>
                                <div
                                    className="card border-0 p-4 text-center"
                                    style={{ cursor: 'pointer', borderRadius: '6px', border: '2px dashed #ccc' }}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        className="form-control d-none"
                                        id="fileUpload"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                    <label htmlFor="fileUpload" className="d-block">
                                        <i className="bi bi-upload fs-2"></i><br />
                                        <span className="text-primary text-decoration-underline">
                                            Choose files to upload
                                        </span>{' '}
                                        or drag and drop here
                                    </label>
                                </div>

                                {/* Display uploaded files */}
                                {files.length > 0 && (
                                    <div className="mt-3">
                                        <strong>Selected Files:</strong>
                                        <ul className="list-group mt-2">
                                            {files.map((file, index) => (
                                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {file.name}
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => removeFile(index)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="text-muted mt-1">{files.length} file(s) selected</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Referred By */}
                        <div className="mb-4">
                            <label className="form-label">Referred By</label>
                            <p className="text-muted small">
                                Please let us know how you discovered AWS Legal Group
                            </p>
                            <input
                                type="text"
                                className="form-control mt-1"
                                value={referredBy}
                                onChange={(e) => setReferredBy(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-3 mb-2">Submit</button>
                    </form>



                    <SuccessModal
                        show={showSuccessModal}
                        handleClose={() => setShowSuccessModal(false)}
                        message={successMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClientConsultationForm;
