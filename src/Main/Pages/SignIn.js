import React, { useEffect, useState } from "react";
import { BsPerson, BsLock } from "react-icons/bs";
import Logo from "../Pages/Images/group.png";
import ilustration from "../Pages/Images/CHAT.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const jwtToken = sessionStorage.getItem("jwtToken");
    const isTabletOrSmaller = useMediaQuery({ maxWidth: 992 });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNavigation = async (e) => {
        console.log("Clicked on Button ")
           e.preventDefault(); // Prevent page reload
              setError("");
              setLoading(true);
        try {
            const response = await fetch("http://localhost:5001/api/users/loginUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email: email, Password: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert("Login Unsuccessful!");
                throw new Error(data.message || "Login failed");

            }
           
            // Save token in localStorage
            //      localStorage.setItem("token", data.token);
            alert("Login successful!");
            sessionStorage.setItem("Email", data.user.Email);
            // Redirect or update UI after login
            navigate("/Dashboards", {
                replace: true,
            })
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div
            style={{
                height: "calc(100vh - 40px)", // Adjust height to account for the margin
                width: "calc(100vw - 40px)", // Adjust width to account for the margin
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px", // Space around the container
                boxShadow: "0 0 14px rgba(0, 0, 0, 0.2)",
                backgroundColor: isTabletOrSmaller ? "#f3ebe9" : "white",
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
                <Row style={{ height: "100%" }}>
                    {!isTabletOrSmaller && (
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
                    )}
                    <Col
                        sm={12}
                        md={isTabletOrSmaller ? 12 : 6}
                        className={`d-flex flex-column justify-content-center ${isTabletOrSmaller ? "text-center" : ""
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
                                    <span className="input-group-text m-2">
                                        <BsPerson color="#18273e" />
                                    </span>
                                    <Form.Control
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        id="email"
                                        placeholder="Enter Email"
                                        type="text"
                                        className="form-control-lg m-2"
                                    />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3 text-start">
                                <Form.Label style={{ color: "grey" }}>Password</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text m-2">
                                        <BsLock color="#18273e" />
                                    </span>
                                    <Form.Control
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        id="password"
                                        placeholder="Enter Password"
                                        type="password"
                                        className="form-control-lg m-2"
                                    />
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
                        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
                        <div className="mt-3 text-center">
                            <Link className="text-muted font-size-13" to="/ForgetPassword">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="mt-3 text-center">
                            <Link className="text-muted font-size-13" to="/SignUp">
                            don't have account
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );

};
export default SignIn;
