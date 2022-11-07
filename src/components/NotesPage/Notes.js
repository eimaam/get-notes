import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { auth } from '../../firebaseConfig'
import { collection, onSnapshot, query, Timestamp, where } from 'firebase/firestore'
import { database } from '../../firebaseConfig'
import { HashLoader } from 'react-spinners'
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'
import { GiWhiteBook } from 'react-icons/gi'
import { NotesLayout } from './NotesLayout'

// AOS import
import 'aos/dist/aos.css'; // You can also use <link> for styles


export default function Notes() {

    const { isLogged, setIsLogged, navigate, user, loading, setLoading } = useAuth()
    const { userInfo, setHideNav, fetchUserDetail } = useData();

    // state to manage accordions: setting show and hide
    const [showLectureNotes, setShowLectureNotes] = useState(false)
    const [showOtherNotes, setShowOtherNotes] = useState(false)
    const [showExtras, setShowExtras] = useState(false)

    // State to save notes based on category
    const [lectureNotes100, setLectureNotes100] = useState([])
    const [lectureNotes200, setLectureNotes200] = useState([])
    const [lectureNotes300, setLectureNotes300] = useState([])
    const [lectureNotes400, setLectureNotes400] = useState([])
    const [lectureNotes500, setLectureNotes500] = useState([])

    // state to save other notes category based on level
    const [otherNotes100, setOtherNotes100] = useState([])
    const [otherNotes200, setOtherNotes200] = useState([])
    const [otherNotes300, setOtherNotes300] = useState([])
    const [otherNotes400, setOtherNotes400] = useState([])
    const [otherNotes500, setOtherNotes500] = useState([])

    // state to save extras
    const [extraNotes, setExtraNotes] = useState([])

    // check if user has username
    useEffect(() => {
        // fetchUserDetail()
        if(userInfo.username != undefined){
            setLoading(true)
            userInfo.student === "no" ? navigate('./not-student') : navigate('./notes')
        }else if(userInfo.username === undefined){
            return navigate('/addusername')
        }
    }, [userInfo])

    console.log(userInfo.username)
    // function to Fetch Notes in based on Department category
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

    // function to Fetch Other Notes category
    const fetchOtherNotes = async (level, setLevel) => {
        try{
            const q = query(collection(database, "noteDetails"), where("category", "==", `others`), where("level", "==", `${level}`))
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

    // function to Fetch Extras category (a general category) 
    const fetchExtras = async () => {
        try{
            const q = query(collection(database, "noteDetails"), where("category", "==", "extras"))
            await onSnapshot(q,snapShot => {
                setExtraNotes(snapShot.docs.map(data => ({
                ...data.data(),
                id: data.id
            })))
        })
    }
    catch(err){
        console.log(err.message)
    };

    }

    // Function to get All notes
    const getAllNotes = () => {
        fetchNotes(100, setLectureNotes100)
        fetchNotes(200, setLectureNotes200)
        fetchNotes(300, setLectureNotes300)
        fetchNotes(400, setLectureNotes400)
        fetchNotes(500, setLectureNotes500)
        fetchOtherNotes(100, setOtherNotes100)
        fetchOtherNotes(200, setOtherNotes200)
        fetchOtherNotes(300, setOtherNotes300)
        fetchOtherNotes(400, setOtherNotes400)
        fetchOtherNotes(500, setOtherNotes500)
        fetchExtras()
    }

    // Get all Notes all notes
    useEffect(() => {
        setLoading(true)
        getAllNotes()
        setTimeout(() => {
            setLoading(false)
        }, 5000);
    }, [userInfo])
    
    // display Levels 
    function showCategory(cat, setCat){
        !cat ? setCat(true) : setCat(false)
    }
    
    // function to show or hide each levels list of notes
    function toggleLevelNotes(id){
        let level = document.getElementById(id)
        
        level.style.display !== "block" 
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
        color: "black",
    }

  return (
    <div id='notes' className="notes--container" onClick={() => setHideNav(true)} data-aos="flip-right" data-aos-easing="ease-out">
        {!isLogged && loading 
        
        ? 
        
        <div style={mystyle}>
            <h3>Loading Notes...</h3>
            <HashLoader />
        </div>

        :
        <>
        <div className='accordion--container'>
            {/* Main 
                    Lecture 
                        Notes */}
            <div id='header' className='accordion'>
                <div className='accordion--tab' onClick={(e) => showCategory(showLectureNotes, setShowLectureNotes)}>
                    <h2> {userInfo.department} Notes</h2>
                    {!showLectureNotes && <h2><IoIosArrowForward /></h2>}
                    {showLectureNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showLectureNotes && 
                
                // {/* 100 
                //         level
                //             notes */}
                <div>
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="100"
                        id='Level1'
                        show={showLectureNotes}
                        noteSet={lectureNotes100}
                    />
                    
                    {/* 200 
                        level
                            notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="200"
                        id='Level2'
                        show={showLectureNotes}
                        noteSet={lectureNotes100}
                    />

                    {/* 300 
                        level
                            notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="300"
                        id='Level3'
                        show={showLectureNotes}
                        noteSet={lectureNotes300}
                    />

                    {/* 400 
                        level
                            notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="400"
                        id='Level4'
                        show={showLectureNotes}
                        noteSet={lectureNotes100}
                    />
                    
                    {/* 500 
                        level
                            notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="500"
                        id='Level5'
                        show={showLectureNotes}
                        noteSet={lectureNotes100}
                    />
                    {/* end of levels */}
                </div>

                }

            </div>
        </div>
        {/* Other Notes
                Past Q, Assignments etc 
                        Category */}
        <div className='accordion--container'>
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => showCategory(showOtherNotes, setShowOtherNotes)}>
                    <h2> Test Solutions, Past Questions, Assignments, Summary...</h2>
                    {!showOtherNotes && <h2><IoIosArrowForward /></h2>}
                    {showOtherNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showOtherNotes && 
                <div>
                    {/* 100 
                        level
                        other notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="100"
                        id='others1'
                        show={showOtherNotes}
                        noteSet={otherNotes100}
                    />
                    
                    {/* 200 
                        level
                        other notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="200"
                        id='others2'
                        show={showOtherNotes}
                        noteSet={otherNotes200}
                    />

                    {/* 300 
                        level
                            other notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="300"
                        id='others3'
                        show={showOtherNotes}
                        noteSet={otherNotes300}
                    />
                    {/* 400 
                        level
                            other notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="400"
                        id='others4'
                        show={showOtherNotes}
                        noteSet={otherNotes300}
                    />
                    
                    {/* 500 
                        level
                            other notes */}
                    <NotesLayout 
                        toggleFunc={toggleLevelNotes}
                        level="500"
                        id='others5'
                        show={showOtherNotes}
                        noteSet={otherNotes300}
                    />
                    {/* end of levels */}
                </div>
                }
            </div>
        </div>

        {/* Extras category
                Calendars, Announcements etc */}
        <div className='accordion--container'>
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => showCategory(showExtras, setShowExtras)}>
                    <h2> Extras: Time Table, Annoucements etc.</h2>
                    {!showExtras && <h2><IoIosArrowForward /></h2>}
                    {showExtras && <h2><IoIosArrowDown /></h2>}
                </div>
                {showExtras && 
                <div>
                    <div className='notes--detail'>
                            <div>
                                {extraNotes.length > 0 
                                    ?
                                extraNotes.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    
                                                    <GiWhiteBook />{notes.noteName.length > 40 
                                                            ? notes.noteName.slice(0,50) + '...' : notes.noteName}
                                                    <small><i> ({notes.type})</i></small> 
                                                </p>
                                                <div>
                                                    <small>Upload Date: {notes.uploadDate}</small>
                                                    <small>Uploaded By: {notes.uploadedBy}</small>
                                                    <button>
                                                        <a href={notes.url}>Download</a>
                                                    </button>
                                                </div>
                                            </div>
                                            })
                                    :
                                <p>NO NOTE ADDED YET... Help us upload one. 😊</p>
                                }
                            </div>
                    </div>
                    
                    {/* end of levels */}
                </div>
                }
            </div>
        </div>



        </>
        }
    </div>     
  )
}
