import React from 'react'
import { Image, Row, Col, Container, Button } from 'react-bootstrap';
import Error from '../assets/design.png'
import btnStyles from '../styles/Button.module.css'
import { Link } from 'react-router-dom';


/*
  Returns a 404 page with a button
  to return user to the main page
*/
const NotFound = () => {
  return (
    <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} className="text-center">
                    <Image src={Error} alt='Page Not Found' fluid />
                    <br />
                    <Link to="/">
                        <Button className={btnStyles.Button}>
                            Return Home
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Container>
  )
}

export default NotFound;