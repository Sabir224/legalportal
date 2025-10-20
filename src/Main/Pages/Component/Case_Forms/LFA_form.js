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
import { BsPlus, BsDash, BsDownload } from 'react-icons/bs';
import { Dropdown, Form, InputGroup, Modal, Button, Table } from 'react-bootstrap';
import CEEditable from './CEEditable';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import logo from '../../../Pages/Images/logo.png';
import pdfMake from 'pdfmake/build/pdfmake';

import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import backgroundImage from '../../../Pages/Images/bg.jpg';
import logoiA from '../../../Pages/Component/assets/Stamp.png'; // Add your stamp image
import AWSlogo from '../../../Pages/Component/assets/AWSSideLogo.png'; // Add this import at the top of your file
import AWSlogo5 from '../../../Pages/Component/assets/AWSSideLogo2.png';
import AWSlegalServices from '../../../Pages/Component/assets/AWSlegalServices.jpg'; // Add this import

pdfMake.vfs = pdfFonts.vfs;

// Also set the fonts
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};
const buttonStyle = {
  backgroundColor: '#16213e',
  color: 'white',
  width: '150px',
  minWidth: '100px',
  maxWidth: '200px',
  padding: '8px 20px',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer',
  textAlign: 'center',
  border: '2px solid #16213e',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  fontWeight: '500',
};

const LEA_Form = ({ token }) => {
  const [isHovered, setIsHovered] = useState(false);
  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const { showDataLoading } = useAlert();

  const [selectedDrafts, setSelectedDrafts] = useState('Select Draft');
  const [getDrafts, setGetDrafts] = useState(null);

  // NEW: force remount key for contentEditable sections
  const [draftKey, setDraftKey] = useState(0);

  // NEW: State for client rejection
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);
  // Add these state variables and functions to your component
  const [caseId, setCaseId] = useState(null);
  const [LinkcaseId, setLinkcaseId] = useState('');
  const [showLinkGenerator, setShowLinkGenerator] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isEmailLinkAccess, setIsEmailLinkAccess] = useState(false);
  const [signatureSubmitted, setSignatureSubmitted] = useState(false); // NEW: Track if signature was submitted

  // NEW: Service Type State - CHANGED: "suhad" instead of "litigation", "aws" instead of "legalServices"
  const [serviceType, setServiceType] = useState('suhad'); // "suhad" or "aws"

  // Service Lists based on type - CHANGED: Names updated but functionality remains
  const suhadServices = [
    'Advance',
    'First Instance',
    'Appeal',
    'Cassation',
    'Collection',
    'Judegment',
    'Adudicated Amount',
    'Mergers & Acquisitions',
    'Real Estate Law',
    'Success Fee',
    // "Alternative Dispute Resolution / Arbitration / Dispute Resolution",
    // "Debt Collection"
  ];

  const awsServices = [
    'Business Setup',
    'Under Corporate Services',
    'Golden Visa',
    'Partner Visa',
    'Bank Account',
    'Drafted Legal Agreement',
    'Prepared NOC Draft',
    'Legal Advice',
  ];

  const [servicesList, setServicesList] = useState(suhadServices);

  // NEW: State for Services and Fees Modal
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [serviceFees, setServiceFees] = useState('');
  const [currentSection, setCurrentSection] = useState(''); // To track which section the button was clicked from

  const [services, setServices] = useState([
    {
      id: uuidv4(),
      selectedService: '',
      serviceFees: '',
      vatCharges: '', // NEW: VAT Charges field
      awsFees: '', // NEW: AWS Fees field
    },
  ]);

  // NEW: State to track saved services for each section
  const [savedServices, setSavedServices] = useState({
    'Section 3: Professional Fees for Dispute Case': [],
    'Section 4: Other Fees': [],
  });

  const handleGenerateLink = () => {
    const originalLink = `${window.location.origin}/LFA_Form?caseId=${caseInfo?._id}&timestamp=${Date.now()}`;
    const encrypted = btoa(originalLink);
    const finalLink = `${window.location.origin}/LFA_Form?data=${encodeURIComponent(encrypted)}`;
    setGeneratedLink(finalLink);

    navigator.clipboard
      .writeText(finalLink)
      .then(() => {
        alert('Encrypted link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    const caseIdParam = params.get('caseId');

    if (encoded) {
      try {
        const decodedLink = atob(decodeURIComponent(encoded));
        console.log('Decoded full link:', decodedLink);

        const url = new URL(decodedLink);
        const caseId = url.searchParams.get('caseId');

        if (caseId) {
          setShowLinkGenerator(false);
          setLinkcaseId(caseId);
          FetchLFA(caseId);

          // Store in localStorage for dashboard redirection
          localStorage.setItem('pendingCaseId', caseId);
          localStorage.setItem('pendingUserId', 'client');
          localStorage.setItem('pendingScreenIndex', '27');
          localStorage.setItem('pendingFormType', 'lfa');

          // Set that this is an email link access
          setIsEmailLinkAccess(true);
        }
      } catch (err) {
        console.error('Decryption failed:', err);
      }
    } else if (caseIdParam) {
      // Direct caseId parameter
      setShowLinkGenerator(false);
      setLinkcaseId(caseIdParam);
      FetchLFA(caseIdParam);

      localStorage.setItem('pendingCaseId', caseIdParam);
      localStorage.setItem('pendingUserId', 'client');
      localStorage.setItem('pendingScreenIndex', '27');
      localStorage.setItem('pendingFormType', 'lfa');

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
      ' (Hereinafter referred to as the "Client")',
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
      '+971521356931',
    ],
  });

  const [fixedHeadings, setFixedHeadings] = useState([
    {
      title: 'Section 1: Fundamental Ethics and Professional Conducts Rules',
      points: [{ text: '', subpoints: [] }],
      editable: true,
    },
    { title: 'Section 2: Purpose ', points: [{ text: '', subpoints: [] }], editable: true },
    { title: 'Section 3: Professional Fees for Dispute Case ', points: [{ text: '', subpoints: [] }], editable: false },
    { title: 'Section 4: Other Fees ', points: [{ text: '', subpoints: [] }], editable: false },
    { title: 'Section 5: Making Contact', points: [{ text: '', subpoints: [] }], editable: true },
    { title: 'Section 6: Making appointments', points: [{ text: '', subpoints: [] }], editable: true },
    { title: 'Section 7: Co-operation ', points: [{ text: '', subpoints: [] }], editable: true },
    { title: 'Section 8: Contact by the other side', points: [{ text: '', subpoints: [] }], editable: true },
    { title: 'Section 9: Bank Details', points: [{ text: '', subpoints: [] }], editable: true },
    { title: 'Section 10: Miscellaneous ', points: [{ text: '', subpoints: [] }], editable: true },
  ]);

  const [headings, setHeadings] = useState([]);

  const [savedSignature, setSavedSignature] = useState(null);
  const [savedLawyerSignature, setSavedLawyerSignature] = useState(null);
  const [isFormFilled, setisFormFilled] = useState(false);
  const [savedClientSignature, setSavedClientSignature] = useState(null);
  const [isLocalSign, setIsLocalSign] = useState(false);
  const [IsLocalLawyerSign, setIsLocalLawyerSign] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [lfaStatus, setLfaStatus] = useState(''); // NEW: Track LFA status
  const [showSignaturePad, setShowSignaturePad] = useState(false); // NEW: Control signature pad visibility
  const isclient = token?.Role === 'client';
  const [rejectionAcknowledged, setRejectionAcknowledged] = useState(false);

  // NEW: Handle Service Type Change - CHANGED: Updated to use "suhad" and "aws"
  const handleServiceTypeChange = (type) => {
    setServiceType(type);
    if (type === 'suhad') {
      setServicesList(suhadServices);
    } else {
      setServicesList(awsServices);
    }
  };

  // NEW: Function to calculate service total
  const calculateServiceTotal = (service) => {
    const baseFee = parseFloat(service.serviceFees) || 0;
    let vatAmount = 0;

    // Calculate VAT based on percentage or fixed amount
    if (service.vatCharges) {
      if (service.vatCharges.includes('%')) {
        const vatPercentage = parseFloat(service.vatCharges) || 0;
        vatAmount = (baseFee * vatPercentage) / 100;
      } else {
        vatAmount = parseFloat(service.vatCharges) || 0;
      }
    }

    const awsFee = parseFloat(service.awsFees) || 0;

    return baseFee + vatAmount + awsFee;
  };

  // NEW: Function to calculate grand total for a section
  const calculateGrandTotal = (servicesData) => {
    return servicesData.reduce((total, service) => {
      return total + calculateServiceTotal(service);
    }, 0);
  };

  // NEW: Functions for Services and Fees Modal
  const handleAddService = () => {
    setServices([
      ...services,
      {
        id: uuidv4(),
        selectedService: '',
        serviceFees: '',
        vatCharges: '', // NEW: VAT Charges field
        awsFees: '', // NEW: AWS Fees field
        additionalText: '', // FIXED: Ensure additionalText is empty for new services
      },
    ]);
  };

  const handleRemoveService = (serviceId) => {
    if (services.length > 1) {
      setServices(services.filter((service) => service.id !== serviceId));
    }
  };

  const handleServiceChange = (serviceId, field, value) => {
    setServices(services.map((service) => (service.id === serviceId ? { ...service, [field]: value } : service)));
  };

  const handleSaveAllServices = async () => {
    // Validate all services
    const invalidServices = services.filter((service) => !service.selectedService || !service.serviceFees);

    if (invalidServices.length > 0) {
      alert('Please select a service and enter fees for all services');
      return;
    }

    try {
      const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

      // FIX: Get the correct lfaId - use dataList._id if available, otherwise use targetCaseId
      const lfaId = dataList?._id || targetCaseId;

      if (!targetCaseId || !lfaId) {
        alert('Case ID or LFA ID not found');
        return;
      }

      // FIXED: Create a clean copy of services without any potential duplicates
      const cleanServices = services.map((service) => ({
        id: service.id,
        selectedService: service.selectedService,
        serviceFees: service.serviceFees,
        vatCharges: service.vatCharges,
        awsFees: service.awsFees,
        additionalText: service.additionalText || '', // Ensure additionalText is not undefined
      }));

      const response = await fetch(`${ApiEndPoint}saveServices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lfaId: lfaId,
          caseId: targetCaseId,
          services: {
            section: currentSection,
            services: cleanServices,
            serviceType: serviceType,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save services');
      }

      const data = await response.json();

      if (data.success) {
        // Update the savedServices state - REPLACE existing services for this section
        setSavedServices((prev) => ({
          ...prev,
          [currentSection]: cleanServices,
        }));

        // Then update the section with services
        updateSectionWithServices(currentSection, cleanServices);

        // Force UI refresh
        setDraftKey((prev) => prev + 1);

        setShowServicesModal(false);
      } else {
        alert('Failed to save services: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving services:', error);
      alert('Failed to save services. Please try again.');
    }
  };

  // UPDATED: Function to update section with services - NOW WITH SEPARATE LINES
  const updateSectionWithServices = (section, servicesData) => {
    const sectionIndex = fixedHeadings.findIndex((h) => h.title === section);
    if (sectionIndex === -1) return;

    const updatedHeadings = [...fixedHeadings];
    const currentSection = updatedHeadings[sectionIndex];

    // Create service points from services data WITH SEPARATE LINES
    const servicePoints = servicesData.map((service) => {
      const serviceTotal = calculateServiceTotal(service);

      // Build the service text with each component on separate lines
      let serviceText = `<strong>${service.selectedService}: AED ${service.serviceFees}</strong><br/>`;

      // Add VAT charges if provided (now supports percentages)
      if (service.vatCharges && service.vatCharges !== '') {
        serviceText += `<strong>VAT Charges: ${service.vatCharges}</strong><br/>`;
      }

      // Add AWS fees if provided
      if (service.awsFees && service.awsFees !== '') {
        serviceText += `<strong>AWS Fees: ${service.awsFees}</strong><br/>`;
      }

      // Add individual service total
      serviceText += `<strong>Total: AED ${serviceTotal.toFixed(2)}</strong>`;

      // Add additional text if provided - on a new line without bold
      if (service.additionalText && service.additionalText.trim() !== '') {
        serviceText += `<br/>${service.additionalText}`;
      }

      return {
        text: serviceText,
        subpoints: [],
      };
    });

    // STRICT: Identify existing non-service points using strict pattern
    const existingNonServicePoints = currentSection.points.filter((point) => {
      if (!point.text || point.text.trim() === '') return false;

      // STRICT pattern: must match exact service format with AED and numbers
      const isServicePoint =
        point.text &&
        point.text.includes('<strong>') &&
        point.text.includes('AED') &&
        point.text.includes('Total: AED');

      return !isServicePoint;
    });

    // REPLACE existing services with new ones (without grand total)
    const allPoints = [...existingNonServicePoints, ...servicePoints];

    // Update the section with combined points
    updatedHeadings[sectionIndex] = {
      ...currentSection,
      points: allPoints,
    };

    setFixedHeadings(updatedHeadings);

    // Also update the dataList to reflect changes immediately
    if (dataList) {
      setDataList((prev) => ({
        ...prev,
        fixedHeadings: updatedHeadings,
      }));
    }
  };

  // FIXED: handleAddServiceClick - properly loads existing services without duplication
  const handleAddServiceClick = (section) => {
    setCurrentSection(section);

    // Check if we have saved services for this section
    const existingServices = savedServices[section];

    if (existingServices && existingServices.length > 0) {
      // Use services from savedServices state with proper IDs
      const servicesWithIds = existingServices.map((service) => ({
        ...service,
        id: service.id || uuidv4(),
      }));
      setServices(servicesWithIds);
    } else {
      // Also check if there are services in the current section content
      const sectionIndex = fixedHeadings.findIndex((h) => h.title === section);
      if (sectionIndex !== -1) {
        const currentSection = fixedHeadings[sectionIndex];

        // Parse existing services from section content (if any)
        const parsedServices = parseServicesFromSection(currentSection);

        if (parsedServices.length > 0) {
          setServices(parsedServices);
          // Also update savedServices to maintain consistency
          setSavedServices((prev) => ({
            ...prev,
            [section]: parsedServices,
          }));
        } else {
          // Start with empty service if no existing services
          setServices([
            {
              id: uuidv4(),
              selectedService: '',
              serviceFees: '',
              vatCharges: '', // NEW: VAT Charges field
              awsFees: '', // NEW: AWS Fees field
              additionalText: '',
            },
          ]);
        }
      } else {
        // Start with empty service
        setServices([
          {
            id: uuidv4(),
            selectedService: '',
            serviceFees: '',
            vatCharges: '', // NEW: VAT Charges field
            awsFees: '', // NEW: AWS Fees field
            additionalText: '',
          },
        ]);
      }
    }

    setShowServicesModal(true);
  };

  // UPDATED: Helper function to parse services from section content - NOW HANDLES SEPARATE LINES
  const parseServicesFromSection = (section) => {
    if (!section || !section.points) return [];

    const services = [];

    section.points.forEach((point) => {
      if (point.text && point.text.trim() !== '') {
        // Match service format with separate lines
        const serviceMatch = point.text.match(/^<strong>([^:]+): AED ([\d,]+\.?\d*)<\/strong>/);

        if (serviceMatch) {
          const [, serviceName, feeAmount] = serviceMatch;

          // Parse VAT charges, AWS fees, and additional text from separate lines
          let vatCharges = '';
          let awsFees = '';
          let additionalText = '';

          // Split by <br/> to get separate lines
          const lines = point.text.split(/<br\/?>/);

          if (lines.length > 1) {
            // Parse VAT charges from second line
            if (lines[1]) {
              const vatMatch = lines[1].match(/<strong>VAT Charges:\s*([^<]+)<\/strong>/);
              if (vatMatch) {
                vatCharges = vatMatch[1].trim();
              }
            }

            // Parse AWS fees from third line
            if (lines[2]) {
              const awsMatch = lines[2].match(/<strong>AWS Fees:\s*([^<]+)<\/strong>/);
              if (awsMatch) {
                awsFees = awsMatch[1].trim();
              }
            }

            // Parse total from fourth line (we don't need to store this as it's calculated)

            // Additional text starts from fifth line
            if (lines.length > 4) {
              additionalText = lines.slice(4).join(' ').trim();
            }
          }

          services.push({
            id: uuidv4(),
            selectedService: serviceName.trim(),
            serviceFees: feeAmount.replace(/,/g, ''), // Remove commas from fee
            vatCharges: vatCharges,
            awsFees: awsFees,
            additionalText: additionalText,
          });
        }
      }
    });

    return services;
  };

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
      setSavedClientSignature(data.data?.ClientSignatureImage ? data.data?.ClientSignatureImage : '');
      setSavedSignature(data.data?.LawyerSignatureImage ? data.data?.LawyerSignatureImage : '');
      setLfaStatus(data.data?.status || '');
      setEditMode(false);
      setisFormFilled(true);
      setIsLocalSign(!!data.data?.ClientSignatureImage);
      setIsLocalLawyerSign(!data.data?.LawyerSignatureImage);
      setSavedLawyerSignature();

      // Set service type if available in data - CHANGED: Updated to use "suhad" and "aws"
      if (data.data?.serviceType) {
        setServiceType(data.data.serviceType);
        if (data.data.serviceType === 'aws') {
          setServicesList(awsServices);
        } else {
          setServicesList(suhadServices);
        }
      }

      // Load saved services if available
      if (data.data?.savedServices) {
        const servicesBySection = {};
        data.data.savedServices.forEach((serviceGroup) => {
          servicesBySection[serviceGroup.section] = serviceGroup.services;
        });
        setSavedServices(servicesBySection);

        // Update sections with saved services
        Object.keys(servicesBySection).forEach((section) => {
          updateSectionWithServices(section, servicesBySection[section]);
        });
      }

      // If this is email link access and form is already accepted, show signature pad
      if (isEmailLinkAccess) {
        if (data.data?.status === 'accepted' && !data.data?.ClientSignatureImage) {
          setShowSignaturePad(true);
          setSignatureSubmitted(false);
        } else if (data.data?.ClientSignatureImage) {
          setShowSignaturePad(false);
          setSignatureSubmitted(true);
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
      const response = await fetch(`${ApiEndPoint}get-image-base64?url=${encodeURIComponent(imageUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to get Base64 from server');
      }
      const base64 = await response.text();
      return base64;
    } catch (error) {
      console.error('Error fetching Base64:', error);
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
      console.error('Error fetching assigned users:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    try {
      // Fetch assigned users data
      const assignedUsersData = await fetchAssignedUsers(caseInfo?._id);

      // Extract lawyer and client information
      let lawyerName = 'Lawyer Name';
      let clientName = 'Client Name';

      if (assignedUsersData) {
        // Find lawyer from assigned users
        const lawyer = assignedUsersData.AssignedUsers?.find((user) => user.Role === 'lawyer');
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
      const BAR_COLOR = '#0A1C45'; // Deep navy blue (same as DOCX)
      const LOGO_SIZE = 42; // Size for the sidebar logo
      const LOGO_SPACING = 28; // Spacing between logos
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
        console.error('Failed to load AWS logos:', error);
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
          bolditalics: 'Roboto-MediumItalic.ttf',
        },
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique',
        },
      };

      // Load the AWS legal services header image
      const loadAWSlegalServicesImage = async () => {
        try {
          const awsLegalServicesImg = await loadImage(AWSlegalServices);
          return convertImageToBase64(awsLegalServicesImg);
        } catch (error) {
          console.error('Failed to load AWS legal services header image:', error);
          return null;
        }
      };

      // Get the AWS legal services header image as base64
      const awsLegalServicesBase64 = await loadAWSlegalServicesImage();

      // CHANGED: Dynamic header content based on service type - updated to use "suhad" and "aws"
      const headerContent =
        serviceType === 'aws'
          ? awsLegalServicesBase64
            ? {
                stack: [
                  {
                    image: awsLegalServicesBase64,
                    width: 300, // Adjust width as needed for your image
                    height: 80, // Adjust height as needed for your image
                    alignment: 'left',
                    margin: [0, 0, 0, 0],
                  },
                ],
              }
            : {
                stack: [
                  { text: 'LEGAL', fontSize: 22, bold: true, color: '#0A1C45', margin: [0, 6, 0, 0] },
                  { text: 'AWS LEGAL CONSULTANCY', fontSize: 12, bold: true, color: '#0A1C45', margin: [0, 2, 0, 0] },
                  {
                    text: 'ADVOCATES & LEGAL CONSULTANTS',
                    fontSize: 9,
                    color: '#8a96b2',
                    margin: [0, 2, 0, 0],
                    characterSpacing: 1,
                  },
                ],
              }
          : {
              stack: [
                { text: 'LEGAL', fontSize: 22, bold: true, color: '#0A1C45', margin: [0, 6, 0, 0] },
                { text: 'SUHAD ALJUBOORI', fontSize: 12, bold: true, color: '#0A1C45', margin: [0, 2, 0, 0] },
                {
                  text: 'ADVOCATES & LEGAL CONSULTANTS',
                  fontSize: 9,
                  color: '#8a96b2',
                  margin: [0, 2, 0, 0],
                  characterSpacing: 1,
                },
              ],
            };

      // CHANGED: Dynamic footer content based on service type - updated to use "suhad" and "aws"
      const footerContent =
        serviceType === 'aws'
          ? 'P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nTel: +971 (04) 332 5928, web: aws-legalgroup.com,\n email: info@awsadvocates.com'
          : 'P/O Box 96070\nDubai: 1602, The H Dubai, One Sheikh Zayed Road\nTel: +971 (04) 332 5928, web: suhad-legal.com,\n email: info@suhadlegal.com';

      const docDefinition = {
        background: (currentPage, pageSize) => {
          const elems = [
            {
              canvas: [
                {
                  type: 'rect',
                  x: 0,
                  y: 0,
                  w: sidebarWidth,
                  h: pageSize.height,
                  color: BAR_COLOR,
                },
              ],
            },
          ];

          // TOP logo (left strip)
          // TOP logo (left strip) - AWS logo at the top
          const topStartY = 50;
          elems.push({
            image: awsLogoBase64,
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            absolutePosition: {
              x: (sidebarWidth - LOGO_SIZE) / 2,
              y: topStartY,
            },
          });

          // BOTTOM logo (left strip) - AWSlogo5 at the bottom
          const bottomStartY = pageSize.height - 140;
          elems.push({
            image: awsLogo5Base64,
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            absolutePosition: {
              x: (sidebarWidth - LOGO_SIZE) / 2,
              y: bottomStartY,
            },
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
              absolutePosition: { x: wmX, y: wmY },
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
                  // ONLY show logo for suhad, NOT for aws services - CHANGED: Updated to use "suhad" instead of "litigation"
                  serviceType === 'suhad' && logoBase64
                    ? { image: logoBase64, width: 70, height: 70, margin: [0, 0, 10, 0] }
                    : { text: '', width: 0 },

                  headerContent,
                ].filter((item) => item),
                width: '*',
              },
            ],
          };
        },

        footer: (currentPage, pageCount, pageSize) => {
          return {
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: pageSize.width,
                    h: 70,
                    color: '#f5f5f5',
                  },
                ],
              },
              {
                columns: [
                  { width: '*', text: '' },
                  {
                    stack: [
                      {
                        text: footerContent,
                        alignment: 'center',
                        fontSize: 7,
                        color: '#333333',
                        margin: [0, -60, 0, 0],
                      },
                    ],
                  },
                  {
                    text: `Page ${currentPage} of ${pageCount}`,
                    alignment: 'right',
                    margin: [0, -60, 40, 0],
                    fontSize: 8,
                    color: '#333333',
                  },
                ],
              },
            ],
            margin: [sidebarWidth, -10, 0, 0],
          };
        },

        content: [
          { text: 'Legal Fee Agreement', style: 'header', margin: [0, 10, 0, 10] },

          { text: 'Agreement', style: 'subHeader', margin: [0, 20, 0, 10] },
          {
            text: agreement.fixedParts.map((part, i) => part + (agreement.editableValues[i] || '')).join(' '),
            style: 'agreementText',
            margin: [0, 0, 0, 20],
          },
          // BEST SOLUTION: Maintain bold and single line
          // FIXED: Render ALL sections including "Other Fees"
          // In handleDownload function, replace the fixedHeadings mapping section:

          ...fixedHeadings
            .map((section, sectionIndex) => {
              const sectionContent = [];

              sectionContent.push({
                text: section.title,
                style: 'subHeader',
                margin: [0, 20, 0, 10],
              });

              const pointsContent = section.points
                .map((point) => {
                  if (!point.text || point.text.trim() === '') return { text: ' ' };

                  // Handle service items with line breaks
                  if (point.text.includes('<strong>') && point.text.includes('<br/>')) {
                    const lines = point.text.split(/<br\/?>/);
                    const formattedLines = [];

                    lines.forEach((line, lineIndex) => {
                      if (line.trim() === '') return;

                      // Process bold text in each line
                      if (line.includes('<strong>')) {
                        const boldParts = line.split(/(<strong>.*?<\/strong>)/);
                        const lineContent = [];

                        boldParts.forEach((part) => {
                          if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
                            const boldText = part.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
                            lineContent.push({ text: boldText, bold: true });
                          } else if (part.trim() !== '') {
                            lineContent.push({ text: part });
                          }
                        });

                        formattedLines.push(lineContent);
                      } else {
                        formattedLines.push([{ text: line }]);
                      }
                    });

                    return {
                      stack: formattedLines.map((lineContent) => ({
                        text: lineContent,
                        margin: [0, 2, 0, 0],
                      })),
                      margin: [0, 4, 0, 8],
                    };
                  } else {
                    // Original handling for non-service content
                    if (point.text.includes('<strong>')) {
                      const parts = point.text.split(/(<strong>.*?<\/strong>)/);
                      const formattedText = [];

                      parts.forEach((part) => {
                        if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
                          const boldText = part.replace(/<strong>/g, '').replace(/<\/strong>/g, '');
                          formattedText.push({ text: boldText, bold: true });
                        } else if (part.trim() !== '') {
                          formattedText.push({ text: part });
                        }
                      });

                      return {
                        text: formattedText,
                        alignment: 'justify',
                        noWrap: false,
                      };
                    } else {
                      return {
                        text: point.text,
                        alignment: 'justify',
                        noWrap: false,
                      };
                    }
                  }
                })
                .filter((point) => point.text !== '');

              sectionContent.push({
                ol: pointsContent,
                style: 'pointsList',
                margin: [0, 0, 0, 20],
                type: 'lower-alpha',
              });

              return sectionContent;
            })
            .flat(),
          { text: 'Signatures', style: 'subHeader', margin: [0, 40, 0, 20] },
          {
            columns: [
              {
                width: '40%',
                stack: [
                  lawyerSignatureBase64
                    ? {
                        image: lawyerSignatureBase64,
                        width: 120,
                        height: 60,
                        margin: [0, 0, 0, 5],
                      }
                    : { text: '', margin: [0, 0, 0, 5] },
                  lawyerSignatureBase64
                    ? {
                        text: '___________________',
                        margin: [0, 0, 0, 5],
                      }
                    : { text: '', margin: [0, 0, 0, 5] },
                  { text: 'The Lawyer', style: 'signatureLabel' },
                  { text: lawyerName, style: 'signatureName' },
                ],
                alignment: 'center',
              },
              {
                width: '20%',
                stack:
                  lawyerSignatureBase64 && clientSignatureBase64
                    ? [
                        logoiA64
                          ? {
                              image: logoiA64,
                              width: 80,
                              height: 80,
                              margin: [0, 10, 0, 5],
                              alignment: 'center',
                            }
                          : { text: '' },
                        {
                          text: 'Verified and Authenticated',
                          style: 'stampText',
                          alignment: 'center',
                        },
                      ]
                    : [{ text: '' }],
                alignment: 'center',
              },
              {
                width: '40%',
                stack: [
                  clientSignatureBase64
                    ? {
                        image: clientSignatureBase64,
                        width: 120,
                        height: 60,
                        margin: [0, 0, 0, 5],
                      }
                    : { text: '', margin: [0, 0, 0, 5] },
                  clientSignatureBase64
                    ? {
                        text: '___________________',
                        margin: [0, 0, 0, 5],
                      }
                    : { text: '', margin: [0, 0, 0, 5] },
                  { text: 'The Client', style: 'signatureLabel' },
                  { text: clientName, style: 'signatureName' },
                ],
                alignment: 'center',
              },
            ],
            margin: [0, 0, 0, 40],
          },
        ],

        styles: {
          header: { fontSize: 18, bold: true, color: '#0A1C45' },
          subHeader: { fontSize: 14, bold: true, color: '#0A1C45' },
          agreementText: { fontSize: 11, lineHeight: 1.4, alignment: 'justify' },
          pointsList: { fontSize: 11, lineHeight: 1.4 },
          signatureLabel: { fontSize: 10, bold: true, alignment: 'center' },
          signatureName: { fontSize: 10, alignment: 'center' },
          stampText: { fontSize: 8, italics: true, alignment: 'center', color: '#666666' },
        },
        defaultStyle: { font: 'Roboto' },
      };

      // CHANGED: Updated PDF filename to use "suhad" and "aws"
      pdfMake.createPdf(docDefinition).download(`Legal_Fee_Agreement_${serviceType === 'aws' ? 'AWS' : 'Suhad'}.pdf`);
    } catch (e) {
      console.error('PDF generation failed:', e);
      alert('Sorry, unable to generate PDF. Check console for details.');
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
        alert('Case ID not found');
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
        setLfaStatus('accepted');
      } else {
        alert('Failed to accept LFA: ' + data.message);
      }
    } catch (error) {
      showDataLoading(false);
      console.error('Error accepting LFA:', error);
      alert('Failed to accept LFA. Please try again.');
    }
  };

  const handleRejectLFA = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    try {
      setIsSubmittingRejection(true);

      // Determine the case ID based on access method
      const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

      if (!targetCaseId) {
        setIsSubmittingRejection(false);
        alert('Case ID not found');
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
      setRejectionReason('');

      if (data.success) {
        setLfaStatus('rejected');
      } else {
        alert('Failed to reject LFA: ' + data.message);
      }
    } catch (error) {
      setIsSubmittingRejection(false);
      console.error('Error rejecting LFA:', error);
      alert('Failed to reject LFA. Please try again.');
    }
  };

  const handleSignatureSave = (dataUrl) => {
    setSavedSignature(dataUrl);
    setSavedLawyerSignature(dataUrl);
    setIsLocalLawyerSign(true);
  };

  const handleClientSignatureSave = (dataUrl) => {
    setSavedClientSignature(dataUrl);
    if (isEmailLinkAccess) {
      setSignatureSubmitted(false);
    }
  };

  const [editMode, setEditMode] = useState(token?.Role === 'lawyer' ? true : false);

  const handleEditableChange = (index, newValue) => {
    const updated = [...agreement.editableValues];
    updated[index] = newValue;
    setAgreement({ ...agreement, editableValues: updated });
  };

  function base64ToFile(base64String, filename) {
    const arr = base64String.split(',');
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
      formData.append('caseId', caseInfo?._id || '');
      formData.append('Islawyer', false);
      formData.append('serviceType', serviceType); // NEW: Add service type

      formData.append(
        'agreement',
        JSON.stringify({
          fixedParts: agreement?.fixedParts,
          editableValues: agreement?.editableValues,
        })
      );

      const formattedHeadings = fixedHeadings?.map((h) => ({
        title: h.title,
        points: h.points?.map((p) => ({
          text: p.text || '',
          subpoints: p.subpoints?.map((sp) => ({ text: sp.text || '' })) || [],
        })),
      }));

      formData.append('fixedHeadings', JSON.stringify(formattedHeadings));
      formData.append('headings', JSON.stringify(headings));

      if (savedClientSignature) {
        const file = base64ToFile(savedClientSignature, 'client-signature.png');
        formData.append('file', file);
      }

      const res = await fetch(`${ApiEndPoint}createLFAForm`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setEditMode(false);
        setIsLocalSign(true);
        setShowSignaturePad(false);
      } else {
        console.error('❌ Failed:', data.message);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleLawyerSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('caseId', caseInfo?._id || '');
      formData.append('Islawyer', true);
      formData.append('serviceType', serviceType);

      formData.append(
        'agreement',
        JSON.stringify({
          fixedParts: agreement.fixedParts,
          editableValues: agreement.editableValues,
        })
      );

      const formattedHeadings = fixedHeadings?.map((h) => ({
        title: h.title,
        points: h.points?.map((p) => ({
          text: p.text || '',
          subpoints: p.subpoints?.map((sp) => ({ text: sp.text || '' })) || [],
        })),
      }));

      formData.append('fixedHeadings', JSON.stringify(formattedHeadings));
      formData.append('headings', JSON.stringify(headings));

      if (savedSignature) {
        const file = base64ToFile(savedSignature, 'lawyer-signature.png');
        formData.append('file', file);
      }

      const res = await fetch(`${ApiEndPoint}createLFAForm`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        const targetCaseId = caseInfo?._id;

        // FIX: Use the actual LFA ID from the response
        const lfaId = data.data?._id; // This is the correct LFA ID

        console.log('LFA Created with ID:', lfaId);

        if (!lfaId) {
          console.error('No LFA ID returned from form creation');
          alert('Failed to get LFA ID. Services may not be saved properly.');
          setEditMode(false);
          return;
        }

        // Save all services from both sections when submitting the form
        const allServicesToSave = [];

        // Get services from Section 3
        const section3Services = savedServices['Section 3: Professional Fees for Dispute Case'] || [];
        if (section3Services.length > 0) {
          allServicesToSave.push({
            section: 'Section 3: Professional Fees for Dispute Case',
            services: section3Services,
          });
        }

        // Get services from Section 4
        const section4Services = savedServices['Section 4: Other Fees'] || [];
        if (section4Services.length > 0) {
          allServicesToSave.push({
            section: 'Section 4: Other Fees',
            services: section4Services,
          });
        }

        // Save all services to database with the correct lfaId
        if (allServicesToSave.length > 0) {
          try {
            for (const serviceGroup of allServicesToSave) {
              await saveServicesToDatabase(lfaId, targetCaseId, serviceGroup.services, serviceGroup.section);
            }
            console.log('All services saved successfully with initial LFA creation');
          } catch (error) {
            console.error('Failed to save services with LFA creation:', error);
            // Don't throw error here - the form was created successfully
            alert('LFA form saved but services failed to save. Please try adding services again.');
          }
        }

        setEditMode(false);

        // Refresh the data to get the updated LFA with services
        await FetchLFA(targetCaseId);
      } else {
        console.error('❌ Failed:', data.message);
        alert('Failed to create LFA form: ' + data.message);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form. Please try again.');
    }
  };
  const handleUpdateClientSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('caseId', caseInfo?._id || '');
      formData.append('Islawyer', false);
      formData.append('serviceType', serviceType); // NEW: Add service type

      formData.append(
        'agreement',
        JSON.stringify({
          fixedParts: agreement?.fixedParts,
          editableValues: agreement?.editableValues,
        })
      );

      const formattedHeadings = fixedHeadings?.map((h) => ({
        title: h.title,
        points: h.points?.map((p) => ({
          text: p.text || '',
          subpoints: p.subpoints?.map((sp) => ({ text: sp.text || '' })) || [],
        })),
      }));

      formData.append('fixedHeadings', JSON.stringify(formattedHeadings));
      formData.append('headings', JSON.stringify(headings));

      if (savedClientSignature) {
        const file = base64ToFile(savedClientSignature, 'client-signature.png');
        formData.append('file', file);
      }

      const res = await fetch(`${ApiEndPoint}createLFAForm`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setEditMode(false);
      } else {
        console.error('❌ Failed:', data.message);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const saveServicesToDatabase = async (lfaId, caseId, servicesData, section) => {
    try {
      console.log('Saving services with:', { lfaId, caseId, section, servicesCount: servicesData.length });

      const response = await fetch(`${ApiEndPoint}saveServices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lfaId: lfaId, // Ensure this is the LFA form ID, not case ID
          caseId: caseId,
          services: {
            section: section,
            services: servicesData,
            serviceType: serviceType,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save services');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save services');
      }

      console.log('Services saved successfully:', data.data);
      return data;
    } catch (error) {
      console.error('Error saving services:', error);
      throw error;
    }
  };

  const handleUpdateLawyerSubmit = async () => {
    try {
      if (lfaStatus === 'accepted') {
        handleAcceptLFA();
      }

      const targetCaseId = isEmailLinkAccess ? LinkcaseId : caseInfo?._id;

      if (!targetCaseId) {
        alert('Case ID not found');
        return;
      }

      let lfaId = dataList?._id;

      // Save all services from both sections when updating the form
      const allServicesToSave = [];

      // Get services from Section 3
      const section3Services = savedServices['Section 3: Professional Fees for Dispute Case'] || [];
      if (section3Services.length > 0) {
        allServicesToSave.push({
          section: 'Section 3: Professional Fees for Dispute Case',
          services: section3Services,
        });
      }

      // Get services from Section 4
      const section4Services = savedServices['Section 4: Other Fees'] || [];
      if (section4Services.length > 0) {
        allServicesToSave.push({
          section: 'Section 4: Other Fees',
          services: section4Services,
        });
      }

      // Save all services to database
      // Save all services to database
      // In handleUpdateLawyerSubmit function, replace the service saving section:
      if (allServicesToSave.length > 0) {
        try {
          for (const serviceGroup of allServicesToSave) {
            // FIX: Use the actual LFA ID from dataList, not case ID
            await saveServicesToDatabase(dataList._id, targetCaseId, serviceGroup.services, serviceGroup.section);
          }
          console.log('All services saved successfully with LFA submission');
        } catch (error) {
          console.error('Failed to save services with LFA submission:', error);
        }
      }

      const isLawyerSubmission = token?.Role === 'lawyer' && !isEmailLinkAccess;
      const isResubmission = lfaStatus === 'rejected';

      if (isResubmission) {
        console.log('Resubmittion = 1');
        const resubmitData = {
          resubmittedBy: 'lawyer',
          agreement: JSON.stringify({
            fixedParts: agreement?.fixedParts || [],
            editableValues: agreement?.editableValues || [],
          }),
          fixedHeadings: JSON.stringify(
            fixedHeadings?.map((h) => ({
              title: h.title,
              points: h.points?.map((p) => ({
                text: p.text || '',
                subpoints: p.subpoints?.map((sp) => ({ text: sp.text || '' })) || [],
              })),
            })) || []
          ),
          headings: JSON.stringify(headings || []),
          serviceType: serviceType, // NEW: Add service type
        };

        const res = await fetch(`${ApiEndPoint}resubmitLFAForm/${targetCaseId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resubmitData),
        });

        const data = await res.json();

        if (data.success) {
          setEditMode(false);
          setLfaStatus('pending');
          await FetchLFA(targetCaseId);
        } else {
          console.error('❌ Failed:', data.message);
          alert('Failed to resubmit LFA. Please try again.');
        }
      } else {
        const formData = new FormData();
        formData.append('caseId', targetCaseId);
        formData.append('Islawyer', isLawyerSubmission);
        formData.append('serviceType', serviceType); // NEW: Add service type

        formData.append(
          'agreement',
          JSON.stringify({
            fixedParts: agreement?.fixedParts || [],
            editableValues: agreement?.editableValues || [],
          })
        );

        const formattedHeadings =
          fixedHeadings?.map((h) => ({
            title: h.title,
            points: h.points?.map((p) => ({
              text: p.text || '',
              subpoints: p.subpoints?.map((sp) => ({ text: sp.text || '' })) || [],
            })),
          })) || [];

        formData.append('fixedHeadings', JSON.stringify(formattedHeadings));
        formData.append('headings', JSON.stringify(headings || []));

        if (isLawyerSubmission && savedSignature) {
          const file = base64ToFile(savedSignature, 'lawyer-signature.png');
          formData.append('file', file);
          console.log('Lawyer signature file appended');
        } else if ((isclient || isEmailLinkAccess) && savedClientSignature) {
          const file = base64ToFile(savedClientSignature, 'client-signature.png');
          formData.append('file', file);
          console.log('Client signature file appended');
        }

        const res = await fetch(`${ApiEndPoint}updateLFAForm`, {
          method: 'PUT',
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          setEditMode(false);

          if (isLawyerSubmission) {
            setSignatureSubmitted(true);
          } else {
            setSignatureSubmitted(true);
            setShowSignaturePad(false);
          }

          await FetchLFA(targetCaseId);
        } else {
          console.error('❌ Failed:', data.message);
          alert('Failed to submit signature. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form. Please try again.');
    }
  };

  const addHeading = () => setHeadings([...headings, { title: '', points: [{ text: '', subpoints: [] }] }]);

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

  const handlePickDraft = (data) => {
    setAgreement(data.agreement);
    setFixedHeadings(data.fixedHeadings);
    setHeadings(data.headings);
    setSelectedDrafts(data);
    setDraftKey((k) => k + 1);
  };

  const renderHeadings = (list, setFn, isFixed = false) => {
    if (!Array.isArray(list)) return null;

    const combinedHtml = list
      .map(
        (heading, hIndex) => `
            <div style="margin-bottom: 20px;">
                <strong>${heading.title || ''}</strong>
                <ol type="a" style="margin: 8px 0; padding-left: 24px;">
                    ${(heading.points || [])
                      .map((p) => `<li style="margin: 4px 0; text-align: justify;">${p.text || ''}</li>`)
                      .join('')}
                </ol>
            </div>
        `
      )
      .join('');

    return (
      <div className="section border p-2 rounded bg-light">
        {editMode ? (
          isFixed ? (
            <CEEditable
              list={list}
              onChange={(updatedList) => setFixedHeadings(updatedList)}
              disable={isFormFilled && !editMode}
              editableSections={list.map((item) => item.editable !== false)}
            />
          ) : (
            <CEEditable
              list={list}
              onChange={(updatedList) => setFn(updatedList)}
              disable={isFormFilled && !editMode}
            />
          )
        ) : (
          <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
        )}
      </div>
    );

    const parseHtmlToArray = (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const sections = [];

      let currentHeading = null;

      doc.body.childNodes.forEach((node) => {
        if (node.nodeName === 'P') {
          const headingText = node.textContent.replace(/^\d+\.\s*/, '').trim();
          currentHeading = { title: headingText, points: [] };
          sections.push(currentHeading);
        } else if (node.nodeName === 'UL' && currentHeading) {
          const points = Array.from(node.querySelectorAll('li')).map((li) => ({
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
            list={list}
            onChange={(updatedList) => setFixedHeadings(updatedList)}
            disable={isFormFilled && !editMode}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
        )}
      </div>
    );
  };

  // NEW: Service Type Selector Component - CHANGED: Updated labels to "Suhad Letterhead" and "AWS Letterhead"
  const ServiceTypeSelector = () => {
    if (!editMode || isclient || isEmailLinkAccess) return null;

    return (
      <div className="card p-3 mb-4" data-html2canvas-ignore="true">
        <label className="form-label fw-bold fs-6">Select Letterhead Type</label>
        <div className="d-flex gap-3">
          <Form.Check
            type="radio"
            id="suhad-radio"
            label="Suhad Letterhead"
            name="serviceType"
            checked={serviceType === 'suhad'}
            onChange={() => handleServiceTypeChange('suhad')}
          />
          <Form.Check
            type="radio"
            id="aws-radio"
            label="AWS Letterhead"
            name="serviceType"
            checked={serviceType === 'aws'}
            onChange={() => handleServiceTypeChange('aws')}
          />
        </div>
        <small className="text-muted">
          {serviceType === 'suhad' ? 'Suhad Letterhead - Litigation Services' : 'AWS Letterhead - Legal Services'}
        </small>
      </div>
    );
  };

  const renderClientDecisionButtons = () => {
    const shouldShowButtons =
      (isEmailLinkAccess || isclient) &&
      isFormFilled &&
      lfaStatus !== 'accepted' &&
      lfaStatus !== 'rejected' &&
      !savedClientSignature &&
      !signatureSubmitted;

    if (!shouldShowButtons) {
      return null;
    }

    return (
      <div className="d-flex justify-content-center align-items-center mt-4 mb-4 px-3" data-html2canvas-ignore="true">
        <button
          className="btn btn-danger fw-bold me-3"
          onClick={() => setShowRejectModal(true)}
          style={{ width: '150px' }}
        >
          Reject LFA
        </button>

        <button
          className="btn fw-bold"
          style={{
            width: '150px',
            backgroundColor: '#001f54',
            color: 'white',
            border: 'none',
            transition: 'all 0.3s ease-in-out',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#c0a262';
            e.currentTarget.style.color = 'black';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#001f54';
            e.currentTarget.style.color = 'white';
          }}
          onClick={() => {
            setLfaStatus('accepted');
            setShowSignaturePad(true);
          }}
        >
          Accept LFA
        </button>
      </div>
    );
  };

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
            <button
              style={buttonStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#c0a262';
                e.currentTarget.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#001f54';
                e.currentTarget.style.color = 'white';
              }}
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </button>

            <button variant="danger" style={buttonStyle} onClick={handleRejectLFA} disabled={isSubmittingRejection}>
              {isSubmittingRejection ? 'Submitting...' : 'Submit Rejection'}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderServicesModal = () => {
    // Combine all services for the dropdown
    const allServices = [
      {
        group: 'Litigation Services (Suhad)',
        services: suhadServices,
      },
      {
        group: 'Legal Services (AWS)',
        services: awsServices,
      },
    ];

    return (
      <Modal show={showServicesModal} onHide={() => setShowServicesModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Services and Fees - {currentSection}</Modal.Title>
          <div className="ms-3">
            <span className={`badge ${serviceType === 'suhad' ? 'bg-primary' : 'bg-success'}`}>
              {serviceType === 'suhad' ? 'Suhad Letterhead' : 'AWS Letterhead'}
            </span>
          </div>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Header with Add Service button */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">All Available Services</h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleAddService}
                className="d-flex align-items-center"
              >
                <BsPlus className="me-1" /> Add Another Service
              </Button>
            </div>
          </div>

          {/* Scrollable services area - FIXED: Better styling for text areas */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
            {services.map((service, serviceIndex) => (
              <div key={service.id} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Service {serviceIndex + 1}</h6>
                  {services.length > 1 && (
                    <Button variant="outline-danger" size="sm" onClick={() => handleRemoveService(service.id)}>
                      <BsDash />
                    </Button>
                  )}
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Select Service</Form.Label>
                  <Form.Select
                    value={service.selectedService}
                    onChange={(e) => handleServiceChange(service.id, 'selectedService', e.target.value)}
                  >
                    <option value="">Choose a service...</option>
                    {/* Show all service groups by default */}
                    {allServices.map((serviceGroup, groupIndex) => (
                      <optgroup key={groupIndex} label={serviceGroup.group}>
                        {serviceGroup.services.map((serviceOption, index) => (
                          <option key={`${groupIndex}-${index}`} value={serviceOption}>
                            {serviceOption}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Service Fees</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>AED</InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter fee amount"
                      value={service.serviceFees}
                      onChange={(e) => handleServiceChange(service.id, 'serviceFees', e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                {/* VAT Charges Field */}
                <Form.Group className="mb-3">
                  <Form.Label>VAT Charges</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter VAT charges (e.g., 5% or 100 AED)"
                    value={service.vatCharges}
                    onChange={(e) => handleServiceChange(service.id, 'vatCharges', e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Optional: Enter VAT charges as percentage (5%) or fixed amount (100 AED)
                  </Form.Text>
                </Form.Group>

                {/* AWS Fees Field */}
                <Form.Group className="mb-3">
                  <Form.Label>AWS Fees Charge</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>AED</InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter AWS fees"
                      value={service.awsFees}
                      onChange={(e) => handleServiceChange(service.id, 'awsFees', e.target.value)}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">Optional: Enter AWS fees for this service</Form.Text>
                </Form.Group>

                {/* Individual Service Total Display */}
                <div className="border-top pt-2 mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>Individual Service Total:</strong>
                    <span className="text-success fw-bold">AED {calculateServiceTotal(service).toFixed(2)}</span>
                  </div>
                </div>

                {/* Additional Text Field for Service - FIXED: Better textarea styling */}
                <Form.Group className="mb-3">
                  <Form.Label>Additional Text (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter any additional text specific to this service"
                    value={service.additionalText || ''}
                    onChange={(e) => handleServiceChange(service.id, 'additionalText', e.target.value)}
                    style={{
                      resize: 'vertical',
                      minHeight: '80px',
                      maxHeight: '150px',
                    }}
                  />
                  <Form.Text className="text-muted">
                    This text will be appended after the service fee in the agreement
                  </Form.Text>
                </Form.Group>
              </div>
            ))}
          </div>

          {/* Grand Total Display */}
          {/* <div className="border-top pt-3 mt-3">
          <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
            <h5 className="mb-0">Section Grand Total:</h5>
            <h4 className="mb-0 text-primary">
              AED {calculateGrandTotal(services).toFixed(2)}
            </h4>
          </div>
        </div> */}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <div className="d-flex gap-3">
            <Button
              style={{
                backgroundColor: '#001f54',
                color: 'white',
                border: 'none',
                transition: 'all 0.3s ease-in-out',
                minWidth: '120px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#c0a262';
                e.currentTarget.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#001f54';
                e.currentTarget.style.color = 'white';
              }}
              onClick={() => {
                // Don't reset services when cancelling - keep them for next time
                // Only reset if we're adding completely new services
                if (!savedServices[currentSection] || savedServices[currentSection].length === 0) {
                  setServices([
                    {
                      id: uuidv4(),
                      selectedService: '',
                      serviceFees: '',
                      vatCharges: '', // NEW: VAT Charges field
                      awsFees: '', // NEW: AWS Fees field
                      additionalText: '',
                    },
                  ]);
                }
                setShowServicesModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: '#001f54',
                color: 'white',
                border: 'none',
                transition: 'all 0.3s ease-in-out',
                minWidth: '120px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#c0a262';
                e.currentTarget.style.color = 'black';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#001f54';
                e.currentTarget.style.color = 'white';
              }}
              onClick={handleSaveAllServices}
            >
              Save All Services
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
              maxHeight: '87vh',
              overflowX: 'hidden',
              overflowY: 'auto',
            }
          : {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '100vh',
              display: 'flex',
              justifyContent: 'center',
              color: 'white',
              alignItems: 'center',
              overflowX: 'hidden',
              overflowY: 'auto',
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
      <div
        className="d-flex justify-content-end mb-3 px-3 py-2"
        data-html2canvas-ignore="true"
        style={{
          marginTop: '10px',
        }}
      >
        {(token?.Role === 'lawyer' || token?.Role === 'admin') && (
          <button
            className="me-3 px-4 py-2 fw-medium"
            onClick={handleGenerateLink}
            style={buttonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#c0a262';
              e.currentTarget.style.color = 'black';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#001f54';
              e.currentTarget.style.color = 'white';
            }}
          >
            Generate Form Link
          </button>
        )}

        <button
          className="fw-medium d-flex align-items-center"
          onClick={handleDownload}
          style={buttonStyle}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#c0a262';
            e.currentTarget.style.color = 'black';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#001f54';
            e.currentTarget.style.color = 'white';
          }}
        >
          <BsDownload className="me-2" />
          Download PDF
        </button>
      </div>

      {/* NEW: Service Type Selector */}
      <ServiceTypeSelector />

      {!isclient || isFormFilled ? (
        <div
          className="container mt-2 mt-md-4 word-paper"
          ref={pdfRef}
          key={draftKey}
          style={
            isEmailLinkAccess
              ? {
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }
              : {}
          }
        >
          {/* Header */}
          <div className="d-flex flex-wrap align-items-center mb-3 mb-md-4">
            <img src="logo.png" alt="Logo" className="me-2 me-md-3 mb-2 mb-md-0" style={{ height: '50px' }} />
            <h1 className="mb-0 h4 h3-md fw-bold text-break" style={isEmailLinkAccess ? { color: 'black' } : {}}>
              Legal Fee Agreement
            </h1>
          </div>

          {token?.Role == 'lawyer' && (
            <Form.Group className="mb-3">
              <Form.Label>Drafts</Form.Label>

              <Dropdown className="w-100">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  disabled={isFormFilled}
                  id="dropdown-practice-area"
                  className="w-100 text-start d-flex justify-content-between align-items-center"
                >
                  {selectedDrafts === 'Select Draft' ? 'Select Draft' : `${selectedDrafts?.CaseNumber}`}
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

          <div className="card p-2 p-md-4 shadow-sm mb-4">
            <label className="form-label fw-bold fs-5 text-break">Agreement</label>
            {editMode && !isclient && !savedClientSignature ? (
              <div
                className="form-control p-3"
                style={{
                  minHeight: '300px',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'justify',
                  lineHeight: '1.6',
                }}
              >
                {agreement?.fixedParts?.map((part, index) => (
                  <React.Fragment key={index}>
                    <span>{part}</span>
                    {index < agreement.editableValues.length && (
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                          display: 'inline',
                          minWidth: '100px',
                          outline: 'none',
                          background: 'transparent',
                          fontFamily: 'inherit',
                          fontSize: 'inherit',
                          padding: '2px 4px',
                          border: '1px dashed #ccc',
                          borderRadius: '3px',
                          margin: '0 2px',
                          textDecoration: 'underline',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          textAlign: 'justify',
                          lineHeight: 'inherit',
                        }}
                        onBlur={(e) => {
                          const newValue = e.currentTarget.textContent || '';
                          handleEditableChange(index, newValue);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                          }
                        }}
                      >
                        {agreement.editableValues[index] || ''}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div
                className="form-control bg-white p-3"
                style={{
                  whiteSpace: 'pre-wrap',
                  minHeight: '300px',
                  textAlign: 'justify',
                  lineHeight: '1.6',
                }}
              >
                {agreement?.fixedParts?.map((part, index) => (
                  <React.Fragment key={index}>
                    <span>{part}</span>
                    {index < agreement.editableValues.length && (
                      <span
                        style={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          textAlign: 'justify',
                          display: 'inline',
                          textDecoration: 'underline',
                        }}
                      >
                        {agreement.editableValues[index] || ''}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Fixed Headings */}
          {fixedHeadings.map((heading, index) => (
            <div key={index} className="section border p-2 rounded bg-light mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <strong>{heading.title}</strong>
                {(heading.title.includes('Professional Fees for Dispute Case') ||
                  heading.title.includes('Other Fees')) &&
                  editMode && (
                    <button
                      className="btn btn-sm ms-2"
                      onClick={() => handleAddServiceClick(heading.title)}
                      style={{
                        backgroundColor: '#001f54',
                        color: 'white',
                        border: 'none',
                        transition: 'all 0.3s ease-in-out',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#c0a262';
                        e.currentTarget.style.color = 'black';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#001f54';
                        e.currentTarget.style.color = 'white';
                      }}
                    >
                      Add Service and Fees
                    </button>
                  )}
              </div>

              {/* Display services immediately after saving */}
              {editMode ? (
                <CEEditable
                  list={[heading]}
                  onChange={(updatedList) => {
                    const updatedHeadings = [...fixedHeadings];
                    updatedHeadings[index] = updatedList[0];
                    setFixedHeadings(updatedHeadings);
                  }}
                  disable={isFormFilled && !editMode}
                />
              ) : (
                <div>
                  <ol type="a" style={{ margin: '8px 0', paddingLeft: '24px' }}>
                    {heading.points.map((point, pIndex) => (
                      <li key={pIndex} style={{ margin: '4px 0', textAlign: 'justify' }}>
                        <span dangerouslySetInnerHTML={{ __html: point.text }} />
                      </li>
                    ))}
                  </ol>

                  {/* Show empty state if no content at all */}
                  {(heading.title.includes('Professional Fees for Dispute Case') ||
                    heading.title.includes('Other Fees')) &&
                    heading.points.length === 0 && (
                      <div className="text-muted text-center py-2">No services added yet</div>
                    )}
                </div>
              )}
            </div>
          ))}
          {/* NEW: Client decision buttons */}
          {renderClientDecisionButtons()}

          {/* NEW: Signature pad for client after acceptance */}
          {showSignaturePad && (
            <div style={{ padding: 20 }} data-html2canvas-ignore="true">
              <h2>Client Signature</h2>
              <Form_SignaturePad height={250} onSave={handleClientSignatureSave} />
            </div>
          )}

          {isFormFilled && savedClientSignature && !isclient && IsLocalLawyerSign && token?.Role === 'lawyer' && (
            <div style={{ padding: 20 }} data-html2canvas-ignore="true">
              <h2>Lawyer Signature</h2>
              <Form_SignaturePad height={250} onSave={handleSignatureSave} />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '20px',
              width: '100%',
            }}
          >
            {savedSignature && (
              <div>
                <h4>Lawyer Signature:</h4>
                <img
                  src={savedSignature}
                  alt="Lawyer Signature"
                  style={{
                    maxWidth: '220px',
                    maxHeight: '300px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </div>
            )}

            {savedSignature && savedClientSignature && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <img
                  src={logoiA}
                  alt="Stamp"
                  style={{
                    width: '120px',
                    height: '120px',
                    opacity: 0.8,
                    margin: '0 20px',
                  }}
                />
                <span style={{ fontSize: '12px', marginTop: '5px', fontStyle: 'italic' }}>
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
                    maxWidth: '220px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              </div>
            )}
          </div>

          {/* Rejection Status Display */}
          {lfaStatus === 'rejected' && dataList?.rejectionReason && (
            <div className="card border-danger mt-4" style={{ maxWidth: '100%' }}>
              <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {isclient || isEmailLinkAccess ? 'You have rejected this LFA' : 'Client has rejected this LFA'}
                </h6>
                {dataList.rejectedAt && (
                  <small className="text-light">
                    {new Date(dataList.rejectedAt).toLocaleDateString('en-GB')}
                    {!isclient && !isEmailLinkAccess && dataList.rejectedBy && ` by ${dataList.rejectedBy}`}
                  </small>
                )}
              </div>
              <div className="card-body">
                <h6 className="card-title text-danger mb-3">
                  <strong>Reason for rejection:</strong>
                </h6>
                <div
                  className="rejection-reason-scrollable"
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '15px',
                    border: '1px solid #e9ecef',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                  }}
                >
                  {dataList.rejectionReason}
                </div>
              </div>
            </div>
          )}

          {/* NEW: Rejection Popup Modal for Lawyer */}
          {!isclient &&
            !isEmailLinkAccess &&
            token?.Role === 'lawyer' &&
            lfaStatus === 'rejected' &&
            dataList?.rejectionReason &&
            !editMode &&
            !rejectionAcknowledged && (
              <Modal
                show={true}
                onHide={() => setRejectionAcknowledged(true)}
                backdrop="static"
                keyboard={false}
                size="lg"
              >
                <Modal.Header closeButton style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>
                  <Modal.Title className="text-danger">LFA Rejected by Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="mb-3">
                    <h6 className="text-danger mb-3">Client has rejected this Legal Fee Agreement</h6>
                    <p className="mb-2">
                      <strong>Reason for rejection:</strong>
                    </p>

                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        textAlign: 'left',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '15px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        backgroundColor: '#f8f9fa',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        wordWrap: 'break-word',
                      }}
                    >
                      {dataList.rejectionReason}
                    </div>

                    <small className="text-muted mt-2 d-block">
                      Rejected on: {new Date(dataList.rejectedAt || Date.now()).toLocaleDateString('en-GB')}
                    </small>
                  </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                  <button className="me-2" onClick={() => setRejectionAcknowledged(true)} style={buttonStyle}>
                    OK
                  </button>
                  <button className="" onClick={() => setEditMode(true)} style={buttonStyle}>
                    Edit Agreement
                  </button>
                </Modal.Footer>
              </Modal>
            )}
          <div
            className="d-flex justify-content-center gap-2 gap-md-3 mt-3 mb-4 flex-wrap"
            data-html2canvas-ignore="true"
          >
            {!isclient && savedClientSignature && savedLawyerSignature && (
              <button
                className="btn btn-sm btn-primary fw-bold"
                onClick={handleUpdateLawyerSubmit}
                style={{ width: '150px' }}
                data-html2canvas-ignore="true"
              >
                Save & Update Agreement
              </button>
            )}

            {editMode ? (
              <>
                {!isFormFilled && !savedClientSignature ? (
                  <button
                    className="btn btn-sm btn-primary fw-bold"
                    onClick={token?.Role !== 'client' ? handleLawyerSubmit : handleClientSubmit}
                    style={{ width: '150px' }}
                    data-html2canvas-ignore="true"
                  >
                    Save & Submit Agreement
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-primary fw-bold"
                    onClick={handleUpdateLawyerSubmit}
                    style={{ width: '150px' }}
                    data-html2canvas-ignore="true"
                  >
                    Save & Update Agreement
                  </button>
                )}
              </>
            ) : (
              <>
                {((isclient && savedClientSignature && lfaStatus === 'accepted' && !signatureSubmitted) ||
                  (isEmailLinkAccess && savedClientSignature && lfaStatus === 'accepted' && !signatureSubmitted)) && (
                  <button
                    className="btn btn-sm btn-primary fw-bold"
                    onClick={handleUpdateLawyerSubmit}
                    style={{ width: '150px' }}
                    data-html2canvas-ignore="true"
                  >
                    Submit Signature
                  </button>
                )}

                {!isclient && !savedClientSignature && token?.Role === 'lawyer' && (
                  <button
                    className="btn btn-sm btn-primary fw-bold"
                    onClick={() => setEditMode(true)}
                    style={{ width: '150px' }}
                    data-html2canvas-ignore="true"
                  >
                    Edit Agreement
                  </button>
                )}
              </>
            )}
          </div>

          {isEmailLinkAccess && signatureSubmitted && <ThankYouMessage />}
        </div>
      ) : (
        <div className="text-center text-black py-5">No LFA Form Available.</div>
      )}

      {/* NEW: Rejection Modal */}
      {renderRejectionModal()}

      {/* NEW: Services and Fees Modal */}
      {renderServicesModal()}
    </div>
  );
};

export default LEA_Form;
