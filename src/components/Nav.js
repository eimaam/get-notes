import React from 'react';
import { Link, NavLink, useParams } from "react-router-dom"
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useEffect } from 'react';
import { FaBars, FaTimes, FaUser, FaUserCog, FaSignOutAlt} from 'react-icons/fa';
import { TbBookDownload, TbBookUpload } from 'react-icons/tb';
import { RiHome4Line } from 'react-icons/ri';
// import { RiUserSettingsLine, RiUser } from 'react-icons/ri';


export default function Nav() {

  const { userInfo, fetchUserDetail, setHideNav, hideNav } = useData();
  const { logOut, user } = useAuth();
  
  useEffect(() => {
    fetchUserDetail()
  }, [user])

  
// Mobile Navigation toggle
  function toggleNav(){    
    const hamburger = document.getElementById("showNav") 
    // const mNav = document.getElementById("mNav");
    const closeNav = document.getElementById("hideNav");
 
    // switching between toggle icons on click from display block to display none
    if(hamburger.style.display != "none"){
        setHideNav(!hideNav)
        hamburger.style.display = "none"
        closeNav.style.display = "block"
    }else{
        setHideNav(true)
        hamburger.style.display = "block"
        closeNav.style.display = "none"
    }
  }
// //

  return (
    <React.StrictMode>
    <nav id='nav'>
      {user 
      && 
      userInfo.username ? <h3><FaUser />  : @{userInfo.username}</h3> 
      : 
      user && <i>{userInfo.email}</i>
      }
        <ul>
          <NavLink to="/">
            <li>
              <RiHome4Line /> 
              HOME
            </li>
          </NavLink>
          <NavLink to="/notes">
            <li>
              <TbBookDownload /> 
              GET NOTES
            </li>
          </NavLink>
          <NavLink to="/upload">
            <li><TbBookUpload /> Upload Notes</li>
          </NavLink>
        </ul>
        {user &&
          <div className='nav--buttons--container'>
            <button onClick={logOut}>
              Sign out 
              <FaSignOutAlt />
            </button>
            <button>
              <Link to={userInfo.username+'/settings'} className='nav--buttons--Link'>  
                settings 
                <FaUserCog />
              </Link>
            </button>
          </div>
        }
          <div className='support'>
            <p>Contact Support:</p>
            <p>1leadtechie@gmail.com</p>
          </div>
        <FaBars id='showNav' onClick={toggleNav}/>
        <FaTimes id='hideNav' onClick={toggleNav}/>
    </nav>

{/* MOBILE NAVIGATION MENU */}
    {!hideNav &&
    <div id='mNav'>
      {user 
      && 
      userInfo.username ? <div><h3><FaUser /> : @{userInfo.username}</h3> </div>
      :  
      user && <i>{userInfo.email}</i>
      }
      <ul>
          <NavLink to="/">
            <li>
              <RiHome4Line /> 
              HOME
            </li>
          </NavLink>
          <NavLink to="/">
            <li><TbBookDownload /> GET NOTES</li>
          </NavLink>
          <NavLink to="/upload">
          <li><TbBookUpload /> UPLOAD NOTES </li>
          </NavLink>
      </ul>
      {user &&
          <div className='nav--buttons--container'>
            <button onClick={logOut}>
              Sign out 
              <FaSignOutAlt />
            </button>
            <button>
              <Link to='/user/settings' className='nav--buttons--Link'> 
                settings 
                <FaUserCog /> 
              </Link>
              </button>
          </div>
        }
          <div>
            <p>Contact Support:</p>
            <p>1leadtechie@gmail.com</p>
          </div>
    </div>
    }
    </React.StrictMode>
  )
}
