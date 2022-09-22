import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { auth } from '../firebaseConfig'
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { database } from '../firebaseConfig'
import { RingLoader } from 'react-spinners'

export default function Home() {
    const { navigate, user, loading } = useAuth()
    const { userInfo, setShowMnav, } = useData();

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
        onAuthStateChanged(auth, data => {
            if(!data){
                navigate('../login')
            }
        })
    }, [])

    
    // FETCH Notes on load
    useEffect(() => {
        // function to Fetch CPE Notes
        const fetchCPENotes = async () => {
            try{
                const q = query(collection(database, "noteDetails"), where("category", "==", "Computer Engineering"))
                await onSnapshot(q,snapShot => {
                    setCPENotes(snapShot.docs.map(data => ({
                    ...data.data(),
                    id: data.id
                })))
                console.log(cpeNotes)
            })
        }
        catch(err){
            console.log(err.message)
        };
        }
        
        // function to FetchEEE Notes
        const fetchEEENotes = async () => {
            try{
                const q = query(collection(database, "noteDetails"), where("category", "==", "Electrical & Electronics Engineering"))
                await onSnapshot(q,snapShot => {
                    setEEENotes(snapShot.docs.map(data => ({
                    ...data.data(),
                    id: data.id
                })))
                console.log(eeeNotes)
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
                console.log(otherNotes)
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
    

  return (
    <div id='home' className="notes--container" onClick={() => setShowMnav(false)}>
        {!userInfo.username ? <div>
            <p>Loading Notes...</p>
            <RingLoader />
            </div>
        :
        <div className='accordion--container'>
            <div id='header' className='accordion' onClick={() => setShowCPE(!showCPE)} >
                <h2>Computer Engineering</h2>
                {showCPE && 
                <div id='details' className='notes--detail'>
                    {/* map through the cpeNOTES state and display the Notes name */}
                    {cpeNotes.length > 0 
                    ?
                   cpeNotes.map((notes) => {
                    return <h3>
                                <a href={notes.url}>
                                    <span>
                                        {notes.CourseCode}: 
                                    </span> 
                                    {notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                    <i>({notes.uploadedBy})</i>
                                </a>
                            </h3>
                        })
                        :
                        <p>NO NOTES</p>
                    }
                </div>
                }
            </div>
            <div className='accordion' onClick={() => setShowEEE(!showEEE)}>
                <h2>Electrical &amp; Electronics Engineering</h2>
                {!showEEE && 
                <div className='notes--detail'>
                    {/* map through the `cpe`NOTES state and display the Notes if available */}
                    {eeeNotes.length > 0
                    ?
                    eeeNotes.map((notes) => {
                        return <h3>
                                    <a href={notes.url}>
                                        <span>{notes.CourseCode}: </span> 
                                        {notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                        <i>({notes.uploadedBy})</i>
                                    </a>
                                </h3>
                        })
                    :
                    <p>NO NOTES</p>
                    }
                </div>
                }
            </div>
            <div className='accordion' onClick={() => setShowOthers(!showOthers)}>
                <h2>Other Notes</h2>
                {showOthers && 
                <div id='details' className='notes--detail'>
                    {otherNotes.length > 0 
                    ?  
                   otherNotes.map((notes) => {
                    return <h3>
                                <a href={notes.url}>
                                    <span>{notes.CourseCode}: </span> 
                                    {notes.noteName.length > 40 ? notes.noteName.slice(0,40) + '...' : notes.noteName}
                                    <i>( {notes.uploadedBy})</i>
                                </a>
                            </h3>
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
