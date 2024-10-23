import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

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
