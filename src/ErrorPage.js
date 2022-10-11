import React from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ErrorPage(props) {
  useEffect(() => {
    props.showNav(false)
  })
  return (
    <div id='home' style={{backgroundColor: "red"}}>
        <h1>PAGE BROKEN or DOES NOT EXIST...</h1>
        <h2>Go to <Link to="../">Homepage</Link></h2>
    </div>
  )
}
