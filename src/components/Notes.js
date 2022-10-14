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
    const { setHideNav } = useData();

    // state to manage accordions
    const [showCPE, setShowCPE] = useState(false)
    const [showEEE, setShowEEE] = useState(false)
    const [showOthers, setShowOthers] = useState(false)

    // State to save notes based on category
    const [otherNotes, setOtherNotes] = useState([])
    const [cpeNotes, setCPENotes] = useState([])
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

    // FETCH Notes on load
    useEffect(() => {
        // function to Fetch Notes in CPE category
        const fetchCPENotes = async () => {
            try{
                const q = query(collection(database, "noteDetails"), where("category", "==", "Computer Engineering"))
                await onSnapshot(q,snapShot => {
                    setCPENotes(snapShot.docs.map(data => ({
                    ...data.data(),
                    id: data.id
                })))
            })
        }
        catch(err){
            console.log(err.message)
        };
        }
        
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
        fetchOtherNotes()
        fetchCPENotes()
        fetchEEENotes()
    }, [user])

    // style: place the Note loader animation in center
    const mystyle = {
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
            <div id='header' className='accordion' onClick={() => setShowCPE(!showCPE)} >
                <div className='accordion--tab'>
                    <h2> Computer Engineering </h2>
                    {!showCPE && <h2><IoIosArrowForward /></h2>}
                    {showCPE && <h2><IoIosArrowDown /></h2>}
                </div>
                {showCPE && 
                <div id='details' className='notes--detail'>
                    {/* map through the cpeNOTES state and display the Notes name */}
                    {cpeNotes.length > 0 
                    ?
                   cpeNotes.map((notes, index) => {
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
            <div className='accordion' onClick={() => setShowOthers(!showOthers)}>
                <div className='accordion--tab'>
                    <h2>Others</h2>
                    {!showOthers && <h2><IoIosArrowForward /></h2>}
                    {showOthers && <h2><IoIosArrowDown /></h2>}
                </div>
                {showOthers && 
                <div id='details' className='notes--detail'>
                    {otherNotes.length > 0 
                    ?  
                   otherNotes.map((notes, index) => {
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
        </div>
    }
    </div>
  )
}
