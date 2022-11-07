import { addDoc, collection, doc, getDocs, getDoc, query, where, Timestamp, onSnapshot } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { FaBook, FaFile, FaUser } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { auth, database, storage } from '../../firebaseConfig'
import { toast } from 'react-toastify'
import { HashLoader } from 'react-spinners'
import { onAuthStateChanged } from 'firebase/auth'



export const AdminDashboard = (props) => {

    const { navigate, loading, setLoading, user } = useAuth();
    const { userInfo, setHideNav } = useData()

  useEffect(() => {
    onAuthStateChanged(auth, data => {
        if(!data){
          navigate('../login')
        }
    })
    }, [])

  const [data, setData] = useState({
    courseCode: "",
    noteName: "",
    category: "",
    level: "",
    department: ""
  })

  // state manager for uploaded file
  const [file, setFile] = useState("")
  // state to save file URL
  const [fileURL, setFileURL] = useState("")
  // state to manage/save file type before upload
  const [fileType, setFileType] = useState("")

  const [uploadProgress, setUploadProgress] = useState(0)
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
            return setFileURL(url);
        });
      }
  );
  }

  console.log(uploadProgress, fileURL)

  //Note reference in firebase database
  const noteRef = collection(database, "noteDetails") 
  
  // UPLOAD NOTE + NOTE DETAILS func
  const uploadNote = async (e) => {
    e.preventDefault()
    setLoading(true)
    // function to handle File/Note details
      const document = await getDoc(doc(noteRef))
      if(!document.exists()){
        await addDoc(noteRef, {
          department: data.department,
          level: data.level,
          category: data.category,
          CourseCode: data.courseCode,
          noteName: data.noteName,
          uploadedBy: userInfo.username ? userInfo.username : '',
          type: fileType,
          url: fileURL,
          uploadDate: date,
        })
        toast.success(`Note Added! to ${data.department}`)
        setLoading(false)
        setUploadProgress(0)
      }
      setLoading(false)
    }

    const [totalUsers, setTotalUsers] = useState(null)
    const [totalFiles, setTotalFiles] = useState(null)

    const getTotalUsers = async () => {
        setLoading(true)
        try{
            let data = await getDocs(collection(database, "userDetails"))
            setTotalUsers(data._snapshot.docChanges.length)
        }
        catch(err){
            console.log(err)
        }
        
        setLoading(false)
    }

    const getTotalFiles = async () => {
        setLoading(true)
        try{
            let data = await getDocs(collection(database, "noteDetails"))
            setTotalFiles(data._snapshot.docChanges.length)
        }
        catch(err){
            console.log(err)
        }

        setLoading(false)
    }


    // get total files based on department
    const [totalCpeFiles, setTotalCpeFiles] = useState({})
    const getTotalDeptFiles = async () => {
        setLoading(true)
        try{
            let data = await getDocs(collection(database, "noteDetails"), where("category", "==", "computer engineering"))
            // setTotalCpeFiles(data._snapshot.docChanges.length)
            console.log(data)
        }
        catch(err){
            console.log(err)
        }

        setLoading(false)
    }

    const [numberOfCpe, setNumberOfCpe] = useState([])

    const getDeptUsers = async () => {
        setLoading(true)
        try{
            // let data = await query(collection(database, "noteDetails"), where("student", "==", "no"))
            // console.log(data)
            
            const q = query(collection(database, "noteDetails"), where("student", "==", "no"))
            await onSnapshot(q,snapShot => {
                setNumberOfCpe(snapShot.docs.map(data => ({
                    ...data.data(),
                    id: data.id
                })))
            })
            
        }
        catch(err){
            console.log(err.message)
        };
    setLoading(false)

    }
    
    useEffect(() => {
        getTotalUsers()
        getTotalFiles()
        getDeptUsers()
        getTotalDeptFiles()
    }, [user])

    // array of departments
    const departments = [
        "AEE",
        "CHE",
        "CWE",
        "CPE",
        "EEE",
        "FST",
        "MEE",
    ]


  return (
    <div id='dashboard'>
        {/* {loading 
        ? <PropagateLoader /> 
        :  */}
        <div className='dashboard'>
            <div>
                <div>
                    <h1>Site Stats:</h1>
                </div>
                <div className='cards--section'>
                    <div>
                        <h2>Total Number of Users/Files:</h2>
                    </div>
                    <div className='flex'>
                        <div className='dash--card'>
                            <h2><FaUser className='icon'/></h2>
                            <div>
                                <h2>{totalUsers}</h2>
                                <h3>Total Number of Users</h3>
                            </div>
                        </div>
                        <div className='dash--card'>
                            <h2><FaUser className='icon'/></h2>
                            <div>
                                <h2>100</h2>
                                <h3>Total Number of Users registered as Student</h3>
                            </div>
                        </div>
                        <div className='dash--card'>
                            <h2><FaUser className='icon'/></h2>
                            <div>
                                <h2>100</h2>
                                <h3>Total Number of Users registered as Not Student</h3>
                            </div>
                        </div>
                        <div className='dash--card'>
                            <h2><FaFile className='icon'/></h2>
                            <div>
                                <h2>{totalFiles}</h2>
                                <h3>Total Number of Files</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='cards--section'>
                    <h2>Total Number of Users based on Department:</h2>
                    <div className='flex'>
                        {departments.map((item, index) => {
                            return (<div className='dash--card' key={index}>
                                <h2><FaUser className='icon'/></h2>
                                <div>
                                    <h2>100</h2>
                                    <h3>{item} Users </h3>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>

                {/* total files in site 
                            based on department */}
                <div className='cards--section'>
                    <h2>Total Number of Files based on Department:</h2>
                    <div className='flex'>
                        {departments.map((item, index) => {
                            return <div className='dash--card'>
                                <h2><FaFile className='icon'/></h2>
                                <div>
                                    <h2>100</h2>
                                    <h3>{item} Users </h3>
                                </div>
                            </div>
                        })}
                    </div>
                </div>

                <div className='cards--section'>
                    <div>
                        <h2>Add Notes to Catalog:</h2>
                    </div>
                    <div className='flex'>
                        {departments.map((item, index) => {
                            return <div key={index} className="dash--card">
                                <h2><FaBook className='icon'/></h2>
                                <div>
                                    <h2>{item}</h2>
                                    <h3>Add Note to {item}</h3>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        <div className='form--section'>
            <form action="" onSubmit={uploadNote} style={{textAlign: "left"}}>
                <div>
                    <label htmlFor="Note Category">Select Department:</label>
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
                </div>

                <div>
                    <label htmlFor="Note Category">Select Note Category:</label>
                    <select defaultValue="Select Category" name="category" onChange={handleChange}  required>
                        <option defaultValue="" disabled>Select Category</option>
                        <option value={userInfo.department}>Departmental Note</option>
                        <option value="Others">Other Notes: Assignments, Past Questions, Summary etc</option>
                        <option value="Extras">Extras: Time Table, Annoucements etc. </option>
                    </select>
                </div>
                
                {data.category !== "extras" && 
                <div>
                    <label htmlFor="level">Level:</label>
                    <select defaultValue="Select Level" name="level" onChange={handleChange} required>
                        <option defaultValue="" disabled>Select Level</option>
                        <option value="100">100 Level</option>
                        <option value="200">200 Level</option>
                        <option value="300">300 Level</option>
                        <option value="400">400 Level</option>
                        <option value="500">500 Level</option>
                    </select>
                </div>
                }

                {data.category !== 'extras' && <div>
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
                    <label htmlFor="File ">File/Note:</label>
                    <input 
                    type="file" 
                    name='file' 
                    accept=".doc,.docx,.pdf,.ppt,.pptx,.txt,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                    onChange={(e) => handleFile(e)}
                    />
                </div>

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

            {uploadProgress !== 0 && uploadProgress < 100 && <button><HashLoader color='#344648' /></button>}
            {uploadProgress > 1 ? '' : <button onClick={uploadFile}>check file </button>}
            {uploadProgress == 100 && <input type="submit" value="UPLOAD" />}
            {loading && <HashLoader color='#fff'/>}
            </form>
        </div>
        </div>

    </div>
  )
}
