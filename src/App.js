import React from 'react'
// import Container from './components/Container';
import Login from './components/Login';
import Nav from './components/Nav';
import Signup from './components/Signup';
import Upload from './components/Upload';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './components/Home';
import Footer from './components/Footer';

import { ToastContainer, toast } from 'react-toastify';

  import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './context/AuthContext';
import DataProvider from './context/DataContext';
import UsernameRegistration from './components/UsernameRegistration';
import ErrorPage from './ErrorPage';


function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Nav />
          <Footer />
          <Routes>
            <Route exact path="/" element={<Home />} />  
            <Route path="/signup" element={<Signup />} />  
            <Route exact path="/login" element={<Login />}    />
            <Route exact path="/addusername" element={<UsernameRegistration />}    />
            <Route path="/upload" element={<Upload />}    />
            <Route path="*" element={<ErrorPage />}    />
          </Routes>
        </DataProvider>
      </AuthProvider>
      <ToastContainer />
    </Router>
  );
}

export default App;
