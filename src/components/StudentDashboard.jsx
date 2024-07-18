import React from 'react'
import Sidebar from './Sidebar'
import Section from './Section'
function StudentDashboard({idToken}) {
  return (
    <div className="flex h-screen sm">
        <Sidebar/>
        <Section idToken={idToken}/>
    </div>
  )
}

export default StudentDashboard
