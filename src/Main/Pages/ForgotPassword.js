import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "./ForgotPassword.css";
import logo from "../Pages/Images/logo.png";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`A reset password link has been sent to ${email}`);
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

            <h2 className="screenHeader-text-forget text-center"  style={{ fontSize: 24, }}>Forgot Password</h2>

            <Form onSubmit={handleSubmit} className="p-4 d-flex flex-column align-items-center w-100">
              <Form.Group className="mb-3 form-group-forget w-100">
                <Form.Label className="form-label-forget"  style={{ color: "grey" }}>Email</Form.Label>
                <div className="input-group">
                  <div className="input-group-text">
                    <FaEnvelope color="#18273e" />
                  </div>
                  <Form.Control
                    type="email"
                    className="form-control "
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Button type="submit" variant="dark" className="custom-button-forget">
                Submit
              </Button>

              <p className="reset-password-link text-center mt-4 fs-5" style={{fontSize: 24,}} >
                <Link to="/reset-password" className="text-decoration-none">
                  Reset Password
                </Link>
              </p>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
