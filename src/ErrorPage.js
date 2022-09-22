import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function ErrorPage(props) {
  const { setShowNav } = useAuth()
  return (
    <div id='home' style={{backgroundColor: "red"}}>
      {() => setShowNav(false)}
        <h1>PAGE BROKEN or DOES NOT EXIST...</h1>
        <h2>Go to <Link to="../">Homepage</Link></h2>

      {/* remove navigation bar
      {props.Nav(false)} */}
    </div>
  )
}
