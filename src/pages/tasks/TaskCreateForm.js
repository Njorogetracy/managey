import React, {useState} from 'react';
import { Form, Col, Button, Row, Container } from 'react-bootstrap';
import formStyles from '../../styles/TaskCreateEditForm.css'
import appStyles from "../../App.module.css";

function TaskCreateForm() {

    /**Fetch task fields */
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        assigned_users: "",
        overdue: "",
        priority: "",
        state: "",
        attachment: "",
        due_date: "",
    });

    const {title, description, assigned_users, overdue, priority, state, attachment, due_date} = taskData;

    /**Handles changes to the input fields */
    const handleFormChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value,
        }) 
    }

    const textFields = (
        <div className={`${formStyles.div} text-center`}>
            <Form.Group >
                <Form.Label>Title</Form.Label>
                <Form.Control name='title' aria-label='title' value={title} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group >
                <Form.Label>Task description</Form.Label>
                <Form.Control as="textarea" rows={6} aria-label='description' name='description' value={description} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group >
                <Form.Label>Assigned to</Form.Label>
                <Form.Control as="select" aria-label='assigned_user' name='assigned_user' value={assigned_users} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select aria-label="priority" onChange={handleFormChange} value={priority}>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
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
                <Form.Label>Due date</Form.Label>

                <Form.Control
                    name="due_date"
                    type="date"
                    aria-label="due_date"
                    onChange={handleFormChange}
                    value={due_date}
                ></Form.Control>
            </Form.Group>
            <Form.Group className="position-relative mb-3">
                <Form.Label className="d-flex justify-content-center">Attach File</Form.Label>
                <Form.Control
                    type="file"
                    required
                    name="attachment"
                    onChange={handleFormChange}
                    value={attachment}
                />
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
        <Form className={formStyles.Form} >
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${formStyles.Container} d-flex flex-column justify-content-center`}
                    >
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={4} className=" d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    )
}

export default TaskCreateForm