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
import Profile from "./Profile";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const currentUser = useCurrentUser();
    const { id } = useParams();
    const setProfileData = useSetProfileData();
    const { pageProfile = { results: [] } } = useProfileData();
    const [profile] = pageProfile.results;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: pageProfile }] = await Promise.all([
                    axiosReq.get(`/profiles/${id}/`),
                  ]);
                  setProfileData((prevState) => ({
                    ...prevState,
                    pageProfile: { results: [pageProfile] },
                  }));
                  setHasLoaded(true);
            } catch (error) {
                console.log('Error fetching profiles', error)
            }
        }
        fetchData();
    }, [id, setProfileData])

    const mainProfile = (
        <>
            <Row noGutters className="px-3 text-center">
                <Col lg={3} className="text-lg-left">
                    <Image src={profile?.image} />
                </Col>
                <Col lg={6}>
                    <h3 className="m-2">{Profile?.owner}</h3>
                    <p>Profile stats</p>
                </Col>
                <Col lg={3} className="text-lg-right">
                    <p>Follow button</p>
                </Col>
                <Col className="p-3">Profile content</Col>
            </Row>
        </>
    );

    const mainProfilePosts = (
        <>
            <hr />
            <p className="text-center">Profile owner's posts</p>
            <hr />
        </>
    );

    return (
        <Row>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                <UserProfiles />
            </Col>
        </Row>
    );
}

export default ProfilePage;