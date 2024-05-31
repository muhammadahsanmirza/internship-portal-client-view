import React from 'react'
import Sidebar from './Sidebar'
import EditAndViewOpportunities from './EditAndViewOpportunities'

function AdminDashboard() {
  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <Sidebar />
      <EditAndViewOpportunities />
    </div>
  )
}

export default AdminDashboard
