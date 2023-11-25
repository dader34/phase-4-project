// ErrorPage.js

import React from 'react';
import '../STYLING/ErrorPage.css';
import {Link} from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-header">
          <img src="/birdnoise.png" alt="BirdNoise Logo" className="logo" />
          <h1>Something went wrong</h1>
        </div>
        <p>We're sorry, but there was an error. Please try again later.</p>
        <Link to="/home" className="back-link">Go back to BirdNoise</Link>
      </div>
    </div>
  );
};

export default ErrorPage;
