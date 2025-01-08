import React, { useState, useEffect, useRef } from 'react'
import BotanicaLogo from '../../assets/BotanicaLogo.png'
import SearchIcon from '../../assets/search_icon.svg'
import CartIcon from '../../assets/cart_icon.png'
import GardenIcon from '../../assets/garden_icon.png'
import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', closeMenu);
        return () => {
            document.removeEventListener('mousedown', closeMenu);
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    }

    const closeMenu = (e) => {
        if(menuRef.current && !menuRef.current.contains(e.target) && e.target !== hamburgerRef.current) {
            setIsOpen(false);
        }
    }

    const onMenuClick = (path) => {
        toggleMenu();
        navigate(path);
    }

    return (
    <div className='navBar-sticky'>
        <div className='navBar-container'>
            <div className='navBar-menu navBar-left'>
                <button className='navBar-hamburger' onClick={toggleMenu} ref={hamburgerRef}>☰</button>
                <ul className={`navBar-links ${isOpen ? 'open' : ''}`} ref={menuRef}>
                    <li onClick={() => onMenuClick('/')}><p>Plant List</p></li>
                    <li onClick={() => onMenuClick('/settings')}><p>Settings</p></li>
                </ul>
            </div>
            <div className='navBar-image-wrapper navBar-center'>
                <img src={BotanicaLogo} onClick={() => navigate('/')} alt="Botanica Logo"/>
            </div>
            <div className='navBar-right'>
                <Link to={'/myGarden'}>
                    <img src={GardenIcon} className="navBar-gardenIcon" alt="Garden Icon"/>
                </Link>
                <Link to={'/cart'}>
                    <img src={CartIcon} className="navBar-cartIcon" alt="Cart Icon"/>
                </Link>
                <img src={SearchIcon} className="navBar-searchIcon" alt="Search Icon"/>
            </div>
        </div>
        <hr style={{marginTop: '0.5rem'}}/>
    </div>
    );

}

export default NavBar;