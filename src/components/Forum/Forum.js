import React from 'react'

export const Forum = () => {
  return (
    <>
    <div>
        <h1>We're building a Forum and here, we're building with your idea/suggestion!</h1>
        <h1>Use the Form below to mail us your idea or suggestion or just fill in your mail address to join the Waitlist</h1>
    </div>
    <div>
        <form action="">
            <input type="email" placeholder='enter your mail'/>
            <input type="submit" value="Join the Waitlist!"/>
        </form>
        <form action="">
            <input type="text" placeholder='Enter your Full name'/>
            <input type="text" placeholder='Department'/>
            <input type="text" placeholder='Title of Message'/>
            <textarea placeholder='Title of Message'/>
        </form>
    </div>
    </>
  )
}
