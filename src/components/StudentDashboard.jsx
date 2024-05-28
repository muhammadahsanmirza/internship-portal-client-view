import React from 'react'
import Sidebar from './Sidebar'
import Section from './Section'
function StudentDashboard() {
  return (
    <div className="flex h-screen">
        <Sidebar/>
        <Section/>
    </div>
  )
}

export default StudentDashboard
