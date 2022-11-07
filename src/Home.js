import React, { useEffect } from 'react'
import HowTo from './components/LandingPage/how-to/HowTo'
import Header from './components/LandingPage/Header'
import FootNote from './components/LandingPage/FootNote'
import TopNav from './components/LandingPage/TopNav'
import { useAuth } from './context/AuthContext'
import { BeatLoader, PulseLoader } from 'react-spinners'
import { Feedback } from './components/LandingPage/Feedback'
import { CheckForum, ForumNotice } from './components/LandingPage/ForumNotice'




export default function Home(props) {
  const { loading, setLoading } = useAuth()
  
  return (
    <>
      <TopNav />
      <Header />
      <Feedback />
      <HowTo />
      <ForumNotice />
      <FootNote />
    </>
  )
}
