import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LFQ_ClientCaseEvaluationForm = () => {


    const [localCounsel, setLocalCounsel] = useState("no");
    const [caseType, setCaseType] = useState("Civil"); // default Civil
    const [jurisdiction, setJurisdiction] = useState("UAE Local Courts"); // default UAE Local Courts
    const [complexity, setComplexity] = useState("Low");
    const [sensitivity, setSensitivity] = useState("Routine/Low");




    const [seniorName, setSeniorName] = useState('');
    const [seniorHours, setSeniorHours] = useState('');
    const [associateName, setAssociateName] = useState('');
    const [associateHours, setAssociateHours] = useState('');

    const [ResourcelocalCounsel, setResourceLocalCounsel] = useState('');
    const [localCounselHours, setLocalCounselHours] = useState('');
    const [paralegal, setParalegal] = useState('');
    const [paralegalHours, setParalegalHours] = useState('');
    const [otherResources, setOtherResources] = useState('');
    const [otherResourceHours, setOtherResourceHours] = useState('');
    const [totalHours, setTotalHours] = useState('');

    const [clientCategory, setClientCategory] = useState([]);
    const [referredBy, setReferredBy] = useState('');
    const [retainerDetails, setRetainerDetails] = useState('');
    const [communication, setCommunication] = useState('');
    const [clientNotes, setClientNotes] = useState('');


    const [feeStructure, setFeeStructure] = useState('');
    const [hourlyRates, setHourlyRates] = useState('');
    const [fixedFee, setFixedFee] = useState('');
    const [otherFee, setOtherFee] = useState('');
    const [specialTerms, setSpecialTerms] = useState('');
    const [keyFactors, setKeyFactors] = useState('');

    const [preparedBy, setPreparedBy] = useState('');
    const [preparedBySign, setPreparedBySign] = useState('');
    const [preparedDate, setPreparedDate] = useState('');
    const [approvedBy, setApprovedBy] = useState('');
    const [approvedBySign, setApprovedBySign] = useState('');
    const [approvedDate, setApprovedDate] = useState('');


    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setClientCategory(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };




    return (
        <div className="card w-100" style={{ maxHeight: '87vh', overflowY: 'auto' }}>
            <div className="container my-4">

                <div className="d-flex justify-content-center align-items-center">
                    <img
                        src="logo.png"
                        alt="Logo"
                        className="me-2 me-md-3 mb-2 mb-md-0"
                        style={{ height: "50px" }}
                    />
                </div>


                <h3 className="text-center fw-bold mb-4">
                    Client Case Evaluation & Fee Quotation Form (Internal Use)
                </h3>
                <p className="small">
                    This form is to be completed by the Senior Lawyer after the initial
                    client meeting. It captures all details needed to prepare a fee
                    quotation for the client. The completed form will be reviewed by the
                    Chairman for approval of the proposed fees.
                </p>

                {/* Page 1 */}
                <h5 className="mt-4 fw-bold">Client & Case Information</h5>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Client Name</label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Client Contact Info</label>
                        <input className="form-control" type="text" placeholder="phone/email" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Date of Client Meeting</label>
                        <input className="form-control" type="date" />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Matter / Case Reference</label>
                        <input className="form-control" type="text" placeholder="(if applicable)" />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Case/Project Name or Description</label>
                    <textarea className="form-control" rows="2"></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Type of Case</label><br />
                    {["Civil", "Criminal", "Commercial/Corporate", "Other"].map((type) => (
                        <div className="form-check form-check-inline" key={type}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="caseType"
                                value={type}
                                checked={caseType === type}
                                onChange={(e) => setCaseType(e.target.value)}
                            />
                            <label className="form-check-label">{type}</label>
                        </div>
                    ))}
                </div>

                {/* Jurisdiction */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Jurisdiction</label><br />
                    {["UAE Local Courts", "DIFC Courts", "Arbitration", "Other"].map((court) => (
                        <div className="form-check form-check-inline" key={court}>
                            <input
                                className="form-check-input"
                                type="radio" // changed from checkbox to radio
                                name="jurisdiction"
                                value={court}
                                checked={jurisdiction === court}
                                onChange={(e) => setJurisdiction(e.target.value)}
                            />
                            <label className="form-check-label">{court}</label>
                        </div>
                    ))}
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">
                        Local Counsel Required (UAE law)
                    </label>
                    <br />

                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="localCounsel"
                            value="yes"
                            checked={localCounsel === "yes"}
                            onChange={(e) => setLocalCounsel(e.target.value)}
                        />
                        <label className="form-check-label">Yes</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="localCounsel"
                            value="no"
                            checked={localCounsel === "no"}
                            onChange={(e) => setLocalCounsel(e.target.value)}
                        />
                        <label className="form-check-label">No</label>
                    </div>

                    {localCounsel === "yes" && (
                        <div className="mt-2 ms-3">
                            <label className="form-label">
                                If Yes, Est. Local Counsel Hours
                            </label>
                            <input
                                className="form-control"
                                type="number"
                                placeholder="hours"
                            />
                        </div>
                    )}
                </div>


                {/* Page 1 - Case Complexity */}
                <h5 className="fw-bold mt-4">Case Complexity & Stakes</h5>

                {/* Case Complexity Level */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Case Complexity Level</label><br />
                    {["Low", "Medium", "High", "Very High/Complex"].map((level) => (
                        <div className="form-check form-check-inline" key={level}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="complexity"
                                value={level}
                                checked={complexity === level}
                                onChange={(e) => setComplexity(e.target.value)}
                            />
                            <label className="form-check-label">{level}</label>
                        </div>
                    ))}
                </div>

                {/* Details of novel or difficult issues */}
                <div className="mb-3 ms-3">
                    <label className="form-label">Details of any novel or difficult issues</label>
                    <textarea className="form-control" rows="2" placeholder="Enter details"></textarea>
                </div>

                {/* Scope of Case */}
                <div className="mb-3">
                    <label className="form-label">Scope of Case (Breadth)</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="e.g. multi-jurisdictional, multiple parties involved"
                    />
                </div>

                {/* Case Sensitivity */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Case Sensitivity</label><br />
                    {["Routine/Low", "Sensitive", "Highly Sensitive"].map((level) => (
                        <div className="form-check form-check-inline" key={level}>
                            <input
                                className="form-check-input"
                                type="radio"
                                name="sensitivity"
                                value={level}
                                checked={sensitivity === level}
                                onChange={(e) => setSensitivity(e.target.value)}
                            />
                            <label className="form-check-label">{level}</label>
                        </div>
                    ))}
                </div>

                {/* Amount at Stake */}
                <div className="mb-3">
                    <label className="form-label">Amount at Stake (Claim/Defense Value)</label>
                    <div className="input-group">
                        <input className="form-control" type="number" placeholder="Enter amount" />
                        <span className="input-group-text">AED</span>
                    </div>
                </div>

                {/* Estimated Case Duration */}
                <div className="mb-3">
                    <label className="form-label">Estimated Case Duration</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="e.g. 3-6 months; note any urgent deadlines"
                    />
                </div>















                {/* Page X - Resource & Effort Estimation */}
                <h5 className="fw-bold mt-4">Resource & Effort Estimation</h5>

                {/* Senior Lawyer */}
                <div className="mb-3 row align-items-center">
                    <label className="col-sm-2 col-form-label">Senior Lawyer:</label>
                    <div className="col-sm-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={seniorName}
                            onChange={(e) => setSeniorName(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-2 col-form-label text-end">Est. Hours:</label>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Hours"
                            value={seniorHours}
                            onChange={(e) => setSeniorHours(e.target.value)}
                        />
                    </div>
                </div>

                {/* Associate Lawyer(s) */}
                <div className="mb-3 row align-items-center">
                    <label className="col-sm-2 col-form-label">Associate Lawyer(s):</label>
                    <div className="col-sm-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name/Team"
                            value={associateName}
                            onChange={(e) => setAssociateName(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-2 col-form-label text-end">Est. Hours:</label>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Hours"
                            value={associateHours}
                            onChange={(e) => setAssociateHours(e.target.value)}
                        />
                    </div>
                </div>

                {/* Local Counsel */}
                <div className="mb-3 row align-items-center">
                    <label className="col-sm-2 col-form-label">Local Counsel (if any):</label>
                    <div className="col-sm-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name/Firm"
                            value={ResourcelocalCounsel}
                            onChange={(e) => setResourceLocalCounsel(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-2 col-form-label text-end">Est. Hours:</label>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Hours"
                            value={localCounselHours}
                            onChange={(e) => setLocalCounselHours(e.target.value)}
                        />
                    </div>
                </div>

                {/* Paralegal / Support Staff */}
                <div className="mb-3 row align-items-center">
                    <label className="col-sm-2 col-form-label">Paralegal/Support Staff:</label>
                    <div className="col-sm-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Role"
                            value={paralegal}
                            onChange={(e) => setParalegal(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-2 col-form-label text-end">Est. Hours:</label>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Hours"
                            value={paralegalHours}
                            onChange={(e) => setParalegalHours(e.target.value)}
                        />
                    </div>
                </div>

                {/* Other Resources */}
                <div className="mb-3 row align-items-center">
                    <label className="col-sm-2 col-form-label">Other Resources (Experts, etc.):</label>
                    <div className="col-sm-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Specify resource"
                            value={otherResources}
                            onChange={(e) => setOtherResources(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-2 col-form-label text-end">Est. Hours:</label>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Hours"
                            value={otherResourceHours}
                            onChange={(e) => setOtherResourceHours(e.target.value)}
                        />
                    </div>
                </div>

                {/* Total Estimated Hours */}
                <div className="mb-3 row align-items-center">
                    <label className="col-sm-6 col-form-label"><strong>Total Estimated Hours (all resources):</strong></label>
                    <div className="col-sm-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Total"
                            value={totalHours}
                            onChange={(e) => setTotalHours(e.target.value)}
                        />
                    </div>
                </div>
















                {/* Page X - Client Profile & Relationship */}
                <h5 className="fw-bold mt-4">Client Profile & Relationship</h5>


                {/* Client Category */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Client Category:</label>
                    <div className="d-flex flex-wrap gap-3 ms-3">
                        {["New Client", "Existing Client", "Retainer Client", "Referral", "VIP/Key Client"].map((type) => (
                            <div className="form-check" key={type}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={type}
                                    value={type}
                                    checked={clientCategory.includes(type)}
                                    onChange={(e) => handleCategoryChange(e)}
                                />
                                <label className="form-check-label" htmlFor={type}>
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conditional Fields */}
                <div className="mb-3 ms-4">
                    {clientCategory.includes("Referral") && (
                        <div className="mb-2">
                            <small className="d-block">• If Referral – Referred By:</small>
                            <input
                                type="text"
                                className="form-control form-control-sm w-50"
                                placeholder="Enter name"
                                value={referredBy}
                                onChange={(e) => setReferredBy(e.target.value)}
                            />
                        </div>
                    )}

                    {clientCategory.includes("Retainer Client") && (
                        <div>
                            <small className="d-block">• If Retainer Client – Retainer Details:</small>
                            <input
                                type="text"
                                className="form-control form-control-sm w-75"
                                placeholder="e.g. monthly fee or hours covered"
                                value={retainerDetails}
                                onChange={(e) => setRetainerDetails(e.target.value)}
                            />
                        </div>
                    )}
                </div>


                {/* Referral & Retainer Details */}
                <div className="mb-3 ms-3">
                    {clientCategory.includes("Referral") && (
                        <div className="mb-2">
                            <label className="form-label">If Referral – Referred By:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter name or source"
                                value={referredBy}
                                onChange={(e) => setReferredBy(e.target.value)}
                            />
                        </div>
                    )}

                    {clientCategory.includes("Retainer Client") && (
                        <div>
                            <label className="form-label">If Retainer Client – Retainer Details:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. monthly fee or hours covered"
                                value={retainerDetails}
                                onChange={(e) => setRetainerDetails(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Client Communication Needs */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Client Communication Needs:</label>
                    <div className="d-flex flex-wrap gap-3 ms-3">
                        {["Low (infrequent updates)", "Medium (regular updates)", "High (frequent updates)"].map((level) => (
                            <div className="form-check" key={level}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="communication"
                                    id={level}
                                    value={level}
                                    checked={communication === level}
                                    onChange={(e) => setCommunication(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor={level}>
                                    {level}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notes on client personality */}
                <div className="mb-3 ms-3">
                    <label className="form-label">Notes on client personality/expectations:</label>
                    <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Enter notes"
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                    ></textarea>
                </div>












                {/* Fee Proposal & Pricing */}
                <h5 className="fw-bold mt-4">Fee Proposal & Pricing</h5>

                {/* Proposed Fee Structure */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Proposed Fee Structure:</label>
                    <div className="d-flex flex-wrap gap-3 ms-3">
                        {["Hourly-billed", "Fixed Fee", "Other"].map((type) => (
                            <div className="form-check" key={type}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="feeStructure"
                                    value={type}
                                    checked={feeStructure === type}
                                    onChange={(e) => setFeeStructure(e.target.value)}
                                />
                                <label className="form-check-label">{type}</label>
                            </div>
                        ))}
                        {feeStructure === "Other" && (
                            <input
                                type="text"
                                className="form-control form-control-sm w-auto"
                                placeholder="Specify"
                                value={otherFee}
                                onChange={(e) => setOtherFee(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                {/* Conditional Fee Details */}
                <div className="mb-3 ms-4">
                    {feeStructure === "Hourly-billed" && (
                        <>
                            <label className="form-label">If Hourly: Proposed hourly rates & cap:</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="e.g. Senior AED ___/hr, Associate AED ___/hr"
                                value={hourlyRates}
                                onChange={(e) => setHourlyRates(e.target.value)}
                            />
                        </>
                    )}

                    {feeStructure === "Fixed Fee" && (
                        <>
                            <label className="form-label">If Fixed Fee: Total Amount (AED)</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="e.g. 25,000 AED"
                                value={fixedFee}
                                onChange={(e) => setFixedFee(e.target.value)}
                            />
                        </>
                    )}
                </div>

                {/* Special Terms */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Special Terms or Considerations:</label>
                    <textarea
                        className="form-control"
                        rows="2"
                        placeholder="e.g. advance retainer, installment plan, success fee conditions"
                        value={specialTerms}
                        onChange={(e) => setSpecialTerms(e.target.value)}
                    ></textarea>
                </div>

                {/* Key Factors Affecting Fee */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Key Factors Affecting Fee:</label>
                    <textarea
                        className="form-control"
                        rows="2"
                        placeholder="e.g. high amount at stake, urgent timelines, demanding client expectations"
                        value={keyFactors}
                        onChange={(e) => setKeyFactors(e.target.value)}
                    ></textarea>
                </div>













                {/* Approvals */}
                <h5 className="fw-bold mt-4">Approvals</h5>

                {/* Prepared by */}
                <div className="mb-3 row align-items-center">
                    <label className="col-sm-3 col-form-label">Prepared by (Senior Lawyer):</label>
                    <div className="col-sm-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={preparedBy}
                            onChange={(e) => setPreparedBy(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-1 col-form-label text-end">Signature:</label>
                    <div className="col-sm-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Signature"
                            value={preparedBySign}
                            onChange={(e) => setPreparedBySign(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-1 col-form-label text-end">Date:</label>
                    <div className="col-sm-2">
                        <input
                            type="date"
                            className="form-control"
                            value={preparedDate}
                            onChange={(e) => setPreparedDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Reviewed by */}
                <div className="mb-3 row align-items-center">
                    <label className="col-sm-3 col-form-label">Reviewed & Approved by (Chairman):</label>
                    <div className="col-sm-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={approvedBy}
                            onChange={(e) => setApprovedBy(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-1 col-form-label text-end">Signature:</label>
                    <div className="col-sm-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Signature"
                            value={approvedBySign}
                            onChange={(e) => setApprovedBySign(e.target.value)}
                        />
                    </div>
                    <label className="col-sm-1 col-form-label text-end">Date:</label>
                    <div className="col-sm-2">
                        <input
                            type="date"
                            className="form-control"
                            value={approvedDate}
                            onChange={(e) => setApprovedDate(e.target.value)}
                        />
                    </div>
                </div>










                <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap">
                    <button className="btn btn-sm btn-primary fw-bold">Submit Form</button>
                </div>
            </div>
        </div>
    );
};

export default LFQ_ClientCaseEvaluationForm;
