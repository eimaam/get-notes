import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { auth } from '../firebaseConfig'
import { collection, onSnapshot, query, Timestamp, where } from 'firebase/firestore'
import { database } from '../firebaseConfig'
import { PropagateLoader } from 'react-spinners'
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'
import { GiWhiteBook } from 'react-icons/gi'

export const NotStudentNotes = (props) => {
    const { navigate, user, loading, setLoading } = useAuth()
    const { userInfo, setHideNav, fetchUserDetail } = useData();

    // save note states
    const [aeeNotes, setAeeNotes] = useState([])
    const [cweNotes, setCweNotes] = useState([])
    const [cheNotes, setCheNotes] = useState([])
    const [cpeNotes, setCpeNotes] = useState([])
    const [eeeNotes, setEeeNotes] = useState([])
    const [fstNotes, setFstNotes] = useState([])
    const [meeNotes, setMeeNotes] = useState([])

    // hide/show category state managers
    const [showAeeNotes, setShowAeeNotes] = useState(false)
    const [showCpeNotes, setShowCpeNotes] = useState(false)
    const [showCweNotes, setShowCweNotes] = useState(false)
    const [showCheNotes, setShowCheNotes] = useState(false)
    const [showEeeNotes, setShowEeeNotes] = useState(false)
    const [showFstNotes, setShowFstNotes] = useState(false)
    const [showMeeNotes, setShowMeeNotes] = useState(false)

  const fetchNotes = async (department, state) => {
    try{
        const q = query(collection(database, "noteDetails"), where("category", "==", `${department}`))
        await onSnapshot(q,snapShot => {
            state(snapShot.docs.map(data => ({
            ...data.data(),
            id: data.id
        })))
    })
}
catch(err){
    console.log(err.message)
};

}

useEffect(() => {
    // setLoading(true)
    fetchUserDetail()
    if(userInfo.username != undefined){
        setLoading(true)
        userInfo.student === "no" ? navigate('./not-student') : navigate('./notes')
    }else if(userInfo.username === undefined){
            setLoading(false)
            navigate('./addusername')
    }
    
}, [userInfo, props.showNav])

useEffect(() => {
  setLoading(true)
  if(!user){
    return navigate('./login')
  }
  if(userInfo.student === "yes"){
    return navigate('./notes')
  }
  
  fetchAllNotes()

  setTimeout(() => {
      setLoading(false)
  }, 4000);

}, [loading, user])


const fetchAllNotes = () => {
    fetchNotes("agricultural engineering", setCpeNotes)
  fetchNotes("civil engineering", setCweNotes)
  fetchNotes("chemical engineering", setCheNotes)
  fetchNotes("computer engineering", setCpeNotes)
  fetchNotes("electrical & electronics engineering", setEeeNotes)
  fetchNotes("food science technology", setFstNotes)
  fetchNotes("mechanical engineering", setMeeNotes)
}


// style to centralize the Note loader animation in center
const mystyle = {
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
}



  return (
    <div id='notes' className="notes--container" onClick={() => setHideNav(true)} data-aos="flip-right" data-aos-easing="ease-out">
        {!user && loading 
        
        ? 
        
        <div style={mystyle}>
            <h3>Loading Notes...</h3>
            <PropagateLoader />
        </div>

        :

        <div className='accordion--container'>

            {/* Agricultural 
                  Engineering  
                      Notes Category*/}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => setShowAeeNotes(!showAeeNotes)}>
                    <h2> Agricultural Engineering & Extension Notes</h2>
                    {!showAeeNotes && <h2><IoIosArrowForward /></h2>}
                    {showAeeNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showAeeNotes && 
                  <div className='notes--detail'>
                      <div >
                          {aeeNotes.length > 0 
                              ?
                          aeeNotes.map((notes, index) => {
                              return <div key={index} className="note--title">
                                          <p>
                                              <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                              {/* Reduce note title/name to max 40 chars  */}
                                              <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                      <small><i> ({notes.type})</i></small> 
                                              </span>
                                          </p>
                                          <div>
                                              <small>Level: {notes.level}</small>
                                              <small>Upload Date: {notes.uploadDate}</small>
                                              {/* <small>Uploaded By: ({notes.uploadedBy})</small> */}
                                              <button>
                                                  <a href={notes.url}>Download</a>
                                              </button>
                                          </div>
                                      </div>
                                      })
                                :
                                <p>NO NOTE ADDED YET</p>
                          }
                      </div>
                  </div>
                }
            </div>

            {/* Civil & Water Resources  
                  Engineering  
                      Notes Category*/}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => setShowCweNotes(!showCweNotes)}>
                    <h2> Civil & Water Resources Engineering Notes</h2>
                    {!showCweNotes && <h2><IoIosArrowForward /></h2>}
                    {showCweNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showCweNotes && 
                  <div className='notes--detail'>
                      <div >
                          {cweNotes.length > 0 
                              ?
                          cweNotes.map((notes, index) => {
                              return <div key={index} className="note--title">
                                          <p>
                                              <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                              {/* Reduce note title/name to max 40 chars  */}
                                              <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                      <small><i> ({notes.type})</i></small> 
                                              </span>
                                          </p>
                                          <div>
                                              <small>Level: {notes.level}</small>
                                              <small>Upload Date: {notes.uploadDate}</small>
                                              {/* <small>Uploaded By: ({notes.uploadedBy})</small> */}
                                              <button>
                                                  <a href={notes.url}>Download</a>
                                              </button>
                                          </div>
                                      </div>
                                      })
                                :
                                <p>NO NOTE ADDED YET</p>
                          }
                      </div>
                  </div>
                }
            </div>

            {/* Chemical   
                  Engineering  
                      Notes Category*/}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => setShowCheNotes(!showCheNotes)}>
                    <h2> Chemical Engineering Engineering Notes</h2>
                    {!showCheNotes && <h2><IoIosArrowForward /></h2>}
                    {showCheNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showCheNotes && 
                  <div className='notes--detail'>
                      <div >
                          {cheNotes.length > 0 
                              ?
                          cheNotes.map((notes, index) => {
                              return <div key={index} className="note--title">
                                          <p>
                                              <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                              {/* Reduce note title/name to max 40 chars  */}
                                              <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                      <small><i> ({notes.type})</i></small> 
                                              </span>
                                          </p>
                                          <div>
                                              <small>Level: {notes.level}</small>
                                              <small>Upload Date: {notes.uploadDate}</small>
                                              {/* <small>Uploaded By: ({notes.uploadedBy})</small> */}
                                              <button>
                                                  <a href={notes.url}>Download</a>
                                              </button>
                                          </div>
                                      </div>
                                      })
                                :
                                <p>NO NOTE ADDED YET</p>
                          }
                      </div>
                  </div>
                }
            </div>

            {/* Computer 
                  Engineering  
                      Notes Category*/}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => setShowCpeNotes(!showCpeNotes)}>
                    <h2> Computer Engineering Notes</h2>
                    {!showCpeNotes && <h2><IoIosArrowForward /></h2>}
                    {showCpeNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showCpeNotes && 
                  <div className='notes--detail'>
                      <div >
                          {cpeNotes.length > 0 
                              ?
                          cpeNotes.map((notes, index) => {
                              return <div key={index} className="note--title">
                                          <p>
                                              <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                              {/* Reduce note title/name to max 40 chars  */}
                                              <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                      <small><i> ({notes.type})</i></small> 
                                              </span>
                                          </p>
                                          <div>
                                              <small>Level: {notes.level}</small>
                                              <small>Upload Date: {notes.uploadDate}</small>
                                              {/* <small>Uploaded By: ({notes.uploadedBy})</small> */}
                                              <button>
                                                  <a href={notes.url}>Download</a>
                                              </button>
                                          </div>
                                      </div>
                                      })
                                :
                                <p>NO NOTE ADDED YET</p>
                          }
                      </div>
                  </div>
                }
            </div>

            {/* Electrical Engineering   
                  Engineering  
                      Notes Category*/}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => setShowEeeNotes(!showEeeNotes)}>
                    <h2> Electrical & Electronics Engineering Notes</h2>
                    {!showEeeNotes && <h2><IoIosArrowForward /></h2>}
                    {showEeeNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showEeeNotes && 
                  <div className='notes--detail'>
                      <div >
                          {eeeNotes.length > 0 
                              ?
                          eeeNotes.map((notes, index) => {
                              return <div key={index} className="note--title">
                                          <p>
                                              <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                              {/* Reduce note title/name to max 40 chars  */}
                                              <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                      <small><i> ({notes.type})</i></small> 
                                              </span>
                                          </p>
                                          <div>
                                              <small>Level: {notes.level}</small>
                                              <small>Upload Date: {notes.uploadDate}</small>
                                              {/* <small>Uploaded By: ({notes.uploadedBy})</small> */}
                                              <button>
                                                  <a href={notes.url}>Download</a>
                                              </button>
                                          </div>
                                      </div>
                                      })
                                :
                                <p>NO NOTE ADDED YET</p>
                          }
                      </div>
                  </div>
                }
            </div>

            {/* Food Science Tech   
                  Engineering  
                      Notes Category*/}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => setShowFstNotes(!showFstNotes)}>
                    <h2> Food Science & Technology Notes</h2>
                    {!showFstNotes && <h2><IoIosArrowForward /></h2>}
                    {showFstNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showFstNotes && 
                  <div className='notes--detail'>
                      <div >
                          {fstNotes.length > 0 
                              ?
                          fstNotes.map((notes, index) => {
                              return <div key={index} className="note--title">
                                          <p>
                                              <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                              {/* Reduce note title/name to max 40 chars  */}
                                              <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                      <small><i> ({notes.type})</i></small> 
                                              </span>
                                          </p>
                                          <div>
                                              <small>Level: {notes.level}</small>
                                              <small>Upload Date: {notes.uploadDate}</small>
                                              {/* <small>Uploaded By: ({notes.uploadedBy})</small> */}
                                              <button>
                                                  <a href={notes.url}>Download</a>
                                              </button>
                                          </div>
                                      </div>
                                      })
                                :
                                <p>NO NOTE ADDED YET</p>
                          }
                      </div>
                  </div>
                }
            </div>

            {/* Mechanical    
                  Engineering  
                      Notes Category*/}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => setShowMeeNotes(!showMeeNotes)}>
                    <h2> Mechanical Engineering </h2>
                    {!showMeeNotes && <h2><IoIosArrowForward /></h2>}
                    {showMeeNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showMeeNotes && 
                  <div className='notes--detail'>
                      <div >
                          {meeNotes.length > 0 
                              ?
                          meeNotes.map((notes, index) => {
                              return <div key={index} className="note--title">
                                          <p>
                                              <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                              {/* Reduce note title/name to max 40 chars  */}
                                              <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                      <small><i> ({notes.type})</i></small> 
                                              </span>
                                          </p>
                                          <div>
                                              <small>Level: {notes.level}</small>
                                              <small>Upload Date: {notes.uploadDate}</small>
                                              {/* <small>Uploaded By: ({notes.uploadedBy})</small> */}
                                              <button>
                                                  <a href={notes.url}>Download</a>
                                              </button>
                                          </div>
                                      </div>
                                      })
                                :
                                <p>NO NOTE ADDED YET</p>
                          }
                      </div>
                  </div>
                }
            </div>
           
        </div>
      }
    </div>
  )
}
