import React, { useEffect, useState } from "react";
import { Container, Button, Col, Row } from "react-bootstrap";
import Asset from "../../components/Asset";
import UserProfiles from "./UserProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams, useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useProfileData,
  useSetProfileData,
} from "../../contexts/ProfileDataContext";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import Task from "../tasks/Task";
import { ProfileEditDropdown } from "../../components/DropDown";
import appStyles from "../../App.module.css";
import Avatar from "../../components/Avatar";
import styles from "../../styles/ProfilePage.module.css";

/**This funcion handles the profile information,
 * the logged in users tasks
 * the assigned users tasks
 */
function ProfilePage() {
  const { id } = useParams();
  console.log("Profile ID from URL:", id);
  console.log("URL Params:", useParams());
  const [hasLoaded, setHasLoaded] = useState(false);
  const setProfileData = useSetProfileData();
  const [profileTasks, setProfileTasks] = useState({ results: [], next: null });
  const { pageProfile = { results: [] } } = useProfileData();
  const [profile] = pageProfile.results;
  const [tasksAssignedByCurrentUser, setTasksAssignedByCurrentUser] = useState({
    results: [],
    next: null,
  });
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  useEffect(() => {
    console.log("Current User Context:", currentUser);
    if (!id) {
      console.log("Current User:", currentUser);
      if (currentUser?.profile_id) {
        navigate(`/profiles/${currentUser.profile_id}`);
      } else {
        navigate("/tasks");
      }
    }
  }, [id, currentUser, navigate]);

  /**handle scroll */
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScroll(true);
    } else {
      setShowScroll(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /** Fetch all data for profile, tasks and
  assigned to tasks from the API */

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             const [
  //                 { data: pageProfile },
  //                 { data: taskData },
  //                 { data: tasksAssignedByCurrentUser }
  //             ] = await Promise.all([
  //                 axiosReq.get(`/profiles/${id}/`),
  //                 axiosReq.get(`/tasks/?owner__profile=${id}`),
  //                 axiosReq.get(`/tasks/?assigned_users=${id}`),
  //             ])
  //             setProfileData((prevState) => ({
  //                 ...prevState,
  //                 pageProfile: { results: [pageProfile] },
  //             }));
  //             setProfileTasks(taskData);
  //             setTasksAssignedByCurrentUser(tasksAssignedByCurrentUser);
  //             setHasLoaded(true);
  //         } catch (error) {
  //             // console.log(error);
  //         }
  //     };
  //     fetchData();
  // }, [id, setProfileData]);
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const [
            { data: pageProfile },
            { data: taskData },
            { data: tasksAssignedByCurrentUser },
          ] = await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/tasks/?owner__profile=${id}`),
            axiosReq.get(`/tasks/?assigned_users=${id}`),
          ]);
          setProfileData((prevState) => ({
            ...prevState,
            pageProfile: { results: [pageProfile] },
          }));
          setProfileTasks(taskData);
          setTasksAssignedByCurrentUser(tasksAssignedByCurrentUser);
          setHasLoaded(true);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };
      fetchData();
    }
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      <Row className="px-3 text-center align-items-center">
        <Col xs={12} sm={4} md={4} lg={4} xl={4} className="text-lg-left">
          <div className="d-flex flex-column align-items-center align-items-md-start">
            <Avatar
              src={profile?.image}
              height={150}
              roundedCircle
              className="img-fluid mb-2"
            />
            <h3 className="mb-0">{profile?.owner}</h3>
          </div>
        </Col>
        <Col xs={12} sm={4} md={4} lg={4} xl={4} className="text-center">
          {profile?.bio && <p>{profile.bio}</p>}
        </Col>
        <Col xs={12} sm={4} md={4} lg={4} xl={4} className="text-right">
          {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
        </Col>
      </Row>
    </>
  );

  const mainProfileTasks = (
    <>
      <hr className={styles.hideHorizontalRule} />
      {profileTasks.results.length ? (
        <InfiniteScroll
          dataLength={profileTasks.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileTasks.next}
          next={() => fetchMoreData(profileTasks, setProfileTasks)}
        >
          {profileTasks.results.map(
            (task) =>
              task.owner === profile.owner && (
                <Task key={task.id} {...task} setTasks={setProfileTasks} />
              )
          )}
        </InfiniteScroll>
      ) : (
        <Container className="text-center my-5">
          {currentUser?.username === profile?.owner ? (
            <>
              <p>You have not created any tasks.</p>
              <Button
                variant="primary"
                onClick={() => navigate("/tasks/create")}
              >
                Create Task
              </Button>
            </>
          ) : (
            <Asset
              src={NoResults}
              message={`No results found, ${profile?.owner} has not created any tasks.`}
            />
          )}
        </Container>
      )}
      <hr className={styles.hideHorizontalRule} />
    </>
  );

  /* Returns all tasks currently assigned to viewed profiles user */
  const mainTasksAssignedByCurrentUser = (
    <>
      <hr className={styles.hideHorizontalRule} />
      {tasksAssignedByCurrentUser.results.length ? (
        <InfiniteScroll
          dataLength={tasksAssignedByCurrentUser.results.length}
          loader={<Asset spinner />}
          hasMore={!!tasksAssignedByCurrentUser.next}
          next={() =>
            fetchMoreData(
              tasksAssignedByCurrentUser,
              setTasksAssignedByCurrentUser
            )
          }
        >
          {tasksAssignedByCurrentUser.results.map((task) => (
            <Task
              key={task.id}
              {...task}
              setTasks={setTasksAssignedByCurrentUser}
            />
          ))}
        </InfiniteScroll>
      ) : (
        <Asset src={NoResults} message={`No assigned tasks.`} />
      )}
      <hr className={styles.hideHorizontalRule} />
    </>
  );

  return (
    <Container>
      <Row>
        <Col lg={8} className="mx-auto p-0 p-lg-2">
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfileTasks}
              {mainTasksAssignedByCurrentUser}
            </>
          ) : (
            <Asset spinner />
          )}
        </Col>
        <Col
          lg={4}
          className={`p-0 p-lg-2 ${
            window.innerWidth <= 768 ? "d-none" : "d-lg-block"
          }`}
        >
          <UserProfiles />
        </Col>
      </Row>
      {showScroll && (
        <Button
          onClick={scrollToTop}
          className={appStyles.BackToTopButton}
          variant="secondary"
        >
          Back to Top
        </Button>
      )}
    </Container>
  );
}

export default ProfilePage;
