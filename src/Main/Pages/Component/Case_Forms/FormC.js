import React, { useState, useEffect, useRef } from 'react';
import backgroundImage from '../../../Pages/Images/bg.jpg';
import { ApiEndPoint } from '../utils/utlis';
import SuccessModal from '../../AlertModels/SuccessModal';
import { useAlert } from '../../../../Component/AlertContext';
import { FaCross, FaDiscord, FaRemoveFormat, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { Form, Button, Card, Container, Row, Col, InputGroup } from 'react-bootstrap';

const ClientConsultationForm = ({ token }) => {
  const FormCDetails = useSelector((state) => state.screen.FormCDetails);
  const [fileName, setFileName] = useState(null);
  const [encryptedLink, setEncryptedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLinkGenerator, setShowLinkGenerator] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { showLoading, showSuccess, showError } = useAlert();

  // Country codes with flag images from CDN
  const countryCodes = [
    { code: '+1', flag: 'https://flagcdn.com/w20/us.png', name: 'United States', iso: 'us' },
    { code: '+44', flag: 'https://flagcdn.com/w20/gb.png', name: 'United Kingdom', iso: 'gb' },
    { code: '+91', flag: 'https://flagcdn.com/w20/in.png', name: 'India', iso: 'in' },
    { code: '+92', flag: 'https://flagcdn.com/w20/pk.png', name: 'Pakistan', iso: 'pk' },
    { code: '+86', flag: 'https://flagcdn.com/w20/cn.png', name: 'China', iso: 'cn' },
    { code: '+49', flag: 'https://flagcdn.com/w20/de.png', name: 'Germany', iso: 'de' },
    { code: '+33', flag: 'https://flagcdn.com/w20/fr.png', name: 'France', iso: 'fr' },
    { code: '+39', flag: 'https://flagcdn.com/w20/it.png', name: 'Italy', iso: 'it' },
    { code: '+34', flag: 'https://flagcdn.com/w20/es.png', name: 'Spain', iso: 'es' },
    { code: '+7', flag: 'https://flagcdn.com/w20/ru.png', name: 'Russia', iso: 'ru' },
    { code: '+81', flag: 'https://flagcdn.com/w20/jp.png', name: 'Japan', iso: 'jp' },
    { code: '+82', flag: 'https://flagcdn.com/w20/kr.png', name: 'South Korea', iso: 'kr' },
    { code: '+55', flag: 'https://flagcdn.com/w20/br.png', name: 'Brazil', iso: 'br' },
    { code: '+61', flag: 'https://flagcdn.com/w20/au.png', name: 'Australia', iso: 'au' },
    { code: '+64', flag: 'https://flagcdn.com/w20/nz.png', name: 'New Zealand', iso: 'nz' },
    { code: '+27', flag: 'https://flagcdn.com/w20/za.png', name: 'South Africa', iso: 'za' },
    { code: '+20', flag: 'https://flagcdn.com/w20/eg.png', name: 'Egypt', iso: 'eg' },
    { code: '+971', flag: 'https://flagcdn.com/w20/ae.png', name: 'UAE', iso: 'ae' },
    { code: '+966', flag: 'https://flagcdn.com/w20/sa.png', name: 'Saudi Arabia', iso: 'sa' },
    { code: '+965', flag: 'https://flagcdn.com/w20/kw.png', name: 'Kuwait', iso: 'kw' },
    { code: '+973', flag: 'https://flagcdn.com/w20/bh.png', name: 'Bahrain', iso: 'bh' },
    { code: '+974', flag: 'https://flagcdn.com/w20/qa.png', name: 'Qatar', iso: 'qa' },
    { code: '+968', flag: 'https://flagcdn.com/w20/om.png', name: 'Oman', iso: 'om' },
    { code: '+60', flag: 'https://flagcdn.com/w20/my.png', name: 'Malaysia', iso: 'my' },
    { code: '+65', flag: 'https://flagcdn.com/w20/sg.png', name: 'Singapore', iso: 'sg' },
    { code: '+66', flag: 'https://flagcdn.com/w20/th.png', name: 'Thailand', iso: 'th' },
    { code: '+84', flag: 'https://flagcdn.com/w20/vn.png', name: 'Vietnam', iso: 'vn' },
    { code: '+62', flag: 'https://flagcdn.com/w20/id.png', name: 'Indonesia', iso: 'id' },
    { code: '+63', flag: 'https://flagcdn.com/w20/ph.png', name: 'Philippines', iso: 'ph' },
    { code: '+90', flag: 'https://flagcdn.com/w20/tr.png', name: 'Turkey', iso: 'tr' },
    { code: '+31', flag: 'https://flagcdn.com/w20/nl.png', name: 'Netherlands', iso: 'nl' },
    { code: '+46', flag: 'https://flagcdn.com/w20/se.png', name: 'Sweden', iso: 'se' },
    { code: '+47', flag: 'https://flagcdn.com/w20/no.png', name: 'Norway', iso: 'no' },
    { code: '+45', flag: 'https://flagcdn.com/w20/dk.png', name: 'Denmark', iso: 'dk' },
    { code: '+358', flag: 'https://flagcdn.com/w20/fi.png', name: 'Finland', iso: 'fi' },
    { code: '+41', flag: 'https://flagcdn.com/w20/ch.png', name: 'Switzerland', iso: 'ch' },
    { code: '+43', flag: 'https://flagcdn.com/w20/at.png', name: 'Austria', iso: 'at' },
    { code: '+32', flag: 'https://flagcdn.com/w20/be.png', name: 'Belgium', iso: 'be' },
    { code: '+351', flag: 'https://flagcdn.com/w20/pt.png', name: 'Portugal', iso: 'pt' },
    { code: '+30', flag: 'https://flagcdn.com/w20/gr.png', name: 'Greece', iso: 'gr' },
    { code: '+48', flag: 'https://flagcdn.com/w20/pl.png', name: 'Poland', iso: 'pl' },
    { code: '+36', flag: 'https://flagcdn.com/w20/hu.png', name: 'Hungary', iso: 'hu' },
    { code: '+40', flag: 'https://flagcdn.com/w20/ro.png', name: 'Romania', iso: 'ro' },
    { code: '+420', flag: 'https://flagcdn.com/w20/cz.png', name: 'Czech Republic', iso: 'cz' },
    { code: '+52', flag: 'https://flagcdn.com/w20/mx.png', name: 'Mexico', iso: 'mx' },
    { code: '+54', flag: 'https://flagcdn.com/w20/ar.png', name: 'Argentina', iso: 'ar' },
    { code: '+56', flag: 'https://flagcdn.com/w20/cl.png', name: 'Chile', iso: 'cl' },
    { code: '+57', flag: 'https://flagcdn.com/w20/co.png', name: 'Colombia', iso: 'co' },
    { code: '+51', flag: 'https://flagcdn.com/w20/pe.png', name: 'Peru', iso: 'pe' },
    { code: '+58', flag: 'https://flagcdn.com/w20/ve.png', name: 'Venezuela', iso: 've' },
    { code: '+93', flag: 'https://flagcdn.com/w20/af.png', name: 'Afghanistan', iso: 'af' },
    { code: '+355', flag: 'https://flagcdn.com/w20/al.png', name: 'Albania', iso: 'al' },
    { code: '+213', flag: 'https://flagcdn.com/w20/dz.png', name: 'Algeria', iso: 'dz' },
    { code: '+376', flag: 'https://flagcdn.com/w20/ad.png', name: 'Andorra', iso: 'ad' },
  ];

  // Practice areas with subtypes
  const practiceAreas = {
    'Civil Law': [
      'Contract Disputes',
      'Property Disputes',
      'Tort Claims',
      'Civil Rights',
      'Debt Recovery',
      'Other Civil Matters',
    ],
    'Commercial Law': [
      'Business Formation',
      'Mergers & Acquisitions',
      'Commercial Contracts',
      'Banking & Finance',
      'Insolvency & Bankruptcy',
      'Other Commercial Matters',
    ],
    'Criminal Law': [
      'White Collar Crimes',
      'Drug Offenses',
      'Violent Crimes',
      'Cyber Crimes',
      'Traffic Violations',
      'Other Criminal Matters',
    ],
    'Family Law': ['Divorce', 'Child Custody', 'Adoption', 'Alimony', 'Prenuptial Agreements', 'Other Family Matters'],
    'Real Estate Law': [
      'Property Purchase/Sale',
      'Leasing Agreements',
      'Landlord-Tenant Disputes',
      'Property Development',
      'Mortgage & Financing',
      'Other Real Estate Matters',
    ],
    'Labor Law': [
      'Employment Contracts',
      'Workplace Discrimination',
      'Wrongful Termination',
      'Wage & Hour Disputes',
      'Workers Compensation',
      'Other Labor Matters',
    ],
    'Construction Law': [
      'Construction Contracts',
      'Construction Defects',
      'Mechanic Liens',
      'Building Regulations',
      'Construction Disputes',
      'Other Construction Matters',
    ],
    'Maritime Law': [
      'Shipping Disputes',
      'Marine Insurance',
      'Cargo Claims',
      'Maritime Injuries',
      'Admiralty Law',
      'Other Maritime Matters',
    ],
    'Personal Injury Law': [
      'Car Accidents',
      'Medical Malpractice',
      'Slip & Fall',
      'Product Liability',
      'Workplace Injuries',
      'Other Personal Injury Matters',
    ],
    'Technology Law': [
      'IT Contracts',
      'Data Privacy',
      'Intellectual Property',
      'Software Licensing',
      'Cybersecurity',
      'Other Technology Matters',
    ],
    'Financial Law': [
      'Securities Regulation',
      'Tax Law',
      'Banking Compliance',
      'Financial Fraud',
      'Investment Disputes',
      'Other Financial Matters',
    ],
    'Public Law': [
      'Administrative Law',
      'Constitutional Law',
      'Human Rights',
      'Immigration Law',
      'Municipal Law',
      'Other Public Law Matters',
    ],
    'Consumer Law': [
      'Consumer Protection',
      'Product Liability',
      'False Advertising',
      'Debt Collection',
      'Warranty Disputes',
      'Other Consumer Matters',
    ],
    'Environmental Law': [
      'Environmental Compliance',
      'Pollution Control',
      'Natural Resources',
      'Climate Change Law',
      'Environmental Litigation',
      'Other Environmental Matters',
    ],
    'Rental Law': [
      'Residential Leases',
      'Commercial Leases',
      'Eviction Proceedings',
      'Rent Control',
      'Security Deposits',
      'Other Rental Matters',
    ],
  };

  // Custom dropdown state for country selector
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const countryDropdownRef = useRef(null);

  // Filter countries based on search
  const filteredCountries = countryCodes.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery) ||
      country.iso.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        console.error('Copy failed:', err);
      }
    }
  };

  // Check if URL contains the encrypted link (using query params)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('data')) {
      setShowLinkGenerator(false);
    }
  }, []);

  const [clientName, setClientName] = useState('');
  const [CaseNumber, setCaseNumber] = useState('');
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
  const [practiceSubtype, setPracticeSubtype] = useState('Select');
  const [serviceDetails, setServiceDetails] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');

  // File Upload - Multiple files
  const [files, setFiles] = useState([]);

  // Referred By
  const [referredBy, setReferredBy] = useState('');

  const isDisabled = FormCDetails !== null;

  useEffect(() => {
    console.log('FormCDetails', FormCDetails);
    if (!FormCDetails) return;

    const fetchForm = async () => {
      try {
        const response = await axios.get(`${ApiEndPoint}consultation-forms/${FormCDetails?.checklist?.cForm}`);

        const data = response.data.form;

        setClientName(data.clientName || '');
        setCaseNumber(data.caseNumber || '');
        setCountryCode(data.phone?.countryCode || '+92');
        setPhoneNumber(data.phone?.number || '');
        setEmail(data.email || '');
        setContactAddress(data.address || '');
        setIndividualOrCompany(data.clientType || '');

        setCompanyName(data.companyName || '');
        setOccupation(data.occupation || '');
        setOpponentDetails(data.opponentDetails || '');
        setLegalService(data.serviceType || 'Select');
        setPracticeArea(data.practiceArea || 'Select');
        setPracticeSubtype(data.practiceSubtype || 'Select');
        setServiceDetails(data.serviceDetails || '');
        setDesiredOutcome(data.desiredOutcome || '');

        setFiles(data.documents || []);
        setReferredBy(data.referredBy || '');
      } catch (err) {
        console.error(err.response?.data?.message || 'Failed to fetch form');
      }
    };

    fetchForm();
  }, [FormCDetails]);

  // Reset subtype when practice area changes
  useEffect(() => {
    setPracticeSubtype('Select');
  }, [practiceArea]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    if (files.length + droppedFiles.length > 5) {
      alert('You can only upload up to 5 files.');
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    if (files.length + selected.length > 5) {
      alert('You can only upload up to 5 files.');
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const submitForm = async (formData) => {
    try {
      const response = await fetch(`${ApiEndPoint}createConsultation`, {
        method: 'POST',
        body: formData,
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

  const handleSubmit = async (e) => {
    showLoading();
    e.preventDefault();

    const formData = new FormData();

    // Append all form fields
    formData.append('clientName', clientName);
    formData.append('caseNumber', CaseNumber);
    formData.append('phoneNumber', `${countryCode}${phoneNumber}`);
    formData.append('email', email);
    formData.append('address', contactAddress);
    formData.append('clientType', individualOrCompany);
    formData.append('companyName', companyName);
    formData.append('occupation', occupation);
    formData.append('opponentDetails', opponentDetails);
    formData.append('serviceType', legalService);
    formData.append('practiceArea', practiceArea);
    formData.append('practiceSubtype', practiceSubtype);
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
      showSuccess('Form submitted successfully!');

      setClientName('');
      setCountryCode('');
      setPhoneNumber('');
      setEmail('');
      setContactAddress('');
      setIndividualOrCompany('');
      setCompanyName('');
      setOccupation('');
      setOpponentDetails('');
      setLegalService('Select');
      setPracticeArea('Select');
      setPracticeSubtype('Select');
      setServiceDetails('');
      setDesiredOutcome('');
      setReferredBy('');
      setFiles([]);
    } catch (error) {
      setDesiredOutcome('');
      if (error.response) {
        showError('Error submitting the form.', error.response);
      } else {
        showError('Network or server error:', error.message);
      }
    }
  };

  const fetchSignedUrl = async (filePath) => {
    try {
      console.log(filePath);
      const response = await fetch(`${ApiEndPoint}/downloadFileByUrl/${encodeURIComponent(filePath)}`);
      const data = await response.json();

      console.log('data=', data);
      if (response.ok) {
        window.open(data.url, '_blank');
        return data.url;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching signed URL:', err);
      return null;
    }
  };

  // Get selected country display
  const getSelectedCountry = () => {
    const selected = countryCodes.find((country) => country.code === countryCode);
    if (selected) {
      return (
        <span className="d-flex align-items-center">
          <img
            src={selected.flag}
            alt={selected.name}
            style={{
              width: '20px',
              height: '15px',
              marginRight: '8px',
              borderRadius: '2px',
            }}
          />
          <span className="fw-bold">{selected.code}</span>
        </span>
      );
    }
    return (
      <span className="d-flex align-items-center">
        <img
          src="https://flagcdn.com/w20/pk.png"
          alt="Pakistan"
          style={{
            width: '20px',
            height: '15px',
            marginRight: '8px',
            borderRadius: '2px',
          }}
        />
        <span className="fw-bold">+92</span>
      </span>
    );
  };

  // Handle country selection
  const handleCountrySelect = (code) => {
    setCountryCode(code);
    setShowCountryDropdown(false);
    setSearchQuery('');
  };

  // Render country display with flag image
  const renderCountryDisplay = (country) => {
    return (
      <div className="d-flex align-items-center w-100">
        <img
          src={country.flag}
          alt={country.name}
          style={{
            width: '20px',
            height: '15px',
            marginRight: '12px',
            borderRadius: '2px',
            flexShrink: 0,
          }}
        />
        <span className="fw-bold me-2" style={{ minWidth: '50px', flexShrink: 0 }}>
          {country.code}
        </span>
        <span className="text-muted" style={{ flex: 1 }}>
          {country.name}
        </span>
      </div>
    );
  };

  return (
    <Container
      fluid
      style={{
        backgroundImage: showLinkGenerator ? 'none' : `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: showLinkGenerator ? 'auto' : '100vh',
        display: showLinkGenerator ? 'block' : 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
      }}
    >
      <Row className="justify-content-center w-100 mx-0">
        <Col xl={8} lg={10} md={10} sm={12} className="px-0">
          <Card
            className="shadow-sm mt-1"
            style={{
              maxHeight: '90vh',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
          >
            <Card.Body style={{ padding: '25px' }}>
              {/* Header */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                  <Card.Img
                    src="/logo.png"
                    alt="Legal Group Logo"
                    style={{ height: '40px', width: 'auto' }}
                    className="mb-2 mb-md-0"
                  />

                  {showLinkGenerator && token?.Role !== 'client' && (
                    <div>
                      <div className="d-flex flex-wrap m-0 p-0 align-items-center gap-2">
                        <Button
                          variant="primary"
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            minWidth: '160px',
                            height: '45px',
                            lineHeight: '1.2',
                          }}
                          onClick={handleGenerateLink}
                        >
                          Generate Form Link
                        </Button>

                        {encryptedLink && (
                          <Button
                            variant="primary"
                            className="d-flex align-items-center justify-content-center"
                            onClick={handleCopy}
                            title={copied ? 'Copied!' : 'Copy Link'}
                            style={{
                              width: '45px',
                              height: '45px',
                            }}
                          >
                            <i className={`fas ${copied ? 'fa-check-circle' : 'fa-copy'}`}></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Card.Title className="mb-2">Client Consultation Brief</Card.Title>
                <Card.Text className="text-muted small">
                  Greetings from AWS Legal Group!
                  <br />
                  Thank you for consulting us regarding your legal matter...
                </Card.Text>
              </div>

              <Form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    Case Number(Optional) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    maxLength="255"
                    value={CaseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    disabled={isDisabled}
                  />
                  <Form.Text className="text-end d-block mt-1">{CaseNumber.length}/255</Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    Client Name(s) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    maxLength="255"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    disabled={isDisabled}
                  />
                  <Form.Text className="text-end d-block mt-1">{clientName.length}/255</Form.Text>
                </Form.Group>

                {/* Phone Number - Custom Country Selector with Search and Flag Images */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    {/* Custom Country Selector */}
                    <div className="position-relative" ref={countryDropdownRef}>
                      <Button
                        variant="outline-secondary"
                        className="d-flex align-items-center justify-content-between"
                        style={{
                          minWidth: '140px',
                          maxWidth: '160px',
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          borderRight: 'none',
                          height: '38px',
                          padding: '0.375rem 0.75rem',
                        }}
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        disabled={isDisabled}
                        type="button"
                      >
                        {getSelectedCountry()}
                        <i className="fas fa-chevron-down ms-2 small"></i>
                      </Button>

                      {/* Custom Dropdown Menu with Search */}
                      {showCountryDropdown && (
                        <div
                          className="position-absolute start-0 bg-white border rounded shadow-sm mt-1"
                          style={{
                            zIndex: 1060,
                            maxHeight: '350px',
                            overflowY: 'auto',
                            top: '100%',
                            minWidth: '300px',
                            width: '100%',
                          }}
                        >
                          {/* Search Box */}
                          <div className="p-2 border-bottom bg-light">
                            <div className="d-flex align-items-center">
                              <FaSearch className="text-muted me-2" size={14} />
                              <input
                                type="text"
                                className="form-control form-control-sm border-0 bg-light"
                                placeholder="Search country..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{ outline: 'none', boxShadow: 'none' }}
                              />
                            </div>
                          </div>

                          {/* Country List */}
                          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <div
                                  key={country.code}
                                  className={`d-flex align-items-center px-3 py-2 ${
                                    countryCode === country.code ? 'bg-primary text-white' : 'hover-bg-light'
                                  }`}
                                  onClick={() => handleCountrySelect(country.code)}
                                  style={{
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f8f9fa',
                                    minHeight: '44px',
                                  }}
                                >
                                  {renderCountryDisplay(country)}
                                </div>
                              ))
                            ) : (
                              <div className="px-3 py-3 text-muted text-center">No countries found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Form.Control
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      disabled={isDisabled}
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        flex: 1,
                      }}
                      placeholder="Enter phone number"
                    />
                  </InputGroup>
                </Form.Group>

                {/* Rest of your form components remain the same */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isDisabled}
                    placeholder="Enter email address"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Contact Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    disabled={isDisabled}
                    placeholder="Enter contact address"
                  />
                </Form.Group>

                {/* Individual/Company Dropdown */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    Individual or Company <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={individualOrCompany}
                    onChange={(e) => setIndividualOrCompany(e.target.value)}
                    required
                    disabled={isDisabled}
                  >
                    <option value="">Select</option>
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                  </Form.Select>
                </Form.Group>

                {/* Extra Info */}
                <Form.Group className="mb-4">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isDisabled}
                    placeholder="Enter company name"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Client Occupation / Business Activity</Form.Label>
                  <Form.Control
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    disabled={isDisabled}
                    placeholder="Enter occupation or business activity"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Opponent Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength="2000"
                    value={opponentDetails}
                    onChange={(e) => setOpponentDetails(e.target.value)}
                    disabled={isDisabled}
                    placeholder="Enter opponent details"
                    style={{ resize: 'vertical' }}
                  />
                  <Form.Text className="text-end d-block mt-1">{opponentDetails.length}/2000</Form.Text>
                </Form.Group>

                {/* Legal Service Dropdown */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    Legal Service Required <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={legalService}
                    onChange={(e) => setLegalService(e.target.value)}
                    required
                    disabled={isDisabled}
                  >
                    <option value="Select">Select</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Representation">Representation</option>
                  </Form.Select>
                </Form.Group>

                {/* MOVED: Practice Area Dropdown - Now placed after Service Details */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    Details on Service Required <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    maxLength="2000"
                    value={serviceDetails}
                    onChange={(e) => setServiceDetails(e.target.value)}
                    required
                    disabled={isDisabled}
                    placeholder="Enter details about the legal service required"
                    style={{ resize: 'vertical' }}
                  />
                  <Form.Text className="text-end d-block mt-1">{serviceDetails.length}/2000</Form.Text>
                </Form.Group>

                {/* Practice Area Dropdown - MOVED TO BOTTOM */}
                <Form.Group className="mb-4">
                  <Form.Label>
                    Practice Area <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={practiceArea}
                    onChange={(e) => setPracticeArea(e.target.value)}
                    required
                    disabled={isDisabled}
                  >
                    <option value="Select">Select</option>
                    {Object.keys(practiceAreas).map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Practice Subtype Dropdown
                {practiceArea !== "Select" && (
                  <Form.Group className="mb-4">
                    <Form.Label>
                      Practice Subtype <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={practiceSubtype}
                      onChange={(e) => setPracticeSubtype(e.target.value)}
                      required
                      disabled={isDisabled}
                    >
                      <option value="Select">Select</option>
                      {practiceAreas[practiceArea].map(subtype => (
                        <option key={subtype} value={subtype}>{subtype}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )} */}

                <Form.Group className="mb-4">
                  <Form.Label>
                    Desired Outcome / Suggested Action <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    maxLength="2000"
                    value={desiredOutcome}
                    onChange={(e) => setDesiredOutcome(e.target.value)}
                    required
                    disabled={isDisabled}
                    placeholder="Enter desired outcome or suggested action"
                    style={{ resize: 'vertical' }}
                  />
                  <Form.Text className="text-end d-block mt-1">{desiredOutcome.length}/2000</Form.Text>
                </Form.Group>

                {/* File Upload */}
                <Form.Group className="mb-4">
                  <Form.Label>Relevant Documents</Form.Label>
                  <Card className="border-dashed p-4 text-center">
                    <Card.Body
                      className="p-4 text-center"
                      style={{ cursor: 'pointer', border: '2px dashed #ccc' }}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Form.Control
                        type="file"
                        className="d-none"
                        id="fileUpload"
                        onChange={handleFileChange}
                        multiple
                        disabled={isDisabled || files.length >= 5}
                      />
                      <Form.Label
                        htmlFor="fileUpload"
                        className={`d-block ${files.length >= 5 || isDisabled ? 'text-muted' : ''}`}
                        style={{ cursor: files.length >= 5 || isDisabled ? 'not-allowed' : 'pointer' }}
                      >
                        <i className="bi bi-upload fs-2"></i>
                        <br />
                        <span className="text-primary text-decoration-underline">
                          {files.length >= 5 ? 'Maximum files selected' : 'Choose files to upload'}
                        </span>{' '}
                        {!files.length >= 5 && 'or drag and drop here'}
                      </Form.Label>
                    </Card.Body>

                    {files.length > 0 && (
                      <div className="mt-3">
                        <strong>Selected Files:</strong>
                        <ul className="list-group mt-2">
                          {files.map((file, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
                            >
                              <span className="text-break w-100">{file.name}</span>
                              {isDisabled && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                  onClick={() => fetchSignedUrl(file.path)}
                                >
                                  download
                                </button>
                              )}
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeFile(index)}
                                disabled={isDisabled}
                              >
                                X
                              </Button>
                            </li>
                          ))}
                        </ul>
                        <div className="text-muted mt-1">
                          {files.length} file{files.length !== 1 && 's'} selected
                        </div>
                      </div>
                    )}
                  </Card>
                </Form.Group>

                {/* Referred By */}
                <Form.Group className="mb-4">
                  <Form.Label>Referred By</Form.Label>
                  <Form.Control
                    type="text"
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                    disabled={isDisabled}
                    placeholder="Enter referral source"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-3 mb-2 py-2"
                  disabled={isDisabled}
                  style={{ fontSize: '1.1rem' }}
                >
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientConsultationForm;
