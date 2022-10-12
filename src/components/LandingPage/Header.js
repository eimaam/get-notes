import React from 'react'
import { useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';

// hero image import
import heroImage2 from "../../assets/167-Work-From-Home.svg"

// AOS import
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..



export default function Header(){

  useEffect(() => {
    AOS.init({delay: 200, duration: 700})
  }, [])


  return (
    <header>
        <div className='info' data-aos="fade-left" data-aos-easing="ease-out">
            <h1>All your NOTES &amp; more in one environment!</h1>
            <p>Stressed about losing access to downloading your shared Notes or losing them on your device? 
            <br />getNOTES solves all that &amp; more.  Get free access to your needed Lecture notes &amp; more arranged perfectly for YOU all in one environment.
            </p>
            <button>
              <HashLink to='#howTo'> SEE HOW TO</HashLink>
            </button>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <button>
              <Link to='/signup'> get started</Link>
            </button>
        </div>
            <img src={heroImage2} alt="web designer" data-aos="fade-right" data-aos-easing="ease-in"/>
    </header>
  )
}
