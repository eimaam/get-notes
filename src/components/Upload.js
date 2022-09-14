import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { auth, database } from '../firebaseConfig'

export default function Upload() {
  const { navigate } = useAuth()
  const { userInfo } = useData()

  useEffect(() => {
    onAuthStateChanged(auth, data => {
        if(!data){
          navigate('../login')
        }
    })
}, [])

  const [data, setData] = useState({
    category: "",
    courseCode: "",
    noteName: ""
  })

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value
    }))
    console.log(data)
  }

  // const uploadNote = async (e) => {
  //   e.preventDefault()
  //   const document = await getDoc(doc(database, "noteDetails", data.category))
  //   if(!document.exists()){
  //     setDoc(doc(database, "noteDetails", data.category), {
  //       category: data.category,
  //       CourseCode: data.courseCode,
  //       noteName: data.noteName,
  //       uploadedBy: userInfo.username
  //     })
  //   }
  //   toast.success("Note Uploaded!")
  // }

  const noteRef = collection(database, "noteDetails")
  const uploadNote = async (e) => {
    e.preventDefault()
    const document = await getDoc(doc(noteRef))
    if(!document.exists()){
      await addDoc(noteRef, {
        category: data.category,
        CourseCode: data.courseCode,
        noteName: data.noteName,
        uploadedBy: userInfo.username
      })
    } 
    toast.success("Note Uploaded!")
  }

  return (
    <div id='upload'>
      <form action="" onSubmit={uploadNote}>
        <label htmlFor="category">Category:</label>
        <select name='category' onChange={(e) => handleChange(e)}>
            <option name='category' value="Computer Engineering" onChange={(e) => handleChange(e)}>Computer Engineering</option>
            <option name='category' value="Electrical &amp; Electronics Engineering" onChange={(e) => handleChange(e)}>Electrical &amp; Electronics Engineering</option>
            <option name='category' value="Others" onChange={(e) => handleChange(e)}>Others</option>
            <option name='category' value="choose note category" selected>Choose note category</option>
        </select>
        <label htmlFor="File ">File/Note:</label>
        <input id='file' type="file" />
        <label htmlFor="course code">Course Code:</label>
        <input name='courseCode' type="text" placeholder='Course Code of Note' onChange={(e) => handleChange(e)}/>
        <label htmlFor="Note Title">Name/Title of Note:</label>
        <input name='noteName' type="text" placeholder='e.g NOTE V' onChange={(e) => handleChange(e)}/>
        <br />
        <input type="submit" name="" id="" value="UPLOAD"/>
      </form>
    </div>
  )
}
