import NavBar from "./navBar";
import { useEffect, useState } from "react";
import TopBar from "./topBar";
import { Link, useNavigate } from "react-router-dom";
import RegisterPage from "./registerPage";
import UserList from './componants/userList'
import PartDetails from "./componants/partDeatails";


export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate()
  const loggedIn = localStorage.getItem('loggedIn');
  useEffect(()=>{
    if(!loggedIn){
      navigate('/login')
    }
  })
  

  return<>
      <div className="flex h-screen bg-[#e0edfa] font-sans">
      <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <TopBar setSidebarOpen={setSidebarOpen} />
              <div className="h-full flex justify-between"
                  onClick={() => setSidebarOpen(false)}>
                  <div className="h-full w-full overflow-y-auto flex flex-col gap-5 px-6 py-4"
                      onClick={() => setSidebarOpen(false)}>
                      <PartDetails/>
                  </div>
              </div>
          </div>
      </div>
    </>
  }