import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/LoginForm.module.css";
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
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      // Client-side validation (keep this part as is)
    
      try {
        const { data } = await axios.post("/dj-rest-auth/login/", loginData);
        if (data.key) {
          localStorage.setItem("authToken", data.key);
          axios.defaults.headers.common["Authorization"] = `Token ${data.key}`;
    
          const userRes = await axios.get("/dj-rest-auth/user/");
          setCurrentUser(userRes.data);
    
          setTokenTimestamp(data);
          toast.success("Login successful", {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/tasks");
        } else {
          throw new Error("No authentication token received");
        }
      } catch (err) {
        setErrors(err.response?.data || {});
        toast.error(
          err.response?.data?.non_field_errors?.[0] ||
            "Login failed. Please check your username and password."
        );
      }
    };    


    // Redirect if user is already logged in
    useEffect(() => {
        if (currentUser) {
          navigate('/tasks/');
        }
      }, [currentUser, navigate]);

      return (
        <Row className="min-vh-100 d-flex justify-content-center align-items-center">
          <Col xs={12} md={6} lg={5}>
            <Container className={`${styles.FormContainer} shadow-lg p-5`}>
              <h1 className={`${appStyles.Header} mb-4 text-center text-primary`}>Welcome Back!</h1>
              <p className="text-muted text-center mb-4">Please log in to access your tasks.</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="text-start">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    className="rounded-pill"
                  />
                </Form.Group>
                {errors.username?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
    
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="text-start">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="rounded-pill"
                  />
                </Form.Group>
                {errors.password?.map((message, idx) => (
                  <Alert variant="warning" key={idx}>
                    {message}
                  </Alert>
                ))}
    
                <Button variant="primary" type="submit" className="w-100 rounded-pill py-2">
                  Login
                </Button>
                {errors.non_field_errors?.map((message, idx) => (
                  <Alert variant="danger" key={idx} className="mt-3">
                    {message}
                  </Alert>
                ))}
              </Form>
              <div className="text-center mt-4">
                Don’t have an account?{" "}
                <Link className={styles.Link} to="/signup">
                  <span className="text-primary fw-bold">Sign Up</span>
                </Link>
              </div>
            </Container>
          </Col>
        </Row>
      );
}

export default LoginForm;
