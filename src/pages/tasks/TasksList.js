import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';
import Task from './Task';
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import NoResults from '../../assets/no-results.png';
import Asset from '../../components/Asset.js';
import listStyles from '../../styles/TaskListPage.module.css';
import appStyles from "../../App.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils.js';

function TasksList({ filter = "" }) {
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [showScroll, setShowScroll] = useState(false);
  const [query, setQuery] = useState('');

  /** Fetch tasks based on the search query and filter */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/?${filter}&ordering=-created_at`);
        setTasks(data);
        setHasLoaded(true);
      } catch (error) {
        // console.error("Error fetching tasks", error);
      }
    };
    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchTasks();
    }, 500);
    return () => clearTimeout(timer);
  }, [filter, query, pathname]);

  /** Scroll handling */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /** Scroll to top */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container className={`${listStyles.listPage} py-4`}>
      <Row className="justify-content-between align-items-center">
        <Col md={6}>
          <h2 className="text-primary">Welcome {currentUser?.username}</h2>
        </Col>
      </Row>

      <div className={`${listStyles.taskContainer} my-4`}>
        {hasLoaded ? (
          tasks.results.length ? (
            <InfiniteScroll
              dataLength={tasks.results.length}
              next={() => fetchMoreData(tasks, setTasks)}
              hasMore={!!tasks.next}
              loader={<Asset spinner />}
              className="task-list"
            >
              {tasks.results.map((task) => (
                <div className={`${listStyles.taskItem} p-3 mb-3`} key={task.id}>
                  <Task {...task} setTasks={setTasks} />
                </div>
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
      </div>

      {showScroll && (
        <Button
          onClick={scrollToTop}
          className={`${appStyles.BackToTopButton} position-fixed`}
          variant="secondary"
        >
          Back to Top
        </Button>
      )}
    </Container>
  );
}

export default TasksList;
