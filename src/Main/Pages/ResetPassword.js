import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaKey, FaLock } from "react-icons/fa";
import "./ResetPassword.css";
import logo from "../Pages/Images/logo.png";
import { ApiEndPoint } from "./Component/utils/utlis";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {



  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(global.user);
  const [email, setEmail] = useState(global.user.Email);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);


  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === user.otp) {
      setShowPasswordFields(true);
    } else {
      setError("Please enter correct OTP");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      // alert("Passwords do not match!");
      setError("Please enter correct OTP");
      return;
    } else {
      try {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
        const response = await axios.put(
          `${ApiEndPoint}updateUser/${email}/${newPassword}`
        );

        setMessage(response.data.message);
        navigate("/", { replace: true });

      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
      //alert("Password reset successfully!");
    }
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
                      // className="form-control-lg"
                      className={`form-control ${error ? "is-invalid" : ""}`} // Add red border if error

                    />
                    <div className="invalid-feedback">{error}</div>

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
                      <FaLock />
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
                <Button type="submit" variant="dark" className="custom-button-reset">
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
