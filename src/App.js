import React from 'react'
// import Container from './components/Container';
import Login from './components/Login';
import Nav from './components/Nav';
import Signup from './components/Signup';
import Upload from './components/Upload';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './components/Home';
import Footer from './components/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RingLoader } from "react-spinners"
import AuthProvider, { useAuth } from './context/AuthContext';
import DataProvider, { useData } from './context/DataContext';
import UsernameRegistration from './components/UsernameRegistration';
import ErrorPage from './ErrorPage';
import { useState } from 'react';
import { useEffect } from 'react';
import UserSettings from './UserSettings';


function App() {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2500);
  }, [])
  return (
    <Router>
      {loading ? <div className='loader'>
                    <RingLoader loading={loading} className='test'/>
                  </div>
                  :
      <div>
      <AuthProvider>
        <DataProvider>
          <Nav />
          <Footer />
          <Routes >
            <Route exact path="/" element={<Home />} />  
            <Route path="/signup" element={<Signup />} />  
            <Route exact path="/login" element={<Login />}    />
            <Route exact path="/addusername" element={<UsernameRegistration />}    />
            <Route path="/upload" element={<Upload />}    />
            <Route path="/user/settings" element={<UserSettings />}    />
            <Route path="*" element={<ErrorPage />}    />
          </Routes>
        </DataProvider>
      </AuthProvider>
      <ToastContainer
      autoClose={3000}
      />
      </div>
    }
    </Router>
  );
}

export default App;
