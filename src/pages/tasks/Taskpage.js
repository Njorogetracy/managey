import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import Task from './Task';
import CommentCreateForm from '../comments/CommentCreateForm';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

function Taskpage() {
    const { id } = useParams()
    const [task, setTask] = useState({ results: [] });
    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;
    const [comments, setComments] = useState({results: []});

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
            <Row className="ms-auto">
                <Col>
                    <Task {...task.results[0]} setTasks={setTask} taskPage />
                    <Container >
                        {currentUser ? (
                            <CommentCreateForm profile_id={currentUser.profile_id} profileImage={profile_image} task={id} setTask={setTask} setComments={setComments} />
                        ) :  comments.results.length ? ('Comments'
                        ) : null}
                    </Container>
                </Col>
            </Row>
    );
}

export default Taskpage