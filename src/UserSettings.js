import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, sendPasswordResetEmail} from 'firebase/auth'
import { toast } from 'react-toastify';
import { auth } from './firebaseConfig';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import { useParams } from 'react-router-dom';
// AOS import
import 'aos/dist/aos.css'; // You can also use <link> for styles
import { doc, setDoc, updateDoc } from 'firebase/firestore';
// ..



export default function UserSettings() {
  const { userName } = useParams();

  const { user, loading, setLoading, setError, error, message, setMessage, DocRef } = useAuth()
  const { userInfo } = useData()
  const { setHideNav } = useData()

  // manage password reset input - show or hide
  const [showPass, setShowPass] = useState(false)
  // manage level change input - show or hide
  const [showLevelChange, setShowLevelChange] = useState(false)


    const [data, setData] = useState({
        email: '',
    })

    // const [regUsernames, setRegUsernames] = useState([])

  function handlePass(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value,
    })
    )
  }

  // handle level selection
  const handleLevel = (e) => {
    setLevel(e.target.value)
  }

//   reset password
const resetPass = async (e) => {
    e.preventDefault()
    if(data.email !== user.email){
      return (
        setError('Email incorrect'),
        toast.error('Email incorrect')
        )
    }
    try{
        await sendPasswordResetEmail(auth, data.email)
        .then(() => {
            setMessage('Password reset link sent! Check your Inbox or Spam Folder')
            toast.info('Password reset link sent! Check your Inbox or Spam Folder')
            setShowPass(false)
        })
    }
    catch(err){
      if(err.code === "auth/invalid-email"){
        toast.error('Invalid or Incorrect email')
        setError('Invalid or Incorrect email')
      }else if(err.code === 'auth/user-not-found'){
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

// change level
const [level, setLevel] = useState("")


const updateLevel = async (e) => {
  e.preventDefault()
  setLoading(true)
  try{
      await updateDoc(doc(DocRef, user.email), {
        level: level
      })
      setLoading(false)
      setMessage(`Level Updated to ${level}`)
      toast.success('Level Updated')
      setShowLevelChange(false)
    }
    catch(err){
      console.log(err.code)
    }
}

useEffect(() => {
    if(message !== ""){
        setTimeout(() => {
            setMessage('')
        }, 4000);
    }
}, [message])

useEffect(() => {
    if(error !== ""){
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
    <div id='userSettings' onClick={() => setHideNav(true)} data-aos="fade" data-aos-easing="ease-in">
      <form>
        <h3>
          Level: {userInfo.level}  <button type='button' className='btn--small' onClick={() => setShowLevelChange(prev => !prev)}>Edit</button>
        </h3>
        {showLevelChange &&
        <>
          <select defaultValue="Select Level" name="level" onChange={handleLevel} required>
            <option defaultValue="" disabled>Select Level</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
          </select>
          <input type="submit" onClick={updateLevel}/>
        </>
        }
        {showPass &&
        <React.StrictMode>
        <label htmlFor="Registered Email">
          Re-enter your registered Email:
        </label>
        <input
        name='email'
        type="email" 
        placeholder='Enter registered Email Address' 
        value={data.email}
        onChange={(e) => handlePass(e)}
        required
        />
        <input type="submit" value="Change Password" onClick={resetPass}/>
        </React.StrictMode>
        }
        {!showPass && <button onClick={() => setShowPass(true)}>Change Password</button>}
        <button type='button' disabled>Change username <i>(coming soon...)</i></button>
        <p className='success'>{message}</p>
        <p className='error'>{error}</p>
      </form>
    </div>
  )
}
