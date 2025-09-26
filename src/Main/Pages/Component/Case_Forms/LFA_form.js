

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ApiEndPoint } from '../utils/utlis';
import { useSelector } from 'react-redux';
import ConfirmModal from '../../AlertModels/ConfirmModal';
import { useAlert } from '../../../../Component/AlertContext';
import Form_SignaturePad from './Form_Componets/SignaturePad';
import { BsPlus, BsDash, BsDownload } from "react-icons/bs";
import { Dropdown, Form, InputGroup, Modal, Button } from "react-bootstrap";
import CEEditable from './CEEditable';
import { v4 as uuidv4 } from "uuid";
import { jsPDF } from "jspdf";
import logo from '../../../Pages/Images/logo.png';
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import backgroundImage from "../../../Pages/Images/bg.jpg";
import logoiA from "../../../Pages/Component/assets/Stamp.png";// Add your stamp image
import AWSlogo from "../../../Pages/Component/assets/AWSSideLogo.png"; // Add this import at the top of your file
import AWSlogo5 from "../../../Pages/Component/assets/AWSSideLogo2.png";
// Properly set up the vfs
pdfMake.vfs = pdfFonts.vfs;

// Also set the fonts
pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
};

const LEA_Form = ({ token }) => {
    const [isHovered, setIsHovered] = useState(false);
    const caseInfo = useSelector((state) => state.screen.Caseinfo);
    const { showDataLoading } = useAlert();

    const [selectedDrafts, setSelectedDrafts] = useState("Select Draft");
    const [getDrafts, setGetDrafts] = useState(null);

    // NEW: force remount key for contentEditable sections
    const [draftKey, setDraftKey] = useState(0);

    // NEW: State for client rejection
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);
    // Add these state variables and functions to your component
    const [caseId, setCaseId] = useState(null);
    const [LinkcaseId, setLinkcaseId] = useState("");
    const [showLinkGenerator, setShowLinkGenerator] = useState(true);
    const [generatedLink, setGeneratedLink] = useState("");
    const [isEmailLinkAccess, setIsEmailLinkAccess] = useState(false);
    const [signatureSubmitted, setSignatureSubmitted] = useState(false); // NEW: Track if signature was submitted

    const handleGenerateLink = () => {
        const originalLink = `${window.location.origin}/LFA_Form?caseId=${caseInfo?._id}&timestamp=${Date.now()}`
        const encrypted = btoa(originalLink);
        const finalLink = `${window.location.origin}/LFA_Form?data=${encodeURIComponent(encrypted)}`
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
        const caseIdParam = params.get("caseId");

        if (encoded) {
            try {
                const decodedLink = atob(decodeURIComponent(encoded));
                console.log("Decoded full link:", decodedLink);

                const url = new URL(decodedLink);
                const caseId = url.searchParams.get("caseId");

                if (caseId) {
                    setShowLinkGenerator(false);
                    setLinkcaseId(caseId);
                    FetchLFA(caseId);

                    // Store in localStorage for dashboard redirection
                    localStorage.setItem("pendingCaseId", caseId);
                    localStorage.setItem("pendingUserId", "client");
                    localStorage.setItem("pendingScreenIndex", "27");
                    localStorage.setItem("pendingFormType", "lfa");

                    // Set that this is an email link access
                    setIsEmailLinkAccess(true);
                }
            } catch (err) {
                console.error("Decryption failed:", err);
            }
        } else if (caseIdParam) {
            // Direct caseId parameter
            setShowLinkGenerator(false);
            setLinkcaseId(caseIdParam);
            FetchLFA(caseIdParam);

            localStorage.setItem("pendingCaseId", caseIdParam);
            localStorage.setItem("pendingUserId", "client");
            localStorage.setItem("pendingScreenIndex", "27");
            localStorage.setItem("pendingFormType", "lfa");

            // Set that this is an email link access
            setIsEmailLinkAccess(true);
        } else {
            // If no URL parameters, fetch using Redux caseInfo
            FetchLFA();
        }
    }, []);

    const [agreement, setAgreement] = useState({
        fixedParts: [
            'This Agreement ("Agreement") is entered into and shall become effective as of ',
            ', by and between:\n\n',
            ', with its principal place of business located at ',
            ', represented herein by ',
            ', duly authorized (Hereinafter referred to as the "Attorney")\n\nAnd\n\n',
            ' a national of ',
            ', with their principal place of residence located ',
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
            'holding Emirates ID Number: ',
            '784-1952-3620694-4',
            new Date().toLocaleDateString('en-GB'),
            'alyelba@yahoo.com',
            '+971521356931'
        ]
    });

    const [fixedHeadings, setFixedHeadings] = useState([
        { title: 'Section 1: Fundamental Ethics and Professional Conducts Rules', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }] },
        { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }] }
    ]);

    const [headings, setHeadings] = useState([]);

    const [savedSignature, setSavedSignature] = useState(null);
    const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
    const [isFormFilled, setisFormFilled] = useState(false);
    const [savedClientSignature, setSavedClientSignature] = useState(null);
    const [isLocalSign, setIsLocalSign] = useState(false);
    const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [lfaStatus, setLfaStatus] = useState(""); // NEW: Track LFA status
    const [showSignaturePad, setShowSignaturePad] = useState(false); // NEW: Control signature pad visibility
    const isclient = token?.Role === "client";
    const [rejectionAcknowledged, setRejectionAcknowledged] = useState(false);

    const FetchLFA = async (caseIdToFetch = null) => {
        showDataLoading(true);
        try {
            // Use the caseId from parameters if provided, otherwise use Redux caseInfo
            const targetCaseId = caseIdToFetch || (isEmailLinkAccess ? LinkcaseId : caseInfo?._id);

            if (!targetCaseId) {
                showDataLoading(false);
                console.error('No case ID available');
                return;
            }

            const response = await fetch(`${ApiEndPoint}getLFAForm/${targetCaseId}`);
            if (!response.ok) {
                showDataLoading(false);
                throw new Error('Error fetching LFA');
            }
            const data = await response.json();
            showDataLoading(false);

            setAgreement(data.data.agreement);
            setDataList(data.data);
            setFixedHeadings(data.data.fixedHeadings);
            setHeadings(data.data.headings);
            setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : "");
            setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : "");
            setLfaStatus(data.data?.status || "");
            setEditMode(false);
            setisFormFilled(true);
            setIsLocalSign(!!data.data?.ClientSignatureImage);
            setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
            setSavedLawyerSignature();

            // If this is email link access and form is already accepted, show signature pad
            // Handle signature pad visibility for email link access
            if (isEmailLinkAccess) {
                if (data.data?.status === "accepted" && !data.data?.ClientSignatureImage) {
                    setShowSignaturePad(true);
                    setSignatureSubmitted(false); // Ensure submit button is visible
                } else if (data.data?.ClientSignatureImage) {
                    setShowSignaturePad(false);
                    setSignatureSubmitted(true); // Signature already submitted
                }
            }

            // Reset signature submitted state for portal access
            if (!isEmailLinkAccess && data.data?.ClientSignatureImage) {
                setSignatureSubmitted(true);
            }

            // ensure UI refreshes on initial fetch too
            setDraftKey((k) => k + 1);
        } catch (err) {
            showDataLoading(false);
        }

        try {
            const response = await fetch(`${ApiEndPoint}getAllLFAForms`);
            if (!response.ok) {
                showDataLoading(false);
                throw new Error('Error fetching LFA');
            }
            const data = await response.json();
            setGetDrafts(data);
        } catch (err) {
            showDataLoading(false);
        }
    };

    // Function to convert base64 to image data for jsPDF
    const getImageDataFromBase64 = (base64String) => {
        const base64Data = base64String.split(',')[1];
        return atob(base64Data);
    };

    // Function to get base64 from server for S3 URLs
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

    // Add this function to fetch assigned users
    const fetchAssignedUsers = async (caseId) => {
        try {
            const response = await fetch(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${caseId}`);
            if (!response.ok) {
                throw new Error('Error fetching assigned users');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching assigned users:", error);
            return null;
        }
    };



    const handleDownload = async () => {
        try {
            // Fetch assigned users data
            const assignedUsersData = await fetchAssignedUsers(caseInfo?._id);

            // Extract lawyer and client information
            let lawyerName = "Lawyer Name";
            let clientName = "Client Name";

            if (assignedUsersData) {
                // Find lawyer from assigned users
                const lawyer = assignedUsersData.AssignedUsers?.find(user => user.Role === "lawyer");
                if (lawyer) {
                    lawyerName = lawyer.UserName;
                }

                // Get client name
                if (assignedUsersData.Client && assignedUsersData.Client.length > 0) {
                    clientName = assignedUsersData.Client[0].UserName;
                }
            }

            // Get logo as base64
            const getBase64ImageFromUrl = async (url) => {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            };

            const logoBase64 = await getBase64ImageFromUrl(logo);
            const logoiA64 = await getBase64ImageFromUrl(logoiA);

            // Get signature images as base64
            let lawyerSignatureBase64 = null;
            let clientSignatureBase64 = null;

            if (dataList?.LawyerSignatureImage) {
                lawyerSignatureBase64 = await getSignBase64FromServer(dataList.LawyerSignatureImage);
            }

            if (dataList?.ClientSignatureImage) {
                clientSignatureBase64 = await getSignBase64FromServer(dataList.ClientSignatureImage);
            }

            // === BRAND LOOK CONTROLS ===
            const sidebarWidth = 45;
            const BAR_COLOR = "#0A1C45";   // Deep navy blue (same as DOCX)
            const LOGO_SIZE = 42;          // Size for the sidebar logo
            const LOGO_SPACING = 28;       // Spacing between logos
            const HEADER_HEIGHT = 90;

            // Convert imported image to base64
            const convertImageToBase64 = (img) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                return canvas.toDataURL('image/png');
            };

            // Load the AWS logo image
            const loadImage = (src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                    img.src = src;
                });
            };

            let awsLogoBase64;
            let awsLogo5Base64;
            try {
                const awsLogoImg = await loadImage(AWSlogo);
                awsLogoBase64 = convertImageToBase64(awsLogoImg);

                // Load the AWSlogo5 image for the bottom
                const awsLogo5Img = await loadImage(AWSlogo5);
                awsLogo5Base64 = convertImageToBase64(awsLogo5Img);
            } catch (error) {
                console.error("Failed to load AWS logos:", error);
                // Fallback to using the main logo if AWS logos fail to load
                awsLogoBase64 = logoBase64;
                awsLogo5Base64 = logoBase64;
            }

            // Fonts
            pdfMake.fonts = {
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                },
                Helvetica: {
                    normal: 'Helvetica',
                    bold: 'Helvetica-Bold',
                    italics: 'Helvetica-Oblique',
                    bolditalics: 'Helvetica-BoldOblique'
                }
            };

            const docDefinition = {
                background: (currentPage, pageSize) => {
                    const elems = [
                        {
                            canvas: [{
                                type: "rect",
                                x: 0,
                                y: 0,
                                w: sidebarWidth,
                                h: pageSize.height,
                                color: BAR_COLOR
                            }]
                        }
                    ];

                    // TOP logo (left strip) - AWS logo at the top
                    const topStartY = 50;
                    elems.push({
                        image: awsLogoBase64,
                        width: LOGO_SIZE,
                        height: LOGO_SIZE,
                        absolutePosition: {
                            x: (sidebarWidth - LOGO_SIZE) / 2,
                            y: topStartY
                        }
                    });

                    // BOTTOM logo (left strip) - AWSlogo5 at the bottom
                    const bottomStartY = pageSize.height - 140;
                    elems.push({
                        image: awsLogo5Base64,
                        width: LOGO_SIZE,
                        height: LOGO_SIZE,
                        absolutePosition: {
                            x: (sidebarWidth - LOGO_SIZE) / 2,
                            y: bottomStartY
                        }
                    });

                    // Center watermark
                    if (logoBase64) {
                        const wmWidth = Math.min(360, pageSize.width * 0.45);
                        const wmX = (pageSize.width - wmWidth) / 2;
                        const wmY = (pageSize.height - wmWidth) / 2;

                        elems.push({
                            image: logoBase64,
                            width: wmWidth,
                            opacity: 0.05,
                            absolutePosition: { x: wmX, y: wmY }
                        });
                    }

                    return elems;
                },

                pageMargins: [sidebarWidth + 30, HEADER_HEIGHT + 20, 40, 60],

                header: (currentPage, pageCount, pageSize) => {
                    return {
                        margin: [sidebarWidth + 20, 15, 20, 0],
                        columns: [
                            {
                                columns: [
                                    logoBase64
                                        ? { image: logoBase64, width: 70, height: 70, margin: [0, 0, 10, 0] }
                                        : { text: "" },
                                    {
                                        stack: [
                                            { text: "LEGAL", fontSize: 22, bold: true, color: "#0A1C45", margin: [0, 6, 0, 0] },
                                            { text: "SUHAD ALJUBOORI", fontSize: 12, bold: true, color: "#0A1C45", margin: [0, 2, 0, 0] },
                                            {
                                                text: "ADVOCATES & LEGAL CONSULTANTS",
                                                fontSize: 9,
                                                color: "#8a96b2",
                                                margin: [0, 2, 0, 0],
                                                characterSpacing: 1
                                            }
                                        ]
                                    }
                                ],
                                width: "*"
                            }
                        ]
                    };
                },

                footer: (currentPage, pageCount, pageSize) => {
                    const footerText = "P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nTel: +971 (04) 332 5928, web: aws-legalgroup.com,\n email: info@awsadvocates.com";

                    return {
                        stack: [
                            {
                                canvas: [
                                    {
                                        type: "rect",
                                        x: 0,
                                        y: 0,
                                        w: pageSize.width,
                                        h: 70,
                                        color: "#f5f5f5"
                                    },
                                ],
                            },
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
                                                margin: [0, -60, 0, 0],
                                            },
                                        ],
                                    },
                                    {
                                        text: `Page ${currentPage} of ${pageCount}`,
                                        alignment: "right",
                                        margin: [0, -60, 40, 0],
                                        fontSize: 8,
                                        color: "#333333",
                                    },
                                ],
                            },
                        ],
                        margin: [sidebarWidth, -10, 0, 0],
                    };
                },

                content: [
                    { text: "Legal Fee Agreement", style: "header", margin: [0, 10, 0, 10] },

                    { text: "Agreement", style: "subHeader", margin: [0, 20, 0, 10] },
                    {
                        text: agreement.fixedParts
                            .map((part, i) => part + (agreement.editableValues[i] || ""))
                            .join(" "),
                        style: "agreementText",
                        margin: [0, 0, 0, 20]
                    },

                    // In the content array, find the section points generation:
                    ...fixedHeadings.flatMap((section, sectionIndex) => [
                        { text: section.title, style: "subHeader", margin: [0, 20, 0, 10] },
                        {
                            ol: section.points.map(point => point.text || ""), // Changed from ul to ol
                            style: "pointsList",
                            margin: [0, 0, 0, 20],
                            type: 'lower-alpha' // Add this line
                        }
                    ]),

                    { text: "Signatures", style: "subHeader", margin: [0, 40, 0, 20] },
                    {
                        columns: [
                            {
                                width: '40%',
                                stack: [
                                    lawyerSignatureBase64
                                        ? { image: lawyerSignatureBase64, width: 120, height: 60, margin: [0, 0, 0, 5] }
                                        : { canvas: [{ type: "line", x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 5] },
                                    { text: "___________________", margin: [0, 0, 0, 5] },
                                    { text: "The Lawyer", style: "signatureLabel" },
                                    { text: lawyerName, style: "signatureName" }
                                ],
                                alignment: 'center'
                            },
                            {
                                width: '20%',
                                stack: [
                                    // Stamp in the middle
                                    logoiA64
                                        ? { image: logoiA64, width: 80, height: 80, margin: [0, 10, 0, 5], alignment: 'center' }
                                        : { text: "" },
                                    { text: "Verified and Authenticated", style: "stampText", alignment: 'center' }
                                ],
                                alignment: 'center'
                            },
                            {
                                width: '40%',
                                stack: [
                                    clientSignatureBase64
                                        ? { image: clientSignatureBase64, width: 120, height: 60, margin: [0, 0, 0, 5] }
                                        : { canvas: [{ type: "line", x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 5] },
                                    { text: "___________________", margin: [0, 0, 0, 5] },
                                    { text: "The Client", style: "signatureLabel" },
                                    { text: clientName, style: "signatureName" }
                                ],
                                alignment: 'center'
                            }
                        ],
                        margin: [0, 0, 0, 40]
                    }
                ],

                styles: {
                    header: { fontSize: 18, bold: true, color: "#0A1C45" },
                    subHeader: { fontSize: 14, bold: true, color: "#0A1C45" },
                    agreementText: { fontSize: 11, lineHeight: 1.4, alignment: "justify" },
                    pointsList: { fontSize: 11, lineHeight: 1.4 },
                    signatureLabel: { fontSize: 10, bold: true, alignment: "center" },
                    signatureName: { fontSize: 10, alignment: "center" },
                    stampText: { fontSize: 8, italics: true, alignment: "center", color: "#666666" }
                },
                defaultStyle: { font: "Roboto" }
            };

            pdfMake.createPdf(docDefinition).download("Legal_Fee_Agreement.pdf");
        } catch (e) {
            console.error("PDF generation failed:", e);
            alert("Sorry, unable to generate PDF. Check console for details.");
        }
    };
    // In LEA_Form component
    const handleAcceptLFA = async () => {

        try {
            showDataLoading(true);

            // Determine the case ID based on access method
            const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

            if (!targetCaseId) {
                showDataLoading(false);
                alert("Case ID not found");
                return;
            }

            const response = await fetch(`${ApiEndPoint}acceptLFAForm/${targetCaseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error accepting LFA');
            }

            const data = await response.json();
            showDataLoading(false);

            if (data.success) {
                setLfaStatus("accepted");
                //  setShowSignaturePad(true);

                // If this is email link access, show success message
                //  if (isEmailLinkAccess) {
                //  alert("LFA accepted successfully! Please provide your signature.");
                // } else {
                // For portal access, show message that notification was sent to lawyer
                //alert("LFA accepted successfully! A notification has been sent to your lawyer.");
                // }
            } else {
                alert("Failed to accept LFA: " + data.message);
            }
        } catch (error) {
            showDataLoading(false);
            console.error("Error accepting LFA:", error);
            alert("Failed to accept LFA. Please try again.");
        }
    };

    // Similarly update handleRejectLFA
    const handleRejectLFA = async () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }

        try {
            setIsSubmittingRejection(true);

            // Determine the case ID based on access method
            const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

            if (!targetCaseId) {
                setIsSubmittingRejection(false);
                alert("Case ID not found");
                return;
            }

            const response = await fetch(`${ApiEndPoint}rejectLFAForm/${targetCaseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectionReason }),
            });

            if (!response.ok) {
                throw new Error('Error rejecting LFA');
            }

            const data = await response.json();
            setIsSubmittingRejection(false);
            setShowRejectModal(false);
            setRejectionReason("");

            if (data.success) {
                setLfaStatus("rejected");

                // If this is email link access, show success message
                // if (isEmailLinkAccess) {
                //   alert("LFA rejected successfully. Your feedback has been sent to the lawyer.");
                //} else {
                //  alert("LFA rejected successfully. Your feedback has been sent to the lawyer.");
                //}
            } else {
                alert("Failed to reject LFA: " + data.message);
            }
        } catch (error) {
            setIsSubmittingRejection(false);
            console.error("Error rejecting LFA:", error);
            alert("Failed to reject LFA. Please try again.");
        }
    };

    const handleSignatureSave = (dataUrl) => {
        setSavedSignature(dataUrl);
        setSavedLawyerSignature(dataUrl);
        setIsLocalLawyerSign(true);
    };

    const handleClientSignatureSave = (dataUrl) => {
        setSavedClientSignature(dataUrl);
        // setShowSignaturePad(false);

        // For email link access, automatically show the submit button
        // Don't auto-submit, let the user click the submit button
        if (isEmailLinkAccess) {
            setSignatureSubmitted(false); // Ensure submit button is visible
        }
    };

    const [editMode, setEditMode] = useState(token?.Role === "lawyer" ? true : false);

    const handleEditableChange = (index, newValue) => {
        const updated = [...agreement.editableValues];
        updated[index] = newValue;
        setAgreement({ ...agreement, editableValues: updated });
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

    const handleClientSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", false);

            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement?.fixedParts,
                    editableValues: agreement?.editableValues
                })
            );

            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
            formData.append("headings", JSON.stringify(headings));

            if (savedClientSignature) {
                const file = base64ToFile(savedClientSignature, "client-signature.png");
                formData.append("file", file);
            }

            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
                setIsLocalSign(true);
                setShowSignaturePad(false);
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
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", true);

            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement.fixedParts,
                    editableValues: agreement.editableValues
                })
            );

            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
            formData.append("headings", JSON.stringify(headings));

            if (savedSignature) {
                const file = base64ToFile(savedSignature, "lawyer-signature.png");
                formData.append("file", file);
            }

            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
            } else {
                console.error("❌ Failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    const handleUpdateClientSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("caseId", caseInfo?._id || "");
            formData.append("Islawyer", false);

            formData.append(
                "agreement",
                JSON.stringify({
                    fixedParts: agreement?.fixedParts,
                    editableValues: agreement?.editableValues
                })
            );

            const formattedHeadings = fixedHeadings?.map(h => ({
                title: h.title,
                points: h.points?.map(p => ({
                    text: p.text || "",
                    subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                }))
            }));

            formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
            formData.append("headings", JSON.stringify(headings));

            if (savedClientSignature) {
                const file = base64ToFile(savedClientSignature, "client-signature.png");
                formData.append("file", file);
            }

            const res = await fetch(`${ApiEndPoint}createLFAForm`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                setEditMode(false);
            } else {
                console.error("❌ Failed:", data.message);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };
    const handleUpdateLawyerSubmit = async () => {

        try {
            if (lfaStatus === "accepted") {
                handleAcceptLFA()
            }
            // Determine the case ID based on access method
            const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

            if (!targetCaseId) {
                alert("Case ID not found");
                return;
            }

            // FIXED: Correctly identify if this is a lawyer submission
            const isLawyerSubmission = token?.Role === "lawyer" && !isEmailLinkAccess;

            // NEW: Check if this is a lawyer resubmission after rejection
            const isResubmission = lfaStatus === "rejected";
            console.log("Resubmittion")

            if (isResubmission) {
                console.log("Resubmittion = 1")
                // Use resubmission endpoint for lawyer resubmitting after rejection
                // Send the updated agreement content along with resubmission
                const resubmitData = {
                    resubmittedBy: "lawyer",
                    agreement: JSON.stringify({
                        fixedParts: agreement?.fixedParts || [],
                        editableValues: agreement?.editableValues || []
                    }),
                    fixedHeadings: JSON.stringify(fixedHeadings?.map(h => ({
                        title: h.title,
                        points: h.points?.map(p => ({
                            text: p.text || "",
                            subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                        }))
                    })) || []),
                    headings: JSON.stringify(headings || [])
                };

                const res = await fetch(`${ApiEndPoint}resubmitLFAForm/${targetCaseId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(resubmitData)
                });

                const data = await res.json();

                if (data.success) {
                    setEditMode(false);

                    // Clear rejection status on successful resubmission
                    setLfaStatus("pending");
                    //  alert("LFA resubmitted successfully! The form is now pending client review.");

                    // Refresh the form data to ensure synchronization
                    await FetchLFA(targetCaseId);
                } else {
                    console.error("❌ Failed:", data.message);
                    alert("Failed to resubmit LFA. Please try again.");
                }
            } else {
                // Normal update submission (not a resubmission)
                const formData = new FormData();

                formData.append("caseId", targetCaseId);
                formData.append("Islawyer", isLawyerSubmission);

                formData.append(
                    "agreement",
                    JSON.stringify({
                        fixedParts: agreement?.fixedParts || [],
                        editableValues: agreement?.editableValues || []
                    })
                );

                const formattedHeadings = fixedHeadings?.map(h => ({
                    title: h.title,
                    points: h.points?.map(p => ({
                        text: p.text || "",
                        subpoints: p.subpoints?.map(sp => ({ text: sp.text || "" })) || []
                    }))
                })) || [];

                formData.append("fixedHeadings", JSON.stringify(formattedHeadings));
                formData.append("headings", JSON.stringify(headings || []));

                // FIXED: Properly handle signatures based on user type and access method
                if (isLawyerSubmission && savedSignature) {
                    const file = base64ToFile(savedSignature, "lawyer-signature.png");
                    formData.append("file", file);
                    console.log("Lawyer signature file appended");
                } else if ((isclient || isEmailLinkAccess) && savedClientSignature) {
                    const file = base64ToFile(savedClientSignature, "client-signature.png");
                    formData.append("file", file);
                    console.log("Client signature file appended");
                }

                const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
                    method: "PUT",
                    body: formData
                });

                const data = await res.json();

                if (data.success) {
                    setEditMode(false);

                    // Set appropriate state based on who submitted
                    if (isLawyerSubmission) {
                        setSignatureSubmitted(true);
                        // alert("Lawyer signature submitted successfully!");
                    } else {
                        // Client submission (portal or email)
                        setSignatureSubmitted(true);
                        setShowSignaturePad(false);

                        if (isEmailLinkAccess || isclient) {
                            if (isEmailLinkAccess) {
                                // alert("Signature submitted successfully! The LFA process is now complete.");
                            } else {
                                // alert("Signature submitted successfully!");
                            }
                        }
                    }

                    // Refresh the form data to ensure synchronization
                    await FetchLFA(targetCaseId);
                } else {
                    console.error("❌ Failed:", data.message);
                    alert("Failed to submit signature. Please try again.");
                }
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Error submitting form. Please try again.");
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

    const [editHeadingIndex, setEditHeadingIndex] = useState(null);

    const pdfRef = useRef(null);

    // UPDATED: selecting a draft now forces a clean remount & syncs signatures
    const handlePickDraft = (data) => {
        setAgreement(data.agreement);
        setFixedHeadings(data.fixedHeadings);
        setHeadings(data.headings);
        setSelectedDrafts(data);
        setDraftKey((k) => k + 1); // force remount
    };

    const renderHeadings = (list, setFn, isFixed = false) => {
        if (!Array.isArray(list)) return null;

        // FIXED: Preserve the alphabetical list structure when displaying
        const combinedHtml = list
            .map(
                (heading, hIndex) => `
            <div style="margin-bottom: 20px;">
                <strong>${heading.title || ""}</strong>
                <ol type="a" style="margin: 8px 0; padding-left: 24px;">
                    ${(heading.points || [])
                        .map((p) => `<li style="margin: 4px 0; text-align: justify;">${p.text || ""}</li>`)
                        .join("")}
                </ol>
            </div>
        `
            )
            .join("");

        return (
            <div className="section border p-2 rounded bg-light">
                {editMode ? (
                    <CEEditable
                        list={list}
                        onChange={(updatedList) => setFixedHeadings(updatedList)}
                        disable={(isFormFilled && !editMode)}
                    />
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
                )}
            </div>
        );


        // Step 2: HTML -> Array
        const parseHtmlToArray = (html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const sections = [];

            let currentHeading = null;

            doc.body.childNodes.forEach((node) => {
                if (node.nodeName === "P") {
                    // extract heading text (remove numbering if any)
                    const headingText = node.textContent.replace(/^\d+\.\s*/, "").trim();
                    currentHeading = { title: headingText, points: [] };
                    sections.push(currentHeading);
                } else if (node.nodeName === "UL" && currentHeading) {
                    const points = Array.from(node.querySelectorAll("li")).map((li) => ({
                        text: li.innerHTML,
                        subpoints: [],
                    }));
                    currentHeading.points = points;
                }
            });

            return sections;
        };

        return (
            <div className="section border p-2 rounded bg-light">
                {editMode ? (
                    <CEEditable
                        list={list} // 👈 ab array directly de sakte ho
                        onChange={(updatedList) => setFixedHeadings(updatedList)}
                        disable={(isFormFilled && !editMode)}
                    />
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
                )}
            </div>
        );
    };

    // NEW: Render Accept/Reject buttons for client - UPDATED to check signatureSubmitted state
    const renderClientDecisionButtons = () => {
        // Show buttons for email link access OR regular client access
        const shouldShowButtons = (isEmailLinkAccess || isclient) &&
            isFormFilled &&
            lfaStatus !== "accepted" &&
            lfaStatus !== "rejected" &&
            !savedClientSignature &&
            !signatureSubmitted; // NEW: Also check signatureSubmitted state

        if (!shouldShowButtons) {
            return null;
        }

        return (
            <div
                className="d-flex justify-content-center align-items-center mt-4 mb-4 px-3"
                data-html2canvas-ignore="true"
            >
                {/* Reject button */}
                <button
                    className="btn btn-danger fw-bold me-3"
                    onClick={() => setShowRejectModal(true)}
                    style={{ width: "150px" }}
                >
                    Reject LFA
                </button>

                {/* Accept button */}
                <button
                    className="btn fw-bold"
                    style={{
                        width: "150px",
                        backgroundColor: "#001f54",
                        color: "white",
                        border: "none",
                        transition: "all 0.3s ease-in-out"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#c0a262";
                        e.currentTarget.style.color = "black";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#001f54";
                        e.currentTarget.style.color = "white";
                    }}
                    onClick={() => {
                        setLfaStatus("accepted");
                        setShowSignaturePad(true);
                    }}
                >
                    Accept LFA
                </button>
            </div>
        );
    };

    // NEW: Rejection Modal
    const renderRejectionModal = () => {
        return (
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject LFA</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please provide the reason for rejecting this Legal Fee Agreement:</p>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter your reasons for rejection and any changes you would like to see"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <div className="d-flex gap-3">
                        <Button
                            style={{
                                backgroundColor: "#001f54", // Dark Blue
                                color: "white",
                                border: "none",
                                transition: "all 0.3s ease-in-out"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#c0a262"; // Golden on hover
                                e.currentTarget.style.color = "black";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#001f54"; // Back to Dark Blue
                                e.currentTarget.style.color = "white";
                            }}
                            onClick={() => setShowRejectModal(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="danger"
                            onClick={handleRejectLFA}
                            disabled={isSubmittingRejection}
                        >
                            {isSubmittingRejection ? "Submitting..." : "Submit Rejection"}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    };

    const ThankYouMessage = () => (
        <div className="text-center py-5">
            <h3>Thank You!</h3>



        </div>
    );

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
            <style>{`
                .word-paper { color: #000; line-height: 1.4; }
                .word-paper .heading-row { display: grid; grid-template-columns: 32px 1fr; column-gap: 8px; align-items: start; }
                .word-paper .idx { width: 32px; min-width: 32px; text-align: right; }
                .word-paper .form-control,
                .word-paper [contenteditable="true"],
                .word-paper ul.sub-bullets,
                .word-paper ul.sub-bullets li { text-align: justify; }
                .word-paper.pdf-mode * { box-shadow: none !important; }
                .word-paper.pdf-mode .card,
                .word-paper.pdf-mode .form-control,
                .word-paper.pdf-mode .section { border: none !important; background: transparent !important; }
                .word-paper.pdf-mode [contenteditable="true"] { border: none !important; outline: none !important; background: transparent !important; padding: 0 !important; }
                
                /* CHANGED: Replace bullet lists with alphabetical lists */
                .word-paper ul,
                .word-paper ol { padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
                .word-paper ul { list-style-type: lower-alpha !important; }
                .word-paper ul.sub-bullets { list-style-type: lower-alpha !important; padding-left: 24px !important; margin: 4px 0 6px 0 !important; }
                .word-paper ul.sub-bullets li { display: list-item !important; margin: 2px 0 !important; }
                .word-paper .list-unstyled ul.sub-bullets,
                .word-paper .form-control ul.sub-bullets { list-style-type: lower-alpha !important; padding-left: 24px !important; }
                
                @media print { [data-html2canvas-ignore="true"] { display: none !important; } }
            `}</style>

            {/* toolbar */}


            {(token?.Role === "lawyer" || isFormFilled) ? (
                <>
                    <div
                        className="d-flex justify-content-end mb-3 px-3 py-2"
                        data-html2canvas-ignore="true"
                        style={{
                            marginTop: '10px'
                        }}
                    >
                        {/* Only show Generate Link button to lawyer and admin */}
                        {(token?.Role === "lawyer" || token?.Role === "admin") && (
                            <button
                                className="btn btn-primary me-3 px-4 py-2 fw-medium"
                                onClick={handleGenerateLink}
                                style={{
                                    backgroundColor: "#001f54",
                                    color: "white",
                                    border: "none",
                                    transition: "all 0.3s ease-in-out"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = "#c0a262";
                                    e.currentTarget.style.color = "black";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = "#001f54";
                                    e.currentTarget.style.color = "white";
                                }}
                            >
                                Generate Form Link
                            </button>
                        )}

                        <button
                            className="btn fw-medium d-flex align-items-center"
                            onClick={handleDownload}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#001f54",
                                color: "white",
                                border: "none",
                                transition: "all 0.3s ease-in-out"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#c0a262";
                                e.currentTarget.style.color = "black";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = "#001f54";
                                e.currentTarget.style.color = "white";
                            }}
                        >
                            <BsDownload className="me-2" />
                            Download PDF
                        </button>
                    </div>

                    <div className="container mt-2 mt-md-4 word-paper" ref={pdfRef} key={draftKey} style={isEmailLinkAccess ? { backgroundColor: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" } : {}}>
                        {/* Header */}
                        <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
                            <img
                                src="logo.png"
                                alt="Logo"
                                className="me-2 me-md-3 mb-2 mb-md-0"
                                style={{ height: "50px" }}
                            />
                            <h1 className="mb-0 h4 h3-md fw-bold text-break" style={isEmailLinkAccess ? { color: "black" } : {}}>Legal Fee Agreement</h1>
                        </div>

                        {token?.Role == "lawyer" && (
                            <Form.Group className="mb-3">
                                <Form.Label>Drafts</Form.Label>

                                <Dropdown className="w-100">
                                    <Dropdown.Toggle
                                        variant="outline-secondary"
                                        disabled={isFormFilled}
                                        id="dropdown-practice-area"
                                        className="w-100 text-start d-flex justify-content-between align-items-center"
                                    >
                                        {selectedDrafts === "Select Draft"
                                            ? "Select Draft"
                                            : `${selectedDrafts?.CaseNumber}`}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="w-100" disabled={isFormFilled}>
                                        {getDrafts?.map((data, index) => (
                                            <Dropdown.Item key={index} onClick={() => handlePickDraft(data)}>
                                                {data?.CaseNumber}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        )}

                        {/* NEW: Show status message */}
                        {/* FIXED: Show appropriate status message based on user role */}
                        {/* FIXED: Show appropriate status message based on user role */}

                        <div className="card p-2 p-md-4 shadow-sm mb-4">
                            <label className="form-label fw-bold fs-5 text-break">Agreement</label>
                            {editMode && !isclient && !savedClientSignature ? (
                                <div className="form-control p-3" style={{ minHeight: "300px", whiteSpace: "pre-wrap", textAlign: "justify" }}>
                                    {agreement?.fixedParts?.map((part, index) => (
                                        <React.Fragment key={index}>
                                            <span>{part}</span>
                                            {index < agreement.editableValues.length && (
                                                <p
                                                    ref={(el) => {
                                                        if (el && !el.innerHTML.trim()) {
                                                            el.innerHTML = agreement.editableValues[index] || "\u00A0";
                                                        }
                                                    }}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onInput={(e) => {
                                                        const html = e.currentTarget.innerHTML;
                                                        handleEditableChange(index, html);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.ctrlKey && e.key.toLowerCase() === "b") {
                                                            e.preventDefault();
                                                            document.execCommand("bold");
                                                        }
                                                        if (e.key === "Tab") {
                                                            e.preventDefault();
                                                            const selection = window.getSelection();
                                                            if (!selection.rangeCount) return;
                                                            const range = selection.getRangeAt(0);
                                                            const tabSpaces = "\u00A0".repeat(8);
                                                            const spaceNode = document.createTextNode(tabSpaces);
                                                            range.insertNode(spaceNode);
                                                            range.setStartAfter(spaceNode);
                                                            selection.removeAllRanges();
                                                            selection.addRange(range);
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (!e.currentTarget.textContent.trim()) {
                                                            e.currentTarget.innerHTML = "\u00A0";
                                                        }
                                                    }}
                                                    style={{
                                                        display: "inline",
                                                        minWidth: "2ch",
                                                        maxWidth: "100%",
                                                        outline: "none",
                                                        background: "transparent",
                                                        verticalAlign: "middle",
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                        fontFamily: "inherit",
                                                        fontSize: "inherit",
                                                        padding: "0 2px",
                                                        boxSizing: "border-box",
                                                        textDecoration: "underline",
                                                        textDecorationSkipInk: "none",
                                                        textAlign: "justify",
                                                    }}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <div className="form-control bg-white p-3" style={{ whiteSpace: "pre-wrap", minHeight: "300px", textAlign: "justify" }}>
                                    {agreement?.fixedParts?.map((part, index) => (
                                        <React.Fragment key={index}>
                                            <span>{part}</span>
                                            {index < agreement.editableValues.length && (
                                                <span dangerouslySetInnerHTML={{ __html: agreement.editableValues[index] }} />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fixed Headings */}
                        {renderHeadings(fixedHeadings, setFixedHeadings, true)}

                        {/* Custom Headings */}
                        {/* {renderHeadings(headings, setHeadings, false)} */}

                        {/* NEW: Client decision buttons */}
                        {renderClientDecisionButtons()}

                        {/* NEW: Signature pad for client after acceptance */}
                        {showSignaturePad && (
                            <div style={{ padding: 20 }} data-html2canvas-ignore="true">
                                <h2>Client Signature</h2>
                                <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
                            </div>
                        )}

                        {(isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === "lawyer") && (
                            <div style={{ padding: 20 }} data-html2canvas-ignore="true">
                                <h2>Lawyer Signature</h2>
                                <Form_SignaturePad height={250} onSave={handleSignatureSave} />
                            </div>
                        )}

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "20px",
                                width: "100%",
                            }}
                        >
                            {savedSignature && (
                                <div>
                                    <h4>Lawyer Signature:</h4>
                                    <img
                                        src={savedSignature}
                                        alt="Lawyer Signature"
                                        style={{
                                            maxWidth: "220px",
                                            maxHeight: "300px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                            )}

                            {/* ADDED: Stamp between signatures when both are present */}
                            {savedSignature && savedClientSignature && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column"
                                }}>
                                    <img
                                        src={logoiA}
                                        alt="Stamp"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            opacity: 0.8,
                                            margin: "0 20px"
                                        }}
                                    />
                                    <span style={{ fontSize: "12px", marginTop: "5px", fontStyle: "italic" }}>
                                        Verified and Authenticated
                                    </span>
                                </div>
                            )}

                            {savedClientSignature && (
                                <div>
                                    <h4>Client Signature:</h4>
                                    <img
                                        src={savedClientSignature}
                                        alt="Client Signature"
                                        style={{
                                            maxWidth: "220px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {/* ⬇️⬇️⬇️ ADD REJECTION STATUS DISPLAY RIGHT HERE ⬇️⬇️⬇️ */}
                        {/* Rejection Status Display - UPDATED */}
                        {/* Rejection Status Display - FIXED */}
                        {lfaStatus === "rejected" && dataList?.rejectionReason && (
                            <div className="alert alert-danger mt-4" role="alert">
                                <h5 className="alert-heading">
                                    {/* Show appropriate message based on user role */}
                                    {(isclient || isEmailLinkAccess) ? "You have rejected this LFA" : "Client has rejected this LFA"}
                                </h5>
                                <p className="mb-1"><strong>Reason for rejection:</strong></p>
                                <p className="mb-0">{dataList.rejectionReason}</p>
                                {dataList.rejectedAt && (
                                    <small className="text-muted d-block mt-2">
                                        Rejected on: {new Date(dataList.rejectedAt).toLocaleDateString()}
                                        {dataList.rejectedBy && ` by ${dataList.rejectedBy}`}
                                    </small>
                                )}

                                {/* Show resubmission instructions ONLY to lawyer (not client/email access) */}
                                {!isclient && !isEmailLinkAccess && token?.Role === "lawyer" && (
                                    <div className="mt-3">
                                    </div>
                                )}
                            </div>
                        )}
                        {/* NEW: Rejection Popup Modal for Lawyer */}
                        {/* NEW: Rejection Popup Modal for Lawyer */}
                        {!isclient && !isEmailLinkAccess && token?.Role === "lawyer" && lfaStatus === "rejected" && dataList?.rejectionReason && !editMode && !rejectionAcknowledged && (
                            <Modal show={true} onHide={() => setRejectionAcknowledged(true)} backdrop="static" keyboard={false}>
                                <Modal.Header style={{ backgroundColor: "#f8d7da", borderColor: "#f5c6cb" }}>
                                    <Modal.Title className="text-danger">LFA Rejected by Client</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="alert alert-warning" role="alert">
                                        <h6 className="alert-heading">Client has rejected this Legal Fee Agreement</h6>
                                        <hr />
                                        <p className="mb-2"><strong>Reason for rejection:</strong></p>
                                        <p className="mb-3">{dataList.rejectionReason}</p>
                                        <small className="text-muted">
                                            Rejected on: {new Date(dataList.rejectedAt || Date.now()).toLocaleDateString()}
                                        </small>
                                    </div>

                                    {/* <div className="mt-3">
                                    <p className="mb-2"><strong>Next steps:</strong></p>
                                    <ul className="small">
                                        <li>Review the client's feedback above</li>
                                        <li>Make necessary changes to the agreement</li>
                                        <li>Click "Edit Agreement" to make changes</li>
                                        <li>After editing, click "Save & Update Agreement" to resubmit</li>
                                        <li>The client will be notified to review the updated LFA</li>
                                    </ul>
                                </div> */}
                                </Modal.Body>
                                <Modal.Footer className="justify-content-center">
                                    {/* OK Button - Closes the modal */}
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={() => setRejectionAcknowledged(true)}
                                        style={{
                                            backgroundColor: "#001f54",
                                            color: "white",
                                            border: "none",
                                            transition: "all 0.3s ease-in-out",
                                            minWidth: "100px"
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = "#c0a262";
                                            e.currentTarget.style.color = "black";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = "#001f54";
                                            e.currentTarget.style.color = "white";
                                        }}
                                    >
                                        OK
                                    </button>

                                    {/* Edit Agreement Button */}
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setEditMode(true)}
                                        style={{
                                            backgroundColor: "#001f54",
                                            color: "white",
                                            border: "none",
                                            transition: "all 0.3s ease-in-out",
                                            minWidth: "120px"
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = "#c0a262";
                                            e.currentTarget.style.color = "black";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = "#001f54";
                                            e.currentTarget.style.color = "white";
                                        }}
                                    >
                                        Edit Agreement
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        )}
                        {/* Resubmission Status Display */}
                        {/* {(isclient || isEmailLinkAccess) && dataList?.resubmittedAt && (
    <div className="alert alert-info mt-4" role="alert">
        <h5 className="alert-heading">LFA Resubmitted</h5>
        <p className="mb-1">
            This LFA was resubmitted by {dataList.resubmittedBy || "lawyer"} on {new Date(dataList.resubmittedAt).toLocaleDateString()}.
        </p>
        <p className="mb-0">Please review the updated agreement.</p>
    </div>
)} */}

                        <div className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap" data-html2canvas-ignore="true">
                            {(!isclient && savedClientSignature && savedLawyerSignature) && (
                                <button
                                    className="btn btn-sm btn-primary fw-bold"
                                    onClick={handleUpdateLawyerSubmit}
                                    style={{ width: "150px" }}
                                    data-html2canvas-ignore="true"
                                >
                                    Save & Update Agreement
                                </button>
                            )}

                            {editMode ? (
                                <>
                                    {(!isFormFilled && !savedClientSignature) ? (
                                        <button
                                            className="btn btn-sm btn-primary fw-bold"
                                            onClick={token?.Role !== "client" ? handleLawyerSubmit : handleClientSubmit}
                                            style={{ width: "150px" }}
                                            data-html2canvas-ignore="true"
                                        >
                                            Save & Submit Agreement
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-sm btn-primary fw-bold"
                                            onClick={handleUpdateLawyerSubmit}
                                            style={{ width: "150px" }}
                                            data-html2canvas-ignore="true"
                                        >
                                            Save & Update Agreement
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Show submit button for both portal access AND email link access */}
                                    {((isclient && savedClientSignature && lfaStatus === "accepted" && !signatureSubmitted) ||
                                        (isEmailLinkAccess && savedClientSignature && lfaStatus === "accepted" && !signatureSubmitted)) && (
                                            <button
                                                className="btn btn-sm btn-primary fw-bold"
                                                onClick={handleUpdateLawyerSubmit}
                                                style={{ width: "150px" }}
                                                data-html2canvas-ignore="true"
                                            >
                                                Submit Signature
                                            </button>
                                        )}

                                    {(!isclient && !savedClientSignature && token?.Role === "lawyer") && (
                                        <button
                                            className="btn btn-sm btn-primary fw-bold"
                                            onClick={() => setEditMode(true)}
                                            style={{ width: "150px" }}
                                            data-html2canvas-ignore="true"
                                        >
                                            Edit Agreement
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        {/* Add this at the end of the form content */}
                        {isEmailLinkAccess && signatureSubmitted && (
                            <ThankYouMessage />
                        )}
                    </div>

                </>
            ) : (
                <div className="text-center text-black py-5">No LFA Form Available.</div>
            )}

            {/* NEW: Rejection Modal */}
            {renderRejectionModal()}
        </div>
    );
};

export default LEA_Form;