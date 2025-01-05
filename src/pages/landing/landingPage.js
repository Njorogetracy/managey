import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../../styles/LandingPage.module.css";


function LandingPage() {
  return (
    <Container fluid className={`vh-100 d-flex justify-content-center align-items-center ${styles.background}`}>
      <Row className="text-center">
        <Col className="p-4">
          <h1 className="mb-4 display-4 text-primary font-weight-bold">Welcome to Managey</h1>
          <p className="mb-4 text-muted fs-5">
            Organize your tasks efficiently with our task management tool.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login">
              <Button variant="primary" className={`${styles.customButton} px-4 py-2 shadow-sm`}>
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline-primary" className={`${styles.customButton} px-4 py-2 shadow-sm`}>
                Sign Up
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LandingPage;
