import React, { useState } from 'react'
import { useEffect } from 'react'
import {collection, doc, getDoc, setDoc} from "firebase/firestore"
import { database } from '../../firebaseConfig'
import { toast } from 'react-toastify'

export const Forum = (props) => {

  const [email, setEmail] = useState("")

  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const docRef = collection(database, "forumWaitlist")

  const addToWaitlist = async (e) => {
    e.preventDefault()
    const document = await getDoc(doc(docRef, email))
    if(!document.exists()){
      setDoc(doc(docRef, email), {
        email: email
      })
    }
    toast.success("You\'re in!")
  }


  return (
    <div id='forum'>
        <div>
          <h1>getNOTES Forum is going live soon! </h1>
        </div>
      <div className='waitlist'>
        <div>
          <h3>Be the first to know when we Launch! </h3>
          <p>Enter your e-Mail address and hit the Join Waitlist button.</p>
        </div>
          <form action="" onSubmit={addToWaitlist}>
              <input type="email" placeholder='enter your mail' value={email} onChange={handleChange}/>
              <input type="submit" value="Join the Waitlist!"/>
          </form>
      </div>

      <form action="">
        <p>Got an idea/suggestion you'd love to share with the Team!? 
          <br />
          We'd love to hear from you! Fill in the below form to drop us a message!  </p>
          <input type="text" placeholder='Enter your Full name'/>
          <input type="text" placeholder='Department'/>
          <input type="text" placeholder='Title of Message'/>
          <textarea placeholder='Title of Message'/>
          <input type="submit" value="Send" onClick={(e) => {e.preventDefault(); alert("Message Sent! Thank you! ")}}/>
      </form>
    </div>
  )
}
