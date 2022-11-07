import React from 'react'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export const Success = () => {
    const { fetchUserDetail, userInfo } = useData()
    const { user } = useAuth()
    
    useEffect(() => {
        fetchUserDetail()
    }, [])

console.log(user.email)

  return (
    <div>
        <h2>Signed Up successfully...</h2>

        <button><a href='/notes'> go to NOTES</a></button>
    </div>
  )
}
