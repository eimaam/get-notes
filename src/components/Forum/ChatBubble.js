import React from 'react'

export const ChatBubble = ({message, sender, time, date, className, handleClick}) => {
  return (
    <div className={className === "sent" ? `chat--bubble--sent` : `chat--bubble--received`}>
        <i onClick={handleClick}>{sender && `- @${sender}`}</i>
        <p>{message}</p>
        <i>{date} @ {time}</i>
    </div>
  )
}
