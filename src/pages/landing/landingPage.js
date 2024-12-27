import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const LandingPage = () => {
  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Row className="text-center">
        <Col>
          <h1>Welcome to Managey</h1>
          <p>Organize your tasks efficiently with our powerful task management tool.</p>
          <Link to="/login">
            <Button variant="primary" className="mr-2">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="secondary">Sign Up</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
