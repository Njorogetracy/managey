import React from "react";
import { NavLink } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import managey from "../assets/managey.png";
import styles from "../styles/NavBar.module.css";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClicksOutside from "../hooks/useClicksOutside";
import { toast } from "react-toastify";
import { removeTokenTimestamp } from "../utils/utils";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { expanded, setExpanded, ref } = useClicksOutside();

  /**Handles user logout and redirects to landing page */
  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
      toast.success("Logout successful", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const profileLink = currentUser?.profile_id
    ? `/profiles/${currentUser.profile_id}`
    : "/profiles";

  // navigation links for logged-in users
  const loggedInIcons = (
    <>
      <NavLink className={styles.NavLink} to="/tasks/">
        <i className="fa-solid fa-house"></i> Home
      </NavLink>
      <NavLink className={styles.NavLink} to="/tasks/">
        <i className="fas fa-tasks"></i> My Tasks
      </NavLink>
      <NavLink className={styles.NavLink} to="/tasks/create">
        <i className="fa-solid fa-plus-circle"></i> Add Task
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fa-solid fa-sign-out-alt"></i> Logout
      </NavLink>
      {/* <NavLink className={styles.NavLink} to={`/profiles/${currentUser?.profile_id}`}>
        <Avatar src={currentUser?.profile_image} text={currentUser?.username} height={40} />
      </NavLink> */}
      <NavLink className={styles.NavLink} to={profileLink}>
        <Avatar src={currentUser?.profile_image} text={currentUser?.username || "Profile"} height={40} />
      </NavLink>
    </>
  );

  // navigation links for logged-out users
  const loggedOutIcons = (
    <>
      <NavLink className={styles.NavLink} to="/login">
        <i className="fa-solid fa-sign-in-alt"></i> Login
      </NavLink>
      <NavLink className={styles.NavLink} to="/signup">
        <i className="fa-solid fa-user-plus"></i> Sign Up
      </NavLink>
    </>
  );

  return (
    <Navbar expanded={expanded} className={`${styles.NavBar} shadow-sm`} expand="md" fixed="top">
      <Container>
        <NavLink to={currentUser ? "/tasks/" : "/"}>
          <Navbar.Brand className={styles.Brand}>
            <img src={managey} alt="Managey Logo" height="50" className={styles.BrandLogo} />
            <span className={styles.BrandText}>Managey</span>
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-center">{currentUser ? loggedInIcons : loggedOutIcons}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
