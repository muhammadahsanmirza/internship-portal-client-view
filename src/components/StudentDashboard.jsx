// StudentDashboard.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Section from './Section';
import { useSelector } from 'react-redux';
import StudentProfile from './StudentProfile';

function StudentDashboard({ idToken }) {
  const currentUserView = useSelector((state) => state.studentView.currentView); // Correct state access

  return (
    <div className="flex h-screen sm">
      <Sidebar />
      {currentUserView === 'Opportunities' ? (
        <Section idToken={idToken} />
      ) : (
        <StudentProfile />
      )}
    </div>
  );
}

export default StudentDashboard;
