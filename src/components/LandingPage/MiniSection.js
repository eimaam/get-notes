import React from 'react'
import { useEffect } from 'react';



export default function MiniSection(props) {
  
  
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

