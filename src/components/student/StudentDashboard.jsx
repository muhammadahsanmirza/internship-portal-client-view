import { Outlet } from 'react-router-dom';

import {Sidebar} from '../index.js';

function StudentDashboard() {
  console.log('Student Dashboard');
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default StudentDashboard;
