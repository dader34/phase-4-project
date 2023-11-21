import React, { useState } from 'react';
import '../STYLING/Modal.css';

const SignInModal = ({ onClose, onSignIn }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const userExists = true; // Mock response - You should check the username in your database here

    if (userExists) {
      setStep(2);
    } else {
      alert('Username does not exist');
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    // Check the username and password in your database here
    const isValidCredentials = true; // Mock response - You should validate the credentials against your database

    if (isValidCredentials) {
      onSignIn(); // Call the onSignIn function provided by the parent component (App) to set isAuthenticated to true
      onClose(); // Close the modal
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="signInModal">
      <div className="signInModalContent">
        <h2>Sign into FlatIronTweet</h2>
        {step === 1 && (
          <form onSubmit={handleUsernameSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username" // Add this line
            />
            <button type="submit">Next</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSignIn}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password" // Add this line
            />
            <button type="submit">Sign in</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignInModal;
