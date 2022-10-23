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


    const { navigate, user } = useAuth()
    const { userInfo, setHideNav } = useData();

    // state to manage accordions
    const [showCPE, setShowCPE] = useState(false)
    const [showEEE, setShowEEE] = useState(false)
    const [showOthers, setShowOthers] = useState(false)

    // State to save notes based on category
    const [otherNotes, setOtherNotes] = useState([])
    const [cpeNotes, setCPENotes] = useState([])
    const [cpeNotes100, setCPENotes100] = useState([])
    const [cpeNotes200, setCPENotes200] = useState([])
    const [cpeNotes300, setCPENotes300] = useState([])
    const [cpeNotes400, setCPENotes400] = useState([])
    const [cpeNotes500, setCPENotes500] = useState([])
    

    const [eeeNotes, setEEENotes] = useState([])


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
    const fetchCPENotes = async (level, setLevel) => {
        try{
            const q = query(collection(database, "noteDetails"), where("category", "==", "Computer Engineering"), where("level", "==", `${level}`))
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

    // FETCH Notes on load
    useEffect(() => {
        
        
        // function to Fetch Notes in EEE category
        const fetchEEENotes = async () => {
            try{
                const q = query(collection(database, "noteDetails"), where("category", "==", "Electrical & Electronics Engineering"))
                await onSnapshot(q,snapShot => {
                    setEEENotes(snapShot.docs.map(data => ({
                    ...data.data(),
                    id: data.id
                })))
            })
        }
        catch(err){
            console.log(err.message)
        };
        }

        const fetchOtherNotes = async () => {
            try{
            const q = query(collection(database, "noteDetails"), where("category", "==", "Others"))
            await onSnapshot(q,snapShot => {
                setOtherNotes(snapShot.docs.map(data => ({
                    ...data.data(),
                    id: data.id
                })))
            })
        }
        catch(err){
            console.log(err.message)
        }

        }
        fetchCPENotes(100, setCPENotes100)
        fetchCPENotes(200, setCPENotes200)
        fetchCPENotes(300, setCPENotes300)
        fetchCPENotes(400, setCPENotes400)
        fetchCPENotes(500, setCPENotes500)
    }, [user])

    // style to centralize the Note loader animation in center
    const mystyle = {
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }

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

  return (
    <div id='notes' className="notes--container" onClick={() => setHideNav(true)} data-aos="flip-right" data-aos-easing="ease-out">
        {!user 
        
        ? 
        
        <div style={mystyle}>
            <h3>Loading Notes...</h3>
            <PropagateLoader />
        </div>

        :

        <div className='accordion--container'>
            {userInfo.department === 'Computer Engineering' 
            &&
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => showCategory(showCPE, setShowCPE)}>
                    <h2> Computer Engineering </h2>
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
            }
            
            {userInfo.department === 'Electrical & Electronics Engineering' 
            && 
            <div className='accordion' onClick={() => setShowEEE(!showEEE)}>
                <div className='accordion--tab'>
                    <h2>Electrical &amp; Electronics Engineering</h2>
                    {!showEEE && <h2 ><IoIosArrowForward /></h2>}
                    {showEEE && <h2><IoIosArrowDown /></h2>}
                </div>
                {showEEE && 
                <div className='notes--detail'>
                    {/* map through the `cpe`NOTES state and display the Notes if available */}
                    {eeeNotes.length > 0
                    ?
                    eeeNotes.map((notes, index) => {
                        return <div key={index}>
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
                    <p>NO NOTES</p>
                    }
                </div>
                }
            </div>
        }
        <p>Click to Expand</p>
        </div>
    }
    </div>
  )
}
