import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {Container, Button,} from "react-bootstrap";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import UserProfiles from "./UserProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams, Link } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import { Image } from "react-bootstrap";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import Profile from "./Profile";
import Task from "../tasks/Task";
import { ProfileEditDropdown } from "../../components/DropDown";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const currentUser = useCurrentUser();
    const { id } = useParams();
    const setProfileData = useSetProfileData();
    const [profileTasks, setProfileTasks] = useState({ results: [] });
    const { pageProfile = { results: [] } } = useProfileData();
    const [profile] = pageProfile.results;


    /* 
  Fetch all data for profile, tasks and
  assigned to tasks from the API
*/
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const { data: pageProfile } = await axiosReq.get(`/profiles/${id}/`);
                const [
                    { data: pageProfile },
                    { data: profileTasks },
                ] = await Promise.all([
                    axiosReq.get(`/profiles/${id}/`),
                    axiosReq.get(`/tasks/?owner__profile=${id}`),
                    axiosReq.get(`/tasks/?assigned_users=${id}&owner=${id}`),
                    axiosReq.get(`/tasks/`),
                ])
                setProfileData((prevState) => ({
                    ...prevState,
                    pageProfile: { results: [pageProfile] },
                }));
                setProfileTasks(profileTasks);
                setHasLoaded(true);
            } catch (error) {
                console.log('Error fetching profiles', error);
            }
        };
        fetchData();
    }, [id, setProfileData]);

    const mainProfile = (
        <>
            <Row className="px-3 text-center">
                <Col lg={3} className="text-lg-left">
                    <Image src={profile?.image} roundedCircle className="img-fluid" />
                </Col>
                <Col lg={6}>
                    <h3 className="m-2">{profile?.owner}</h3>
                    <p>{profile?.bio && <Col>{profile.bio}</Col>}</p>
                    <p>Profile status</p>
                </Col>
                <Col>
                {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
                </Col>
            </Row>
        </>
    );

    const mainProfileTasks = (
        <>
            <hr />
            <p className="text-center">Profile owner's tasks</p>
            {profile?.owner}  has a task count of {profile?.tasks_count}.
            {profileTasks.results.length ? (
                <InfiniteScroll
                    children={profileTasks.results.map((task) => (
                        <Task key={task.id} {...task} setTasks={setProfileTasks} />
                    ))}
                    dataLength={profileTasks.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!profileTasks.next}
                    next={() => fetchMoreData(profileTasks, setProfileTasks)}
                />
            ) : (
                <Asset
                    src={NoResults}
                    message={`No results found, ${profile?.owner} has no tasks.`}
                />
            )} 
                {currentUser && currentUser.username === profile?.owner && (
                <Link to="/tasks/create">
                    <Button className={`${btnStyles.Button} ${btnStyles.Wide}`}>
                        Create Task
                    </Button>
                </Link>
            )}
            <hr />
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
                        </>
                    ) : (
                        <Asset spinner />
                    )}
                </Col>
                <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                    <UserProfiles />
                </Col>
            </Row>
        </Container>
    );
}

export default ProfilePage;