import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import styles from '../../styles/CommentCreate.module.css';
import Avatar from '../../components/Avatar';
import { axiosRes } from '../../api/axiosDefaults';

function CommentCreateForm(props) {
    const { task, setTask, setComments, profile_id, profile_image} = props;
    const [content, setContent] = useState('');

    /**handle change to input field */
    const handleChange = (e) => {
        setContent(e.target.value);
    }

    /**Handle comment submission */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const {data} = await axiosRes.post('/comments/', {
                content,
                task,
            })
            setComments((prevComments) => ({
                ...prevComments,
                results: [data, ...prevComments.results],
            }));
            setTask((prevTask) => ({
                results: [
                  {
                    ...prevTask.results[0],
                    comments_count: (prevTask.results[0].comments_count || 0 )+ 1,
                  },
                ],
            }));
            setContent("");
        } catch (error) {
            console.log(error.response.data)
        }    
    }


    /**Returns comment form */
    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Link to={`/profiles/${profile_id}`} >
                        <Avatar src={profile_image} />{"  "}
                    </Link>
                    <Form.Control
                        placeholder='my comment...'
                        as='textarea'
                        rows={2}
                        value={content}
                        onChange={handleChange}
                        aria-label='comment box'
                    />
                </InputGroup>
            </Form.Group>
            <Button 
                className={`${styles.Button} btn d-block ms-auto`}
                type='submit'
                disabled={!content.trim()}
            >
                Post
            </Button>
        </Form>
    )
}

export default CommentCreateForm