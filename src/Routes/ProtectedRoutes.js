import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const ProtectedRoutes = () => {
    const { user, navigate } = useAuth()
  return (
    user ? <Outlet /> : navigate('login')
  )
}
