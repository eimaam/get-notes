import React, { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, sendPasswordResetEmail} from 'firebase/auth'
import { toast } from 'react-toastify';
import { auth, database } from './firebaseConfig';
import { useAuth } from './context/AuthContext';
import userEvent from '@testing-library/user-event';
import { useData } from './context/DataContext';
import { useParams } from 'react-router-dom';
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';



export default function UserSettings() {
  const {userName} = useParams();
  const { navigate, setError, error, message, setMessage, loading, setLoading, DocRef, user } = useAuth()
  const { setHideNav } = useData()

  useEffect(() => {
    onAuthStateChanged(auth, data => {
        if(!data){
          navigate('../login')
        }
    })
}, [])


    const [show, setShow] = useState(false)


    const [data, setData] = useState({
        email: '',
    })

    const [regUsernames, setRegUsernames] = useState([])

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value,
    })
    )
  }

//   reset password
const resetPass = async (e) => {
    e.preventDefault()
    try{
        await sendPasswordResetEmail(auth, data.email)
        .then(() => {
            setMessage('Password reset link sent! Check your Inbox or Spam Folder')
            toast.info('Password reset link sent! Check your Inbox or Spam Folder')
        })
    }
    catch(err){
      if(err.code === "auth/invalid-email"){
        toast.error('Invalid or Incorrect email')
        setError('Invalid or Incorrect email')
      }else if(err.code == 'auth/user-not-found'){
          toast.error('User not found!')
          setError('User not found!')
      }else{
        toast.error(err.code)
        setError(err.code)
    }
  }
  return setData({
    email: ''
  })
}

useEffect(() => {
    if(message != ""){
        setTimeout(() => {
            setMessage('')
        }, 4000);
    }
}, [message])

useEffect(() => {
    if(error != ""){
        setTimeout(() => {
            setError('')
        }, 4000);
    }
}, [error])


// //-------------------TO USE THIS WHEN I ENABLE USERNAME CHANGING OF USERNAME ----------------------------- //
// //-------------------TO USE THIS WHEN I ENABLE USERNAME CHANGING OF USERNAME ----------------------------- //

//   // setting inputted username to the variable in order to capture and check on sign up if it exist in database 
//   // and also use it for useEffect error boundary

//   function handleUsername(e){
//     const {name, value} = e.target
//     setData(prevData => ({
//       ...prevData,
//       [name]: value.toLowerCase()
//     }))
//   }
//   const username = data.username;
  
//   // regular expression for USERNAME
//   const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{4,18}$/;

  
// // get list of usernames from database that matches one entered by new user on sign up and save to regUsernames state 
// useEffect(() => {
//   const checkUsername = async () => {
//     try{
//       const q = query(collection(database, "userDetails"), where("username", "==", data.username))
//       await onSnapshot(q,snapShot => {
//         setRegUsernames(snapShot.docs.map(data => ({
//           ...data.data(),
//           id: data.id
//         })))
//       })
      
//     }
//     catch(err){
//       console.log(err.message)
//     }
//   }
//   checkUsername()
// }, [username])

// // check if the username entered by new user matches another in the database
// // if regUsernames' length is greater than 0 that means username entered matches one from the database
// const takenUsername = regUsernames.length > 0 && regUsernames[0].username

// const updateUsername = async (e) => {
//   e.preventDefault()
//   setLoading(false)
//   if(data.username === takenUsername){
//     setLoading(false)
//     return toast.error('Username taken!')
//     // check if username matches requested format from username regular expression usernameRegex
//   }else if(!usernameRegex.test(data.username)){
//     setError('Username must be at least 3 character long, not starting with a number and can\'t end with \'.\'')
//     return toast.error('Username format not supported')
//   }else{
//     try{
//       await setDoc(doc(DocRef, user.email), {
//         username: username
//       })
//     }
//     catch(err){
//       console.log(err.code)
//     }
//   }
//   setLoading(true)
// }




  return (
    <div id='userSettings' onClick={() => setHideNav(true)}>
      <form action="" onSubmit={resetPass}>
        {show &&
        <React.StrictMode>
        <label htmlFor="Registered Email">
          Re-enter your registered Email:
        </label>
        <input
        name='email'
        type="email" 
        placeholder='Enter registered Email Address' 
        value={data.email}
        onChange={(e) => handleChange(e)}
        required
        />
        <input type="submit" value="Change Password"/>
        </React.StrictMode>
        }
        {!show && <button onClick={() => setShow(true)}>Change Password</button>}
        <button type='button' disabled>Change username <i>(coming soon...)</i></button>
        <p className='success'>{message}</p>
        <p className='error'>{error}</p>
      </form>
    </div>
  )
}
