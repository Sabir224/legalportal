import React, { useEffect, useState } from "react";
import { BsPerson, BsLock } from "react-icons/bs";
import Logo from "../Pages/Images/logo.png";
import ilustration from "../Pages/Images/as.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { ApiEndPoint } from "./Component/utils/utlis";
import backgroundImage from "../Pages/Images/bg.jpg";
import { useCookies } from "react-cookie";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const jwtToken = sessionStorage.getItem("jwtToken");
  const isTabletOrSmaller = useMediaQuery({ maxWidth: 992 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const handleNavigation = async (e) => {
    console.log("Clicked on Button");
    e.preventDefault(); // Prevent page reload
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${ApiEndPoint}loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        setCookie("token", data.token, {
          path: "/",
          secure: false, // Set to `true` in production with HTTPS
          sameSite: "lax",
        });

        console.log("Token stored in cookies:", data.token);

        // Wait for token to be stored in cookies
        setTimeout(() => {
          navigate("/Dashboards", { replace: true });
        }, 2000); // Small delay to ensure token is available before navigation
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set background image
        backgroundSize: "100%", // Cover entire div
        height: "100vh",
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // Prevent tiling
      }}
    >
      <div
        style={{
          height: "95vh", // Adjust height to account for the margin
          width: "95vw", // Adjust width to account for the margin

          // margin: "20px", // Space around the container
          boxShadow: "0 0 14px rgba(0, 0, 0, 0.2)",
          backgroundColor: isTabletOrSmaller ? "#f3ebe9" : "white",
          backgroundImage: `url(${backgroundImage})`, // Set background image
          backgroundSize: "cover", // Cover entire div
          backgroundPosition: "center", // Center the image
          backgroundRepeat: "no-repeat", // Prevent tiling
        }}
      >
        <Container
          fluid
          style={{
            width: isTabletOrSmaller ? "90%" : "100%",
            height: "100%",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 0 14px rgba(0, 0, 0, 0.2)",
            padding: isTabletOrSmaller ? "20px" : "0px",
            overflow: "hidden", // Prevent inner scrolling
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Row style={{ height: "100%", justifyContent: "center" }}>
            {/* {!isTabletOrSmaller && (
            <Col
              sm={12}
              md={6}
              lg={6}
              className="d-flex align-items-stretch justify-content-center"
              style={{
                backgroundColor: "#18273e",
              }}
            >
              <div
                className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "100%", width: "100%" }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={ilustration}
                    alt="Login Illustration"
                    style={{
                      height: "100%", // Adjusts the height dynamically
                      width: "100%",
                      objectFit: "contain",
                      padding: "20px",
                    }}
                  />
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    fontSize: 24,
                    color: "grey",
                    letterSpacing: 4,
                  }}
                >
                  Ecco Bot
                </div>
              </div>
            </Col>
          )} */}
            <Col
              sm={12}
              md={isTabletOrSmaller ? 12 : 6}
              className={`d-flex flex-column justify-content-center ${
                isTabletOrSmaller ? "text-center" : ""
              }`}
            >
              <div className="d-flex justify-content-center mb-3">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    marginBottom: "20px",
                  }}
                />
              </div>
              <div
                className="text-center mb-3"
                style={{
                  letterSpacing: 1,
                  fontSize: 24,
                  color: "#18273e",
                }}
              >
                Sign In
              </div>
              <Form>
                <Form.Group className="mb-3 text-start">
                  <Form.Label style={{ color: "grey" }}>Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text ">
                      <BsPerson color="#18273e" />
                    </span>
                    <Form.Control
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="email"
                      placeholder="Enter Email"
                      type="text"
                      className={`form-control ${error ? "is-invalid" : ""}`}
                      required
                      // className="form-control-lg "
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3 text-start">
                  <Form.Label style={{ color: "grey" }}>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text ">
                      <BsLock color="#18273e" />
                    </span>
                    <Form.Control
                      value={password}
                      className={`form-control ${error ? "is-invalid" : ""}`} // Add red border if error
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      placeholder="Enter Password"
                      type="password"
                      required
                      // className="form-control-lg "
                    />
                    <div className="invalid-feedback">{error}</div>{" "}
                    {/* Error message like required */}
                  </div>
                </Form.Group>
                <div style={{ textAlign: "center" }}>
                  <Button
                    className="btn btn-primary mt-3 border border-none"
                    onClick={handleNavigation}
                    style={{
                      backgroundColor: "#18273e",
                      width: "150px",
                      borderRadius: "6px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#d4af37";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#18273e";
                    }}
                  >
                    Sign in
                  </Button>
                </div>
              </Form>
              {errorMessage && (
                <p className="text-danger mt-2">{errorMessage}</p>
              )}
              <div className="mt-3 text-center" style={{ fontSize: 24 }}>
                <Link className="text-muted" to="/forget-password">
                  Forgot password?
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default SignIn;
