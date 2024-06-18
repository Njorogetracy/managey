import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import UserProfiles from "./UserProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import { Image } from "react-bootstrap";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import Profile from "./Profile";
import Task from "../tasks/Task";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const currentUser = useCurrentUser();
    const { id } = useParams();
    const setProfileData = useSetProfileData();
    const [profileTasks, setProfileTasks] = useState({ results: [] });
    const { pageProfile = { results: [] } } = useProfileData();
    const [profile] = pageProfile.results;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: pageProfile } = await axiosReq.get(`/profiles/${id}/`);
                setProfileData((prevState) => ({
                    ...prevState,
                    pageProfile: { results: [pageProfile] },
                }));
                setHasLoaded(true);
            } catch (error) {
                console.log('Error fetching profiles', error);
            }
        };
        fetchData();
    }, [id, setProfileData]);

    const mainProfile = (
        <>
            <Row noGutters className="px-3 text-center">
                <Col lg={3} className="text-lg-left">
                    <Image src={profile?.image} roundedCircle className="img-fluid" />
                </Col>
                <Col lg={6}>
                    <h3 className="m-2">{profile?.owner}</h3>
                    <p>{profile?.bio}</p>
                    <p>Profile stats</p>
                </Col>
            </Row>
        </>
    );

    const mainProfileTasks = (
        <>
            <hr />
            <p className="text-center">Profile owner's tasks</p>
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
                    message={`No results found, ${profile?.owner} hasn't posted yet.`}
                />
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