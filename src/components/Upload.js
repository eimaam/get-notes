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
import { PropagateLoader } from "react-spinners"
// AOS import
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..

export default function Upload() {
  const { navigate, loading, setLoading } = useAuth()
  const { userInfo, setHideNav } = useData()

  useEffect(() => {
    onAuthStateChanged(auth, data => {
        if(!data){
          navigate('../login')
        }
    })
    console.log(userInfo)

}, [])

  const [data, setData] = useState({
    courseCode: "",
    noteName: "",
    category: ""
  })

  // state manager for uploaded file
  const [file, setFile] = useState("")
  // state to save file URL
  const [fileURL, setFileURL] = useState("")
  // state to manage/save file type before upload
  const [fileType, setFileType] = useState("")

  const [uploadProgress, setUploadProgress] = useState("")
  const storageRef = ref(storage, `/notes/${file.name}`)

  // DATE: creating date format Day/Month
    // get timestamp from Firebase
    const stamp = Timestamp.now().toDate()
    
    let day = stamp.getDate()
    let monthByIndex = stamp.getMonth();
    let fullYear = stamp.getFullYear();
    let month = monthByIndex+1;
    // add 0 to beginning of Month 1-9
    if(month <= 9){
        month = `0${month}`
    }
    // convert year to string to easily extract only last two figures eg. 2022 == 22
    const year = fullYear.toString().slice(2,4)

    // final date format
    const date = `${day}/${month}/${year}`

    // end of date formatting


  // function to get file type from added file
  function getFileType(){
    if(file){
      const fileType = file.name.split(".").pop()
      setFileType(fileType)
    }
  }

  // runs everytime file input is changed to get the current file type
  useEffect(() => {
    getFileType()
  }, [file])

  // handle form change
  function handleChange(e){
    const {name, value} = e.target
    setData(prevData => ({
      ...prevData,
      [name]: value.toLowerCase()
    }))

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
    // function to handle File/Note details
      const document = await getDoc(doc(noteRef))
      if(!document.exists()){
        await addDoc(noteRef, {
          department: userInfo.department,
          level: userInfo.level,
          category: data.category,
          CourseCode: data.courseCode,
          noteName: data.noteName,
          uploadedBy: userInfo.username ? userInfo.username : '',
          type: fileType,
          url: fileURL,
          uploadDate: date,
        })
        toast.success('Note Added!')
        setLoading(false)
      }
      navigate('../notes')
    }
    

  return (
    <div id='upload' onClick={() => setHideNav(true)} data-aos="fade">
      <form action="" onSubmit={uploadNote}>
        <div>
          <label htmlFor="department">Department:</label>
          <input 
          name='department' 
          type="text" 
          value={userInfo.department}
          disabled
          />
        </div>
        
        <div>
          <label htmlFor="level">Level:</label>
          <input 
          name='level' 
          type="text" 
          value={userInfo.level}
          disabled
          />
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
          <label htmlFor="Note Category">Select Note Category:</label>
          <select defaultValue="Select Category" name="category" onChange={handleChange}  required>
            <option defaultValue="" disabled>Select Category</option>
            <option value={userInfo.department}>Departmental Note</option>
            <option value="Others">Other Notes: Assignments, Past Questions, Summary etc</option>
            {userInfo.username === "capacity01" ? <option value="Extras">Extras: Time Table, Annoucements etc. </option> :  <option value="Extras">Extras: Time Table, Annoucements etc. </option>}
          </select>
        </div>

        {data.category != 'extras' && <div>
          <label htmlFor="course code">
            Course Code:
          </label>
          <input 
          name='courseCode' 
          type="text" 
          placeholder='Course Code XXX111' 
          onChange={handleChange}
          maxLength={6}
          pattern="[a-zA-Z]{3}[0-9]{3}"
          title='Course Code should be in the form XXX000 e.g CPE111'
          required
          />
        </div>}
        <div>
          <label htmlFor="note name">
            Title of Note:
          </label>
          <input 
          name='noteName' 
          type="text" 
          placeholder='e.g Engineering Economics NOTE I'
          maxLength={50} 
          onChange={handleChange}
          required
          />
        </div>
        <br />
        {/* sucess message */}
        {uploadProgress > 1 && <p>Checking File... {uploadProgress}% done!</p>}
        {uploadProgress === 100 && <p>Now click on UPLOAD</p>}

        {uploadProgress !== '' && uploadProgress < 100 && <button><BeatLoader color='#344648' /></button>}
        {uploadProgress > 1 ? '' : <button onClick={uploadFile}>check file </button>}
        {uploadProgress == 100 && <input type="submit" value="UPLOAD" />}
        {loading && <BeatLoader color='#fff'/>}
      </form>
    </div>
  )
}
