import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/SignUpform.module.css";
import appStyles from "../../App.module.css";
import axios from "axios";
import { useCurrentUser, useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { toast } from "react-toastify";
import { setTokenTimestamp } from "../../utils/utils";

/**Handles user login */
function LoginForm() {
    const setCurrentUser = useSetCurrentUser();
    const currentUser = useCurrentUser();

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const { username, password } = loginData;
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    /*
    Handles changes to input fields
     */
    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    }

    /** Handles form submit for Login page */ 
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const { data } = await axios.post('/dj-rest-auth/login/', loginData)
    //         setCurrentUser(data.user);
    //         setTokenTimestamp(data);
    //         toast.success("Login successful", {
    //             position: 'top-right',
    //             autoClose: 3000,
    //         });
    //         navigate('/tasks')
    //     } catch (err) {
    //         setErrors(err.response?.data || {});
    //         toast.error("Login failed. Please check your credentials and try again.", {
    //             position: 'top-right',
    //             autoClose: 3000,
    //         });
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                '/dj-rest-auth/login/', 
                loginData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setCurrentUser(data.user);
            setTokenTimestamp(data);
            toast.success("Login successful", {
                position: 'top-right',
                autoClose: 3000,
            });
            navigate('/tasks');
        } catch (err) {
            setErrors(err.response?.data || {});
            toast.error("Login failed. Please check your credentials and try again.", {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };
    

    // Redirect if user is already logged in
    useEffect(() => {
        if (currentUser) {
          navigate('/tasks/');
        }
      }, [currentUser, navigate]);

    return (
        <Row className={styles.Row}>
            <Col className="col-sm-6 mx-auto" md={6}>
                <Container className={`${styles.Form} p-5 `}>
                    <h1 className={appStyles.Header}>Login</h1>
                    <Form onSubmit={handleSubmit} >
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" name="username" value={username} onChange={handleChange} />
                        </Form.Group>
                        {errors.username?.map((message, idx) =>
                            <Alert variant="warning" key={idx}>{message}</Alert>
                        )}
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="d-none" >Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.password?.map((message, idx) =>
                            <Alert variant="warning" key={idx}>{message}</Alert>
                        )}
                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                        {errors.non_field_errors?.map((message, idx) =>
                            <Alert variant="warning" key={idx}>{message}</Alert>
                        )}
                    </Form>
                    <Link className={styles.Link} to="/signup">
                        No account yet? <span>Sign up now!</span>
                    </Link>
                </Container>
            </Col>
        </Row>
    );
}

export default LoginForm;
