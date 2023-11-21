import React, { useState } from 'react';
import '../STYLING/Modal.css';

const SignInModal = ({ onClose, onSignIn }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    // TODO: Check if the user exists in your database
    const userExists = true; // Mock response

    if (userExists) {
      setStep(2);
    } else {
      setError('Username does not exist');
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    // TODO: Check the user's credentials against your database
    const isValidCredentials = true; // Mock response

    if (isValidCredentials) {
      onSignIn(); // Call the onSignIn function provided by the parent component
      onClose(); // Close the modal
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <div className="modalHeader">
          <img src="/Flatironschool.jpg" alt="Flatiron School Logo" className="modalIcon" />
          <button onClick={onClose} className="closeButton">&times;</button>
        </div>
        <div className="modalBody">
          {step === 1 && (
            <form onSubmit={handleUsernameSubmit}>
              <h2>Sign in to BirdNoise</h2>
              <label htmlFor="username" className="helperText">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className={`modalInput ${error ? 'inputError' : ''}`}
              />
              {error && <div className="errorText">{error}</div>}
              <button type="submit" className="modalButton">Next</button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleSignIn}>
              <h2>Welcome back!</h2>
              <label htmlFor="password" className="helperText">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`modalInput ${error ? 'inputError' : ''}`}
              />
              {error && <div className="errorText">{error}</div>}
              <button type="submit" className="modalButton">Sign in</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
 