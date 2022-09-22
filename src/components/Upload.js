import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
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

  // // handle file upload
  // const uploadFile = async (e) => {
  //   if(!file){
  //     toast.error('Pls add a File first!')
  //   }
  //   const uploadTask = uploadBytesResumable(storageRef, file)
  //   uploadTask.on("state_changed", (snapshot) => {
  //         const percentage = Math.round(
  //             (snapshot.bytesTransferred/snapshot.totalBytes) * 100
  //         );
  //         // update upload progress
  //         setUploadProgress(percentage);
  //     },
  //     (err) => console.log(err),

  //     async () => {
  //       // download url
  //       await getDownloadURL(uploadTask.snapshot.ref)
  //       .then((url) => {
  //           setFileURL(url);
  //       });
  //       console.log(fileURL)
  //     }
  // ); 
  // }

  // UPLOAD NOTE + NOTE DETAILS
  const noteRef = collection(database, "noteDetails") //Note reference in firebase database

  const uploadNote = async (e) => {
    e.preventDefault()
    if(!file){
      toast.error('Pls add a File first!')
    }
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on("state_changed", (snapshot) => {
          const percentage = Math.round(
              (snapshot.bytesTransferred/snapshot.totalBytes) * 100
          );
          // update upload progress
          setUploadProgress(percentage);
      },
      (err) => console.log(err),
      async () => {
        // download url
        const URL = await getDownloadURL(uploadTask.snapshot.ref)
        // .then((url) => {
        // });
        setFileURL(URL);
        console.log(fileURL)
      }
    )
    
    // function to handle File/Note details
      const document = await getDoc(doc(noteRef))
      if(!document.exists()){
        await addDoc(noteRef, {
          category: data.category,
          CourseCode: data.courseCode,
          noteName: data.noteName,
          uploadedBy: userInfo.username,
          url: fileURL,
          uploadDate: Timestamp.now().toDate()
        })
      } 
    }
  

  return (
    <div id='upload' onClick={() => setShowMnav(false)}>
      <form action="" onSubmit={uploadNote}>
        <label htmlFor="category">Category:</label>
        <select name='category' onChange={handleChange} required>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Electrical &amp; Electronics Engineering">Electrical &amp; Electronics Engineering</option>
            <option value="Others" >Others</option>
            <option value="choose note category" defaultValue='choose note category' selected disabled>Choose note category</option>
        </select>
        <label htmlFor="File ">File/Note:</label>
        <input 
        type="file" 
        name='file' 
        accept=".doc,.docx,.pdf,.ppt,.pptx,.txt,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        onChange={(e) => handleFile(e)}
        />

        <input 
        name='courseCode' 
        type="text" 
        placeholder='Course Code' 
        onChange={handleChange}
        maxLength={6}
        pattern="[a-z]{3}[0-9]{3}"
        title='Course Code should be in the form XXX000 e.g CPE111'
        required
        />

        <input 
        name='noteName' 
        type="text" 
        placeholder='e.g NOTE V' 
        onChange={handleChange}
        required
        />
        <br />
        <input type="submit" name="" id="" value="UPLOAD"/>        
        {uploadProgress > 1 && <p>Uploading... {uploadProgress} % done</p>}
      </form>
    </div>
  )
}
