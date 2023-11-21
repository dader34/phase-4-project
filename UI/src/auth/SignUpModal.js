import React, { useState } from 'react';
import '../STYLING/Modal.css';

const SignUpModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);

  const handleSignUpDetails = (e) => {
    e.preventDefault();
    // Validation logic can be added here
    setStep(2);
  };

  const handleConfirmationChange = (e) => {
    setDetailsConfirmed(e.target.checked);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Actual sign-up logic will go here
    // Placeholder for now
    console.log('Sign Up confirmed with: ', { name, phoneOrEmail });
    onClose(); // Close the modal after sign up
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
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="modalInput"
                placeholder="Name"
              />
              <input
                id="phoneOrEmail"
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                required
                className="modalInput"
                placeholder="Phone or email"
              />
              <button type="submit" className="modalButton">Next</button>
            </form>
          )}
          {step === 2 && (
            <div>
              <h2>Step 2 of 2</h2>
              <p>Please confirm your details and proceed to create your account.</p>
              <ul>
                <li>Name: {name}</li>
                <li>Phone or Email: {phoneOrEmail}</li>
              </ul>
              <label>
                <input
                  type="checkbox"
                  checked={detailsConfirmed}
                  onChange={handleConfirmationChange}
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



