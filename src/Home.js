import React, { useEffect, useState } from 'react'
import Feedback from './components/LandingPage/Feedback'
import HowTo from './components/LandingPage/how-to/HowTo'
import ProcedureCard from './components/LandingPage/how-to/ProcedureCard'
import Header from './components/LandingPage/Header'
import FootNote from './components/LandingPage/FootNote'
import TopNav from './components/LandingPage/TopNav'



export default function Home(props) {
  useEffect(() => {
    props.showNav(false)
  }, [])
  
  return (
    <div>
      <TopNav />
      <Header />
      <Feedback />
      <HowTo />
      <FootNote />
    </div>
  )
}
