import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
// AOS import
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

// error page image illustration
import error from "./assets/error.jpg"

export default function ErrorPage(props) {
  useEffect(() => {
    props.showNav(false)
    AOS.init({delay: 200, duration: 700})

  })

  return (
    <div className='error--page' >
      <div data-aos="fade-up" data-aos-easing="ease-in-sine">
        <img src={error} alt="404 error" />
      </div>
      <div data-aos="fade-up" data-aos-easing="ease-in-sine">
        <h1>Ooops!! PAGE NOT FOUND! </h1>
        <h3>Link Broken or does not exist!</h3>
        <h3>Check the URL or go back to <mark><a href="/">HOMEPAGE</a></mark> </h3>
      </div>
    </div>
  )
}
