import React, { useState } from 'react'
import { useEffect } from 'react';
import { PuffLoader } from 'react-spinners';
import { useAuth } from '../../contexts/AuthContext';
import { quotesData } from './quotesData';

export const DailyQuotes = () => {
  const random = Math.floor(Math.random() * (247-1) - 1)

    

   

  return (
    <div className='quotes--section' data-aos="fade-up">
        <div>
            <h2>DAILY QUOTES</h2>
            <hr />
        </div>
        <div id='quotes'>
            <div className='quote--card' data-aos="zoom-up">
              <p>"{quotesData[random].text}"</p>
              <i>{quotesData[random].author == "" ? "ANON" : quotesData[random].author}</i>
            </div>
            <div className='quote--card' data-aos="zoom-up">
              <p>"{quotesData[random+1].text}"</p>
              <i>{quotesData[random+1].author == "" ? "ANON" : quotesData[random+1].author}</i>
            </div>
            <div className='quote--card' data-aos="zoom-up">
              <p>"{quotesData[random+2].text}"</p>
              <i>{quotesData[random+2].author == "" ? "ANON" : quotesData[random+2].author}</i>
            </div>
        </div>
        <div style={{margin:"auto", textAlign: "center"}}>
            <p><i>Light your day with more quotes from our super App:</i></p>
            <button><a href="https://getquotes.eimaam.dev" target="_blank">getQUOTES</a></button>
        </div>
    </div>
  )
}
