import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { auth, database, storage } from '../firebaseConfig'

export default function Upload() {
  const { navigate } = useAuth()
  const { userInfo, setShowMnav } = useData()

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
  const [file, setFile] = useState("")
  const [fileURL, setFileURL] = useState("")
  const [uploadProgress, setUploadProgress] = useState("")
  const storageRef = ref(storage, `/notes/${file.name}`)

  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value
    }))
    console.log(data)
  }
  
  //handle file upload change
  function handleFile(e){
    setFile(e.target.files[0])
  } 
  // handle file upload
  function uploadFile(e){
    if(!file){
      toast.error('Pls add a File first!')
    }
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on("state_changed", (snapshot) => {
          const uploadProgress = Math.round(
              (snapshot.bytesTransferred/snapshot.totalBytes) * 100
          );
          // update upload progress
          setUploadProgress(uploadProgress);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
            setFileURL(url);
        });
      }
  ); 
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

  // UPLOAD NOTE + NOTE DETAILS
  const noteRef = collection(database, "noteDetails") //Note reference in firebase database
  const uploadNote = async (e) => {
    e.preventDefault()
    if(fileURL == ""){
      return toast.error("Retry...")
    }
    uploadFile() //Calling the function for handling file upload
    // function to handle File/Note details
    setTimeout(async () => {
      const document = await getDoc(doc(noteRef))
      if(!document.exists()){
        await addDoc(noteRef, {
          category: data.category,
          CourseCode: data.courseCode,
          noteName: data.noteName,
          uploadedBy: userInfo.username,
          url: fileURL
        })
      } 
    }, 5000);
    if(uploadProgress == 100){
      toast.success('Note Uploaded')
    }
  }

  return (
    <div id='upload' onClick={() => setShowMnav(false)}>
      <form action="" onSubmit={uploadNote}>
        <label htmlFor="category">Category:</label>
        <select name='category' onChange={(e) => handleChange(e)}>
            <option name='category' value="Computer Engineering" onChange={(e) => handleChange(e)}>Computer Engineering</option>
            <option name='category' value="Electrical &amp; Electronics Engineering" onChange={(e) => handleChange(e)}>Electrical &amp; Electronics Engineering</option>
            <option name='category' value="Others" onChange={(e) => handleChange(e)}>Others</option>
            <option name='category' value="choose note category" selected disabled>Choose note category</option>
        </select>
        <label htmlFor="File ">File/Note:</label>
        <input 
        type="file" 
        name='file' 
        accept=".doc,.docx,.pdf,.ppt,.pptx,.txt,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        onChange={(e) => handleFile(e)}
        />

        <label htmlFor="course code">Course Code:</label>
        <input 
        name='courseCode' 
        type="text" 
        placeholder='Course Code of Note' 
        onChange={(e) => handleChange(e)}
        />

        <label htmlFor="Note Title">Name/Title of Note:</label>
        <input name='noteName' type="text" placeholder='e.g NOTE V' onChange={(e) => handleChange(e)}/>
        <br />
        <input type="submit" name="" id="" value="UPLOAD"/>        
        {uploadProgress > 1 && <p>Uploading... {uploadProgress} % done</p>}
      </form>
    </div>
  )
}
