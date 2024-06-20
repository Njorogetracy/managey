import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import styles from '../../styles/CommentCreate.module.css';
import { axiosRes } from '../../api/axiosDefaults';

/**Handles comment updates */
function CommentEdit({ setComments, setEditComment, id, content }) {
    const [commentContent, setCommentContent] = useState(content);

    /**handle change to input field */
    const handleChange = (e) => {
        setCommentContent(e.target.value);
    };

    /**Handle comment submission */
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosRes.put(`/comments/${id}/`, {
                content: commentContent.trim(),
            });
            setComments((prevComments) => ({
                ...prevComments,
                results: prevComments.results.map((comment) => {
                    return comment.id === id
                        ? {
                            ...comment,
                            content: commentContent.trim(),
                            updated_at: "now",
                        }
                        : comment;
                }),
            }));
            setEditComment(false);
        } catch (error) {
            console.log(error.response.message)
            if (error.response) {
                console.error(error.response.data);
            }
        }
    }


    /**Returns comment form */
    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group className="pr-1">
                <Form.Control
                    as='textarea'
                    rows={2}
                    value={commentContent}
                    onChange={handleChange}
                />
            </Form.Group>
            <div className='text-right'>
                <Button
                    className={`${styles.Button} btn d-block ms-auto`}
                    type='button'
                    onClick={() => setEditComment(false)}
                >
                    Cancel
                </Button>
                <Button
                    className={`${styles.Button} btn d-block ms-auto`}
                    type='submit'
                    disabled={!content || !content.trim()}
                >
                    Save
                </Button>
            </div>
        </Form>
    )
}

export default CommentEdit