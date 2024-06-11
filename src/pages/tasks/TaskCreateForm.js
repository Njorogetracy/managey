import React, { useEffect, useState } from 'react';
import { Form, Col, Button, Alert, } from 'react-bootstrap';
import formStyles from '../../styles/TaskCreateEditForm.css'
import appStyles from "../../App.module.css";
import { useNavigate } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import axios from 'axios';



function TaskCreateForm() {

    /**Fetch task fields */
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        assigned_users: [],
        overdue: "",
        priority: "",
        state: "",
        attachment: "",
        due_date: "",
    });

    const { title, description, assigned_users, overdue, priority, state, attachment, due_date } = taskData;
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [errors, setErrors] = useState({});

    /**Handles changes to the input fields */
    const handleFormChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value,
        })
    }

    /**Handles changes to the assigned users selection */
    const handleChangeUser = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setAssignedUsers(selectedOptions);
    };

    /**Fetch all profiles from the API */
    useEffect(() => {
        axios.get(`/profiles/`)
            .then(response => {
                console.log('Response data', response.data);
                if (typeof response.data === 'object' && !Array.isArray(response.data)) {
                    // Extract the array of user profiles from the dictionary
                    const profiles = response.data.results || [];
                    // Update the users state with the extracted profiles
                    setUsers(profiles);
                } else {
                    // If response data is not a dictionary, handle error
                    console.error('Invalid response data format');
                    setUsers([]); // Set users to an empty array
                }
            })
            .catch(error => {
                console.log(error, 'error fetching profiles')
                setUsers([])
            })
    }, []);

    /**Handles form submission */
    const handleSubmitForm = async (e) => {
        e.preventDefault()
        const formData = new FormData();

        formData.append('title', title)
        formData.append('description', description)
        formData.append('assigned_users', assigned_users)
        formData.append('overdue', overdue)
        formData.append('priority', priority)
        formData.append('state', state)
        formData.append('attachment', attachment)
        formData.append('due_date', due_date)

        try {
            const { data } = await axiosReq.post('/tasks/', formData);
            navigate(`/tasks/${data.id}`)
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
                    <option >Select a User</option>
                    {users.map((user) => {
                        /* Mapping over the users array to render options */
                        return (
                            <option key={user.id} value={user.id}>
                                {user.owner}
                                {/* Log each user ID to console for debugging */}
                                {console.log('User ID:', user.owner)}
                            </option>
                        );

                    })}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select aria-label="priority" onChange={handleFormChange} value={priority}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Select aria-label="sate" onChange={handleFormChange} value={state}>
                    <option value="1">Not started</option>
                    <option value="2">To-do</option>
                    <option value="3">In-progress</option>
                    <option value="3">Completed</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Attach Image</Form.Label>
                <Form.Control
                    name="attchment"
                    type="file"
                    aria-label="attachment"
                    onChange={handleFormChange}
                    value={attachment}
                ></Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Due date</Form.Label>

                <Form.Control
                    name="due_date"
                    type="date"
                    aria-label="due_date"
                    onChange={handleFormChange}
                    value={due_date}
                ></Form.Control>
            </Form.Group>
            <Form.Group >
                <Form.Label>Overdue</Form.Label>
                <Form.Check type='switch' aria-label='overdue' name='overdue' value={overdue} onChange={handleFormChange} />
            </Form.Group>
            <Button type="submit" value="Submit">Create</Button>
            <Button>Cancel</Button>

        </div>
    );

    /**returns the task create form */
    return (
        <Form onSubmit={handleSubmitForm} >
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