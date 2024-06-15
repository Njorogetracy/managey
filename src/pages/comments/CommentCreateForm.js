import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import styles from '../../styles/CommentCreate.module.css';
import Avatar from '../../components/Avatar';
import { axiosRes } from '../../api/axiosDefaults';

function CommentCreateForm(props) {
    const { task, setTask, setComments, profile_id, profile_image} = props;
    const [comment, setComment] = useState('');

    /**handle change to input field */
    const handleChange = (e) => {
        setComment(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axiosRes.post('/comments/', {
                comment,
                task,
            })
            setComments((prevComments) => ({
                ...prevComments,
                results: [data, ...prevComments.results],
            }));
            setTask((prevPost) => ({
                results: [
                  {
                    ...prevPost.results[0],
                    comments_count: prevPost.results[0].comments_count + 1,
                  },
                ],
            }));
            setComment('')
        } catch (error) {
            console.log(error)
        }    
    }


    return (
        <Form className={`${styles.Form} ml-auto `} onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Link to={`/profiles/${profile_id}`} >
                        <Avatar src={profile_image} />
                    </Link>
                    <Form.Control
                        placeholder='my comment...'
                        as='textarea'
                        rows={2}
                        value={comment}
                        onChange={handleChange}
                        aria-label='comment box'
                    />
                </InputGroup>
            </Form.Group>
            <Button 
                className={`${styles.Button} btn d-block ms-auto`}
                type='submit'
                disabled={!comment.trim()}
            >
                Post
            </Button>
        </Form>
    )
}

export default CommentCreateForm