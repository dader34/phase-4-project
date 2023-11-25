import { useState } from "react";
import { Outlet,useLocation } from 'react-router-dom'
import NavBar from "./Common/NavBar";
import HomePage from "./pages/HomePage";
import toast, { Toaster } from 'react-hot-toast';


const App = () =>{
    const isDark = useState(false)
    const location = useLocation()
    return(
        <div>
            <div><Toaster/></div>
            {location.pathname.startsWith('/home') && (<NavBar />)}
            <div className="outlet">
                <Outlet />
            </div>
        </div>
    )
}
export default App;