import React, { useState, useEffect, useContext } from 'react'
import { createContext } from 'react'
import { database, auth, googleProvider } from '../firebaseConfig'
import { Navigate, useNavigate } from 'react-router-dom'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const navigate = useNavigate()
    const DocRef = collection(database, "userDetails")

    const [loading, setLoading] = useState(false)
    const [isLogged, setIsLogged] = useState(false)
    const [user, setUser] = useState({})

    const getData = async () => {
        onAuthStateChanged(auth, async data => {
            if(data){
                setIsLogged(true)

                try{
                    const document = await getDoc(doc(database, "userDetails", data.email))
                    if(!document.exists()){
                        await setDoc(doc(DocRef, data.email), {
                            email: data.email 
                        })
                    }
                }
                catch(err){
                    toast.error(err.message)
                }
            }
            setUser(data)
            console.log(data)
        })
    }

    // UseEffect Fetch User Data
    useEffect(() => {
        getData()
    }, [])

    const logInWithPopUp = () => {
        signInWithPopup(auth, googleProvider)
        .then(res => {
            setUser({
                email: res.email
            })
            return navigate('../addusername')
        })
        .catch(err => {
            if(err.code == 'auth/popup-blocked'){
                toast.error(err.code)
            }else{
                toast.error(err.message)
            }
        })
    }

    const logOut = () => {
        setIsLogged(false)
        signOut(auth)
        .then(() => {
            localStorage.clear()
            toast.info("LOGGED OUT!")
        })
        navigate('../login')
    }

    
const value = {
    user,
    setUser,
    DocRef,
    logInWithPopUp,
    logOut,
    navigate
}

  return (
    <AuthContext.Provider value={value}>
        { children }
    </AuthContext.Provider>
  )
}
