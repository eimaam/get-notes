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

// AOS import
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..

export default function Notes(props) {


    const { navigate, user, loading, setLoading } = useAuth()
    const { userInfo, setHideNav } = useData();

    // state to manage accordions
    const [showOtherNotes, setShowOtherNotes] = useState(false)
    const [showCPE, setShowCPE] = useState(false)

    // State to save notes based on category
    const [cpeNotes100, setCPENotes100] = useState([])
    const [cpeNotes200, setCPENotes200] = useState([])
    const [cpeNotes300, setCPENotes300] = useState([])
    const [cpeNotes400, setCPENotes400] = useState([])
    const [cpeNotes500, setCPENotes500] = useState([])
    const [otherNotes, setOtherNotes] = useState([])
    
    // check status of User session - logged or not
    useEffect(() => {
        props.showNav(true)
        onAuthStateChanged(auth, data => {
            if(!data){
                navigate('../login')
            }
        })
    }, [props.showNav])

    // function to Fetch Notes in CPE category
    const fetchNotes = async (level, setLevel) => {
        try{
            const q = query(collection(database, "noteDetails"), where("category", "==", `${userInfo.department}`), where("level", "==", `${level}`))
            await onSnapshot(q,snapShot => {
                setLevel(snapShot.docs.map(data => ({
                ...data.data(),
                id: data.id
            })))
        })
    }
    catch(err){
        console.log(err.message)
    };

    }

    // function to Fetch Other Notes (a general category) 
    const fetchOtherNotes = async () => {
        try{
            const q = query(collection(database, "noteDetails"), where("category", "==", "others"))
            await onSnapshot(q,snapShot => {
                setOtherNotes(snapShot.docs.map(data => ({
                ...data.data(),
                id: data.id
            })))
        })
    }
    catch(err){
        console.log(err.message)
    };

    }

    // FETCH Notes on load
    useEffect(() => {
        setLoading(true)
        fetchNotes(100, setCPENotes100)
        fetchNotes(200, setCPENotes200)
        fetchNotes(300, setCPENotes300)
        fetchNotes(400, setCPENotes400)
        fetchNotes(500, setCPENotes500)
        fetchOtherNotes()

        setTimeout(() => {
            setLoading(false)
        }, 4000);
    }, [userInfo])

    
    // display Levels 
    function showCategory(cat, setCat){
        !cat ? setCat(true) : setCat(false)
    }
    
    // function to show or hide each levels list of notes
    function toggleLevelNotes(id){
        let level = document.getElementById(id)
        
        level.style.display != "block" 
        ? level.style.display = "block" 
        : level.style.display = "none"
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
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => showCategory(showCPE, setShowCPE)}>
                    <h2> {userInfo.department} Notes</h2>
                    {!showCPE && <h2><IoIosArrowForward /></h2>}
                    {showCPE && <h2><IoIosArrowDown /></h2>}
                </div>
                {showCPE && 
                <div>
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`Level1`)}>
                                <h2> 100 Level </h2>
                                {showCPE && <h2><IoIosArrowForward /></h2>}
                                {!showCPE && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level1'>
                                {cpeNotes100.length > 0 
                                    ?
                                cpeNotes100.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                            <small><i> ({notes.type})</i></small> 
                                                    </span>
                                                </p>
                                                <div>
                                                    <small>Upload Date: {notes.uploadDate}</small>
                                                    <small>Uploaded By: ({notes.uploadedBy})</small>
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
                    
                    {/* 200 
                        level
                            notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`Level2`)}>
                                <h2> 200 Level </h2>
                                {showCPE && <h2><IoIosArrowForward /></h2>}
                                {!showCPE && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level2'>
                                {cpeNotes200.length > 0 
                                    ?
                                cpeNotes200.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                            <small><i> ({notes.type})</i></small> 
                                                    </span>
                                                </p>
                                                <div>
                                                    <small>Upload Date: {notes.uploadDate}</small>
                                                    <small>Uploaded By: ({notes.uploadedBy})</small>
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

                    {/* 300 
                        level
                            notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`Level3`)}>
                                <h2> 300 Level </h2>
                                {showCPE && <h2><IoIosArrowForward /></h2>}
                                {!showCPE && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level3'>
                                {cpeNotes300.length > 0 
                                    ?
                                cpeNotes300.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                            <small><i> ({notes.type})</i></small> 
                                                    </span>
                                                </p>
                                                <div>
                                                    <small>Upload Date: {notes.uploadDate}</small>
                                                    <small>Uploaded By: ({notes.uploadedBy})</small>
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

                    {/* 400 
                        level
                            notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`Level4`)}>
                                <h2> 400 Level </h2>
                                {showCPE && <h2><IoIosArrowForward /></h2>}
                                {!showCPE && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level4'>
                                {cpeNotes400.length > 0 
                                    ?
                                cpeNotes400.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                            <small><i> ({notes.type})</i></small> 
                                                    </span>
                                                </p>
                                                <div>
                                                    <small>Upload Date: {notes.uploadDate}</small>
                                                    <small>Uploaded By: ({notes.uploadedBy})</small>
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
                    
                    {/* 500 
                        level
                            notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`Level5`)}>
                                <h2> 500 Level </h2>
                                {showCPE && <h2><IoIosArrowForward /></h2>}
                                {!showCPE && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level5'>
                                {cpeNotes500.length > 0 
                                    ?
                                cpeNotes500.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                            <small><i> ({notes.type})</i></small> 
                                                    </span>
                                                </p>
                                                <div>
                                                    <small>Upload Date: {notes.uploadDate}</small>
                                                    <small>Uploaded By: ({notes.uploadedBy})</small>
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
                    {/* end of levels */}
                </div>
                }
            </div>

            {/* OTHER 
                        NOTES */}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => showCategory(showOtherNotes, setShowOtherNotes)}>
                    <h2> Other Notes: Time Table, Annoucements etc.</h2>
                    {!showOtherNotes && <h2><IoIosArrowForward /></h2>}
                    {showOtherNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showOtherNotes && 
                <div>
                    <div className='notes--detail'>
                            <div id='Level1'>
                                {otherNotes.length > 0 
                                    ?
                                otherNotes.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                                            <small><i> ({notes.type})</i></small> 
                                                    </span>
                                                </p>
                                                <div>
                                                    <small>Upload Date: {notes.uploadDate}</small>
                                                    <small>Uploaded By: ({notes.uploadedBy})</small>
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
                    
                    {/* end of levels */}
                </div>
                }
            </div>
           
        {!showCPE && <p>Click to Expand</p>}
        </div>
    }
    </div>
  )
}
