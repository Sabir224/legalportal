import { Link, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./ForgotPassword.css";
import logo from "../Pages/Images/logo.png";
import { useNavigate } from "react-router-dom";
import { ApiEndPoint } from "./Component/utils/utlis";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false); // State to handle loading



  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator
    setError("")
    try {
      const response = await axios.get(`${ApiEndPoint}sendOptByEmail/${email}`);

      console.log("User Fetch", response.data);
      global.user = response.data.user;
      console.log(global.user);
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // Hide loading indicator after response
    }
  };



  return (
    <Container fluid className="forgot-password-container d-flex justify-content-center align-items-center">
      <Row className="w-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={10} lg={12} className="d-flex justify-content-center">
          <Card className="forgot-password-card shadow-lg p-5">
            <div className="text-center">
              <img src={logo} alt="App Logo"
                className="logo-forget mb-4"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginBottom: "20px",
                }}
              />
            </div>
            {/* Logo */}

            <h2 className="screenHeader-text-forget text-center" style={{ fontSize: 24, }}>Forgot Password</h2>

            <Form onSubmit={handleSubmit} className="p-4 d-flex flex-column align-items-center w-100">
              <Form.Group className="mb-3 form-group-forget w-100">
                <Form.Label className="form-label-forget" style={{ color: "grey" }}>Email</Form.Label>
                <div className="input-group">
                  <div className="input-group-text">
                    <FaEnvelope color="#18273e" />
                  </div>

                  <Form.Control
                    type="email"
                    className={`form-control ${error ? "is-invalid" : ""}`} // Add red border if error
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">{error}</div> {/* Error message like required */}

                </div>
              </Form.Group>

              <Button type="submit" variant="dark" className="custom-button-forget">
                Reset Password
              </Button>

              {loading && (
                <div className="popup-overlay-forget">
                  <div className="popup-forget">
                    <span className="spinner-forget"></span>
                    <p style={{color:'white'}}>Sending OTP...</p>
                  </div>
                </div>
              )}


              {/* <p className="reset-password-link text-center mt-4 fs-5" style={{fontSize: 24,}} >
                <Link to="/reset-password" className="text-decoration-none">
                  Reset Password
                </Link>
              </p> */}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
