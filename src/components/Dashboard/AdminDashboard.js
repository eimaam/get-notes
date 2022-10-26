import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { FaBook, FaFile, FaUser } from 'react-icons/fa'
import { PropagateLoader } from 'react-spinners'
import { useAuth } from '../../context/AuthContext'
import { database } from '../../firebaseConfig'

export const AdminDashboard = (props) => {
    const {loading, setLoading, user} = useAuth()

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
    
    console.log(numberOfCpe)

    useEffect(() => {
        props.showNav(false)
        getTotalUsers()
        getTotalFiles()
        getDeptUsers()
        getTotalDeptFiles()
    }, [user])

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
    <div>
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
                            return <div className='dash--card'>
                                <h2><FaUser className='icon'/></h2>
                                <div>
                                    <h2>100</h2>
                                    <h3>{item} Users </h3>
                                </div>
                            </div>
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
        </div>

    </div>
  )
}
