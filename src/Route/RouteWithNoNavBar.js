import React from 'react'
import { Route, Routes } from 'react-router-dom';
import AddData from '../components/AddData';
import Login from '../components/Login';
import Nav from '../components/Nav'
import Signup from '../components/Signup';
import Home from '../Home';

function RouteWithNoNavBar({element, url}) {
  return (
    
        <Routes>
            <Route path="/" element={<Home />} />  
            <Route path="/login" element={<Login />} />  
        </Routes>
    
        
  );
}

export default RouteWithNoNavBar;