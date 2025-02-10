import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/signupScreen.css";
import signupimg from "./Images/img.png";
import logo from "./Images/logo.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { replace, useNavigate } from "react-router-dom";

const SignUp_Screen = () => {
    const [profileImage, setProfileImage] = useState(null);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        address: "",
        contact: "",
        password: "",
        confirmPassword: "",
        bio: ""
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };
    const handleSignup = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("UserName", formData.fullName);
            formDataToSend.append("Email", formData.email);
            formDataToSend.append("Address", formData.address);
            formDataToSend.append("Role", "client");
            formDataToSend.append("Contact", formData.contact);
            formDataToSend.append("Password", formData.password);
            formDataToSend.append("Bio", formData.bio);
            formDataToSend.append("Language", "");
            formDataToSend.append("ImagePath", "");

            // Append Profile Image if exists
            if (formData.profileImage) {
                formDataToSend.append("ProfileImage", formData.profileImage);
            }

            const response = await fetch("http://localhost:5001/api/users/users", {
                method: "POST",
                body: formDataToSend, // No need for JSON.stringify when using FormData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful!");
                navigate("/",
                    { replace: true }
                )
                console.log("User registered:", data);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Signup failed. Please try again.");
        }
    };


    return (
        <Container fluid className="min-vh-100 d-flex align-items-center">
            <Row className="w-100 m-2 d-flex card" style={{ boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px rgba(0, 0, 0, 0.1)' }}
            >
                {/* Left Side: Legal Section */}
                <div className="d-flex m-0 p-0">
                    <Col md={6} className=" legal-group d-flex align-items-center justify-content-center">
                        <img src={signupimg} alt="Illustration" className="img-fluid" />
                    </Col>
                    {/* Right Side: Form Section */}
                    <Col md={6} className="d-flex  flex-column align-items-center justify-content-center">
                        {/* Logo */}
                        <Row className="mb-4 w-100 text-center">
                            <Col>
                                <img src={logo} alt="Logo" className="logo img-fluid" />
                            </Col>
                        </Row>

                        {/* Form */}
                        <Row className="w-100 px-4">
                            <Col>
                                <form onSubmit={handleSignup}>
                                    {/* Full Name */}
                                    <div className="form-group1">
                                        <label htmlFor="fullName">Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="far fa-user"></i>
                                            </span>
                                            <input type="text" id="fullName" className="form-control" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="form-group1">
                                        <label htmlFor="email">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="far fa-envelope"></i>
                                            </span>
                                            <input type="email" id="email" className="form-control" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="form-group1">
                                        <label htmlFor="address">Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </span>
                                            <input type="text" id="address" className="form-control" placeholder="Enter your address" value={formData.address} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Contact Number */}
                                    <div className="form-group1">
                                        <label htmlFor="contact">Contact</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-phone-alt"></i>
                                            </span>
                                            <input type="tel" id="contact" className="form-control" placeholder="Enter contact number" value={formData.contact} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="form-group1">
                                        <label htmlFor="password">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-lock"></i>
                                            </span>
                                            <input type="password" id="password" className="form-control" placeholder="Enter password" value={formData.password} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="form-group1">
                                        <label htmlFor="newPassword">Confirm Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-lock" style={{ opacity: 0.7 }}></i>
                                            </span>
                                            <input type="password" id="confirmPassword" className="form-control" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="form-BIO">
                                        <label htmlFor="bio">Bio</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="far fa-edit"></i>
                                            </span>
                                            <textarea id="bio" className="form-control" placeholder="Tell us about yourself" value={formData.bio} onChange={handleChange}></textarea>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center">
                                        <button type="submit" className="btn btn-primary">Sign Up</button>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                    </Col>
                </div>
            </Row>
        </Container>
    );
};

export default SignUp_Screen;
