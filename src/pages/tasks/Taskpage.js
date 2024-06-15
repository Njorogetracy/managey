import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import Task from './Task';
import CommentCreateForm from '../comments/CommentCreateForm';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import styles from '../../styles/CommentCreate.module.css';
import Comment from '../comments/Comment';

function Taskpage() {
    const { id } = useParams()
    const [task, setTask] = useState({ results: [] });
    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;
    const [comments, setComments] = useState({ results: [] });

    /**Fetch task  by id */
    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{ data: task }, { data: comments }] = await Promise.all([
                    axiosReq.get(`/tasks/${id}`),
                    axiosReq.get(`/comments/?task=${id}`)
                ]);
                setTask({ results: [task] });
                setComments(comments)
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
                <Container className={`${styles.Form}`} >
                    {currentUser ? (
                        <CommentCreateForm profile_id={currentUser.profile_id} profileImage={profile_image} task={id} setTask={setTask} setComments={setComments} />
                    ) : comments.results.length ? ('Comments'
                    ) : null}
                    {comments.results.length ? (
                        comments.results.map(comment => (
                            <Comment
                                key={comment.id} 
                                {...comment}
                                setTask={setTask}
                                setComments={setComments}
                             />
                        ))
                    ) : currentUser ? (
                        <span>No comments</span>
                    ) : (
                        <span>No comments...</span>
                    )}
                </Container>
            </Col>
        </Row>
    );
}

export default Taskpage