import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from '../../styles/CommentCreate.module.css';
import { axiosRes } from '../../api/axiosDefaults';

/**Handles comment updates */
function CommentEdit({ setComments, setEditComment, id, content, }) {
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
            toast.success("Comment updated");
            setEditComment(false);
        } catch (error) {
            toast.error("Failed to update comment");
        }
    }


    /**Returns comment form */
    return (
        <Form className={styles.EditForm} onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Control
                    as='textarea'
                    rows={2}
                    value={commentContent}
                    onChange={handleChange}
                    className={styles.ComposerInput}
                />
            </Form.Group>
            <div className={styles.EditActions}>
                <Button
                    className={styles.ButtonGhost}
                    type='button'
                    onClick={() => setEditComment(false)}
                >
                    Cancel
                </Button>
                <Button
                    className={styles.Button}
                    type='submit'
                    disabled={!commentContent || !commentContent.trim()}
                >
                    Save
                </Button>
            </div>
        </Form>
    )
}

export default CommentEdit