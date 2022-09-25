import React from 'react'
import { useData } from '../context/DataContext'

export default function Footer() {
  const { setShowMnav } = useData()
  return (
    <footer onClick={() => setShowMnav(false)}>
        {/* <p>Built with 🧡 by <a href="mailto:imamddahir@gmail.com"> Eimaam</a></p> */}
        <p>All rights reserved.</p>
        <p>Tech Desk Inc. &copy; 2022</p>
    </footer>
  )
}
