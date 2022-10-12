import React from 'react'
import { useEffect } from 'react';

// AOS import
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
export default function ProcedureCard({position, title, detail, className}) {
  useEffect(() => {
    AOS.init({delay: 300})

  }, [])

  // generated random number for use to set different className for cards
  const random = Math.floor(Math.random() * (6-1) + 1)

  return (
    <div className={`card${random}`} data-aos="zoom-in-up" data-aos-easing="ease-out">
        <h3>
            {position}
        </h3>
        <h2>{title}</h2>
        <p>
            {detail}
        </p>
    </div>
  )
}
