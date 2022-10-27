import React, { useEffect } from 'react'
import HowTo from './components/LandingPage/how-to/HowTo'
import Header from './components/LandingPage/Header'
import FootNote from './components/LandingPage/FootNote'
import TopNav from './components/LandingPage/TopNav'
import { useAuth } from './context/AuthContext'
import { BeatLoader } from 'react-spinners'
import { Feedback } from './components/LandingPage/Feedback'
import { CheckForum } from './components/LandingPage/CheckForum'




export default function Home(props) {
  const { loading, setLoading } = useAuth()
  useEffect(() => {
    setLoading(true)
    props.showNav(false)

    setTimeout(() => {
      setLoading(false)
    }, 1100);
  }, [])
  
  return (
    <div>
      {loading 
      ? <div className='loader'><BeatLoader /></div>
      :
      <>
      <TopNav />
      <Header />
      <Feedback />
      <HowTo />
      <CheckForum />
      <FootNote />
      </>
      }
    </div>
  )
}
