import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// import { useAuth } from '../context/AuthContext';
import { setDoc, doc, collection, addDoc } from 'firebase/firestore';
import { auth, database } from "../firebaseConfig"
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Signup() {
  const { user, setUser, DocRef, navigate} = useAuth();

  useEffect(() => {
    onAuthStateChanged(auth, data => {
      data && navigate('../')
    })
  },[])
  
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value,
    }),
    console.log(data)
    )
  }

  function signUp(e){
    e.preventDefault()
    if(data.password != data.confirmPassword){
      return toast.error('Passwords do not match')
    }else{
      createUserWithEmailAndPassword(auth, data.email, data.password)
          .then(res => {
              setUser({
                username: data.username,
                email: data.email
              })
              setDoc(doc(DocRef, data.email), {
                email: data.email,
                username: data.username,
              })
              toast.info("SIGNED UP SUCCESSFULLY")
              return navigate('../login')
          })
          .catch(err => {
              if(err.code === 'auth/weak-password'){
                toast.error('Weak Password! Password should be at least 6 characters')
              }else if(err.code === 'auth/email-already-in-use'){
                  toast.error('Account already exist!')
              }else{
                  toast.error(err.code)
              }
            })
    }
  }
 

  return (
    <div id='signup'>
      <form onSubmit={signUp}>
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
        
        <label htmlFor="Username">
          Email:
        </label>
        <input
        name='email'
        type="email" 
        id='email' 
        placeholder='Email Address' 
        value={data.email}
        onChange={(e) => handleChange(e)}
        />

        <label htmlFor="Passowrd">
          Passowrd:
        </label>
        <input
        name='password'
        type="password" 
        id='password' 
        placeholder='Password' 
        value={data.password}
        onChange={(e) => handleChange(e)}
        />

        <label htmlFor="Confirm Passowrd">
          Confirm Passowrd:
        </label>
        <input
        name='confirmPassword'
        type="password" 
        id='confirmPassword' 
        placeholder='Re-enter Password' 
        value={data.confirmPassword}
        onChange={(e) => handleChange(e)}
        />
        
        <input 
        type="submit" 
        value="SIGN UP"
        />
        <input 
        type="submit" 
        value="LOG IN with G"
        />
        <p>Have an account already? <Link to="/login"> LOG IN </Link></p>
      </form>
    </div>
  )
}

