import React, { useEffect, useState } from 'react'
import { onAuthStateChanged} from 'firebase/auth'
import { toast } from 'react-toastify';
import { auth, database } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { collection, doc, query, updateDoc, onSnapshot, where } from 'firebase/firestore';
import { useData } from '../contexts/DataContext';
import { HashLoader } from 'react-spinners';


export default function AddData() {
    const { userInfo, fetchUserDetail } = useData();
  const { user, navigate, DocRef, error, setError, loading, setLoading } = useAuth();

// check that user has a username and also level set
// if yes, go to notes page else display form to fill in
  useEffect(() => {
    if(userInfo.username != undefined && userInfo.level != undefined){
        navigate('notes')
      }else{
          setLoading(false)
      }   
  }, [userInfo, user])

  // check if user is logged in or nah
  useEffect(() => {
    onAuthStateChanged(auth, data => {
      !data && navigate('login')
    })
  }, [])

  //state to save Student or not confirmation - Check if a user 
  const [studentSelection, setStudentSelection] = useState("")

  const [data, setData] = useState({
    username: userInfo.username != undefined ? userInfo.username : '',
    department: '',
    level: '',
  })

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value.toLowerCase(),
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
  const addData = async (e) => {
    e.preventDefault()
    if(data.username === takenUsername && data.username != userInfo.username){
      return toast.error('Username already taken!')
      // check if username matches requested format from username regular expression usernameRegex
    }else if(!usernameRegex.test(data.username)){
      setError('Username must be at least 3 characters long, not starting with a number and can\'t end with \'.\'')
      return toast.error('Username format not supported')
    }else if(studentSelection === "yes" && data.department === ""){
      setError('Select Department')
      return toast.error('Select Department')
    }else if(studentSelection === "yes" && data.level === ""){
      setError('Oops! You forgot Level')
      return toast.error('Oops! You forgot Level')
    }else{
      await updateDoc(doc(DocRef, user.email), {
        username: username,
        department: data.department,
        level: data.level,
        student: studentSelection,
      })
    fetchUserDetail()
    }
      toast.info("Profile Updated!")
      return navigate('../notes')
  }

  
  
  // Handle student or not selection state 
  function handleStudentSelection(e){
    
    // check if a user is a student or not
    // if student, value is store as yes else stored as no
    const notStudentOption = document.getElementById('notStudent')
    const studentOption = document.getElementById('student')

    if(studentOption.checked){
      notStudentOption.disabled = true
      return setStudentSelection("yes")
    }else{
      notStudentOption.disabled = false 
      setStudentSelection("") 
    } 

    if(notStudentOption.checked){
      studentOption.disabled = true
      setStudentSelection(notStudentOption.value) 
    }else{
      studentOption.disabled = false
      setStudentSelection("") 
    }

  }

  // style loader
  const mystyle = {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "black",
}

 


// component body
  return (
    <div id='login'>
      {loading 
      
      ? 
      
      <HashLoader /> 
      
      :

        <form className='confirm' data-aos="fade" data-aos-easing="ease-out">
              <h3>We need few details about you...</h3>
              <p>Are you an Engineering Student of the University of Maiduguri?</p>
              <div className='flex'>
                <div>
                  <input type="checkbox" value="yes" name='student' id='student' onChange={handleStudentSelection}/>
                  <label htmlFor="" >YES</label>
                </div>
                <div>
                  <input type="checkbox" value="no" name='student' id='notStudent' onChange={handleStudentSelection}/>
                  <label htmlFor="">NO</label>
                </div>
              </div>
              <br />
        </form>
      }

      {/* form to display if user is registering as a student */}
      {studentSelection === "yes" 
      &&     
      <form action="" onSubmit={addData} data-aos="fade-up" data-aos-easing="ease-out">
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
        
        <label htmlFor="Department">
          Department
        </label>
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
        
        <label htmlFor="Level">
          Level
        </label>
        <select defaultValue="Select Level" name="level" onChange={handleChange} required>
          <option defaultValue="" disabled>Select Level</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
        </select>
        <p className='error'>{error}</p>
        <input type="submit" value="UPDATE PROFILE"/>
      </form>
      }

      {/* form to display if user is not a student */}
      {studentSelection === "no"
      &&
      <form action="" onSubmit={addData} data-aos="fade-up" data-aos-easing="ease-out">
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
