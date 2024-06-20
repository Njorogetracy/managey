import React from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Card, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import cardStyles from '../../styles/Task.module.css';
import Avatar from '../../components/Avatar';
import { DropDown } from '../../components/DropDown';
import { axiosRes } from '../../api/axiosDefaults';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';


/**the function returns the created task
 * users canview the task
 * edit and delete task
 * the comment count is updated each time a user adds or removes a task
 */
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
        priority,
        assigned_users_usernames,
        attachment,
        due_date,
        comments_count,
        taskPage,
    } = props;

    /**Priority option colors */
    const getPriorityColor = () => {
        switch (priority) {
            case 'Low':
                return "#FFD43B";
            case 'Medium':
                return "#e2763c";
            case 'High':
                return "#ee1111";
            default:
                return "#000000";
        }
    };

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const navigate = useNavigate();

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
            console.log(error)
        }
    }


    /**Returns task with all fields populated by the backend. The tasks can be updated and deleted */
    return (
        <Card className={cardStyles.taskcard}>
            <Card.Body className="align-items-center justify-content-between">
                <div className={cardStyles.headerContainer}>
                    <Link to={`/tasks/${id}`} className={`${cardStyles.links} ${cardStyles.title}`}>
                        <Card.Title className={cardStyles.title}>
                            {title}
                        </Card.Title>
                    </Link>
                    {is_owner && taskPage && (
                        <DropDown
                            className={cardStyles.dropdownContainer}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
                <div className={cardStyles.taskmeta}>
                    <Card.Text>
                        <small className={cardStyles.mute}>Created at: {created_at}</small>
                    </Card.Text>
                </div>
                <div className={cardStyles.taskowner}>
                    <Link to={`/profiles/${profile_id}`} className={cardStyles.links}>
                        <Avatar src={profile_image} height={55} />
                        <span className={cardStyles.ownername}>{owner}</span>
                    </Link>
                </div>
                <div className={cardStyles.assigned}>
                    {assigned_users_usernames ? (
                        <Link to={`/profiles/${assigned_users_usernames}`} className={cardStyles.links}>
                            Assigned to: {assigned_users_usernames}
                        </Link>
                    ) : (
                        <div>Assigned to: {assigned_users_usernames}</div>
                    )}
                </div>
                <div className={cardStyles.footer}>
                    <Card.Text>
                        <small className={cardStyles.mute}>Due: {due_date}</small>
                    </Card.Text>
                    <Card.Text className={cardStyles.state}>
                        <small className={cardStyles.mute}>State: {state}</small>
                    </Card.Text>
                    <Card.Text className={cardStyles.priority}>
                        <Col style={{ color: getPriorityColor() }}>
                            <FontAwesomeIcon icon={faCircle} /> {priority} priority
                        </Col>
                    </Card.Text>
                </div>
                <div className={cardStyles.details}>
                    Details: {' '}
                    <span>{description}</span>
                </div>
                <div className={cardStyles.attachmentContainer}>
                    <Link to={`/tasks/${id}`} target="_blank" rel="noopener noreferrer">
                        <Card.Img src={attachment} alt={title} className={cardStyles.attachment} />
                    </Link>
                </div>
                <div className={cardStyles.timestamps}>
                    <Card.Text>
                        <small className={cardStyles.mute}>Updated at: {updated_at}</small>
                    </Card.Text>
                </div>
                <Card.Text>
                    <i className="fa-solid fa-comments"></i>
                    {comments_count}
                </Card.Text>
            </Card.Body>
        </Card>
    )
};

export default Task