import React, { useState } from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from '../../styles/CommentCreate.module.css';
import { axiosRes } from '../../api/axiosDefaults';

/**The functions to handle add comments
 * updates the comment count to task and 
 * displays the comments 
 */
function CommentCreateForm(props) {
    const { task, setTask, setComments, profile_id, profile_image } = props;
    const [content, setContent] = useState("");

    /**handle change to input field */
    const handleChange = (e) => {
        setContent(e.target.value);
    }

    /**Handle comment submission */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axiosRes.post("/comments/", {
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
                        comments_count: (prevTask.results[0].comments_count || 0) + 1,
                    },
                ],
            }));
            setContent("");
            toast.success("Comment posted");
        } catch (error) {
            toast.error("Failed to post comment");
        }
    }


    /**Returns comment form */
    return (
        <Form className="mt-2" style={{backgroundColor: '#f5f5f5'}} onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Form.Control
                        placeholder='my comment...'
                        as='textarea'
                        rows={2}
                        value={content}
                        onChange={handleChange}
                        aria-label='comment box'
                        className="border-0 flex-grow-1" 
                        style={{ minWidth: 0, backgroundColor: '#f5f5f5' }}
                    />
                </InputGroup>
            </Form.Group>
            <Button
                className={`${styles.Button} btn d-block ms-auto`}
                type='submit'
                disabled={!content || !content.trim()}
            >
                Post
            </Button>
        </Form>
    )
}

export default CommentCreateForm