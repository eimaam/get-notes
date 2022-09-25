import React, { useState, useEffect, useContext } from 'react'
import { createContext } from 'react'
import { database, auth, googleProvider } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from 'firebase/auth'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const navigate = useNavigate()
    const DocRef = collection(database, "userDetails")


    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isLogged, setIsLogged] = useState(false)
    const [user, setUser] = useState({})

    const getData = async () => {
        setLoading(true)
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
                    console.log(err.message)
                }                
            }
            setUser(data)
            setLoading(false)
        })
    }

    // UseEffect Fetch User Data
    useEffect(() => {
        getData()
    }, [])

    const logInWithPopUp = async () => {
        await setPersistence(auth, browserLocalPersistence)
        await signInWithPopup(auth, googleProvider)
        .then(res => {
            setUser({
                email: res.email
            })
            return navigate('../addusername')
        })
        .catch(err => {
            if(err.code == 'auth/popup-blocked'){
                toast.error('Pop-up blocked by browser!')
            }else if(err.code === 'auth/internal-error'){
                toast.error('Internal error... Check your internet connection & retry!')
            }
            else{
                toast.error(err.code)
            }
        })
    }

    const logOut = async () => {
        setIsLogged(false)
        setUser(null)
        signOut(auth)
        .then(() => {
            localStorage.clear()
            toast.info("LOGGED OUT!")
        })
        if(!user){
            navigate('../login')
        }else{
            navigate('../')
        }
    }

    
    
const value = {
    user,
    setUser,
    DocRef,
    logInWithPopUp,
    logOut,
    navigate,
    message,
    setMessage,
    error,
    setError,
    loading,
    setLoading,
}

  return (
    <AuthContext.Provider value={value}>
        { children }
    </AuthContext.Provider>
  )
}
