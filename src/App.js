import React from 'react';
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
import TaskEdit from './pages/tasks/TaskEdit';
import ProfilePage from './pages/profiles/ProfilePage';
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import UserProfiles from './pages/profiles/UserProfiles';
import LandingPage from './pages/landing/landingPage';


function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
        {!currentUser && (
          <>
            <Route exact path="/signup" element={<SignUpForm />} />
            <Route exact path="/login" element={<LoginForm />} />
          </>
        )}
          <Route exact path="/tasks" element={
            <TasksList
              message='No results found adjust search keyword'
              filter={`owner__username=${profile_id}&`}
            />} />
          <Route path="/" element={currentUser ? <Navigate to="/tasks" /> : <LandingPage />} />
          <Route path="/tasks" element={currentUser ? <TasksList /> : <Navigate to="/" />} />
          <Route exact path="/tasks/create" element={<TaskCreateForm />} />
          <Route exact path="/tasks/:id" element={<TaskPage />} />
          <Route exact path="/tasks/:id/edit" element={<TaskEdit />} />
          <Route exact path="/profiles/:id" element={<ProfilePage />} />
          <Route exact path="/profiles/:id/edit/username" element={<UsernameForm />} />
          <Route exact path="/profiles/:id/edit/password" element={<UserPasswordForm />} />
          <Route exact path="/profiles/:id/edit" element={<ProfileEditForm />} />
          <Route exact path="/profiles" element={<UserProfiles message="Oops! It seems there are no users by that name" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default App;
