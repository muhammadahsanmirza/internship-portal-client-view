import React from 'react'
import Sidebar from './Sidebar'
import EditAndViewOpportunities from './EditAndViewOpportunities'
import { Outlet } from 'react-router-dom'
function AdminDashboard() {
  return (
    <div className="flex sm:flex-row h-screen">
      <Sidebar />
      <Outlet/>
    </div>
  )
}

export default AdminDashboard
