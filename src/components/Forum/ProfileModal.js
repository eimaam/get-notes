import { collection, onSnapshot, query, where } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import dummy from "../../assets/error.jpg"
import { useData } from '../../contexts/DataContext'
import { database } from '../../firebaseConfig'

export const ProfileModal = ({username, level, department, handleClick}) => {

  return (
    <div className='profile--card'>
        <div>
            <img src={dummy} alt="" />
        </div>
        <div>
            <h4>@{username}</h4>
            <p>{level}</p>
            <p>{department}</p>
        </div>
        <div>
            <button style={{backgroundColor: "red"}} onClick={handleClick}>CLOSE</button>
        </div>
    </div>
  )
}
