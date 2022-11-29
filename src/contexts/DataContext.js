import { collection, getDocs, query, where } from 'firebase/firestore'
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

    const { user, setLoading} = useAuth()
    const [userInfo, setUserInfo] = useState({})

    // fetch all all data linked to logged in user and save in userInfo state
    const fetchUserDetail = async () => {
        setLoading(true)
        try{
            const q = query(collection(database, "userDetails"), where("email", "==", user.email))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                setUserInfo(doc.data())
            })
            setLoading(false)
        }
        catch(err){
            if(err.message === 'Failed to get document because the client is offline.'){
                toast.error('Couldn\'t load NOTES. You appear to be OFFLINE!')
            }else{
                console.log(err.message)
            }
        }
        setLoading(false)
    }
    
    // run fetch user detail anytime user state changes
    useEffect(() => {
        
        fetchUserDetail()

    }, [user])



    const value = {
        userInfo,
        setUserInfo,
        setHideNav,
        hideNav,
        fetchUserDetail,
    }

    return (
    <DataContext.Provider value={value}>
        { children }
    </DataContext.Provider>
  )
}
