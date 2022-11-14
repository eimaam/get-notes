import React from 'react'
import dummy from "../../assets/error.jpg"

export const ProfileModal = ({username, level, department, handleClick}) => {

  return (
    <div className='profile--card'>
        <div>
            <img src={dummy} alt="" />
        </div>
        <div>
            <h4>@{username}</h4>
            <p>{level} Level</p>
            <p>{department}</p>
        </div>
        <div>
            <button style={{backgroundColor: "red"}} onClick={handleClick}>CLOSE</button>
        </div>
    </div>
  )
}
