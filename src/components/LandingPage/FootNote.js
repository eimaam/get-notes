import React from 'react'

export default function FootNote() {
  return (
    <div className='header--footer'>
        <div>
            <ul>
                <li>Quick Links:</li>
                <li>HOW-TO</li>
                <li>getNOTES</li>
                <li>SIGN IN</li>
                <li>HOME</li>
            </ul>
            <ul>
                <li>Reach us:</li>
                <li>Mail: </li>
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
