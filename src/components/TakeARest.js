import React, { useEffect } from 'react'

export const TakeARest = (props) => {
    useEffect(() => {
      
        props.showNav(false)

    }, [])

    const GameCard = (props) => {
        return <div className='game--card'>
                    {props.gameLink}
                    <h3>{props.gameTitle}</h3>
                    <p>{props.desc}</p>
                </div>
        }
                        
  return (
    <div id='games'>
        <div className='title'>
            <h1>Take-A-Rest</h1>
            <h2>Welcome to our Game Channels</h2>
            <p>As you've decided to take a rest, we selected some perfect games for you!   </p>
            <p>Don't let them get you carried away though 😅 </p>
        </div>
        <div className='games--section'>
            <div>
                {/* <GameCard 
                gameLink={<iframe width="560" height="315" allow="fullscreen; autoplay; encrypted-media" src="https://play.idevgames.co.uk/embed/galactic-wars" frameborder="0" allowfullscreen="true" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerpolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">Browser not compatible.</iframe>}
                gameTitle="Galactic Wars"
                desc="Destroy all the enemies, collect energy capsules to upgrade your ship and face the destroyer galactus x without being destroyed to save our planet. Use Z to shoot and cursor keys to move"
                /> */}
                <GameCard 
                gameLink={<iframe width="560" height="315" allow="fullscreen; autoplay; encrypted-media" src="https://games.construct.net/1463/latest" frameborder="0" allowfullscreen="true" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerpolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">
                            </iframe>}
                gameTitle="Red Tie Runner"
                desc=""
                />
                <div className='game--card'>
                    <iframe width="560" height="315" allow="fullscreen; autoplay; encrypted-media" src="https://games.construct.net/904/latest" frameborder="0" allowfullscreen="true" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerpolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">
                    </iframe>
                    <h3>Pixel Bear Adventure </h3>
                </div>
            </div>
            <div>
                <div className='game--card'>
                    <iframe width="560" height="315" allow="fullscreen; autoplay; encrypted-media" src="https://games.construct.net/82/latest" frameborder="0" allowfullscreen="true" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerpolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">
                    </iframe>
                    <h3>Tank Trouble 2</h3>
                </div>
                <div className='game--card'>
                    <iframe width="560" height="315" allow="fullscreen; autoplay; encrypted-media" src="https://games.construct.net/82/latest" frameborder="0" allowfullscreen="true" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerpolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">
                    </iframe>
                </div>
            </div>
        </div>
    </div>
  )
}
