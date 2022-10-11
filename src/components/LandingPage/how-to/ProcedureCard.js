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

  const random = Math.floor(Math.random() * (6-1) + 1)
  console.log(random)
  return (
    <div className={`card${random}`} data-aos="zoom-in-up">
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
