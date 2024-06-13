import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import { Container } from 'react-bootstrap';
import "./api/axiosDefaults";
import SignUpForm from './pages/auth/SignUpForm';
import LoginForm from './pages/auth/LoginForm';
import TaskCreateForm from './pages/tasks/TaskCreateForm';
import TaskPage from './pages/tasks/Taskpage';
import { ToastContainer } from "react-toastify";
import TasksList from './pages/tasks/TasksList';
import { useCurrentUser } from './contexts/CurrentUserContext';

function App() {
  const currentUser = useCurrentUser;
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
          <Route exact path="/" element={
            <TasksList
             message='No results found adjust search keyword'
             filter={`owner__username=${profile_id}&`}
            />} />
          <Route exact path="/tasks" element={<TasksList message='No results found adjust keyword' />} />
          <Route exact path="/profiles" element={
            <TasksList
              message='No results found adjust keyword'
            />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/signup" element={<SignUpForm />} />
          <Route exact path="/tasks/create" element={<TaskCreateForm />} />
          <Route exact path="/tasks/:id" element={<TaskPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default App;
