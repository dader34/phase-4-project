import { useState,useEffect } from "react";
import { Outlet,useLocation } from 'react-router-dom'
import NavBar from "./Common/NavBar";
import { Toaster } from 'react-hot-toast';
import './STYLING/NavBar.css'
import './STYLING/PostCard.css'

const App = () =>{
    const [isDark, setIsDark] = useState(false)
    const location = useLocation()

    // Check dark mode preference from localStorage on initial load
    useEffect(() => {
        const darkModePreference = localStorage.getItem('darkMode') === 'enabled';
        setIsDark(darkModePreference);
    }, []);

    // Toggle dark mode
    const toggleDarkMode = () => { 
        //find html tag and apply darkmode class
        document.querySelector('html').classList.toggle('dark-mode');
        setIsDark(!isDark);
    };

    // Update localStorage when dark mode changes
    useEffect(() => {
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    }, [isDark]);

    return(
        <div className={`app-container ${isDark ? 'dark-mode' : ''}`}>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
            <div><Toaster toastOptions={{
            error: {
                duration: 3000,
                theme: {
                    primary: 'green',
                    secondary: 'black',
                },
            }
            }}/></div>
            {location.pathname.startsWith('/home') && (<NavBar toggleDarkMode={toggleDarkMode} />)}
            <div className="outlet">
                <Outlet />
            </div>
        </div>
    )
}
export default App;