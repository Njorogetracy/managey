import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import { Container } from "react-bootstrap";
import SignUpForm from "./pages/auth/SignUpForm";
import LoginForm from "./pages/auth/LoginForm";
import TaskCreateForm from "./pages/tasks/TaskCreateForm";
import TaskPage from "./pages/tasks/TaskPage";
import TasksList from "./pages/tasks/TasksList";
import TaskEdit from "./pages/tasks/TaskEdit";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import UserProfiles from "./pages/profiles/UserProfiles";
import LandingPage from "./pages/landing/landingPage";
import { ToastContainer } from "react-toastify";
import styles from "./App.module.css";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/signup" element={<SignUpForm />} />
          <Route exact path="/login" element={<LoginForm />} />
          {!currentUser && (
            <>
              <Route exact path="/signup" element={<SignUpForm />} />
              <Route exact path="/login" element={<LoginForm />} />
            </>
          )}
          {/* <Route exact path="/tasks" element={
            <TasksList
              message='No results found adjust search keyword'
              filter={`owner__username=${profile_id}&`}
            />} /> */}
          {/* <Route exact path="/" element={<TasksList />} /> */}
          <Route
            path="/tasks"
            element={
              profile_id ? (
                <TasksList
                  message="No results found, adjust search keyword"
                  filter={`owner__username=${profile_id}&`}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route exact path="/tasks/create" element={<TaskCreateForm />} />
          <Route exact path="/tasks/:id" element={<TaskPage />} />
          <Route exact path="/tasks/:id/edit" element={<TaskEdit />} />
          <Route exact path="/profiles/:id" element={<ProfilePage />} />
          <Route
            exact
            path="/profiles/:id/edit/username"
            element={<UsernameForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit/password"
            element={<UserPasswordForm />}
          />
          <Route
            exact
            path="/profiles/:id/edit"
            element={<ProfileEditForm />}
          />
          <Route
            exact
            path="/profiles"
            element={
              <UserProfiles message="Oops! It seems there are no users by that name" />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default App;
