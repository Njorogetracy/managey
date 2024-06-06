import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import managey from '../assets/managey.png'
import styles from '../styles/NavBar.module.css'
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClicksOutside from "../hooks/useClicksOutside";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  
  const {expanded, setExpanded, ref} = useClicksOutside();

  /**Handles user logout and redirects to landing page */
  const handleSignOut = async () => {
    try {
        await axios.post("dj-rest-auth/logout/")
        setCurrentUser(null)
    } catch (error) {
        console.log(error);
    }
};

  const addTaskIcon = (
    <NavLink className={styles.NavLink} activeclassname={styles.Active} to="/tasks/create" >
      <i className="fa-solid fa-file-circle-plus"></i>Add task
    </NavLink>
  )

  /* 
  Displays current username with its avatar in the navbar
  and dropdown offers options only available to auth user
*/
  const loggedInIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeclassName={styles.Active}
        to="/tasks/"
      ><i className="fas fa-list"></i>Tasks</NavLink>
      <NavLink
        className={styles.NavLink}
        activeclassName={styles.Active}
        to="/contact"
      >
        <i className="fa-solid fa-envelope"></i>Contact
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut} >
        <i className="fa-solid fa-sign-out-alt"></i>Log out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>
    </>
  )

  /**Displays logo, signin and signup icons for looged out users */
  const loggedOutIcons = (
    <>
      <NavLink className={styles.NavLink} activeclassname={styles.Active} to="/login" >
        <i className="fa-solid fa-right-to-bracket"></i>Login
      </NavLink>
      <NavLink className={styles.NavLink} activeclassname={styles.Active} to="signup" >
        <i className="fa-solid fa-user-plus"></i>Sign up
      </NavLink>
    </>
  )

  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={managey} alt="logo" height="50" />
          </Navbar.Brand>
        </NavLink>
        {currentUser && addTaskIcon}
        <Navbar.Toggle
         ref={ref}
         onClick={()=> setExpanded(!expanded) }
         aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-right">
            <NavLink className={styles.NavLink} activeclassname={styles.Active} to="/home">
              <i className="fa-solid fa-house"></i>Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;