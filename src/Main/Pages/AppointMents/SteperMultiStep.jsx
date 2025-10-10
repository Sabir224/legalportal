import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Avatar,
  Card,
  CardContent,
  Divider,
  styled,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Grid,
  InputAdornment,
  Alert,
  Chip,
  IconButton,
  GlobalStyles,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormGroup,
} from '@mui/material';

import {
  PersonOutline,
  Schedule,
  LocationOn,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  CalendarToday,
  ReceiptLong,
  Email,
  Phone,
  CreditCard,
  Person,
  Star,
  Language,
  AccessTime,
  Work,
  AttachMoney,
  StarBorder,
  HelpOutline,
  ExpandMore,
  WhatsApp,
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { ApiEndPoint } from '../Component/utils/utlis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faArrowLeft,
  faArrowRight,
  faCalendar,
  faCheck,
  faHome,
  faMailBulk,
  faMailReply,
  faMessage,
  faPhone,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { isToday } from 'date-fns';
import { CardElement, useElements, useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import getStripe from '../Component/utils/stripeConfiguration';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

// Initialize Stripe

const StyledStepIcon = styled('div')(({ theme, active }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
  color: active ? theme.palette.common.white : theme.palette.text.secondary,
  fontWeight: 'bold',
}));

const StepIcon = ({ active, completed, icon }) => {
  return (
    <StyledStepIcon active={active || completed}>{completed ? <CheckCircle fontSize="small" /> : icon}</StyledStepIcon>
  );
};
const services = [
  { name: 'Civil Law', description: 'Civil law related legal services' },
  { name: 'Commercial Law', description: 'Commercial law related legal services' },
  { name: 'Criminal Law', description: 'Criminal law related legal services' },
  { name: 'Family Law', description: 'Family law related legal services' },
  { name: 'Real Estate Law', description: 'Real estate law related legal services' },
  { name: 'Labour Law', description: 'Labour law related legal services' },
  { name: 'Construction Law', description: 'Construction law related legal services' },
  { name: 'Maritime Law', description: 'Maritime law related legal services' },
  { name: 'Personal Injury Law', description: 'Personal injury law related legal services' },
  { name: 'Technology Law', description: 'Technology law related legal services' },
  { name: 'Financial Law', description: 'Financial law related legal services' },
  { name: 'Public Law', description: 'Public law related legal services' },
  { name: 'Consumer Law', description: 'Consumer law related legal services' },
  { name: 'Environmental Law', description: 'Environmental law related legal services' },
  {
    name: 'Estate / Succession / Inheritance Law',
    description: 'Estate, succession, and inheritance legal services',
  },
  { name: 'Insurance Law', description: 'Insurance-related legal services' },
  { name: 'Banking and Investment Law', description: 'Banking and investment related legal services' },
  { name: 'Tax Law', description: 'Tax-related legal services' },
  { name: 'Rental Law', description: 'Rental and tenancy-related legal services' },
  { name: 'Intellectual Property Law', description: 'Intellectual property legal services' },
  { name: 'Debt Collection Law', description: 'Debt collection related legal services' },
  { name: 'Capital Funds Law', description: 'Capital funds and investment-related legal services' },
];
const questionsConfig = {
  'Civil Law': [
    { type: 'checkbox', question: 'Are you the plaintiff or the defendant?', options: ['Plaintiff', 'Defendant'] },
    {
      type: 'text',
      question: 'Please describe the nature of the dispute (breach of contract, damage to property, unpaid debt, etc.)',
    },
    { type: 'text', question: 'Who are the other parties involved, and what is your relationship to them?' },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Family Law': [
    { type: 'text', question: 'Current marital or relationship status' },
    {
      type: 'text',
      question: 'Relevant legal actions already taken (separation agreement, court filings, restraining orders).',
    },
    { type: 'checkbox', question: 'Religion', options: ['Muslim', 'Non-Muslim'] },
    {
      type: 'text',
      question:
        'Please confirm where your marriage took place? And if there are children involved? If yes, list their full names, birth dates, and current living arrangements.',
    },
    {
      type: 'text',
      question:
        'Legal service required - issues you need assistance with, and what outcome are you seeking? (sole custody, equal parenting time, spousal support, asset division, protection order, etc.)',
    },
  ],
  'Commercial Law': [
    {
      type: 'text',
      question:
        'What is the nature of the legal issue or service you are seeking? (incorporation, shareholder agreement, business sale, contract drafting/review, partnership dispute, regulatory compliance, etc.)',
    },
    {
      type: 'file',
      question: 'Attach relevant documents (if any)',
    },
  ],
  'Criminal Law': [
    { type: 'checkbox', question: 'Are you the plaintiff or the defendant?', options: ['Plaintiff', 'Defendant'] },
    {
      type: 'text',
      question:
        'Have you been charged, arrested, or are you currently under investigation? (Please specify the alleged offence(s), date(s), and law enforcement agency involved)',
    },
    {
      type: 'text',
      question:
        'What stage is your case currently at? (not yet charged, bail hearing scheduled, awaiting trial, sentencing, probation violation, etc.)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Estate / Succession / Inheritance Law': [
    {
      type: 'text',
      question: 'Please define the legal service you are seeking. (Planning, managing or disputing an estate.)',
    },
    {
      type: 'text',
      question:
        'If this concerns a deceased person, what is the relationship? (Include known details about the will’s if available.)',
    },
    {
      type: 'text',
      question:
        'What assets, debts, or disputes (if any) are involved in the estate? (real estate, businesses, bank accounts, inheritance conflicts, missing beneficiaries.)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Real Estate Law': [
    {
      type: 'text',
      question:
        'What is the nature of your real estate matter? (purchase, sale, lease, construction defect, title problem, etc.)',
    },
    { type: 'text', question: 'Are there any contracts, offers, or legal proceedings currently in progress?' },
    {
      type: 'text',
      question:
        'Who are the other parties involved (buyer, seller, tenant, developer, municipality), and are there any disputes, deadlines, or financial concerns?',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Labour Law': [
    {
      type: 'text',
      question:
        'Please describe the nature of the employment relationship (full-time, part-time, contract, unionized) and how long it has existed.',
    },
    {
      type: 'text',
      question:
        'What is the specific issue you are seeking legal advice for? (termination, unpaid salary, harassment, contract review, discrimination, etc.)',
    },
    {
      type: 'text',
      question:
        'Have any formal actions been taken to date (written warnings, termination letter, complaint to HR, labour board complaint)?',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Construction Law': [
    {
      type: 'text',
      question:
        'What type of construction issue is involved? (contract dispute, defect, payment issue, project delay, safety concern, etc.)',
    },
    { type: 'text', question: 'Who are the parties involved (contractor, subcontractor, owner, municipality)?' },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Maritime Law': [
    {
      type: 'text',
      question:
        'What is the nature of the maritime issue? (shipping dispute, cargo damage, vessel arrest, seafarer employment, marine insurance, etc.)',
    },
    { type: 'text', question: 'What parties are involved (shipowner, charterer, insurer, port authority, crew)?' },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Personal Injury Law': [
    {
      type: 'text',
      question:
        'What type of personal injury occurred? (car accident, workplace injury, medical negligence, slip and fall, etc.)',
    },
    { type: 'text', question: 'When and where did the injury occur?' },
    { type: 'file', question: 'Attach relevant medical/legal documents (if any)' },
  ],
  'Technology Law': [
    {
      type: 'text',
      question:
        'What type of technology matter is involved? (data privacy, software licensing, cybersecurity, IT contracts, AI compliance, etc.)',
    },
    { type: 'file', question: 'Attach relevant agreements/policies (if any)' },
    {
      type: 'text',
      question: 'What outcome are you seeking? (compliance, damages, contract negotiation, dispute resolution)',
    },
  ],
  'Financial Law': [
    {
      type: 'text',
      question:
        'What is the nature of your financial issue? (fraud, misrepresentation, banking dispute, unauthorized transactions, etc.)',
    },
    { type: 'text', question: 'What financial institutions or parties are involved?' },
    { type: 'text', question: 'What actions have been taken so far (complaints, regulatory filings, lawsuits)?' },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Public Law': [
    {
      type: 'text',
      question:
        'What is the nature of the public law matter? (constitutional challenge, administrative law, judicial review, regulatory compliance)',
    },
    { type: 'text', question: 'Which public authority, regulator, or government body is involved?' },
    { type: 'text', question: 'What outcome or relief are you seeking?' },
  ],
  'Consumer Law': [
    {
      type: 'text',
      question:
        'What is the nature of your consumer issue? (defective product, false advertising, unfair contract, service dispute, fraud)',
    },
    { type: 'text', question: 'Who is the seller, manufacturer, or service provider involved?' },
    {
      type: 'text',
      question: 'What steps have been taken so far (complaints, refund request, consumer protection filing)?',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Environmental Law': [
    {
      type: 'text',
      question:
        'What is the nature of the environmental matter? (pollution, land use, regulatory compliance, environmental assessment, climate dispute)',
    },
    {
      type: 'text',
      question: 'What authority or organization is involved? (EPA, local municipality, private corporation, NGO)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Insurance Law': [
    {
      type: 'checkbox',
      question: 'Type of Insurance Involved',
      options: ['Auto', 'Home', 'Commercial', 'Life', 'Disability', 'Liability', 'Other'],
    },
    {
      type: 'text',
      question:
        'What is the issue or dispute you’re facing with the insurer? (denied claim, delayed payout, coverage dispute, policy cancellation, insurer bad faith, etc.)',
    },
    { type: 'text', question: 'Please describe the event or loss that gave rise to the insurance claim.' },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Banking and Investment Law': [
    { type: 'checkbox', question: 'Nature of the Matter', options: ['Banking', 'Investment', 'Both'] },
    {
      type: 'text',
      question:
        'Please describe the product or service involved and the institution(s) concerned. (mortgage, line of credit, brokerage account, investment fund, crypto platform, financial advisor, etc.)',
    },
    {
      type: 'text',
      question:
        'What is the issue or dispute you are facing? (unauthorized transactions, misrepresentation, frozen account, advisor negligence, margin call, regulatory violation, etc.)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Tax Law': [
    { type: 'checkbox', question: 'Type of Taxpayer', options: ['Individual', 'Corporation', 'Trust', 'Other'] },
    {
      type: 'text',
      question:
        'What is the nature of the tax issue you are facing? (audit, reassessment, unpaid taxes, penalty dispute, voluntary disclosure, tax planning, CRA communication, etc.)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Rental Law': [
    { type: 'checkbox', question: 'Are you the:', options: ['Landlord', 'Tenant'] },
    { type: 'checkbox', question: 'Type of Lease:', options: ['Residential', 'Commercial'] },
    {
      type: 'text',
      question:
        'Please describe the legal issue or dispute you are facing. (non-payment of rent, eviction notice, lease violation, repair issues, lease review, deposit dispute, illegal occupancy, etc.)',
    },
    {
      type: 'text',
      question:
        'What is the current status of the lease and occupancy? (active lease, notice given/received, tenant still in possession, rent arrears, abandoned property, etc.)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Intellectual Property Law': [
    {
      type: 'checkbox',
      question: 'Type of Intellectual Property Involved',
      options: ['Trademark', 'Copyright', 'Patent', 'Trade Secret', 'Other'],
    },
    {
      type: 'text',
      question:
        'What specific IP asset or issue do you need help with? (registering a trademark, enforcing copyright, patent application, defending against infringement, licensing, etc.)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
  'Debt Collection Law': [
    {
      type: 'checkbox',
      question: 'Are you the:',
      options: ['Creditor (seeking to collect a debt)', 'Debtor (responding to a debt or enforcement action)'],
    },
    {
      type: 'text',
      question:
        'What is the amount and nature of the debt? (unpaid invoice, loan, service contract, promissory note — include amount, due date, and whether it is disputed.)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
    {
      type: 'text',
      question:
        'Who are the other parties involved, and do you have any relevant agreements or communications? (Provide names and business relationships)',
    },
  ],
  'Capital Funds Law': [
    {
      type: 'checkbox',
      question: 'Are you a:',
      options: ['Fund Manager', 'Investor', 'Company Seeking Investment', 'Advisor/Other'],
    },
    {
      type: 'text',
      question:
        'What specific legal assistance are you seeking? (fund formation, drafting investor agreements, securities compliance, LP/GP structuring, dispute resolution, fundraising support, etc.)',
    },
    { type: 'file', question: 'Attach relevant documents (if any)' },
  ],
};
function LegalConsultationStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [method, setMethod] = React.useState('');
  const [service, setService] = React.useState('');
  const [selectedLawyer, setSelectedLawyer] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [allLawyers, setAllLawyers] = React.useState([]);
  const [lawyers, setLawyers] = React.useState([]);
  const [lawyersDetails, setLawyersDetails] = React.useState();
  const [appointmentSlots, setAppointmentSlots] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [clientMessage, setClientMessage] = React.useState('');
  const [meetingLink, setMeetingLink] = React.useState('');
  const [confirmationData, setConfirmationData] = React.useState(null);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [appointmentDetails, setAppoinmentDetails] = React.useState(null);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [subject, setSubject] = React.useState('Meeting Confirmation');
  const [isProcessing, setIsProcessing] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PayOnline');
  const [oldpaymentId, setPaymentId] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [caseDiscription, setDiscription] = useState('');
  const [errors, setErrors] = useState({});
  const hasRedirected = React.useRef(false);
  const [hasData, setHasData] = useState(false);

  const dateOptions = {
    timeZone: 'Asia/Dubai',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  const steps = [
    'Service Type',
    'Select Lawyer',
    'Choose Date & Time',
    'Consultation Method',
    'Payment',
    'Confirm Appointment',
    'Success', // Add this
  ];
  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  const [paymentForm, setPaymentForm] = React.useState({
    name: '',
    email: '',
    phone: '',
  });
  const [UserInfo, setUserIno] = React.useState({
    name: '',
    email: '',
    phone: '',
  });

  const [cardComplete, setCardComplete] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState('');
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const phone = searchParams.get('phone');
  const name = searchParams.get('name');
  const ref = searchParams.get('ref');
  const source = searchParams.get('source');

  // Popup states
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const [popupcolor, setPopupcolor] = React.useState('popup');
  const [popupmessage, setPopupmessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [isPopupVisiblecancel, setIsPopupVisiblecancel] = React.useState(true);
  const [linkData, setLinkData] = React.useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = React.useState(false);
  const [answers, setAnswers] = useState({});
  const [paymentStatus, setPaymentSatus] = useState('');
  const generateInvoice = async (appointment) => {
    const { payment } = appointment;
    if (!appointment || !payment) {
      throw new Error('Invalid appointment object: missing payment info.');
    }

    const controller = new AbortController();
    const timeoutMs = 20000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${ApiEndPoint}createZohoInvoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw data || { message: res.statusText, status: res.status };
      }

      if (!data?.alreadyExists) {
        // ✅ Update hasInvoice = true in DB

        await fetch(`${ApiEndPoint}payments/${payment._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hasInvoice: true }),
        });
        setData((prev) =>
          prev.map((item) =>
            item.payment && item.payment._id === payment._id
              ? { ...item, payment: { ...item.payment, hasInvoice: true } }
              : item
          )
        );
      }
      return data;
      // console.log('Invoice created:', payload.invoice?.invoice_number || payload.url || payload);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error(`Request timed out after ${timeoutMs}ms`);
      } else {
        console.error('Error creating Zoho invoice:', err);
      }
    } finally {
    }
  };

  const RenderQuestion = ({ question }) => {
    if (!question) return null;

    // Regex to match parentheses content
    const regex = /\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(question)) !== null) {
      // Text before (
      if (match.index > lastIndex) {
        parts.push(question.slice(lastIndex, match.index));
      }

      // Italic part inside ()
      parts.push(<i key={match.index}>({match[1]})</i>);

      lastIndex = regex.lastIndex;
    }

    // Remaining text after last )
    if (lastIndex < question.length) {
      parts.push(question.slice(lastIndex));
    }

    return <span>{parts}</span>;
  };

  // 🔹 Auto-generate Case Description when answers change
  React.useEffect(() => {
    if (service) {
      const qs = questionsConfig[service] || [];
      let description = qs
        .map((q) => {
          const ans = answers[q.question];
          if (!ans || ans.length === 0) return null;

          if (q.type === 'checkbox') {
            // ✅ ab single value hai, array nahi
            return `${q.question}: ${ans}`;
          }
          if (q.type === 'text') {
            return `${q.question}: ${ans}`;
          }
          if (q.type === 'file') {
            return `${q.question}: ${ans.name || 'File attached'}`;
          }
          return null;
        })
        .filter(Boolean)
        .join('\n\n');

      setDiscription(description); // 👈 merge into caseDescription state
    }
  }, [answers, service]);

  const handleAnswerChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
    setErrors((prev) => ({ ...prev, [question]: false }));
  };

  const handleCheckboxChange = (question, option) => {
    setAnswers((prev) => {
      const current = prev[question];
      // ✅ agar already selected hai to unselect kar do, warna naya option set karo
      const updated = current === option ? '' : option;
      return { ...prev, [question]: updated };
    });
    setErrors((prev) => ({ ...prev, [question]: false }));
  };
  const formatAvailability = (value) => {
    switch (value) {
      case 'InPerson':
        return 'In Person';
      case 'Online':
        return 'Online';
      case 'InPerson/Online':
        return 'In Person & Online ';
      default:
        return value || 'N/A';
    }
  };

  const handleFileChange = (question, files) => {
    if (files && files.length > 0) {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      const sizeLimits = {
        image: 20 * 1024 * 1024, // 20MB
        document: 20 * 1024 * 1024, // 20MB
      };

      const fileArray = Array.from(files);

      // 🔹 Merge with already stored files
      const existingFiles = answers[question] || [];
      let combinedFiles = [...existingFiles, ...fileArray];

      let errorsForFiles = [];

      combinedFiles.forEach((file) => {
        // 🔹 Type validation
        if (!allowedTypes.includes(file.type)) {
          errorsForFiles.push(`Invalid type: ${file.name} (Only JPG, PNG, PDF, DOC, DOCX allowed)`);
          return;
        }

        // 🔹 Filename length validation
        if (file.name.length > 40) {
          errorsForFiles.push(`File name too long (max 40 chars): ${file.name}`);
          return;
        }

        // 🔹 Size validation
        if (['image/jpeg', 'image/png'].includes(file.type)) {
          if (file.size > sizeLimits.image) {
            errorsForFiles.push(
              `File too large: ${file.name} (Max ${(sizeLimits.image / (1024 * 1024)).toFixed(1)}MB)`
            );
            return;
          }
        }

        if (
          [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ].includes(file.type)
        ) {
          if (file.size > sizeLimits.document) {
            errorsForFiles.push(
              `File too large: ${file.name} (Max ${(sizeLimits.document / (1024 * 1024)).toFixed(1)}MB)`
            );
            return;
          }
        }
      });

      if (errorsForFiles.length > 0) {
        // 🚫 If any invalid files
        setErrors((prev) => ({
          ...prev,
          [question]: errorsForFiles, // store array of errors
        }));
        return;
      }

      // 🔹 Limit max 5 files
      if (combinedFiles.length > 5) {
        setErrors((prev) => ({
          ...prev,
          [question]: [`You can upload a maximum of 5 files.`],
        }));
        combinedFiles = combinedFiles.slice(0, 5);
      } else {
        setErrors((prev) => ({ ...prev, [question]: [] }));
      }

      // ✅ If valid, save merged files
      setAnswers((prev) => ({
        ...prev,
        [question]: combinedFiles,
      }));
    }
  };

  // generate and redirect (manual or auto when ref missing)
  const regenerateAndRedirect = async () => {
    try {
      const body = {};

      if (phone) body.phone = phone;
      if (name) body.name = name;

      // If no ref -> force source = website when missing
      if (!ref) {
        body.source = source || 'website';
      } else if (source) {
        body.source = source;
      }

      const res = await axios.post(`${ApiEndPoint}generateLink`, body);

      if (res.data?.success && res.data?.fullUrl) {
        window.location.href = res.data.fullUrl; // redirect to new link
      } else {
        console.error('Failed to generate new link:', res.data);
      }
    } catch (err) {
      console.error('Error generating link:', err);
    }
  };

  React.useEffect(() => {
    console.groupCollapsed('[Payment Data Fetch] Initializing fetch');
    let isMounted = true;

    const fetchData = async () => {
      try {
        const { data: responseData } = await axios.get(`${ApiEndPoint}payments/paymentData/${ref}`);

        if (!isMounted) return;

        if (responseData?.success && responseData.data) {
          setData(responseData.data);
          const { payment, lawyer, linkData } = responseData.data;
          setLinkData(linkData);
          setHasData(true);
          // Always set available data
          if (payment) {
            setService(payment.serviceType || '');
            setMethod(payment.consultationType || '');
            setPaymentMethod(payment.paymentMethod || 'Card');
            //console.log('Description:', payment?.caseDescription);
            setDiscription(payment?.caseDescription);
            setHasData(true);
          }

          if (lawyer) setSelectedLawyer(lawyer);

          // Determine step based on payment method and status
          if (payment) {
            // Case 1: Pay at Office - skip to confirmation if meeting details exist
            if (payment.paymentMethod === 'PayInOffice') {
              if (payment.meetingDetails) {
                setConfirmationData({
                  lawyer: lawyer,
                  service: payment.serviceType,
                  phone: payment.phone,
                  email: payment.email,
                  method: payment?.consultationType,
                  paymentMethod: payment?.paymentMethod,
                  date: new Date(payment.meetingDetails.date),
                  slot: payment.meetingDetails.slot,
                  meetingLink: payment.meetingDetails.meetingUrl,
                });
                setPaymentId(payment?._id);
                setActiveStep(6); // Confirmation
              } else {
                // No meeting details yet - proceed to scheduling
                setActiveStep(2); // Date & Time selection
              }
            }
            // Case 2: Online Payment - check payment status
            else if (payment.paymentMethod === 'Card') {
              if (payment.status === 'paid') {
                if (payment.meetingDetails) {
                  // Complete booking - show confirmation
                  setConfirmationData({
                    lawyer: lawyer,
                    service: payment?.serviceType,
                    phone: payment?.phone,
                    email: payment?.email,
                    status: payment?.status,
                    method: payment?.consultationType,
                    paymentMethod: payment?.paymentMethod,
                    date: new Date(payment?.meetingDetails?.date),
                    slot: payment?.meetingDetails?.slot,
                    meetingLink: payment?.meetingDetails?.meetingUrl,
                  });
                  setPaymentId(payment?._id);
                  setActiveStep(6); // Confirmation
                } else {
                  setConfirmationData({
                    lawyer: lawyer,
                    service: payment?.serviceType,
                    phone: payment?.phone,
                    email: payment?.email,
                    status: payment?.status,
                    method: payment?.consultationType,
                    paymentMethod: payment?.paymentMethod,
                    date: payment?.meetingDetails?.date ? new Date(payment.meetingDetails.date) : null,
                    slot: payment?.meetingDetails?.slot || null,
                    meetingLink: payment?.meetingDetails?.meetingUrl || null,
                    confirmed: !!payment?.meetingDetails, // true if meeting exists
                  });
                  // Paid but no meeting - skip to date/time selection
                  setPaymentId(payment?._id);
                  setActiveStep(2); // Date & Time
                }
              } else {
                // Not paid yet - go to payment step
                setActiveStep(4); // Payment
              }
            }
          } else {
            // No payment record - start from beginning
            setActiveStep(0); // Service selection
          }
        }
      } catch (error) {
        if (isMounted) console.log('Failed to load payment data:', error);
      } finally {
        if (isMounted) setInitialDataLoaded(true);
      }
    };

    if (ref) {
      fetchData();
    } else if (!hasRedirected.current) {
      hasRedirected.current = true; // prevent double redirect
      regenerateAndRedirect();
    }

    return () => {
      isMounted = false;
    };
  }, [ref]);
  // 🔹 Step 1: Fetch all lawyers once (on mount)
  // 🧠 1️⃣ Fetch all lawyers ONLY when we don't already have payment/lawyer from backend
  React.useEffect(() => {
    // if data exists and has both payment & lawyer → skip fetching
    if (data && data.payment && data.lawyer) {
      console.log('⏩ Skipping lawyer fetch — payment & lawyer already exist');
      return;
    }

    // run only if data is null or missing payment/lawyer
    console.log('📡 Fetching all lawyers... (no backend lawyer/payment)');

    const fetchAllLawyers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${ApiEndPoint}getAllLawyers`);
        const lawyers = response.data?.lawyers || [];

        if (lawyers.length > 0) {
          setAllLawyers(lawyers);
          console.log('✅ Lawyers fetched:', lawyers.length);
        } else {
          console.warn('⚠️ No lawyers returned from API');
        }
      } catch (err) {
        console.error('❌ Error fetching lawyers:', err);
        setError('Failed to fetch lawyers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllLawyers();
  }, [data]); // 👈 Runs when data changes (from null → real data)

  // 🧠 2️⃣ Filter lawyers automatically based on selected service
  React.useEffect(() => {
    // if backend already provided lawyer → skip filtering
    if (data && data.lawyer) {
      console.log('⏩ Skipping filter — backend already provided lawyer');
      return;
    }

    // wait until we have a selected service
    if (!service) {
      console.log('⚠️ No service selected — skipping filter');
      setLawyers([]);
      return;
    }

    // filter logic
    if (allLawyers.length > 0) {
      const filtered = allLawyers.filter((lawyer) => {
        const matchesExpertise = !service || (lawyer.specialty || '').toLowerCase().includes(service.toLowerCase());
        const hasSlots = lawyer.hasAvailableSlots === true;
        return matchesExpertise && hasSlots;
      });

      console.log(`🎯 Filtered ${filtered.length} lawyers for service: ${service}`);
      setLawyers(filtered);
    } else {
      console.warn('⚠️ No lawyers to filter');
      setLawyers([]);
    }
  }, [service, allLawyers, data]);
  // 🔹 Reset selections whenever service changes
  React.useEffect(() => {
    if (data && data.lawyer) {
      console.log('⏩ Skipping filter — backend already provided lawyer');
      return;
    }
    if (!service) return; // do nothing if service is empty

    console.log('♻️ Service changed — resetting selections');

    setSelectedLawyer(null);
    setSelectedDate(new Date());
    setSelectedSlot(null);
    setAppointmentSlots([]);
    setConfirmationData(null);
    setMeetingLink('');
    setPaymentMethod('PayOnline'); // or your default
    setPaymentSatus('');
    setBookingData(null);
    setDiscription(''); // optional: clear case description if needed
  }, [service]);

  // React.useEffect(() => {
  //   const fetchLawyers = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(`${ApiEndPoint}getAllLawyers`);
  //       if (response.data && response?.data?.lawyers) {
  //         // Filter lawyers based on selected service (expertise) and available slots
  //         const filteredLawyers = response.data.lawyers.filter((lawyer) => {
  //           // 1. Check if lawyer matches selected service expertise
  //           const matchesExpertise = !service || lawyer.specialty.toLowerCase().includes(service.toLowerCase());

  //           // 2. Check if lawyer has available slots
  //           const hasSlots = lawyer.hasAvailableSlots;

  //           return matchesExpertise && hasSlots;
  //         });
  //         console.log('Check Lawyer:', filteredLawyers);
  //         setLawyers(filteredLawyers);
  //       }
  //     } catch (err) {
  //       setError('Failed to fetch lawyers. Please try again.');
  //       console.error('Error fetching lawyers:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Changed from activeStep >= 2 to activeStep >= 1 since Select Lawyer is now Step 1
  //  if (activeStep >= 1 && service) {
  //   fetchLawyers();
  // }
  // }, [activeStep, service]); // Added lawyers.length to dependencies

  // Fetch appointments when lawyer is selected (for Date/Time step)
  const fetchAppointments = async (lawyerId, date) => {
    if (!lawyerId) return;

    setLoading(true);
    try {
      const appointmentsRes = await axios.get(`${ApiEndPoint}getCrmAppointments/${lawyerId}`);

      if (!appointmentsRes.data || appointmentsRes.data.length === 0) {
        setError('No appointment data found.');
        setAppoinmentDetails(null);
        return;
      }

      // Combine all available slots from different appointment records
      const combinedAppointmentData = appointmentsRes.data.reduce((acc, element) => {
        if (element.availableSlots) {
          acc.availableSlots = [...(acc.availableSlots || []), ...element.availableSlots];
        }
        return acc;
      }, {});

      setAppoinmentDetails(combinedAppointmentData);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No appointments found for the selected lawyer.');
      } else {
        setError('An error occurred while fetching appointments.');
        console.error('Error fetching appointments:', err);
      }
      setAppoinmentDetails(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Changed from activeStep >= 3 to activeStep >= 2 since Date/Time is now Step 2
    if (activeStep >= 2 && selectedLawyer) {
      fetchAppointments(selectedLawyer._id);
    }
  }, [activeStep, selectedLawyer]); // Removed selectedDate from dependencies

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleNext = () => {
    // For free appointments after method selection

    if (activeStep === 3 && (selectedLawyer?.price === '0' || selectedLawyer?.price === '')) {
      setActiveStep(5); // Skip to confirmation
    }
    // For paid appointments that just need to select time slot
    else if (activeStep === 2 && data?.payment?.status === 'paid' && !data?.payment?.meetingDetails) {
      setActiveStep(5); // Skip to confirmation after selecting time
    } else if (activeStep === 2 && data?.payment?.consultationType === 'InPerson') {
      setActiveStep(5);
    } else {
      setActiveStep(activeStep + 1); // Normal step progression
    }
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);
  // NEW function (always generates new link)
  const forceGenerateAndRedirect = async () => {
    try {
      const body = {};

      if (phone) body.phone = phone;
      if (name) body.name = name;
      if (source) body.source = source; // only add if it exists

      const res = await axios.post(`${ApiEndPoint}generateLink`, body);

      if (res.data?.success && res.data?.fullUrl) {
        window.location.href = res.data.fullUrl;
      } else {
        console.error('Failed to generate new link:', res.data);
      }
    } catch (err) {
      console.error('Error generating link:', err);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setMethod('');
    setService('');
    setSelectedLawyer(null);
    setSelectedDate(new Date());
    setSelectedSlot(null);
    setAppointmentSlots([]);
    setClientMessage('');
  };

  const onResetClick = async () => {
    await forceGenerateAndRedirect(); // This will reload the page to new URL
    //The rest of handleReset() won't run because page reloads
  };
  // Navigation handlers
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const handleDateClick = (date) => {
    if (date) {
      // Extract ONLY date parts (ignore time & timezone)
      const pureDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      setSelectedDate(pureDate); // Stores only YYYY-MM-DD (no time)
      fetchAppointments(selectedLawyer._id);
    }
  };
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handCardInfo = (e) => {
    const { name, value } = e.target;
    setUserIno((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Time slot click handler
  const handleTimeClick = (time, slot) => {
    console.log({
      activeStep,
      selectedDate,
      selectedSlot,
      hasPrePayment: !!(data?.payment && data?.lawyer),
    });
    setSelectedTime(time);
    setSelectedSlot(slot);
  };

  // Convert to 12-hour format
  const convertTo12HourFormat = (time) => {
    // Handle null, undefined, or empty string cases
    if (!time) return '';

    // Handle cases where time is already in 12-hour format
    if (typeof time !== 'string') return String(time);
    if (time.includes('AM') || time.includes('PM')) return time;

    const timeParts = time.split(':');
    if (timeParts.length < 2) return time;

    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1].split(' ')[0]; // Handle cases with seconds or timezone

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${hours}:${minutes.padStart(2, '0')} ${period}`;
  };

  const generateCalendarDates = () => {
    const dates = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();
  const handleOpenPopup = (lawyer, slot) => {
    setSelectedLawyer(lawyer);
    setSelectedSlot(slot);
    setPopupmessage(
      `${subject} on ${new Intl.DateTimeFormat('en-US', dateOptions).format(selectedDate)} at ${convertTo12HourFormat(
        selectedSlot?.startTime
      )}?`
    );
    setPopupcolor('popup');
    setIsPopupVisible(true);
    setIsPopupVisiblecancel(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setClientMessage('');
  };
  /**
   * Updates slot booking status for a lawyer.
   *
   * @param {Object} params
   * @param {string} params.lawyerId - The lawyer's ID.
   * @param {string} params.slotId - The slot's ID.
   * @param {boolean} [params.isBooked=true] - Whether the slot is booked or unbooked.
   * @param {Object} [params.publicBooking] - Optional booking details { name, phone }.
   */
  const updateSlotBooking = async ({ lawyerId, slotId, isBooked = true, publicBooking = {} }) => {
    console.group('📌 Updating Slot Booking');

    if (!lawyerId || !slotId) {
      console.error('❌ Missing lawyerId or slotId for booking update.');
      return;
    }

    const updatedSlot = {
      slot: slotId,
      isBooked,
      publicBooking: {
        name: publicBooking.name || '',
        phone: publicBooking.phone || '',
      },
    };

    console.log('🔄 Calling crmBookappointments PATCH with:', updatedSlot);

    try {
      const slotUpdateResponse = await axios.patch(
        `${ApiEndPoint}crmBookappointments/${lawyerId}/${slotId}`,
        updatedSlot
      );
      console.log('✅ Slot Update Success:', slotUpdateResponse.data);
      return slotUpdateResponse.data;
    } catch (slotErr) {
      console.error('❌ Slot Update Failed:', {
        error: slotErr.message,
        response: slotErr.response?.data,
        config: {
          url: slotErr.config?.url,
          data: slotErr.config?.data,
        },
      });
      throw slotErr;
    } finally {
      console.groupEnd();
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    console.group('🔵 handleConfirmPayment - Start');

    try {
      // 🔹 Normalize payment method
      let normalizedPaymentMethod = paymentMethod;
      if (method === 'Online') {
        normalizedPaymentMethod = 'Card';
      } else if (method === 'InPerson') {
        if (paymentMethod === 'PayOnline') {
          normalizedPaymentMethod = 'Card';
        } else {
          normalizedPaymentMethod = 'PayInOffice';
        }
      }

      // 🔹 Prepare payment data
      const paymentData = {
        name: paymentForm?.name || confirmationData?.name || data?.payment?.name,
        phone: paymentForm?.phone || confirmationData?.phone || data?.payment?.phone,
        email: paymentForm?.email || data?.payment?.email,
        amount: Number(selectedLawyer?.price) || 200,
        cardHolder: UserInfo.name,
        cardHolderPhone: UserInfo.phone,
        cardHolderEmail: UserInfo.email,
        serviceType: service,
        lawyerId: selectedLawyer?._id,
        consultationType: method,
        paymentMethod: normalizedPaymentMethod,
        uniqueLinkId: ref || '',
        appointmentLink: window.location.href,
      };

      // Helper: Confirm slot + send email + update payment
      const finalizeBooking = async (paymentId) => {
        await sendConfirmationEmails(paymentId);
        await updateSlotBooking({
          lawyerId: selectedLawyer?._id,
          slotId: selectedSlot?._id,
          isBooked: true,
          publicBooking: {
            name: paymentForm.name || confirmationData?.name,
            phone: paymentForm.phone || confirmationData?.phone,
          },
          caseDescription: caseDiscription,
        });

        await axios.post(`${ApiEndPoint}payments/update-status`, {
          paymentId,
          meetingDetails: {
            meetingUrl: 'meetingbooked',
            date: selectedDate,
            slot: selectedSlot,
          },
          caseDescription: caseDiscription,
        });

        // 🧾 Generate Zoho Invoice
        // try {
        //   const appointmentPayload = {
        //     lawyer: selectedLawyer,
        //     service,
        //     method,
        //     date: selectedDate,
        //     slot: selectedSlot,
        //     clientMessage,
        //     caseDescription: caseDiscription,
        //     payment: {
        //       _id: paymentId,
        //       name: paymentForm?.name || confirmationData?.name,
        //       phone: paymentForm?.phone || confirmationData?.phone,
        //       email: paymentForm?.email || confirmationData?.email || '',
        //       amount: Number(selectedLawyer?.price) || 200,
        //       status: 'paid',
        //       serviceType: service,
        //       consultationType: method,
        //       paymentMethod,
        //       appointmentLink: window.location.href,
        //       createdAt: new Date(),
        //     },
        //   };

        //   console.log('🧾 Generating Zoho invoice...');
        //   const invoiceResponse = await axios.post(`${ApiEndPoint}createZohoInvoice`, appointmentPayload);
        //   await fetch(`${ApiEndPoint}payments/${paymentId}`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ hasInvoice: true }),
        //   });
        //   console.log('✅ Zoho invoice created:', invoiceResponse.data);
        // } catch (invoiceErr) {
        //   console.error('❌ Failed to generate Zoho invoice:', invoiceErr.response?.data || invoiceErr.message);
        // }

        setActiveStep(6);
      };

      // 🔹 Handle InPerson consultation
      if (method === 'InPerson') {
        if (normalizedPaymentMethod === 'PayInOffice') {
          console.log('⚙️ Processing InPerson PayInOffice flow');

          if (data?.payment?._id) {
            console.log('📌 Existing PayInOffice payment found:', data?.payment?._id);
            await finalizeBooking(data?.payment?._id);
          } else {
            await handlePayInOfficeFlow(paymentData);
          }
        } else if (normalizedPaymentMethod === 'Card') {
          if (data?.payment?.status === 'paid') {
            await finalizeBooking(data?.payment?._id);
          } else if (data?.payment?._id && data?.payment?.status === 'pending') {
            console.log('📌 Existing Card payment pending, confirming only');
            await handleCardPaymentFlow({ ...paymentData, paymentId: data?.payment?._id });
          } else {
            await handleCardPaymentFlow(paymentData);
          }
        }

        // 🔹 Handle Online consultation
      } else if (method === 'Online') {
        console.log('⚙️ Processing Online consultation');

        if (normalizedPaymentMethod === 'Card') {
          if (data?.payment?.status === 'paid') {
            await finalizeBooking(data?.payment?._id);
          } else if (data?.payment?._id) {
            console.log('📌 Existing Online Card payment pending, confirming only');
            await handleCardPaymentFlow({ ...paymentData, paymentId: data?.payment?._id });
          } else {
            await handleCardPaymentFlow(paymentData);
          }
        } else {
          const errorMsg = `Unsupported Online payment method: ${paymentMethod}`;
          console.log('❌', errorMsg);
          setPaymentError(errorMsg);
          throw new Error(errorMsg);
        }

        // 🔹 Unknown consultation type
      } else {
        const errorMsg = `Unsupported consultation type: ${method}`;
        console.log('❌', errorMsg);
        setPaymentError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.log('❌ handleConfirmPayment failed:', err);
      setPaymentError(err.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
      console.groupEnd();
    }
  };

  // Helper function to handle Pay at Office flow
  const handlePayInOfficeFlow = async (paymentData) => {
    console.log('🔄 Calling create-payment-intent API');
    let paymentResponse;
    try {
      const response = await axios.post(`${ApiEndPoint}payments/create-payment-intent`, paymentData);
      console.log('✅ create-payment-intent Response:', response.data);
      paymentResponse = response.data;

      await axios.post(`${ApiEndPoint}payments/update-status`, {
        paymentId: paymentResponse?.paymentId,
        meetingDetails: {
          meetingUrl: 'meetingbooked',
          date: selectedDate,
          slot: selectedSlot,
        },
        caseDescription: caseDiscription,
      });
      setPaymentSatus('pending');
      if (paymentResponse.isDuplicate) {
        console.log('🔄 Duplicate payment detected, using existing payment:', paymentResponse.paymentId);
      }
    } catch (err) {
      console.error('❌ create-payment-intent Error:', err.response?.data || err.message);
      throw err;
    }

    // Update slot booking
    console.group('📌 Updating Slot Booking for In-Person');
    const updatedSlot = {
      slot: selectedSlot?._id,
      isBooked: true,
      publicBooking: {
        name: paymentForm.name || confirmationData.name,
        phone: paymentForm.phone || confirmationData.phone,
      },
    };

    console.log('🔄 Calling crmBookappointments PATCH with:', updatedSlot);
    try {
      const slotUpdateResponse = await axios.patch(
        `${ApiEndPoint}crmBookappointments/${selectedLawyer?._id}/${selectedSlot?._id}`,
        updatedSlot
      );
      console.log('✅ Slot Update Success:', slotUpdateResponse.data);
    } catch (slotErr) {
      console.error('❌ Slot Update Failed:', {
        error: slotErr.message,
        response: slotErr.response?.data,
        config: {
          url: slotErr.config?.url,
          data: slotErr.config?.data,
        },
      });
      throw slotErr;
    }
    console.groupEnd();

    // Send confirmation emails
    await sendConfirmationEmails(paymentResponse.paymentId);

    // 🧾 Generate Zoho Invoice
    if (!data?.payment && !data?.lawyer) {
      try {
        const appointmentPayload = {
          lawyer: selectedLawyer,
          service,
          method: method || confirmationData.method,
          date: selectedDate,
          slot: selectedSlot,
          clientMessage,
          caseDescription: caseDiscription,
          payment: {
            _id: paymentResponse.paymentId,
            name: paymentForm?.name || confirmationData?.name,
            phone: paymentForm?.phone || confirmationData?.phone,
            email: paymentForm?.email || confirmationData?.email || '',
            amount: Number(selectedLawyer?.price) || 200,
            status: 'pending',
            serviceType: service,
            consultationType: method,
            paymentMethod: 'PayInOffice',
            appointmentLink: window.location.href,
            createdAt: new Date(),
          },
        };

        console.log('🧾 Generating Zoho invoice for PayInOffice...');
        const invoiceResponse = await axios.post(`${ApiEndPoint}createZohoInvoice`, appointmentPayload);
        console.log('✅ Zoho invoice created:', invoiceResponse.data);
        await fetch(`${ApiEndPoint}payments/${paymentResponse?.paymentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hasInvoice: true }),
        });
      } catch (invoiceErr) {
        console.error('❌ Failed to generate Zoho invoice:', invoiceErr.response?.data || invoiceErr.message);
      }
    }

    // Proceed to confirmation
    const confirmationPayload = {
      lawyer: selectedLawyer,
      service,
      method: method || confirmationData.method,
      paymentMethod: 'PayInOffice',
      paymentRecord: { _id: paymentResponse.paymentId || oldpaymentId || data?.payment?._id },
      ...(selectedDate && { date: selectedDate }),
      ...(selectedSlot && { slot: selectedSlot }),
      clientMessage,
    };
    console.log('📝 Setting Confirmation Data:', confirmationPayload);
    setConfirmationData(confirmationPayload);

    console.log('➡️ Moving to Step 5');
    setActiveStep(5);
  };

  // Helper function to handle card payments (both Online and InPerson consultations)
  const handleCardPaymentFlow = async (paymentData) => {
    // Create payment method
    const cardElement = elements.getElement(CardElement);
    const billingDetails = {
      name: UserInfo.name || name,
      phone: UserInfo.phone || phone,
    };

    // only add email if available
    if (UserInfo.email) {
      billingDetails.email = UserInfo.email;
    }
    const { error: pmError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });

    if (pmError) {
      setPaymentError(pmError.message);
      throw new Error(pmError.message);
    }

    // Create payment intent
    const { data } = await axios.post(`${ApiEndPoint}payments/create-payment-intent`, paymentData);
    const { clientSecret, paymentId } = data;
    const PaymentID = paymentId;
    setPaymentId(paymentId);

    // Confirm payment
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: stripePaymentMethod?.id,
    });

    if (confirmError) {
      setPaymentError(confirmError.message);
      throw new Error(confirmError.message);
    }

    if (paymentIntent.status !== 'succeeded') {
      const errorMsg = `Unexpected status: ${paymentIntent.status}`;
      setPaymentError(errorMsg);
      throw new Error(errorMsg);
    }

    // Prepare all data to save
    const paymentUpdateData = {
      paymentId: PaymentID || oldpaymentId || data?.payment?._id,
      status: 'paid',
      paymentIntentId: paymentIntent.id,
      paymentMethodId: paymentIntent.payment_method,
      ...(method !== 'Online' && {
        meetingDetails: {
          ...(selectedDate && { date: selectedDate }),
          ...(selectedSlot && { slot: selectedSlot }),
        },
      }),
      caseDescription: caseDiscription,
    };
    setPaymentSatus('paid');
    // Update payment with all details
    await axios.post(`${ApiEndPoint}payments/update-status`, paymentUpdateData);

    // For InPerson with Card payment, update the slot
    if (method === 'InPerson') {
      const updatedSlot = {
        slot: selectedSlot?._id,
        isBooked: true,
        publicBooking: {
          name: paymentForm.name,
          phone: paymentForm.phone,
        },
      };

      await axios.patch(`${ApiEndPoint}crmBookappointments/${selectedLawyer?._id}/${selectedSlot?._id}`, updatedSlot);
      // Send confirmation emails
      await sendConfirmationEmails(paymentId);
    }
    // 🧾 Generate Zoho Invoice only for new bookings (no existing payment/lawyer)
    if (!data?.payment && !data?.lawyer) {
      try {
        const appointmentPayload = {
          lawyer: selectedLawyer,
          service,
          method,
          date: selectedDate,
          slot: selectedSlot,
          clientMessage,
          caseDescription: caseDiscription,
          payment: {
            _id: paymentId,
            name: paymentForm?.name || confirmationData?.name,
            phone: paymentForm?.phone || confirmationData?.phone,
            email: paymentForm?.email || confirmationData?.email || '',
            amount: Number(selectedLawyer?.price) || 200,
            status: 'paid',
            serviceType: service,
            consultationType: method,
            paymentMethod: 'Card',
            appointmentLink: window.location.href,
            createdAt: new Date(),
          },
        };

        console.log('🧾 Generating Zoho invoice for Card payment...');
        const invoiceResponse = await axios.post(`${ApiEndPoint}createZohoInvoice`, appointmentPayload);
        console.log('✅ Zoho invoice created:', invoiceResponse.data);

        await fetch(`${ApiEndPoint}payments/${paymentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hasInvoice: true }),
        });
      } catch (invoiceErr) {
        console.error('❌ Failed to generate Zoho invoice (Card):', invoiceErr.response?.data || invoiceErr.message);
      }
    }

    // Store confirmation data for the UI
    setConfirmationData({
      lawyer: selectedLawyer,
      service,
      method,
      paymentMethod: 'Card',
      ...(selectedDate && { date: selectedDate }),
      ...(selectedSlot && { slot: selectedSlot }),
      clientMessage,
      paymentRecord: { _id: paymentId },
    });

    // Move to confirmation step
    setActiveStep(5);
  };

  // Helper function to send confirmation emails
  // sendConfirmationEmails now accepts meetingUrl param
  const sendConfirmationEmails = async (paymentId, meetingUrl) => {
    console.group('📧 Sending Confirmation Emails');

    const formattedDate = selectedDate
      ? `${selectedDate.getDate()} ${selectedDate.toLocaleString('default', {
          month: 'long',
        })}, ${selectedDate.getFullYear()}`
      : '';

    try {
      // ======================
      // 1. Send Lawyer Email
      // ======================
      console.log('🔄 Sending Lawyer Email');

      const lawyerEmailPayload = {
        to: selectedLawyer?.Email,
        subject: `New ${method === 'Online' ? 'Online' : 'In-Person'} Appointment with ${
          paymentForm.name || data?.payment?.name
        }`,
        text: 'Appointment details',
        mailmsg: {
          lawyerDetails: selectedLawyer,
          clientDetails: {
            UserName: paymentForm?.name || confirmationData?.name || data?.payment?.name || name,
            Phone: paymentForm.phone || data?.payment?.phone || phone,
            Email: paymentForm.email || data?.payment?.email,
          },
          selectedTime,
          formattedDate,
          clientMessage,
          // isInPerson is boolean-like: keep value or fallback
          isInPerson: method === 'InPerson' || confirmationData?.method === 'InPerson',
          officeAddress: '1602, H Hotel, Sheikh Zayed Road, Dubai',
          // Always include meetingUrl (dummy when not provided)
          meetingLink: meetingUrl || 'meetingbooked',
        },
        caseDescription: caseDiscription,
        isClientEmail: false,
      };

      // Build FormData for lawyer (so attachments can be sent)
      const lawyerFormData = new FormData();
      Object.entries(lawyerEmailPayload).forEach(([key, value]) => {
        // stringify objects so backend can parse
        if (typeof value === 'object') {
          lawyerFormData.append(key, JSON.stringify(value));
        } else {
          // append even nullish values as empty string (backend handles)
          lawyerFormData.append(key, value ?? '');
        }
      });

      // Attach files (answers may contain File or array of Files)
      Object.entries(answers).forEach(([question, value]) => {
        if (Array.isArray(value)) {
          value.forEach((file) => file instanceof File && lawyerFormData.append('files', file));
        } else if (value instanceof File) {
          lawyerFormData.append('files', value);
        }
      });

      const lawyerEmailResponse = await axios.post(`${ApiEndPoint}crm-meeting`, lawyerFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('✅ Lawyer Email Response:', lawyerEmailResponse.data);

      // ======================
      // 2. Send Client Email (if exists)
      // ======================
      // let rescheduleLink =
      //   `https://portal.aws-legalgroup.com/reschedule/${phone}/${name.replace(/\s+/g, '-')}` + `?ref=${ref}`;
      // if (source === 'website') rescheduleLink += '&source=website';

      let rescheduleLink = `https://portal.aws-legalgroup.com/reschedule`;

      // Build search params
      const params = new URLSearchParams();

      // add phone if available
      if (phone) params.append('phone', phone);

      // add name if available
      if (name) params.append('name', name);

      // always add ref
      params.append('ref', ref);

      // add source if applicable
      if (source === 'website') params.append('source', 'website');

      // final link
      rescheduleLink += `?${params.toString()}`;

      const clientEmail = paymentForm.email || confirmationData?.email || data?.payment?.email;
      console.log('Sending Client Email:', clientEmail);

      if (clientEmail) {
        console.log('🔄 Sending Client Email');

        const clientEmailPayload = {
          to: clientEmail,
          subject: `Your ${method === 'Online' ? 'Online' : 'In-Person'} Appointment Confirmation`,
          text: 'Appointment details',
          // send null / empty when from website (so backend sees empty)
          clientWhatsApp: source === 'website' ? '' : phone,
          mailmsg: {
            lawyerDetails: selectedLawyer,
            clientDetails: {
              UserName: paymentForm.name || confirmationData?.name || data?.payment?.name || name,
              Phone: paymentForm.phone || data?.payment?.phone || phone,
              Email: clientEmail,
            },
            selectedTime,
            formattedDate,
            clientMessage,
            isInPerson: method === 'InPerson' || confirmationData?.method === 'InPerson',
            officeAddress: '1602, H Hotel, Sheikh Zayed Road, Dubai',
            rescheduleLink,
            meetingLink: meetingUrl || 'meetingbooked',
          },
          caseDescription: caseDiscription,
          isClientEmail: true,
        };

        const clientFormData = new FormData();
        Object.entries(clientEmailPayload).forEach(([key, value]) => {
          if (typeof value === 'object') {
            clientFormData.append(key, JSON.stringify(value));
          } else {
            clientFormData.append(key, value ?? '');
          }
        });

        // Attach files for client too
        Object.entries(answers).forEach(([question, value]) => {
          if (Array.isArray(value)) {
            value.forEach((file) => file instanceof File && clientFormData.append('files', file));
          } else if (value instanceof File) {
            clientFormData.append('files', value);
          }
        });

        const clientEmailResponse = await axios.post(`${ApiEndPoint}crm-meeting`, clientFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('✅ Client Email Sent:', clientEmailResponse.data);
      } else {
        console.log('ℹ️ No client email provided - skipping client email');
      }
    } catch (emailErr) {
      console.error('❌ Email Sending Failed:', {
        error: emailErr.message,
        response: emailErr.response?.data,
      });
      // continue
    } finally {
      console.groupEnd();
    }
  };

  // -------------------------------
  // handleConfirm (call sendConfirmationEmails with meetingUrl)
  // -------------------------------
  const handleConfirm = async () => {
    if (!selectedLawyer || !selectedDate || !selectedSlot) {
      console.error('❌ Missing required data for booking:', { selectedLawyer, selectedDate, selectedSlot });
      return;
    }
    if (selectedSlot?.isBooked) {
      setPopupcolor('popupconfirm');
      setPopupmessage('This slot has already been booked. Please choose another one.');
      return;
    }

    setIsLoading(true);
    setIsPopupVisiblecancel(false);

    let meetingCreated = false;
    let slotUpdated = false;
    let meetingUrl = '';
    let emailSent = false;

    try {
      console.group('🔁 Booking Process Started');

      const meetingDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      const startTime24 = convertTo24Hour(selectedSlot.startTime);
      const endTime24 = convertTo24Hour(selectedSlot.endTime);

      const formattedDate = selectedDate
        ? `${selectedDate.getDate()} ${selectedDate.toLocaleString('default', {
            month: 'long',
          })}, ${selectedDate.getFullYear()}`
        : '';

      let startDateTime = new Date(`${meetingDate}T${startTime24}:00Z`);
      let endDateTime = new Date(`${meetingDate}T${endTime24}:00Z`);
      if (endDateTime <= startDateTime) endDateTime.setDate(endDateTime.getDate() + 1);

      // Create team meeting
      try {
        console.group('📅 Creating Microsoft Teams Meeting');
        const meetingResponse = await axios.post(`${ApiEndPoint}CreateTeamMeeting`, {
          summary: 'Legal Consultation',
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          timeZone: 'Asia/Dubai',
        });
        meetingCreated = true;
        meetingUrl = meetingResponse.data.meetingLink || 'meetingbooked';
        setMeetingLink(meetingUrl);
        console.log('✅ Meeting created:', meetingUrl);
        console.groupEnd();
      } catch (err) {
        console.group('❌ Meeting Creation Failed');
        console.error('Error:', err.response?.data || err.message);
        console.groupEnd();
        // If you want to continue for InPerson, you can set meetingUrl = 'meetingbooked' instead of throwing.
        // But based on your flow, throw:
        throw new Error('Failed to create meeting link.');
      }

      // Step 2: Send Emails (pass meetingUrl)
      await sendConfirmationEmails(oldpaymentId || data?.payment?._id, meetingUrl);
      emailSent = true;

      // Step 3: Update slot
      const slotId = selectedSlot?._id;
      if (!slotId || !selectedLawyer?._id) throw new Error('Missing slotId or lawyerId');

      const updatedSlot = {
        slot: slotId,
        isBooked: true,
        publicBooking: { name: paymentForm.name, phone },
        meetingLink: meetingUrl,
      };

      const responseupdate = await axios.patch(
        `${ApiEndPoint}crmBookappointments/${selectedLawyer._id}/${slotId}`,
        updatedSlot
      );
      slotUpdated = true;
      console.log('✅ Slot updated successfully:', responseupdate.data);

      // Store confirmation
      setConfirmationData({
        lawyer: selectedLawyer,
        service,
        method,
        date: selectedDate,
        slot: selectedSlot,
        meetingLink: meetingUrl,
        clientMessage,
      });

      // Payment update
      try {
        await axios.post(`${ApiEndPoint}payments/update-status`, {
          paymentId: oldpaymentId || data?.payment?._id,
          meetingDetails: { meetingUrl, date: selectedDate, slot: selectedSlot },
          caseDescription: caseDiscription,
        });
        console.log('✅ Payment status updated');
      } catch (err) {
        console.error('Payment update error:', err.response?.data || err.message);
      }
      // Step 4: Generate Invoice
      if (!data?.payment && !data?.lawyer) {
        try {
          const appointmentPayload = {
            lawyer: selectedLawyer,
            service,
            method,
            date: selectedDate,
            slot: selectedSlot,
            clientMessage,
            caseDescription: caseDiscription,
            payment: {
              _id: oldpaymentId || data?.payment?._id,
              name: paymentForm?.name || confirmationData?.name || data?.payment?.name || name,
              phone: paymentForm?.phone || confirmationData?.phone || data?.payment?.phone || phone,
              email: paymentForm?.email || confirmationData?.email || data?.payment?.email || '',
              amount: Number(selectedLawyer?.price) || 200,
              status: paymentStatus || data?.payment?.status,
              serviceType: service,
              consultationType: method,
              paymentMethod,
              caseDescription: caseDiscription,
              appointmentLink: window.location.href,
              createdAt: new Date(),
            },
          };

          console.log('🧾 Generating Zoho Invoice...');
          const invoiceResponse = await axios.post(`${ApiEndPoint}createZohoInvoice`, appointmentPayload);
          console.log('✅ Invoice generated:', invoiceResponse.data);
        } catch (invoiceErr) {
          console.error('❌ Failed to generate Zoho invoice:', invoiceErr.response?.data || invoiceErr.message);
        }
      }

      // success popup
      setIsEmailSent(true);
      setPopupcolor('popupconfirm');
      setPopupmessage(emailSent ? 'Meeting scheduled successfully!' : 'Meeting scheduled, but email was not sent.');
      setTimeout(() => {
        setIsPopupVisible(false);
        setActiveStep(6);
      }, 2000);

      console.groupEnd();
    } catch (err) {
      console.group('❌ Booking Process Failed');
      console.error('General Error:', err.message, err.stack);
      console.groupEnd();

      let errorMsg = 'Failed to book appointment. Please try again.';
      if (slotUpdated && !emailSent) errorMsg = 'Slot was booked, but confirmation email failed to send.';
      else if (meetingCreated && !slotUpdated) errorMsg = 'Meeting was created, but slot booking failed.';

      setError(errorMsg);
      setPopupcolor('popupconfirm');
      setPopupmessage(errorMsg);
      setTimeout(() => setIsPopupVisible(false), 3000);
    } finally {
      setIsLoading(false);
      console.log('📤 Booking process completed (success or error).');
    }
  };

  const DetailItem = ({ icon, label, value, highlight }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}>
      {icon}
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(255,255,255,0.6)',
          mr: 0.5,
        }}
      >
        {label}:
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: highlight ? '#d4af37' : 'rgba(255,255,255,0.85)',
          fontWeight: highlight ? 500 : 400,
        }}
      >
        {value} {label === 'Experience' ? 'Years' : ''}
      </Typography>
    </Box>
  );
  const availableSlotsMap =
    appointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      acc[dateStr] = slot.slots;
      return acc;
    }, {}) || {};

  const availableDatesInfo =
    appointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      const hasBookedSlot = slot.slots.some((timeSlot) => timeSlot.isBooked);
      acc[dateStr] = { isAvailable: true, hasBookedSlot };
      return acc;
    }, {}) || {};
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: '#d4af37' },
      '&.Mui-focused fieldset': { borderColor: '#d4af37' },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': { color: '#d4af37' },
    },
    '& .MuiInputBase-input': {
      color: 'white',
      py: 1.5,
    },
  };
  const handleFreeTimeSelection = (slot) => {
    setSelectedSlot(slot);
    setSelectedTime(slot.startTime);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Service Type
        return (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              What legal service do you need?
            </Typography>
            <FormControl fullWidth>
              <InputLabel
                shrink={true}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#d4af37' },
                  '&.MuiInputLabel-shrink': { color: '#d4af37' },
                }}
              >
                Select a service
              </InputLabel>
              <Select
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                  setAnswers({});
                }}
                displayEmpty
                label="Select a service"
                sx={{
                  color: 'white !important',
                  '& .MuiSelect-select': {
                    color: 'white !important',
                    backgroundColor: '#18273e !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d4af37 !important',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d4af37 !important',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d4af37 !important',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#d4af37 !important',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      backgroundColor: '#18273e !important',
                      color: 'white !important',
                      border: '1px solid #d4af37 !important',
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          backgroundColor: 'rgba(212, 175, 55, 0.2) !important',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(212, 175, 55, 0.3) !important',
                          color: '#ffffff !important',
                        },
                        '& .MuiTypography-body2': {
                          color: 'rgba(255, 255, 255, 0.7) !important',
                        },
                      },
                    },
                  },
                }}
                error={!!errors.service}
              >
                {services.map((srv) => (
                  <MenuItem key={srv.name} value={srv.name}>
                    <Box>
                      <Typography fontWeight="medium">{srv.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {srv.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              {errors.service && (
                <Typography sx={{ color: 'red', fontSize: '12px', mt: 1 }}>{errors.service}</Typography>
              )}
            </FormControl>
            {source === 'website' && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  mt: 1,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '12px',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#d4af37',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: '600',
                  }}
                >
                  <PersonOutline fontSize="small" sx={{ color: '#d4af37' }} />
                  Your Information
                </Typography>
                <GlobalStyles
                  styles={{
                    '.personal-info-scope input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px #18273e inset',
                      WebkitTextFillColor: 'white',
                      caretColor: 'white',
                      transition: 'background-color 5000s ease-in-out 0s',
                    },
                    '.personal-info-scope input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px #18273e inset',
                      WebkitTextFillColor: 'white',
                    },
                  }}
                />
                <Grid container className="personal-info-scope" spacing={2}>
                  {/* Full Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={paymentForm.name}
                      onChange={handlePaymentChange}
                      required={source === 'website'}
                      error={source === 'website' && !paymentForm.name.trim()}
                      helperText={source === 'website' && !paymentForm.name.trim() ? 'Full name is required' : ''}
                      InputLabelProps={{
                        style: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: '#d4af37' },
                          '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      value={paymentForm.email}
                      onChange={handlePaymentChange}
                      required={source === 'website'}
                      error={source === 'website' && !paymentForm.email.trim()}
                      helperText={source === 'website' && !paymentForm.email.trim() ? 'Email is required' : ''}
                      InputLabelProps={{
                        style: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: '#d4af37' },
                          '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' },
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={paymentForm.phone}
                      onChange={handlePaymentChange}
                      required={source === 'website'}
                      error={source === 'website' && !paymentForm.phone.trim()}
                      helperText={source === 'website' && !paymentForm.phone.trim() ? 'Phone number required' : ''}
                      InputLabelProps={{
                        style: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: '#d4af37' },
                          '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
            {service && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ color: '#d4af37' }}>
                  Please answer the following:
                </Typography>
                {questionsConfig[service]?.map((q, idx) => (
                  <Box key={idx} sx={{ mt: 2 }}>
                    <Typography sx={{ color: 'white', mb: 1 }}>
                      {' '}
                      <RenderQuestion question={q.question} />
                    </Typography>
                    {q.type === 'text' && (
                      <TextField
                        fullWidth
                        multiline
                        value={answers[q.question] || ''}
                        onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                        error={!!errors[q.question]}
                        helperText={errors[q.question] || ''}
                        InputProps={{
                          style: {
                            color: 'white',
                            backgroundColor: '#18273e',
                            maxHeight: '200px', // ✅ set your max height here
                            overflowY: 'auto', // ✅ enable scroll if text exceeds max height
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#18273e !important',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.23)' },
                            '&:hover fieldset': { borderColor: '#d4af37' },
                            '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                            textarea: {
                              overflowY: 'auto', // ✅ scroll inside textarea
                            },
                          },
                        }}
                      />
                    )}

                    {q.type === 'checkbox' && (
                      <FormGroup>
                        {q.options.map((option) => (
                          <FormControlLabel
                            key={option}
                            control={
                              <Checkbox
                                checked={answers[q.question] === option} // ✅ sirf ek option store hoga
                                onChange={() => handleCheckboxChange(q.question, option)}
                                sx={{ color: 'white', '&.Mui-checked': { color: '#d4af37' } }}
                              />
                            }
                            label={<Typography sx={{ color: 'white' }}>{option}</Typography>}
                          />
                        ))}
                        {errors[q.question] && (
                          <Typography sx={{ color: 'red', fontSize: '12px', mt: 1 }}>{errors[q.question]}</Typography>
                        )}
                      </FormGroup>
                    )}

                    {q.type === 'file' && (
                      <Box>
                        <Button
                          variant="contained"
                          component="label"
                          sx={{
                            backgroundColor: '#d4af37',
                            color: '#18273e',
                            '&:hover': { backgroundColor: '#b9972e' },
                          }}
                        >
                          Upload Files
                          <input
                            type="file"
                            hidden
                            multiple // ✅ allow multiple selection
                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(q.question, e.target.files)}
                          />
                        </Button>

                        {/* Show selected files */}
                        {answers[q.question] && Array.isArray(answers[q.question]) && (
                          <Box sx={{ mt: 1 }}>
                            {answers[q.question].map((file, idx) => (
                              <Typography key={idx} sx={{ color: 'white', fontSize: '14px' }}>
                                Selected: {file.name}
                              </Typography>
                            ))}
                          </Box>
                        )}

                        {errors[q.question] && (
                          <Typography sx={{ color: 'red', fontSize: '12px', mt: 1 }}>{errors[q.question]}</Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                ))}
                <Box sx={{ mt: 3 }}>
                  <TextField
                    label="Preview Description"
                    value={caseDiscription}
                    onChange={(e) => setDiscription(e.target.value)}
                    required
                    multiline
                    minRows={2}
                    maxRows={6}
                    inputProps={{ maxLength: 1024 }}
                    error={!!errors.caseDescription}
                    helperText={errors.caseDescription || ''}
                    InputProps={{
                      readOnly: true,
                      style: { color: 'white', backgroundColor: '#18273e' },
                    }}
                    InputLabelProps={{
                      sx: { color: '#d4af37 !important' },
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#18273e !important',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                        '&:hover fieldset': { borderColor: '#d4af37' },
                        '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        );

      case 1: // Select Lawyer
        return (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Select your preferred lawyer
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4, color: '#d4af37' }} />}
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box
              sx={{
                height: '60vh', // Fixed height for the scrollable area
                overflow: 'hidden', // Hide overflow from parent
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto', // Enable vertical scrolling
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '10px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#d4af37',
                    borderRadius: '10px',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                  }}
                >
                  {lawyers.map((lawyer) => (
                    <Card
                      key={lawyer._id}
                      variant="outlined"
                      sx={{
                        // Remove fixed minHeight to allow natural card sizing
                        cursor: 'pointer',
                        borderColor: selectedLawyer?._id === lawyer._id ? '#d4af37' : 'rgba(255,255,255,0.1)',
                        backgroundColor:
                          selectedLawyer?._id === lawyer._id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(15, 26, 47, 0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(212, 175, 55, 0.08)',
                          borderColor: 'rgba(212, 175, 55, 0.3)',
                        },
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      onClick={() => setSelectedLawyer(lawyer)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="flex-start" gap={2}>
                          <Avatar
                            src={lawyer.ProfilePicture}
                            sx={{
                              width: 64,
                              height: 64,
                              border: '2px solid #2c3e50',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                              flexShrink: 0,
                            }}
                          />

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                  sx={{
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {lawyer.UserName}
                                </Typography>
                                {lawyer.position && (
                                  <Typography variant="caption" sx={{ color: '#d4af37', fontWeight: 500 }}>
                                    {lawyer.position}
                                  </Typography>
                                )}
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                  borderRadius: 1,
                                  px: 1,
                                  py: 0.5,
                                  flexShrink: 0,
                                }}
                              >
                                <Typography variant="body2" sx={{ color: '#d4af37', fontWeight: 600 }}>
                                  <Box component="span" sx={{ mr: 0.5 }}>
                                    AED
                                  </Box>
                                  {lawyer.price || 200}/hr
                                </Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1.2,
                                mb: lawyer.bio ? 1 : 0,
                              }}
                            >
                              <DetailItem
                                icon={<Work sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
                                label="Service"
                                value={lawyer.specialty}
                              />
                              <DetailItem
                                icon={<AccessTime sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
                                label="Experience"
                                value={lawyer.experience}
                              />

                              <DetailItem
                                icon={<LocationOn sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
                                label="Location"
                                value={lawyer.address.split(',')[0]}
                              />
                              <DetailItem
                                icon={<AccessTime sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
                                label="Availability"
                                value={formatAvailability(lawyer.availablity) || 'N/A'}
                              />
                            </Box>

                            {lawyer.bio && (
                              <Box
                                sx={{
                                  borderTop: '1px solid rgba(255,255,255,0.15)',
                                  mt: 2,
                                  pt: 1.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.75)',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: 1.4,
                                    whiteSpace: 'pre-line',
                                  }}
                                >
                                  {lawyer.bio.length > 300 ? `${lawyer.bio.substring(0, 300)}...` : lawyer.bio}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        );

      case 2: // Choose Date & Time
        return (
          <Box sx={{ my: 3, color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Select Date and Time
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Available times with {selectedLawyer?.UserName}
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4, color: '#d4af37' }} />}
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {/* Custom Calendar */}
            <Box sx={{ mb: 3, border: '1px solid #d4af37', borderRadius: 2, p: 2, backgroundColor: '#18273e' }}>
              {/* Header Navigation */}
              <div className="d-flex justify-content-between align-items-center mt-5" style={{ gap: '10px' }}>
                <button className="calender-button" onClick={prevMonth}>
                  <FontAwesomeIcon icon={faArrowLeft} size="1x" color="white" />
                </button>
                <h3 className="text-white">
                  {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </h3>
                <button onClick={nextMonth} className="calender-button">
                  <FontAwesomeIcon icon={faArrowRight} size="1x" color="white" />
                </button>
              </div>
              {/* Days of the Week */}
              <div className="d-flex justify-content-between font-weight-bold my-2" style={{ gap: '3px' }}>
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="Calendarday"
                    style={{
                      border: '1px solid #d2a85a',
                      width: 'calc(100% / 7)',
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                    }}
                  >
                    {day.substring(0, window.innerWidth < 400 ? 1 : 3)}
                  </div>
                ))}
              </div>
              {/* Calendar Dates */}
              <div className="d-flex flex-wrap">
                {(() => {
                  let firstAvailableSelected = false; // Local flag inside IIFE

                  return calendarDates.map((date, index) => {
                    if (!date) {
                      return (
                        <div
                          key={index}
                          className="calendarEmpty"
                          style={{ width: 'calc(100% / 7)', height: '40px' }}
                        ></div>
                      );
                    }

                    const dateStr = date.toDateString();
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const cellDate = new Date(date);
                    cellDate.setHours(0, 0, 0, 0);
                    const isFutureOrToday = cellDate >= today;
                    const dateInfo = availableDatesInfo[dateStr] || {};
                    const isAvailableDate = isFutureOrToday && dateInfo.isAvailable;

                    // ✅ Auto-select the first future/today available date if current date is NOT available
                    if (isAvailableDate && !selectedDate && !firstAvailableSelected) {
                      firstAvailableSelected = true;
                      setTimeout(() => handleDateClick(date), 0); // Call after render
                    }

                    const isSelected = selectedDate?.toDateString() === dateStr;

                    return (
                      <div
                        key={index}
                        onClick={isAvailableDate ? () => handleDateClick(date) : null}
                        className={`calendarDates ${isAvailableDate ? 'availableDate' : ''}`}
                        style={{
                          border: isSelected ? '2px solid white' : '2px solid rgb(2, 30, 58)',
                          borderRadius: '5px',
                          color: isAvailableDate ? 'white' : 'gray',
                          cursor: isAvailableDate ? 'pointer' : 'not-allowed',
                          background: isSelected ? '#d2a85a' : '',
                          textAlign: 'center',
                          lineHeight: '40px',
                          height: '40px',
                          fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                          width: 'calc(100% / 7)',
                        }}
                      >
                        {date.getDate()}
                      </div>
                    );
                  });
                })()}
              </div>
            </Box>

            {/* Time Slots */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: '#d4af37',
                borderRadius: 2,
                p: 2,
                maxHeight: 300,
                width: '100%',
                overflowY: 'auto',
                backgroundColor: '#18273e',
                color: 'white',
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#d4af37' }}>
                Available Slots
              </Typography>
              <Box
                className="gap-2"
                sx={{
                  marginLeft: '5px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                }}
              >
                {selectedDate ? (
                  availableSlotsMap[selectedDate.toDateString()]
                    ?.filter((slot) => !slot.isBooked) // ✅ Only include unbooked slots
                    .map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => {
                          if (selectedLawyer?.price === 0 || selectedLawyer?.price === '') {
                            handleFreeTimeSelection(slot);
                          } else {
                            handleTimeClick(slot.startTime, slot);
                          }
                        }}
                        className="time-button"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '5px',
                          border: '1px solid #d4af37',
                          background: selectedTime === slot.startTime ? '#d2a85a' : '#16213e',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                          width: '100%',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedTime !== slot.startTime) {
                            e.target.style.background = '#d2a85a';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTime !== slot.startTime) {
                            e.target.style.background = '#16213e';
                          }
                        }}
                      >
                        {convertTo12HourFormat(slot.startTime)} - {convertTo12HourFormat(slot.endTime)}
                      </button>
                    ))
                ) : (
                  <Typography sx={{ color: '#d4af37' }}>Select a date to view available times</Typography>
                )}
              </Box>
            </Box>

            {/* Confirmation Button for Free Appointments */}
            {selectedLawyer?.price === '0' ||
              (selectedLawyer?.price === '' && selectedSlot && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleConfirm}
                    disabled={!UserInfo.name || !UserInfo.email || !UserInfo.phone || !selectedSlot || isProcessing}
                    sx={{
                      px: 3,
                      py: 1.2,
                      backgroundColor: '#d4af37',
                      color: '#18273e',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
                      '&:hover': { backgroundColor: '#c19b2e' },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(212, 175, 55, 0.4)',
                        color: '#18273e99',
                      },
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <CircularProgress size={20} sx={{ color: '#18273e', mr: 1.5 }} />
                        Confirming...
                      </>
                    ) : (
                      `Confirm Free Appointment`
                    )}
                  </Button>
                </Box>
              ))}
          </Box>
        );

      case 3: // Consultation Method (Location)
        return (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              How would you like to consult?
            </Typography>
            <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
              {/* In-Person Option */}
              <Card
                variant="outlined"
                sx={{
                  mb: 2,
                  borderColor: method === 'InPerson' ? '#d4af37' : 'divider',
                  backgroundColor: method === 'InPerson' ? 'rgba(212, 175, 55, 0.1)' : '#18273e',
                  '&:hover': {
                    borderColor: '#d4af37',
                  },
                }}
                onClick={() => setMethod('InPerson')}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <LocationOn
                      sx={{
                        mr: 2,
                        color: method === 'InPerson' ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                      }}
                    />
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight="medium" sx={{ color: 'white' }}>
                          In-Person Meeting
                        </Typography>
                        {method === 'InPerson' && (
                          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                            <ExpandMore />
                          </IconButton>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Meet at our office or your preferred location
                      </Typography>

                      {method === 'InPerson' && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                            Payment Method:
                          </Typography>
                          <RadioGroup
                            value={paymentMethod}
                            onChange={(e) => {
                              setPaymentMethod(e.target.value);
                              // Clear card details if switching to PayInOffice
                              if (e.target.value === 'PayInOffice') {
                                try {
                                  const cardElement = elements.getElement(CardElement);
                                  if (cardElement) {
                                    cardElement.clear();
                                  }
                                } catch (error) {
                                  console.warn('Failed to clear card element:', error);
                                }
                              }
                            }}
                            sx={{
                              '& .MuiRadio-root': {
                                color: '#d4af37', // Radio button color
                                '&.Mui-checked': {
                                  color: '#d4af37', // Checked state color
                                },
                              },
                              '& .MuiFormControlLabel-label': {
                                color: 'white', // Label color
                              },
                            }}
                          >
                            <FormControlLabel
                              value="PayInOffice"
                              control={<Radio />}
                              label={<Typography sx={{ color: 'white' }}>Pay at Office</Typography>}
                              sx={{ mb: 1 }}
                            />
                            <FormControlLabel
                              value="PayOnline"
                              control={<Radio />}
                              label={<Typography sx={{ color: 'white' }}>Pay Online Now</Typography>}
                            />
                          </RadioGroup>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Online Option */}
              <Card
                variant="outlined"
                sx={{
                  borderColor: method === 'Online' ? '#d4af37' : 'divider',
                  backgroundColor: method === 'Online' ? 'rgba(212, 175, 55, 0.1)' : '#18273e',
                  '&:hover': {
                    borderColor: '#d4af37',
                  },
                }}
                onClick={() => {
                  setMethod('Online');
                  setPaymentMethod('PayOnline'); // Force PayOnline for online consultations
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Schedule
                      sx={{
                        mr: 2,
                        color: method === 'Online' ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                      }}
                    />
                    <Box>
                      <Typography fontWeight="medium" sx={{ color: 'white' }}>
                        Online Consultation
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Video call from the comfort of your home
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#d4af37', mt: 1 }}>
                        Payment will be processed online
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </RadioGroup>
          </Box>
        );
      case 4:
        return (
          <Box
            sx={{
              my: 4,
              color: 'white',
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 2, sm: 3 },
            }}
          >
            {/* Page Title */}
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: '#d4af37',
                fontWeight: 'bold',
                mb: 4,
                textAlign: 'center',
              }}
            >
              {method === 'InPerson' && paymentMethod === 'PayInOffice'
                ? 'Complete Your Booking'
                : 'Complete Your Payment'}
            </Typography>

            {/* Summary Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                backgroundColor: 'transparent',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#d4af37',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: '600',
                }}
              >
                <ReceiptLong fontSize="small" />
                Order Summary
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={selectedLawyer?.ProfilePicture}
                      sx={{
                        width: 44,
                        height: 44,
                        border: '2px solid #d4af37',
                      }}
                    />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Lawyer
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: 'white',
                        }}
                      >
                        {selectedLawyer?.UserName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Service
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                    {service}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider
                    sx={{
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      my: 1,
                      borderBottomWidth: '1px',
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      p: 2,
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Total Amount:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#d4af37',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                      }}
                    >
                      {'  '}AED {selectedLawyer?.price || data?.payment?.amount || 200}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Personal Info Section (Only show if NOT PayInOffice) */}
            {!(method === 'InPerson' && paymentMethod === 'PayInOffice') && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '12px',
                  mb: 4,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#d4af37',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: '600',
                  }}
                >
                  <PersonOutline fontSize="small" sx={{ color: '#d4af37' }} />
                  Billing Information
                </Typography>

                <GlobalStyles
                  styles={{
                    '.personal-info-scope input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 1000px #18273e inset',
                      WebkitTextFillColor: 'white',
                      caretColor: 'white',
                      transition: 'background-color 5000s ease-in-out 0s',
                    },
                    '.personal-info-scope input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 1000px #18273e inset',
                      WebkitTextFillColor: 'white',
                    },
                  }}
                />

                <Grid className="personal-info-scope" container spacing={2}>
                  {/* Full Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={UserInfo.name}
                      onChange={handCardInfo}
                      required
                      InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline fontSize="small" sx={{ color: '#d4af37' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: '#18273e !important',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: '#d4af37' },
                          '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      value={UserInfo.email}
                      onChange={handCardInfo}
                      required
                      InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" sx={{ color: '#d4af37' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: '#d4af37' },
                          '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' },
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={UserInfo.phone}
                      onChange={handCardInfo}
                      required
                      InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone fontSize="small" sx={{ color: '#d4af37' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                          '&:hover fieldset': { borderColor: '#d4af37' },
                          '&.Mui-focused fieldset': { borderColor: '#d4af37' },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Payment Section */}
            {method === 'InPerson' && paymentMethod === 'PayInOffice' ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  You'll pay AED {selectedLawyer?.price || 200} at the office on your appointment date
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleConfirmPayment}
                  sx={{
                    px: 3,
                    py: 1.2,
                    backgroundColor: '#d4af37',
                    color: '#18273e',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
                    '&:hover': { backgroundColor: '#c19b2e' },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(212, 175, 55, 0.4)',
                      color: '#18273e99',
                    },
                  }}
                >
                  {isProcessing ? (
                    <>
                      <CircularProgress size={20} sx={{ color: '#18273e', mr: 1.5 }} />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '12px',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#d4af37',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: '600',
                  }}
                >
                  <CreditCard fontSize="small" sx={{ color: '#d4af37' }} />
                  Payment Details
                </Typography>

                <Box
                  sx={{
                    p: 2.5,
                    mb: 2,
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '8px',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    '& .StripeElement': {
                      width: '100%',
                      padding: '10px 0',
                    },
                  }}
                >
                  {elements ? (
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#ffffff',
                            '::placeholder': { color: 'rgba(255, 255, 255, 0.6)' },
                            iconColor: '#d4af37',
                          },
                          invalid: {
                            color: '#ff5252',
                            iconColor: '#ff5252',
                          },
                        },
                        hidePostalCode: true,
                      }}
                      onChange={(e) => setCardComplete(e.complete)}
                    />
                  ) : (
                    <CircularProgress size={24} />
                  )}
                </Box>

                {paymentError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(255, 72, 66, 0.15)',
                      color: 'white',
                      border: '1px solid rgba(255, 72, 66, 0.5)',
                    }}
                  >
                    {paymentError}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleConfirmPayment}
                    disabled={
                      isProcessing || !UserInfo.name || !UserInfo.email || !UserInfo.phone || !cardComplete || !elements
                    }
                    sx={{
                      px: 3,
                      py: 1.2,
                      backgroundColor: '#d4af37',
                      color: '#18273e',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
                      '&:hover': { backgroundColor: '#c19b2e' },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(212, 175, 55, 0.4)',
                        color: '#18273e99',
                      },
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <CircularProgress size={20} sx={{ color: '#18273e', mr: 1.5 }} />
                        Processing...
                      </>
                    ) : (
                      `Pay ${selectedLawyer?.price || 200} AED Now`
                    )}
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>
        );
      case 5: // Confirmation Step
        return (
          <Box sx={{ my: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
              }}
            >
              <CheckCircle sx={{ mr: 1, color: '#4CAF50' }} />
              Confirm Your Appointment
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mt: 3,
                border: '1px solid',
                borderColor: '#d4af37',
                borderRadius: 2,
                backgroundColor: '#18273e',
                color: 'white',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#d4af37' }}>
                Appointment Details
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={selectedLawyer?.ProfilePicture} sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {selectedLawyer?.UserName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    {selectedLawyer?.specialty}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Service
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {service}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Consultation Type
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {method === 'InPerson' ? 'In-Person' : 'Online'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Date & Time
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {selectedDate?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    • {convertTo12HourFormat(selectedSlot?.startTime)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Fee
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    AED {selectedLawyer?.price || data?.payment?.amount || 'AED 200'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Case Description
                  </Typography>
                  <Typography
                    fontWeight="medium"
                    sx={{
                      color: 'white',
                      display: '-webkit-box',
                      WebkitLineClamp: 3, // Show max 3 lines
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {caseDiscription.split(' ').slice(0, 20).join(' ')}
                    {caseDiscription.split(' ').length > 20 && '...'}
                  </Typography>
                </Box>
              </Box>

              {method !== 'InPerson' ? (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => {
                      setPopupmessage(
                        `Confirm ${service} consultation with ${selectedLawyer?.UserName} on ${new Intl.DateTimeFormat(
                          'en-US',
                          options
                        ).format(selectedDate)} at ${convertTo12HourFormat(selectedSlot?.startTime)}?`
                      );
                      setPopupcolor('popup');
                      setIsPopupVisible(true);
                      setIsPopupVisiblecancel(true);
                    }}
                    sx={{
                      backgroundColor: '#d4af37',
                      color: '#18273e',
                      fontWeight: 'bold',
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: '#c19b2e',
                      },
                    }}
                  >
                    Confirm Appointment
                  </Button>
                </Box>
              ) : (
                data?.payment &&
                data?.payment?.consultationType === 'InPerson' && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      sx={{
                        px: 3,
                        py: 1.2,
                        backgroundColor: '#d4af37',
                        color: '#18273e',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
                        '&:hover': { backgroundColor: '#c19b2e' },
                        '&.Mui-disabled': {
                          backgroundColor: 'rgba(212, 175, 55, 0.4)',
                          color: '#18273e99',
                        },
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <CircularProgress size={20} sx={{ color: '#18273e', mr: 1.5 }} />
                          Processing...
                        </>
                      ) : (
                        `Confirm Your Appointment`
                      )}
                    </Button>
                  </Box>
                )
              )}
            </Paper>
          </Box>
        );

      case 6: // Success Step
        return (
          <Box sx={{ textAlign: 'center', my: 3 }}>
            <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Appointment Confirmed!
            </Typography>
            {/* Add any additional success message or details */}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4, position: 'relative' }}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Need help? Contact us" arrow disableInteractive disablePortal>
          <Button
            onClick={() => setHelpOpen(true)}
            startIcon={<HelpOutline />}
            sx={{
              color: '#18273e',
              backgroundColor: '#d4af37',
              '&:hover': {
                backgroundColor: '#c19b2e',
              },
              textTransform: 'none', // Prevents uppercase transformation
              fontWeight: 'medium',
              padding: '6px 16px',
            }}
          >
            Contact Us
          </Button>
        </Tooltip>
      </Box>
      {/* Help Dialog */}
      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#18273e', // dark navy background
            color: '#fff', // white text
            borderRadius: 3,
            border: '2px solid #d4af37',
            boxShadow: 10,
            p: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: '#d4af37', fontWeight: 'bold' }}>Need Help?</DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Contact our support team for assistance:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              href="tel:+9714332205928"
              sx={{
                justifyContent: 'flex-start',
                color: '#d4af37',
                borderColor: '#d4af37',
                '&:hover': {
                  backgroundColor: '#d4af37',
                  color: '#18273e',
                },
              }}
            >
              Call us: +9714332205928
            </Button>

            <Button
              variant="outlined"
              startIcon={<Email />}
              href="mailto:support@aws-legalgroup.com"
              sx={{
                justifyContent: 'flex-start',
                color: '#d4af37',
                borderColor: '#d4af37',
                '&:hover': {
                  backgroundColor: '#d4af37',
                  color: '#18273e',
                },
              }}
            >
              Email us: support@aws-legalgroup.com
            </Button>

            <Button
              variant="outlined"
              startIcon={<WhatsApp />}
              href="https://wa.me/971526986451" // Removed the extra '+' before country code
              target="_blank"
              rel="noopener noreferrer" // Added for security
              sx={{
                justifyContent: 'flex-start',
                color: '#d4af37',
                borderColor: '#d4af37',
                '&:hover': {
                  backgroundColor: '#d4af37',
                  color: '#18273e',
                },
              }}
            >
              WhatsApp: +971 52 698 6451
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setHelpOpen(false)}
            sx={{
              color: '#d4af37',
              '&:hover': {
                backgroundColor: '#d4af37',
                color: '#18273e',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup Component */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className={popupcolor}>
            {!isLoading && !isEmailSent && (
              <>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: 'white',
                  }}
                >
                  Add additional information (optional)
                </h3>
                <textarea
                  placeholder="Text Message (Optional)"
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  style={{
                    width: '90%',
                    minHeight: '100px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    margin: '10px 0',
                    resize: 'vertical',
                  }}
                ></textarea>

                {isPopupVisiblecancel && (
                  <div className="popup-actions d-flex justify-content-center">
                    <button className="confirm-btn" onClick={handleConfirm}>
                      Done
                    </button>
                  </div>
                )}
              </>
            )}
            {isLoading && (
              <div className="loading-indicator" style={{ color: 'white' }}>
                <p>Sending...</p>
                <div className="spinner"></div>
              </div>
            )}
            {isEmailSent && (
              <div className="confirmation">
                <FontAwesomeIcon icon={faCheck} size="3x" color="white" className="m-2" />
              </div>
            )}
          </div>
        </div>
      )}

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: '#18273e',
          color: 'white',
          border: '1px solid #d4af37',
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => {
            const isLastStep = index === steps.length - 1;
            const isStepActive = activeStep === index;
            const isStepCompleted = activeStep > index || (isLastStep && activeStep === index);

            return (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={({ icon }) => (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isStepCompleted
                          ? '#d4af37'
                          : isStepActive
                          ? 'rgba(212, 175, 55, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: isStepCompleted ? '#18273e' : isStepActive ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 'bold',
                        border: isStepActive ? '1px solid #d4af37' : 'none',
                      }}
                    >
                      {icon}
                    </Box>
                  )}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: isStepActive || isStepCompleted ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: isStepActive ? 'bold' : 'normal',
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Box sx={{ minHeight: 300 }}>{renderStepContent(activeStep)}</Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            pt: 2,
          }}
        >
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={onResetClick}
              sx={{
                backgroundColor: '#d4af37',
                color: '#18273e',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#c19b2e',
                },
              }}
            >
              Book Another Appointment
            </Button>
          ) : (
            <>
              {activeStep > 0 &&
                activeStep < 5 &&
                paymentStatus !== 'paid' &&
                paymentStatus !== 'pending' &&
                data?.payment?.status !== 'paid' &&
                data?.payment?.status !== 'pending' && (
                  <Button
                    startIcon={<ArrowBack />}
                    variant="outlined"
                    onClick={handleBack}
                    sx={{
                      backgroundColor: '#d4af37',
                      color: '#18273e',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#c19b2e' },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(212, 175, 55, 0.5)',
                        color: 'rgba(24, 39, 62, 0.5)',
                      },
                    }}
                  >
                    Back
                  </Button>
                )}

              {activeStep < 4 && (
                <Button
                  endIcon={<ArrowForward />}
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    loading ||
                    // Step 0: Service
                    (activeStep === 0 && !service) ||
                    // Step 1: Select lawyer
                    (activeStep === 1 && !selectedLawyer) ||
                    // Step 2: Date & Slot Selection
                    (activeStep === 2 &&
                      (!(data?.payment && data?.lawyer)
                        ? !selectedDate || !selectedSlot // 🔹 No prepayment → need both
                        : !selectedSlot)) || // 🔹 Prepayment → only need slot
                    // Step 3: Consultation Method
                    (activeStep === 3 && !method) ||
                    // Step 4: Payment details (only when user is from website and has no prepayment)
                    (source === 'website' &&
                      !(data?.payment && data?.lawyer) &&
                      (!paymentForm.name.trim() || !paymentForm.phone.trim()))
                  }
                  sx={{
                    backgroundColor: '#d4af37',
                    color: '#18273e',
                    fontWeight: 'bold',
                    '&:hover': { backgroundColor: '#c19b2e' },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(212, 175, 55, 0.5)',
                      color: 'rgba(24, 39, 62, 0.5)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#18273e' }} /> : 'Next'}
                </Button>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

// Wrap with Stripe Elements provider
export default LegalConsultationStepper;
