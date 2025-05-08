import React, { useState } from "react";

const ClientConsultationForm = ({ token }) => {


    const [fileName, setFileName] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name); // Update file name state
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
            setFileName(file.name); // Update file name on drop
        }
    };


    return (
        <div className="">
            <div className="card shadow-sm mt-1" style={{ maxHeight: '86vh', overflowY: 'auto' }}>
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
                            <label className="form-label">Desired Outcome / Suggested Action<span className="text-danger">*</span></label>
                            <p className="text-muted small">
                                If there is a specific outcome or idea you have in mind, this will help steer our conversation
                            </p>
                            <textarea className="form-control mt-1" rows="4" maxLength="2000"></textarea>
                            <div className="form-text text-end">0/2000</div>
                        </div>

                        {/* Relevant Documents */}
                        <div className="mb-3">
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
