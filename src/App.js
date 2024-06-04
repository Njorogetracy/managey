import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import { Container } from 'react-bootstrap';
import "./api/axiosDefaults";
import SignUpForm from './pages/auth/SignUpForm';
import LoginForm from './pages/auth/LoginForm';

function App() {
  return (
    <div className={styles.App}>
     <NavBar/>
     <Container className={styles.Main}>
      <Routes>
        <Route exact path="/home" element={<h1>Home</h1>} />
        <Route exact path="/login" element={<LoginForm/> } />
        <Route exact path="/signup" element={<SignUpForm/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
     </Container>
    </div>
  );
}

export default App;
