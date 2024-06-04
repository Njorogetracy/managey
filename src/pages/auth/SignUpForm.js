import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "../../styles/SignUpform.module.css";
import appStyles from "../../App.module.css";

import { Form, Button, Col, Row, Container, Alert, Modal } from "react-bootstrap";
import axios from "axios";

const SignUpForm = () => {
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
    })
    const { username, password1, password2 } = signUpData;
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

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
        try {
            await axios.post("/dj-rest-auth/registration/", signUpData);
            setShowModal(true);
        } catch (err) {
            setErrors(err.response?.data);
        }
    };

    /**Handle modal close */
    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/login");
    };

    /**Returns signup form
     */
    return (
        <Row className={styles.Row}>
            <Col className="col-sm-6 mx-auto" md={6}>
                    <Container className={`${styles.Form} p-5 `}>
                        <h1 className={appStyles.Header}>Sign Up</h1>
                        <Form onSubmit={handleSubmit}>
                            {showModal && (
                                <Modal show={showModal} onHide={handleCloseModal} centered={true}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Successful</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Account Created Successfully!</Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                  </Button>
                                  <Button variant="primary" onClick={handleCloseModal}>
                                    Save Changes
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            )};
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label className="d-none">Username</Form.Label>
                                <Form.Control type="text" placeholder="Username" name="username" value={username} onChange={handleChange} />
                            </Form.Group>
                            {errors.username?.map((message, idx) =>
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            )}

                            <Form.Group className="mb-3" controlId="password1">
                                <Form.Label className="d-none" >Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    name="password1"
                                    value={password1}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {errors.password1?.map((message, idx) =>
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            )}
                            <Form.Group className="mb-3" controlId="password2">
                                <Form.Label className="d-none" > Confirm Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm Password" name="password2" value={password2} onChange={handleChange} />
                            </Form.Group>
                            {errors.password2?.map((message, idx) =>
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            )}
                            <Button variant="primary" type="submit">
                                Sign Up
                            </Button>
                            {errors.non_field_errors?.map((message, idx) =>
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            )}
                        </Form>
                        <Link className={styles.Link} to="/login">
                            Already have an account? <span>Login</span>
                        </Link>
                    </Container>
            </Col>
        </Row>
    );
};

export default SignUpForm;