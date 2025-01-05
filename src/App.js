import React from "react";
import { Routes, Route } from "react-router-dom";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute"; 
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

          {/* Protected Routes */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TasksList
                  message="No results found adjust search keyword"
                  filter={`owner__username=${profile_id}&`}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/create"
            element={
              <PrivateRoute>
                <TaskCreateForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <PrivateRoute>
                <TaskPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks/:id/edit"
            element={
              <PrivateRoute>
                <TaskEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles"
            element={
              <PrivateRoute>
                <UserProfiles message="Oops! It seems there are no users by that name" />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/:id"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/:id/edit/username"
            element={
              <PrivateRoute>
                <UsernameForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/:id/edit/password"
            element={
              <PrivateRoute>
                <UserPasswordForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/profiles/:id/edit"
            element={
              <PrivateRoute>
                <ProfileEditForm />
              </PrivateRoute>
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
