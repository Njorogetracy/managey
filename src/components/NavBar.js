import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import managey from '../assets/managey.png'
import styles from '../styles/NavBar.module.css'
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={managey} alt="logo" height="50" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink className={styles.NavLink} activeclassname={styles.Active} to="/home">
              <i className="fa-solid fa-house"></i>Home
            </NavLink>
            <NavLink className={styles.NavLink} activeclassname={styles.Active} to="/login" >
              <i className="fa-solid fa-right-to-bracket"></i>Login
            </NavLink>
            <NavLink className={styles.NavLink} activeclassname={styles.Active} to="signup" >
              <i className="fa-solid fa-user-plus"></i>Sign up
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;