import React, { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence} from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify';
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PulseLoader } from "react-spinners"


export default function Login() {
  const { userInfo } = useData()
  const { logInWithPopUp, navigate, loading, setLoading, error, setError } = useAuth();


  useEffect(() => {
    onAuthStateChanged(auth, data => {
        if(data){
          navigate('../')
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
    try{
      await setPersistence(auth, browserLocalPersistence)
       
      await signInWithEmailAndPassword(auth, data.email, data.password)
        .then((res)=> console.log(res.user))
          toast.success("LOGGED IN")
          return setTimeout(() => {
            navigate('../') 
          }, 3000);
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
        }
        else{
          console.log(err.message)
          toast.error('Retry...')
        }
      }
    }
  
  
//   useEffect(()=>{
//     if(loading!==null){
//       setTimeout(()=>{
//           setLoading(false)
//       },5000)
//   }
// },[loading])

  return (
      <div id='login'>
        { loading 
        ? 
        <div>
          <PulseLoader />
        </div>
      :
      <form action="" onSubmit={handleSubmit}>
        <div>
            <label htmlFor="Passowrd">
              Email:
            </label>
            <input
            name='email'
            type="email" 
            id='email' 
            placeholder='yourAddress@example.com' 
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
            placeholder='Your Password' 
            value={data.password}
            onChange={handleChange}
            required
            />
        </div>
          <input type="submit" value="LOGIN"/>
          <p className='error'>{error}</p>
          <p>Don't have an account yet? <Link to="/signup">SIGN UP!</Link></p>
          <p>or</p>
          <button onClick={logInWithPopUp}>Sign up with <FcGoogle /></button>
          <p>Forgot Password? <Link to='/reset' className='error'>RESET NOW</Link></p>
        </form>
      }
        </div>
        )
      }
      