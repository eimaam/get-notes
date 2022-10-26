import React from 'react'
import { useData } from '../context/DataContext'

export default function Footer() {
  const { setShowMnav } = useData()
  return (
    <footer onClick={() => setShowMnav(false)}>
        {/* <p>Built with 🧡 by <a href="mailto:imamddahir@gmail.com"> Eimaam</a></p> */}
        <div>
          <h1>GetNotes</h1>
        </div>

        {/* <p>All rights reserved.</p>
        <p><a href="https://eimaam.dev" rel='noopener noreferrer'> Tech Desk Inc. &copy; 2022</a></p> */}
    </footer>
  )
}
