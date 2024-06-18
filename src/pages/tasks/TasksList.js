import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import Task from './Task';
import { Row, Col, Container, Button, Card, Form } from 'react-bootstrap';
import NoResults from '../../assets/no-results.png';
import Asset from '../../components/Asset.js';
import listStyles from '../../styles/TaskListPage.module.css';

function TasksList({ message, filter = " " }) {
    const [tasks, setTasks] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const [expandedTask, setExpandedTask] = useState(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [query, setQuery] = useState('');

    /** Fetch all the tasks */
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await axiosReq.get(`/tasks/?${filter}search=${query}`)
                setTasks(data)
                setHasLoaded(true)
            } catch (error) {
                console.log(error)
            }
        }
        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchTasks();
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [filter, query, pathname]);


    /**Navigate to another page to view more tasks  */
    useEffect(() => {
        if (Array.isArray(tasks) && tasks.length > 10) {
            navigate('/tasks');
        }
    }, [tasks, navigate]);

    /**Handles expand task to show task details */
    const handleTaskClick = (index) => {
        setExpandedTask(expandedTask === index ? null : index);
    };

    return (
        <Container className={listStyles.listpage}>
            <Row>
                <Col>
                    <i className={`fa-solid fa-magnifying-glass ${listStyles.SearchIcon}`}></i>
                    <Form
                        className={listStyles.SearchBar}
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <Form.Control
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            type="text"
                            className="mr-sm-2"
                            placeholder="Search tasks"
                        />
                    </Form>
                </Col>
            </Row>
            <Row>
                {hasLoaded ? (
                    tasks.results?.length ? (
                        tasks.results.map((task, index) => (
                            <Col key={task.id} md={6} lg={4} className="mb-4">
                                <Card className={listStyles.taskcard}>
                                    <Card.Header className={listStyles.cardheader}>
                                        <Button variant="link" onClick={() => handleTaskClick(index)}>
                                            {task.title}
                                        </Button>
                                    </Card.Header>
                                    {expandedTask === index && (
                                        <Card.Body className={listStyles.cardbody}>
                                            <div className={listStyles.expanded}>
                                                <Task key={task.id} {...task} setTasks={setTasks} />
                                            </div>
                                        </Card.Body>
                                    )}
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Container className="text-center my-5">
                            <Asset src={NoResults} message="No tasks available." />
                        </Container>
                    )
                ) : (
                    <Container className="text-center my-5">
                        <Asset spinner />
                    </Container>
                )}
            </Row>
          
        </Container>
    )
}

export default TasksList