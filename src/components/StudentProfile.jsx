// StudentProfile.jsx
import React from 'react';
import Header from './Header';
import { RiAccountCircleFill } from "react-icons/ri";
function StudentProfile() {
  const breadcrumbs = [
    { title: 'Opportunities', href: '/student/opportunities', isDisabled: false },
    { title: 'Student Profile', href: '#', isDisabled: true },
  ];

  return (
    <div className="w-[calc(100%-5rem)] ml-20 z-0">
      <Header breadcrumbs={breadcrumbs} />
      <div className="flex flex-row h-12 bg-blue-950 items-center ">
        <div className="text-gray-400 ml-36">
          <RiAccountCircleFill className=' w-10 h-8' />
        </div>
        <p className=' text-lg text-white font-bold'>Student Profile</p>
      </div>
      
      <div>
        <div>

        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
