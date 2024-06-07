import React from 'react';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import SignInButton from './components/SignInButton';
import ProtectedComponent from './components/ProtectedComponent';
import { useIsAuthenticated } from '@azure/msal-react';

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div>
      {!isAuthenticated ? (
        <SignInButton />
      ) : (
        <>
          <ProtectedComponent />
          {/* <AdminDashboard /> */}
          {/* <StudentDashboard /> */}
        </>
      )}
    </div>
  );
}

export default App;
