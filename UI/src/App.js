import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from "./Common/NavBar";
import { Toaster } from 'react-hot-toast';
import './STYLING/NavBar.css';
import './STYLING/PostCard.css';

const App = () => {
    const [isDark, setIsDark] = useState(() => {
        const darkModePreference = localStorage.getItem('darkMode') === 'enabled';
        return darkModePreference;
    });
    const location = useLocation();

    // Apply dark mode class to HTML element based on initial state
    useEffect(() => {
        document.querySelector('html').classList.toggle('dark-mode', isDark);
    }, [isDark]);

    const toggleDarkMode = () => {
        const newDarkModeValue = !isDark;
        setIsDark(newDarkModeValue);
        localStorage.setItem('darkMode', newDarkModeValue ? 'enabled' : 'disabled');
    };

    return (
        <div className={`app-container ${isDark ? 'dark-mode' : ''}`}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div>
                <Toaster toastOptions={{
                    error: {
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    }
                }} />
            </div>
            {location.pathname.startsWith('/home') && (<NavBar toggleDarkMode={toggleDarkMode} />)}
            <div className="outlet">
                <Outlet context={[isDark]}/>
            </div>
        </div>
    );
};

export default App;
