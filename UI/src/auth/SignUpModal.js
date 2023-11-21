import React, { useState } from 'react';
import '../STYLING/Modal.css';

const SignUpModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [error, setError] = useState('');

  // Regular expression to validate phone number (basic validation for example purposes)
  const validatePhone = (phone) => {
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    return phoneRegex.test(phone);
  };

  const handleSignUpDetails = (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setError('Invalid phone number. Please enter a valid number.');
      return;
    }
    // Clear any previous error messages
    setError('');
    setStep(2); // Transition to confirmation step
  };

  // Placeholder for actual sign up function
  const handleSignUp = (e) => {
    e.preventDefault();
    if (detailsConfirmed) {
      // Here you will handle the actual sign-up logic
      console.log('Sign Up confirmed with: ', { name, phone });
      onClose(); // Close the modal after sign up
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
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="modalInput"
                placeholder="Username"
              />
              <input
                id="phone"
                type="tel" // Change to "tel" to signify telephone input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={`modalInput ${error ? 'inputError' : ''}`}
                placeholder="Phone Number"
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
                <li>Name: {name}</li>
                <li>Phone: {phone}</li>
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
