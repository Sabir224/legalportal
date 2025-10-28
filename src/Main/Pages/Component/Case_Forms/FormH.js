import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormCDetails, formHlinkformCstate, screenChange } from '../../../../REDUX/sliece';
import SignatureCanvas from 'react-signature-canvas';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { ApiEndPoint } from '../utils/utlis';
import { useAlert } from '../../../../Component/AlertContext';
import { Form, Button, Card, Container, Row, Col, Dropdown, InputGroup } from 'react-bootstrap';

const FormHandover = ({ token }) => {
  const dispatch = useDispatch();
  const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);
  const FormCselected = useSelector((state) => state.screen.FormCDetails);
  const dateRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [FormhOrFormCDetails, setFormhOrFormCDetails] = useState([]);
  const [isFilled, setIsFilled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMatchingFormC, setHasMatchingFormC] = useState(false);
  const [showFormH, setShowFormH] = useState(false);

  const [selectedDrafts, setSelectedDrafts] = useState('Select Draft');
  const [successMessage, setSuccessMessage] = useState('');
  const { showLoading, showSuccess, showError } = useAlert();
  const [formData, setFormData] = useState({
    clientName: '',
    caseNumber: reduxCaseInfo?.CaseNumber,
    handoverDateTime: '',
    checklist: {
      cForm: useSelector((state) => state.screen.FormCDetails),
      lForm: '',
      lfa: '',
      poa: '',
    },
    legalOpinion: '',
    caseStrategy: '',
    relatedDocs: [],
    providerName: token?.UserName,
    providerSignature: token?.email,
    receiverName: '',
    receiverSignature: '',
    isrecevied: false,
    isAccept: true,
    isDraft: false,
  });

  const fetchFormHData = async (caseId) => {
    try {
      const response = await axios.get(`${ApiEndPoint}/getFormHByCaseIdorFormC/${caseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Form H data:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (reduxCaseInfo) {
      getData();
    }
  }, [reduxCaseInfo]);

  const getData = async () => {
    try {
      setLoading(true);
      console.log('reduxCaseInfo?._id', reduxCaseInfo?._id);
      const result = await fetchFormHData(reduxCaseInfo?._id);
      setFormhOrFormCDetails(result);
      console.log('form c', FormCselected);
      
      // Check if there's a matching Form C with the same case number
      const currentCaseNumber = reduxCaseInfo?.CaseNumber;
      const hasMatchingFormC = result?.formC?.some(form => form.caseNumber === currentCaseNumber);
      setHasMatchingFormC(hasMatchingFormC);
      
      // Only show Form H if there's a matching Form C
      setShowFormH(hasMatchingFormC);

      // If Form H exists
      if (result?.form) {
        const form = result.form;
        setIsFilled(true);
        setFormData({
          clientName: form.clientName || '',
          caseNumber: form.caseNumber || reduxCaseInfo?.CaseNumber || '',
          handoverDateTime: form.handoverDateTime || '',
          checklist: {
            cForm: form.checklist?.cForm || FormCselected,
            lForm: form.checklist?.lForm || '',
            lfa: form.checklist?.lfa || '',
            poa: form.checklist?.poa || '',
          },
          legalOpinion: form.legalOpinionText || '',
          caseStrategy: form.caseStrategyText || '',
          relatedDocs: form.relatedDocsFiles || [],
          providerName: form.providerName || '',
          providerSignature: form.providerSignature || '',
          receiverName: form.receiverName || '',
          receiverSignature: form.receiverSignature || '',
          isrecevied: form.isReceived || false,
        });
        if (FormCselected) {
          setFormData(FormCselected);
        }
      }
      // If Form H does not exist, fallback to initial blank data
      else if (result?.case && result?.client) {
        setFormData({
          clientName: result.client?.UserName || '',
          caseNumber: result.case?.CaseNumber || reduxCaseInfo?.CaseNumber || '',
          handoverDateTime: '',
          checklist: {
            cForm: FormCselected ? FormCselected : '',
            lForm: '',
            lfa: '',
            poa: '',
          },
          legalOpinion: '',
          caseStrategy: '',
          relatedDocs: [],
          providerName: token?.UserName,
          providerSignature: token?.email,
          receiverSignature: '',
          isrecevied: false,
          isAccept: true,
          isDraft: false,
        });
        if (FormCselected) {
          setFormData(FormCselected);
        }
      }

      console.log('Form H API Response: ', result);
    } catch (err) {
      console.error('Error loading Form H or related data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in formData.checklist) {
      setFormData((prev) => ({
        ...prev,
        checklist: {
          ...prev.checklist,
          [name]: checked,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const providerSigRef = useRef();
  const receiverSigRef = useRef();

  const handleClearSignature = (type) => {
    if (type === 'provider') {
      providerSigRef.current.clear();
      setFormData({ ...formData, providerSignature: '' });
    } else {
      receiverSigRef.current.clear();
      setFormData({ ...formData, receiverSignature: '' });
    }
  };

  const handleSaveSignature = (type) => {
    const sigData = type === 'provider' ? providerSigRef.current.toDataURL() : receiverSigRef.current.toDataURL();

    if (type === 'provider') {
      setFormData({ ...formData, providerSignature: sigData });
    } else {
      setFormData({ ...formData, receiverSignature: sigData });
    }
  };

  const handleSignatureImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [`${type}Signature`]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      relatedDocs: [...prev.relatedDocs, ...newFiles].slice(0, 5), // max 5
    }));
  };

  const handleDropFiles = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFormData((prev) => ({
      ...prev,
      relatedDocs: [...prev.relatedDocs, ...droppedFiles].slice(0, 5),
    }));
  };

  const handleRemoveFile = (indexToRemove, file) => {
    let filepath = file.filePath;
    setFormData((prev) => ({
      ...prev,
      relatedDocs: prev.relatedDocs.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    if (!formData.caseNumber) newErrors.caseNumber = 'Case number is required.';
    if (!formData.handoverDateTime) newErrors.handoverDateTime = 'Handover date is required.';
    if (!formData.legalOpinion?.trim()) newErrors.legalOpinion = 'Written Legal Opinion is required.';
    if (!formData.caseStrategy?.trim()) newErrors.caseStrategy = 'Case Strategy is required.';
    if (!formData.receiverSignature) newErrors.receiverSignature = 'Receiving lawyer must be selected.';

    // If errors exist, set them and scroll to the first one
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstField = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstField}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    showLoading();

    try {
      const form = new FormData();
      console.log('form data', formData);

      // Append text fields
      if (token.Role !== 'paralegal') {
        form.append('clientName', formData.clientName);
        form.append('caseId', reduxCaseInfo?._id);
        form.append('caseNumber', reduxCaseInfo?.CaseNumber);
        form.append('handoverDateTime', formData.handoverDateTime);
        form.append('providerName', formData.providerName);
        form.append('receiverName', formData.receiverName);
        form.append('legalOpinionText', formData.legalOpinion || '');
        form.append('caseStrategyText', formData.caseStrategy || '');
        form.append('checklist[cForm]', formData.checklist.cForm);
        form.append('checklist[lForm]', formData.checklist.lForm);
        form.append('checklist[lfa]', formData.checklist.lfa);
        form.append('checklist[poa]', formData.checklist.poa);
        form.append('isAccept', true);
        form.append('isDraft', false);
      } else {
        form.append('clientName', formData.clientName);
        form.append('caseId', reduxCaseInfo?._id);
        form.append('caseNumber', reduxCaseInfo?.CaseNumber);
        form.append('handoverDateTime', formData.handoverDateTime);
        form.append('providerName', formData.providerName);
        form.append('receiverName', formData.receiverName);
        form.append('legalOpinionText', formData.legalOpinion || '');
        form.append('caseStrategyText', formData.caseStrategy || '');
        form.append('checklist[cForm]', formData.checklist.cForm);
        form.append('checklist[lForm]', formData.checklist.lForm);
        form.append('checklist[lfa]', formData.checklist.lfa);
        form.append('checklist[poa]', formData.checklist.poa);
        form.append('isAccept', false);
        form.append('isDraft', true);
      }

      // Append related docs
      (formData.relatedDocs || []).forEach((file) => {
        form.append('relatedDocsFiles', file);
      });

      form.append('providerSignature', formData.providerSignature);
      form.append('receiverSignature', formData.receiverSignature);

      const res = await axios.post(`${ApiEndPoint}createFormH`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showSuccess('Form submitted successfully!');
      getData();
      console.log(res.data);
    } catch (error) {
      if (error.response) {
        showError('Error submitting the form.', error.response);
      } else {
        showError('Network or server error:', error.message);
      }
    }
  };

  const handleSubmitDrafts = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    if (!formData.caseNumber) newErrors.caseNumber = 'Case number is required.';
    if (!formData.handoverDateTime) newErrors.handoverDateTime = 'Handover date is required.';
    if (!formData.legalOpinion?.trim()) newErrors.legalOpinion = 'Written Legal Opinion is required.';
    if (!formData.caseStrategy?.trim()) newErrors.caseStrategy = 'Case Strategy is required.';
    if (!formData.receiverSignature) newErrors.receiverSignature = 'Receiving lawyer must be selected.';

    // If errors exist, set them and scroll to the first one
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstField = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstField}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    showLoading();

    try {
      const form = new FormData();
      console.log('form data', formData);

      // Append text fields
      form.append('clientName', formData.clientName);
      form.append('caseId', reduxCaseInfo?._id);
      form.append('caseNumber', reduxCaseInfo?.CaseNumber);
      form.append('handoverDateTime', formData.handoverDateTime);
      form.append('providerName', formData.providerName);
      form.append('receiverName', formData.receiverName);
      form.append('legalOpinionText', formData.legalOpinion || '');
      form.append('caseStrategyText', formData.caseStrategy || '');
      form.append('checklist[cForm]', formData.checklist.cForm);
      form.append('checklist[lForm]', formData.checklist.lForm);
      form.append('checklist[lfa]', formData.checklist.lfa);
      form.append('checklist[poa]', formData.checklist.poa);
      form.append('isAccept', false);
      form.append('isDraft', true);
      // Append related docs
      (formData.relatedDocs || []).forEach((file) => {
        form.append('relatedDocsFiles', file);
      });

      form.append('providerSignature', formData.providerSignature);
      form.append('receiverSignature', formData.receiverSignature);

      const res = await axios.post(`${ApiEndPoint}createFormH`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showSuccess('Form submitted successfully!');
      getData();
      console.log(res.data);
    } catch (error) {
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
        window.open(data.url, '_blank'); // <-- Open in new tab
        return data.url;
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching signed URL:', err);
      return null;
    }
  };

  const handlegotoform = async (formCid, item) => {
    if (item.name === 'cForm') {
      console.log(formData);
      dispatch(FormCDetails(formData));
      dispatch(screenChange(16));
    }
  };

  // New function to navigate to Form C
  const handleGoToFormC = () => {
    dispatch(screenChange(16)); // Navigate to Form C screen
  };

  const isReadOnly = !!formData?.checklist;

  function getCaseNumberById(id) {
    const match = (FormhOrFormCDetails?.formC || []).find((form) => form._id === id);
    return match?.caseNumber || 'N/A';
  }

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show message if no matching Form C exists
  if (!showFormH) {
    return (
      <div className="card shadow-sm mt-1" style={{ maxHeight: '86vh', overflowY: 'auto' }}>
        <div className="card-body">
          <div className="mb-4 text-center">
            <img src="/logo.png" alt="Legal Group Logo" className="mb-3" style={{ height: '40px' }} />
            <h5 className="card-title text-danger">
              <u>Form H (Handover)</u>
            </h5>
          </div>
          <div className="alert alert-warning text-center">
            <h6>Form C Required</h6>
            <p>Please fill out Form C first before accessing Form H.</p>
            <div className="mt-3">
              <Button 
                variant="primary" 
                onClick={handleGoToFormC}
                className="me-2"
              >
                Go to Form C
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !isFilled ? (
          <div className="card shadow-sm mt-1" style={{ maxHeight: '86vh', overflowY: 'auto' }}>
            <div className="card-body">
              <div className="mb-4 text-center">
                <img src="/logo.png" alt="Legal Group Logo" className="mb-3" style={{ height: '40px' }} />
                <h5 className="card-title text-danger">
                  <u>Form H (Handover)</u>
                </h5>
              </div>

              <form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Practice Area <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Dropdown className="w-100">
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="dropdown-practice-area"
                        className="w-100 text-start d-flex justify-content-between align-items-center"
                      >
                        {selectedDrafts === 'Select Draft' ? 'Select Draft' : `Draft ${selectedDrafts + 1}`}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="w-100">
                        {FormhOrFormCDetails?.formHDrafts?.map((area, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={() => {
                              const form = area;
                              setFormData({
                                clientName: form.clientName || '',
                                caseNumber: form.caseNumber || reduxCaseInfo?.CaseNumber || '',
                                handoverDateTime: form.handoverDateTime || '',
                                checklist: {
                                  cForm: form.checklist?.cForm || FormCselected,
                                  lForm: form.checklist?.lForm || '',
                                  lfa: form.checklist?.lfa || '',
                                  poa: form.checklist?.poa || '',
                                },
                                legalOpinion: form.legalOpinionText || '',
                                caseStrategy: form.caseStrategyText || '',
                                relatedDocs: form.relatedDocsFiles || [],
                                providerName: form.providerName || '',
                                providerSignature: form.providerSignature || '',
                                receiverName: form.receiverName || '',
                                receiverSignature: form.receiverSignature || '',
                                isrecevied: form.isReceived || false,
                              });
                              setSelectedDrafts(index);
                            }}
                          >
                            Draft {index + 1}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </InputGroup>
                </Form.Group>
                <div className="mb-3">
                  <label className="form-label">Client Name:</label>
                  <input
                    type="text"
                    name="clientName"
                    className="form-control"
                    value={formData.clientName}
                    disabled={true}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Case #:</label>
                  <input
                    type="text"
                    name="caseNumber"
                    className="form-control"
                    value={formData.caseNumber || reduxCaseInfo?.CaseNumber || ''}
                    value={formData.caseNumber || reduxCaseInfo?.CaseNumber || ''}
                    disabled={true}
                    onChange={handleChange}
                    placeholder={!formData.caseNumber && !reduxCaseInfo?.CaseNumber ? "No case number available" : ""}
                  />
                  {!formData.caseNumber && !reduxCaseInfo?.CaseNumber && (
                    <div className="text-muted small mt-1">Case number will be auto-generated</div>
                  )}
                  {!formData.caseNumber && !reduxCaseInfo?.CaseNumber && (
                    <div className="text-muted small mt-1">Case number will be auto-generated</div>
                  )}
                </div>

                <div className="mb-3" ref={dateRef}>
                  <label className="form-label">Handover Date:</label>
                  <DatePicker
                    value={formData.handoverDateTime ? new Date(formData.handoverDateTime) : null}
                    onChange={(date) =>
                      handleChange({
                        target: {
                          name: 'handoverDateTime',
                          value: date ? date.toISOString() : '',
                        },
                      })
                    }
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        error: !!errors.handoverDateTime,
                        helperText: errors.handoverDateTime || '',
                      },
                    }}
                  />
                </div>

                <div className="mb-4">
                  <h6 className="text-danger fw-bold">Check List</h6>

                  <div className="d-flex flex-column gap-2">
                    {[
                      { label: 'The Filled-out C Form', name: 'cForm', formName: 'Form C' },
                      { label: 'The Filled-out L Form – MOM Form', name: 'lForm', formName: 'Form L' },
                      { label: 'The signed and stamped LFA', name: 'lfa', formName: 'LFA' },
                      { label: 'The POA', name: 'poa', formName: 'POA' },
                    ].map((item) => {
                      const isChecked = !!formData.checklist[item.name];
                      return (
                        <div className="form-check d-flex align-items-center flex-wrap gap-2" key={item.name}>
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            name={item.name}
                            checked={isChecked}
                            onChange={(e) => {
                              if (item.name !== 'cForm') {
                                setFormData((prev) => ({
                                  ...prev,
                                  checklist: {
                                    ...prev.checklist,
                                    [item.name]: e.target.checked,
                                  },
                                }));
                              }
                            }}
                            id={item.name}
                            disabled={item.name === 'cForm'}
                          />
                          <label 
                            className="form-check-label me-2" 
                            htmlFor={item.name}
                            style={{ 
                              color: !isChecked ? '#6c757d' : 'inherit',
                              fontWeight: !isChecked ? '500' : 'normal'
                            }}
                          >
                            {item.label}
                          </label>
                          <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-underline text-primary"
                            onClick={() => handlegotoform(formData.checklist[item.name], item)}
                            disabled={!isChecked}
                            style={{
                              fontSize: '0.9rem',
                              pointerEvents: isChecked ? 'auto' : 'none',
                              opacity: isChecked ? 1 : 0.5,
                            }}
                          >
                            Go to {item.formName}
                          </button>

                          {item.name === 'cForm' && (
                            <select
                              className="form-select form-select-sm w-auto"
                              value={formData.checklist.cForm || ''}
                              onChange={(e) => {
                                const selectedId = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  checklist: {
                                    ...prev.checklist,
                                    cForm: selectedId,
                                  },
                                }));
                              }}
                            >
                              <option value="">{FormhOrFormCDetails?.formC?.length > 0 ? "Select Case Number" : "No Form C available"}</option>
                              {(FormhOrFormCDetails?.formC || [])
                                .filter((form) => form?.caseNumber?.trim())
                                .map((form) => (
                                  <option key={form._id} value={form._id}>
                                    {form.caseNumber}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {[
                    { label: 'Written Legal Opinion', name: 'legalOpinion' },
                    { label: 'The Case Strategy', name: 'caseStrategy' },
                    { label: 'The Related documents', name: 'relatedDocs' },
                  ].map((item) => {
                    const isTextArea = ['legalOpinion', 'caseStrategy'].includes(item.name);
                    const maxLength = 10000;

                    return (
                      <div className="form-check d-flex flex-column align-items-start mt-3" key={item.name}>
                        <div className="d-flex align-items-center mb-2">
                          <label className="form-check-label me-3 mb-0" htmlFor={item.name}>
                            {item.label}
                          </label>
                        </div>

                        {isTextArea ? (
                          <>
                            <textarea
                              className={`form-control ${errors[item.name] ? 'is-invalid' : ''}`}
                              name={item.name}
                              maxLength={maxLength}
                              value={formData[item.name]}
                              onChange={handleChange}
                              rows={4}
                              placeholder="Enter details"
                              style={{ maxWidth: '100%' }}
                            />
                            {errors[item.name] && <div className="invalid-feedback">{errors[item.name]}</div>}
                            <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                              {formData[item.name]?.length || 0}/{maxLength} characters
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="border border-dashed p-4 text-center w-100"
                              style={{ borderRadius: '6px' }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleDropFiles(e)}
                            >
                              <div
                                className="card border-0 p-4 text-center"
                                style={{
                                  cursor: 'pointer',
                                  borderRadius: '6px',
                                  border: '2px dashed #ccc',
                                }}
                                onClick={() => document.getElementById(`relatedDocsInput`).click()}
                              >
                                <input
                                  type="file"
                                  className="form-control d-none"
                                  id="relatedDocsInput"
                                  onChange={handleMultipleFilesChange}
                                  multiple
                                  accept=".pdf,.doc,.docx,.png,.jpg"
                                  disabled={formData.relatedDocs.length >= 5}
                                />
                                <label className={`d-block ${formData.relatedDocs.length >= 5 ? 'text-muted' : ''}`}>
                                  <i className="bi bi-upload fs-2"></i>
                                  <br />
                                  <span className="text-primary text-decoration-underline">
                                    {formData.relatedDocs.length >= 5
                                      ? 'Maximum files selected'
                                      : 'Choose files to upload'}
                                  </span>{' '}
                                  {formData.relatedDocs.length >= 5 ? '' : 'or drag and drop here'}
                                </label>
                              </div>

                              {formData.relatedDocs.length > 0 && (
                                <div className="mt-3">
                                  <strong>Selected Files:</strong>
                                  <ul className="list-group mt-2">
                                    {formData.relatedDocs.map((file, index) => (
                                      <li
                                        key={index}
                                        className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
                                      >
                                        <span className="text-break w-100">
                                          {file?.name ? file?.name : file?.fileName}
                                        </span>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                          onClick={() => fetchSignedUrl(file.filePath)}
                                          disabled={file?.name ? true : false}
                                        >
                                          download
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                          onClick={() => handleRemoveFile(index, file)}
                                        >
                                          Remove
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="text-muted mt-1">
                                    {formData.relatedDocs.length} file
                                    {formData.relatedDocs.length !== 1 && 's'} selected
                                  </div>
                                </div>
                              )}
                              {errors.relatedDocs && <div className="text-danger small mt-1">{errors.relatedDocs}</div>}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <h6 className="text-danger fw-bold">The Lawyer Providing the CD File:</h6>
                  <p className="text-danger small fw-bold">
                    Please make sure all the mentioned documents are included in the file before signing the Handover
                    Form.
                  </p>
                  <input
                    type="text"
                    name="providerSignature"
                    className="form-control"
                    value={formData.providerName}
                    onChange={handleChange}
                    placeholder="Enter signature image URL"
                    disabled={true}
                  />
                </div>

                <div className="mb-4">
                  <h6 className="text-danger fw-bold">The Lawyer Receiving the CD File:</h6>
                  <select
                    className={`form-select ${errors.receiverSignature ? 'is-invalid' : ''}`}
                    name="receiverSignature"
                    value={formData.receiverSignature}
                    onChange={(e) => {
                      const selectedEmail = e.target.value;
                      const selectedLawyer = FormhOrFormCDetails?.lawyers?.find(
                        (lawyer) => lawyer.Email === selectedEmail
                      );

                      setFormData((prev) => ({
                        ...prev,
                        receiverSignature: selectedEmail,
                        receiverName: selectedLawyer?.UserName || '',
                      }));
                    }}
                  >
                    <option value="">Select a lawyer</option>
                    {FormhOrFormCDetails?.lawyers?.map((lawyer) => (
                      <option key={lawyer._id} value={lawyer.Email}>
                        {lawyer.UserName} ({lawyer.Role})
                      </option>
                    ))}
                  </select>
                  {errors.receiverSignature && (
                    <div className="invalid-feedback d-block">{errors.receiverSignature}</div>
                  )}
                </div>

                {token?.Role === 'paralegal' ? (
                  <button type="submit" className="btn btn-primary w-100 mt-3 mb-2">
                    Add Drafts
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary w-100 mt-3 mb-2">
                    Submit
                  </button>
                )}
              </form>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm mt-1" style={{ maxHeight: '86vh', overflowY: 'auto' }}>
            <div className="card-body">
              <div className="mb-4 text-center">
                <img src="/logo.png" alt="Legal Group Logo" className="mb-3" style={{ height: '40px' }} />
                <h5 className="card-title text-danger">
                  <u>Form H (Handover)</u>
                </h5>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Client Name:</label>
                  <input type="text" name="clientName" className="form-control" value={formData.clientName} disabled />
                </div>

                <div className="mb-3">
                  <label className="form-label">Case #:</label>
                  <input 
                    type="text" 
                    name="caseNumber" 
                    className="form-control" 
                    value={formData.caseNumber || reduxCaseInfo?.CaseNumber || ''} 
                    disabled 
                    placeholder={!formData.caseNumber && !reduxCaseInfo?.CaseNumber ? "No case number available" : ""}
                  />
                  {!formData.caseNumber && !reduxCaseInfo?.CaseNumber && (
                    <div className="text-muted small mt-1">Case number will be auto-generated</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Handover Date:</label>
                  <DatePicker
                    value={formData.handoverDateTime ? new Date(formData.handoverDateTime) : null}
                    onChange={(date) =>
                      handleChange({
                        target: {
                          name: 'handoverDateTime',
                          value: date ? date.toISOString() : '',
                        },
                      })
                    }
                    format="dd/MM/yyyy"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="mb-4">
                  <h6 className="text-danger fw-bold">Check List</h6>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { label: 'The Filled-out C Form', name: 'cForm', formName: 'Form C' },
                      { label: 'The Filled-out L Form – MOM Form', name: 'lForm', formName: 'Form L' },
                      { label: 'The signed and stamped LFA', name: 'lfa', formName: 'LFA' },
                      { label: 'The POA', name: 'poa', formName: 'POA' },
                    ].map((item) => {
                      const isChecked = !!formData.checklist[item.name];

                      return (
                        <div className="form-check d-flex align-items-center flex-wrap gap-2" key={item.name}>
                          <input
                            type="checkbox"
                            className="form-check-input me-2"
                            name={item.name}
                            checked={isChecked}
                            disabled
                            id={item.name}
                          />
                          <label 
                            className="form-check-label me-2" 
                            htmlFor={item.name}
                            style={{ 
                              color: !isChecked ? '#6c757d' : 'inherit',
                              fontWeight: !isChecked ? '500' : 'normal'
                            }}
                          >
                            {item.label}
                          </label>

                          <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-underline text-primary"
                            onClick={() => handlegotoform(formData.checklist[item.name], item)}
                            disabled={!isChecked}
                            style={{
                              fontSize: '0.9rem',
                              pointerEvents: isChecked ? 'auto' : 'none',
                              opacity: isChecked ? 1 : 0.5,
                            }}
                          >
                            Go to {item.formName}
                          </button>

                          {item.name === 'cForm' &&
                            (isReadOnly ? (
                              <div className="text-muted">{getCaseNumberById(formData.checklist.cForm)}</div>
                            ) : (
                              <select
                                className="form-select form-select-sm w-auto"
                                value={formData.checklist.cForm || ''}
                                onChange={(e) => {
                                  const selectedId = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    checklist: {
                                      ...prev.checklist,
                                      cForm: selectedId,
                                    },
                                  }));
                                }}
                              >
                                <option value="">{FormhOrFormCDetails?.formC?.length > 0 ? "Select Case Number" : "No Form C available"}</option>
                                {(FormhOrFormCDetails?.formC || [])
                                  .filter((form) => form?.caseNumber?.trim())
                                  .map((form) => (
                                    <option key={form._id} value={form._id}>
                                      {form.caseNumber}
                                    </option>
                                  ))}
                              </select>
                            ))}
                        </div>
                      );
                    })}
                  </div>

                  {[
                    { label: 'Written Legal Opinion', name: 'legalOpinion' },
                    { label: 'The Case Strategy', name: 'caseStrategy' },
                    { label: 'The Related documents', name: 'relatedDocs' },
                  ].map((item) => {
                    const isTextArea = ['legalOpinion', 'caseStrategy'].includes(item.name);
                    const maxLength = 10000;

                    return (
                      <div className="form-check d-flex flex-column align-items-start mt-3" key={item.name}>
                        <div className="d-flex align-items-center mb-2">
                          <label className="form-check-label me-3 mb-0" htmlFor={item.name}>
                            {item.label}
                          </label>
                        </div>

                        {isTextArea ? (
                          <>
                            <textarea
                              className="form-control"
                              name={item.name}
                              maxLength={maxLength}
                              value={formData[item.name]}
                              onChange={handleChange}
                              rows={4}
                              placeholder="Enter details"
                              style={{ maxWidth: '100%' }}
                              disabled={isReadOnly}
                            />
                            <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                              {formData[item.name]?.length || 0}/{maxLength} characters
                            </div>
                          </>
                        ) : (
                          <>
                            {isReadOnly ? (
                              <div className="mt-2">
                                <strong>Uploaded Files:</strong>
                                <ul className="list-group mt-2">
                                  {formData.relatedDocs.map((file, index) => {
                                    const extension = file.fileName?.split('.').pop()?.toLowerCase();
                                    let icon = 'bi-file-earmark';

                                    if (['pdf'].includes(extension)) icon = 'bi-file-earmark-pdf text-danger';
                                    else if (['doc', 'docx'].includes(extension))
                                      icon = 'bi-file-earmark-word text-primary';
                                    else if (['jpg', 'jpeg', 'png'].includes(extension))
                                      icon = 'bi-file-earmark-image text-success';
                                    else if (['xls', 'xlsx'].includes(extension))
                                      icon = 'bi-file-earmark-excel text-success';

                                    return (
                                      <li key={index} className="list-group-item d-flex align-items-center gap-2">
                                        <i className={`bi ${icon} fs-5`}></i>
                                        <a href={{}} target="_blank" rel="noopener noreferrer" className="text-break">
                                          {file.fileName}
                                        </a>

                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                          onClick={() => fetchSignedUrl(file.filePath)}
                                        >
                                          download
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ) : (
                              <div
                                className="border border-dashed p-4 text-center w-100"
                                style={{ borderRadius: '6px' }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDropFiles(e)}
                              >
                                <div
                                  className="card border-0 p-4 text-center"
                                  style={{
                                    cursor: 'pointer',
                                    borderRadius: '6px',
                                    border: '2px dashed #ccc',
                                  }}
                                  onClick={() => document.getElementById(`relatedDocsInput`).click()}
                                >
                                  <input
                                    type="file"
                                    className="form-control d-none"
                                    id="relatedDocsInput"
                                    onChange={handleMultipleFilesChange}
                                    multiple
                                    accept=".pdf,.doc,.docx,.png,.jpg"
                                    disabled={formData.relatedDocs.length >= 5}
                                  />
                                  <label className={`d-block ${formData.relatedDocs.length >= 5 ? 'text-muted' : ''}`}>
                                    <i className="bi bi-upload fs-2"></i>
                                    <br />
                                    <span className="text-primary text-decoration-underline">
                                      {formData.relatedDocs.length >= 5
                                        ? 'Maximum files selected'
                                        : 'Choose files to upload'}
                                    </span>{' '}
                                    {formData.relatedDocs.length >= 5 ? '' : 'or drag and drop here'}
                                  </label>
                                </div>

                                {formData.relatedDocs.length > 0 && (
                                  <div className="mt-3">
                                    <strong>Selected Files:</strong>
                                    <ul className="list-group mt-2">
                                      {formData.relatedDocs.map((file, index) => (
                                        <li
                                          key={index}
                                          className="list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2"
                                        >
                                          <span className="text-break w-100">{file.name}</span>
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                            onClick={() => handleRemoveFile(index)}
                                          >
                                            Remove
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                    <div className="text-muted mt-1">
                                      {formData.relatedDocs.length} file
                                      {formData.relatedDocs.length !== 1 && 's'} selected
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <h6 className="text-danger fw-bold">The Lawyer Providing the CD File:</h6>
                  <p className="text-danger small fw-bold">
                    Please make sure all the mentioned documents are included in the file before signing the Handover
                    Form.
                  </p>
                  <input
                    type="text"
                    name="providerSignature"
                    className="form-control"
                    value={formData.providerName}
                    onChange={handleChange}
                    placeholder="Enter signature image URL"
                    disabled
                  />
                </div>
                {!formData?.isrecevied ? (
                  <div className="mb-4">
                    <h6 className="text-danger fw-bold">The Lawyer Receiving the CD File:</h6>
                    <input
                      type="text"
                      name="providerSignature"
                      className="form-control"
                      value={formData.receiverName}
                      onChange={handleChange}
                      placeholder="Enter signature image URL"
                      disabled
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <h6 className="text-danger fw-bold">The Lawyer Receiving the CD File:</h6>
                    <h6 className="text-primary fw-bold">Received By {formData.receiverName}</h6>
                  </div>
                )}

                {token.Role === 'paralegal' ? (
                  <button onClick={handleSubmit} className="btn btn-primary w-100 mt-3 mb-2">
                    Submit Draft
                  </button>
                ) : (
                  !isReadOnly && (
                    <button type="submit" className="btn btn-primary w-100 mt-3 mb-2">
                      Submit
                    </button>
                  )
                )}
              </form>
            </div>
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default FormHandover;