import NavBar from "./navBar";
import { useEffect, useState } from "react";
import TopBar from "./topBar";
import { Link, useNavigate } from "react-router-dom";
import FinishingGoods from "./componants/finishingGoods";
import WideTableComponent from "./componants/deliverProduct";


export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeliveryHistory, setShowDeliveryHistory] = useState('hidden');
  const navigate = useNavigate()
  const loggedIn = localStorage.getItem('loggedIn');
  useEffect(()=>{
    if(!loggedIn){
      navigate('/')
    }
  })
  
  return<>
      <div className="flex sm:h-screen overflow-hidden bg-[#e0edfa] font-sans relative">
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col min-w-0">
              <TopBar setSidebarOpen={setSidebarOpen} />
              <div className="h-full overflow-y-scroll">
                <WideTableComponent showDeliveryHistory={showDeliveryHistory} setShowDeliveryHistory={setShowDeliveryHistory}/>
                <FinishingGoods showDeliveryHistory={showDeliveryHistory} setShowDeliveryHistory={setShowDeliveryHistory}/>
              </div>
          </div>
      </div>
    </>
  }