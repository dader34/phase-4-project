import React from 'react';
import { Link,useNavigate, } from 'react-router-dom';
import '../STYLING/NavBar.css'


const NavBar = ({ toggleDarkMode }) => {
  const UID = localStorage.getItem("UID")
  return (
  <div className='navbar'>
    <nav>
      <Link to='/home'>Home</Link>
      <Link to='/logout'>Logout</Link>
      <Link to={`/home/profile/${UID}`}>Profile</Link>
      <button onClick={toggleDarkMode}>Dark Mode</button>
    </nav>
  </div>
  );
};

export default NavBar;
