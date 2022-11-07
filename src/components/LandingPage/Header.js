import React from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// hero image import
import heroImage2 from "../../assets/reading_online.png"

export default function Header(){

  return (
    <header>
        <div className='info' data-aos="fade-left" data-aos-easing="ease-out">
            <h1>All your NOTES &amp; more in one environment!</h1>
            <p>Stress no more about losing access to downloading your shared Notes or losing them on your device(s) 
            <br />getNOTES solves all that &amp; more.   Get free access to your needed Lecture notes &amp; more arranged perfectly for YOU all in one environment. 
            <br />Sign up as Student or Reader. Click <mark>Get started</mark> button.
            </p>
            <button>
              <Link to='/login'> get started</Link>
            </button>
        </div>
        <div data-aos="fade-right" data-aos-easing="ease-in">
            <img src={heroImage2} alt="web designer" />
        </div>
    </header>
  )
}
