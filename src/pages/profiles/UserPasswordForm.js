import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Form, Col, Button, Alert, Row, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { axiosRes } from '../../api/axiosDefaults';
import styles from "../../styles/SignUpform.module.css";
import btnStyles from '../../styles/Button.module.css'


/**function handles the use password update */
const UserPasswordForm = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const currentUser = useCurrentUser();
    const location = useLocation();

    const [userData, setUserData] = useState({
        new_password1: "",
        new_password2: "",
    });
    const { new_password1, new_password2 } = userData;

    const [errors, setErrors] = useState({});

    /**Handles input change in  passwords fields */
    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value,
        });
    };

    /**Redirect users to previous page */
    const handleGoBack = () => {
        navigate(location.state?.from || '/profiles')
    }

    /**Validate user is owner, otherwise redirect to homepage */
    useEffect(() => {
        if (currentUser?.pk?.toString() !== id) {
            navigate("/tasks");
        }
    }, [currentUser, navigate, id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosRes.post("/dj-rest-auth/password/change/", userData);
            toast.success("Password updated successfully", {
                position: 'top-right',
                autoClose: 3000,
            });
            navigate("/");
        } catch (err) {
            // console.log(err);
            setErrors(err.response?.data);
        }
    };

    return (
        <Row className={styles.Row} >
            <Col className="col-sm-6 mx-auto" md={6}>
                <Container className={`${styles.Form} p-5 `}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className='d-none' >New password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="new password"
                                value={new_password1}
                                onChange={handleChange}
                                name="new_password1"
                                required
                            />
                        </Form.Group>
                        {errors?.new_password1?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Form.Group className="mb-3" >
                            <Form.Label className='d-none' >Confirm password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="confirm password"
                                value={new_password2}
                                onChange={handleChange}
                                name="new_password2"
                                required
                            />
                        </Form.Group>
                        {errors?.new_password2?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Button className={`${btnStyles.Button} ${btnStyles.Secondary}`} onClick={handleGoBack}>
                            Cancel
                        </Button>
                        <Button className={btnStyles.Button} type="submit" value="Submit">Save</Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    )
}

export default UserPasswordForm