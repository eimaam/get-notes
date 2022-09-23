import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { auth } from '../firebaseConfig'
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { database } from '../firebaseConfig'
import { RingLoader } from 'react-spinners'
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'

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

    // const [arrow, setArrow] = useState(<IoIosArrowForward />)

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
    

  return (
    <div id='home' className="notes--container" onClick={() => setShowMnav(false)}>
        {!user ? <div>
            <p>Loading Notes...</p>
            <RingLoader />
            </div>
        :
        <div className='accordion--container'>
            <div id='header' className='accordion' onClick={() => setShowCPE(!showCPE)} >
                <div className='accordion--tab'>
                    <h2>Computer Engineering </h2>
                    {!showCPE && <h2><IoIosArrowForward /></h2>}
                    {showCPE && <h2><IoIosArrowDown /></h2>}
                </div>
                {showCPE && 
                <div id='details' className='notes--detail'>
                    {/* map through the cpeNOTES state and display the Notes name */}
                    {cpeNotes.length > 0 
                    ?
                   cpeNotes.map((notes, index) => {
                    return <h3 key={index}>
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
                        return <h3 key={index}>
                                    <a href={notes.url} >
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
                    return <h3 key={index}>
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
        </div>
    }
    </div>
  )
}
