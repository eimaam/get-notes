import React from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

export default function FootNote() {
  return (
    <div className='header--footer'>
        <div>
            <ul>
                <li>Quick Links:</li>
                <li><a href="/games"> Play Games </a></li>
                <li><HashLink to="#howTo"> HOW-TO</HashLink></li>
                <li><Link to="notes">getNOTES</Link></li>
                <li><Link to="upload">Upload Notes</Link></li>
                <li><Link to="login">Sign in</Link></li>
            </ul>
            <ul>
                <li>Reach us:</li>
                <li>Mail: leadtechie@gmail.com</li>
                <li>Twitter</li>
                <li><a href='wa.me/+2348068375557'> WhatsApp</a></li>
            </ul>
            <ul>
                <li>More From Tech Desk:</li>
                <li><a href="https://whats-link-eimaam.vercel.app" rel='noopener noreferrer' target="_blank">Whats-Link</a></li>
                <li><a href="https://get-quotes-eimaam.vercel.app" rel='noopener noreferrer' target="_blank">Daily Quotes</a></li>
                <li>Tub-Vidz</li>
            </ul>
        </div>
        <div>
            {/* <p>Credits: .......</p> */}
            <p>All rights reserved.</p>
            <p>Tech Desk Inc. &copy; 2022</p>
        </div>
    </div>
  )
}
