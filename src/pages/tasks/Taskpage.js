import React, { useEffect, useState } from 'react'
import { Card, Button, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';

function Taskpage() {
    const {id} = useParams()
    const [tasks, setTasks] = useState({results: [], loading: true});

    /**Fetch tasks */
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const[ {data: task}] = await Promise.all([
                    axiosReq.get(`/tasks/${id}`),
                ])
                setTasks({data: [task]})
                console.log(task)
            } catch (error) {
                console.log(error, 'error fetching tasks')
            }
        };
        fetchTasks()
    }, [id])

    return (
        <Container>
            <Row>
                <Card style={{ width: '18rem', margin: '10px' }}>
                    <Card.Body>
                        <Card.Title>Title</Card.Title>
                        <Card.Text>detail</Card.Text>
                        <Card.Text>
                            <small className="text-muted">Last updated:</small>
                        </Card.Text>
                        <Card.Text>
                            <small className="text-muted">Assigned to: </small>
                        </Card.Text>
                        <Button variant="primary" size="sm" className="mr-2">
                            edit
                        </Button>
                        <Button variant="danger" size="sm">
                            delete
                        </Button>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    );
}

export default Taskpage