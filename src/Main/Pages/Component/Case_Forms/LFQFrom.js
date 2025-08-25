import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import Form_SignaturePad from "./Form_Componets/SignaturePad";
import axios from "axios";
import { ApiEndPoint } from "../utils/utlis";
import { useSelector } from "react-redux";
import { Caseinfo } from "../../../../REDUX/sliece";
import { useAlert } from "../../../../Component/AlertContext";
import { Dropdown, Form, InputGroup } from "react-bootstrap";

const LFQ_ClientCaseEvaluationForm = ({ token }) => {


    const caseInfo = useSelector((state) => state.screen.Caseinfo);
    const [clientName, setClientName] = useState('');
    const [clientContactInfo, setclientContactInfo] = useState('');
    const [clientContactphone, setclientContactphone] = useState('');
    const [dateValue, setDateValue] = useState('');
    const [localCounsel, setLocalCounsel] = useState("no");
    const [matterReference, setMatterReference] = useState(caseInfo?.CaseNumber);
    const [caseType, setCaseType] = useState(caseInfo?.CaseSubType); // default Civil
    const [jurisdiction, setJurisdiction] = useState("UAE Local Courts"); // default UAE Local Courts
    const [complexity, setComplexity] = useState(caseInfo?.Priority);
    const [sensitivity, setSensitivity] = useState("Routine/Low");
    // const { showDataLoading } = useAlert();
    const { showLoading, showSuccess, showError, showDataLoading } = useAlert();


    // const seniorLawyers = ["John Doe", "Jane Smith", "Ahmed Khan"];
    const associateLawyers = ["Team A", "Team B", "Ali Raza"];
    const localCounsels = ["Firm X", "Firm Y", "Zeeshan & Co"];
    // const paralegalStaff = ["Paralegal", "Legal Assistant", "Document Clerk"];

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

    const [preparedBy, setPreparedBy] = useState(token?._id);
    const [preparedBySign, setPreparedBySign] = useState('');
    const [preparedDate, setPreparedDate] = useState('');
    const [approvedBy, setApprovedBy] = useState(token?._id);
    const [approvedBySign, setApprovedBySign] = useState('');
    const [approvedDate, setApprovedDate] = useState('');
    const [AmountatStake, setAmountAtStake] = useState('');
    const [estimatedDuration, setestimatedDuration] = useState('');
    const [dataFound, setDataFound] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [formId, setFormId] = useState("");
    const [islocal, setislocal] = useState(false);

    const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
    const [getDrafts, setGetDrafts] = useState(null);



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
                //  caseInfo === null ? (token?.Role === "admin" ? `${ApiEndPoint}getAllTasksWithDetails` : `${ApiEndPoint}getTasksByUser/${token?._id}`) : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}`
            );

            if (!response.ok) {
                showDataLoading(false)
                throw new Error('Error fetching LFA');
            }

            const data = await response.json();

            setGetDrafts(data)
            // showDataLoading(false)
        } catch (err) {
            showDataLoading(false)
            // setMessage(err.response?.data?.message || "Error deleting task.");
            //  setShowError(true);
        }



        try {
            const res = await axios.get(`${ApiEndPoint}getClientDetailsByUserId/${caseInfo?.ClientId}`);
            if (res.data) {
                const data = res.data;

                // ===== BASIC FIELDS =====
                setClientName(data?.user.UserName || "");

                // console.log("client Data= ", data)
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

                // ===== BASIC FIELDS =====
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

                // ===== BASIC FIELDS =====
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

                // ===== BASIC FIELDS =====
                setparalegalStaff(data.roles);
            }
        } catch (error) {
            console.error("Error fetching client details", error);
            setDataFound(false);
        }
        try {
            const res = await axios.get(`${ApiEndPoint}getLFQFormByCaseId/${caseId}`);
            if (res.data) {
                const data = res.data;
                setFormId(data._id)
                // ===== BASIC FIELDS =====
                setClientName(data.clientName || "");
                setclientContactInfo(data.clientEmail || "");
                setclientContactphone(data.clientContactphone || "");

                // ===== DATE OF CLIENT MEETING =====
                if (data.dateOfClientMeeting) {
                    const date = new Date(data.dateOfClientMeeting);
                    setDateValue(
                        `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
                    );
                } else {
                    setDateValue("");
                }

                // setMatterReference(data.matterReference || "");
                // setCaseType(data.caseType || "");
                setJurisdiction(data.jurisdiction || "");
                setLocalCounsel(data.localCounselRequired || "");
                setLocalCounselHours(data.estLocalCounselHours || "");

                // ===== CASE COMPLEXITY =====
                setComplexity(data.complexityLevel || "");
                setAmountAtStake(data.amountAtStake || "");
                setestimatedDuration(data.estimatedCaseDuration || "");

                // ===== RESOURCES =====
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

                // ===== CLIENT PROFILE =====
                if (Array.isArray(data.clientCategory) && data.clientCategory.length > 0) {
                    try {
                        setClientCategory(JSON.parse(data.clientCategory[0])); // because your sample has array with JSON string
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

                // ===== FEE PROPOSAL =====
                setFeeStructure(data.feeStructure || "");
                setOtherFee(data.otherFee || "");
                setHourlyRates(data.hourlyRates || "");
                setFixedFee(data.fixedFee || "");
                setSpecialTerms(data.specialTerms || "");
                setKeyFactors(data.keyFactors || "");

                // ===== PREPARED =====
                setPreparedBy(data.preparedBy || token?._id);
                if (data.preparedDate) {
                    const pDate = new Date(data.preparedDate);
                    setPreparedDate(
                        `${String(pDate.getDate()).padStart(2, "0")}/${String(pDate.getMonth() + 1).padStart(2, "0")}/${pDate.getFullYear()}`
                    );
                } else {
                    setPreparedDate("");
                }
                setPreparedBySign(data.preparedBySignpath || "");

                // ===== APPROVED =====
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
                setislocal(false)
                // Mark that data exists
                setDataFound(true);
            }
        } catch (error) {
            console.error("Error fetching LFQ form:", error);
            setDataFound(false);
        }

        showDataLoading(false)

    };

    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        setClientCategory(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };



    const handleSignatureSave = (dataUrl) => {
        // console.log("Lawyar Signature Base64:", dataUrl);
        setApprovedBySign(dataUrl); // store it locally
        setislocal(true)

        // You could also send it to your backend here
    };


    const handlepreparedBySign = (dataUrl) => {
        // console.log("Lawyar Signature Base64:", dataUrl);
        setPreparedBySign(dataUrl); // store it locally
        // setIsLocalSign(true)

        // You could also send it to your backend here
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {



            const validations = [
                // Basic information
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

                // Communication needs - required
                { condition: !communication, message: "Please select communication needs" },

                // Legal team
                { condition: !seniorName, message: "Senior lawyer name is required" },
                { condition: !seniorHours, message: "Senior lawyer hours is required" },
                { condition: !associateName, message: "Associate lawyer name is required" },
                { condition: !associateHours, message: "Associate lawyer hours is required" },
                { condition: !paralegal, message: "Paralegal/Support Staff is required" },
                { condition: !paralegalHours, message: "paralegalHours is required" },
                { condition: !otherResourceHours, message: "Other Resource Hours is required" },
                { condition: !otherResources, message: "Other Resources is required" },

                // Signatures
                { condition: !preparedBy, message: "Prepared by name is required" },
                { condition: !preparedDate, message: "Prepared date is required" },
                { condition: !preparedBySign, message: "Prepared signature is required" },
                { condition: !keyFactors, message: "Key Factors is required" },
                { condition: !specialTerms, message: "Special Terms is required" },

                // Conditional validations
                {
                    condition: localCounsel === "yes" && !localCounselHours,
                    message: "Local counsel hours required when counsel is needed"
                },
                {
                    condition: ResourcelocalCounselHours && !ResourcelocalCounsel,
                    message: "Local counsel name required when counsel is needed"
                },
            ];

            // Check all validations
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

            // Client category validation
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
            // Basic text fields
            formData.append("caseId", caseInfo?._id);
            formData.append("clientName", clientName);
            formData.append("clientEmail", clientContactInfo);
            formData.append("clientContactphone", clientContactphone);
            const [dateValueday, dateValuemonth, dateValueyear] = dateValue.split("/");
            const dateValue_formattedDate = new Date(`${dateValueyear}-${dateValuemonth}-${dateValueday}`); // YYYY-MM-DD format

            // console.log("formattedDate =", preparedDate_formattedDate);
            // console.log("ISO =", dateValue_formattedDate.toISOString());
            // console.log("ISO =");

            formData.append("dateOfClientMeeting", dateValue_formattedDate);
            formData.append("matterReference", matterReference || "");
            formData.append("caseType", caseType);
            formData.append("jurisdiction", jurisdiction);
            formData.append("localCounselRequired", localCounsel);
            formData.append("estLocalCounselHours", localCounselHours || "");

            // Case complexity & stake
            formData.append("complexityLevel", complexity);
            formData.append("amountAtStake", AmountatStake || "");
            formData.append("estimatedCaseDuration", estimatedDuration || "");

            // Resource & Effort
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
            // Client profile
            formData.append("clientCategory", JSON.stringify(clientCategory));
            formData.append("referredBy", referredBy || "");
            formData.append("retainerDetails", retainerDetails || "");
            formData.append("communicationNeeds", communication || "");
            formData.append("clientNotes", clientNotes || "");
            // Fee proposal
            formData.append("feeStructure", feeStructure || "");
            formData.append("otherFee", otherFee || "");
            formData.append("hourlyRates", hourlyRates || "");
            formData.append("fixedFee", fixedFee || "");
            formData.append("specialTerms", specialTerms || "");
            formData.append("keyFactors", keyFactors || "");
            // Signatures (convert base64 to file if possible)
            if (preparedBySign) {
                const file = base64ToFile(preparedBySign, "preparedBySign.png");
                formData.append("file", file);
            }

            const [day, month, year] = preparedDate.split("/");
            const preparedDate_formattedDate = new Date(`${year}-${month}-${day}`); // YYYY-MM-DD format

            // console.log("formattedDate =", preparedDate_formattedDate);
            // console.log("ISO =", preparedDate_formattedDate.toISOString());
            // console.log("ISO =");



            formData.append("preparedBy", preparedBy || "");
            formData.append("preparedDate", preparedDate_formattedDate.toISOString() || "");

            if (approvedBySign) {
                const file = base64ToFile(approvedBySign, "approvedBySign.png");
                formData.append("file", file);
            }



            const [appday, appmonth, appyear] = approvedDate.split("/");
            const approvedDate_formattedDate = new Date(`${appyear}-${appmonth}-${appday}`); // YYYY-MM-DD format

            // console.log("formattedDate =", approvedDate_formattedDate);
            // console.log("ISO =", approvedDate);

            if (approvedDate) {
                formData.append("approvedBy", approvedBy || "");
                formData.append("approvedDate", approvedDate_formattedDate.toISOString() || "");
            }
            // Send request
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


        // try {
        //     const formData = new FormData();

        //     // Basic text fields
        //     formData.append("caseId", caseInfo?._id);
        //     formData.append("clientName", clientName);
        //     formData.append("clientContactInfo", clientContactInfo);
        //     const [dateValueday, dateValuemonth, dateValueyear] = dateValue.split("/");
        //     const dateValue_formattedDate = new Date(`${dateValueyear}-${dateValuemonth}-${dateValueday}`); // YYYY-MM-DD format

        //     // console.log("formattedDate =", preparedDate_formattedDate);
        //     console.log("ISO =", dateValue_formattedDate.toISOString());
        //     console.log("ISO =");

        //     formData.append("dateOfClientMeeting", dateValue_formattedDate);
        //     formData.append("matterReference", matterReference || "");
        //     formData.append("caseType", caseType);
        //     formData.append("jurisdiction", jurisdiction);
        //     formData.append("localCounselRequired", localCounsel);
        //     formData.append("estLocalCounselHours", localCounselHours || "");

        //     // Case complexity & stake
        //     formData.append("complexityLevel", complexity);
        //     formData.append("amountAtStake", AmountatStake || "");
        //     formData.append("estimatedCaseDuration", estimatedDuration || "");

        //     // Resource & Effort
        //     formData.append("seniorLawyer[name]", seniorName);
        //     formData.append("seniorLawyer[estHours]", seniorHours || "");
        //     formData.append("associateLawyer[name]", associateName);
        //     formData.append("associateLawyer[estHours]", associateHours || "");
        //     formData.append("resourceLocalCounsel[name]", ResourcelocalCounsel);
        //     formData.append("resourceLocalCounsel[estHours]", localCounselHours || "");
        //     formData.append("paralegalSupport[role]", paralegal);
        //     formData.append("paralegalSupport[estHours]", paralegalHours || "");
        //     formData.append("otherResources[description]", otherResources || "");
        //     formData.append("otherResources[estHours]", otherResourceHours || "");
        //     formData.append("totalEstimatedHours", totalHours || "");
        //     // Client profile
        //     formData.append("clientCategory", JSON.stringify(clientCategory));
        //     formData.append("referredBy", referredBy || "");
        //     formData.append("retainerDetails", retainerDetails || "");
        //     formData.append("communicationNeeds", communication || "");
        //     formData.append("clientNotes", clientNotes || "");
        //     // Fee proposal
        //     formData.append("feeStructure", feeStructure || "");
        //     formData.append("otherFee", otherFee || "");
        //     formData.append("hourlyRates", hourlyRates || "");
        //     formData.append("fixedFee", fixedFee || "");
        //     formData.append("specialTerms", specialTerms || "");
        //     formData.append("keyFactors", keyFactors || "");
        //     // Signatures (convert base64 to file if possible)
        //     // if (preparedBySign) {
        //     //     const file = base64ToFile(preparedBySign, "preparedBySign.png");
        //     //     formData.append("file", file);
        //     // }

        //     const [day, month, year] = preparedDate.split("/");
        //     const preparedDate_formattedDate = new Date(`${year}-${month}-${day}`); // YYYY-MM-DD format

        //     // console.log("formattedDate =", preparedDate_formattedDate);
        //     console.log("ISO =", preparedDate_formattedDate.toISOString());
        //     console.log("ISO =");



        //     formData.append("preparedBy", preparedBy || "");
        //     formData.append("preparedDate", preparedDate_formattedDate.toISOString() || "");

        //     // if (approvedBySign) {
        //     //     const file = base64ToFile(approvedBySign, "approvedBySign.png");
        //     //     formData.append("file", file);
        //     // }



        //     const [appday, appmonth, appyear] = approvedDate.split("/");
        //     const approvedDate_formattedDate = new Date(`${appyear}-${appmonth}-${appday}`); // YYYY-MM-DD format

        //     // console.log("formattedDate =", approvedDate_formattedDate);
        //     console.log("ISO =", approvedDate);

        //     if (approvedDate) {
        //         formData.append("approvedBy", approvedBy || "");
        //         formData.append("approvedDate", approvedDate_formattedDate.toISOString() || "");
        //     }
        //     // Send request
        //     const res = await axios.put(`${ApiEndPoint}updateDataLFQForm/${formId}`, formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data"
        //         }
        //     });

        //     if (res.status === 200 || res.status === 201) {
        //         alert("Form submitted successfully!");
        //     }
        // } catch (error) {
        //     console.error("Form submission error:", error);
        //     alert("Error submitting form. Please try again.");
        // }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsEdit(true);
        setDataFound(false);

        try {



            const validations = [
                // Basic information
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

                // Communication needs - required
                { condition: !communication, message: "Please select communication needs" },

                // Legal team
                { condition: !seniorName, message: "Senior lawyer name is required" },
                { condition: !seniorHours, message: "Senior lawyer hours is required" },
                { condition: !associateName, message: "Associate lawyer name is required" },
                { condition: !associateHours, message: "Associate lawyer hours is required" },
                { condition: !paralegal, message: "Paralegal/Support Staff is required" },
                { condition: !paralegalHours, message: "paralegalHours is required" },
                { condition: !otherResourceHours, message: "Other Resource Hours is required" },
                { condition: !otherResources, message: "Other Resources is required" },

                // Signatures
                { condition: !preparedBy, message: "Prepared by name is required" },
                { condition: !preparedDate, message: "Prepared date is required" },
                { condition: !preparedBySign, message: "Prepared signature is required" },
                { condition: !keyFactors, message: "Key Factors is required" },
                { condition: !specialTerms, message: "Special Terms is required" },

                // Conditional validations
                {
                    condition: localCounsel === "yes" && !localCounselHours,
                    message: "Local counsel hours required when counsel is needed"
                },
                {
                    condition: ResourcelocalCounselHours && !ResourcelocalCounsel,
                    message: "Local counsel name required when counsel is needed"
                },
            ];

            // Check all validations
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

            // Client category validation
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

            // ✅ Normal JS object (parsed with nested structure)
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

                // ✅ Nested objects
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

                clientCategory,
                referredBy,
                retainerDetails,
                communicationNeeds: communication,
                clientNotes,

                feeStructure,
                otherFee,
                hourlyRates,
                fixedFee,
                specialTerms,
                keyFactors,

                preparedBy,
                preparedDate: preparedDate_formattedDate.toISOString(),

                approvedBy: approvedDate ? approvedBy : "",
                approvedDate: approvedDate ? approvedDate_formattedDate.toISOString() : "",
            };

            // console.log("Payload being sent:", payload);

            // ✅ Send plain JSON (no multipart needed)
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
    const handleUpdateSignature = async (e) => {
        e.preventDefault();
        setIsEdit(true);
        setDataFound(false);
        showLoading()

        try {
            const formData = new FormData();

            // signature file
            if (approvedBySign) {
                const file = base64ToFile(approvedBySign, "approvedBySign.png");
                formData.append("file", file);
            }

            // date ko format karo (ISO string)
            const [appday, appmonth, appyear] = approvedDate.split("/");
            const approvedDate_formattedDate = new Date(`${appyear}-${appmonth}-${appday}`);

            // text fields
            if (approvedBy) formData.append("approvedBy", approvedBy);
            if (approvedDate) formData.append("approvedDate", approvedDate_formattedDate.toISOString());

            // API call (multipart form-data)
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

    return (
        <div className="card w-100" style={{ maxHeight: '87vh', overflowY: 'auto' }}>
            <div className="container my-4">

                <div className="container py-4">

                    {token?.Role !== "client" &&

                        < Form.Group className="mb-3">
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
                                        {selectedDrafts === "Select Draft" ? "Select Draft" : `${selectedDrafts?.clientName}`}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="w-100">
                                        {getDrafts?.map((data, index) => (
                                            <Dropdown.Item key={index} onClick={() => {

                                                setSelectedDrafts(data)
                                                setFormId(data._id)
                                                // ===== BASIC FIELDS =====
                                                setClientName(data.clientName || "");
                                                setclientContactInfo(data.clientEmail || "");
                                                setclientContactphone(data.clientContactphone || "");

                                                // ===== DATE OF CLIENT MEETING =====
                                                if (data.dateOfClientMeeting) {
                                                    const date = new Date(data.dateOfClientMeeting);
                                                    setDateValue(
                                                        `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
                                                    );
                                                } else {
                                                    setDateValue("");
                                                }

                                                // setMatterReference(data.matterReference || "");
                                                // setCaseType(data.caseType || "");
                                                setJurisdiction(data.jurisdiction || "");
                                                setLocalCounsel(data.localCounselRequired || "");
                                                setLocalCounselHours(data.estLocalCounselHours || "");

                                                // ===== CASE COMPLEXITY =====
                                                setComplexity(data.complexityLevel || "");
                                                setAmountAtStake(data.amountAtStake || "");
                                                setestimatedDuration(data.estimatedCaseDuration || "");

                                                // ===== RESOURCES =====
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

                                                // ===== CLIENT PROFILE =====
                                                if (Array.isArray(data.clientCategory) && data.clientCategory.length > 0) {
                                                    try {
                                                        setClientCategory(JSON.parse(data.clientCategory[0])); // because your sample has array with JSON string
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

                                                // ===== FEE PROPOSAL =====
                                                setFeeStructure(data.feeStructure || "");
                                                setOtherFee(data.otherFee || "");
                                                setHourlyRates(data.hourlyRates || "");
                                                setFixedFee(data.fixedFee || "");
                                                setSpecialTerms(data.specialTerms || "");
                                                setKeyFactors(data.keyFactors || "");

                                            }
                                            }>
                                                {data?.clientName}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>

                            </InputGroup>
                        </Form.Group>
                    }

                    {/* Logo */}
                    <div className="text-center mb-4">
                        <img
                            src="logo.png"
                            alt="Logo"
                            style={{ height: "60px" }}
                            className="img-fluid"
                        />
                    </div>

                    {/* Heading */}
                    <h3 className="text-center fw-bold mb-2">
                        Client Case Evaluation & Fee Quotation Form <small className="text-muted">(Internal Use)</small>
                    </h3>
                    {/* <p className="text-muted text-center mb-4" style={{ margin: "0 auto" }}>
                        This form is to be completed by the Senior Lawyer after the initial client meeting.
                        It captures all details needed to prepare a fee quotation for the client.
                        The completed form will be reviewed by the Chairman for approval of the proposed fees.
                    </p> */}
                    {/* Page 1 */}
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
                                    disabled={true}
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
                                    disabled={true}
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
                                    disabled={true}
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
                            {/* Matter / Case Reference */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-md-3 col-form-label fw-bold">
                                    Matter / Case Reference
                                </label>
                                <div className="col-md-9">
                                    <span className="fw-normal">{matterReference}</span>
                                </div>
                            </div>
                        </div>

                        {/* Case Type */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-md-3 col-form-label fw-bold">
                                Type of Case
                            </label>
                            <div className="col-md-9">
                                <span className="fw-normal">{caseType}</span>
                            </div>
                        </div>

                        {/* Jurisdiction */}
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

                        {/* Local Counsel */}
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

                {/* Page 1 - Case Complexity */}
                <div className="card shadow-sm border-0 rounded-3 mb-4">
                    <div className="card-body">
                        <h5 className="fw-bold mb-3 text-primary">Case Complexity & Stakes</h5>

                        {/* Case Complexity Level */}
                        <div className="row mb-3 align-items-center">
                            <label className="col-md-3 col-form-label fw-bold">
                                Case Complexity Level
                            </label>
                            <div className="col-md-9">
                                <span className="fw-normal">{complexity}</span>
                            </div>
                        </div>

                        {/* Amount at Stake */}
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

                        {/* Estimated Case Duration */}
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


                {/* Page X - Resource & Effort Estimation */}
                <div className="card shadow-sm border-0 rounded-3 mb-4">
                    <div className="card-body">
                        <h5 className="fw-bold mb-3 text-primary">Resource & Effort Estimation</h5>

                        {/* Senior Lawyer */}
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

                        {/* Associate Lawyer(s) */}
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

                                    }
                                    }
                                    disabled={(dataFound || isclient)}
                                />
                            </div>
                        </div>

                        {/* Local Counsel */}
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

                        {/* Paralegal / Support Staff */}
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

                        {/* Other Resources */}
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
                                    }
                                    }
                                    disabled={(dataFound || isclient)}
                                />
                            </div>
                        </div>

                        {/* Total Estimated Hours */}
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
                                // disabled={(dataFound || isclient)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page X - Client Profile & Relationship */}
                <div className="card shadow-sm border-0 rounded-3 mb-4">
                    <div className="card-body">
                        <h5 className="fw-bold mb-3 text-primary">Client Profile & Relationship</h5>

                        {/* Client Category */}
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

                        {/* Conditional Fields */}
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

                        {/* Client Communication Needs */}
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

                        {/* Notes on Client Personality */}
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

                {/* Fee Proposal & Pricing */}
                <div className="card mb-4 shadow-sm h-100">
                    <div className="card-body">
                        <h5 className="fw-bold mb-4">Fee Proposal & Pricing</h5>

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

                        {/* Special Terms */}
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

                        {/* Key Factors Affecting Fee */}
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



                {/* Approvals */}
                <div className="card shadow-sm border-0 rounded-3 mt-4">
                    <div className="card-body">
                        <h5 className="fw-bold mb-4">Approvals</h5>

                        <div className="row">
                            {/* Prepared by (Senior Lawyer) */}
                            <div className="col-md-6">
                                <div className="card shadow-sm border-0 rounded-3 mb-4">
                                    <div className="card-body">
                                        <h5 className="fw-bold mb-4">Prepared by (Senior Lawyer)</h5>
                                        <div className="row g-3 align-items-start">
                                            {/* Name */}
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

                                            {/* Signature */}
                                            <div className="col-12 mb-3">
                                                <label className="form-label fw-semibold">Signature:</label>
                                                {(!dataFound && !isEdit && !isclient) && (
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

                                            {/* Date */}
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

                            {/* Approved by (Chairman) */}
                            {((approvedBySign || "admin" === token?.Role) && dataFound) && (
                                <div className="col-md-6">
                                    <div className="card shadow-sm border-0 rounded-3 mb-4">
                                        <div className="card-body">
                                            <h5 className="fw-bold mb-4">Reviewed & Approved by (Chairman)</h5>
                                            <div className="row g-3 align-items-start">
                                                {/* Name */}
                                                <div className="col-12 mb-3">
                                                    <label className="form-label fw-semibold">Name:</label>
                                                    <select
                                                        className="form-select"
                                                        value={approvedBy}
                                                        onChange={(e) => setApprovedBy(e.target.value)}
                                                        disabled={true}
                                                    >
                                                        <option value="">Select Chairman</option>
                                                        {getAllOpsteam.map((name, index) => (
                                                            <option key={index} value={name?._id}>{name?.UserName}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Signature */}
                                                <div className="col-12 mb-3">
                                                    <label className="form-label fw-semibold">Signature:</label>
                                                    {((!isclient && !approvedBySign) || (islocal)) && (
                                                        <Form_SignaturePad height={200} onSave={handleSignatureSave} />
                                                    )}
                                                    {approvedBySign && (
                                                        <div className="mt-2 text-center">
                                                            <img
                                                                src={approvedBySign}
                                                                alt="Chairman Signature"
                                                                className="img-fluid border rounded"
                                                                style={{ maxHeight: "150px" }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Date */}
                                                <div className="col-12">
                                                    <label className="form-label fw-semibold">Date:</label>
                                                    <DatePicker
                                                        selected={approvedDate ? new Date(approvedDate.split("/").reverse().join("-")) : null}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const day = String(date.getDate()).padStart(2, "0");
                                                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                                                const year = date.getFullYear();
                                                                setApprovedDate(`${day}/${month}/${year}`);
                                                            }
                                                        }}
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control"
                                                        placeholderText="dd/mm/yyyy"
                                                        disabled={(approvedBySign && !islocal)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                </div>

                {/* Submit button */}
                {(!dataFound && !isEdit && !isclient) &&
                    <div className="d-flex justify-content-center gap-2 gap-md-3 mt-4 mb-4 flex-wrap">
                        <div className="btn btn-primary fw-bold px-4" onClick={handleSubmit}>Submit Form</div>
                    </div>
                }

                {(formId && preparedBy === token?._id && !approvedBySign && dataFound) &&
                    <div className="d-flex justify-content-center gap-2 gap-md-3 mt-4 mb-4 flex-wrap">
                        <div className="btn btn-primary fw-bold px-4" onClick={isEdit ? handleUpdate : handleEdit}>{isEdit ? "Update Form" : "Edit Form"}</div>
                    </div>
                }
                {(preparedBy !== token?._id && !isclient && (approvedBySign && islocal)) &&
                    <div className="d-flex justify-content-center gap-2 gap-md-3 mt-4 mb-4 flex-wrap">
                        <div className="btn btn-primary fw-bold px-4" onClick={handleUpdateSignature}>Save Signature</div>
                    </div>
                }

            </div>
        </div >
    );
};

export default LFQ_ClientCaseEvaluationForm;
