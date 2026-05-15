import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import styles from '../../styles/CommentCreate.module.css';
import { axiosRes } from '../../api/axiosDefaults';
import Avatar from '../../components/Avatar';

/**The functions to handle add comments
 * updates the comment count to task and
 * displays the comments
 */
function CommentCreateForm(props) {
    const { task, setTask, setComments, profile_image, owner } = props;
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
        <Form className={styles.Form} onSubmit={handleSubmit}>
            <div className={styles.ComposerAvatar}>
                <Avatar src={profile_image} text={owner} height={36} />
            </div>
            <div className={styles.ComposerBody}>
                <Form.Control
                    placeholder='Write a comment...'
                    as='textarea'
                    rows={2}
                    value={content}
                    onChange={handleChange}
                    aria-label='comment box'
                    className={styles.ComposerInput}
                />
                <div className={styles.ComposerActions}>
                    <Button
                        className={styles.Button}
                        type='submit'
                        disabled={!content || !content.trim()}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </Form>
    )
}

export default CommentCreateForm
