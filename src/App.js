import React from 'react'
// import Container from './components/Container';
import Login from './components/Login';
import Nav from './components/Nav';
import Signup from './components/Signup';
import Upload from './components/Upload';

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Notes from './components/NotesPage/Notes';
import Footer from './components/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { HashLoader, PropagateLoader, PulseLoader } from "react-spinners"
import AuthProvider from './context/AuthContext';
import DataProvider from './context/DataContext';
import ErrorPage from './ErrorPage';
import { useState } from 'react';
import { useEffect } from 'react';
import UserSettings from './UserSettings';
import ResetPass from './ResetPass';
import Home from './Home';
import AddData from './components/AddData';
import { NotStudentNotes } from './components/NotStudentNotes';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { TakeARest } from './components/TakeARest';
import { Forum } from './components/Forum/Forum';
import RouteWithNavBar from './Route/RouteWithNavBar';


function App(props) {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2500);
  }, [])
  
  // state passed as props to other components, used to manage Nav bar display on certain pages.
  // Only display Nav bar on a component if set to true
  const [showNav, setShowNav] = useState(true)

  
  return (
        <Router>
          {/* turned loader to enable app data from AuthContext to load before displaying */}
          {loading 
          
          ?
    
          // loader from react-spinners
          <div className='loader'>
            <HashLoader loading={loading} className='test'/>
          </div>
          
          :
            
          <div>
          <AuthProvider>
            <DataProvider>
              {/* {showNav && 
              
              <Nav />
    
              } */}
              <Routes >
                <Route exact path="/" element={<Home showNav={setShowNav}/> } /> 
    
                {/* PROTECTED ROUTES: Only logged in Users can access  */}
                <Route path="/addusername" element={<AddData showNav={setShowNav}/>}    />
                <Route path="/games" element={<TakeARest showNav={setShowNav}/>}    />
                <Route path="/forum" element={<Forum showNav={setShowNav}/>}    />
                <Route path="/admin" element={<AdminDashboard showNav={setShowNav}/>}    />
                {/* Protected Route end... */}
    
                <Route path="/signup" element={<Signup showNav={setShowNav}/>} />  

                {/* Routes with Side Nav Bar */}
                <Route element={<RouteWithNavBar />}>
                  <Route path="/notes" element={<Notes />} />  
                  <Route path="/upload" element={<Upload />}    />
                  <Route path="/:userName/settings" element={<UserSettings />}    />
                  <Route exact path="/not-student" element={<NotStudentNotes showNav={setShowNav}/>} />  
                </Route>

                <Route path="/login" element={<Login />}    />
                <Route path="/reset" element={<ResetPass showNav={setShowNav}/>}    />
                <Route path="*" element={<ErrorPage showNav={setShowNav}/>}    />
              </Routes>
              {/* {showNav && 
              <Footer />
              } */}
            </DataProvider>
          </AuthProvider>
          <ToastContainer
          autoClose={3000}
          />
          </div>
      }
        </Router>
    
      );
    }
    
    export default App;

// import React from 'react'
// // import Container from './components/Container';
// import Login from './components/Login';
// import Nav from './components/Nav';
// import Signup from './components/Signup';
// import Upload from './components/Upload';

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import Notes from './components/NotesPage/Notes';
// import Footer from './components/Footer';

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import { HashLoader, PropagateLoader, PulseLoader } from "react-spinners"
// import AuthProvider from './context/AuthContext';
// import DataProvider from './context/DataContext';
// import ErrorPage from './ErrorPage';
// import { useState } from 'react';
// import { useEffect } from 'react';
// import UserSettings from './UserSettings';
// import ResetPass from './ResetPass';
// import Home from './Home';
// import AddData from './components/AddData';
// import { NotStudentNotes } from './components/NotStudentNotes';
// import { AdminDashboard } from './components/Dashboard/AdminDashboard';
// import { TakeARest } from './components/TakeARest';
// import { Forum } from './components/Forum/Forum';


// function App(props) {
//   const [loading, setLoading] = useState(false)
//   useEffect(() => {
//     setLoading(true)
//     setTimeout(() => {
//       setLoading(false)
//     }, 2500);
//   }, [])

//   // state passed as props to other components, used to manage Nav bar display on certain pages.
//   // Only display Nav bar on a component if set to true
//   const [showNav, setShowNav] = useState(true)

  
//   return (
//     <Router>
//       {/* turned loader to enable app data from AuthContext to load before displaying */}
//       {loading 
      
//       ?

//       // loader from react-spinners
//       <div className='loader'>
//         <HashLoader loading={loading} className='test'/>
//       </div>
      
//       :
        
//       <div>
//       <AuthProvider>
//         <DataProvider>
//           {showNav && 
          
//           <Nav />

//           }
//           <Routes >
//             <Route exact path="/" element={<Home showNav={setShowNav}/> } /> 

//             {/* PROTECTED ROUTES: Only logged in Users can access  */}
//             <Route exact path="/notes" element={<Notes showNav={setShowNav}/>} />  
//             <Route exact path="/not-student" element={<NotStudentNotes showNav={setShowNav}/>} />  
//             <Route path="/addusername" element={<AddData showNav={setShowNav}/>}    />
//             <Route path="/upload" element={<Upload />}    />
//             <Route path="/:userName/settings" element={<UserSettings />}    />
//             <Route path="/games" element={<TakeARest showNav={setShowNav}/>}    />
//             <Route path="/forum" element={<Forum showNav={setShowNav}/>}    />
//             <Route path="/admin" element={<AdminDashboard showNav={setShowNav}/>}    />
//             {/* Protected Route end... */}

//             <Route path="/signup" element={<Signup showNav={setShowNav}/>} />  
//             <Route path="/login" element={<Login showNav={setShowNav}/>}    />
//             <Route path="/reset" element={<ResetPass showNav={setShowNav}/>}    />
//             <Route path="*" element={<ErrorPage showNav={setShowNav}/>}    />
//           </Routes>
//           {showNav && 
//           <Footer />
//           }
//         </DataProvider>
//       </AuthProvider>
//       <ToastContainer
//       autoClose={3000}
//       />
//       </div>
//   }
//     </Router>

//   );
// }

// export default App;
