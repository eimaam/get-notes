import React, { useState } from 'react'
import { useEffect } from 'react';
import { PuffLoader } from 'react-spinners';
import { useAuth } from '../../contexts/AuthContext';

export const DailyQuotes = () => {
  const {loading, setLoading} = useAuth()
    const random = Math.floor(Math.random() * (1643-1) - 1);
    const [data, setData] = useState([])
    

      const getQuote = async () => {
        const data = await fetch('https://type.fit/api/quotes/')
        .then(res => res.json())
        .then(data => setData(prevState => data))
        setLoading(false)
      }

      useEffect(() => {
        getQuote()
      }, [])

  return (
    <div className='quotes--section' data-aos="fade-up">
        <div>
            <h2>DAILY QUOTES</h2>
            <hr />
        </div>
        {loading ? <PuffLoader /> :
        <div id='quotes'>
            <div className='quote--card' data-aos="zoom-up">
                <p>"{data[random].text}"</p>
                <i>{data[random].author == "" ? "ANON" : data[random].author}</i>
            </div>
            <div className='quote--card' data-aos="zoom-up">
                <p>"{data[random+1].text}"</p>
                <i>{data[random+1].author == "" ? "ANON" : data[random+1].author}</i>
            </div>
            <div className='quote--card' data-aos="zoom-up">
                <p>"{data[random+2].text}"</p>
                <i>{data[random+2].author == "" ? "ANON" : data[random+2].author}</i>
            </div>
        </div>
        }
        <div style={{margin:"auto", textAlign: "center"}}>
            <p><i>Light your day with more quotes from our super App:</i></p>
            <button><a href="https://getquotes.eimaam.dev" target="_blank">getQUOTES</a></button>
        </div>

    </div>
  )
}
