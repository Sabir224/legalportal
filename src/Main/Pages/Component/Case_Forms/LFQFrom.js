import React, { useEffect, useState } from "react";
import backgroundImage from "../../../Pages/Images/bg.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import Form_SignaturePad from "./Form_Componets/SignaturePad";
import axios from "axios";
import { ApiEndPoint } from "../utils/utlis";
import { useSelector } from "react-redux";
import { Caseinfo } from "../../../../REDUX/sliece";
import { useAlert } from "../../../../Component/AlertContext";
import { Dropdown, Form, InputGroup, Modal, Button } from "react-bootstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "../../../Pages/Images/logo.png";
import AWSSideLogo from "../../../Pages/Component/assets/AWSSideLogo.png";
import AWSSideLogo1 from "../../../Pages/Component/assets/AWSSideLogo2.png";
import Stamp from "../../../Pages/Component/assets/Stamp.png";
import AWSlegalServices from '../../../Pages/Component/assets/AWSlegalServices.jpg';
import { height } from "@mui/system";

const LFQ_ClientCaseEvaluationForm = ({ token }) => {
    const caseInfo = useSelector((state) => state.screen.Caseinfo);
    const [clientName, setClientName] = useState('');
    const [clientContactInfo, setclientContactInfo] = useState('');
    const [clientContactphone, setclientContactphone] = useState('');
    const [dateValue, setDateValue] = useState('');
    const [localCounsel, setLocalCounsel] = useState("no");
    const [matterReference, setMatterReference] = useState(caseInfo?.CaseId);
    const [caseType, setCaseType] = useState(caseInfo?.CaseSubType); // default Civil
    const [jurisdiction, setJurisdiction] = useState("UAE Local Courts"); // default UAE Local Courts
    const [complexity, setComplexity] = useState(caseInfo?.Priority);
    const [sensitivity, setSensitivity] = useState("Routine/Low");
    const { showLoading, showSuccess, showError, showDataLoading } = useAlert();

    const associateLawyers = ["Team A", "Team B", "Ali Raza"];
    const localCounsels = ["Firm X", "Firm Y", "Zeeshan & Co"];

    let isclient = token?.Role === "client" ? true : false

    const [paralegalStaff, setparalegalStaff] = useState([]);
    const [getAllOpsteam, setAllOpsteam] = useState([]);
    const [seniorLawyers, setseniorLawyersList] = useState([]);
    const [seniorName, setSeniorName] = useState('');
    const [seniorHours, setSeniorHours] = useState('');
    const [associateName, setAssociateName] = useState('');
    const [associateHours, setAssociateHours] = useState('');

    const [ResourcelocalCounsel, setResourceLocalCounsel] = useState('');
    const [localCounselHours, setLocalCounselHours] = useState('');
    const [ResourcelocalCounselHours, setResourceLocalCounselHours] = useState('');
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

    const [preparedBy, setPreparedBy] = useState(token?.Role === "lawyer" ? token?._id : '');
    const [preparedBySign, setPreparedBySign] = useState('');
    const [preparedDate, setPreparedDate] = useState('');
    const [approvedBy, setApprovedBy] = useState(token?._id);
    const [approvedBySign, setApprovedBySign] = useState('');
    const [approvedDate, setApprovedDate] = useState('');
    const [AmountatStake, setAmountAtStake] = useState('');
    const [estimatedDuration, setestimatedDuration] = useState('');
    const [ScopeOfWork, setScopeOfWork] = useState('');
    const [dataFound, setDataFound] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formId, setFormId] = useState("");
    const [LFQData, setLFQData] = useState("");
    const [islocal, setislocal] = useState(false);

    const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
    const [getDrafts, setGetDrafts] = useState(null);

    const [generatedLink, setGeneratedLink] = useState("");
    const [showLinkGenerator, setShowLinkGenerator] = useState(true);
    const [isReEdit, setIsReEdit] = useState(false);
    const [LinkcaseId, setLinkcaseId] = useState("");

    // Add state for confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [AWSPDFdownload, setAWSPDFdownload] = useState(false);



    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState("");
    const [changes, setChanges] = useState("");

    const [showdownloadModal, setShowdownloadModal] = useState(false);

    const handleDownload = async () => {
        downloadCasePdf(LFQData);

    };
    const handleShudDownloadPdf = async () => {
        downloadCasePdf(LFQData, false);
        setShowdownloadModal(false);
    };

    const buttonStyle = {
        backgroundColor: "#16213e",
        color: "white",
        width: "150px",
        minWidth: "100px",
        maxWidth: "200px",
        padding: "8px 20px",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer",
        textAlign: "center",
        border: "2px solid #16213e",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        fontWeight: "500",
    };
    const handleRejectClick = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setReason("");
        setChanges("");
    };

    const handleReject = async (e) => {



        e.preventDefault();
        showLoading()

        if (!changes.trim()) {
            showError("Please provide a changes for rejection.");
            return;
        }
        try {

            const res = await axios.put(
                `${ApiEndPoint}RejectLFQForm/${formId}/${changes}`,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (res.status === 200 || res.status === 201) {
                setIsEdit(false);
                if (LinkcaseId && !showLinkGenerator) {

                    fetchLFQForm(LinkcaseId);
                } else {

                    fetchLFQForm(caseInfo?._id);
                }
                showSuccess("Form Approved successfully!");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showError("We encountered an issue while submitting your form. Please try again later.");
        }
        // 👇 Backend call ya API hit krni hai
        console.log("Rejected with reason:", reason);
        console.log("Requested changes:", changes);

        // Close modal after submit
        handleClose();
    };

    const handleGenerateLink = () => {
        const originalLink = `${window.location.origin}/LFQ_ClientCaseEvaluationForm?caseId=${caseInfo?._id}&timestamp=${Date.now()}`;
        const encrypted = btoa(originalLink);
        const finalLink = `${window.location.origin}/LFQ_ClientCaseEvaluationForm?data=${encodeURIComponent(encrypted)}`;
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

        if (encoded) {
            try {
                const decodedLink = atob(decodeURIComponent(encoded));
                console.log("Decoded full link:", decodedLink);

                const url = new URL(decodedLink);
                const caseId = url.searchParams.get("caseId");

                if (caseId) {
                    setShowLinkGenerator(false);
                    setLinkcaseId(caseId);
                    fetchLFQForm(caseId);
                }
            } catch (err) {
                console.error("Decryption failed:", err);
            }
        }
    }, []);

    useEffect(() => {
        if (caseInfo) {
            fetchLFQForm(caseInfo?._id);
        }
    }, [caseInfo]);

    const fetchLFQForm = async (caseId) => {
        showDataLoading(true)

        try {
            const response = await fetch(
                `${ApiEndPoint}getAllLFQForms`
            );

            if (!response.ok) {
                showDataLoading(false)
                throw new Error('Error fetching LFA');
            }

            const data = await response.json();
            setGetDrafts(data)
        } catch (err) {
            showDataLoading(false)
        }

        try {
            const res = await axios.get(`${ApiEndPoint}getClientDetailsByUserId/${caseInfo?.ClientId}`);
            if (res.data) {
                const data = res.data;
                setClientName(data?.user.UserName || "");
                setclientContactInfo(data?.user.Email || "");
                setclientContactphone(data?.clientDetails.Contact || "");
            }
        } catch (error) {
            console.error("Error fetching client details", error);
            setDataFound(false);
        }

        try {
            const res = await axios.get(`${ApiEndPoint}getAllOpsteam`);
            if (res.data) {
                const data = res.data;
                setAllOpsteam(data.users || "");
            }
        } catch (error) {
            console.error("Error fetching client details", error);
            setDataFound(false);
        }
        try {
            const res = await axios.get(`${ApiEndPoint}getAllLawyers`);
            if (res.data) {
                const data = res.data;
                setseniorLawyersList(data.lawyers);
            }
        } catch (error) {
            console.error("Error fetching client details", error);
            setDataFound(false);
        }
        try {
            const res = await axios.get(`${ApiEndPoint}getUniqueRoles`);
            if (res.data) {
                const data = res.data;
                setparalegalStaff(data.roles);
            }
        } catch (error) {
            console.error("Error fetching client details", error);
            setDataFound(false);
        }


        let reject
        let RejectMessage
        let approvedBy
        let preparedBy
        try {
            const res = await axios.get(`${ApiEndPoint}getLFQFormByCaseId/${caseId}`);
            if (res.data) {
                const data = res.data;
                setLFQData(res.data)
                setFormId(data._id)
                setClientName(data.clientName || "");
                setclientContactInfo(data.clientEmail || "");
                setclientContactphone(data.clientContactphone || "");

                if (data.dateOfClientMeeting) {
                    const date = new Date(data.dateOfClientMeeting);
                    setDateValue(
                        `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
                    );
                } else {
                    setDateValue("");
                }

                setJurisdiction(data.jurisdiction || "");
                setLocalCounsel(data.localCounselRequired || "");
                setLocalCounselHours(data.estLocalCounselHours || "");

                setComplexity(data.complexityLevel || "");
                setAmountAtStake(data.amountAtStake || "");
                setestimatedDuration(data.estimatedCaseDuration || "");

                setSeniorName(data.seniorLawyer?.name || "");
                setSeniorHours(data.seniorLawyer?.estHours || "");
                setAssociateName(data.associateLawyer?.name || "");
                setAssociateHours(data.associateLawyer?.estHours || "");
                setResourceLocalCounsel(data.resourceLocalCounsel?.name || "");
                setResourceLocalCounselHours(data.resourceLocalCounsel?.estHours || "");
                setParalegal(data.paralegalSupport?.role || "");
                setParalegalHours(data.paralegalSupport?.estHours || "");
                setOtherResources(data.otherResources?.description || "");
                setOtherResourceHours(data.otherResources?.estHours || "");
                setTotalHours(data.totalEstimatedHours || "");
                setMatterReference(data.matterReference || "");
                setCaseType(data.caseType || "");

                if (Array.isArray(data.clientCategory) && data.clientCategory.length > 0) {
                    try {
                        setClientCategory(JSON.parse(data.clientCategory[0]));
                    } catch {
                        setClientCategory(data.clientCategory);
                    }
                } else {
                    setClientCategory([]);
                }

                setReferredBy(data.referredBy || "");
                setRetainerDetails(data.retainerDetails || "");
                setCommunication(data.communicationNeeds || "");
                setClientNotes(data.clientNotes || "");

                setFeeStructure(data.feeStructure || "");
                setOtherFee(data.otherFee || "");
                setHourlyRates(data.hourlyRates || "");
                setFixedFee(data.fixedFee || "");
                setSpecialTerms(data.specialTerms || "");
                setScopeOfWork(data.ScopeOfWork || "");
                setKeyFactors(data.keyFactors || "");


                setPreparedBy(data.preparedBy || token?._id);
                preparedBy = data.preparedBy;
                approvedBy = data.approvedBy;
                if (data.preparedDate) {
                    const pDate = new Date(data.preparedDate);
                    setPreparedDate(
                        `${String(pDate.getDate()).padStart(2, "0")}/${String(pDate.getMonth() + 1).padStart(2, "0")}/${pDate.getFullYear()}`
                    );
                } else {
                    setPreparedDate("");
                }
                setPreparedBySign(data.preparedBySignpath || "");

                setApprovedBy(data.approvedBy || token?._id);
                if (data.approvedDate) {
                    const aDate = new Date(data.approvedDate);
                    setApprovedDate(
                        `${String(aDate.getDate()).padStart(2, "0")}/${String(aDate.getMonth() + 1).padStart(2, "0")}/${aDate.getFullYear()}`
                    );
                } else {
                    setApprovedDate("");
                }
                setApprovedBySign(data.approvedBySignpath || "");
                RejectMessage = data.RejectMessage;
                reject = data.isReject;
                setislocal(false)
                setDataFound(true);

            }
        } catch (error) {
            console.error("Error fetching LFQ form:", error);
            setDataFound(false);
        }

        showDataLoading(false)



        // console.log("LFQData?.isReject", RejectMessage)
        // console.log("LFQData?.RejectMessage", reject)


        if (RejectMessage && reject && (token?._id === preparedBy || token?._id === approvedBy)) {

            showError("The LFQ Form has been rejected by the client, please make the changes for resubmission")
        }


    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setClientCategory(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };

    const handleSignatureSave = (dataUrl) => {
        setApprovedBySign(dataUrl);
        setislocal(true)
    };

    const handlepreparedBySign = (dataUrl) => {
        setPreparedBySign(dataUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const validations = [
                { condition: !caseInfo?._id, message: "Case ID is missing" },
                { condition: !clientName, message: "Client name is required" },
                { condition: !clientContactInfo, message: "Client email is required" },
                { condition: !clientContactphone, message: "Client phone is required" },
                { condition: !dateValue, message: "Meeting date is required" },
                { condition: !caseType, message: "Case type is required" },
                { condition: !jurisdiction, message: "Jurisdiction is required" },
                { condition: !complexity, message: "Complexity level is required in Case Complexity & Stakes" },
                { condition: !AmountatStake, message: "Amount at Stake is required in Case Complexity & Stakes" },
                { condition: !estimatedDuration, message: "Estimated Duration is required in Case Complexity & Stakes" },
                { condition: !clientCategory || clientCategory.length === 0, message: "Please select at least one client category" },
                { condition: !communication, message: "Please select communication needs" },
                { condition: !seniorName, message: "Senior lawyer name is required" },
                { condition: !seniorHours, message: "Senior lawyer hours is required" },
                { condition: !associateName, message: "Associate lawyer name is required" },
                { condition: !associateHours, message: "Associate lawyer hours is required" },
                { condition: !paralegal, message: "Paralegal/Support Staff is required" },
                { condition: !paralegalHours, message: "paralegalHours is required" },
                { condition: !otherResourceHours, message: "Other Resource Hours is required" },
                { condition: !otherResources, message: "Other Resources is required" },
                { condition: !preparedBy, message: "Prepared by name is required" },
                { condition: !preparedDate, message: "Prepared date is required" },
                { condition: !preparedBySign, message: "Prepared signature is required" },
                { condition: !keyFactors, message: "Key Factors is required" },
                { condition: !specialTerms, message: "Special Terms is required" },
                {
                    condition: localCounsel === "yes" && !localCounselHours,
                    message: "Local counsel hours required when counsel is needed"
                },
                {
                    condition: ResourcelocalCounselHours && !ResourcelocalCounsel,
                    message: "Local counsel name required when counsel is needed"
                },
            ];

            for (const validation of validations) {
                if (validation.condition) {
                    showError(validation.message);
                    return;
                }
            }

            if (!feeStructure) {
                showError("Please select a fee structure");
                return;
            }

            switch (feeStructure) {
                case "Other":
                    if (!otherFee) {
                        showError("Please specify other fee details");
                        return;
                    }
                    break;
                case "Hourly-billed":
                    if (!hourlyRates) {
                        showError("Please enter hourly rates");
                        return;
                    }
                    break;
                case "Fixed Fee":
                    if (!fixedFee) {
                        showError("Please enter fixed fee amount");
                        return;
                    }
                    break;
            }

            const isRetainerClient = clientCategory.includes("Retainer Client");
            const isReferral = clientCategory.includes("Referral");

            if (isRetainerClient && !retainerDetails) {
                showError("Retainer details required for Retainer Client");
                return;
            }

            if (isReferral && !referredBy) {
                showError("Referral source required for Referral client");
                return;
            }

            const formData = new FormData();
            showLoading()
            formData.append("caseId", caseInfo?._id);
            formData.append("clientName", clientName);
            formData.append("clientEmail", clientContactInfo);
            formData.append("clientContactphone", clientContactphone);
            const [dateValueday, dateValuemonth, dateValueyear] = dateValue.split("/");
            const dateValue_formattedDate = new Date(`${dateValueyear}-${dateValuemonth}-${dateValueday}`);
            formData.append("dateOfClientMeeting", dateValue_formattedDate);
            formData.append("matterReference", matterReference || "");
            formData.append("caseType", caseType);
            formData.append("jurisdiction", jurisdiction);
            formData.append("localCounselRequired", localCounsel);
            formData.append("estLocalCounselHours", localCounselHours || "");

            formData.append("complexityLevel", complexity);
            formData.append("amountAtStake", AmountatStake || "");
            formData.append("estimatedCaseDuration", estimatedDuration || "");

            formData.append("seniorLawyer[name]", seniorName);
            formData.append("seniorLawyer[estHours]", seniorHours || "");
            formData.append("associateLawyer[name]", associateName);
            formData.append("associateLawyer[estHours]", associateHours || "");
            formData.append("resourceLocalCounsel[name]", ResourcelocalCounsel);
            formData.append("resourceLocalCounsel[estHours]", ResourcelocalCounselHours || "");
            formData.append("paralegalSupport[role]", paralegal);
            formData.append("paralegalSupport[estHours]", paralegalHours || "");
            formData.append("otherResources[description]", otherResources || "");
            formData.append("otherResources[estHours]", otherResourceHours || "");
            formData.append("totalEstimatedHours", totalHours || "");

            formData.append("clientCategory", JSON.stringify(clientCategory));
            formData.append("referredBy", referredBy || "");
            formData.append("retainerDetails", retainerDetails || "");
            formData.append("communicationNeeds", communication || "");
            formData.append("clientNotes", clientNotes || "");

            formData.append("feeStructure", feeStructure || "");
            formData.append("otherFee", otherFee || "");
            formData.append("hourlyRates", hourlyRates || "");
            formData.append("fixedFee", fixedFee || "");
            formData.append("specialTerms", specialTerms || "");
            formData.append("ScopeOfWork", ScopeOfWork || "");
            formData.append("keyFactors", keyFactors || "");

            if (preparedBySign) {
                const file = base64ToFile(preparedBySign, "preparedBySign.png");
                formData.append("file", file);
            }

            const [day, month, year] = preparedDate.split("/");
            const preparedDate_formattedDate = new Date(`${year}-${month}-${day}`);
            formData.append("preparedBy", preparedBy || "");
            formData.append("preparedDate", preparedDate_formattedDate.toISOString() || "");

            if (approvedBySign) {
                const file = base64ToFile(approvedBySign, "approvedBySign.png");
                formData.append("file", file);
            }

            const [appday, appmonth, appyear] = approvedDate.split("/");
            const approvedDate_formattedDate = new Date(`${appyear}-${appmonth}-${appday}`);

            if (approvedDate) {
                formData.append("approvedBy", approvedBy || "");
                formData.append("approvedDate", approvedDate_formattedDate.toISOString() || "");
            }

            const res = await axios.post(`${ApiEndPoint}createLFQForm`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.status === 200 || res.status === 201) {
                fetchLFQForm(caseInfo?._id);
                showSuccess("Form submitted successfully!");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showError("Unable to submit. Kindly complete all required fields before proceeding.");
        }
    };

    const handleEdit = async (e) => {
        setIsEdit(true)
        setDataFound(false)
        e.preventDefault();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsEdit(true);
        setDataFound(false);

        try {
            const validations = [
                { condition: !caseInfo?._id, message: "Case ID is missing" },
                { condition: !clientName, message: "Client name is required" },
                { condition: !clientContactInfo, message: "Client email is required" },
                { condition: !clientContactphone, message: "Client phone is required" },
                { condition: !dateValue, message: "Meeting date is required" },
                { condition: !caseType, message: "Case type is required" },
                { condition: !jurisdiction, message: "Jurisdiction is required" },
                { condition: !complexity, message: "Complexity level is required in Case Complexity & Stakes" },
                { condition: !AmountatStake, message: "Amount at Stake is required in Case Complexity & Stakes" },
                { condition: !estimatedDuration, message: "Estimated Duration is required in Case Complexity & Stakes" },
                { condition: !clientCategory || clientCategory.length === 0, message: "Please select at least one client category" },
                { condition: !communication, message: "Please select communication needs" },
                { condition: !seniorName, message: "Senior lawyer name is required" },
                { condition: !seniorHours, message: "Senior lawyer hours is required" },
                { condition: !associateName, message: "Associate lawyer name is required" },
                { condition: !associateHours, message: "Associate lawyer hours is required" },
                { condition: !paralegal, message: "Paralegal/Support Staff is required" },
                { condition: !paralegalHours, message: "paralegalHours is required" },
                { condition: !otherResourceHours, message: "Other Resource Hours is required" },
                { condition: !otherResources, message: "Other Resources is required" },
                { condition: !preparedBy, message: "Prepared by name is required" },
                { condition: !preparedDate, message: "Prepared date is required" },
                { condition: !preparedBySign, message: "Prepared signature is required" },
                { condition: !keyFactors, message: "Key Factors is required" },
                { condition: !specialTerms, message: "Special Terms is required" },
                {
                    condition: localCounsel === "yes" && !localCounselHours,
                    message: "Local counsel hours required when counsel is needed"
                },
                {
                    condition: ResourcelocalCounselHours && !ResourcelocalCounsel,
                    message: "Local counsel name required when counsel is needed"
                },
            ];

            for (const validation of validations) {
                if (validation.condition) {
                    showError(validation.message);
                    return;
                }
            }

            if (!feeStructure) {
                showError("Please select a fee structure");
                return;
            }

            switch (feeStructure) {
                case "Other":
                    if (!otherFee) {
                        showError("Please specify other fee details");
                        return;
                    }
                    break;
                case "Hourly-billed":
                    if (!hourlyRates) {
                        showError("Please enter hourly rates");
                        return;
                    }
                    break;
                case "Fixed Fee":
                    if (!fixedFee) {
                        showError("Please enter fixed fee amount");
                        return;
                    }
                    break;
            }

            const isRetainerClient = clientCategory.includes("Retainer Client");
            const isReferral = clientCategory.includes("Referral");

            if (isRetainerClient && !retainerDetails) {
                showError("Retainer details required for Retainer Client");
                return;
            }

            if (isReferral && !referredBy) {
                showError("Referral source required for Referral client");
                return;
            }

            showLoading()
            const [day, month, year] = preparedDate.split("/");
            const preparedDate_formattedDate = new Date(`${year}-${month}-${day}`);

            const [dateValueday, dateValuemonth, dateValueyear] = dateValue.split("/");
            const dateValue_formattedDate = new Date(`${dateValueyear}-${dateValuemonth}-${dateValueday}`);

            const [appday, appmonth, appyear] = approvedDate.split("/");
            const approvedDate_formattedDate = approvedDate
                ? new Date(`${appyear}-${appmonth}-${appday}`)
                : null;

            const payload = {
                caseId: caseInfo?._id,
                clientName,
                clientEmail: clientContactInfo,
                clientContactphone,
                dateOfClientMeeting: dateValue_formattedDate.toISOString(),
                matterReference,
                caseType,
                jurisdiction,
                localCounselRequired: localCounsel,
                estLocalCounselHours: localCounselHours,
                complexityLevel: complexity,
                amountAtStake: AmountatStake,
                estimatedCaseDuration: estimatedDuration,

                seniorLawyer: {
                    name: seniorName,
                    estHours: seniorHours,
                },
                associateLawyer: {
                    name: associateName,
                    estHours: associateHours,
                },
                resourceLocalCounsel: {
                    name: ResourcelocalCounsel,
                    estHours: ResourcelocalCounselHours,
                },
                paralegalSupport: {
                    role: paralegal,
                    estHours: paralegalHours,
                },
                otherResources: {
                    description: otherResources,
                    estHours: otherResourceHours,
                },

                totalEstimatedHours: totalHours,

                clientCategory: JSON.stringify(clientCategory),
                referredBy,
                retainerDetails,
                communicationNeeds: communication,
                clientNotes,

                feeStructure,
                otherFee,
                hourlyRates,
                fixedFee,
                specialTerms,
                ScopeOfWork,
                keyFactors,

                preparedBy,
                preparedDate: preparedDate_formattedDate.toISOString(),

                approvedBy: approvedDate ? approvedBy : "",
                approvedBySignpath: approvedBySign,
                approvedDate: approvedDate ? approvedDate_formattedDate.toISOString() : "",
            };

            const res = await axios.put(
                `${ApiEndPoint}updateDataLFQForm/${formId}`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (res.status === 200 || res.status === 201) {
                setIsEdit(false);
                fetchLFQForm(caseInfo?._id);
                showSuccess("Form updated successfully!");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showError("Update failed. Kindly fill in all required fields before proceeding.");
        }
    };

    // Add this function to handle the edit confirmation
    const handleEditWithConfirmation = () => {
        setShowConfirmModal(true);
    };

    // Add this function to confirm the edit and remove chairman signature
    const confirmEdit = () => {
        setDataFound(!dataFound)
        setPreparedBySign("");
        setPreparedDate("");
        setApprovedBySign(""); // Clear the chairman signature
        setApprovedDate(""); // Clear the approval date
        setDataFound(false); // Enable form editing
        setIsEdit(true);
        setShowConfirmModal(false);
    };


    // function createApprovedSeal(options = {}) {
    //     const {
    //         size = 320,
    //         mainText = "APPROVED",
    //         subText = "AWS LegalGroup",
    //         mainColor = "#2E3A87", // Deep Blue
    //         ringWidth = 10
    //     } = options;

    //     const canvas = document.createElement("canvas");
    //     const ctx = canvas.getContext("2d");
    //     canvas.width = size;
    //     canvas.height = size;

    //     const centerX = size / 2;
    //     const centerY = size / 2;
    //     const radius = size / 2 - ringWidth;

    //     // Outer Circle (Dashed Line)
    //     ctx.lineWidth = ringWidth;
    //     ctx.strokeStyle = mainColor;
    //     ctx.setLineDash([15, 10]); // dash-gap style
    //     ctx.beginPath();
    //     ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    //     ctx.stroke();

    //     // Reset dash for inner circle
    //     ctx.setLineDash([]);

    //     // Inner Circle (Solid Thin Line)
    //     ctx.lineWidth = 3;
    //     ctx.beginPath();
    //     ctx.arc(centerX, centerY, radius - 30, 0, 2 * Math.PI);
    //     ctx.stroke();

    //     // Center Text (APPROVED)
    //     ctx.fillStyle = mainColor;
    //     ctx.font = "bold 46px 'Arial Black'";
    //     ctx.textAlign = "center";
    //     ctx.textBaseline = "middle";
    //     ctx.fillText(mainText, centerX, centerY - 15);

    //     // Sub Text (AWS LegalGroup, italic)
    //     ctx.font = "italic 20px Georgia";
    //     ctx.fillText(subText, centerX, centerY + 30);

    //     return canvas.toDataURL("image/png");
    // }



    function createApprovedSeal(options = {}) {
        const {
            size = 320,
            mainText = "APPROVED",
            subText = "AWS Legal Consultancy",
            mainColor = "#12963a", // Deep Blue
            ringWidth = 10,
            rotation = -15 * Math.PI / 180 // default tilt: -15 degrees
        } = options;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = size;
        canvas.height = size;

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - ringWidth;

        // Apply rotation
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);

        // Outer Circle (Dashed Line)
        ctx.lineWidth = ringWidth;
        ctx.strokeStyle = mainColor;
        ctx.setLineDash([15, 10]); // dash-gap style
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        // Reset dash for inner circle
        ctx.setLineDash([]);

        // Inner Circle (Solid Thin Line)
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 30, 0, 2 * Math.PI);
        ctx.stroke();

        // Center Text (APPROVED)
        ctx.fillStyle = mainColor;
        ctx.font = "bold 46px 'Arial Black'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(mainText, centerX, centerY - 15);

        // Sub Text (AWS LegalGroup, italic)
        ctx.font = "italic 20px Georgia";
        ctx.fillText(subText, centerX, centerY + 30);

        return canvas.toDataURL("image/png");
    }


    // // Helper: Draw Circular Text
    // function drawCircularText(ctx, text, centerX, centerY, radius, startAngle) {
    //     const anglePerChar = (Math.PI) / (text.length - 1);
    //     ctx.save();
    //     ctx.translate(centerX, centerY);
    //     ctx.rotate(startAngle - Math.PI / 2);

    //     for (let i = 0; i < text.length; i++) {
    //         ctx.save();
    //         ctx.rotate(i * anglePerChar - (text.length - 1) * anglePerChar / 2);
    //         ctx.textAlign = "center";
    //         ctx.fillText(text[i], 0, -radius);
    //         ctx.restore();
    //     }
    //     ctx.restore();
    // }


    const handleUpdateSignature = async (e) => {
        e.preventDefault();
        showLoading()

        try {
            const formData = new FormData();

            const validations = [
                { condition: !preparedBy, message: "Prepared by name is required" },
                { condition: !preparedDate, message: "Prepared date is required" },
                { condition: !approvedDate, message: "Approved date is required" },
            ];

            for (const validation of validations) {
                if (validation.condition) {
                    showError(validation.message);
                    return;
                }
            }

            setIsEdit(true);
            setDataFound(false);

            // if (approvedBySign) {
            //     // const file = base64ToFile(approvedBySign, "approvedBySign.png");
            //     const file = new File(["Approved"], "approvedBy.png", { type: "text/plain" });
            //     formData.append("file", file);
            // }
            let file;

            if (approvedBySign === "Approved") {
                // ✅ "Approved" ko ek dummy stamp image me convert karna


                const approvedStampBase64 = createApprovedSeal("Raheem Akbar");
                // textToBase64Image("Approved", {
                //     font: "bold 50px Arial",
                //     textColor: "white",
                //     bgColor: "red"
                // });
                // base64 ko File object me convert karo
                file = base64ToFile(approvedStampBase64, "approvedBy.png");
            } else {
                // agar already signature base64 hai
                file = base64ToFile(approvedBySign, "approvedBySign.png");
            }

            formData.append("file", file);
            const [appday, appmonth, appyear] = approvedDate.split("/");
            const approvedDate_formattedDate = new Date(`${appyear}-${appmonth}-${appday}`);

            if (approvedBy) formData.append("approvedBy", approvedBy);
            if (approvedDate) formData.append("approvedDate", approvedDate_formattedDate.toISOString());

            const res = await axios.put(
                `${ApiEndPoint}updateSignatureLFQForm/${formId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (res.status === 200 || res.status === 201) {
                setIsEdit(false);
                fetchLFQForm(caseInfo?._id);
                showSuccess("Form Signature Submitted successfully!");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showError("We encountered an issue while submitting your form. Please try again later.");
        }
    };



    const handleAccept = async (e) => {
        e.preventDefault();
        showLoading()

        try {

            const res = await axios.put(
                `${ApiEndPoint}accpetLFQForm/${formId}`,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (res.status === 200 || res.status === 201) {
                setIsEdit(false);
                if (LinkcaseId && !showLinkGenerator) {

                    fetchLFQForm(LinkcaseId);
                } else {

                    fetchLFQForm(caseInfo?._id);
                }
                showSuccess("Form Approved successfully!");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showError("We encountered an issue while submitting your form. Please try again later.");
        }
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

    const getBase64ImageFromUrl = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

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

    pdfMake.vfs = pdfFonts.pdfMake?.vfs;

    const downloadCasePdf = async (data) => {


        const logoBase64 = logo ? await getBase64ImageFromUrl(logo) : null;
        const AWSSideLogoBase64 = logo ? await getBase64ImageFromUrl(AWSSideLogo) : null;
        const ShudAWSSideLogoBase64 = logo ? await getBase64ImageFromUrl(AWSlegalServices) : null;
        const AWSSideLogo1Base64 = logo ? await getBase64ImageFromUrl(AWSSideLogo1) : null;

        const preparedBySignBase64 = data?.preparedBySignpath
            ? await getSignBase64FromServer(data.preparedBySignpath)
            : null;

        const FillpreparedBy = getAllOpsteam.find(op => op._id === data.preparedBy);
        const FillapprovedBy = getAllOpsteam.find(op => op._id === data.approvedBy);
        const FillseniorLawyer = getAllOpsteam.find(op => op._id === data.seniorLawyer?.name);
        const FillassociateLawyer = getAllOpsteam.find(op => op._id === data.associateLawyer?.name);

        let value = data.clientCategory?.[0];
        let parsedArray = Array.isArray(value) ? value : (value ? JSON.parse(value) : []);
        let formattedclientCategory = Array.isArray(parsedArray) ? parsedArray.join(", ") : "-";

        const approvedBySignBase64 = data.isApproved ? await getBase64ImageFromUrl(Stamp) : null;

        // === BRAND/LAYOUT CONTROLS ===
        const sidebarWidth = 45;
        const BAR_COLOR = "#18273e";

        // Big watermark settings (center of page)
        const WM_OPACITY = 0.06;

        // Side "AWS" word settings for header/bottom only
        const AWS_SIDE_FONT = 46;    // smaller so we can fit 3/4 comfortably
        const AWS_SIDE_OPACITY = 0.8;
        const AWS_SIDE_X = 1;       // inside the strip

        // Header sizing (logo + 3 lines)
        const HEADER_HEIGHT = 90;

        const docDefinition = {
            background: (currentPage, pageSize) => {
                const elems = [
                    // Left strip
                    {
                        canvas: [{
                            type: "rect",
                            x: 0, y: 0, w: sidebarWidth, h: pageSize.height, color: BAR_COLOR
                        }]
                    }
                ];

                // Center faint watermark (logo)
                if (logoBase64) {
                    const wmWidth = Math.min(360, pageSize.width * 0.45);
                    const wmX = (pageSize.width - wmWidth) / 2;
                    const wmY = (pageSize.height - wmWidth) / 2;

                    elems.push({
                        image: logoBase64,
                        width: wmWidth,
                        opacity: WM_OPACITY,
                        absolutePosition: { x: wmX, y: wmY }
                    });
                }

                // Bottom-left strip "AWS" (4 times)
                // Replace the 4x loop with a single bottom-left logo
                const bottomPadding = 8;
                const AWS_SIDE_LOGO_SIZE = 45; // adjust size as needed
                const AWS_SIDE_LOGO_width = 45; // adjust size as needed
                // place it a bit above bottom with small left offset (matches previous AWS_SIDE_X-10)
                const bottomY = pageSize.height - bottomPadding - AWS_SIDE_LOGO_SIZE - 6;

                if (AWSSideLogo1Base64) {
                    elems.push({
                        image: AWSSideLogo1Base64,
                        width: AWS_SIDE_LOGO_width,
                        height: AWS_SIDE_LOGO_SIZE,
                        opacity: AWS_SIDE_OPACITY,
                        absolutePosition: { x: AWS_SIDE_X, y: bottomY }
                    });
                } else {
                    // fallback text if no logo
                    elems.push({
                        text: "AWS",
                        bold: true,
                        fontSize: AWS_SIDE_FONT,
                        color: "#ffffff",
                        opacity: AWS_SIDE_OPACITY,
                        absolutePosition: { x: AWS_SIDE_X - 10, y: bottomY }
                    });
                }


                return elems;
            },

            // Shift content right & below header
            pageMargins: [sidebarWidth + 30, HEADER_HEIGHT + 35, 40, 60],

            // HEADER (with side-strip logo added)
            header: (currentPage, pageCount, pageSize) => {

                const headerBandTop = 0;
                const startY = headerBandTop + 0;
                const stepY = AWS_SIDE_FONT + 8;
                const headerAWS = [];

                const STRIP_LOGO_SIZE = 45;                            // adjust if needed
                const stripLogoX = Math.round((sidebarWidth - STRIP_LOGO_SIZE) / 2);
                const stripLogoY = 10;                                 // distance from page top
                const stripLogo = (AWSSideLogo
                    ? {
                        image: AWSSideLogoBase64,
                        width: STRIP_LOGO_SIZE,
                        height: STRIP_LOGO_SIZE + 20,
                        absolutePosition: { x: stripLogoX, y: stripLogoY }
                    }
                    : { text: "" });

                return {
                    margin: [sidebarWidth + 20, 15, 20, 0],
                    stack: [

                        stripLogo,
                        ...headerAWS,
                        !AWSPDFdownload ?
                            {
                                columns: [
                                    logoBase64
                                        ? { image: logoBase64, width: 70, height: 70, margin: [0, 0, 10, 0] }
                                        : { text: "" },
                                    {
                                        stack: [
                                            { text: "LEGAL", fontSize: 22, bold: true, color: "#576583", margin: [0, 6, 0, 0], lineHeight: 1.1 },
                                            { text: "SUHAD ALJUBOORI", fontSize: 12, bold: true, color: "#576583", margin: [0, 2, 0, 0], lineHeight: 1.1 },
                                            {
                                                text: "ADVOCATES & LEGAL CONSULTANTS",
                                                fontSize: 9,
                                                color: "#8a96b2",
                                                margin: [0, 2, 0, 0],
                                                characterSpacing: 1,
                                                lineHeight: 1.15
                                            }
                                        ]
                                    }
                                ]
                            }
                            :
                            {
                                columns: [
                                    logoBase64
                                        ? { image: ShudAWSSideLogoBase64, width: 300, height: 70, margin: [0, 0, 10, 0] }
                                        : { text: "" },
                                    // {
                                    //     stack: [
                                    //         { text: "LEGAL", fontSize: 22, bold: true, color: "#576583", margin: [0, 6, 0, 0], lineHeight: 1.1 },
                                    //         { text: "SUHAD ALJUBOORI", fontSize: 12, bold: true, color: "#576583", margin: [0, 2, 0, 0], lineHeight: 1.1 },
                                    //         {
                                    //             text: "ADVOCATES & LEGAL CONSULTANTS",
                                    //             fontSize: 9,
                                    //             color: "#8a96b2",
                                    //             margin: [0, 2, 0, 0],
                                    //             characterSpacing: 1,
                                    //             lineHeight: 1.15
                                    //         }
                                    //     ]
                                    // }
                                ]
                            }
                    ]
                };
            },



            // FOOTER + put "AWS" on the left strip (BOTTOM AREA ONLY, 4 times)

            footer: (currentPage, pageCount, pageSize) => {
                const footerHeight = 70;

                const footerText =

                    !AWSPDFdownload ? "P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nTel: +971 (04) 332 5928, web: aws-legalgroup.com,\n email: info@awsadvocates.com"
                        :
                        "Dubai: 1 Sheikh Zayed Road, The H Dubai, Floor 1602\n (04) 5547635 ,  +971 527652221\ninfo@awsadvocates.com\nwww.awslaw.ae";


                return {
                    margin: [0, -10, 0, 0],
                    stack: [
                        // Gray footer bar that does NOT cover the left strip
                        {
                            canvas: [
                                {
                                    type: "rect",
                                    x: sidebarWidth,
                                    y: 0,
                                    w: pageSize.width - sidebarWidth,
                                    h: footerHeight,
                                    color: "#f5f5f5"
                                }
                            ]
                        },
                        // Footer content on the right
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
                                            margin: [0, -60, 0, 0]
                                        }
                                    ]
                                },
                                {
                                    text: `Page ${currentPage} of ${pageCount}`,
                                    alignment: "right",
                                    margin: [0, -60, 40, 0],
                                    fontSize: 8,
                                    color: "#333333"
                                }
                            ]
                        }
                    ]
                };
            },




            content: [
                { text: "Client & Case Information", style: "header", margin: [0, 10, 0, 10] },
                {
                    table: {
                        widths: ["35%", "65%"],
                        body: [
                            [{ text: "Client Name", style: "label" }, { text: data?.clientName || "-", style: "value" }],
                            [{ text: "Client Email", style: "label" }, { text: data?.clientEmail || "-", style: "value" }],
                            [{ text: "Client Contact Number", style: "label" }, { text: data?.clientContactphone || "-", style: "value" }],
                            [
                                { text: "Date of Meeting", style: "label" },
                                { text: data?.dateOfClientMeeting ? new Date(data.dateOfClientMeeting).toLocaleDateString() : "-", style: "value" }
                            ],
                            [{ text: "Matter / Case Reference", style: "label" }, { text: data?.matterReference || "-", style: "value" }],
                            [{ text: "Case Type", style: "label" }, { text: data?.caseType || "-", style: "value" }],
                            [{ text: "Jurisdiction", style: "label" }, { text: data?.jurisdiction || "-", style: "value" }],
                            [{ text: "Local Counsel Required", style: "label" }, { text: data?.localCounselRequired || "-", style: "value" }],
                            [{ text: "Est. Local Counsel Hours", style: "label" }, { text: data?.estLocalCounselHours || "-", style: "value" }]
                        ]
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 10, 0, 20]
                },

                { text: "Case Complexity & Stakes", style: "header", margin: [0, 20, 0, 10] },
                {
                    table: {
                        widths: ["35%", "65%"],
                        body: [
                            [{ text: "Case Complexity Level", style: "label" }, { text: data?.complexityLevel || "-", style: "value" }],
                            [
                                { text: "Amount at Stake (Claim/Defense Value)", style: "label" },
                                { text: `${data?.amountAtStake || "-"} AED`, style: "value" }
                            ],
                            [
                                { text: "Estimated Case Duration", style: "label" },
                                { text: data?.estimatedCaseDuration || "-", style: "value" }
                            ]
                        ]
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 10, 0, 20]
                },

                { text: "Client Profile & Relationship", style: "header", margin: [0, 20, 0, 10] },
                {
                    table: {
                        widths: ["35%", "65%"],
                        body: [
                            [
                                { text: "Client Category", style: "label" },
                                {
                                    text:
                                        Array.isArray(data?.clientCategory) && data.clientCategory.length > 0
                                            ? formattedclientCategory
                                            : "-",
                                    style: "value"
                                }
                            ],
                            [{ text: "Referred By", style: "label" }, { text: data?.referredBy || "-", style: "value" }],
                            [{ text: "Retainer Details", style: "label" }, { text: data?.retainerDetails || "-", style: "value" }],
                            [{ text: "Communication Needs", style: "label" }, { text: data?.communicationNeeds || "-", style: "value" }],
                            [{ text: "Notes on Client Personality / Expectations", style: "label" }, { text: data?.clientNotes || "-", style: "value" }]
                        ]
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 10, 0, 20]
                },

                { text: "Fee Proposal & Pricing", style: "header", margin: [0, 10, 0, 10] },
                {
                    table: {
                        widths: ["35%", "65%"],
                        body: [
                            [{ text: "Proposed Fee Structure", style: "label" }, { text: data?.feeStructure || "-", style: "value" }],
                            [{ text: "Other Fee (if applicable)", style: "label" }, { text: data?.otherFee || "-", style: "value" }],
                            [{ text: "Hourly Rates (if Hourly)", style: "label" }, { text: data?.hourlyRates || "-", style: "value" }],
                            [{ text: "Fixed Fee Amount (if Fixed Fee)", style: "label" }, { text: data?.fixedFee || "-", style: "value" }],
                            [{ text: "Scope of Work:", style: "label" }, { text: data?.ScopeOfWork || "-", style: "value" }],
                            [{ text: "Special Terms / Considerations", style: "label" }, { text: data?.specialTerms || "-", style: "value" }],
                            [{ text: "Key Factors Affecting Fee", style: "label" }, { text: data?.keyFactors || "-", style: "value" }]
                        ]
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 10, 0, 20]
                },

                { text: "Resource & Effort Estimation", style: "header", margin: [0, 20, 0, 10] },
                {
                    table: {
                        widths: ["40%", "40%", "20%"],
                        body: [
                            [
                                { text: "Resource Type", style: "tableHeader" },
                                { text: "Name / Role", style: "tableHeader" },
                                { text: "Est. Hours", style: "tableHeader" }
                            ],
                            [{ text: "Senior Lawyer", style: "label" }, { text: FillseniorLawyer?.UserName || "-", style: "value" }, { text: data?.seniorLawyer?.estHours || "-", style: "value" }],
                            [{ text: "Associate Lawyer(s)", style: "label" }, { text: FillassociateLawyer?.UserName || "-", style: "value" }, { text: data?.associateLawyer?.estHours || "-", style: "value" }],
                            [{ text: "Local Counsel", style: "label" }, { text: data?.resourceLocalCounsel?.name || "-", style: "value" }, { text: data?.resourceLocalCounsel?.estHours || "-", style: "value" }],
                            [{ text: "Paralegal / Support Staff", style: "label" }, { text: data?.paralegalSupport?.role || "-", style: "value" }, { text: data?.paralegalSupport?.estHours || "-", style: "value" }],
                            [{ text: "Other Resources", style: "label" }, { text: data?.otherResources?.description || "-", style: "value" }, { text: data?.otherResources?.estHours || "-", style: "value" }],
                            [{ text: "Total Estimated Hours", style: "labelBold" }, { text: "", style: "value" }, { text: data?.totalEstimatedHours || "-", style: "labelBold" }]
                        ]
                    },
                    layout: "lightHorizontalLines",
                    margin: [0, 10, 0, 20]
                },

                {
                    unbreakable: true,
                    stack: [
                        { text: "Approvals", style: "header", margin: [0, 20, 0, 10] },
                        {
                            table: {
                                widths: approvedBySignBase64 ? ["50%", "50%"] : ["100%"],
                                body: [
                                    [
                                        {
                                            stack: [
                                                { text: `Name: ${FillpreparedBy?.UserName || "-"}`, style: "value", margin: [0, 0, 0, 4] },
                                                { text: `Date: ${data?.preparedDate ? new Date(data.preparedDate).toLocaleDateString() : "-"}`, style: "value" },
                                                data?.preparedBySignpath
                                                    ? { image: preparedBySignBase64, width: 120, height: 60, margin: [0, 5, 0, 2] }
                                                    : { text: "Signature: ", style: "value" },
                                                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 5] },
                                                { text: "Prepared by Senior Lawyer", style: "subHeader", margin: [0, 0, 0, 8] }
                                            ]
                                        },
                                        // ...(approvedBySignBase64
                                        // ? [{
                                        //     stack: [
                                        //         { text: `Name: ${FillapprovedBy?.UserName || "Admin"}`, style: "value", margin: [0, 0, 0, 4] },
                                        //         {
                                        //             text: `Date: ${data?.approvedDate
                                        //                 ? new Date(data.approvedDate).toLocaleDateString()
                                        //                 : (data?.preparedDate ? new Date(data.preparedDate).toLocaleDateString() : "-")
                                        //                 }`,
                                        //             style: "value"
                                        //         },
                                        //         { image: approvedBySignBase64, width: 60, height: 60, margin: [0, 5, 0, 2] },
                                        //         { canvas: [{ type: "line", x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 5] },
                                        //         { text: "Reviewed & Approved by Chairman", style: "subHeader", margin: [0, 0, 0, 8] }
                                        //     ]
                                        // }]
                                        // : [])
                                    ]
                                ]
                            },
                            layout: "lightHorizontalLines",
                            margin: [0, 10, 0, 20]
                        }
                    ]
                }
            ],

            styles: {
                pdfTitle: { fontSize: 16, bold: true, color: "#0d6efd" },
                header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10], color: "#0d6efd" },
                tableHeader: { bold: true, fontSize: 12, fillColor: "#f1f1f1", margin: [0, 3, 0, 3] },
                label: { bold: true, fontSize: 11, color: "#000", margin: [0, 3, 0, 3] },
                labelBold: { bold: true, fontSize: 12, color: "#0d6efd", margin: [0, 3, 0, 3] },
                value: { fontSize: 11, color: "#333", margin: [0, 3, 0, 3] },
                subHeader: { italics: true, color: "#333" }
            },
            defaultStyle: { fontSize: 10 }
        };

        pdfMake.createPdf(docDefinition).download(`Legal_Fee_Quotation_(${data?.clientName || "Client"}).pdf`);
    };



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
            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove the chairman's signature and edit the form?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmEdit}>
                        Yes, Remove Signature
                    </Button>
                </Modal.Footer>
            </Modal>

            {(token?.Role === "lawyer" || dataFound) ?
                <div className="container my-4">
                    <div className="d-flex justify-content-end mb-3 gap-2">
                        {(showLinkGenerator && token?.Role !== "client") &&
                            <button className="d-flex align-items-center" style={{
                                backgroundColor: "#16213e",
                                color: "white",
                                width: "150px",
                                minWidth: "100px",
                                maxWidth: "200px",
                                padding: "8px 20px",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "pointer",
                                textAlign: "center",
                                border: "2px solid #16213e",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                fontWeight: "500",
                            }}
                                onClick={handleGenerateLink}>
                                Generate Shareable Link
                            </button>
                        }
                        <button
                            onClick={handleDownload}
                            className="d-flex align-items-center justify-content-center"
                            style={buttonStyle}
                        >
                            Download LFQ PDF
                        </button>

                        {/* Modal */}
                        <Modal
                            show={showdownloadModal}
                            onHide={() => setShowdownloadModal(false)}
                            centered
                            backdrop="static"
                        >
                            <Modal.Body className="text-center" style={{ padding: "30px" }}>
                                <h5 style={{ color: "#16213e", marginBottom: "20px" }}>
                                    which you want to download the LFQ PDF?
                                </h5>

                                <div className="d-flex justify-content-center gap-3">
                                    <button
                                        onClick={handleDownload}
                                        style={buttonStyle}
                                    >
                                        AWS Legal Suhad Aljuboori
                                    </button>
                                    <button
                                        onClick={handleShudDownloadPdf}
                                        style={buttonStyle}
                                    >
                                        AWS Legal Consultancy
                                    </button>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>

                    <div className="card p-3 mb-4" data-html2canvas-ignore="true">
                        <label className="form-label fw-bold fs-6">Select Letterhead Type</label>
                        <div className="d-flex gap-3">
                            <Form.Check
                                type="radio"
                                id="suhad-radio"
                                label="Suhad Letterhead"
                                name="letterheadType"
                                checked={!AWSPDFdownload}
                                onChange={() => setAWSPDFdownload(false)}
                            />
                            <Form.Check
                                type="radio"
                                id="aws-radio"
                                label="AWS Letterhead"
                                name="letterheadType"
                                checked={AWSPDFdownload}
                                onChange={() => setAWSPDFdownload(true)}
                            />
                        </div>

                        <small className="text-muted">
                            {!AWSPDFdownload === true ? 'Suhad Letterhead - Litigation Services' : 'AWS Letterhead - Legal Services'}
                        </small>
                    </div>

                    <div className={showLinkGenerator ? "container py-4" : "card mb-2 p-4"}>
                        {token?.Role !== "client" && showLinkGenerator &&
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Drafts <span className="text-danger"></span>
                                </Form.Label>
                                <InputGroup>
                                    <Dropdown className="w-100">
                                        <Dropdown.Toggle
                                            variant="outline-secondary"
                                            id="dropdown-practice-area"
                                            disabled={dataFound}
                                            className="w-100 text-start d-flex justify-content-between align-items-center"
                                        >
                                            {selectedDrafts === "Select Draft" ? "Select Draft" : `${selectedDrafts?.matterReference}`}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="w-100">
                                            {getDrafts?.map((data, index) => (
                                                <Dropdown.Item key={index} onClick={() => {
                                                    setSelectedDrafts(data)
                                                    // setClientName(data.clientName || "");
                                                    // setclientContactInfo(data.clientEmail || "");
                                                    // setclientContactphone(data.clientContactphone || "");
                                                    if (data.dateOfClientMeeting) {
                                                        const date = new Date(data.dateOfClientMeeting);
                                                        setDateValue(
                                                            `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
                                                        );
                                                    } else {
                                                        setDateValue("");
                                                    }
                                                    setJurisdiction(data.jurisdiction || "");
                                                    setLocalCounsel(data.localCounselRequired || "");
                                                    setLocalCounselHours(data.estLocalCounselHours || "");
                                                    setComplexity(data.complexityLevel || "");
                                                    setAmountAtStake(data.amountAtStake || "");
                                                    setestimatedDuration(data.estimatedCaseDuration || "");
                                                    setSeniorName(data.seniorLawyer?.name || "");
                                                    setSeniorHours(data.seniorLawyer?.estHours || "");
                                                    setAssociateName(data.associateLawyer?.name || "");
                                                    setAssociateHours(data.associateLawyer?.estHours || "");
                                                    setResourceLocalCounsel(data.resourceLocalCounsel?.name || "");
                                                    setResourceLocalCounselHours(data.resourceLocalCounsel?.estHours || "");
                                                    setParalegal(data.paralegalSupport?.role || "");
                                                    setParalegalHours(data.paralegalSupport?.estHours || "");
                                                    setOtherResources(data.otherResources?.description || "");
                                                    setOtherResourceHours(data.otherResources?.estHours || "");
                                                    setTotalHours(data.totalEstimatedHours || "");
                                                    if (Array.isArray(data.clientCategory) && data.clientCategory.length > 0) {
                                                        try {
                                                            setClientCategory(JSON.parse(data.clientCategory[0]));
                                                        } catch {
                                                            setClientCategory(data.clientCategory);
                                                        }
                                                    } else {
                                                        setClientCategory([]);
                                                    }
                                                    setReferredBy(data.referredBy || "");
                                                    setRetainerDetails(data.retainerDetails || "");
                                                    setCommunication(data.communicationNeeds || "");
                                                    setClientNotes(data.clientNotes || "");
                                                    setFeeStructure(data.feeStructure || "");
                                                    setOtherFee(data.otherFee || "");
                                                    setHourlyRates(data.hourlyRates || "");
                                                    setFixedFee(data.fixedFee || "");
                                                    setSpecialTerms(data.specialTerms || "");
                                                    setScopeOfWork(data.ScopeOfWork || "");
                                                    setKeyFactors(data.keyFactors || "");
                                                }}>
                                                    {data?.matterReference}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </InputGroup>
                            </Form.Group>
                        }

                        <div className="text-center mb-4">
                            <img
                                src="logo.png"
                                alt="Logo"
                                style={{ height: "60px" }}
                                className="img-fluid"
                            />
                        </div>

                        <h3 className="text-center fw-bold mb-2">
                            Client Case Evaluation & Fee Quotation Form <small className="text-muted">(Internal Use)</small>
                        </h3>
                    </div>

                    <div className="card shadow-sm border-0 rounded-3 mb-4">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3 text-primary">Client & Case Information</h5>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Client Name</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={(e) => setClientName(e.target.value)}
                                        value={clientName}
                                        placeholder="Enter client name"
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Client Contact Email</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={(e) => setclientContactInfo(e.target.value)}
                                        value={clientContactInfo}
                                        placeholder="Email"
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Client Contact Number</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        onChange={(e) => setclientContactphone(e.target.value)}
                                        value={clientContactphone}
                                        placeholder="Phone Number"
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">Date of Client Meeting</label>
                                    <div className="input-group">
                                        <DatePicker
                                            selected={
                                                dateValue ? new Date(dateValue.split("/").reverse().join("-")) : null
                                            }
                                            onChange={(date) => {
                                                if (date) {
                                                    const day = String(date.getDate()).padStart(2, "0");
                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                    const year = date.getFullYear();
                                                    setDateValue(`${day}/${month}/${year}`);
                                                }
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control"
                                            placeholderText="dd/mm/yyyy"
                                            wrapperClassName="w-100"
                                            disabled={(dataFound || isclient)}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3 align-items-center">
                                    <label className="col-md-3 col-form-label fw-bold">
                                        Matter / Case Reference
                                    </label>
                                    <div className="col-md-9">
                                        <span className="fw-normal">{matterReference}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3 align-items-center">
                                <label className="col-md-3 col-form-label fw-bold">
                                    Type of Case
                                </label>
                                <div className="col-md-9">
                                    <span className="fw-normal">{caseType}</span>
                                </div>
                            </div>

                            <div className="row mb-3 align-items-center">
                                <label className="col-md-3 col-form-label fw-bold">
                                    Jurisdiction
                                </label>
                                <div className="col-md-9">
                                    {["UAE Local Courts", "DIFC Courts", "Arbitration", "Other"].map((court) => (
                                        <div className="form-check form-check-inline" key={court}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="jurisdiction"
                                                value={court}
                                                checked={jurisdiction === court}
                                                onChange={(e) => setJurisdiction(e.target.value)}
                                                disabled={dataFound || isclient}
                                            />
                                            <label className="form-check-label fw-normal">{court}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="row mb-3 align-items-center">
                                <label className="col-md-3 col-form-label fw-bold">
                                    Local Counsel Required (UAE law)
                                </label>
                                <div className="col-md-9">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="localCounsel"
                                            value="yes"
                                            checked={localCounsel === "yes"}
                                            onChange={() => setLocalCounsel("yes")}
                                            disabled={dataFound || isclient}
                                        />
                                        <label className="form-check-label fw-normal">Yes</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="localCounsel"
                                            value="no"
                                            checked={localCounsel === "no"}
                                            onChange={() => setLocalCounsel("no")}
                                            disabled={dataFound || isclient}
                                        />
                                        <label className="form-check-label fw-normal">No</label>
                                    </div>

                                    {localCounsel === "yes" && (
                                        <div className="mt-2">
                                            <label className="form-label fw-bold">If Yes, Est. Local Counsel Hours</label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                value={localCounselHours}
                                                onChange={(e) => setLocalCounselHours(e.target.value)}
                                                placeholder="Hours"
                                                disabled={dataFound || isclient}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-3 mb-4">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3 text-primary">Case Complexity & Stakes</h5>
                            <div className="row mb-3 align-items-center">
                                <label className="col-md-3 col-form-label fw-bold">
                                    Case Complexity Level
                                </label>
                                <div className="col-md-9">
                                    <span className="fw-normal">{complexity}</span>
                                </div>
                            </div>
                            <div className="row mb-3 align-items-center">
                                <label className="col-md-3 col-form-label fw-bold">
                                    Amount at Stake (Claim/Defense Value)
                                </label>
                                <div className="col-md-9">
                                    <div className="input-group">
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={AmountatStake}
                                            onChange={(e) => setAmountAtStake(e.target.value)}
                                            placeholder="Enter amount"
                                            disabled={dataFound || isclient}
                                        />
                                        <span className="input-group-text">AED</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-0 align-items-center">
                                <label className="col-md-3 col-form-label fw-bold">
                                    Estimated Case Duration
                                </label>
                                <div className="col-md-9">
                                    <input
                                        className="form-control"
                                        value={estimatedDuration}
                                        onChange={(e) => setestimatedDuration(e.target.value)}
                                        type="text"
                                        placeholder="e.g. 3-6 months; note any urgent deadlines"
                                        disabled={dataFound || isclient}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-3 mb-4">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3 text-primary">Resource & Effort Estimation</h5>
                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label fw-semibold">Senior Lawyer:</label>
                                <div className="col-sm-5">
                                    <select
                                        className="form-select"
                                        value={seniorName}
                                        onChange={(e) => setSeniorName(e.target.value)}
                                        disabled={(dataFound || isclient)}
                                    >
                                        <option value="">Select Senior Lawyer</option>
                                        {seniorLawyers.map((name, index) => (
                                            <option key={index} value={name._id}>{name?.UserName}</option>
                                        ))}
                                    </select>
                                </div>
                                <label className="col-sm-2 col-form-label text-end fw-semibold">Est. Hours:</label>
                                <div className="col-sm-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Hours"
                                        value={seniorHours}
                                        onChange={(e) => {
                                            setSeniorHours(e.target.value)
                                            setTotalHours(Number(e.target.value) + Number(associateHours) + Number(ResourcelocalCounselHours) + Number(paralegalHours) + Number(otherResourceHours))
                                        }}
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label fw-semibold">Associate Lawyer(s):</label>
                                <div className="col-sm-5">
                                    <select
                                        className="form-select"
                                        value={associateName}
                                        onChange={(e) => setAssociateName(e.target.value)}
                                        disabled={(dataFound || isclient)}
                                    >
                                        <option value="">Select Associate</option>
                                        {seniorLawyers.map((name, index) => (
                                            <option key={index} value={name?._id}>{name?.UserName}</option>
                                        ))}
                                    </select>
                                </div>
                                <label className="col-sm-2 col-form-label text-end fw-semibold">Est. Hours:</label>
                                <div className="col-sm-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Hours"
                                        value={associateHours}
                                        onChange={(e) => {
                                            setAssociateHours(e.target.value)
                                            setTotalHours(Number(seniorHours) + Number(e.target.value) + Number(ResourcelocalCounselHours) + Number(paralegalHours) + Number(otherResourceHours))
                                        }}
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label fw-semibold">Local Counsel (if any):</label>
                                <div className="col-sm-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={ResourcelocalCounsel}
                                        onChange={(e) => setResourceLocalCounsel(e.target.value)}
                                        placeholder="Enter Local Counsel"
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                                <label className="col-sm-2 col-form-label text-end fw-semibold">Est. Hours:</label>
                                <div className="col-sm-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Hours"
                                        value={ResourcelocalCounselHours}
                                        onChange={(e) => {
                                            setResourceLocalCounselHours(e.target.value)
                                            setTotalHours(Number(seniorHours) + Number(associateHours) + Number(e.target.value) + Number(paralegalHours) + Number(otherResourceHours))
                                        }}
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label fw-semibold">Paralegal/Support Staff:</label>
                                <div className="col-sm-5">
                                    <select
                                        className="form-select"
                                        value={paralegal}
                                        onChange={(e) => setParalegal(e.target.value)}
                                        disabled={(dataFound || isclient)}
                                    >
                                        <option value="">Select Role</option>
                                        {paralegalStaff.map((role, index) => (
                                            <option key={index} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                                <label className="col-sm-2 col-form-label text-end fw-semibold">Est. Hours:</label>
                                <div className="col-sm-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Hours"
                                        value={paralegalHours}
                                        onChange={(e) => {
                                            setParalegalHours(e.target.value)
                                            setTotalHours(Number(seniorHours) + Number(associateHours) + Number(ResourcelocalCounselHours) + Number(e.target.value) + Number(otherResourceHours))
                                        }}
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                            </div>
                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label fw-semibold">Other Resources (Experts, etc.):</label>
                                <div className="col-sm-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Specify resource"
                                        value={otherResources}
                                        onChange={(e) => setOtherResources(e.target.value)}
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                                <label className="col-sm-2 col-form-label text-end fw-semibold">Est. Hours:</label>
                                <div className="col-sm-2">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Hours"
                                        value={otherResourceHours}
                                        onChange={(e) => {
                                            setOtherResourceHours(e.target.value)
                                            setTotalHours(Number(seniorHours) + Number(associateHours) + Number(ResourcelocalCounselHours) + Number(paralegalHours) + Number(e.target.value))
                                        }}
                                        disabled={(dataFound || isclient)}
                                    />
                                </div>
                            </div>
                            <div className="mb-0 row align-items-center border-top pt-3">
                                <label className="col-sm-7 col-form-label fw-bold text-primary">
                                    Total Estimated Hours (all resources):
                                </label>
                                <div className="col-sm-2">
                                    <input
                                        type="number"
                                        className="form-control fw-bold"
                                        placeholder="Total"
                                        value={totalHours}
                                        onChange={(e) => setTotalHours(e.target.value)}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-3 mb-4">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3 text-primary">Client Profile & Relationship</h5>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Client Category:</label>
                                <div className="d-flex flex-wrap gap-4 ms-md-3">
                                    {[
                                        "New Client",
                                        "Existing Client",
                                        "Retainer Client",
                                        "Referral",
                                        "VIP/Key Client"
                                    ].map((type) => (
                                        <div className="form-check" key={type}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={type}
                                                value={type}
                                                checked={clientCategory.includes(type)}
                                                onChange={handleCategoryChange}
                                                disabled={(dataFound || isclient)}
                                            />
                                            <label className="form-check-label" htmlFor={type}>
                                                {type}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-3 ms-md-4">
                                {clientCategory.includes("Referral") && (
                                    <div className="mb-2">
                                        <label className="form-label small fw-semibold">
                                            If Referral – Referred By:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm w-50"
                                            placeholder="Enter name"
                                            value={referredBy}
                                            onChange={(e) => setReferredBy(e.target.value)}
                                            disabled={(dataFound || isclient)}
                                        />
                                    </div>
                                )}
                                {clientCategory.includes("Retainer Client") && (
                                    <div>
                                        <label className="form-label small fw-semibold">
                                            If Retainer Client – Retainer Details:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm w-75"
                                            placeholder="e.g. monthly fee or hours covered"
                                            value={retainerDetails}
                                            onChange={(e) => setRetainerDetails(e.target.value)}
                                            disabled={(dataFound || isclient)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Client Communication Needs:</label>
                                <div className="d-flex flex-wrap gap-4 ms-md-3">
                                    {[
                                        "Low (infrequent updates)",
                                        "Medium (regular updates)",
                                        "High (frequent updates)"
                                    ].map((level) => (
                                        <div className="form-check" key={level}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="communication"
                                                id={level}
                                                value={level}
                                                checked={communication === level}
                                                onChange={(e) => setCommunication(e.target.value)}
                                                disabled={(dataFound || isclient)}
                                            />
                                            <label className="form-check-label" htmlFor={level}>
                                                {level}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-0 ms-md-3">
                                <label className="form-label fw-semibold">
                                    Notes on Client Personality / Expectations:
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="Enter notes"
                                    value={clientNotes}
                                    onChange={(e) => setClientNotes(e.target.value)}
                                    disabled={(dataFound || isclient)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4 shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="fw-bold mb-4">Fee Proposal & Pricing</h5>
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
                                                disabled={(dataFound || isclient)}
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
                                            disabled={(dataFound || isclient)}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="mb-3 ms-4">
                                {feeStructure === "Hourly-billed" && (
                                    <>
                                        <label className="form-label">If Hourly: Proposed hourly rates & cap:</label>
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="e.e. Senior AED ___/hr, Associate AED ___/hr"
                                            value={hourlyRates}
                                            onChange={(e) => setHourlyRates(e.target.value)}
                                            disabled={(dataFound || isclient)}
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
                                            disabled={(dataFound || isclient)}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Scope of Work:</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="Enter the work Scope"
                                    value={ScopeOfWork}
                                    onChange={(e) => setScopeOfWork(e.target.value)}
                                    disabled={(dataFound || isclient)}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold">Special Terms or Considerations:</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="e.g. advance retainer, installment plan, success fee conditions"
                                    value={specialTerms}
                                    onChange={(e) => setSpecialTerms(e.target.value)}
                                    disabled={(dataFound || isclient)}
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">Key Factors Affecting Fee:</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="e.g. high amount at stake, urgent timelines, demanding client expectations"
                                    value={keyFactors}
                                    onChange={(e) => setKeyFactors(e.target.value)}
                                    disabled={(dataFound || isclient)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-3 mt-4">
                        <div className="card-body">
                            <h5 className="fw-bold mb-4">Approvals</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card shadow-sm border-0 rounded-3 mb-4">
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-4">Prepared by (Senior Lawyer)</h5>
                                            <div className="row g-3 align-items-start">
                                                <div className="col-12 mb-3">
                                                    <label className="form-label fw-semibold">Name:</label>
                                                    <select
                                                        className="form-select"
                                                        value={preparedBy}
                                                        onChange={(e) => setPreparedBy(e.target.value)}
                                                        disabled={true}
                                                    >
                                                        <option value="">Select Lawyer</option>
                                                        {seniorLawyers.map((name, index) => (
                                                            <option key={index} value={name?._id}>{name?.UserName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="col-12 mb-3">
                                                    <label className="form-label fw-semibold">Signature:</label>
                                                    {(!dataFound && !isclient) && (
                                                        <Form_SignaturePad height={200} onSave={handlepreparedBySign} />
                                                    )}
                                                    {preparedBySign && (
                                                        <div className="mt-2 text-center">
                                                            <img
                                                                src={preparedBySign}
                                                                alt="Lawyer Signature"
                                                                className="img-fluid border rounded"
                                                                style={{ maxHeight: "150px" }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold">Date:</label>
                                                    <DatePicker
                                                        selected={preparedDate ? new Date(preparedDate.split("/").reverse().join("-")) : null}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const day = String(date.getDate()).padStart(2, "0");
                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                const year = date.getFullYear();
                                                                setPreparedDate(`${day}/${month}/${year}`);
                                                            }
                                                        }}
                                                        disabled={(dataFound || isclient)}
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control"
                                                        placeholderText="dd/mm/yyyy"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* {(LFQData?.isApproved && dataFound) && (
                                    <div className="col-md-6">
                                        <div className="card shadow-sm border-0 rounded-3 mb-4">
                                            <div className="card-body">
                                                <h5 className="fw-bold mb-4">Reviewed & Approved by (Chairman)</h5>
                                                <div className="row g-3 align-items-start">
                                                    <div className="col-12 mb-3">
                                                        <label className="form-label fw-semibold">Name: Admin</label>
                                                     
                                                    </div>
                                                 
                                                    <div className="col-12 mb-3">
                                                        <label className="form-label fw-semibold">Stamp:</label>

                                                     

                                                        <div className="mt-2 text-center">
                                                            
                                                            <img
                                                                src={Stamp}
                                                                alt="Chairman Signature"
                                                                className="img-fluid border rounded"
                                                                style={{ maxHeight: "150px" }}
                                                            />
                                                        </div>

                                                    </div>

                                                  
                                                    <div className="col-12">
                                                        <label className="form-label fw-semibold">Date:</label>
                                                        <DatePicker
                                                            selected={preparedDate ? new Date(preparedDate.split("/").reverse().join("-")) : null}
                                                            onChange={(date) => {
                                                                if (date) {
                                                                    const day = String(date.getDate()).padStart(2, "0");
                                                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                    const year = date.getFullYear();
                                                                    setPreparedDate(`${day}/${month}/${year}`);
                                                                }
                                                            }}
                                                            disabled={(dataFound || isclient)}
                                                            dateFormat="dd/MM/yyyy"
                                                            className="form-control"
                                                            placeholderText="dd/mm/yyyy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>

                    {/* Submit button */}
                    {(!dataFound && !isEdit && !isclient) &&
                        <div className="d-flex justify-content-center gap-2 gap-md-3 mt-4 mb-4 flex-wrap">
                            <div className="btn btn-primary fw-bold px-4" onClick={handleSubmit}>Save and Submit Form</div>
                        </div>
                    }

                    {(formId && preparedBy === token?._id && !approvedBySign) &&
                        <div className="d-flex justify-content-center gap-2 gap-md-3 mt-4 mb-4 flex-wrap">
                            <div className="btn btn-primary fw-bold px-4" onClick={isEdit ? handleUpdate : handleEdit}>{isEdit ? "Save and Update Form" : "Edit LFQ"}</div>
                        </div>
                    }

                    {/* Add this section for the Edit button when both signatures are filled */}
                    {(formId && preparedBy === token?._id && approvedBySign && !isEdit) &&
                        <div className="d-flex justify-content-center gap-2 gap-md-3 mt-4 mb-4 flex-wrap">
                            <div className="btn btn-primary fw-bold px-4" onClick={handleEditWithConfirmation}>Edit</div>
                        </div>
                    }

                    {(preparedBy !== token?._id && !isclient && (approvedBySign && islocal)) &&
                        <div className="d-flex justify-content-center gap-2 gap-md-3 mt-4 mb-4 flex-wrap">
                            <div className="btn btn-primary fw-bold px-4" onClick={handleUpdateSignature}>Save and Submit Signature</div>
                        </div>
                    }
                    {(preparedBySign && (isclient || !showLinkGenerator) && !LFQData?.isApproved && !LFQData?.isReject) &&
                        <div className="d-flex justify-content-center gap-2 mt-2">
                            <div className="d-flex justify-content-center" style={{
                                backgroundColor: "#16213e",
                                color: "white",
                                width: "150px",
                                minWidth: "100px",
                                maxWidth: "200px",
                                padding: "8px 20px",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "pointer",
                                textAlign: "center",
                                border: "2px solid #16213e",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                fontWeight: "500",
                            }}>
                                <div className=" fw-bold px-4" onClick={handleRejectClick}>Reject</div>
                            </div>
                            <div className="d-flex justify-content-center" style={{
                                backgroundColor: "#16213e",
                                color: "white",
                                width: "150px",
                                minWidth: "100px",
                                maxWidth: "200px",
                                padding: "8px 20px",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "pointer",
                                textAlign: "center",
                                border: "2px solid #16213e",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                fontWeight: "500",
                            }}>
                                <div className=" fw-bold px-4" onClick={handleAccept}>Accept</div>
                            </div>
                        </div>
                    }



                    {/* Add this section for the Update button after editing and removing chairman signature */}
                    {/* {(isEdit && !approvedBySign) &&
                        <div className="d-flex justify-content-center gap-2 gap-md-3 mt-4 mb-4 flex-wrap">
                            <div className="btn btn-primary fw-bold px-4" onClick={handleUpdate}>Update</div>
                        </div>
                    } */}
                </div>
                :
                <div className="text-center text-black py-5">No LFQ Form Available.</div>
            }
            {/* Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Changes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={changes}
                                onChange={(e) => setChanges(e.target.value)}
                                placeholder="What should be changed?"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-center gap-2">
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleReject}>Submit Rejection</Button>
                </Modal.Footer>

            </Modal>
        </div>
    );
};

export default LFQ_ClientCaseEvaluationForm;