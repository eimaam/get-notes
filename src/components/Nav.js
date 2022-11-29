import React from 'react';
import { Link, NavLink } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useEffect } from 'react';
import { FaBars, FaTimes, FaUser, FaUserCog, FaSignOutAlt, FaGamepad} from 'react-icons/fa';
import { TbBookDownload, TbBookUpload } from 'react-icons/tb';
import { RiHome4Line } from 'react-icons/ri';
import { GrGamepad } from 'react-icons/gr';
import { MdOutlineForum } from 'react-icons/md';
import { HashLoader } from 'react-spinners';
// import { RiUserSettingsLine, RiUser } from 'react-icons/ri';


export default function Nav() {

  const { userInfo, setHideNav, hideNav } = useData();
  const { logOut, user } = useAuth();

  
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

if(userInfo === undefined){
  return <div>
              <h3>Loading Notes...</h3>
              <HashLoader />
          </div>
}

  return (
    <React.StrictMode>
    <nav id='nav'>
      {user 
      && 
      userInfo.username ? <h3><FaUser />  : @{userInfo.username}</h3> 
      : 
      user && <i>{userInfo.email}</i>
      }
        <ul data-aos="fade" data-aos-easing="ease-out">
          <NavLink to="/">
            <li>
              <RiHome4Line /> 
              Home
            </li>
          </NavLink>
          <NavLink to="/notes">
            <li>
              <TbBookDownload /> 
              Get Notes
            </li>
          </NavLink>
          <NavLink to="/upload">
            <li><TbBookUpload /> Upload Notes</li>
          </NavLink>
          <NavLink to="/games">
            <li><GrGamepad /> Take-A-Rest</li>
          </NavLink>
          <NavLink to="/forum">
            <li><MdOutlineForum />Forum</li>
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
            <p><Link to='mailto:imamddahir@gmail.com?subject=Feedback on getNOTES'>1LEADTECHIE@GMAIL.COM</Link></p>
          </div>
        <FaBars id='showNav' onClick={toggleNav}/>
        <FaTimes id='hideNav' onClick={toggleNav}/>
    </nav>

{/* MOBILE NAVIGATION MENU */}
    {!hideNav &&
    <div id='mNav' >
      {user 
      && 
      userInfo.username ? <div><h3><FaUser /> : @{userInfo.username}</h3> </div>
      :  
      user && <i>{userInfo.email}</i>
      }
      <ul>
          <NavLink to="/">
            <li>
            🏠 Home
            </li>
          </NavLink>
          <NavLink to="/notes">
            <li>📚 Get Notes</li>
          </NavLink>
          <NavLink to="/upload">
            <li>🚀 Upload Notes </li>
          </NavLink>
          <NavLink to="/games">
            <li>🎮 Take-A-Rest</li>
          </NavLink>
          <NavLink to="/forum">
            <li>💬 Forum</li>
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
