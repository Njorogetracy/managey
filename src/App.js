import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className={styles.App}>
     <NavBar/>
     <Container className={styles.Main}>
      <Routes>
        <Route exact path="/home" element={<h1>Home</h1>} />
        <Route exact path="/login" element={<h1>Login</h1> } />
        <Route exact path="/signup" element={<h1>Sign up</h1> } />
        <Route path="*" element={<NotFound />} />
      </Routes>
     </Container>
    </div>
  );
}

export default App;
