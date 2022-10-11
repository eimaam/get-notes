import React from 'react'
// import Container from './components/Container';
import Login from './components/Login';
import Nav from './components/Nav';
import Signup from './components/Signup';
import Upload from './components/Upload';

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Notes from './components/Notes';
import Footer from './components/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { PropagateLoader, RingLoader } from "react-spinners"
import AuthProvider, { useAuth } from './context/AuthContext';
import DataProvider, { useData } from './context/DataContext';
import UsernameRegistration from './components/UsernameRegistration';
import ErrorPage from './ErrorPage';
import { useState } from 'react';
import { useEffect } from 'react';
import UserSettings from './UserSettings';
import ResetPass from './ResetPass';
import Header from "./components/LandingPage/Header"
import Home from './Home';


function App(props) {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2500);
  }, [])

  // state passed as props to other components, used to manage Nav bar display on certain pages.
  // Only display Nav bar on a component if set to true
  const [showNav, setShowNav] = useState(true)

  
  return (
    <Router>
      {/* turned loader to enable app data from AuthContext to load before displaying */}
      {loading 
      
      ?

      // loader from react-spinners
      <div className='loader'>
        <PropagateLoader loading={loading} className='test'/>
        <br />
        <h3>Loading Notes...</h3>
      </div>
      
      :
        
      <div>
      <AuthProvider>
        <DataProvider>
          {showNav && 
          
          <Nav />

          }
          <Routes >
            <Route exact path="/" element={<Home showNav={setShowNav}/> } /> 

            {/* PROTECTED ROUTES: Only logged in Users can access  */}
            <Route exact path="/notes" element={<Notes showNav={setShowNav}/>} />  
            <Route path="/addusername" element={<UsernameRegistration />}    />
            <Route path="/upload" element={<Upload />}    />
            <Route path="/:userName/settings" element={<UserSettings />}    />
            {/* Protected Route end... */}

            <Route path="/signup" element={<Signup showNav={setShowNav}/>} />  
            <Route path="/login" element={<Login showNav={setShowNav}/>}    />
            <Route path="/reset" element={<ResetPass showNav={setShowNav}/>}    />
            <Route path="*" element={<ErrorPage showNav={setShowNav}/>}    />
          </Routes>
          {showNav && 
          <Footer />
          }
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
