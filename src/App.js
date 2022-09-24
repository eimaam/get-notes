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
import ResetPass from './ResetPass';


function App() {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2500);
  }, [])

  const [showNav, setShowNav] = useState(true)

  
  return (
    <Router>
      {/* turned loader to enable app data from AuthContext to load before displaying */}
      {loading 
      
      ?

      // loader from react-spinners
      <div className='loader'>
        <RingLoader loading={loading} className='test'/>
      </div>
      
      :
        
      <div>
      <AuthProvider>
        <DataProvider>
          {/* {showNav &&  */}
            <Nav />
          {/* } */}
          <Routes >
            <Route exact path="/" element={<Home />} />  
            <Route path="/signup" element={<Signup />} />  
            <Route path="/login" element={<Login />}    />
            <Route path="/addusername" element={<UsernameRegistration />}    />
            <Route path="/upload" element={<Upload />}    />
            <Route path="/user/settings" element={<UserSettings />}    />
            <Route exact path="/reset" element={<ResetPass />}    />
            <Route path="*" element={<ErrorPage />}    />
          </Routes>
          
          <Footer />

        </DataProvider>
      </AuthProvider>
      <ToastContainer
position="top-right"
autoClose={3000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
/>
      </div>
    }
    </Router>
  );
}

export default App;
