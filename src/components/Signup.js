import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc, query, collection, onSnapshot, where } from 'firebase/firestore';
import { auth, database } from "../firebaseConfig"
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { BeatLoader, HashLoader } from 'react-spinners'
import { FcGoogle } from 'react-icons/fc';
// AOS import
import 'aos/dist/aos.css'; // You can also use <link> for styles
import { FaUser, FaKey, FaAt } from 'react-icons/fa';
// ..

export default function Signup() {
  const { logInWithPopUp, setUser, DocRef, navigate, loading, setLoading, error, setError} = useAuth();
  const { setHideNav } = useData();

  // Registered Usernames from database
  const [regUsernames, setRegUsernames] = useState([])


  useEffect(() => {
    onAuthStateChanged(auth, data => {
      data && navigate('/notes')
    })
  }, [])
    
// clear error message after 5 seconds
useEffect(() => {
  if(error !== ''){
    setTimeout(() => {
      setError('')
    }, 5000);
  }
}, [error])

  //state to save Student or not confirmation - Check if a user 
  
  // state to save all user sign up info
  const [data, setData] = useState({
    student: "",
    username: '',
    department: '',
    level: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  

  // Handle student or not selection state 

  const handleSelection = () => {
    // // check if a user is a student or not
    // // if student, value is stored as true else stored as falsy

    const studentOption = document.getElementById('student')
    const notStudentOption = document.getElementById('notStudent')

    if(studentOption.checked){
      notStudentOption.disabled = true
      return setData(prevData => ({...prevData, student: "yes"}))
    }else if(!studentOption.checked){
      notStudentOption.disabled = false 
      notStudentOption.checked = true 
      setData(prevData => ({...prevData, student: "no"}))
    }

  }

 
  
  // Handle input change
  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value.toLowerCase(),
    })
    )
    
  }


  // const passwordRegex =  /^[A-Za-z]\w{6,14}$/
  
  // setting inputted username to the variable in order to capture and check on sign up if it exist in database 
  // and also use it for useEffect error boundary
  const username = data.username;
  
  // regular expression for USERNAME to use in testing if username corresponds to the expression
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{2,16}$/;


  
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
    }else if(data.username.length < 3){
      // check if entered username is up to 3 characters
      setError('Username must be at least 3 characters long')
      return toast.error('Username must be at least 3 characters long')
    }else if(!usernameRegex.test(data.username)){
      setError('Incorrect Username format.  Not supporting Username that starts with a number and can\'t end with \'.\'')
      return toast.error('Username format not supported')
      // check to confirm passwords match
    }else if(data.password !== data.confirmPassword){
      setLoading(false)
      setError('Passwords do not match')
      return toast.error('Passwords do not match')
      // create User Database if all conditions are met
    }else if(data.student === "yes" && data.department === ""){
      setLoading(false)
      setError('Select Department')
      return toast.error('Select Department')
    }else if(data.student === "yes" && data.level === ""){
      setLoading(false)
      setError('Select Level')
      return toast.error('Select Level')
    }
    try{
      createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(res => {
        setUser({
          username: username,
          email: data.email,
          department: data.department,
        })
        setDoc(doc(DocRef, data.email), {
          email: data.email,
          username: username,
          department: data.department,
          level: data.level,
          student: data.student,
        })
        setLoading(true)
        toast.success("SIGNED UP SUCCESSFULLY")
        return navigate('/notes')
      })
    }
    catch(err){
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
    }
  }

 
  return (
    <div id='signup' onClick={() => setHideNav(true)} data-aos="fade-down" data-aos-easing="ease-out">
      <div className='confirm' data-aos="fade" data-aos-easing="ease-out">
          <h3>Are you an Engineering Student of the University of Maiduguri?</h3>
          <div className="options">
            <div>
              <input type="checkbox" value={"yes"} name='student' id='student' onChange={handleSelection}/>
              <label htmlFor="" >YES</label>
            </div>
            <div>
              <input type="checkbox" value={"no"} name='student' id='notStudent' onChange={handleSelection}/>
              <label htmlFor="">NO</label>
            </div>
          </div>
      </div>
      {data.student === "yes"
      && 
      <form onSubmit={signUp} data-aos="fade-up" data-aos-easing="ease-out">
        <div className='input--field'>
          <span><FaUser /></span>
          <input
          name='username'
          type="text" 
          id='username' 
          placeholder='Username' 
          value={data.username}
          onChange={handleChange}
          title="min of 3 characters and max of 16."
          required
          />
        </div>

        <div className="input--field">
          <span><FaAt /></span>
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

        <div className="input--field">
          <span><FaKey /></span>
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

        <div className="input--field">
        <span><FaKey /></span>
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
        <div>
          <select defaultValue="Select Department" name="department" onChange={handleChange} required>
            <option defaultValue="" disabled>Select Department</option>
            <option value="Agricultural Engineering">Agricultural Engineering</option>
            <option value="Civil Engineering">Civil & Water Resources Engineering</option>
            <option value="Chemical Engineering">Chemical Engineering</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
            <option value="Food Science Technology">Food Science Technology</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
          </select>
        </div>

        <div>
          {/* <label htmlFor="Department">
            Level
          </label> */}
          <select defaultValue="Select Level" name="level" onChange={handleChange} required>
            <option defaultValue="" disabled>Select Level</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>
        </div>
        <p className='error'>{error}</p>
        {loading && <button><BeatLoader color='#fff'/></button>}
        {!loading 
        && 
        <input type="submit" value="Sign up" />
        }
        <button onClick={logInWithPopUp} className='flex'>
            Sign up with <FcGoogle />
        </button>
        <p>Have an account already? <Link to="/login" style={{color: '#f7ce3e'}}><b>Log in</b> </Link></p>
      </form>
      }
      
      {data.student === "no"
      &&
      <form onSubmit={signUp} data-aos="fade-up" data-aos-easing="ease-out">
          <div>
            {/* <label htmlFor="Username">
              Username
            </label> */}
            <input
            name='username'
            type="text" 
            id='username' 
            placeholder='Username' 
            value={data.username}
            onChange={handleChange}
            title="min of 3 characters and max of 16."
            required
            />
          </div>
  
          <div>
            {/* <label htmlFor="Email">
              Email
            </label> */}
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
            {/* <label htmlFor="Passowrd">
              Password
            </label> */}
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
            {/* <label htmlFor="Confirm Passowrd">
              Confirm Password
            </label> */}
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
          {loading && <button><HashLoader color='#fff'/></button>}
          {!loading 
          && 
          <input type="submit" value="Sign up" />
          }
          
          <p>or</p>

          <button onClick={logInWithPopUp} className='flex'>
              Sign up with <FcGoogle />
          </button>
          <p>Have an account already? <Link to="/login" style={{color: '#f7ce3e'}}><b>LOG IN</b> </Link></p>
      </form>
      }

    </div>
  )
}

