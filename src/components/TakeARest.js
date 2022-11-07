    import React, { useEffect } from 'react'
    import {FaArrowCircleUp} from "react-icons/fa"
    import FootNote from './LandingPage/FootNote'

    export const TakeARest = (props) => {

        // game cards design component
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
                <h2>Welcome to our Games Channel</h2>
                <p>Here are few perfectly selected games for your resting pleasure! </p>
                <p>Don't let them get you carried away though 😅 </p>
            </div>
            <div className='games--section'>
                {/* <GameCard 
                gameLink={<iframe  allow="fullscreen; encrypted-media" src="https://play.idevgames.co.uk/embed/galactic-wars" frameBorder="0" allowFullScreen="true" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerPolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">Browser not compatible.</iframe>}
                gameTitle="Galactic Wars"
                desc="Destroy all the enemies, collect energy capsules to upgrade your ship and face the destroyer galactus x without being destroyed to save our planet. Use Z to shoot and cursor keys to move"
                /> */}
                <GameCard 
                    gameLink={<iframe allowFullScreen="true" allow="fullscreen; encrypted-media" src="https://games.construct.net/1463/latest" frameBorder="0" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerPolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">
                                </iframe>}
                    gameTitle="Red Tie Runner"
                    desc="Use arrow keys to navigate and get credits"
                />
                <GameCard 
                    gameLink={<iframe allowFullScreen="true" allow="fullscreen;  encrypted-media" src="https://games.construct.net/904/latest" frameBorder="0" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerPolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">
                            </iframe>}
                    gameTitle="Pixel Bear Adventure"
                    desc=""
                />
                <GameCard 
                    gameLink={<iframe  allowFullScreen="true" allow="fullscreen;  encrypted-media" src="https://games.construct.net/20988/latest" frameBorder="0" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerPolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">
                        </iframe>}
                    gameTitle="Mountain Bike Runner"
                    desc="Use arrow keys Up & Down to Move forward or backward respectively and arrow keys back and forward to balance"
                />
                
                <GameCard 
                    gameLink={<iframe allowFullScreen="true" allow="fullscreen;  encrypted-media" src="https://games.construct.net/82/latest" frameBorder="0" msallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowpaymentrequest="false" referrerPolicy="unsafe-url" sandbox="allow-same-origin allow-forms allow-scripts allow-pointer-lock allow-orientation-lock allow-popups" scrolling="no">
                        </iframe>}
                    gameTitle="Tank Trouble 2"
                    desc="Use arrow keys to navigate and get to top of the Score Table"
                />
                <div>
                    <h2>Adding more Games to the Channel soon!</h2>
                </div>
                <div>
                    <button><a href="/notes"> Go back to NOTES</a></button>
                </div>
                <FootNote />
            </div>
        </div>
    )
    }
