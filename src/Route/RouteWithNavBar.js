import React from 'react'
import { Route, Routes } from 'react-router-dom';
import AddData from '../components/AddData';
import Nav from '../components/Nav'
import Signup from '../components/Signup';

function RouteWithNavBar({component, url}) {
  return (
    <>
        <Route path={url} element={component} /> 
    </>
  );
}

export default RouteWithNavBar;