import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Inventory(){
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const loggedIn = localStorage.getItem('loggedIn');
      useEffect(()=>{
        if(!loggedIn){
          navigate('/login')
        }
      })
    return<>
    <div  className=" flex h-screen bg-[#e0edfa] font-sans overflow-hidden relative">
            <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <TopBar setSidebarOpen={setSidebarOpen}/>
                <div className="h-full" onClick={() =>setSidebarOpen(false)}>
                    <h1>Inventory</h1>
                </div>
            </div>
    </div>
    </>
}