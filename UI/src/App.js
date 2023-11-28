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
        if(!(UID && JWT && !(location.pathname === '/'))){
            nav('/')
            //Re route if not authenticated
        }else{
            if(UID && JWT){
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
            }
        }
    },[location.pathname])

    return(
        <div>
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