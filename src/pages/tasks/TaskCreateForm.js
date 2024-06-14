import React, { useEffect, useRef, useState } from 'react';
import { Form, Col, Button, Alert } from 'react-bootstrap';
import formStyles from '../../styles/TaskCreateEditForm.css'
import appStyles from "../../App.module.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import axios from 'axios';
import { toast } from 'react-toastify';



function TaskCreateForm() {

    /**Fetch task fields */
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        assigned_users:[],
        overdue: "",
        priority: "",
        state: "",
        attachment: "",
        due_date: "",
    });

    const { title, description, overdue, priority, state, attachment, due_date } = taskData;
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const imageInput = useRef(null);
    const [errors, setErrors] = useState({});

    /**Redirect users to previous page */
    const handleGoBack = () => {
        navigate(location.state?.from || '/')
    }

    /**Handles changes to the input fields */
    const handleFormChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value,
        })
    }

    /**Handles changes to the assigned users selection */
    const handleChangeUser = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => parseInt(option.value, 10));
        setAssignedUsers(selectedOptions);
    };

    /**Fetch all profiles from the API */
    useEffect(() => {
        axios.get(`/profiles/`)
            .then(response => {
                if (typeof response.data === 'object' && !Array.isArray(response.data)) {
                    const profiles = response.data.results || [];
                    setUsers(profiles);
                } else {
                    setUsers([]);
                }
            })
            .catch(error => {
                console.log(error)
                setUsers([])
            })
    }, []);


    /**Handles change to attachment field */
    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            setTaskData({
                ...taskData,
                attachment: (event.target.files[0]),
            });
        }
    };


    /**Handles form submission */
    const handleSubmitForm = async (e) => {
        e.preventDefault()
        const formData = new FormData();

        /**Validation for required fields */
        let validationErrors = {};
        if (!title) validationErrors.title = ['Title is required.'];
        if (!description) validationErrors.description = ['Description is required.'];
        if (assignedUsers.length === 0) validationErrors.assigned_users = ['At least one assigned user is required.'];
        if (!due_date) validationErrors.due_date = ['Due date is required.'];

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        formData.append('title', title)
        formData.append('description', description)
        formData.append('overdue', overdue)
        formData.append('priority', priority)
        formData.append('state', state)
        formData.append('attachment', attachment)
        formData.append('due_date', due_date)
        // formData.append('assigned_users', JSON.stringify(assignedUsers));
        assignedUsers.forEach(userId => {
            formData.append('assigned_users', userId);
        });

        //for debugging
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            await axiosReq.post('/tasks/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success("Task created successfully", {
                position: 'top-right',
                autoClose: 3000,
            });
            navigate(`/tasks/`);
        } catch (err) {
            console.log(err)
            if (err.response?.status !== 401) {
                setErrors(err.response?.data)
            }
        }
    }

    const textFields = (
        <div className={`${formStyles.div} text-center`}>
            <Form.Group >
                <Form.Label>Title</Form.Label>
                <Form.Control name='title' aria-label='title' value={title} onChange={handleFormChange} />
            </Form.Group>
            {errors.title?.map((message, idx) =>
                <Alert variant='warning' key={idx}>{message}</Alert>
            )}
            <Form.Group >
                <Form.Label>Task description</Form.Label>
                <Form.Control as="textarea" rows={6} aria-label='description' name='description' value={description} onChange={handleFormChange} />
            </Form.Group>
            {errors.description?.map((message, idx) =>
                <Alert variant='warning' key={idx}>{message}</Alert>
            )}
            <Form.Group >
                <Form.Label>Assigned to</Form.Label>
                <Form.Control
                    as="select"
                    aria-label='assigned_user'
                    name='assigned_user'
                    value={assignedUsers}
                    onChange={handleChangeUser}
                >
                    <option value='' >Select a User</option>
                    {users && users.map((user) => {
                        return (
                            user && (
                            <option key={user.id} value={user.id}>
                                {user.owner}
                            </option>
                        ));
                    })}
                </Form.Control>
            </Form.Group>
            {errors.assigned_users?.map((message, idx) =>
                <Alert variant='warning' key={idx}>{message}</Alert>
            )}
            <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select aria-label="priority" onChange={handleFormChange} value={priority}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Form.Select>
            </Form.Group>
            {errors.priority?.map((message, idx) =>
                <Alert variant='warning' key={idx}>{message}</Alert>
            )}
            <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Select aria-label="sate" onChange={handleFormChange} value={state}>
                    <option value="1">Not started</option>
                    <option value="2">To-do</option>
                    <option value="3">In-progress</option>
                    <option value="3">Completed</option>
                </Form.Select>
            </Form.Group>
            {errors.state?.map((message, idx) =>
                <Alert variant='warning' key={idx}>{message}</Alert>
            )}
            <Form.Group>
                <Form.Label htmlFor="image-upload">Attach Image</Form.Label>
                <Form.Control
                    name="attachment"
                    id="image-upload"
                    type="file"
                    aria-label="attachment"
                    onChange={handleChangeImage}
                    accept='image/*'
                    ref={imageInput}
                ></Form.Control>
            </Form.Group>
            {errors.attachment?.map((message, idx) =>
                <Alert variant='warning' key={idx}>{message}</Alert>
            )}
            <Form.Group>
                <Form.Label>Due date</Form.Label>

                <Form.Control
                    name="due_date"
                    type="datetime-local"
                    aria-label="due_date"
                    onChange={handleFormChange}
                    value={due_date}
                ></Form.Control>
            </Form.Group>
            {errors.due_date?.map((message, idx) =>
                <Alert variant='warning' key={idx}>{message}</Alert>
            )}
            <Form.Group >
                <Form.Label>Overdue</Form.Label>
                <Form.Check type='switch' aria-label='overdue' name='overdue' value={overdue} onChange={handleFormChange} />
            </Form.Group>
            {errors.overdue?.map((message, idx) =>
                <Alert variant='warning' key={idx}>{message}</Alert>
            )}
            <Button type="submit" value="Submit">Create</Button>
            <Button onClick={handleGoBack}>
                Cancel
            </Button>
        </div>
    );

    /**returns the task create form */
    return (
        <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
            <div >
                <Col md={5} lg={4} >
                    <div className=" d-flex flex-column justify-content-center" >
                        <h3 >Create Task</h3>
                        <div className={appStyles.TextAlignCenter}>{textFields}</div>
                    </div>
                </Col>
            </div>
        </Form>
    )
}

export default TaskCreateForm