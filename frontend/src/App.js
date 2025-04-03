import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Links } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
      <nav>
        <Link to='/register'>Register</Link> | {' '}
        <Link to='/login'>Login</Link>
      </nav>
      <Routes>
        <Route path='/register' element={<Register />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Welcome to Payment Gateway Platform</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
