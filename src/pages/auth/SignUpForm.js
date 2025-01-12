import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/SignUpform.module.css";
import appStyles from "../../App.module.css";
import { Form, Button, Col, Row, Container, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { useCurrentUser } from "../../contexts/CurrentUserContext";


/**Function Handles user registration */
const SignUpForm = () => {
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
    });
    const { username, password1, password2 } = signUpData;
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    

    /*
    Handles changes to input fields
     */
    const handleChange = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value,
        })
    }

    /** Handles form submit for Signup page */
    const handleSubmit = async (event) => {
      event.preventDefault();

      const newErrors = {};
      if (!username.trim()) {
        newErrors.username = ["Username is required"];
      }
      if (!password1) {
        newErrors.password1 = ["Password is required"];
      }
      if (!password2) {
        newErrors.password2 = ["Please confirm your password"];
      }
      if (password1 !== password2) {
        newErrors.password2 = ["Passwords do not match"];
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        await axios.post("/dj-rest-auth/registration/", signUpData);
        setShowModal(true);
      } catch (err) {
        setErrors(err.response?.data || {});
      }
    };

    /**Handle modal close */
    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/login");
    };

     // Redirect if user is already logged in
     useEffect(() => {
        if (currentUser) {
          navigate('/login');
        }
      }, [currentUser, navigate]);

    /**Returns signup form
     */
    return (
        <Row className="d-flex justify-content-center align-items-center min-vh-100">
          <Col xs={12} md={8} lg={6}>
            <Container className={`${styles.Form} shadow-lg p-5`}>
              <h1 className={`${appStyles.Header} mb-4`}>Create an Account</h1>
              <Form onSubmit={handleSubmit}>
                {showModal && (
                  <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your account has been created successfully!</Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" onClick={handleCloseModal}>
                        Go to Login
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )}
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="text-start">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter a unique username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    className={`rounded-pill ${errors.username ? "is-invalid" : ""}`}
                  />
                </Form.Group>
                {errors.username?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
    
                <Form.Group className="mb-3" controlId="password1">
                  <Form.Label className="text-start">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password1"
                    value={password1}
                    onChange={handleChange}
                    className={`rounded-pill ${errors.username ? "is-invalid" : ""}`}
                  />
                </Form.Group>
                {errors.password1?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
    
                <Form.Group className="mb-4" controlId="password2">
                  <Form.Label className="text-start">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Re-enter your password"
                    name="password2"
                    value={password2}
                    onChange={handleChange}
                    className={`rounded-pill ${errors.username ? "is-invalid" : ""}`}
                  />
                </Form.Group>
                {errors.password2?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
    
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 rounded-pill py-2"
                >
                  Sign Up
                </Button>
    
                {errors.non_field_errors?.map((message, idx) => (
                  <Alert variant="danger" key={idx} className="mt-3">
                    {message}
                  </Alert>
                ))}
              </Form>
              <div className="mt-4 text-center">
                Already have an account?{" "}
                <Link className={styles.Link} to="/login">
                  <span className="text-primary fw-bold">Login</span>
                </Link>
              </div>
            </Container>
          </Col>
        </Row>
      );
};

export default SignUpForm;
