import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import styles from "../../styles/SignUpform.module.css";
import btnStyles from '../../styles/Button.module.css'
import { Form, Col, Button, Alert, Row, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosReq } from '../../api/axiosDefaults';


/**Handles creating of task */
function TaskCreateForm() {

    /**Fetch task fields */
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        assigned_users: [],
        priority: "",
        state: "",
        attachment: "",
        due_date: "",
    });

    const { title, description, priority, state, attachment, due_date } = taskData;
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [assignedUser, setAssignedUser] = useState([]);
    const imageInput = useRef(null);
    const [errors, setErrors] = useState({});

    /**Priority colour options */
    const priorityOptions = [
        { value: 'Low', label: 'Low', icon: <FontAwesomeIcon icon={faCircle} style={{ color: "#FFD43B", }} /> },
        { value: 'Medium', label: 'Medium', icon: <FontAwesomeIcon icon={faCircle} style={{ color: "#e2763c", }} /> },
        { value: 'High', label: 'High', icon: <FontAwesomeIcon icon={faCircle} style={{ color: "#ee1111", }} /> },
    ];

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
        setAssignedUser(selectedOptions);
    };

    /**Handles change for the priority options */
    const handlePriorityChange = selectedOption => {
        setTaskData({
            ...taskData,
            priority: selectedOption.value
        });
    };

    /**Handles change to attachment field */
    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            setTaskData({
                ...taskData,
                attachment: (event.target.files[0]),
            });
        }
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
                // console.log(error)
                setUsers([])
            })
    }, []);


    /**Handles form submission */
    const handleSubmitForm = async (e) => {
        e.preventDefault()
        const formData = new FormData();

        /**Validation for required fields */
        let validationErrors = {};
        if (!title) validationErrors.title = ['Title is required.'];
        if (!description) validationErrors.description = ['Description is required.'];
        if (assignedUser.length === 0) validationErrors.assigned_users = ['At least one assigned user is required.'];
        if (!due_date) validationErrors.due_date = ['Due date is required.'];

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        formData.append('title', title)
        formData.append('description', description)
        formData.append('priority', priority)
        formData.append('state', state)
        formData.append('attachment', attachment)
        formData.append('due_date', due_date)
        assignedUser.forEach(userId => {
            formData.append('assigned_users', userId);
        });

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
            // console.log(err)
            if (err.response?.status !== 401) {
                setErrors(err.response?.data)
            }
        }
    }

    /**Task form fields */
    const textFields = (
        <div className="text-center">
            <Form.Group className='mb-3' >
                <Form.Label className="d-none" >Title</Form.Label>
                <Form.Control placeholder='Title' name='title' aria-label='title' value={title} onChange={handleFormChange} />
            </Form.Group>
            {errors.title?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
            <Form.Group className="mb-3" >
                <Form.Label className="d-none">Task description</Form.Label>
                <Form.Control placeholder='Task description' as="textarea" rows={6} aria-label='description' name='description' value={description} onChange={handleFormChange} />
            </Form.Group>
            {errors.description?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
            <Form.Group className="mb-3" >
                <Form.Label className="d-none">Assigned to</Form.Label>
                <Form.Control
                    as="select"
                    aria-label='assigned_user'
                    name='assigned_user'
                    value={assignedUser}
                    onChange={handleChangeUser}
                >
                    <option value='' >Assign Task</option>
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
            {errors.assigned_users?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
            <Form.Group className="mb-3">
                <Form.Label className="d-none">Priority</Form.Label>
                <Select
                    value={priority}
                    onChange={handlePriorityChange}
                    options={priorityOptions}
                    formatOptionLabel={option => (
                        <div className={styles.OptionLabel}>
                            {option.icon} {option.label}
                        </div>
                    )}
                    classNamePrefix="react-select"
                    placeholder="Select priority"
                    styles={{
                        control: provided => ({
                            ...provided,
                            textAlign: 'left',
                        }),
                        placeholder: provided => ({
                            ...provided,
                            textAlign: 'left',
                        }),
                    }}
                />
            </Form.Group>
            {errors.priority?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
            <Form.Group className="mb-3">
                <Form.Label className="d-none">State</Form.Label>
                <Form.Select placeholder='status' aria-label="sate" onChange={handleFormChange} value={state}>
                    <option value="1">Not started</option>
                    <option value="2">To-do</option>
                    <option value="3">In-progress</option>
                    <option value="3">Completed</option>
                </Form.Select>
            </Form.Group>
            {errors.state?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
            <Form.Group className="mb-3">
                <Form.Label className="d-none" htmlFor="image-upload">Attach Image</Form.Label>
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
            {errors.attachment?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
            <Form.Group className="mb-3">
                <Form.Label htmlFor='current-date' className="d-none">Due date</Form.Label>
                <Form.Control
                    name="due_date"
                    type="datetime-local"
                    aria-label="due_date"
                    onChange={handleFormChange}
                    value={due_date}
                    min={new Date().toISOString().slice(0, 16)}
                ></Form.Control>
            </Form.Group>
            {errors.due_date?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
           
            <Button className={btnStyles.Button} type="submit" value="Submit">Create</Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Secondary}`} onClick={handleGoBack}>
                Cancel
            </Button>
        </div>
    );

    /**returns the task create form */
    return (
        <Row>
            <Col className="col-sm-6 mx-auto" md={6} lg={6}>
                <Container className={`${styles.Form} p-5 `}>
                    <h3>Create a New Task</h3>
                    <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
                        <div>{textFields}</div>
                    </Form>
                </Container>
            </Col>
        </Row>
    )
}

export default TaskCreateForm