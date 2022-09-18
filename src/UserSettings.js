import React, { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, sendPasswordResetEmail} from 'firebase/auth'
import { toast } from 'react-toastify';
import { auth } from './firebaseConfig';
import { useAuth } from './context/AuthContext';
import userEvent from '@testing-library/user-event';
import { useData } from './context/DataContext';



export default function UserSettings() {
    const { navigate, setError, error, message, setMessage } = useAuth()

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
        if(err.code == "auth/invalid-email"){
            toast.error('Invalid or Incorrect email')
            setError('Invalid or Incorrect email')
        }
        toast.error(err.code)
        setError(err.code)
        console.log(err.code)
    }
}

useEffect(() => {
    if(message != ""){
        setTimeout(() => {
            setMessage('')
        }, 2500);
    }
}, [message])
useEffect(() => {
    if(error != ""){
        setTimeout(() => {
            setError('')
        }, 2500);
    }
}, [error])


  return (
    <div id='login'>
      <form action="" onSubmit={resetPass}>
        {show &&
        <React.StrictMode>
        <label htmlFor="Username">
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
        <button disabled>Change username <i>(coming soon...)</i></button>
        <p>{message}</p>
        <p>{error}</p>
      </form>
    </div>
  )
}