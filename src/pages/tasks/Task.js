import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import cardStyles from "../../styles/Task.module.css";
import Avatar from "../../components/Avatar";
import { DropDown } from "../../components/DropDown";
import { axiosRes } from "../../api/axiosDefaults";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faComments,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

// Map backend state values to the matching badge class from Task.module.css.
const STATE_CLASS = {
  "Not-started": cardStyles.stateNotStarted,
  "To-do": cardStyles.stateTodo,
  "In-progress": cardStyles.stateInProgress,
  "Completed": cardStyles.stateCompleted,
};

const PRIORITY_CLASS = {
  Low: cardStyles.priorityLow,
  Medium: cardStyles.priorityMedium,
  High: cardStyles.priorityHigh,
};

/**the function returns the created task
 * users can view the task
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

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const navigate = useNavigate();

  /**Handle task edit and redirect to edit task page */
  const handleEdit = () => {
    navigate(`/tasks/${id}/edit`);
  };

  /**Handles task deletion */
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/tasks/${id}/`);
      toast.success("Task deleted", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/tasks");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  /**Returns task with all fields populated by the backend. The tasks can be updated and deleted */
  return (
    <Card
      className={`${cardStyles.taskcard} ${
        taskPage ? cardStyles.taskcardExpanded : ""
      }`}
    >
      <Card.Body className="align-items-center justify-content-between">
        <div className={cardStyles.headerContainer}>
          <Link
            to={`/tasks/${id}`}
            className={`${cardStyles.links} ${cardStyles.title}`}
          >
            <Card.Title className={cardStyles.title}>{title}</Card.Title>
          </Link>
          {is_owner && taskPage && (
            <DropDown
              className={cardStyles.dropdownContainer}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </div>
        <Card.Text className={cardStyles.taskmeta}>
          <small className={cardStyles.mute}>Created at: {created_at}</small>
        </Card.Text>
        <div className={cardStyles.taskowner}>
          <Link to={`/profiles/${profile_id}`} className={cardStyles.links}>
            <Avatar src={profile_image} height={44} text={owner} />
            <span className={cardStyles.ownername}>{owner}</span>
          </Link>
        </div>
        {assigned_users_usernames && assigned_users_usernames.length > 0 && (
          <div className={cardStyles.assigned}>
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Assigned to {assigned_users_usernames}</span>
          </div>
        )}
        <div className={cardStyles.footer}>
          <span className={`${cardStyles.state} ${STATE_CLASS[state] || ""}`}>
            {state}
          </span>
          <span
            className={`${cardStyles.priority} ${PRIORITY_CLASS[priority] || ""}`}
          >
            {priority} priority
          </span>
          {due_date && (
            <span className={cardStyles.dueDate}>
              <FontAwesomeIcon icon={faCalendarDay} /> {due_date}
            </span>
          )}
        </div>

        {description && (
          <p className={cardStyles.details}>{description}</p>
        )}
        {attachment && !attachment.includes("default_post") && (
          <div className={cardStyles.attachmentContainer}>
            <Card.Img
              src={attachment}
              alt={title}
              className={cardStyles.attachment}
            />
          </div>
        )}
        <div className={cardStyles.timestamps}>
          <FontAwesomeIcon icon={faComments} /> {comments_count} &middot;
          Updated {updated_at}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Task;
