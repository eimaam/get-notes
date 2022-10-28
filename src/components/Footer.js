import React from 'react'
import { useData } from '../context/DataContext'

export default function Footer() {
  const { setShowMnav } = useData()
  return (
    <footer onClick={() => setShowMnav(false)}>
        {/* <p>Built with 🧡 by  Eimaam</a></p> */}
        <div>
          <h4><i>getnotes.xyz</i></h4>
        </div>
        <div>
          <p>All rights reserved.</p>
          <p>Built with 🧡 by <a href="mailto:1leadtechie@gmail.com">Tech Desk Inc.</a> &copy; 2022</p>
        </div>

    </footer>
  )
}
