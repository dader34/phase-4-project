import { useState,useEffect } from "react";
import { Outlet,useLocation } from 'react-router-dom'
import NavBar from "./Common/NavBar";
import {useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './STYLING/NavBar.css'
import './STYLING/PostCard.css'

const App = () =>{
    const [isDark, setIsDark] = useState(false)
    const [isAuth,setIsAuth] = useState(false)
    const location = useLocation()
    const UID = localStorage.getItem("UID")
    const JWT = localStorage.getItem("JWT")
    const nav = useNavigate()

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

    // useEffect(()=>{
    //     if(!(UID || JWT) && !((location.pathname === '/') || (location.pathname.startsWith('/home/post')))){
    //         console.log(location.pathname)
    //         toast.error("Please log in")
    //         nav('/')
    //         //Re route if not authenticated
    //     }else{
    //         !((location.pathname.startsWith('/home/post')) || (location.pathname === ('/'))) ?
    //         UID && JWT? 
    //             fetch("http://127.0.0.1:5555/auth",{
    //                 headers:{
    //                     "Authorization": `Bearer ${JWT}`
    //                 }
    //             })
    //             .then(resp => resp.json())
    //             .then(data => {
    //                 if(!(data && data.success)){
    //                     nav('/')
    //                     toast.error("Your session has expired, please log in again")
    //                 }
    //             })
    //             : nav('/')
    //         : console.log("1232113")
    //     }
    // },[location.pathname,JWT,UID,nav])

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
            {location.pathname.startsWith('/home') && (JWT && UID)&&(<NavBar toggleDarkMode={toggleDarkMode} />)}
            <div className="outlet">
                <Outlet />
            </div>
        </div>
    )
}
export default App;