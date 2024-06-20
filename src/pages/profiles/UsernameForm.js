import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../../contexts/CurrentUserContext';
import { Form, Row, Col, Button, Alert, Container } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';
import appStyles from "../../App.module.css";
import styles from "../../styles/SignUpform.module.css";

/**function handles the username update */
const UsernameForm = () => {

    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();

    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    /**Fetch currrent user username */
    useEffect(() => {
        if (currentUser?.profile_id?.toString() === id) {
            setUsername(currentUser.username);
        } else {
            navigate('/')
        }
    }, [currentUser, navigate, id])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosRes.put("/dj-rest-auth/user/", {
                username,
            });
            setCurrentUser((prevUser) => ({
                ...prevUser,
                username,
            }));
            toast.success("Username updated successfully", {
                position: 'top-right',
                autoClose: 3000,
            });
            navigate(`/profile/${id}`);
        } catch (err) {
            console.log(err);
            setErrors(err.response?.data);
        }
    };

    /**return form with username infomation */
    return (
        <Row className={styles.Row} >
            <Col className="col-sm-6 mx-auto" md={6}>
            <Container className={`${styles.Form} p-5 `}>
                <h2 className={appStyles.Header}>Edit Username</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3"  controlId="username">
                        <Form.Label className='d-none' >Change Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your new username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />
                    </Form.Group>
                    {errors?.username?.map((message, idx) => (
                        <Alert key={idx} variant="warning">
                            {message}
                        </Alert>
                    ))}
                    <Button variant="primary" type="submit" className="mt-3">
                        Save Username
                    </Button>
                </Form>
            </Container>
            </Col>
        </Row>
    )
}

export default UsernameForm