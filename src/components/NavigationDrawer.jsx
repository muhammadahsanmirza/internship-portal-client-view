import React from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { BsFillMortarboardFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

function NavigationDrawer({ isOpen, onClose }) {
    return (
        <div
            className={`fixed top-0 left-20 w-52  h-full bg-white z-10 shadow-lg transform transition-transform ease-in-out duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full hidden"
                }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex flex-row p-1 border-b-2">
                    <div className="flex flex-col h-14" style={{ padding: '0.28em' }}>
                        <h2 className="font-bold">College of Engineering</h2>
                        <h2 className="font-bold">Internship</h2>
                    </div>
                    <button className="text-xl" onClick={onClose}>
                        <IoIosArrowDropleftCircle />
                    </button>
                </div>
                <div className="flex-grow">
                    <div className="flex flex-col justify-between mt-1">
                        <div className="flex flex-row py-2 rounded-3xl justify-center items-center w-full hover:bg-slate-500">
                            <BsFillMortarboardFill className="mx-4" />
                            <button className="mx-4">Opportunities</button>
                        </div>
                        <div className="flex flex-row py-2 rounded-3xl justify-center items-center w-full hover:bg-slate-500">
                            <CgProfile className="mx-4" />
                            <button className="mx-4 text-center">Opportunities</button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-auto  border-t-2">
                    <button className=" pb-1 px-4 text-red-600 my-3" >Sign Out</button>
                </div>
            </div>
        </div>
    );
}

export default NavigationDrawer;
