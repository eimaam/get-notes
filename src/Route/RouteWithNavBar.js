import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom';
import AddData from '../components/AddData';
import Nav from '../components/Nav'
import Signup from '../components/Signup';

function RouteWithNavBar({ children }) {
  return (
    <>
    <Nav />
    { <Outlet /> }
    </>
  );
}

export default RouteWithNavBar;