import React from 'react'
import { useEffect } from 'react';

// AOS import
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..

export default function Feedback() {
  useEffect(() => {
    AOS.init({delay: 250})
  }, [])
  
  return (
    <section id='feedback' data-aos="fade-up" data-aos-easing="ease-out">
        <div>
            <h2>Got question(s)? Enquiries? or a Feedback?</h2>
            <p>We'd love to hear from you! Use the button to reach us.</p>
        </div>
        <button>
            <a href='mailto:imamddahir@gmail.com?subject="Feedback on getNOTES'> 
            Send us a mail
            </a>
        </button>
    </section>
  )
}
