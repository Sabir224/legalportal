import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaKey, FaLock } from "react-icons/fa";
import "./ResetPassword.css";
import logo from "../Pages/Images/logo.png";


const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const correctOtp = "123456"; // Simulated correct OTP

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === correctOtp) {
      setShowPasswordFields(true);
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password reset successfully!");
  };

  return (
    <Container fluid className="reset-password-container d-flex justify-content-center align-items-center">
      <Row className="w-100 d-flex justify-content-center align-items-center">
        <Col xs={12} md={10} lg={12} className="d-flex justify-content-center">
          <Card className="reset-password-card shadow-lg p-5">
            {/* Logo */}
            <div className="text-center">
              <img src={logo}
                alt="App Logo"
                className="logo-reset"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                  marginBottom: "20px",
                }} />
            </div>

            <h2 className="screenHeader-text-reset text-center">Reset Password</h2>
            <p className="simple-text-Reset text-center">
              {showPasswordFields ? "Enter your new password" : "Enter OTP and verify"}
            </p>

            {/* OTP Input Section (Hides after verification) */}
            {!showPasswordFields && (
              <Form onSubmit={handleOtpSubmit} className="p-3 w-100 d-flex flex-column align-items-center">
                <Form.Group className="mb-3 form-group-reset w-100">
                  <Form.Label className="form-label-reset" style={{ color: "grey" }}>Enter OTP</Form.Label>
                  <div className="input-group">
                    <div className="input-group-text">
                      <FaKey className="input-icon" />
                    </div>
                    <Form.Control
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="form-control-lg"
                    />
                  </div>
                </Form.Group>

                <Button type="submit" variant="dark" className="custom-button-reset">
                  Verify OTP
                </Button>
              </Form>
            )}

            {/* Password Reset Section (Appears After Correct OTP) */}
            {showPasswordFields && (
              <Form onSubmit={handlePasswordReset} className="p-3 w-100 d-flex flex-column align-items-center">
                <Form.Group className="mb-3 form-group w-100">
                  <Form.Label className="form-label-reset" style={{ color: "grey" }}>New Password</Form.Label>
                  <div className="input-group">
                    <div className="input-group-text">
                      <FaLock className="input-icon" />
                    </div>
                    <Form.Control
                      type="password"
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="form-control-lg"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3 form-group w-100">
                  <Form.Label className="form-label-reset" style={{ color: "grey" }}>Confirm Password</Form.Label>
                  <div className="input-group">
                    <div className="input-group-text">
                      <FaLock className="input-icon" />
                    </div>
                    <Form.Control
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="form-control-lg"
                    />
                  </div>
                </Form.Group>

                <Button type="submit" variant="dark" className="custom-button">
                  Reset Password
                </Button>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
