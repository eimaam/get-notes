import React from 'react'
import { Route, Routes } from 'react-router-dom';
import AddData from '../components/AddData';
import Nav from '../components/Nav'
import Signup from '../components/Signup';

function RouteWithNavBar({element, url}) {
  return (
    <>
        <Routes>
        <Nav />
            <Route path="/signup" element={<Signup />} />  
            <Route path="/addData" element={<AddData />} />  
        </Routes>
    </>
        
  );
}

export default RouteWithNavBar;