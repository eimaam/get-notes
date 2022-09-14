import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { createContext } from 'react'
import { toast } from 'react-toastify'
import { database } from '../firebaseConfig'
import { useAuth } from './AuthContext'


const DataContext = createContext()

export const useData = () => {
    return useContext(DataContext)
}


export default function DataProvider({ children }) {

    // NAV show and hide state manager
    const [showMnav, setShowMnav] = useState(false);


    const { user } = useAuth()
    const [userInfo, setUserInfo] = useState({})

    const fetchUserDetail = async() => {
        const data = await getDoc(doc(database, "userDetails", user.email))
        .then(res => {
            setUserInfo(res.data())
            console.log(res.data())
        })
        .catch(err => toast.error(err.message))
    }
  
  
  
    const value = {
        userInfo,
        fetchUserDetail,
        setUserInfo,
        setShowMnav,
        showMnav
    }

    return (
    <DataContext.Provider value={value}>
        { children }
    </DataContext.Provider>
  )
}
