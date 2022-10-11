import React from 'react'
import { NavLink, Link } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'
import { FaBars, FaTimes } from "react-icons/fa"
import { useData } from '../../context/DataContext'
import { NavHashLink } from 'react-router-hash-link'

export default function TopNav() {
    const { user } = useAuth()
    const { hideNav, setHideNav} = useData()

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
                <li><NavLink to="/">Home</NavLink></li>
            </ul>
            <ul>
                <li><NavHashLink smooth to="#howTo">HOw-to</NavHashLink></li>
                <li><a href='mailto:imamddahir@gmail.com?subject=Feedback on getNOTES'>Contact us</a></li>
                <li><NavHashLink to="#feedback">Feedback</NavHashLink></li>
                {!user && <li><NavLink to="/login">sign-in</NavLink></li>}
                {user && <li><NavLink to="/notes" >get NOTES</NavLink></li>}
            </ul>
        </div>
    </div>
  )
}
