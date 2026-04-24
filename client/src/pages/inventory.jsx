import NavBar from "./navBar";
import TopBar from "./topBar";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import PartsList from "./componants/partsList";


export default function Inventory(){
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loggedIn = localStorage.getItem('loggedIn');
    useEffect(()=>{
      if(!loggedIn){
        navigate('/')
      }
    })

  return<>
  <Toaster/>
  <div className=" flex sm:h-screen bg-[#e0edfa] font-sans relative">
    <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    <div className="flex-1 flex flex-col min-w-0">
      <TopBar setSidebarOpen={setSidebarOpen}/>
      <div className="h-full flex justify-between overflow-y-auto"
        onClick={() => setSidebarOpen(false)}>
          <PartsList/>
      </div>
    </div>
  </div>
  </>
}