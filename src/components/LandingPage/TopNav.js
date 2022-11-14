import React from 'react'
import { Link } from "react-router-dom"
import { useAuth } from '../../contexts/AuthContext'
import { FaBars, FaTimes } from "react-icons/fa"
import { HashLink } from 'react-router-hash-link'

export default function TopNav() {
    const { user } = useAuth()

    // Mobile Navigation toggle
  function toggleNav(){    
    const hamburger = document.getElementById("showNavIcon") 
    const closeNav = document.getElementById("hideNavIcon");
    const mNav = document.getElementById("mNavHeader");
 
    // switching between toggle icons on click from display block to display none
    if(mNav.style.display !== "flex"){
        mNav.style.display = "flex"
        hamburger.style.display = "none"
        closeNav.style.display = "block"
    }else{
        mNav.style.display = "none"
        hamburger.style.display = "block"
        closeNav.style.display = "none"
    }
  }
// //
  return (
    <div id='top--nav'>
            <FaBars id='showNavIcon' onClick={toggleNav}/>
            <FaTimes id='hideNavIcon' onClick={toggleNav}/>
        <div id='mNavHeader'>
            <ul>
                <li><Link to="/">Home</Link></li>
            </ul>
            <ul>
                <li><HashLink smooth to="#howTo">How-to</HashLink></li>
                <li><a href='mailto:imamddahir@gmail.com?subject=Feedback on getNOTES'>Contact us</a></li>
                <li><a href='/forum'>Forum</a></li>
                <li><HashLink smooth to="#feedback">Feedback</HashLink></li>
                {!user && <li><Link to="/login">sign-in</Link></li>}
                {user && <li><Link to="/notes" >get NOTES</Link></li>}
            </ul>
        </div>
    </div>
  )
}
