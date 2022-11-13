import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from 'firebase/firestore'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { CgMenuGridO } from 'react-icons/cg'
import { toast } from 'react-toastify'
import { database } from '../../firebaseConfig'
import { ChatBubble } from './ChatBubble'

export const Forum = () => {
    const [allMessages, setAllMessages] = useState([])
    const [message, setMessage] = useState("")
    const [category, setCategory] = useState("")
    
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
        if(message == ""){
            return;
        }
        try{
            await addDoc(collection(database, "forumMessages"), {
                message: message,
                date: date,
                time: `${hour}:${mins}${period}`,
                sender: "test",
                category: category,
            })
            // if message sent, set the message box to empty
            setMessage("")
        }
        catch(err){
            console.log(err.message)
        }

    }

    // fetch messages on load
    // re-renders anytime category is changed
    useEffect(() => {
        fetchMessages()
    }, [category])

    // user messages
    const fetchMessages = async () => {
        try{
            const q = query(collection(database, "forumMessages"), where("category", "==", `${category}`), orderBy("date"))
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

    // switch category
    const switchCategory = (categoryValue) => {
        setCategory(categoryValue);
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

  return (
    <div id='forum'>
        {/* Navigation Bar */}
        <div id='forumNav'>
            <h2>Channels:</h2>
            <CgMenuGridO className='toggler' onClick={toggleMenu}/>
            <ul id='menu'>
                <li onClick={() => switchCategory("100level")}>🚀 100 Level General </li>
                <li onClick={() => switchCategory("200level")}>🚀 200 Level General </li>
                <li onClick={() => switchCategory("300level")}>🚀 300 Level General </li>
                <li onClick={() => switchCategory("400level")}>🚀 400 Level General </li>
                <li onClick={() => switchCategory("500level")}>🚀 500 Level General </li>
                <li onClick={() => switchCategory("football")}>🚀 Football</li>
                <li onClick={() => switchCategory("sports")}>🥇 Sports - General </li>
                <li onClick={() => switchCategory("politics")}>🗯 Politics</li>
                <li onClick={() => switchCategory("music")}>🎶 Music</li>
                <li onClick={() => switchCategory("movies")}>🚀 Movies</li>
                <li onClick={() => switchCategory("cryptocurrency")}>📊 Cryptocurrency</li>
                <li onClick={() => switchCategory("economy")}>💵 Economy</li>
                <li onClick={() => switchCategory("business")}>📊 Business</li>
            </ul>
            <button>Suggest additional Channel</button>
        </div>
        {category === "" 
        ? <div className='container'>
            <h2>Select a CHANNEL from the navigation menu to join a discussion</h2>
        </div>
        :
        <aside>
            <div className='messages--container'>
                <div className='chats--container'>
                    {allMessages.map((item, index) => {
                        return item.sender != "test" 
                        ? <ChatBubble
                            key={index}
                            message={item.message} 
                            sender={item.sender} 
                            time={item.time}
                            className={"received"}
                        />  
                        : <ChatBubble
                            key={index}
                            message={item.message} 
                            sender={item.sender} 
                            time={item.time}
                            className={"sent"}
                            date={item.date} 
                        />
                    })}
                </div>
            </div>
            <div className='message--controls'>
                <textarea
                name="messageBox" 
                placeholder='...type message'
                onChange={handleChange}
                /> 
                {message !== "" && <button onClick={(e) => sendMessage(e)}><FiSend /></button>}
            </div>
        </aside>
        }
    </div>
  )
}
