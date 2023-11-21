import React, { useState } from 'react';
import '../STYLING/Modal.css';
import {useNavigate} from 'react-router-dom'

const SignUpModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate()

  const handleSignUpDetails = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (detailsConfirmed) {
      // Implement sign-up logic to store user in the database
      nav('/signup/complete')
      //Make Post req to backend, store tokens, and on after signup make patch to db for pfp and bio
      console.log('Sign Up confirmed with: ', { name, password });
      // onClose(); // Uncomment this line to close the modal after sign up
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
            <form onSubmit={handleSignUpDetails}>
              <h2>Create your account</h2>
              <label htmlFor="name" className="helperText">Username</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="modalInput"
              />
              <label htmlFor="password" className="helperText">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="modalInput"
              />
              <label htmlFor="confirmPassword" className="helperText">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`modalInput ${error ? 'inputError' : ''}`}
              />
              {error && <div className="errorText">{error}</div>}
              <button type="submit" className="modalButton">Next</button>
            </form>
          )}
          {step === 2 && (
            <div>
              <h2>Step 2 of 2</h2>
              <p>Please confirm your details and proceed to create your account.</p>
              <ul>
                <li>Username: {name}</li>
                {/* Do not display passwords for security reasons */}
              </ul>
              <label>
                <input
                  type="checkbox"
                  checked={detailsConfirmed}
                  onChange={(e) => setDetailsConfirmed(e.target.checked)}
                />
                Confirm Details
              </label>
              <button 
                onClick={handleSignUp} 
                className={`modalButton ${!detailsConfirmed ? 'buttonDisabled' : ''}`}
                disabled={!detailsConfirmed}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;