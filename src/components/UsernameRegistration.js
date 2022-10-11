import React, { useEffect, useState } from 'react'
import { onAuthStateChanged} from 'firebase/auth'
import { toast } from 'react-toastify';
import { auth, database } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { collection, doc, query, updateDoc, onSnapshot, where } from 'firebase/firestore';
import { useData } from '../context/DataContext';
import { BeatLoader } from 'react-spinners';


export default function UsernameRegistration() {
    const { userInfo } = useData();
  const { user, navigate, DocRef, error, setError, loading, setLoading } = useAuth();

  useEffect(() => {
    setLoading(true)
    onAuthStateChanged(auth, data => {
        if(userInfo.username){
            navigate('../notes')
        }
        if(!data){
          navigate('../login')
        }
    })
    setTimeout(() => {
      setLoading(false)
    })
}, [])

  const [data, setData] = useState({
    username: '',
  })

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value,
    })
    )
  }

  // check for usernames
  const [regUsernames, setRegUsernames] = useState([])
  const username = data.username;
  
  // regular expression for USERNAME
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

  // Add Username
  const addUsername = async (e) => {
    e.preventDefault()
    if(data.username === takenUsername){
      return toast.error('Username already taken!')
      // check if username matches requested format from username regular expression usernameRegex
    }else if(!usernameRegex.test(data.username)){
      setError('Username must be at least 3 characters long, not starting with a number and can\'t end with \'.\'')
      return toast.error('Username format not supported')
    }else{
      await updateDoc(doc(DocRef, user.email), {
        username: username,
      })
    }
      toast.info("Profile Updated!")
      return navigate('../notes')
  }
  

  return (
    <div id='login'>
      {loading ? <BeatLoader /> : 
      
      <form action="" onSubmit={addUsername}>
        <label htmlFor="Username">
          Username:
        </label>
        <input
        name='username'
        type="text" 
        id='username' 
        placeholder='Username' 
        value={data.username}
        min={3}
        onChange={(e) => handleChange(e)}
        />
        <p className='error'>{error}</p>
        <input type="submit" value="UPDATE PROFILE"/>
      </form>
      }
    </div>
  )
}
