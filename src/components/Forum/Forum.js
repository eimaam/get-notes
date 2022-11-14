import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from 'firebase/firestore'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { CgMenuGridO } from 'react-icons/cg'
import { auth, database } from '../../firebaseConfig'
import { ChatBubble } from './ChatBubble'
import { useData } from '../../contexts/DataContext'
import { useAuth } from '../../contexts/AuthContext'
import { PuffLoader } from "react-spinners"
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { ProfileModal } from './ProfileModal'
import { toast } from 'react-toastify'

export const Forum = () => {
    const { userInfo, fetchUserDetails } = useData()
    const {isLogged, loading, setLoading, navigate} = useAuth()

    useEffect(() => {
        onAuthStateChanged(auth, data => {
            data && navigate("/forum")

        })
        setTimeout(() => {
            setLoading(false)
        }, 2500);
        userInfo.username !== undefined && navigate('/forum')
    }, [userInfo])


    const [allMessages, setAllMessages] = useState([])
    const [message, setMessage] = useState("")
    const [channel, setChannel] = useState("")
    const [showModal, setShowModal] = useState(false)
    
    // creating time format to save along with every message
    const d = new Date()
    const date = new Date().toDateString()
    let hour = d.getHours()
    let mins = d.getMinutes()
    let period = 'am'
    // cchanging time from 24 hours format to 12HR
    hour >= 12 ? period = 'pm' : period = period;
    hour == 0 ? hour = 12 : hour = hour;
    hour > 12 ? hour = hour - 12 : hour = hour;
    mins < 10 ? mins = "0"+mins : mins = mins;
    
    // function to handle new messages on type
    const handleChange = (e) => {
        setMessage(e.target.value)
    }
    
    // send message function
    const sendMessage = async (e) => {
        e.preventDefault()
        if(message == ""){
            return;
        }
        try{
            await addDoc(collection(database, "forumMessages"), {
                message: message,
                sender: userInfo.username,
                channel: channel,
                timestamp: serverTimestamp(),
                date: date,
                time: `${hour}:${mins}${period}`,
            })
            // if message sent, set the message box to empty
            setMessage("")
        }
        catch(err){
            console.log(err.message)
        }

    }

    // function to scroll to last message on Channel selection
    // to remove default load showing fist message in a Channel
    const scrollToBottom = () => {
        const chatbox = document.querySelector(".messages--container")
        chatbox.scrollTop = chatbox.scrollHeight;
        
    }

    // fetch messages on load
    // re-renders anytime channel is changed

    useEffect(() => {
        fetchMessages()
        // only run when channel have been selected to stop the id from returning null
        channel != "" && scrollToBottom()
        
    }, [channel])
    
    // user messages
    const fetchMessages = async () => {
        try{
            const q = query(collection(database, "forumMessages"), where("channel", "==", `${channel}`), orderBy("timestamp"))
            await onSnapshot(q, snapShot => {
                setAllMessages(snapShot.docs.map(data => ({
                    ...data.data(),
                })))
            })
        }
        catch(err){
            console.log(err)
        }
    }

    // switch channel
    const switchCategory = (channelValue) => {
        setChannel(channelValue);
        fetchMessages()
        // // set menu display to none on select
        // toggleMenu()
    }

    // toggle menu display on Mobile
    const toggleMenu = () => {
        let menu = document.querySelector('#menu')
        menu.style.display != "flex" 
        ? menu.style.display = "flex"
        : menu.style.display = "none"
    }

    // syling the loader animation to full screen
    const mystyle = {
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "black",
        height: "100vh",
        width: "100%",
        textAlign: "center"
    }

    // state manager for user detail for profile modal
    const [profileInfo, setProfileInfo] = useState([])
    // fetch profileInfo to display on modals
    const fetchProfileInfo = async (username) => {
        try{
            const q =  query(collection(database, "userDetails"), where("username", "==", `${username}`))
            await onSnapshot(q, snapShot => {
                setProfileInfo(snapShot.docs.map(data => ({
                    ...data.data()
                })))
            })
            setShowModal(!showModal)
        }
        catch(err){
            if(err.message === 'Failed to get document because the client is offline.'){
                toast.error('Couldn\'t load NOTES. You appear to be OFFLINE!')
            }
            console.log(err.message)
        }
    }

    if(userInfo.student == "no"){
        return <div style={mystyle}>
                <h1>Ooops! Forum is only opened to Students </h1>
            </div>
    }
    console.log(userInfo)

  return (
    <div id='forum'>
        {loading 
        
        ? 
        
        <div style={mystyle}>
            <h3>Loading Chat...</h3>
            <PuffLoader />
        </div>

        :
        <>
        {/* Navigation Bar */}
        <div id='forumNav' onClick={setShowModal(false)}>
            <h2>{`Channel: ${channel}`}</h2>
            <CgMenuGridO className='toggler' onClick={toggleMenu}/>
            <ul id='menu'>
                {userInfo.level == "100" && <li onClick={() => switchCategory("100level")}>🚀 100 Level General </li>}
                {userInfo.level == "200" && <li onClick={() => switchCategory("200level")}>🚀 200 Level General </li>}
                {userInfo.level == "300" && <li onClick={() => switchCategory("300level")}>🚀 300 Level General </li>}
                {userInfo.level == "400" && <li onClick={() => switchCategory("400level")}>🚀 400 Level General </li>}
                {userInfo.level == "500" && <li onClick={() => switchCategory("500level")}>🚀 500 Level General </li>}
                <li onClick={() => switchCategory("football")}>⚽ Football</li>
                <li onClick={() => switchCategory("sports")}>🥇 Sports - General </li>
                <li onClick={() => switchCategory("politics")}>🗯 Politics</li>
                <li onClick={() => switchCategory("music")}>🎶 Music</li>
                <li onClick={() => switchCategory("movies")}>🎬 Movies</li>
                <li onClick={() => switchCategory("cryptocurrency")}>📈 Cryptocurrency</li>
                <li onClick={() => switchCategory("economy")}>💵 Economy</li>
                <li onClick={() => switchCategory("business")}>🤑 Business</li>
            </ul>
            <button>Suggest additional Channel</button>
        </div>
        {channel === "" 
        ? <div className='container'>
            <h2>Select a CHANNEL from the navigation menu to join a discussion</h2>
        </div>
        :
        <aside>
            <div className='messages--container'>
                {/* channel name */}
                <div className='chats--container'>
                    {/* show no messages if channel contains no message else display the messages */}
                    {allMessages.length === 0 
                    ? <div>
                        <h3 style={{textAlign: "center"}}>
                            No message here yet! Send one to start a conversation 😇
                        </h3>
                       </div> 
                    :
                    // display messages if the channel contains some
                    allMessages.map((item, index) => {
                        return item.sender != userInfo.username 
                        ? <ChatBubble
                            key={index}
                            message={item.message} 
                            sender={item.sender} 
                            time={item.time}
                            className={"received"}
                            date={item.date}
                            handleClick={() => fetchProfileInfo(item.sender)} 
                        />  
                        : <ChatBubble
                            key={index}
                            message={item.message} 
                            sender={item.sender} 
                            time={item.time}
                            className={"sent"}
                            date={item.date} 
                            handleClick={() => fetchProfileInfo(item.sender)}  
                        />
                    })
                    }
                </div>
            </div>
            <div className='message--controls'>
                <textarea
                name="messageBox" 
                placeholder='...type message'
                onChange={(e) => setMessage(e.target.value)}
                /> 
                {message !== "" && <button onClick={(e) => sendMessage(e)}><FiSend /></button>}
            </div>
            {/* profile info card modal */}
            {showModal 
                && profileInfo.map((item,index) => {
               return  <ProfileModal
                        key={index} 
                        username={item.username} 
                        level={item.level} 
                        department={item.department}
                        handleClick={() => setShowModal(false)}
                        />
                }
                )
            }
        </aside>
        }
        </>
    }
    </div>
  )
}
