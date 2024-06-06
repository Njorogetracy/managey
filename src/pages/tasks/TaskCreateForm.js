import React from 'react';
import { Form, Col, Button, Row, Container } from 'react-bootstrap';
import styles from '../../App.module.css';
import appStyles from "../../App.module.css";

function TaskCreateForm() {

    /**Fetch task fields */
    // const [taskData, setTaskData] = useState({
    //     title: "",
    //     description: "",
    //     assigned_users: "",
    //     overdue: "",
    //     priority: "",
    //     state: "",
    //     attachment: "",
    //     due_date: "",
    // });

    // const {title, description, assigned_users, overdue, priority, state, attachment, due_date} = taskData;

    const textFields = (
        <div className='text-center'>
            <Form.Group >
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="task title" aria-label='title' />
            </Form.Group>
            <Form.Group >
                <Form.Label>Task description</Form.Label>
                <Form.Control as="textarea" aria-label='description' name='description' />
            </Form.Group>
            <Form.Group >
                <Form.Label>Assigned to</Form.Label>
                <Form.Control as="select" aria-label='assigned_user' name='assigned_user' />
            </Form.Group>
            <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select aria-label="priority">
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Select aria-label="sate">
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
                ></Form.Control>
            </Form.Group>
            <Form.Group className="position-relative mb-3">
                <Form.Label className="d-flex justify-content-center">Attach File</Form.Label>
                <Form.Control
                    type="file"
                    required
                    name="attachment"
                />
            </Form.Group>
            <Form.Group >
                <Form.Label>Overdue</Form.Label>
                <Form.Check type='switch' aria-label='overdue' name='overdue' />
            </Form.Group>
            <Button type="submit" value="Submit">Create</Button>
            <Button>Cancel</Button>

        </div>
    );

    /**returns the task create form */
    return (
        <Form className={styles.Form} >
            <Row>
                {/* <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container
                        className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
                    >
                        <div className="d-md-none">{textFields}</div>
                    </Container>
                </Col> */}
                <Col md={5} lg={4} className=" d-md-block p-0 p-md-2">
                    <Container className={appStyles.Content}>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    )
}

export default TaskCreateForm