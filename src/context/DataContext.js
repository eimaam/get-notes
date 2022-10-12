import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
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

    // NAV hide state manager: managing hide navigation bar on clicking outside of the nav
    const [hideNav, setHideNav] = useState(true);

    const { user } = useAuth()
    const [userInfo, setUserInfo] = useState({})


    // fetch all all data linked to logged in user and save in userInfo state
    const fetchUserDetail = async() => {
        try{
            const data = await getDoc(doc(database, "userDetails", user.email))
            .then(res => {
                setUserInfo(res.data())
            })
        }
        catch(err){
            if(err.message === 'Failed to get document because the client is offline.'){
                toast.error('Couldn\'t load NOTES. You appear to be OFFLINE!')
            }
            console.log(err.message)
        }
    }


    

    
    
  
    const value = {
        userInfo,
        fetchUserDetail,
        setUserInfo,
        setHideNav,
        hideNav,
    }

    return (
    <DataContext.Provider value={value}>
        { children }
    </DataContext.Provider>
  )
}
