import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import Task from './Task';
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import NoResults from '../../assets/no-results.png';
import Asset from '../../components/Asset.js';
import listStyles from '../../styles/TaskListPage.module.css';
import styles from "../../styles/SignUpform.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils.js';

function TasksList({ filter = "" }) {   
    const [tasks, setTasks] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const currentUser = useCurrentUser();
    const [showScroll, setShowScroll] = useState(false);
    const [query, setQuery] = useState('');

    if (!currentUser) {
        return <navigate to="/login" replace />;
      }      

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await axiosReq.get(`/tasks/?${filter}search=${query}`) 
                setTasks(data)
                setHasLoaded(true)
            } catch (error) {
                // console.log(error)
            }
        }
        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchTasks();
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [filter, query, pathname]);

    useEffect(() => {
        if (Array.isArray(tasks) && tasks.length > 10) {
            navigate('/tasks/');
        }
    }, [tasks, pathname, query, currentUser, navigate]);

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

    return (
        <Container className={listStyles.listpage}>
            <Row>
                <h2>Welcome, {currentUser?.username || 'Guest'}!</h2>
                <Form
                    className={listStyles.SearchBar}
                    onSubmit={(event) => event.preventDefault()}
                > 
                    <i className={`fa-solid fa-magnifying-glass ${listStyles.SearchIcon}`}></i>
                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="text"
                        className="mr-sm-2"
                        placeholder="Search tasks"
                    />
                </Form>
                {hasLoaded ? (
                    tasks.results.length ? (
                        <InfiniteScroll
                            dataLength={tasks.results.length}
                            next={fetchMoreData}
                            hasMore={!!tasks.next}
                            loader={<Asset spinner />}
                            className={styles.taskList}
                        >
                            {tasks.results.map((task) => (
                                <Task key={task.id} {...task} setTasks={setTasks} />
                            ))}
                        </InfiniteScroll>
                    ) : (
                        <div className="text-center my-5">
                            <Asset src={NoResults} message="No tasks available." />
                        </div>
                    )
                ) : (
                    <div className="text-center my-5">
                        <Asset spinner />
                    </div>
                )}
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
};

export default TasksList;
