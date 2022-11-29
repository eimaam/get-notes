import React from 'react'
import { useEffect } from 'react'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { FcCheckmark } from 'react-icons/fc'
import { useData } from '../contexts/DataContext'

export const WelcomePage = () => {
    const { fetchUserDetail, userInfo } = useData()
    
    useEffect(() => {
        fetchUserDetail()
    }, [])

  return (
    <div id='signup' data-aos="zoom-up">
      <form action="">
        <h2><FcCheckmark /> Welcome... {userInfo.username}  </h2>
        <p>You can now Proceed to Notes Page:</p>
        <button><a href='/notes'> NOTES <FaLongArrowAltRight /></a></button>
      </form>
    </div>
  )
}
