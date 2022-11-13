import React from 'react'

export const ChatBubble = ({message, sender, time, date, className}) => {
  return (
    <div className={className === "sent" ? `chat--bubble--sent` : `chat--bubble--received`}>
        <i>{sender && `- @${sender}`}</i>
        <p>{message}</p>
        <i>{date} {time}</i>
    </div>
  )
}
