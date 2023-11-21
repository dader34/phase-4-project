import React, { useState } from 'react';
import SignInModal from './auth/SignInModal';
import SignUpModal from './auth/SignUpModal';
import Feed from './feed/FISFeed'; // Assuming Feed component is FISFeed.js
import NavBar from './Common/NavBar';
import HomePage from './pages/HomePage';
import AfterSignup from './auth/AfterSignup';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setShowSignInModal(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setShowSignUpModal(false);
  };

  return (
    <div className="App">
      <NavBar onSignOut={handleSignOut} />
      {isAuthenticated ? (
        <HomePage
          onSignIn={() => setShowSignInModal(true)} // This should trigger the modal
          onCreateAccount={() => setShowSignUpModal(true)}
        />
      ) : (
        <AfterSignup />
      )}

      {/* Check if showSignInModal is true, then render the SignInModal */}
      {showSignInModal && (
        <SignInModal onClose={() => setShowSignInModal(false)} onSignIn={handleSignIn} />
      )}

      {showSignUpModal && (
        <SignUpModal onClose={() => setShowSignUpModal(false)} onSignUp={handleSignUp} />
      )}
    </div>
  );
};

export default App;
