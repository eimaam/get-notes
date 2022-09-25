import React, { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, sendPasswordResetEmail} from 'firebase/auth'
import { toast } from 'react-toastify';
import { auth } from './firebaseConfig';
import { useAuth } from './context/AuthContext';
import userEvent from '@testing-library/user-event';
import { useData } from './context/DataContext';
import { useParams } from 'react-router-dom';



export default function UserSettings() {
  const { navigate, setError, error, message, setMessage } = useAuth()
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
        console.log(err.code)
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


  return (
    <div id='login' onClick={() => setHideNav(true)}>
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
        <button type='button' disabled>Change username <i>(coming soon...)</i></button>
        <p className='success'>{message}</p>
        <p className='error'>{error}</p>
      </form>
    </div>
  )
}
