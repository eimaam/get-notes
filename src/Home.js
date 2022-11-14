import React, { useEffect } from 'react'
import HowTo from './components/LandingPage/how-to/HowTo'
import Header from './components/LandingPage/Header'
import FootNote from './components/LandingPage/FootNote'
import TopNav from './components/LandingPage/TopNav'
import { Feedback } from './components/LandingPage/Feedback'
import { ForumNotice } from './components/LandingPage/ForumNotice'
import { DailyQuotes } from './components/LandingPage/DailyQuotes'

// AOS import
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..



export default function Home(props) {

  useEffect(() => {
    AOS.init({delay: 250})
  }, [])

  return (
    <>
      <TopNav />
      <Header />
      <Feedback />
      <HowTo />
      <ForumNotice />
      <DailyQuotes />
      <FootNote />
    </>
  )
}
