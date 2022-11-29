import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence} from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify';
import { auth } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { BeatLoader } from "react-spinners"
import { FaKey, FaUser } from 'react-icons/fa';
// ..


export default function Login() {
  const { logInWithPopUp, navigate, loading, setLoading, error, setError } = useAuth();
  const { setHideNav } = useData()


  useEffect(() => {
    setLoading(false)
    onAuthStateChanged(auth, data => {
        if(data){
          navigate('notes')
        }
    })
}, [])


  const [data, setData] = useState({
    email: '',
    password: '',
  })

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value,
    })
    )
  }

  // Sign in with Email and Password
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, data.email, data.password)
        .then((res) => {
          toast.success(`Welcome...👋`)
          navigate('/welcome') 
          setLoading(false)
        })
      }
      catch(err){
        if(err.code === 'auth/wrong-password'){
          toast.error('Wrong Password')
          setError('Wrong Password')
        }else if(err.code === 'auth/too-many-requests'){
          toast.error('Too many trials! You will have to reset your password to access this site!')
          setError('Too many trials! You will have to reset your password to access this site!')
        }else if(err.code === 'auth/user-not-found'){
          toast.error('User not found!')
          setError('User not found!')
        }else if(err.code === 'auth/network-request-failed'){
          setError('Sorry...! Something went wrong. Check your internet connection')
        }
        else{
          console.log(err.message)
          toast.error('Retry...')
        }
      }
    }
  




    
  return (
      <div id='login' onClick={() => setHideNav(true)} data-aos="flip-up" data-aos-easing="ease-in">
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Hello there!👋 </h2>
          <p>Enter your log in credentials to gain access </p>
        </div>
        <div className='input--field'>
            <span><FaUser /></span>
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

        <div className='input--field'>
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
          {loading && <button><BeatLoader color='#fff'/></button>}
          {!loading && <input type="submit" value="Log in"/>}
          
          <p>Forgot Password? <Link to='/reset' className='error'>RESET NOW</Link></p>
          {/* error message */}
          <p className='error'>{error}</p>
          <p>Don't have an account yet? <Link to="/signup" style={{color: '#ffbd0c'}}>SIGN UP!</Link></p>
          <p>or</p>
          <button onClick={logInWithPopUp} className='flex'>
            Log in with <FcGoogle />
          </button>
      </form>
      </div>
        )
      }
      