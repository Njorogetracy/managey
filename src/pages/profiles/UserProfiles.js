import React, { useEffect, useState } from 'react'
import { axiosReq } from '../../api/axiosDefaults';
import listStyles from '../../styles/TaskListPage.module.css';
import { Form, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Asset from '../../components/Asset';
import NoResults from '../../assets/no-results.png';
import Profile from './Profile';

function UserProfiles() {
    const [profileData, setProfileData] = useState({ results: [] })
    const [searchUser, setSearchUser] = useState("");
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();

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

    return (
        <div>
            {/* <i className={`fa-solid fa-magnifying-glass ${listStyles.SearchIcon}`}></i> */}
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
            <ul>
                {hasLoaded ? (
                    <>
                        {Array.isArray(profileData) && profileData.length > 0 ? (
                            profileData.map(profile => (
                                // <Profile key={profile.id} setProfileData={setProfileData} />
                                <p key={profile.id} value={profile.owner}>
                                    <Link to={`/profiles/${profile.id}/`} >{profile.owner}</Link>
                                </p>
                            ))
                         ) : (
                        <Container className="text-center my-5">
                            {/* <Asset src={NoResults} message="No results"/> */}
                        </Container>
                    )}
                    </>
                ):(
                    <Container>
                        <Asset spinner/>
                    </Container>

                )}
            </ul>
        </div>
    )
}

export default UserProfiles