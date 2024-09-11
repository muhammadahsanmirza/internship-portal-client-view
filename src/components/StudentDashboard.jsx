// StudentDashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function StudentDashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default StudentDashboard;
