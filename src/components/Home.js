import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { auth } from '../firebaseConfig'

export default function Home() {
    const { navigate } = useAuth()
    const { userInfo, setShowMnav } = useData();

    useEffect(() => {
        onAuthStateChanged(auth, data => {
            if(!data){
                navigate('../login')
            }
        })
    }, [])

    const [showCPE, setShowCPE] = useState(false)
    const [showEEE, setShowEEE] = useState(false)
    const [showOthers, setShowOthers] = useState(false)

  return (
    <div id='home' className="notes--container" onClick={() => setShowMnav(false)}>
        <div className='accordion--container'>
            <div id='header' className='accordion' onClick={() => setShowCPE(!showCPE)}>
                <h2>Computer Engineering</h2>
                {showCPE && 
                <div id='details' className='notes--detail'>
                   <h3><span>CPE501:</span> Introduction......</h3> 
                   <h3><span>CPE503:</span> Introduction......</h3> 
                   <h3><span>CPE505:</span> Introduction......</h3> 
                </div>
                }
            </div>
            <div className='accordion' onClick={() => setShowEEE(!showEEE)}>
                <h2>Electrical &amp; Electronics Engineering</h2>
                {showEEE && 
                <div className='notes--detail'>
                   <h3><span>EEE501:</span> Introduction......</h3> 
                </div>
                }
            </div>
            <div className='accordion' onClick={() => setShowOthers(!showOthers)}>
                <h2>Other Notes</h2>
                {showOthers && 
                <div id='details' className='notes--detail'>
                   <h3>Assignment on Needs for </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                   <h3>General Studies Log Book </h3> 
                </div>
                }
            </div>
        </div>

    </div>
  )
}
