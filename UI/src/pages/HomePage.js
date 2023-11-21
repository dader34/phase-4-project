import { useEffect, useState } from "react";
import SignInModal from "../auth/SignInModal";
import SignUpModal from "../auth/SignUpModal";
import {useNavigate} from 'react-router-dom';
import LogInSignUp from "./LogInSignUp";

const HomePage = () =>{
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const nav = useNavigate()

    const handleSignIn = () => {
        nav('/feed')
        setIsAuthenticated(true);
        setShowSignInModal(false);
    };

    const handleSignOut = () => {
        setIsAuthenticated(false);
    };

    const handleSignUp = () => {
        nav('/signup/complete')
        setIsAuthenticated(true);
        setShowSignUpModal(false);
    };
    useEffect(()=>{
        //Handle redirect if authenticated
    })

    return (
        <div className="HomePage">
        
            <LogInSignUp
            onSignIn={() => setShowSignInModal(true)} // This should trigger the modal
            onCreateAccount={() => setShowSignUpModal(true)}
            />

        {/* Check if showSignInModal is true, then render the SignInModal */}
        {showSignInModal && (
            <SignInModal onClose={() => setShowSignInModal(false)} onSignIn={handleSignIn} />
        )}

        {showSignUpModal && (
            <SignUpModal onClose={() => setShowSignUpModal(false)} onSignUp={handleSignUp} />
        )}
        </div>
    );
}
export default HomePage;