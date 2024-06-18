import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../../contexts/CurrentUserContext';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { axiosRes } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';

const UsernameForm = () => {

    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { id } = useParams();

    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();


    useEffect(() => {
        if (currentUser?.profile_id?.toString() === id) {
            setUsername(currentUser.username);
        } else {
            navigate('/home')
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


    return (
        <Row className= "justify-content-md-center" >
            <Col md={6}>
                <h1 className="text-center">Edit Username</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                        <Form.Label>New Username</Form.Label>
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
            </Col>
        </Row>
    )
}

export default UsernameForm