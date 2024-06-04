import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "../../styles/SignUpform.module.css";
import appStyles from "../../App.module.css";

import { Form, Button, Col, Row, Container, Alert } from "react-bootstrap";
import axios from "axios";

const SignUpForm = () => {
    const [signUpData, setSignUpData] = useState({
        username: "",
        password1: "",
        password2: "",
    })
    const {username, password1, password2} = signUpData;
    const [errors, setErrors] = useState({});
    const navigate= useNavigate();

    const handleChange = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("/dj-rest-auth/registration/", signUpData);
            navigate('/login');
        }catch(err){
            setErrors(err.response?.data);
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto py-2 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4 `}>
                    <h1 className={styles.Header}>Sign Up</h1>
                    <Form onSubmit={handleSubmit}>
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

                </Container>
                <Container className={`mt-3 ${appStyles.Content}`}>
                    <Link className={styles.Link} to="/login">
                        Already have an account? <span>Login</span>
                    </Link>
                </Container>
            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
            >
            </Col>
        </Row>
    );
};

export default SignUpForm;