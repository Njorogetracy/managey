import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import Task from './Task';

function Taskpage() {
    const { id } = useParams()
    const [task, setTask] = useState({ results: [] });

    /**Fetch task  by id */
    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{ data: task }] = await Promise.all([
                    axiosReq.get(`/tasks/${id}`),
                ]);
                setTask({ results: [task] });
                console.log('Task fetched:', task, 'at', new Date().toISOString());
            } catch (err) {
                console.log(err, 'error while fetching tasks');
            }
        };
        handleMount();
    }, [id])

    return (
        <Container>
            <Row>
                <Col>
                    <p>My tasks</p>
                    <Task {...task.results[0]} setTasks={setTask} taskPage />
                    <Container>comments</Container>
                </Col>
            </Row>
        </Container>
    );
}

export default Taskpage