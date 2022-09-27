import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// import { useAuth } from '../context/AuthContext';
import { setDoc, doc, query, collection, onSnapshot, where } from 'firebase/firestore';
import { auth, database } from "../firebaseConfig"
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { BeatLoader } from 'react-spinners'
import { FcGoogle } from 'react-icons/fc';

export default function Signup() {
  const { logInWithPopUp, setUser, DocRef, navigate, loading, setLoading, error, setError} = useAuth();
  const { setHideNav } = useData();

  // Registered Usernames from database
  const [regUsernames, setRegUsernames] = useState([])


  useEffect(() => {
    onAuthStateChanged(auth, data => {
      data && navigate('../')
    })
  }, [])
    
// clear error message after 5 seconds
useEffect(() => {
  if(error != ''){
    setTimeout(() => {
      setError('')
    }, 5000);
  }
}, [error])

  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  // Handle input change
  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value.toLowerCase(),
    })
    )
    console.log(data)
  }

  // const passwordRegex =  /^[A-Za-z]\w{6,14}$/
  
  // setting inputted username to the variable in order to capture and check on sign up if it exist in database 
  // and also use it for useEffect error boundary
  const username = data.username;
  
  // regular expression for USERNAME
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{4,16}$/;



  
// get list of usernames from database that matches one entered by new user on sign up and save to regUsernames state 
useEffect(() => {
  const checkUsername = async () => {
    try{
      const q = query(collection(database, "userDetails"), where("username", "==", data.username))
      await onSnapshot(q,snapShot => {
        setRegUsernames(snapShot.docs.map(data => ({
          ...data.data(),
          id: data.id
        })))
      })
      
    }
    catch(err){
      console.log(err.message)
    }
  }
  checkUsername()
}, [username])

// check if the username entered by new user matches another in the database
// if regUsernames' length is greater than 0 that means username entered matches one from the database
const takenUsername = regUsernames.length > 0 && regUsernames[0].username

// sign up function
  const signUp = (e) => {
    e.preventDefault()
      setLoading(false)        
    if(data.username === takenUsername){
      setLoading(false)
      return toast.error('Username taken!')
      // check if username matches requested format from username regular expression usernameRegex
    }else if(!usernameRegex.test(data.username)){
      setError('Username must be at least 3 character long, not starting with a number and can\'t end with \'.\'')
      return toast.error('Username format not supported')
    }else if(data.password !== data.confirmPassword){
      setLoading(false)
      setError('Passwords do not match')
      return toast.error('Passwords do not match')
    }else{
      createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(res => {
        setUser({
          username: username,
          email: data.email
            })
            setDoc(doc(DocRef, data.email), {
              email: data.email,
              username: username,
            })
            toast.info("SIGNED UP SUCCESSFULLY")
            return navigate('../login')
            })
            .catch(err => {
              if(err.code === 'auth/weak-password'){
                setLoading(false)
                toast.error('Weak Password! Password should be at least 6 characters')
              }else if(err.code === 'auth/email-already-in-use'){
                setLoading(false)
                setError('Account already exist!')
                toast.error('Account already exist!')
              }else{
                setLoading(false)
                toast.error(err.code)
              }
            })
          }
    setLoading(true)
  }

 
  return (
    <div id='signup' onClick={() => setHideNav(true)}>
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
          min={3}
          max={16}
          title="min of 3 characters and max of 16."
          required
          />
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
          required
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
          required
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
          required
          />
        </div>
        <p className='error'>{error}</p>
        {loading && <button><BeatLoader color='#fff'/></button>}
        {!loading 
        && 
        <input type="submit" value="SIGN UP" />
        }
        <button onClick={logInWithPopUp} className='flex'>
            Sign up with <FcGoogle />
        </button>
        <p>Have an account already? <Link to="/login" style={{color: '#f7ce3e'}}><b>LOG IN</b> </Link></p>
      </form>
    </div>
  )
}

