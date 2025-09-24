import React, { useState, useEffect, useRef } from 'react';
import BotanicaLogo from '../../assets/BotanicaLogo.png';
import SearchIcon from '../../assets/search_icon.svg';
import CartIcon from '../../assets/cart_icon.png';
import GardenIcon from '../../assets/garden_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const hamburgerRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', closeMenuOnOutsideClick);
        return () => {
            document.removeEventListener('mousedown', closeMenuOnOutsideClick);
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const closeMenuOnOutsideClick = (e) => {
        if(menuRef.current && !menuRef.current.contains(e.target) && e.target !== hamburgerRef.current) {
            setIsOpen(false);
        }
    };

    const onMenuClick = (path) => {
        setIsOpen(false);
        navigate(path);
    };

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
                <img src={BotanicaLogo} onClick={() => navigate('/')} alt="Botanica written in light green in front of two monstera leaves all encompassed by a light green circle"/>
            </div>
            <div className='navBar-right'>
                <Link to={'/myGarden'}>
                    <img src={GardenIcon} className="navBar-gardenIcon" alt="Icon of a watering can over a small plant"/>
                </Link>
                <Link to={'/cart'}>
                    <img src={CartIcon} className="navBar-cartIcon" alt="Icon of a shopping cart"/>
                </Link>
                <img src={SearchIcon} className="navBar-searchIcon" alt="Search Icon"/>
            </div>
        </div>
        <hr style={{marginTop: '0.5rem'}}/>
    </div>
    );

};

export default NavBar;