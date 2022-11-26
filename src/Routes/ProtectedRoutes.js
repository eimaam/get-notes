import React from 'react'
import { Outlet } from 'react-router-dom'
import { MoonLoader } from 'react-spinners'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'

export const ProtectedRoutes = () => {
    const { user, navigate } = useAuth()
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

  if(userInfo === undefined){
      return <div style={mystyle}>
                  <MoonLoader />
              </div>
  }else if(userInfo.username === undefined){
      <div style={mystyle}>
        <MoonLoader />
      </div>
    return navigate('addusername')
  }

  return (
    user ? <Outlet /> : navigate('login')
  )
}
