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
      await axiosRes.delete(`/comments/${id}`)
      toast.success("Task deleted", {
        position: 'top-right',
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

    <div>
      <hr />
      <Card className={styles.Card}>
        <Link className={styles.Link} to={`/profiles/${profile_id}`} >
          <Avatar src={profile_image} />
          <span className={styles.Owner} >{owner}</span>
          <span className={styles.Date}>{updated_at}</span>
        </Link>
        <Card.Body className='align-self-center ml-2'>
          {editComment ? (
            <CommentEdit
              setEditComment={setEditComment}
              id={id}
              content={content}
              setComments={setComments}
              profile_id = {profile_id}
              profile_image = {profile_image}
            />
          ) : (
            <p>{content}</p>
          )}
        </Card.Body>
        {is_owner && !editComment && (
          <DropDown handleEdit={() => setEditComment(true)} handleDelete={handleDelete} />
        )}
      </Card>
    </div>
  )
}

export default Comment