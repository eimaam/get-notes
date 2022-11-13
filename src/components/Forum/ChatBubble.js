import React from 'react'

export const ChatBubble = ({message, sender, time, className}) => {
  return (
    <div className={className === "sent" ? `chat--bubble--sent` : `chat--bubble--received`}>
        <p>{message}</p>
        <i>{sender && `@${sender}`}</i>
        <i>{time}</i>
    </div>
  )
}
