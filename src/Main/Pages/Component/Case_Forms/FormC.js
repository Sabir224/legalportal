
import React, { useState, useEffect } from "react";

import backgroundImage from "../../../Pages/Images/bg.jpg";


const ClientConsultationForm = ({ token }) => {
    const [fileName, setFileName] = useState(null);
    const [encryptedLink, setEncryptedLink] = useState("");
    const [copied, setCopied] = useState(false);
    const [showLinkGenerator, setShowLinkGenerator] = useState(true); // To control whether the link generator is shown or not

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleGenerateLink = () => {
        const data = JSON.stringify({ token, timestamp: Date.now() });
        const encrypted = btoa(data);
        const link = `${window.location.origin}/client-consultation?data=${encodeURIComponent(encrypted)}`;
        setEncryptedLink(link);
        setCopied(false);
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
                    <form>
                        {/* Personal Info */}
                        <div className="mb-3">
                            <label className="form-label">Client Name(s) <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" maxLength="255" />
                            <div className="form-text text-end">0/255</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                            <div className="d-flex gap-2">
                                <select className="form-select w-25">
                                    <option>+92</option>
                                    <option>+1</option>
                                    <option>+44</option>
                                </select>
                                <input type="tel" className="form-control w-75" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email Address <span className="text-danger">*</span></label>
                            <input type="email" className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contact Address</label>
                            <p className="text-muted small">
                                Please provide your complete correspondence address, including the country
                            </p>
                            <input type="text" className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Individual or Company</label>
                            <p className="text-muted small">
                                Please specify if the legal service will be provided to you in your personal capacity or on behalf of a company
                            </p>
                            <select className="form-select">
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
                            <input type="text" className="form-control mt-1" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Client Occupation / Business Activity</label>
                            <input type="text" className="form-control" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Opponent Details</label>
                            <p className="text-muted small">
                                Please provide the name, contact details, contact address and nationality of the opposing party (if applicable)
                            </p>
                            <textarea className="form-control mt-1" rows="3" maxLength="2000"></textarea>
                            <div className="form-text text-end">0/2000</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Legal Service Required</label>
                            <select className="form-select">
                                <option>Select</option>
                                <option>Consultation</option>
                                <option>Representation</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Practice Area</label>
                            <select className="form-select">
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
                            <textarea className="form-control mt-1" rows="4" maxLength="2000"></textarea>
                            <div className="form-text text-end">0/2000</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Desired Outcome / Suggested Action <span className="text-danger">*</span></label>
                            <p className="text-muted small">
                                If there is a specific outcome or idea you have in mind, this will help steer our conversation
                            </p>
                            <textarea className="form-control mt-1" rows="4" maxLength="2000"></textarea>
                            <div className="form-text text-end">0/2000</div>
                        </div>

                        {/* Relevant Documents */}
                        <div className="mb-3">
                            <label className="form-label">Relevant Documents</label>
                            <p className="text-muted small">
                                Please provide us with a copy of the documents relevant to the presented legal matter. These documents will be reviewed along with the provided information.
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
                                    />
                                    <label htmlFor="fileUpload" className="d-block">
                                        <i className="bi bi-upload fs-2"></i><br />
                                        <span className="text-primary text-decoration-underline">
                                            Choose a file to upload
                                        </span>{' '}
                                        or drag and drop here
                                    </label>
                                    {fileName && (
                                        <div className="mt-3">
                                            <strong>Selected File:</strong> {fileName}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Referred By */}
                        <div className="mb-4">
                            <label className="form-label">Referred By</label>
                            <p className="text-muted small">
                                Please let us know how you discovered AWS Legal Group
                            </p>
                            <input type="text" className="form-control mt-1" />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-3 mb-2">Submit</button>
                    </form>


                </div>
            </div>
        </div>
    );
};

export default ClientConsultationForm;
