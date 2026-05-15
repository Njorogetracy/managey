import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [tasks, setTasks] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [showScroll, setShowScroll] = useState(false);

  // Search + filter inputs
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  /** Fetch tasks based on the search query and filter */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams();
        if (filter) {
          // filter is passed as e.g. "owner__profile=2" — split on = to add safely
          filter.split('&').forEach((part) => {
            const [k, v] = part.split('=');
            if (k && v) params.append(k, v);
          });
        }
        if (query) params.append('search', query);
        if (stateFilter) params.append('state', stateFilter);
        if (priorityFilter) params.append('priority', priorityFilter);
        params.append('ordering', '-created_at');

        const { data } = await axiosReq.get(`/tasks/?${params.toString()}`);
        setTasks(data);
        setHasLoaded(true);
      } catch (error) {
        setHasLoaded(true);
      }
    };
    setHasLoaded(false);
    // Debounce search input by 500ms — avoids hammering the API on each keystroke
    const timer = setTimeout(fetchTasks, 500);
    return () => clearTimeout(timer);
  }, [filter, query, stateFilter, priorityFilter, pathname, currentUser]);

  /** Scroll handling */
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setQuery('');
    setStateFilter('');
    setPriorityFilter('');
  };

  return (
    <Container className={`${listStyles.listPage} py-4`}>
      <Row className="justify-content-between align-items-center mb-3">
        <Col md={6}>
          <h2 className="text-primary">Welcome {currentUser?.username}</h2>
        </Col>
      </Row>

      <Row className="mb-4 g-2">
        <Col xs={12} md={5}>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Control
              type="search"
              placeholder="Search by owner, priority, or state"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="search tasks"
            />
          </Form>
        </Col>
        <Col xs={6} md={3}>
          <Form.Select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            aria-label="filter by state"
          >
            <option value="">All states</option>
            <option value="Not-started">Not started</option>
            <option value="To-do">To-do</option>
            <option value="In-progress">In-progress</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Col>
        <Col xs={6} md={3}>
          <Form.Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="filter by priority"
          >
            <option value="">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={1} className="d-grid">
          <Button
            variant="outline-secondary"
            onClick={clearFilters}
            disabled={!query && !stateFilter && !priorityFilter}
            aria-label="clear filters"
          >
            Clear
          </Button>
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
              <Asset src={NoResults} message="No tasks match your search." />
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
