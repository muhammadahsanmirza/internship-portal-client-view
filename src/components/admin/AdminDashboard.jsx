import {Sidebar} from '../index.js'
import { Outlet } from 'react-router-dom'
function AdminDashboard() {
  console.log('Admin Dashboard');
  return (
    <div className="flex sm:flex-row h-screen">
      <Sidebar />
      <Outlet/>
    </div>
  )
}

export default AdminDashboard
