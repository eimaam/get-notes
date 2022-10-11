import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { BeatLoader } from 'react-spinners'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { auth, database, storage } from '../firebaseConfig'

export default function Upload() {
  const { navigate, loading, setLoading } = useAuth()
  const { userInfo, setHideNav } = useData()

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
  const uploadFile = async (e) => {
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
        await getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
            setFileURL(url);
        });
      }
  );
  }

  
  // UPLOAD NOTE + NOTE DETAILS
  const noteRef = collection(database, "noteDetails") //Note reference in firebase database

  const uploadNote = async (e) => {
    e.preventDefault()
    setLoading(true)
    if(data.category === ''){
      toast.error('Pls select a Note category!')
      setLoading(false)
      return;
    }
    // function to handle File/Note details
      const document = await getDoc(doc(noteRef))
      if(!document.exists()){
        await addDoc(noteRef, {
          category: data.category,
          CourseCode: data.courseCode,
          noteName: data.noteName,
          uploadedBy: userInfo.username ? userInfo.username : '',
          url: fileURL,
          uploadDate: Timestamp.now().toDate()
        })
        toast.success('Note Added!')
        setLoading(false)
      }
      navigate('../notes')
    }
    

  return (
    <div id='upload' onClick={() => setHideNav(true)}>
      <form action="" onSubmit={uploadNote}>
        <div>
          <label htmlFor="category">Category:</label>
          <select defaultValue='Choose Note Category' name='category' onChange={handleChange} required>
              <option>Computer Engineering</option>
              <option>Electrical &amp; Electronics Engineering</option>
              <option>Others</option>
              <option defaultValue='' disabled>Choose Note Category</option>
          </select>
        </div>

        <div>
          <label htmlFor="File ">File/Note:</label>
          <input 
          type="file" 
          name='file' 
          accept=".doc,.docx,.pdf,.ppt,.pptx,.txt,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
          onChange={(e) => handleFile(e)}
          />
        </div>

        <div>
          <label htmlFor="course code">
            Course Code:
          </label>
          <input 
          name='courseCode' 
          type="text" 
          placeholder='Course Code xxx111' 
          onChange={handleChange}
          maxLength={6}
          pattern="[a-z]{3}[0-9]{3}"
          title='Course Code should be in the form XXX000 e.g CPE111'
          required
          />
        </div>
        <div>
          <label htmlFor="note name">
            Title of Note:
          </label>
          <input 
          name='noteName' 
          type="text" 
          placeholder='e.g NOTE V' 
          onChange={handleChange}
          required
          />
        </div>
        <br />
        {/* sucess message */}
        {uploadProgress > 1 && <p>Checking File... {uploadProgress}% done!</p>}
        {uploadProgress === 100 && <p>Now click on UPLOAD</p>}

        {uploadProgress != '' && uploadProgress < 100 && <button><BeatLoader color='#344648' /></button>}
        {uploadProgress > 1 ? '' : <button onClick={uploadFile}>check file </button>}
        {uploadProgress == 100 && <input type="submit" value="UPLOAD" />}
        {loading && <BeatLoader color='#fff'/>}
      </form>
    </div>
  )
}
