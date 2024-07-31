import React, { useState } from 'react';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { MdViewHeadline } from "react-icons/md";
import NavigationDrawer from './NavigationDrawer';

function Sidebar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            {/* Sidebar for large screens */}
            <div className="hidden sm:flex flex-col w-20 justify-center h-screen max-h-screen border-r-2 border-gray-300 z-10 fixed top-0 left-0 sm:w-20">
                <div className='mb-auto border-b-2 border-gray-300' style={{ height: '66px' }}>
                    <img className='fixed top-1 left-2 w-14 h-14' src="/InternshipPortalLogo.png" alt="Logo" />
                    {!isDrawerOpen &&
                        <button className='text-xl fixed top-5 left-16' onClick={toggleDrawer}><IoIosArrowDroprightCircle /></button>
                    }
                </div>
                <div className='flex justify-center items-center mt-auto border-t-2'>
                    <div className='text-4xl my-2'>
                        <CgProfile />
                    </div>
                </div>
            </div>

            {/* Sidebar for small screens */}
            <div className="sm:hidden bg-white p-2 h-12 border-b-2 border-gray-300 fixed top-0 left-0 right-0" onClick={toggleDrawer}>
                    <MdViewHeadline className='text-3xl ml-6' />
            </div>

            <NavigationDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
        </>
    );
}

export default Sidebar;
