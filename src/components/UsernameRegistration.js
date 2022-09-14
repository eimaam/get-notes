import React, { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged} from 'firebase/auth'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useData } from '../context/DataContext';


export default function UsernameRegistration() {
    const { userInfo } = useData();
  const { user, logInWithPopUp, navigate, DocRef } = useAuth();

  useEffect(() => {
    onAuthStateChanged(auth, data => {
        if(!data){
          navigate('../login')
        }
    })
}, [])

  const [data, setData] = useState({
    username: '',
  })

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value,
    })
    )
  }

  // Add Username
  function addUsername(e){
    e.preventDefault()
    updateDoc(doc(DocRef, user.email), {
        username: data.username,
      })
      toast.info("Profile Updated!")
      return navigate('../')
  }
  

  return (
    <div id='login'>
      <form action="" onSubmit={addUsername}>
        <label htmlFor="Username">
          Username:
        </label>
        <input
        name='username'
        type="text" 
        id='username' 
        placeholder='Username' 
        value={data.username}
        onChange={(e) => handleChange(e)}
        />
        <input type="submit" value="UPDATE PROFILE"/>
      </form>
    </div>
  )
}
