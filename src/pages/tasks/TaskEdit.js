import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { axiosReq } from '../../api/axiosDefaults';
import axios from 'axios';
import styles from "../../styles/SignUpform.module.css";
import btnStyles from '../../styles/Button.module.css'
import { Form, Col, Button, Alert, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';


/**This function handles fetching user created task data 
 * handles task editing
 */
function TaskEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const imageInput = useRef(null);
    const [errors, setErrors] = useState({});
    const { id } = useParams();


     /**Fetch task fields */
     const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        assigned_users: "null",
        overdue: "",
        priority: "low",
        state: "",
        attachment: null,
        due_date: "",
    });

    const { title, description, assigned_users, overdue, priority, state, due_date } = taskData;

    /**Fetch tasks to edit */
    useEffect(() => {
        const handleEditTask = async () => {
            try {
                const { data } = await axiosReq.get(`/tasks/${id}/`)
                const { title, description, overdue, priority, state, due_date, assigned_users, attachment, is_owner } = data;
                const formattedDueDate = new Date(due_date).toISOString().slice(0, 16);

                is_owner ? setTaskData({ title, description, overdue, priority, state, attachment, due_date:formattedDueDate, assigned_users, }) : navigate('/');
            } catch (error) {
                console.log(error)
            }
        }
        handleEditTask();
    }, [navigate, id])

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
        const { name, value } = e.target;
        setTaskData((prev) => ({ ...prev, [name]: value }))
    }

    /**Handles changes to the assigned users selection */
    const handleChangeUser = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => parseInt(option.value, 10));
        setAssignedUsers(selectedOptions);
    };

    /**Handles change for the priority options */
    const handlePriorityChange = selectedOption => {
        setTaskData({
            ...taskData,
            priority: selectedOption.value,
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
                console.log(error)
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

        if (imageInput?.current?.files[0]) {
            formData.append("attachment", imageInput.current.files[0]);
        }

        if (due_date !== null && due_date !== "") {
            formData.append("due_date", due_date);
        }

        if (assignedUsers !== null && assigned_users !== "No one") {
            assignedUsers.forEach(userId => {
                formData.append('assigned_users', userId);
            });
        }
    }

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
                    value={assignedUsers}
                    onChange={handleChangeUser}
                >
                    <option value='' >Select a user</option>
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
                    value={priorityOptions.find(option => option.value === priority)}
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
                ></Form.Control>
            </Form.Group>
            {errors.due_date?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
            <Form.Group className="mb-3">
                <Form.Label>Overdue</Form.Label>
                <Form.Check type='switch' aria-label='overdue' name='overdue' value={overdue} onChange={handleFormChange} />
            </Form.Group>
            {errors.overdue?.map((message, idx) => (
                <Alert variant='warning' key={idx}>{message}</Alert>
            ))}
            <Button className={btnStyles.Button} type="submit" value="Submit">Save</Button>
            <Button className={`${btnStyles.Button} ${btnStyles.Secondary}`} onClick={handleGoBack}>
                Cancel
            </Button>
        </div>
    );

    /**returns the task create form */
    return (
        <Row>
            <Col className="col-sm-6 mx-auto" md={6} lg={6}>
                <div className={`${styles.Form} p-5 `}>
                    <h3>Create a New Task</h3>
                    <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
                        <div>{textFields}</div>
                    </Form>
                </div>
            </Col>
        </Row>
    )
}

export default TaskEdit