import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import styles from '../../styles/Comment.module.css';
import { Card } from 'react-bootstrap';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { DropDown } from '../../components/DropDown';
import { axiosRes } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';
import CommentEdit from './CommentEdit';

const Comment = (props) => {
  const {
    profile_id,
    profile_image,
    owner,
    updated_at,
    content,
    id,
    setTask,
    setComments,
  } = props

  const [editComment, setEditComment] = useState(false);
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}/`)
      toast.success("Comment deleted", {
        position: 'top-right',
        theme: 'colored',
        autoClose: 3000,
      });
      setTask((prevTask) => ({
        results: [
          {
            ...prevTask.results[0],
            comments_count: prevTask.results[0].comments_count - 1,
          },
        ],
      }));
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (error) {
      console.log(error)
    }
  }

  return (

    <div className={styles.Comment}>
    <hr className={styles.HorizontalRule} />
    <Card className={styles.Card}>
      <Link className={styles.ProfileLink} to={`/profiles/${profile_id}`}>
        <Avatar src={profile_image} />
        <span className={styles.Owner}>{owner}</span>
        <span className={styles.Date}>{updated_at}</span>
      </Link>
      <Card.Body className={styles.CommentBody}>
        {editComment ? (
          <CommentEdit
            id={id}
            profile_id={profile_id}
            content={content}
            profile_image={profile_image}
            setComments={setComments}
            setEditComment={setEditComment}
            handleCancelEdit={handleCancelEdit}
          />
        ) : (
          <p className={styles.Content}>{content}</p>
        )}
      </Card.Body>
      {is_owner && !editComment && (
        <DropDown  handleEdit={() => setEditComment(true)} handleDelete={handleDelete} />
      )}
    </Card>
  </div>
  )
}

export default Comment