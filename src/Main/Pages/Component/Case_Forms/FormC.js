import React, { useState, useEffect } from "react";
import backgroundImage from "../../../Pages/Images/bg.jpg";
import { ApiEndPoint } from "../utils/utlis";
import SuccessModal from "../../AlertModels/SuccessModal";
import { useAlert } from "../../../../Component/AlertContext";
import { FaCross, FaDiscord, FaRemoveFormat } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  InputGroup,
} from "react-bootstrap";

const ClientConsultationForm = ({ token }) => {


  const FormCDetails = useSelector((state) => state.screen.FormCDetails);
  const [fileName, setFileName] = useState(null);
  const [encryptedLink, setEncryptedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showLinkGenerator, setShowLinkGenerator] = useState(true); // To control whether the link generator is shown or not
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { showLoading, showSuccess, showError } = useAlert();

  const handleGenerateLink = () => {
    const data = JSON.stringify({ token, timestamp: Date.now() });
    const encrypted = btoa(data);
    const link = `${window.location.origin
      }/client-consultation?data=${encodeURIComponent(encrypted)}`;
    setEncryptedLink(link);
    setCopied(false);
  };

  //   const showSuccess = (msg) => {
  //     setSuccessMessage(msg);
  //     setShowSuccessModal(true);
  //   };

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
    if (urlParams.has("data")) {
      setShowLinkGenerator(false); // Hide link generator if opening from link
    }
  }, []);

  const [clientName, setClientName] = useState("");
  const [CaseNumber, setCaseNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+92");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [individualOrCompany, setIndividualOrCompany] = useState("");

  // Extra Info
  const [companyName, setCompanyName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [opponentDetails, setOpponentDetails] = useState("");
  const [legalService, setLegalService] = useState("Select");
  const [practiceArea, setPracticeArea] = useState("Select");
  const [serviceDetails, setServiceDetails] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");

  // File Upload - Multiple files
  const [files, setFiles] = useState([]);

  // Referred By
  const [referredBy, setReferredBy] = useState("");

  const isDisabled = FormCDetails !== null;
  useEffect(() => {
    console.log("FormCDetails", FormCDetails)
    if (!FormCDetails) return;

    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `${ApiEndPoint}consultation-forms/${FormCDetails?.checklist?.cForm}`
        );

        const data = response.data.form;

        setClientName(data.clientName || "");
        setCaseNumber(data.caseNumber || "");
        setCountryCode(data.phone?.countryCode || "+92");
        setPhoneNumber(data.phone?.number || "");
        setEmail(data.email || "");
        setContactAddress(data.address || "");
        setIndividualOrCompany(data.clientType || "");

        setCompanyName(data.companyName || "");
        setOccupation(data.occupation || "");
        setOpponentDetails(data.opponentDetails || "");
        setLegalService(data.serviceType || "Select");
        setPracticeArea(data.practiceArea || "Select");
        setServiceDetails(data.serviceDetails || "");
        setDesiredOutcome(data.desiredOutcome || "");

        setFiles(data.documents || []);
        setReferredBy(data.referredBy || "");

        // setForm(response.data.form);
        // setError('');
      } catch (err) {
        console.error(err.response?.data?.message || "Failed to fetch form");
      } finally {
      }
    };

    fetchForm();
  }, [FormCDetails]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    if (files.length + droppedFiles.length > 5) {
      alert("You can only upload up to 5 files.");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    if (files.length + selected.length > 5) {
      alert("You can only upload up to 5 files.");
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
        method: "POST",
        body: formData,
        // headers are automatically set by browser for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed");
      }

      return data;
    } catch (error) {
      console.error("Submission error:", error);
      throw error;
    }
  };

  // Modify your handleSubmit function
  const handleSubmit = async (e) => {
    showLoading();
    e.preventDefault();

    const formData = new FormData();

    // Append all form fields
    formData.append("clientName", clientName);
    formData.append("caseNumber", CaseNumber);
    formData.append("phoneNumber", `${countryCode}${phoneNumber}`);
    formData.append("email", email);
    formData.append("address", contactAddress);
    formData.append("clientType", individualOrCompany);
    formData.append("companyName", companyName);
    formData.append("occupation", occupation);
    formData.append("opponentDetails", opponentDetails);
    formData.append("serviceType", legalService);
    formData.append("practiceArea", practiceArea);
    formData.append("serviceDetails", serviceDetails);
    formData.append("desiredOutcome", desiredOutcome);
    formData.append("referredBy", referredBy);

    // Append each file
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const result = await submitForm(formData);
      console.log("Success:", result);
      // Show success message, redirect, etc.
      // alert('Form submitted successfully!');
      showSuccess("Form submitted successfully!");

      setClientName("");
      setCountryCode("");
      setPhoneNumber("");
      setEmail("");
      setContactAddress("");
      setIndividualOrCompany("");
      setCompanyName("");
      setOccupation("");
      setOpponentDetails("");
      setLegalService("Select");
      setPracticeArea("Select");
      setServiceDetails("");
      setDesiredOutcome("");
      setReferredBy("");
      setFiles([]);

      //   showSuccess("Form C is added ");
    } catch (error) {
      setDesiredOutcome("");
      if (error.response) {
        showError("Error submitting the form.", error.response);
      } else {
        showError("Network or server error:", error.message);
      }
      // Show error to user
    }
  };


  const fetchSignedUrl = async (filePath) => {
    try {
      console.log(filePath)
      const response = await fetch(`${ApiEndPoint}/downloadFileByUrl/${encodeURIComponent(filePath)}`);
      const data = await response.json();

      console.log("data=", data)
      if (response.ok) {
        window.open(data.url, '_blank'); // <-- Open in new tab
        // return data.signedUrl;
        return data.url;
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error fetching signed URL:", err);
      return null;
    }
  };

  return (
    <Container
      fluid
      style={{
        backgroundImage: showLinkGenerator ? "none" : `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: showLinkGenerator ? "auto" : "100vh",
        display: showLinkGenerator ? "block" : "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
    >
      <Row className="justify-content-center w-100 mx-0">
        <Col xl={8} lg={10} md={10} sm={12} className="px-0">
          <Card
            className="shadow-sm mt-1"
            style={{ maxHeight: "86vh", overflowY: "auto" }}
          >
            <Card.Body>
              {/* Header */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                  <Card.Img
                    src="/logo.png"
                    alt="Legal Group Logo"
                    style={{ height: "40px", width: "auto" }}
                    className="mb-2 mb-md-0"
                  />

                  {showLinkGenerator && token?.Role !== "client" && (
                    <div>
                      <div className="d-flex flex-wrap m-0 p-0 align-items-center gap-2">
                        <Button
                          variant="primary"
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            minWidth: "160px",
                            height: "45px",
                            lineHeight: "1.2",
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
                            title={copied ? "Copied!" : "Copy Link"}
                            style={{
                              width: "45px",
                              height: "45px",
                            }}
                          >
                            <i
                              className={`fas ${copied ? "fa-check-circle" : "fa-copy"
                                }`}
                            ></i>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Card.Title className="mb-2">
                  Client Consultation Brief
                </Card.Title>
                <Card.Text className="text-muted small">
                  Greetings from AWS Legal Group!
                  <br />
                  Thank you for consulting us regarding your legal matter...
                </Card.Text>
              </div>

              <Form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <Form.Group className="mb-3">
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
                  <Form.Text className="text-end">
                    {CaseNumber.length}/255
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
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
                  <Form.Text className="text-end">
                    {clientName.length}/255
                  </Form.Text>
                </Form.Group>

                {/* Phone Number - Fixed with InputGroup */}

                <Form.Group className="mb-3">
                  <Form.Label>
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      style={{ maxWidth: "120px" }}
                      disabled={isDisabled}
                    >
                      <option value="+92">+92</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </Form.Select>

                    <Form.Control
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      disabled={isDisabled}
                    />
                  </InputGroup>
                </Form.Group>


                <Form.Group className="mb-3">
                  <Form.Label>
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isDisabled}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contact Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    disabled={isDisabled}
                  />
                </Form.Group>

                {/* Individual/Company Dropdown - Fixed */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Individual or Company <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Dropdown className="w-100">
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="dropdown-individual-company"
                        className="w-100 text-start d-flex justify-content-between align-items-center pe-3"
                        disabled={isDisabled}
                      >
                        <span>
                          {individualOrCompany === "individual"
                            ? "Individual"
                            : individualOrCompany === "company"
                              ? "Company"
                              : "Select"}
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100">
                        <Dropdown.Item
                          onClick={() => setIndividualOrCompany("individual")}
                        >
                          Individual
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setIndividualOrCompany("company")}
                        >
                          Company
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </InputGroup>
                </Form.Group>

                {/* Extra Info */}
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isDisabled}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Client Occupation / Business Activity</Form.Label>
                  <Form.Control
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    disabled={isDisabled}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Opponent Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    maxLength="2000"
                    value={opponentDetails}
                    onChange={(e) => setOpponentDetails(e.target.value)}
                    disabled={isDisabled}
                  />
                  <Form.Text className="text-end">
                    {opponentDetails.length}/2000
                  </Form.Text>
                </Form.Group>

                {/* Legal Service Dropdown */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Legal Service Required{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Dropdown className="w-100">
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="dropdown-legal-service"
                        className="w-100 text-start d-flex justify-content-between align-items-center pe-3"
                        disabled={isDisabled}
                      >
                        <span>
                          {legalService !== "" && legalService !== "Select"
                            ? legalService
                            : "Select"}
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100">
                        <Dropdown.Item
                          onClick={() => setLegalService("Consultation")}
                        >
                          Consultation
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setLegalService("Representation")}
                        >
                          Representation
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </InputGroup>
                </Form.Group>

                {/* Practice Area Dropdown */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Practice Area <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Dropdown className="w-100">
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        id="dropdown-practice-area"
                        className="w-100 text-start d-flex justify-content-between align-items-center pe-3"
                        disabled={isDisabled}
                      >
                        <span>
                          {practiceArea !== "" && practiceArea !== "Select"
                            ? practiceArea
                            : "Select"}
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100">
                        <Dropdown.Item
                          onClick={() => setPracticeArea("Civil Law")}
                        >
                          Civil Law
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPracticeArea("Corporate Law")}
                        >
                          Corporate Law
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setPracticeArea("Criminal Law")}
                        >
                          Criminal Law
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Details on Service Required{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    maxLength="2000"
                    value={serviceDetails}
                    onChange={(e) => setServiceDetails(e.target.value)}
                    required
                    disabled={isDisabled}
                  />
                  <Form.Text className="text-end">
                    {serviceDetails.length}/2000
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Desired Outcome / Suggested Action{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    maxLength="2000"
                    value={desiredOutcome}
                    onChange={(e) => setDesiredOutcome(e.target.value)}
                    required
                    disabled={isDisabled}
                  />
                  <Form.Text className="text-end">
                    {desiredOutcome.length}/2000
                  </Form.Text>
                </Form.Group>

                {/* File Upload */}
                <Form.Group className="mb-3">
                  <Form.Label>Relevant Documents</Form.Label>
                  <Card className="border-dashed p-4 text-center">
                    <Card.Body
                      className="p-4 text-center"
                      style={{ cursor: "pointer", border: "2px dashed #ccc" }}
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
                        className={`d-block ${files.length >= 5 || isDisabled ? "text-muted" : ""
                          }`}
                      >
                        <i className="bi bi-upload fs-2"></i>
                        <br />
                        <span className="text-primary text-decoration-underline">
                          {files.length >= 5
                            ? "Maximum files selected"
                            : "Choose files to upload"}
                        </span>{" "}
                        {!files.length >= 5 && "or drag and drop here"}
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
                              <span className="text-break w-100">
                                {file.name}
                              </span>
                              {isDisabled &&
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger align-self-end align-self-sm-center"
                                  onClick={() => fetchSignedUrl(file.path)}
                                >
                                  download
                                </button>
                              }
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
                          {files.length} file{files.length !== 1 && "s"}{" "}
                          selected
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
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-3 mb-2"
                  disabled={isDisabled}
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
