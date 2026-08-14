import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './pages/navBar';
import LoginPage from './pages/loginPage';

import Employee from './pages/employee';
import FinishedGoods from './pages/finishedGoods';
import Inventory from './pages/inventory';
import Reports from './pages/reports';
import UserProfile from './pages/userProfile';
import TopBar from './pages/topBar';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <NavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header with hamburger */}
          <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-semibold">MING-LED System</span>
            <div className="w-10" />
          </header>

          <TopBar />
          
          <main className="flex-1 overflow-y-auto">
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<Navigate to="/attendance" replace />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/finishedGoods" element={<FinishedGoods />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<UserProfile />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/attendance" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;