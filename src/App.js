import React from 'react'
// import Container from './components/Container';
import Login from './components/Login';
import Signup from './components/Signup';
import Upload from './components/Upload';

import { Routes, Route } from "react-router-dom"
import Notes from './components/NotesPage/Notes';
// Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { HashLoader } from "react-spinners"
import AuthProvider from './contexts/AuthContext';
import DataProvider from './contexts/DataContext';
import ErrorPage from './ErrorPage';
import { useState } from 'react';
import { useEffect } from 'react';
import UserSettings from './UserSettings';
import ResetPass from './ResetPass';
import Home from './Home';
import AddData from './components/AddData';
import { NotStudentNotes } from './components/NotStudentNotes';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { TakeARest } from './components/TakeARest';
import { Forum } from './components/Forum/Forum';
import RouteWithNavBar from './Routes/RoutesWithNavBar';
import { ProtectedRoutes } from './Routes/ProtectedRoutes';
import { WelcomePage } from './components/WelcomePage';
// Animate on Scroll import
import AOS from 'aos';
import 'aos/dist/aos.css';


function App() {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    AOS.init({delay: 700, easing: 'ease-out'})
    setTimeout(() => {
      setLoading(false)
    }, 2500);
  }, [])

  return (
        <>
          {/* turned loader to enable app data from AuthContext to load before displaying */}
          {loading 
          
          ?
    
          // loader 
          <div className='loader'>
             <HashLoader loading={loading} className='test'/>
          </div>
          
          :
            
          <AuthProvider>
            <DataProvider>
              <Routes >
                <Route exact path="/" element={<Home /> } /> 
                <Route path="/signup" element={<Signup />} />  
                <Route path="/login" element={<Login />}    />
                <Route path="/reset" element={<ResetPass />}    />
                {/* Error Page */}
                <Route path="*" element={<ErrorPage />}    />
    
                {/* PROTECTED ROUTES: Only logged in Users can access  */}
                <Route element={<ProtectedRoutes />}>
                  <Route path="/forum" element={<Forum />}    />
                  <Route path="/addusername" element={<AddData/>}    />
                  <Route path="/games" element={<TakeARest />}    />
                  <Route path="/admin" element={<AdminDashboard />}    />      
                  <Route path="/welcome" element={<WelcomePage />}    />

                  {/* Routes with Side Nav Bar */}
                  <Route element={<RouteWithNavBar />}>
                    <Route path="/notes" element={<Notes />} />  
                    <Route path="/upload" element={<Upload />}    />
                    <Route path="/:userName/settings" element={<UserSettings />}    />
                    <Route exact path="/not-student" element={<NotStudentNotes />} />  
                  </Route>
                  {/* end */}
                </Route>
              </Routes>
            </DataProvider>
          </AuthProvider>
        }
          <ToastContainer
          autoClose={3000}
          />
        </>
    
      );
    }
    
    export default App;