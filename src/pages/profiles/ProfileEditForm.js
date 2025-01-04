import React, { useEffect, useRef, useState } from 'react'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import { useNavigate, useParams } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import { Form, Col, Row, Container, Button, Alert, Image } from 'react-bootstrap';
import appStyles from '../../App.module.css'
import btnStyles from '../../styles/Button.module.css';

/**This is a functional component that fetches user profile data,
 * It returns  a form for the user to update their profile information
 */

const ProfileEditForm = () => {

  const currentUser = useCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const imageFile = useRef(null);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    imageFile: "",
  })
  const { bio, image } = profileData;
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      if (!currentUser) {
        return;
      }
  
      console.log("Current User ID:", currentUser?.profile_id, "URL ID:", id);
      if (currentUser?.profile_id?.toString() === id) {
        console.log("Current User ID:", currentUser?.profile_id, "URL ID:", id);
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { bio, image } = data;
          setProfileData({ bio, image })
        } catch (error) {
          // console.log(error)
          navigate('/tasks')
        }
      } else {
        navigate('/tasks')
      }
    }
    handleMount();
  }, [currentUser, id, navigate])

  // Handle change to profiledata
  const handleChange = (e) => {
    setProfileData({
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setProfileData(data)
    } catch (err) {
      // console.log(err);
      setErrors(err.response?.data);
    }
  };


  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          value={bio}
          onChange={handleChange}
          name="bio"
          rows={7}
        />
      </Form.Group>
      {errors?.bio?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button className={`${btnStyles.Button} ${btnStyles.Secondary}`} onClick={() => navigate('/')}>
        Cancel
      </Button>
      <Button className={btnStyles.Button} type="submit" onClick={() => navigate(`/profiles/${id}`)} >Save</Button>
    </>
  );


  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container >
            <Form.Group>
              {image && (
                <figure>
                  <Image className={appStyles.Image} src={image} roundedCircle />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn my-auto`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.Control
                type="file"
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                style={{display: 'none'}}
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container >{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );

};

export default ProfileEditForm;