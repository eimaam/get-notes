import React from 'react'
import { BsArrowRightCircleFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

export const ForumNav = () => {
  return (
    <div id='forumNav'>
        <h2>Channels:</h2>
        <ul>
            <li><Link to="/">🚀 100 Level General </Link></li>
            <li><Link to="/">🚀 200 Level General </Link></li>
            <li><Link to="/">🚀 300 Level General </Link></li>
            <li><Link to="/">🚀 400 Level General </Link></li>
            <li><Link to="/">🚀 500 Level General </Link></li>
            <li><Link to="/">🚀 Football</Link></li>
            <li><Link to="/">🚀 Sports - General </Link></li>
            <li><Link to="/">🚀 Politics</Link></li>
            <li><Link to="/">🚀 Music</Link></li>
            <li><Link to="/">🚀 Movies</Link></li>
            <li><Link to="/">🚀 Cryptocurrency</Link></li>
            <li><Link to="/">🚀 Economy</Link></li>
            <li><Link to="/">🚀 Business</Link></li>
        </ul>
        <button>Suggest additional Channel</button>
    </div>
  )
}
