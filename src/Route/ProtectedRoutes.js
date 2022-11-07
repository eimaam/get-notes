import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoutes = () => {
    const { user, navigate, isLogged } = useAuth()
  return (
    user ? <Outlet /> : navigate('login')
  )
}
