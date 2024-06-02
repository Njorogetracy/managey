import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import managey from '../assets/managey.png'
import styles from '../styles/NavBar.module.css'

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="lg" fixed="top">
      <Container>
        <Navbar.Brand>
          <img src={managey} alt="logo" height="50" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <Nav.Link>
              <i className="fa-solid fa-house"></i>Home
            </Nav.Link>
            <Nav.Link >
              <i className="fa-solid fa-right-to-bracket"></i>Login
            </Nav.Link>
            <Nav.Link >
              <i className="fa-solid fa-user-plus"></i>Sign up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;