import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// import { useAuth } from '../context/AuthContext';
import { setDoc, doc } from 'firebase/firestore';
import { auth } from "../firebaseConfig"
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { BeatLoader } from 'react-spinners'

export default function Signup() {
  const { logInWithPopUp, setUser, DocRef, navigate, loading, setLoading} = useAuth();
  const { setShowMnav } = useData();

  useEffect(() => {
    onAuthStateChanged(auth, data => {
      data && navigate('../')
    })
  }, [])
  
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
  
  // const [notFocused, setNotFocused] = useState(false)

  // const usernameRegex = /^[a-z0-9_\.]+$/;
  // const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // const passwordRegex =  /^[A-Za-z]\w{6,14}$/
  // var isValid;

  // const [error, setError] = useState({
  //   username: "",
  //   password: '',
  //   email: ''
  // })

  

  // useEffect(() => {
  //   if(valid == null){
  //     setTimeout(() => {
  //       setValid(null)
  //     }, 1000);
  //   }
  // }, [handleChange])

  function signUp(e){
    e.preventDefault()
      setLoading(false)        
      
    if(data.password !== data.confirmPassword){
      return toast.error('Passwords do not match')
      // setError('Passwords do not match')
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
    setLoading(true)
  }

 

  return (
    <div id='signup' onClick={() => setShowMnav(false)}>
      <form onSubmit={signUp}>
        <div>
          <label htmlFor="Username">
            Username
          </label>
          <input
          name='username'
          type="text" 
          id='username' 
          placeholder='Username' 
          value={data.username}
          onChange={handleChange}
          // onBlur={() => setNotFocused(true)}
          required
          />
          {/* {notFocused && (valid.username ? setValid({username: ""}) : "Usernames can only use letters, numbers, underscores(_), and periods(.).")} */}
        </div>

        <div>
          <label htmlFor="Username">
            Email
          </label>
          <input
          name='email'
          type="email" 
          id='email' 
          placeholder='Email Address' 
          value={data.email}
          onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="Passowrd">
            Password
          </label>
          <input
          name='password'
          type="password" 
          id='password' 
          placeholder='Password' 
          value={data.password}
          onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="Confirm Passowrd">
            Confirm Password
          </label>
          <input
          name='confirmPassword'
          type="password" 
          id='confirmPassword' 
          placeholder='Re-enter Password' 
          value={data.confirmPassword}
          onChange={handleChange}
          />
        </div>
        {loading && <button><BeatLoader color='#fff'/></button>}
        {!loading 
        && 
          <input 
          type="submit" 
          value="SIGN UP"
          />
        }
        <input 
        type="submit" 
        value="LOG IN with Gmail"
        onClick={logInWithPopUp}
        />
        <p>Have an account already? <Link to="/login"><b>LOG IN</b> </Link></p>
      </form>
    </div>
  )
}

