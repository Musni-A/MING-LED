import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { createBrowserRouter, Routes, Route, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/componants/registerUserPage.jsx';
import LoginPage from './pages/loginPage.jsx';
import Employee from './pages/employee.jsx';
import Inventory from './pages/inventory.jsx';
import Reports from './pages/reports.jsx';
import Attendance from './pages/attendance.jsx';
import Settings from './pages/settings.jsx';
import UserProfile from './pages/userProfile.jsx';
import FinishedGoods from './pages/finishedGoods.jsx'
import WideTableComponent from './pages/componants/deliverProduct.jsx';
import NotFoundAnimated from './pages/componants/notFound.jsx';

const router = createBrowserRouter([
  {
    path : '/registerEmpoloyee',
    element : <RegisterPage/>
  },
  {
    path : '/',
    element : <LoginPage/>
  },
  {
    path : '/finishedGoods',
    element : <FinishedGoods/>
  },
  {
    path : '/employee',
    element : <Employee/>
  },
  {
    path : '/inventory',
    element : <Inventory/>
  },
  {
    path : '/reports',
    element : <Reports/>
  },
  {
    path : '/Attendance',
    element : <Attendance/>
  },
  {
    path : '/settings',
    element : <Settings/>
  },
  {
    path : '/profile',
    element : <UserProfile/>
  },
  {
    path: '*',  // This catches all undefined routes
    element: <NotFoundAnimated />
  }
])

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>,
)
