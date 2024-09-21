import React, {useState} from 'react';
import './navbar.css'
import { Link } from 'react-router-dom';
import logo from './logo.png'

function Navbar() {
    const [active , setActive] = useState("nav__menu");
    const [toggleIcon , setToggleIcon] = useState("nav__toggler"); 

    const navToggle = () =>{
        active === 'nav__menu' ? setActive('nav__menu nav__active') : setActive('nav__menu');

        toggleIcon === 'nav_toggler' ? 
        setToggleIcon('nav__toggler toggle')
        : setToggleIcon("nav__toggler")
    }


  return (
    <nav className='nav'>
      <div className="logo">
    <Link to="/adm" className="nav__brand" id='logo'><img src="" alt="" srcset="" /><img id='logo' src={logo} alt="" srcset="" /></Link>

      </div>
    <ul id='links' className={active}>




    </ul>
    {/* <div onClick={navToggle} className={toggleIcon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
    </div> */}
</nav>
  )
}

export default Navbar;