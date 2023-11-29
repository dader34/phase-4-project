import { useState,useEffect } from "react";
import { Outlet,useLocation } from 'react-router-dom'
import NavBar from "./Common/NavBar";
import {useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


const App = () =>{
    const isDark = useState(false)
    const location = useLocation()
    const nav = useNavigate()

    useEffect(()=>{
        const UID = localStorage.getItem("UID")
        const JWT = localStorage.getItem("JWT")
        if(!(UID || JWT) && !((location.pathname === '/') || (location.pathname.startsWith('/home/post')))){
            toast.error("Please log in")
            nav('/')
            //Re route if not authenticated
        }else{
            !((location.pathname.startsWith('/home/post')) || (location.pathname === ('/'))) ?
            UID && JWT? 
                fetch("http://127.0.0.1:5555/auth",{
                    headers:{
                        "Authorization": `Bearer ${JWT}`
                    }
                })
                .then(resp => resp.json())
                .then(data => {
                    if(!(data && data.success)){
                        nav('/')
                        toast.error("Your session has expired, please log in again")
                    }
                })
                : nav('/')
            : console.log("1232113")
        }
    },[location.pathname])

    return(
        <div>
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
            {location.pathname.startsWith('/home') && (<NavBar />)}
            <div className="outlet">
                <Outlet />
            </div>
        </div>
    )
}
export default App;