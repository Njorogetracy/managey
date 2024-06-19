import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import listStyles from '../../styles/TaskListPage.module.css';
import { Form, Container, Image } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Asset from '../../components/Asset';
import NoResults from '../../assets/no-results.png';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

function UserProfiles() {
    const [profileData, setProfileData] = useState({ results: [] })
    const [searchUser, setSearchUser] = useState("");
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();
    const currentUser = useCurrentUser();


    /**Fetch all user profiles */
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const { data } = await axiosReq.get(`/profiles/?search=${searchUser}`)
                console.log(data)
                setProfileData(data)
                setHasLoaded(true)
            } catch (error) {
                console.error('error fetching profiles', error)
                setProfileData([]);
            }
        }
        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchProfiles();
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [searchUser, pathname])

    const filteredProfiles = profileData.results.filter(profile => profile.owner !== currentUser?.username);

    return (
        <div>
            {/* Search bar for filtering user profiles */}
            <Form
                className={listStyles.SearchBar}
                onSubmit={(event) => event.preventDefault()}
            >
                <Form.Control
                    value={searchUser}
                    onChange={(event) => setSearchUser(event.target.value)}
                    type="text"
                    className="mr-sm-2"
                    placeholder="Search users"
                    aria-label="Search bar"
                />
            </Form>
            {/* Display list of user profiles */}

            {hasLoaded ? (
                <>
                    {filteredProfiles.length > 0 ? (
                        filteredProfiles.map(profile => (
                            <Profile
                                    key={profile.id}
                                    {...profileData}
                                    setProfileData={setProfileData}
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

        </div>
    )
}

export default UserProfiles