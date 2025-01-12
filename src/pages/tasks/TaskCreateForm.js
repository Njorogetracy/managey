import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import styles from "../../styles/TaskCreateEditForm.css";
import btnStyles from "../../styles/Button.module.css";
import { Form, Col, Button, Alert, Row, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { axiosReq } from "../../api/axiosDefaults";

function TaskCreateForm() {
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
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState([]);
  const imageInput = useRef(null);
  const [errors, setErrors] = useState({});

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

  /** Fetch profiles for user assignment */
  useEffect(() => {
    axios
      .get(`/profiles/`)
      .then((response) => {
        const profiles = response.data.results || [];
        setUsers(profiles);
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
    const selectedOptions = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value, 10)
    );
    setAssignedUser(selectedOptions);
  };

  /** Handle priority selection */
  const handlePriorityChange = (selectedOption) => {
    setTaskData({ ...taskData, priority: selectedOption });
  };

  /** Handle state selection */
  const handleStateChange = (selectedOption) => {
    setTaskData({ ...taskData, state: selectedOption.value });
  };

  /** Handle image/attachment change */
  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      setTaskData({ ...taskData, attachment: event.target.files[0] });
    }
  };

  /** Redirect to previous page */
  const handleGoBack = () => {
    navigate(location.state?.from || "/tasks/");
  };

  /** Handle form submission */
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    /** Validation */
    let validationErrors = {};
    if (!title) validationErrors.title = ["Title is required."];
    if (!description)
      validationErrors.description = ["Description is required."];
    if (assignedUser.length === 0)
      validationErrors.assigned_users = [
        "At least one assigned user is required.",
      ];
    if (!priority) validationErrors.priority = ["Priority must be selected."];
    if (!state) validationErrors.state = ["Task state must be selected."];
    if (!due_date) validationErrors.due_date = ["Due date is required."];

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority.value);
    formData.append("state", state);
    formData.append("attachment", attachment);
    formData.append("due_date", due_date);
    assignedUser.forEach((userId) => {
      formData.append("assigned_users", userId);
    });

    try {
      await axiosReq.post("/tasks/");
      toast.success("Task created successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(`/tasks/`);
    } catch (err) {
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <Row>
      <Col className="col-sm-8 mx-auto" md={8} lg={6}>
        <Container className={`${styles.Form} shadow p-5 rounded`}>
          <h2 className="text-center text-primary mb-4">Create a New Task</h2>
          <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
            <Form.Group className="mb-4">
              <Form.Label>Title</Form.Label>
              <Form.Control
                placeholder="Enter a descriptive title"
                name="title"
                value={title}
                onChange={handleFormChange}
                className={`${styles.InputField}`}
              />
              {errors.title?.map((message, idx) => (
                <Alert key={idx} variant="danger" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
              <Form.Control
                placeholder="Describe the task in detail"
                as="textarea"
                rows={4}
                name="description"
                value={description}
                onChange={handleFormChange}
                className={`${styles.InputField}`}
              />
              {errors.description?.map((message, idx) => (
                <Alert key={idx} variant="danger" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Assigned Users</Form.Label>
              <Form.Control
                as="select"
                multiple
                aria-label="assigned_user"
                onChange={handleChangeUser}
                className={`${styles.InputField}`}
              >
                <option disabled value="">
                  Assign Task
                </option>
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
                formatOptionLabel={(option) => (
                  <div className="d-flex align-items-center">
                    {option.icon} <span className="ms-2">{option.label}</span>
                  </div>
                )}
                className="react-select-container"
                placeholder="Select priority"
                classNamePrefix="react-select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderRadius: "8px",
                    padding: "4px",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: state.isFocused ? "#f0f8ff" : "white",
                  }),
                }}
              />
              {errors.priority?.map((message, idx) => (
                <Alert key={idx} variant="danger" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>State</Form.Label>
              <Select
                value={stateOptions.find((option) => option.value === state)}
                onChange={handleStateChange}
                options={stateOptions}
                placeholder="Select state"
              />
              {errors.state?.map((message, idx) => (
                <Alert key={idx} variant="danger" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Attachment</Form.Label>
              <Form.Control type="file" onChange={handleChangeImage} />
              {errors.attachment?.map((message, idx) => (
                <Alert key={idx} variant="danger" className="mt-2">
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
                className={`${styles.InputField}`}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.due_date?.map((message, idx) => (
                <Alert key={idx} variant="danger" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button type="submit" className={`${btnStyles.Button} w-45`}>
                Create Task
              </Button>
              <Button
                variant="secondary"
                onClick={handleGoBack}
                className={`${btnStyles.ButtonSecondary} w-45`}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Container>
      </Col>
    </Row>
  );
}

export default TaskCreateForm;
