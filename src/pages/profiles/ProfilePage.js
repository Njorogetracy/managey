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
  useEffect(() => {
    if (!id || id === "undefined") {
      if (currentUser?.profile_id) {
        navigate(`/profiles/${currentUser.profile_id}`);
      } else {
        navigate("/tasks");
      }
      return;
    }

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
        // console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, [id, currentUser, navigate, setProfileData]);

  const mainProfile = (
    <div className={styles.profileHeader}>
      <div className={styles.profileHeaderBackdrop} aria-hidden="true" />
      <div className={styles.profileIdentity}>
        <div className={styles.avatarRing}>
          <Avatar src={profile?.image} text={profile?.owner} height={88} />
        </div>
        <div className={styles.profileNameBlock}>
          <h2 className={styles.profileTitle}>{profile?.owner}</h2>
          <p className={styles.profileBio}>
            {profile?.bio || "No bio yet — this user hasn't shared anything."}
          </p>
          <div className={styles.profileStats}>
            <span className={styles.statChip}>
              <strong>{profileTasks.results.length}</strong> tasks created
            </span>
            <span className={styles.statChip}>
              <strong>{tasksAssignedByCurrentUser.results.length}</strong>{" "}
              assigned
            </span>
          </div>
        </div>
      </div>
      {profile?.is_owner && (
        <div className={styles.profileActions}>
          <ProfileEditDropdown id={profile?.id} />
        </div>
      )}
    </div>
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
              <p>You have not created any tasks yet.</p>
              <Button
                className="createTaskButton"
                onClick={() => navigate("/tasks/create")}
              >
                Create Task
              </Button>
            </>
          ) : (
            <Asset
              src={NoResults}
              message={`No tasks found. ${profile?.owner} has not created any tasks.`}
            />
          )}
        </Container>
      )}
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
