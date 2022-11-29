import React from 'react'
import { BeatLoader, MoonLoader } from 'react-spinners'

export const FullscreenLoader = () => {
    const myStyle = {
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
  return (
    <div style={myStyle}>
        <BeatLoader />
    </div>
  )
}
