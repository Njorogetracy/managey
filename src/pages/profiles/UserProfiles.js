import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import listStyles from '../../styles/TaskListPage.module.css';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Asset from '../../components/Asset';
import NoResults from '../../assets/no-results.png';
import Profile from './Profile';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

/**Function handles fetching all user profiles and user data */
function UserProfiles() {
    const [profileData, setProfileData] = useState({ results: [] });
    const [searchUser, setSearchUser] = useState("");
    const [ordering, setOrdering] = useState("-created_at");
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();
    const currentUser = useCurrentUser();

    /**Fetch all user profiles */
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const params = new URLSearchParams();
                if (searchUser) params.append('search', searchUser);
                if (ordering) params.append('ordering', ordering);
                const { data } = await axiosReq.get(`/profiles/?${params.toString()}`);
                setProfileData(data);
            } catch (error) {
                setProfileData({ results: [] });
            } finally {
                setHasLoaded(true);
            }
        };
        setHasLoaded(false);
        // Debounced by 500ms — matches the task search experience
        const timer = setTimeout(fetchProfiles, 500);
        return () => clearTimeout(timer);
    }, [searchUser, ordering, pathname]);

    return (
        <Container className="py-4">
            <Row className="mb-4 g-2">
                <Col xs={12} md={8}>
                    <Form onSubmit={(event) => event.preventDefault()}>
                        <Form.Control
                            value={searchUser}
                            onChange={(event) => setSearchUser(event.target.value)}
                            type="search"
                            placeholder="Search users by username"
                            aria-label="search users"
                        />
                    </Form>
                </Col>
                <Col xs={12} md={4}>
                    <Form.Select
                        value={ordering}
                        onChange={(event) => setOrdering(event.target.value)}
                        aria-label="sort users"
                    >
                        <option value="-created_at">Recently joined</option>
                        <option value="created_at">Earliest joined</option>
                        <option value="-owner__task">Most tasks</option>
                        <option value="owner__task">Fewest tasks</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Display list of user profiles */}
            {hasLoaded ? (
                <>
                    {profileData.results.length > 0 ? (
                        profileData.results.map((profile) => (
                            <Profile
                                key={profile.id} {...profile}
                                id={profile.id}
                                image={profile.image}
                                owner={profile.owner}
                                imageSize={55}
                            />
                        ))
                    ) : (
                        <Container className="text-center my-5">
                            <Asset src={NoResults} message="No user with that name exists" />
                        </Container>
                    )}
                </>
            ) : (
                <Container>
                    <Asset spinner />
                </Container>
            )}
        </Container>
    );
}

export default UserProfiles;
