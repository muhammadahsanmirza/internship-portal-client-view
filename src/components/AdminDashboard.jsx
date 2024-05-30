import React, { useState, useEffect } from 'react'

import Sidebar from './Sidebar'
import EditAndViewOpportunities from './EditAndViewOpportunities'

function AdminDashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <EditAndViewOpportunities/>

    </div>
  )
}

export default AdminDashboard
