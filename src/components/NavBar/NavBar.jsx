import React, { useState } from 'react'
import BotanicaLogo from '../../assets/BotanicaLogo.png'
import SearchIcon from '../../assets/search_icon.svg'
import './NavBar.css'

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    const navStyle = {
        width: '100%'
    }

    return (
        <div className='stickyNavBar'>
            <div className='navBar'>
                <div className='menu'>
                    <button className='hamburger' onClick={toggleMenu}>☰</button>
                    <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                        <li><a href="#plantList">Plant List</a></li>
                        <li><a href="#myGarden">My Garden</a></li>
                        <li><a href="#settings">Settings</a></li>
                    </ul>
                </div>
                <div className='image-wrapper'>
                    <img src={BotanicaLogo}/>
                </div>
                <div style={{textAlign: 'right'}}>
                    <img src={SearchIcon} className="searchIcon"/>
                </div>
            </div>
            <hr/>
        </div>
    )
}

export default NavBar