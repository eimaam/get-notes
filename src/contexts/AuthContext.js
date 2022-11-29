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
    // document reference in firestore db
    const DocRef = collection(database, "userDetails")


    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [isLogged, setIsLogged] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getData = async () => {
            onAuthStateChanged(auth, async data => {
                if(data){
                    setIsLogged(true)
                    setUser(data)
                    try{
                        const document = await getDoc(doc(database, "userDetails", data.email))
                        if(!document.exists()){
                            await setDoc(doc(DocRef, data.email), {
                                email: data.email 
                            })
                        }
                        setUser(data)
                        setLoading(false)
                    }
                    catch(err){
                        console.log(err.message)
                    }                
                }
            })
            }
        getData()
    }, [])

    
    // log in with gmail -- pop up
    const logInWithPopUp = async () => {
        // await setPersistence(auth, browserLocalPersistence)
        await signInWithPopup(auth, googleProvider)
        .then(res => {
            setUser({
                email: res.email,
            })
            return navigate('/addusername')
        })
        .catch(err => {
            if(err.code === 'auth/popup-blocked'){
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
        setLoading(false)
        signOut(auth)
        .then(() => {
            setUser(null)
            localStorage.clear()
            toast.info("LOGGED OUT!")
        })
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
    isLogged,
    setIsLogged
}

  return (
    <AuthContext.Provider value={value}>
        { children }
    </AuthContext.Provider>
  )
}
