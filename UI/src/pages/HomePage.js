// HomePage.js
import React from 'react';
import '../STYLING/HomePage.css';

const HomePage = ({ onSignIn, onCreateAccount }) => {
  return (
    <div className="HomePage">
      <div className="HomePage-content">
        <div className="HomePage-text">
          <div className="HomePage-header">
            <h1>Happening now</h1>
            <h2>Join today.</h2>
          </div>
          <button onClick={onCreateAccount} className="HomePage-create">
            Create account
          </button>
          <p>Already have an account?</p>
          <button onClick={onSignIn} className="HomePage-signin">
            Sign in
          </button>
        </div>
        <div className="HomePage-logo">
          <img src="/Flatironschool.jpg" alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
