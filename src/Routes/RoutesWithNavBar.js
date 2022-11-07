import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom';
import AddData from '../components/AddData';
import Footer from '../components/Footer';
import Nav from '../components/Nav'
import Signup from '../components/Signup';

function RouteWithNavBar() {
  return (
    <>
    <Nav />
    { <Outlet /> }
    <Footer />
    </>
  );
}

export default RouteWithNavBar;