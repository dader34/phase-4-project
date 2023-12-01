import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from './BackButton'; // Import the BackButton component
import '../STYLING/NavBar.css';

const NavBar = ({ toggleDarkMode }) => {
  const UID = localStorage.getItem("UID");
  return (
    <div className='navbar'>
      <nav>
        <BackButton /> {/* Add the BackButton here */}
        <Link to='/home'>Home</Link>
        <Link to='/'>Logout</Link>
        <Link to={`/home/profile/${UID}`}>Profile</Link>
        <button onClick={toggleDarkMode}>Dark Mode</button>
      </nav>
    </div>
  );
};

export default NavBar;
