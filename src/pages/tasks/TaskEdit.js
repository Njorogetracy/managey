import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { axiosReq } from "../../api/axiosDefaults";
import axios from "axios";
import "../../styles/TaskCreateEditForm.css";
import btnStyles from "../../styles/Button.module.css";
import { Form, Col, Button, Alert, Row, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Avatar from "../../components/Avatar";

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

  const { title, description, priority, state, due_date } = taskData;

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
    { value: "Not-started", label: "Not started" },
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
        const ids = (assigned_users || []).map((user) =>
          typeof user === "object" ? user.id : user
        );
        setAssignedUsers(ids);
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

  /** Build assigned-user options from fetched profiles */
  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.owner,
    image: user.image,
  }));

  const selectedUserOptions = userOptions.filter((opt) =>
    assignedUsers.includes(opt.value)
  );

  /** Handle form input changes */
  const handleFormChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  /** Handle assigned users change (react-select multi) */
  const handleChangeUser = (selected) => {
    setAssignedUsers((selected || []).map((opt) => opt.value));
  };

  const formatUserOption = (option) => (
    <div className="d-flex align-items-center">
      <Avatar src={option.image} text={option.label} height={24} />
      <span className="ms-2">{option.label}</span>
    </div>
  );

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

  return (
    <Container fluid className="PageWrapper">
      <Row className="justify-content-center">
        <Col xs={12} md={11} lg={10} xl={9}>
          <div className="Form">
            <div className="FormHeader">
              <h2 className="FormTitle">Edit Task</h2>
              <p className="FormSubtitle">
                Update the details below and save your changes.
              </p>
            </div>

            <Form onSubmit={handleSubmitForm} encType="multipart/form-data">
              <div className="FormBody">
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        placeholder="Enter a descriptive title"
                        name="title"
                        value={title}
                        onChange={handleFormChange}
                        className="InputField"
                      />
                      {errors.title?.map((message, idx) => (
                        <Alert key={idx} variant="danger" className="mt-1 py-1">
                          {message}
                        </Alert>
                      ))}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        placeholder="Describe the task in detail"
                        as="textarea"
                        rows={3}
                        name="description"
                        value={description}
                        onChange={handleFormChange}
                        className="InputField"
                      />
                      {errors.description?.map((message, idx) => (
                        <Alert key={idx} variant="danger" className="mt-1 py-1">
                          {message}
                        </Alert>
                      ))}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Assigned Users</Form.Label>
                      <Select
                        isMulti
                        value={selectedUserOptions}
                        onChange={handleChangeUser}
                        options={userOptions}
                        formatOptionLabel={formatUserOption}
                        placeholder="Choose people to assign…"
                        classNamePrefix="react-select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        aria-label="assigned_user"
                        closeMenuOnSelect={false}
                        noOptionsMessage={() => "No users available"}
                      />
                      {errors.assigned_users?.map((message, idx) => (
                        <Alert key={idx} variant="danger" className="mt-1 py-1">
                          {message}
                        </Alert>
                      ))}
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Row>
                      <Col xs={12} sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Priority</Form.Label>
                          <Select
                            value={priority}
                            onChange={handlePriorityChange}
                            options={priorityOptions}
                            formatOptionLabel={(option) => (
                              <div className="d-flex align-items-center">
                                {option.icon}{" "}
                                <span className="ms-2">{option.label}</span>
                              </div>
                            )}
                            className="react-select-container"
                            placeholder="Select priority"
                            classNamePrefix="react-select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                          />
                          {errors.priority?.map((message, idx) => (
                            <Alert
                              key={idx}
                              variant="danger"
                              className="mt-1 py-1"
                            >
                              {message}
                            </Alert>
                          ))}
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Select
                            value={state}
                            onChange={handleStateChange}
                            options={stateOptions}
                            placeholder="Select state"
                            classNamePrefix="react-select"
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                          />
                          {errors.state?.map((message, idx) => (
                            <Alert
                              key={idx}
                              variant="danger"
                              className="mt-1 py-1"
                            >
                              {message}
                            </Alert>
                          ))}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Due Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="due_date"
                        value={due_date}
                        onChange={handleFormChange}
                        className="InputField"
                        min={new Date().toISOString().slice(0, 16)}
                      />
                      {errors.due_date?.map((message, idx) => (
                        <Alert key={idx} variant="danger" className="mt-1 py-1">
                          {message}
                        </Alert>
                      ))}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Attachment</Form.Label>
                      <Form.Control
                        type="file"
                        ref={imageInput}
                        onChange={handleChangeImage}
                      />
                      {errors.attachment?.map((message, idx) => (
                        <Alert key={idx} variant="danger" className="mt-1 py-1">
                          {message}
                        </Alert>
                      ))}
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="FormFooter">
                <Button
                  className={btnStyles.ButtonSecondary}
                  type="button"
                  onClick={handleGoBack}
                >
                  Cancel
                </Button>
                <Button className={btnStyles.Button} type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TaskEdit;
