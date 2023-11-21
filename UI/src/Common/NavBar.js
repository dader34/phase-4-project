import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../STYLING/NavBar.css'

const NavBar = ({ onSignOut }) => {
  return (
  <div className='navbar'>
    <nav>
      <Link to='/'>Home</Link>
      <Link to='/logout'>Logout</Link>
      <Link to='/home/profile'>Profile</Link>
    </nav>
  </div>
  );
};

export default NavBar;
