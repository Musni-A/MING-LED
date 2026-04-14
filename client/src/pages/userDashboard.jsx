import NavBar from "./navBar";
import { useEffect, useState } from "react";
import TopBar from "./topBar";
import { Link, useNavigate } from "react-router-dom";
import DashboardContent from "./componants/dashBoard";


export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate()
  const loggedIn = localStorage.getItem('loggedIn');
  useEffect(()=>{
    if(!loggedIn){
      navigate('/')
    }
  })
  
  return<>
      <div className="flex h-screen overflow-hidden bg-[#e0edfa] font-sans">
      <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col min-w-0">
              <TopBar setSidebarOpen={setSidebarOpen} />
              <div className="h-full overflow-y-scroll flex justify-between"
                  onClick={() => setSidebarOpen(false)}>
                    <DashboardContent />
              </div>
          </div>
      </div>
    </>
  }