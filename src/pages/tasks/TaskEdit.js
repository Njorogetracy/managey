import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { axiosReq } from "../../api/axiosDefaults";
import axios from "axios";
import styles from "../../styles/TaskCreateEditForm.css";
import btnStyles from "../../styles/Button.module.css";
import { Form, Col, Button, Alert, Row, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

/**Handles task editing */
function TaskEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const imageInput = useRef(null);
  const [errors, setErrors] = useState({});
  const { id } = useParams();

  /** Task fields */
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assigned_users: [],
    priority: "",
    state: "",
    attachment: "",
    due_date: "",
  });

  const { title, description, priority, state, attachment, due_date } =
    taskData;

  /** Priority and State options */
  const priorityOptions = [
    {
      value: "Low",
      label: "Low",
      icon: <FontAwesomeIcon icon={faCircle} style={{ color: "#FFD43B" }} />,
    },
    {
      value: "Medium",
      label: "Medium",
      icon: <FontAwesomeIcon icon={faCircle} style={{ color: "#e2763c" }} />,
    },
    {
      value: "High",
      label: "High",
      icon: <FontAwesomeIcon icon={faCircle} style={{ color: "#ee1111" }} />,
    },
  ];

  const stateOptions = [
    { value: "Not started", label: "Not started" },
    { value: "To-do", label: "To-do" },
    { value: "In-progress", label: "In-progress" },
    { value: "Completed", label: "Completed" },
  ];

  /** Fetch existing task data */
  useEffect(() => {
    const handleEditTask = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}/`);
        const {
          title,
          description,
          priority,
          state,
          assigned_users,
          attachment,
          due_date,
        } = data;

        setTaskData({
          title,
          description,
          priority: priorityOptions.find((option) => option.value === priority),
          state: stateOptions.find((option) => option.value === state),
          due_date: new Date(due_date).toISOString().slice(0, 16),
          assigned_users,
          attachment,
        });
        setAssignedUsers(assigned_users.map((user) => user.id));
      } catch (error) {
        toast.error("Error loading task data.");
        navigate("/tasks");
      }
    };

    handleEditTask();
  }, [id, navigate]);

  /** Fetch profiles for user assignment */
  useEffect(() => {
    axios
      .get(`/profiles/`)
      .then((response) => {
        setUsers(response.data.results || []);
      })
      .catch(() => {
        setUsers([]);
      });
  }, []);

  /** Handle form input changes */
  const handleFormChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  /** Handle assigned users change */
  const handleChangeUser = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10));
    setAssignedUsers(selectedOptions);
  };
  

  /** Handle priority and state selection */
  const handlePriorityChange = (selectedOption) =>
    setTaskData({ ...taskData, priority: selectedOption });
  const handleStateChange = (selectedOption) =>
    setTaskData({ ...taskData, state: selectedOption });

  /** Handle attachment change */
  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      setTaskData({ ...taskData, attachment: event.target.files[0] });
    }
  };

  /** Redirect to the previous page */
  const handleGoBack = () => {
    navigate(location.state?.from || "/tasks/");
  };

  /** Handle form submission */
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    /** Validation for required fields */
    let validationErrors = {};
    if (!title) validationErrors.title = ["Title is required."];
    if (!description)
      validationErrors.description = ["Description is required."];
    if (assignedUsers.length === 0)
      validationErrors.assigned_users = [
        "At least one assigned user is required.",
      ];
    if (!due_date) validationErrors.due_date = ["Due date is required."];

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority.value);
    formData.append("state", state.value);
    if (imageInput?.current?.files[0]) {
      formData.append("attachment", imageInput.current.files[0]);
    }
    formData.append("due_date", due_date);
    assignedUsers.forEach((userId) => {
      formData.append("assigned_users", userId);
    });

    try {
      await axiosReq.put(`/tasks/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Task updated successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(`/tasks/`);
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  /** Task form fields */
  const textFields = (
    <div className="text-center">
      <Form.Group className="mb-4">
        <Form.Label>Title</Form.Label>
        <Form.Control
          placeholder="Enter a descriptive title"
          name="title"
          value={title}
          onChange={handleFormChange}
        />
        {errors.title?.map((message, idx) => (
          <Alert key={idx} variant="danger">
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Description</Form.Label>
        <Form.Control
          placeholder="Describe the task"
          as="textarea"
          rows={4}
          name="description"
          value={description}
          onChange={handleFormChange}
        />
        {errors.description?.map((message, idx) => (
          <Alert key={idx} variant="danger">
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Assigned Users</Form.Label>
        <Form.Control
          as="select"
          multiple
          onChange={handleChangeUser}
          value={assignedUsers}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.owner}
            </option>
          ))}
        </Form.Control>
        {errors.assigned_users?.map((message, idx) => (
          <Alert key={idx} variant="danger">
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Priority</Form.Label>
        <Select
          value={priority}
          onChange={handlePriorityChange}
          options={priorityOptions}
          placeholder="Select priority"
        />
        {errors.priority?.map((message, idx) => (
          <Alert key={idx} variant="danger">
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>State</Form.Label>
        <Select
          value={state}
          onChange={handleStateChange}
          options={stateOptions}
          placeholder="Select state"
        />
        {errors.state?.map((message, idx) => (
          <Alert key={idx} variant="danger">
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="datetime-local"
          name="due_date"
          value={due_date}
          onChange={handleFormChange}
          min={new Date().toISOString().slice(0, 16)}
        />
        {errors.due_date?.map((message, idx) => (
          <Alert key={idx} variant="danger">
            {message}
          </Alert>
        ))}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Attachment</Form.Label>
        <Form.Control
          type="file"
          ref={imageInput}
          onChange={handleChangeImage}
        />
        {errors.attachment?.map((message, idx) => (
          <Alert key={idx} variant="danger">
            {message}
          </Alert>
        ))}
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button className={`${btnStyles.Button}`} type="submit">
          Save
        </Button>
        <Button
          className={`${btnStyles.Button} ${btnStyles.Secondary}`}
          onClick={handleGoBack}
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <Row>
      <Col className="col-sm-8 mx-auto" md={8} lg={6}>
        <Container className={`${styles.Form} shadow p-5 rounded`}>
          <h2 className="text-center text-primary mb-4">Edit Task</h2>
          <Form onSubmit={handleSubmitForm}>{textFields}</Form>
        </Container>
      </Col>
    </Row>
  );
}

export default TaskEdit;
