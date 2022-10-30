import React from 'react'
import { useEffect } from 'react';

// AOS import
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..

export default function MiniSection(props) {
  useEffect(() => {
    AOS.init({delay: 250})
  }, [])
  
  return (
    <section id={props.id} className='mini--section' data-aos="fade-up" data-aos-easing="ease-out">
        <div>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <p>{props.description2}</p>
        </div>
        <button>
            <a href={props.url}> 
            {props.btnName}
            </a>
        </button>
    </section>
  )
}

