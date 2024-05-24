import React, { useState } from 'react';
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import NavigationDrawer from './NavigationDrawer';

function Sidebar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <div className={`w-20 flex flex-col justify-center h-screen max-h-screen border-r-2   border-gray-300  z-10 fixed top-0 left-0`}>
                <div className=' mb-auto  border-b-2 border-gray-300 ' style={{height:'66px'}}>
                    
                    <img className='fixed top-1 left-2  w-14 h-14' src="/InternshipPortalLogo.jpeg" alt="Logo" />
                    

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
            <NavigationDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
        </>
    );
}

export default Sidebar;

