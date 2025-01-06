import React, { useState } from 'react'
import BotanicaLogo from '../../assets/BotanicaLogo.png'
import SearchIcon from '../../assets/search_icon.svg'
import { Link } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className='stickyNavBar'>
            <div className='navBar'>
                <div className='menu'>
                    <button className='hamburger' onClick={toggleMenu}>☰</button>
                    <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
                        <li><Link to={'/'}>Plant List</Link></li>
                        <li><Link to={'/myGarden'}>My Garden</Link></li>
                        <li><Link to={'/settings'}>Settings</Link></li>
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