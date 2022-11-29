import React from 'react'
import { Outlet } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
import { FullscreenLoader } from '../components/Utilities/FullscreenLoader'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'

export const ProtectedRoutes = () => {
    const { user, navigate, loading } = useAuth()
    const { userInfo } = useData()
    
    // style to centralize the Note loader animation in center
    const mystyle = {
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "black",
  }

  if(loading){
    return <FullscreenLoader />
  }else if(userInfo.username === undefined){
    <FullscreenLoader />
    return navigate('/addusername')
  }

  return (
    user ? <Outlet /> : navigate('login')
  )
}
