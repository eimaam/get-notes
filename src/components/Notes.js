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
    
    // check status of User session - logged or not
    useEffect(() => {
        setLoading(true)
        onAuthStateChanged(auth, data => {
            if(!data){
              navigate('../login')
            }else if(data){
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

            setTimeout(() => {
                setLoading(false)
            }, 5000);
        })
    }, [loading])

    // check if user has username
    useEffect(() => {
        // setLoading(true)
        fetchUserDetail()
        props.showNav(true)
        
        if(userInfo.username != undefined){
            setLoading(true)
            userInfo.student === "no" ? navigate('./not-student') : navigate('./notes')
        }else if(userInfo.username === undefined){
                setLoading(false)
                navigate('./addusername')
        }
        
    }, [userInfo, props.showNav])

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

    // // FETCH Notes on load
    // useEffect(() => {
    //     setLoading(true)
    //     fetchNotes(100, setLectureNotes100)
    //     fetchNotes(200, setLectureNotes200)
    //     fetchNotes(300, setLectureNotes300)
    //     fetchNotes(400, setLectureNotes400)
    //     fetchNotes(500, setLectureNotes500)
    //     fetchOtherNotes(100, setOtherNotes100)
    //     fetchOtherNotes(200, setOtherNotes200)
    //     fetchOtherNotes(300, setOtherNotes300)
    //     fetchOtherNotes(400, setOtherNotes400)
    //     fetchOtherNotes(500, setOtherNotes500)
    //     fetchExtras()

    //     setTimeout(() => {
    //         setLoading(false)
    //     }, 5000);

    // }, [])
    
    
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
            {/* Main 
                    Lecture 
                        Notes */}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => showCategory(showLectureNotes, setShowLectureNotes)}>
                    <h2> {userInfo.department} Notes</h2>
                    {!showLectureNotes && <h2><IoIosArrowForward /></h2>}
                    {showLectureNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showLectureNotes && 
                <div>
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`Level1`)}>
                                <h2> 100 Level Notes </h2>
                                {showLectureNotes && <h2><IoIosArrowForward /></h2>}
                                {!showLectureNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level1'>
                                {lectureNotes100.length > 0 
                                    ?
                                lectureNotes100.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
                                                            <small><i> ({notes.type})</i></small> 
                                                    </span>
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
                                        <p>NO NOTE ADDED YET</p>
                                }
                            </div>
                    </div>
                    
                    {/* 200 
                        level
                            notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`Level2`)}>
                                <h2> 200 Level Notes </h2>
                                {showLectureNotes && <h2><IoIosArrowForward /></h2>}
                                {!showLectureNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level2'>
                                {lectureNotes200.length > 0 
                                    ?
                                lectureNotes200.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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
                                <h2> 300 Level Notes </h2>
                                {showLectureNotes && <h2><IoIosArrowForward /></h2>}
                                {!showLectureNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level3'>
                                {lectureNotes300.length > 0 
                                    ?
                                lectureNotes300.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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
                                <h2> 400 Level Notes </h2>
                                {showLectureNotes && <h2><IoIosArrowForward /></h2>}
                                {!showLectureNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level4'>
                                {lectureNotes400.length > 0 
                                    ?
                                lectureNotes400.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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
                                <h2> 500 Level Notes </h2>
                                {showLectureNotes && <h2><IoIosArrowForward /></h2>}
                                {!showLectureNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='Level5'>
                                {lectureNotes500.length > 0 
                                    ?
                                lectureNotes500.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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
            
            {/* Other Notes: 
                    Past Questions, 
                            Assignments etc */}
            <div id='header' className='accordion' >
                <div className='accordion--tab' onClick={(e) => showCategory(showOtherNotes, setShowOtherNotes)}>
                    <h2> Past Questions, Assignments, Summary...</h2>
                    {!showOtherNotes && <h2><IoIosArrowForward /></h2>}
                    {showOtherNotes && <h2><IoIosArrowDown /></h2>}
                </div>
                {showOtherNotes && 
                <div>
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`others1`)}>
                                <h2> 100 Level Notes </h2>
                                {showOtherNotes && <h2><IoIosArrowForward /></h2>}
                                {!showOtherNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='others1'>
                                {otherNotes100.length > 0 
                                    ?
                                otherNotes100.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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
                           other notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`others2`)}>
                                <h2> 200 Level Notes </h2>
                                {showOtherNotes && <h2><IoIosArrowForward /></h2>}
                                {!showOtherNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='others2'>
                                {otherNotes200.length > 0 
                                    ?
                                otherNotes200.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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
                            other notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`others3`)}>
                                <h2> 300 Level Notes </h2>
                                {showOtherNotes && <h2><IoIosArrowForward /></h2>}
                                {!showOtherNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='others3'>
                                {otherNotes300.length > 0 
                                    ?
                                otherNotes300.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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
                            other notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`others4`)}>
                                <h2> 400 Level Notes </h2>
                                {showOtherNotes && <h2><IoIosArrowForward /></h2>}
                                {!showOtherNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='others4'>
                                {otherNotes400.length > 0 
                                    ?
                                otherNotes400.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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
                            other notes */}
                    <div className='notes--detail'>
                            <div className='level' onClick={() => toggleLevelNotes(`others5`)}>
                                <h2> 500 Level Notes </h2>
                                {showOtherNotes && <h2><IoIosArrowForward /></h2>}
                                {!showOtherNotes && <h2><IoIosArrowDown /></h2>}
                            </div>
                            <div id='others5'>
                                {otherNotes500.length > 0 
                                    ?
                                otherNotes500.map((notes, index) => {
                                    return <div key={index} className="note--title">
                                                <p>
                                                    <GiWhiteBook /> {notes.CourseCode}:&nbsp;
                                                    {/* Reduce note title/name to max 40 chars  */}
                                                    <span>{notes.noteName.length > 40 ? notes.noteName.slice(0,50) + '...' : notes.noteName}
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

            {/* Extras: Time Table,
                        Announcements etc.  */}
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
           
        {!showLectureNotes && <p style={{textAlign: "center", color: "#ffbd0c"}}>Click a group to Expand</p>}
        </div>
    }
    </div>
  )
}
