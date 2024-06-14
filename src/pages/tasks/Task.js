import React from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Card, Button, } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import cardStyles from '../../styles/Task.module.css';
import Avatar from '../../components/Avatar';
import styles from '../../styles/NavBar.module.css'
import { DropDown } from '../../components/DropDown';
import { axiosRes } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';

const Task = (props) => {
    const {
        id,
        owner,
        profile_id,
        created_at,
        updated_at,
        profile_image,
        title,
        description,
        state,
        overdue,
        priority,
        assigned_users_usernames,
        attachment,
        due_date,
        comments_count,
        taskPage,
    } = props;

    // console.log("TaskCard props:", {
    //     id,
    //     profile_id,
    //     profile_image,
    //     owner,
    //     title, // Log title to check
    //     updated_at,
    //     assigned_users_usernames,
    //     created_at,
    //     priority,
    //     description,
    //     state,
    //     overdue,
    //     due_date,
    //     assigned_users,
    //     attachment,
    //     comments_count,
    //   });

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const navigate = useNavigate();
    const location = useLocation();

    /**Handle task edit and redirect to edit task page */
    const handleEdit = () => {
        navigate(`/tasks/${id}/edit`)
    }

    /**Handles task deletion */
    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/tasks/${id}`)
            toast.success("Task deleted", {
                position: 'top-right',
                autoClose: 3000,
            });
            navigate('/')
        } catch (error) {
            console.log('error deleting task', error)
        }
    }


    /**Returns task with all fields populated by the backend. The tasks can be updated and deleted */
    return (
        <Card className={cardStyles.taskcard}>
            <Card.Body className='align-items-center justify-content-between'>
                <Link to={`/tasks/${id}`} className={`${cardStyles.links} ${cardStyles.title}`} >
                    <Card.Title className={cardStyles.title}>
                        {title}
                    </Card.Title>
                </Link>
                <div className={cardStyles.taskmeta}>
                    <Card.Text>
                        <small className={cardStyles.mute}>Created at: {created_at}</small>
                    </Card.Text>
                    <span></span>
                    {is_owner && taskPage && <DropDown handleEdit={handleEdit} handleDelete={handleDelete} />}
                </div>
                <div>
                    <Link to={`/profiles/${profile_id}`} className={`${cardStyles.links} `} >
                        <Avatar src={profile_image} height={55} />{"  "}
                        <span>{owner}</span>
                    </Link>
                </div>
                <br />
                <div>
                    {assigned_users_usernames ? (
                        <Link to={`/profiles/${assigned_users_usernames}`} className={`${cardStyles.assigned} ${cardStyles.links} `}>
                            Assigned to: {assigned_users_usernames}
                        </Link>
                    ) : (
                        <div className={styles.NavLink}>Assigned to: {assigned_users_usernames}</div>
                    )}
                </div>
                <Card.Text className={cardStyles.footer}>
                    <small className={cardStyles.mute}>Due: {due_date}</small>
                </Card.Text>
                <div>
                    <Card.Text className={cardStyles.state}>
                        <small className={cardStyles.mute}>State: {state}</small>
                    </Card.Text>
                    <Card.Text className={cardStyles.priority}>
                        <small className={cardStyles.mute}>Priority: {priority}</small>
                    </Card.Text>
                </div>
                <br />
                <div className={cardStyles.details}>
                    Details: {' '}
                    <span>{description}</span>
                </div>
                <br />
                <Card.Body>
                    <Link to={`/tasks/${id}`} target="_blank" rel="noopener noreferrer">
                        <Card.Img src={attachment} alt={title} />
                    </Link>
                </Card.Body>
                <div>
                    <Card.Text className={cardStyles.updated}>
                        <small className={cardStyles.mute}>Updated at: {updated_at}</small>
                    </Card.Text>
                </div>
                <Card.Text className={cardStyles.overdue}>
                    <small className={cardStyles.mute}>Overdue: {overdue}</small>
                </Card.Text>
                <Link to={`/tasks/${id}`} >
                    <i className="fa-solid fa-comments"></i>
                </Link>
                {comments_count}
            </Card.Body>
        </Card>
    )
}

export default Task