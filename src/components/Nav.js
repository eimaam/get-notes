import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom"
import { RiMenuUnfoldLine, RiMenuFoldLine } from "react-icons/ri"
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { BarLoader } from "react-spinners"
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Nav() {
  const { userInfo, fetchUserDetail, setShowMnav, showMnav } = useData();
  // const [showMnav, setShowMnav] = useState(false);
  const { logOut, user, isLogged } = useAuth();
  
  useEffect(() => {
    fetchUserDetail()
  }, [user])

  
// Mobile Navigation toggle
  function toggleNav(){    
    const hamburger = document.getElementById("showNav") 
    const mNav = document.getElementById("mNav");
    const closeNav = document.getElementById("hideNav");
 
    if(hamburger.style.display != "none"){
        setShowMnav(true)
        hamburger.style.display = "none"
        closeNav.style.display = "block"
    }else{
        setShowMnav(false)
        hamburger.style.display = "block"
        closeNav.style.display = "none"
    }
  }

  return (
    <React.StrictMode>
    <nav id='nav'>
        {userInfo.username ? <h3>{userInfo.username}</h3> : <h3></h3>}
        <ul>
          <NavLink to="/">
            <li>GET NOTES</li>
          </NavLink>
          <NavLink to="/upload">
            <li>Upload Notes</li>
          </NavLink>
        </ul>
        {user &&
          <div className='nav--buttons--container'>
            <button onClick={logOut}>Sign out</button>
            <button><Link to='/user/settings'> settings</Link></button>
          </div>
        }
        <FaBars id='showNav' onClick={toggleNav}/>
        <FaTimes id='hideNav' onClick={toggleNav}/>
    </nav>

    {showMnav &&
    <div id='mNav'>
      {userInfo.username ? <h3>{userInfo.username}</h3> : <h3></h3>}
      <ul>
          <NavLink to="/"><li>GET NOTES</li></NavLink>
          <NavLink to="/upload"><li>Upload Notes</li></NavLink>
      </ul>
      {user &&
          <div className='nav--buttons--container'>
            <button onClick={logOut}>Sign out</button>
            <button><Link to='/user/settings'> settings</Link></button>
          </div>
      }
    </div>
    }
    </React.StrictMode>
  )
}
