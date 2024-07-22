// StudentProfile.jsx
import React from 'react';
import Header from './Header';

import { RiAccountCircleFill } from "react-icons/ri";
import { SiAdobeacrobatreader } from "react-icons/si";
import { MdFileDownload } from "react-icons/md";

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

      <div className='card rounded shadow-lg w-5/12 mt-8 h-80 border' style={{ marginLeft: '11.5rem' }}>
        <div className='flex flex-row gap-16 items-center border-b  p-3 m-3'>
          <div className='text-sm font-bold'>Name</div>
          <div className=' text-gray-500 ml-12'> IT Moodle dep</div>
        </div>
        <div className='flex flex-row gap-16 items-center border-b  p-3 m-3'>
          <div className='text-sm font-bold'>Email</div>
          <div className=' text-gray-500 ml-12'> moodle1@alfaisel.edu</div>
        </div>
        <div className='flex flex-row gap-10 items-center border-b  p-3 m-3'>
          <div className='text-sm font-bold'>Program</div>
          <div className=' text-gray-500 ml-12'> National</div>
        </div>
        <div className='flex flex-row gap-16 items-center border-b p-3 m-3'>
          <div className='text-sm font-bold'>Major</div>
          <div className=' text-gray-500 ml-12'> Southeast</div>
        </div>
        <div className='flex flex-row items-center p-3 m-3'>
          <div className='text-sm font-bold'>Resume</div>
          <div className="flex flex-row rounded text-black px-2 py-1 text-sm items-center justify-center ml-24 mr-6 p-1 border gap-1">
            <SiAdobeacrobatreader className=' w-4 h-4 text-red-800' />
            <button className="mx-1 text-sm text-gray-500" >
             click to download
            </button>
            <MdFileDownload className="w-4 h-4 text-green-500"/>
          </div>
          <div className="flex flex-row rounded bg-blue-950 text-white px-2 py-1 text-sm items-center justify-center mx-1">
            <button className="mx-3 my-1 text-xs" >
              UPDATE RESUME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
